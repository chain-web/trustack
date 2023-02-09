import type { UpdateAccountI } from '../lib/ipld/index.js';
import { Address } from './address.js';
import type { BlockHeaderData } from './block.js';
import type { DefaultBlockType } from './utils.js';
import { createCborBlock, takeBlockValue } from './utils.js';

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

export type ReceiptBinaryMeta = string[];

// 基础数据，交易回执单
export class Receipt {
  constructor(data: ReceiptData) {
    this.receiptData = data;
  }
  receiptData: ReceiptData;

  static fromBinary = async (binary: Uint8Array): Promise<Receipt> => {
    const receiptData = await takeBlockValue<ReceiptBinaryMeta>(binary);

    return new Receipt({
      blockNumber: BigInt(receiptData[0]),
      cuUsed: BigInt(receiptData[1]),
      from: new Address(receiptData[2]),
      logs: JSON.parse(receiptData[3]),
      status: receiptData[4] === '0' ? 0 : 1,
      to: new Address(receiptData[5]),
      transaction: receiptData[6],
      transactionIndex: Number(receiptData[7]),
      updates: JSON.parse(receiptData[8]),
    });
  };

  toCborBlock = async (): Promise<DefaultBlockType<ReceiptBinaryMeta>> => {
    const cborBlock = await createCborBlock<ReceiptBinaryMeta>([
      this.receiptData.blockNumber.toString(),
      this.receiptData.cuUsed.toString(),
      this.receiptData.from.did,
      JSON.stringify(this.receiptData.logs),
      this.receiptData.status.toString(),
      this.receiptData.to.did,
      this.receiptData.transaction,
      this.receiptData.transactionIndex.toString(),
      JSON.stringify(this.receiptData.updates),
    ]);

    return cborBlock;
  };
}
