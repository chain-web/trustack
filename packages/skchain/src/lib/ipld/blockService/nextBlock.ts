import { bytes } from 'multiformats';
import type { Account } from '../../../mate/account.js';
import type { BlockMeta } from '../../../mate/block.js';
import { Block } from '../../../mate/block.js';
import { Receipt } from '../../../mate/receipt.js';
import type { Transaction } from '../../../mate/transaction.js';
import { createCborBlock } from '../../../mate/utils.js';
import type { ValueOf } from '../../../types.js';
import { message } from '../../../utils/message.js';
import { accountOpCodes, errorCodes } from '../../contract/code.js';
import { Mpt } from '../../skfs/mpt.js';
import { BloomFilter } from '../logsBloom/bloomFilter.js';
import type { BlockService } from './blockService.js';

export type UpdateOpCode =
  | ValueOf<typeof errorCodes>
  | ValueOf<typeof accountOpCodes>;

export type UpdateAccountI = {
  opCode: UpdateOpCode;
  value: string | bigint | object;
} & {
  account: Account['account']['did'];
};

export class NextBlock {
  constructor(getAccount: BlockService['getExistAccount']) {
    this.getAccount = getAccount;
  }

  getAccount: BlockService['getExistAccount'];
  // 下一个块
  nextBlock!: Block;

  // 下一个块的body transaction
  nextBlockBodyTrans: string[] = [];

  nextTransactionMpt!: Mpt;
  nextReceiptsMpt!: Mpt;

  // 缓存未写入block的账户数据
  private updates: Map<string, Account> = new Map();

  initNextBlock = async (headerBlock: BlockMeta): Promise<void> => {
    await this.initMpt();
    this.nextBlock = new Block({
      number: headerBlock.header.number + 1n,
      parent: headerBlock.hash,
      stateRoot: '',
      receiptsRoot: '',
      transactionsRoot: '',
      logsBloom: new BloomFilter(),
      difficulty: BigInt(0), // TODO
      cuLimit: BigInt(0), // TODO ,应该在此时根据上一个块的信息生成
      ts: Date.now(),
      cuUsed: BigInt(0),
      slice: [0, 0], // 忘了最开始设计这个字段的目的了，尴尬
      body: (await createCborBlock([])).cid,
      extraData: null,
    });
  };

  initMpt = async (): Promise<void> => {
    // init transactionMpt
    this.nextTransactionMpt = new Mpt('nextTransactionMpt', { useMemDb: true });
    await this.nextTransactionMpt.initRootTree();

    // init receiptsMpt
    this.nextReceiptsMpt = new Mpt('nextReceiptsMpt', { useMemDb: true });
    await this.nextReceiptsMpt.initRootTree();
  };
  /**
   * 接收智能合约的执行结果，批量更新账户数据
   * @param account
   */
  addUpdates = async (
    trans: Transaction,
    updates: UpdateAccountI[],
    index: number,
  ): Promise<void> => {
    const tx = await this.addTransaction(trans);
    this.nextBlock.header.logsBloom.add(tx);
    this.nextBlock.header.ts === trans.ts;
    this.nextBlockBodyTrans.push(tx);

    // 生成单个交易的收据
    const receipt = new Receipt({
      blockNumber: this.nextBlock.header.number,
      updates,
      logs: [],
      status: 1,
      cuUsed: BigInt(0),
      from: trans.from,
      to: trans.recipient,
      transaction: tx,
      transactionIndex: index,
    });
    this.addReceipts(tx, receipt);

    for (const update of updates) {
      await this.addUpdate(update, trans);
    }
  };

  /**
   * 接收智能合约的执行结果，更新账户数据
   * @param account
   */
  addUpdate = async (
    update: UpdateAccountI,
    trans: Transaction,
  ): Promise<void> => {
    const account = await this.getAccount(update.account);
    if (!account) {
      throw new Error(`account: ${update.account} not found`);
    }
    switch (update.opCode) {
      case errorCodes['Insufficient balance']:
        message.error(update.value.toString());
        break;
      case accountOpCodes.minus:
        account.minusBlance(update.value as bigint);
        break;
      case accountOpCodes.plus:
        account.plusBlance(update.value as bigint, trans.ts.toString());
        break;
      case accountOpCodes.updateState:
        // TODO con not use
        // const cid = await this.chain.db.dag.put([update.value]);
        // account.updateState(cid);
        break;
      default:
        message.error('unknown op code');
        break;
    }
    this.updates.set(account.account.did, account);
  };

  addTransaction = async (trans: Transaction): Promise<string> => {
    const transCbor = await trans.toCborBlock();
    this.nextTransactionMpt.put(trans.hash, transCbor.cid.toString());
    return trans.hash;
  };

  addReceipts = async (tx: string, receipt: Receipt): Promise<void> => {
    const receiptsCbor = await receipt.toCborBlock();
    this.nextReceiptsMpt.put(tx, receiptsCbor.cid.toString());
  };

  /**
   * 提交当前区块的数据，进行打包
   */
  commit = async (): Promise<Block> => {
    // for (const account of this.updates) {
    //   // TODO 不是所有的账户都有更新，只有有更新的账户才会更新
    //   const newCid = await account[1].commit(this.chain.db);
    //   await this.stateMpt.updateKey(account[0], newCid);
    // }

    // // block body
    // const body = await this.chain.db.dag.put(this.nextBlockBodyTrans);
    // this.nextBlock.header.body = body.toString();
    // this.nextBlock.body = {
    //   transactions: this.nextBlockBodyTrans,
    // };

    // 新块的三棵树
    // const stateRoot = await this.stateMpt.save();
    // const transactionsRoot = await this.transactionMpt.save();
    // const receiptRoot = await this.receiptsMpt.save();
    // this.nextBlock.header.stateRoot = stateRoot.toString();
    this.nextBlock.header.transactionsRoot = bytes.toHex(
      this.nextTransactionMpt.root,
    );
    this.nextBlock.header.receiptsRoot = bytes.toHex(this.nextReceiptsMpt.root);

    this.nextBlock.header.ts = Date.now();
    await this.nextBlock.genHash();
    return this.nextBlock;
  };
}
