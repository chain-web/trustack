import type { SKDB } from '../lib/ipfs/ipfs.interface.js';
import type { UpdateAccountI } from '../lib/ipld/index.js';
import type { Address } from './address.js';
import type { BlockHeaderData } from './block.js';

interface ReceiptData {
  blockNumber: BlockHeaderData['number'];
  status: 1 | 0; // 交易状态，成功1，失败0
  cuUsed: bigint; // 处理这笔交易消耗的计算量
  from: Address; // 付款方
  to: Address; // 收款方
  transaction: string; // 当前交易的hash
  transactionIndex: number; // 当前交易序号
  updates: UpdateAccountI[]; // 更新数据的日志
  logs: string[]; // 交易日志
}

// 基础数据，交易回执单
export class Receipt {
  constructor(data: ReceiptData) {
    this.receiptData = data;
  }
  receiptData: ReceiptData;

  fromCid = async (_db: SKDB): Promise<void> => {};

  commit = async (db: SKDB): Promise<void> => {
    return await db.dag.put([this.receiptData]);
  };
}
