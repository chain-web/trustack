import { BUILDER_NAMES } from '@trustack/contract';
import { LifecycleStap, peerid, wait } from '@trustack/common';
import { bytes } from 'multiformats';
import type {
  ContractTransaction,
  TransactionPayload,
} from '../../mate/transaction.js';
import { Transaction } from '../../mate/transaction.js';
import { message } from '../../utils/message.js';
import { transDemoFn } from '../contracts/transaction_demo.js';
import type { BlockHeaderData } from '../../mate/block.js';
import { chainState } from '../state/index.js';
import {
  BLOCK_INTERVAL_TIME_LIMIT,
  DEFAULT_CU_LIMIT,
  MAX_TRANS_LIMIT,
  WAIT_TIME_LIMIT,
} from '../../config/index.js';
import type { BlockService } from '../ipld/blockService/blockService.js';
import type { Consensus } from '../consensus/index.js';
import { skCacheKeys } from '../skfs/key.js';
import { createEmptyStorageRoot, createRawBlock } from '../../mate/utils.js';
import type { Account } from '../../mate/account.js';
import { newAccount } from '../../mate/account.js';
import { Address } from '../../mate/address.js';
import { Contract } from '../contract/index.js';
import { tryParseJson } from '../../utils/utils.js';
import { accountOpCodes } from '../contract/code.js';
import {
  logClassPerformance,
  logPerformance,
} from '../../utils/performance.js';
import { PubsubTopic } from '../skfs/network.js';
import { genTransactionClass } from './trans.pure.js';

export interface TransactionOption {
  amount: Transaction['amount'];
  recipient: Transaction['recipient'];
  cuLimit?: Transaction['cuLimit'];
  payload?: Transaction['payload'];
}

export enum TransStatus {
  'transing' = 'transing',
  'waiting' = 'waiting',
  'transed' = 'transed',
  'err_tx' = 'err_tx',
}

export interface callContractResult {
  result?: string | object;
  cuCost?: bigint;
  transaction?: Awaited<ReturnType<TransactionAction['transaction']>>['trans'];
  error?: string;
}

// 处理交易活动
@logClassPerformance()
export class TransactionAction {
  constructor(blockService: BlockService, consensus: Consensus) {
    this.contract = new Contract();
    this.blockService = blockService;
    this.consensus = consensus;
  }

  private blockService: BlockService;
  private consensus: Consensus;

  private waitTransMap: Map<string, Map<number, Transaction>> = new Map();
  private transingArr: Transaction[] = [];
  private transQueue: Transaction[] = []; // 当前块可执行的交易队列
  private transTaskInterval?: NodeJS.Timeout;

  private contract: Contract;
  taskInProgress = false; // 是否正在执行智能合约\打包

  private breakNextBlock = false; // 是否中断下一个块的打包

  @logPerformance
  get status(): {
    transingArr: Transaction[];
    waitTransCount: number;
    waitTransMap: Map<string, Map<number, Transaction>>;
  } {
    let waitCount = 0;
    this.waitTransMap.forEach((v, _k) => {
      waitCount += v.size;
    });
    return {
      transingArr: this.transingArr,
      waitTransCount: waitCount,
      waitTransMap: this.waitTransMap,
    };
  }

  async init(): Promise<void> {
    chainState.lifecycleChange(LifecycleStap.initingTransaction);
    await this.initTransactionListen();
    await this.contract.init();
    // start block production if config is true
    chainState.getInitOption().moduleConfig.consensus!.blockProduction &&
      (await this.startTransTask());

    chainState.lifecycleChange(LifecycleStap.initedTransaction);
  }

  private async checkDoTransTask(): Promise<boolean> {
    if (!this.consensus.isReady()) {
      // 节点未同步完成
      return false;
    }
    if (this.waitTransMap.size === 0) {
      // 无交易
      return false;
    }
    const headerBlock = await this.blockService.getHeaderBlock();
    // TODO 这里用Date.now()是否会有问题？
    if (
      headerBlock &&
      headerBlock.header.ts + BLOCK_INTERVAL_TIME_LIMIT > Date.now()
    ) {
      // 当前块还未到达下一个块的时间
      return false;
    }
    return true;
  }

  private async startTransTask(): Promise<void> {
    // 检查是否要执行打包任务
    this.transTaskInterval = setTimeout(async () => {
      if (await this.checkDoTransTask()) {
        this.taskInProgress = true;
        await this.doTransTask();
        this.taskInProgress = false;
      }
      await this.startTransTask();
    }, 1000);
  }

  private async doTransTask(): Promise<void> {
    // 执行打包任务
    message.info('doTransTask');
    const cArr: { contribute: bigint; did: string }[] = [];
    for (const did of this.waitTransMap.keys()) {
      let account = await this.blockService.getAccount(did);
      if (!account) {
        // create new account
        account = newAccount(
          (await peerid.genetateDid()).id,
          await createEmptyStorageRoot(),
        );
        await this.blockService.addAccount(account);
      }
      cArr.push({
        contribute: account.contribute,
        did,
      });
    }
    const sortedArr = cArr.sort((a, b) =>
      a.contribute < b.contribute ? -1 : 1,
    );
    // message.info('sortedArr', sortedArr);
    // 在 sortedArr 按发起交易者的 contribute 来排序，加到当前块打包队列中
    sortedArr.forEach((ele) => {
      if (this.transingArr.length < MAX_TRANS_LIMIT) {
        const trans = this.waitTransMap.get(ele.did);
        if (!trans) {
          throw new Error('no cached trans');
        }
        Array.from(trans.keys()).forEach((one) => {
          // 为防止分叉，交易被发出WAIT_TIME_LIMIT时间后才会被打包
          // TODO 这里用Date.now()是否会有问题？
          if (Date.now() - one >= WAIT_TIME_LIMIT) {
            // 此处必定有one这个trans
            this.transingArr.push(trans.get(one)!);

            // GC
            trans.delete(one);
            if (trans.size === 0) {
              this.waitTransMap.delete(ele.did);
            }
          }
        });
      }
    });
    if (!this.transingArr.length) {
      // 如果没有可打包的交易，退出
      return;
    }
    // message.info('transingArr', this.transingArr);
    for (let index = 0; index < this.transingArr.length; index++) {
      const trans = this.transingArr[index];
      // 依次执行交易的合约
      if (trans.payload) {
        // 调用合约
        const account = await this.getContractAccountByTrans(
          trans as ContractTransaction,
        );

        const res = await this.runContractWidthStorage({
          caller: trans.from,
          contract: account.address,
          method: trans.payload.method,
          args: trans.payload.args,
          cuLimit: trans.cuLimit,
          storage:
            (await this.blockService.db.get(account.storageRoot.toString())) ||
            new Uint8Array(),
        });
        await this.blockService.nextBlock.addUpdates(
          trans,
          [
            {
              opCode: accountOpCodes.updateState,
              value: res.storage,
              account: account.address.did,
            },
          ],
          index,
        );
      } else {
        // 普通转账
        const update = await transDemoFn(
          {
            from: trans.from.did,
            recipient: trans.recipient.did,
            amount: trans.amount,
          },
          this.blockService.getExistAccount,
        );
        await this.blockService.nextBlock.addUpdates(trans, update, index);
      }
    }

    this.transingArr = [];
    // 生成新块
    const nextBlock = await this.blockService.nextBlock.commit();

    // 检查新快是否已经被接受
    if (!this.checkIsBreakTransTask()) {
      const headerBlock = await this.blockService.getHeaderBlock();
      if (headerBlock && nextBlock.header.parent === headerBlock.hash) {
        // 如果新块的父块和当前块相同，说明当前打包的是下一块,则生成新块

        // 清理当前打包中的交易
        this.transingArr = [];
      } else {
        message.error(
          'do trans task error',
          'nextBlock',
          nextBlock,
          'headerBlock',
          headerBlock,
        );
        // TODO 中断交易的情况下
        // 回退已经执行的trans

        return;
      }
    }
    // 广播新块
    await this.consensus.pubNewBlock(nextBlock);
    // 初始化下一个区块的ipld
    await this.blockService.goToNextBlock();
  }

  private async getContractAccountByTrans(
    trans: ContractTransaction,
  ): Promise<Account> {
    if (trans.payload.method === BUILDER_NAMES.CONSTRUCTOR_METHOD) {
      const storageRoot = await createEmptyStorageRoot();
      const codeArg = trans.payload.args[0];
      const codeRawBlock = await createRawBlock(bytes.fromHex(codeArg));
      await this.blockService.db.putRawBlock(codeRawBlock);
      const account = newAccount(
        trans.recipient.did,
        storageRoot,
        codeRawBlock.cid,
        trans.from.did,
      );
      await this.blockService.addAccount(account);
      return account;
    }
    const account = await this.blockService.getExistAccount(
      trans.recipient.did,
    );
    return account;
  }

  private async add(trans: Transaction) {
    await this.blockService.preLoadByTrans(trans);
    const hasedTrans = this.waitTransMap.get(trans.from.did);
    if (hasedTrans) {
      hasedTrans.set(trans.ts, trans);
    } else {
      const transMap = new Map();
      transMap.set(trans.ts, trans);
      this.waitTransMap.set(trans.from.did, transMap);
    }
  }

  /**
   * @description 查询一个tx的状态
   * @param tx
   * @param deep 从块头向下查询的区块数，默认为0，如果传Infinity会一直查到创世块
   * @returns
   */
  async transStatus(
    tx: string,
    deep?: bigint,
  ): Promise<{ status: TransStatus; block?: BlockHeaderData }> {
    if (deep === undefined) {
      deep = this.blockService.checkedBlockHeight;
    }
    let isWait = false;
    // search from waitTransMap
    this.waitTransMap.forEach((ele) => {
      ele.forEach((trans) => {
        if (trans.hash === tx) {
          isWait = true;
        }
      });
    });
    if (isWait) {
      return { status: TransStatus.waiting };
    }
    // search from transingArr
    if (this.transingArr.find((ele) => ele.hash === tx)) {
      return { status: TransStatus.transing };
    }
    // search from blocks
    const block = await this.blockService.findTxBlockWidthDeep(tx, deep);
    if (block?.header) {
      return { status: TransStatus.transed, block: block.header };
    }
    return { status: TransStatus.err_tx };
  }

  // 检查是否要继续执行打包操作
  private checkIsBreakTransTask(): boolean {
    return !this.breakNextBlock;
  }

  // 终止本次打包，可能是因为收到了广播出来的最新块，被调用
  stopThisBlock(): void {
    if (this.taskInProgress) {
      this.breakNextBlock = true;
    }
  }

  async handelTransaction(trans: Transaction): Promise<void> {
    // 处理接受到的或者本地发起的交易
    await this.add(trans);
  }

  private async initTransactionListen() {
    // 接收交易
    await this.consensus.network.subscribe(
      PubsubTopic.TRANSACTION,
      this.receiveTransaction.bind(this),
    );
  }

  private async receiveTransaction(data: Uint8Array) {
    // 接收p2p网络里的交易，并塞到交易列表
    const trans = await Transaction.fromBinary(data);
    await trans.genHash();
    message.info('receive trans from network');
    // verify signature
    const signature = trans.signature;
    if (
      signature &&
      (await peerid.verifyById(
        trans.from.did,
        signature,
        await trans.getSignatureData(),
      ))
    ) {
      // 交易签名验证通过
      await this.handelTransaction(trans);
    } else {
      message.info('receive trans illegal');
    }
  }

  async transaction(
    transMeta: TransactionOption,
  ): Promise<{ trans?: Transaction | undefined }> {
    // 供外部调用的发起交易方法
    const trans = await genTransactionClass(
      transMeta.amount,
      transMeta.recipient,
      await this.blockService.db.cacheGetExist(skCacheKeys.accountId),
      await this.blockService.db.cacheGetExist(skCacheKeys.accountPrivKey),
      transMeta.cuLimit || DEFAULT_CU_LIMIT,
      transMeta.payload,
    );

    if (trans) {
      message.info('send trans', trans.hash);
      await this.handelTransaction(trans);
      // pub to p2p network
      const transData = await trans.toCborBlock();
      await this.consensus.network.publish(
        PubsubTopic.TRANSACTION,
        transData.bytes,
      );
      return { trans };
    }
    return {};
  }

  async getContractCode(did: string): Promise<Uint8Array> {
    const contract = await this.blockService.getExistAccount(did);
    if (!contract.codeCid) {
      throw new Error('Address do not have contract');
    }
    const contractCode = await this.blockService.db.get(
      contract.codeCid.toString(),
    );
    if (!contractCode) {
      throw new Error('contract code not found at db');
    }
    return contractCode;
  }

  private async runContractWidthStorage(params: {
    caller: Address;
    contract: Address;
    method: string;
    args?: string[];
    cuLimit: bigint;
    storage: Uint8Array;
  }): Promise<{
    result: string | object;
    cuCost: bigint;
    storage: Uint8Array;
  }> {
    const contractCode = await this.getContractCode(params.contract.did);
    const result = await this.contract.runContract(contractCode, {
      cuLimit: params.cuLimit,
      method: params.method,
      storage: params.storage,
      args: params.args,
      sender: params.caller,
    });

    return {
      cuCost: BigInt(result.cuCost.reduce((a, b) => a + Number(b), 0)),
      result: tryParseJson(result.funcResult),
      storage: result.storage,
    };
  }

  // deploy contract
  async deploy(meta: {
    payload: Uint8Array;
  }): Promise<ReturnType<TransactionAction['transaction']>> {
    // TODO 要不要加update code 的接口
    const newDid = await peerid.genetateDid();

    return await this.transaction({
      amount: BigInt(0),
      recipient: new Address(newDid.id),
      payload: {
        method: BUILDER_NAMES.CONSTRUCTOR_METHOD,
        args: [bytes.toHex(meta.payload)],
      },
    });
  }

  async callContract(params: {
    contract: Address;
    amount: bigint;
    method: string;
    args?: TransactionPayload['args'];
    cuLimit?: bigint;
  }): Promise<callContractResult> {
    const account = await this.blockService.getAccount(params.contract.did);
    if (!account) {
      return {
        error:
          'account not found, please check contract address, and deploy at last 1 pre block it first',
      };
    }
    const storage = await this.blockService.db.get(
      account.storageRoot.toString(),
    );
    if (!storage) {
      return {
        error: 'storage not found, please check contract address',
      };
    }
    const { trans } = await this.transaction({
      amount: params.amount,
      recipient: params.contract,
      cuLimit: params.cuLimit,
      payload: {
        method: params.method,
        args: params.args || [],
      },
    });

    const res = await this.runContractWidthStorage({
      caller: new Address(
        await this.blockService.db.cacheGetExist(skCacheKeys.accountId),
      ),
      cuLimit: params.cuLimit || DEFAULT_CU_LIMIT,
      contract: params.contract,
      method: params.method,
      args: params.args,
      storage,
    });
    return {
      transaction: trans,
      cuCost: res.cuCost,
      result: res.result,
    };
  }
  async stop(): Promise<void> {
    while (this.taskInProgress) {
      await wait(100);
    }
    clearInterval(this.transTaskInterval);
    //  unbindTransactionListen
  }
}
