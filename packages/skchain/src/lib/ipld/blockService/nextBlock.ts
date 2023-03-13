import type { Account } from '../../../mate/account.js';
import type { BlockMeta } from '../../../mate/block.js';
import { Block } from '../../../mate/block.js';
import type { StateRoot } from '../../../mate/mpts/stateRoot.js';
import { Receipt } from '../../../mate/receipt.js';
import type { Transaction } from '../../../mate/transaction.js';
import { createCborBlock, createRawBlock } from '../../../mate/utils.js';
import type { ValueOf } from '../../../types.js';
import { message } from '../../../utils/message.js';
import { accountOpCodes, errorCodes } from '../../contract/code.js';
import type { Skfs } from '../../skfs/index.js';
import { BloomFilter } from '../logsBloom/bloomFilter.js';
import type { BlockService } from './blockService.js';

export type UpdateOpCode =
  | ValueOf<typeof errorCodes>
  | ValueOf<typeof accountOpCodes>;

export type UpdateAccountI = {
  opCode: UpdateOpCode;
  value: string | bigint | object | Uint8Array;
} & {
  account: Account['address']['did'];
};

export class NextBlock {
  constructor(
    getAccount: BlockService['getExistAccount'],
    updateAccount: BlockService['updateAccount'],
    stateRoot: StateRoot,
    addCborBlock: Skfs['putCborBlock'],
    addRawBlock: Skfs['putRawBlock'],
  ) {
    this.getAccount = getAccount;
    this.updateAccount = updateAccount;
    this.stateRoot = stateRoot;
    this.addCborBlock = addCborBlock;
    this.addRawBlock = addRawBlock;
  }

  getAccount: BlockService['getExistAccount'];
  updateAccount: BlockService['updateAccount'];
  stateRoot: StateRoot;
  addCborBlock: Skfs['putCborBlock'];
  addRawBlock: Skfs['putRawBlock'];
  // 下一个块
  nextBlock!: Block;

  // 下一个块的body transaction
  nextBlockBodyTrans: string[] = [];

  nextTransactions: string[] = [];
  nextReceipts: string[] = [];

  // 缓存未写入block的账户数据
  private updates: Map<string, Account> = new Map();

  initNextBlock = async (headerBlock: BlockMeta): Promise<void> => {
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
        this.updates.set(account.address.did, account);

        break;
      case accountOpCodes.plus:
        account.plusBlance(update.value as bigint, trans.ts.toString());
        this.updates.set(account.address.did, account);

        break;
      case accountOpCodes.updateState:
        await this.updateContractAccount(account, update);
        break;
      default:
        message.error('unknown op code');
        break;
    }
  };

  async updateContractAccount(
    account: Account,
    update: UpdateAccountI,
  ): Promise<void> {
    const storage = await createRawBlock(update.value as Uint8Array);
    await this.addRawBlock(storage);
    account.updateState(storage.cid);
    this.updates.set(account.address.did, account);
  }

  addTransaction = async (trans: Transaction): Promise<string> => {
    const transCbor = await trans.toCborBlock();
    await this.addCborBlock(transCbor);
    this.nextBlock.header.logsBloom.add(trans.hash);
    this.nextTransactions.push(trans.hash);
    return trans.hash;
  };

  addReceipts = async (tx: string, receipt: Receipt): Promise<void> => {
    const receiptsCbor = await receipt.toCborBlock();
    await this.addCborBlock(receiptsCbor);
    this.nextReceipts.push(tx);
  };

  /**
   * 提交当前区块的数据，进行打包
   */
  commit = async (): Promise<Block> => {
    for (const account of this.updates) {
      await this.updateAccount(account[1]);
    }

    // block body
    const body = await createCborBlock(this.nextBlockBodyTrans);
    this.nextBlock.header.body = body.cid;
    this.nextBlock.body = {
      transactions: this.nextBlockBodyTrans,
    };

    // 新块的三棵树
    this.nextBlock.header.stateRoot = this.stateRoot.root;
    const transCbor = await createCborBlock(this.nextTransactions);
    await this.addCborBlock(transCbor);
    this.nextBlock.header.transactionsRoot = transCbor.cid.toString();
    const receiptsCbor = await createCborBlock(this.nextReceipts);
    await this.addCborBlock(receiptsCbor);
    this.nextBlock.header.receiptsRoot = receiptsCbor.cid.toString();

    this.nextBlock.header.ts = Date.now();
    await this.nextBlock.genHash();
    return this.nextBlock;
  };
}
