import type { BlockHeaderData } from './block.js';
import { Address } from './address.js';
import type { DefaultBlockType } from './utils.js';
import { createCborBlock, takeBlockValue } from './utils.js';

export interface transMeta {
  from: Transaction['from'];
  amount: Transaction['amount'];
  recipient: Transaction['recipient'];
  cu: Transaction['cu'];
  signature: string;
  payload?: Transaction['payload'];
  ts: number;
}

export interface TransactionOption {
  from: Address;
  accountNonce: bigint;
  cu: bigint;
  cuLimit: bigint;
  recipient: Address;
  amount: bigint;
  payload?: Transaction['payload'];
  ts: number;
  hash?: string;
}

export type TransactionBinaryMeta = string[];

// 交易，基础数据
export class Transaction {
  constructor(opt: TransactionOption) {
    this.from = opt.from;
    this.accountNonce = opt.accountNonce;
    this.cu = opt.cu;
    this.cuLimit = opt.cuLimit;
    this.recipient = opt.recipient;
    this.amount = opt.amount;
    this.payload = opt.payload;
    this.ts = opt.ts;
    if (opt.hash) {
      this.hash = opt.hash;
    }
  }
  blockNumber!: BlockHeaderData['number'];
  accountNonce: bigint;
  cu: bigint;
  cuLimit: bigint;
  from: Address;
  recipient: Address;
  amount: bigint;
  payload?: {
    method: 'constructor' | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
  };
  hash!: string;
  ts: number;

  genHash = async (): Promise<void> => {
    const obj = {
      accountNonce: this.accountNonce,
      cu: this.cu,
      cuLimit: this.cuLimit,
      recipient: this.recipient,
      amount: this.amount,
      payload: this.payload || null,
      ts: this.ts,
    };
    const block = await createCborBlock(obj);
    this.hash = block.cid.toString();
  };

  static fromBinary = async (binary: Uint8Array): Promise<Transaction> => {
    const transData = await takeBlockValue<TransactionBinaryMeta>(binary);

    return new Transaction({
      accountNonce: BigInt(transData[0]),
      amount: BigInt(transData[1]),
      cu: BigInt(transData[2]),
      cuLimit: BigInt(transData[3]),
      from: new Address(transData[4]),
      hash: transData[5],
      payload: JSON.parse(transData[6]) || undefined,
      recipient: new Address(transData[7]),
      ts: Number(transData[8]),
    });
  };

  /**
   * 将区块数据保存，落文件
   */
  toCborBlock = async (): Promise<DefaultBlockType<TransactionBinaryMeta>> => {
    if (!this.hash) {
      await this.genHash();
    }
    const cborBlock = await createCborBlock<TransactionBinaryMeta>([
      this.accountNonce.toString(),
      this.amount.toString(),
      this.cu.toString(),
      this.cuLimit.toString(),
      this.from.did,
      this.hash,
      JSON.stringify(this.payload || ''),
      this.recipient.did,
      this.ts.toString(),
    ]);

    return cborBlock;
  };
}
