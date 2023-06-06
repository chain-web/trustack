import { LifecycleStap } from '@trustack/common';
import type { BlockMeta } from '../../../mate/block.js';
import { Block } from '../../../mate/block.js';
import { skCacheKeys } from '../../skfs/key.js';
import { StateRoot } from '../../../mate/mpts/stateRoot.js';
import type { Skfs } from '../../skfs/index.js';
import { chainState } from '../../state/index.js';
import { Account, newAccount } from '../../../mate/account.js';
import type { Transaction } from '../../../mate/transaction.js';
import {
  createCborBlock,
  createEmptyStorageRoot,
} from '../../../mate/utils.js';
import { Genesis } from '../../genesis/index.js';
import { message } from '../../../utils/message.js';
import { isTxInBlock } from './util.js';
import { BlockRoot } from './blockRoot.js';
import { NextBlock } from './nextBlock.js';
import { AccountCache } from './accountCache.js';
import { BlockBuffer } from './blockBuffer.js';

// 管理、已经存储的块索引
export class BlockService {
  constructor(
    db: Skfs,
    opts?: {
      blockRoot?: BlockRoot;
      stateRoot?: StateRoot;
    },
  ) {
    this.db = db;
    this.blockRoot = opts?.blockRoot || new BlockRoot();
    this.stateRoot = opts?.stateRoot || new StateRoot();
    this.accountCache = new AccountCache();
    this.blockBuffer = new BlockBuffer();
    this.genesis = new Genesis(this);
  }
  db: Skfs;
  // 创世配置
  private genesis: Genesis;
  blockRoot: BlockRoot;
  stateRoot: StateRoot;
  accountCache: AccountCache;
  blockBuffer: BlockBuffer;

  // 连续的已经验证通过的块高，在节点同步完成后是最新块
  checkedBlockHeight = 0n;

  private headerBlockNumber = 0n;

  // 在 transaction 之后初始化
  nextBlock!: NextBlock;

  getBlockByNumber = async (number: bigint): Promise<BlockMeta | undefined> => {
    const blockCid = await this.blockRoot.getBlockCidByNumber(number);
    if (blockCid) {
      const blockData = await this.db.get(blockCid);
      if (blockData) {
        const block = await Block.fromBinary(blockData);
        return block;
      }
    }
  };
  getHeaderBlock = async (): Promise<BlockMeta> => {
    const headerBlock = await this.getBlockByNumber(this.headerBlockNumber);
    if (!headerBlock) {
      throw new Error('header block not found');
    }
    return headerBlock;
  };

  addBlock = async (block: Block): Promise<void> => {
    if (block.header.number > 0n) {
      // check block
      const prevBlock = await this.getBlockByNumber(block.header.number - 1n);
      if (!this.checkOneBlock(block, prevBlock)) {
        throw new Error('checkOneBlock faild');
      }
      // update checked block
      if (block.header.number - 1n === this.checkedBlockHeight) {
        this.checkedBlockHeight = block.header.number;
        this.headerBlockNumber = block.header.number;
      }
    }
    // save block
    const blockData = await block.toCborBlock();
    await this.db.putCborBlock(blockData);
    await this.blockRoot.addBlockToRootNode(
      blockData.cid.toString(),
      block.header.number,
    );
    // TODO
    // await this.chain.pinService.pin(cid);
  };

  addAccount = async (account: Account): Promise<void> => {
    const accountBinary = await account.toCborBlock();
    await this.stateRoot.put(account.address.did, accountBinary.cid.toString());
    await this.db.putCborBlock(accountBinary);
    // TODO
    // await this.chain.pinService.pin(cid);
  };

  updateAccount = async (account: Account): Promise<void> => {
    const accountCborBlock = await account.toCborBlock();
    await this.stateRoot.put(
      account.address.did,
      accountCborBlock.cid.toString(),
    );
    await this.db.putCborBlock(accountCborBlock);
  };
  // /**
  //  * @description 添加或更新指定块的cid
  //  * @param cid
  //  * @param number
  //  */
  // addBlockCidByNumber = async (cid: string, number: bigint): Promise<void> => {
  //   const prevBlock = await this.getBlockByNumber(this.checkedBlockHeight);
  //   const blockData = await this.db.get(cid);
  //   if (!blockData) {
  //     throw new Error('can not find cid data');
  //   }
  //   const nextBlock = await Block.fromBinary(blockData);
  //   if (this.checkOneBlock(nextBlock, prevBlock)) {
  //     this.checkedBlockHeight = nextBlock.header.number;
  //   }
  //   await this.blockRoot.addBlockToRootNode(cid, number);
  //   // TODO
  //   // await this.chain.pinService.pin(cid);
  // };

  // 删除指定块及其之后的块
  deleteFromStartNUmber = async (number: bigint): Promise<void> => {
    // const deleted = await this.blockRoot.deleteFromStartNUmber(number);
    // await this.chain.pinService.unpinFromList(deleted);
  };

  // 是否完全冷启动
  needGenseis = (): boolean => {
    return this.headerBlockNumber === 0n;
  };

  init = async (): Promise<void> => {
    chainState.lifecycleChange(LifecycleStap.initingBlockService);
    await this.initGenseis();
    const rootCid = this.db.cacheGet(skCacheKeys['sk-block']);
    if (!rootCid) {
      throw new Error('block root cid not found');
    } else {
      await this.checkBlockRoot();
    }
    chainState.lifecycleChange(LifecycleStap.initedBlockService);
  };

  initGenseis = async (): Promise<void> => {
    await this.genesis.checkGenesisBlock();
  };

  checkBlockRoot = async (): Promise<void> => {
    let prevBlock = await this.getBlockByNumber(this.checkedBlockHeight);

    let checkeFinish = false;
    while (!checkeFinish) {
      chainState.lifecycleChange(LifecycleStap.checkingBlockIndex, [
        `${this.checkedBlockHeight.toString()}/${this.headerBlockNumber}`,
      ]);

      const checkBlock = await this.getBlockByNumber(
        this.checkedBlockHeight + 1n,
      );

      if (
        this.checkOneBlock(checkBlock, prevBlock) &&
        checkBlock?.header.number
      ) {
        this.checkedBlockHeight = checkBlock?.header.number;
      } else {
        checkeFinish = true;
        if (checkBlock) {
          //  check不通过，纠正数据, 删除错误块及其之后的块
          await this.deleteFromStartNUmber(this.checkedBlockHeight);
          chainState.lifecycleChange(LifecycleStap.checkedBlockIndex, [
            'checkedBlock: ',
            'delete after',
            this.checkedBlockHeight.toString(),
          ]);
        }
      }
      prevBlock = checkBlock;
    }

    chainState.lifecycleChange(LifecycleStap.checkedBlockIndex, [
      'checkedBlock: ',
      'delete after',
      this.checkedBlockHeight.toString(),
    ]);
  };

  // check two block is adjacent
  checkOneBlock = (
    block: Block | undefined,
    prev: Block | undefined,
  ): boolean => {
    if (!block || !prev) {
      return false;
    }
    if (block.header.parent !== prev.hash) {
      return false;
    }
    if (block.header.number !== prev.header.number + 1n) {
      return false;
    }
    return true;
  };

  // 检查收到的blockRoot与自己本地的是否一致
  // syncFromBlockRoot = async (blockRoot: string) => {
  //   lifecycleEvents.emit(LifecycleStap.syncingHeaderBlock, blockRoot);
  //   const newBlockRoot = new BlockRoot(this.chain.db);
  //   await newBlockRoot.init(blockRoot);
  //   const newHeaderBlock = await newBlockRoot.getHeaderBlock();
  //   let prevBlock = await this.getBlockByNumber(this.checkedBlockHeight);
  //   while (this.checkedBlockHeight.isLessThan(newHeaderBlock.header.number)) {
  //     // 逐个set的去把区块同步到本地
  //     const set = await newBlockRoot.getSetAfterNumber(
  //       this.checkedBlockHeight.plus(1),
  //     );
  //     if (set) {
  //       for (const blockCid of set) {
  //         // 每个set再逐个block校验并同步
  //         const checkBlock = await Block.fromCidOnlyHeader(
  //           blockCid,
  //           this.chain.db,
  //         );
  //         if (this.checkOneBlock(checkBlock, prevBlock)) {
  //           this.checkedBlockHeight = this.checkedBlockHeight.plus(1);

  //           await this.addBlockCidByNumber(blockCid, this.checkedBlockHeight);
  //           prevBlock = checkBlock;
  //           lifecycleEvents.emit(
  //             LifecycleStap.syncingHeaderBlock,
  //             this.checkedBlockHeight.toString(),
  //             '/',
  //             newHeaderBlock.header.number.toString(),
  //           );
  //         } else {
  //           message.info('next block is not prev block + 1');
  //           this.checkedBlockHeight = this.checkedBlockHeight.minus(1);
  //           if (this.checkedBlockHeight.isEqualTo(0)) {
  //             return;
  //           }
  //           await this.deleteFromStartNUmber(this.checkedBlockHeight);
  //           await this.save();
  //           await this.syncFromBlockRoot(blockRoot);
  //           return;
  //         }
  //       }
  //     }
  //   }
  // };

  /**
   * 在交易执行前做数据准备
   * @param trans meta Transaction
   */
  preLoadByTrans = async (trans: Transaction): Promise<void> => {
    if (trans.payload) {
      // 调用智能合约
      if (trans.payload.method === 'constructor') {
        // 新建合约账户
        // console.log(trans);
        const storageRoot = await createEmptyStorageRoot();
        const codeCbor = await createCborBlock(trans.payload.args[0]);
        const account = newAccount(
          trans.recipient.did,
          storageRoot,
          codeCbor.cid,
          trans.from.did,
        );
        this.accountCache.addPreLoadAccount(account);
      }
    } else {
      const hasSendAccount = await this.stateRoot.get(trans.from.did);
      const hasRecipientAccount = await this.stateRoot.get(trans.recipient.did);
      if (!hasSendAccount) {
        message.info('no send account: ', trans.from.did);
        throw new Error('no send account');
      }
      if (!hasRecipientAccount) {
        const account = newAccount(
          trans.recipient.did,
          await createEmptyStorageRoot(),
        );
        this.accountCache.addPreLoadAccount(account);
      }
    }
  };

  getExistAccount = async (did: string): Promise<Account> => {
    const account = await this.getAccount(did);
    if (!account) {
      throw Error('account must exist');
    }
    return account;
  };

  getAccount = async (did: string): Promise<Account | undefined> => {
    const cachedAccount = this.accountCache.getCachedAccount(did);
    if (cachedAccount) {
      return cachedAccount;
    }
    const cid = await this.stateRoot.get(did);
    if (cid) {
      const data = await this.db.get(cid.toString());
      if (data) {
        const account = await Account.fromBinary(data);
        return account;
      }
    }
  };

  goToNextBlock = async (): Promise<void> => {
    this.nextBlock = new NextBlock(
      this.getExistAccount,
      this.updateAccount,
      this.stateRoot,
      this.db.putCborBlock,
      this.db.putRawBlock,
      this.accountCache,
    );
    const headerBlock = await this.getHeaderBlock();
    await this.nextBlock.initNextBlock(headerBlock);
    this.blockBuffer = new BlockBuffer();
  };

  // 从块头向下查询某个交易发生的块
  findTxBlockWidthDeep = async (
    tx: string,
    deep: bigint,
  ): Promise<Omit<Block, 'body'> | undefined> => {
    let headerNumber = this.checkedBlockHeight;
    while (deep >= 0 && headerNumber >= 0n) {
      const currBlock = await this.getBlockByNumber(headerNumber);
      if (currBlock && (await isTxInBlock(tx, currBlock.header, this.db.get))) {
        return currBlock;
      }
      headerNumber = headerNumber - 1n;
      deep--;
    }
  };

  close = async (): Promise<void> => {
    await this.blockRoot.closeDb();
    await this.stateRoot.mpt.close();
  };
}
