import type { BlockHeaderData } from './block.js';
import { Address } from './address.js';
import type { DefaultBlockType } from './utils.js';
import { createCborBlock, takeBlockValue } from './utils.js';

export interface TransactionOption {
  from: Transaction['from'];
  accountNonce: Transaction['accountNonce'];
  cu: Transaction['cu'];
  cuLimit: Transaction['cuLimit'];
  recipient: Transaction['recipient'];
  amount: Transaction['amount'];
  signature?: Transaction['signature'];
  payload?: Transaction['payload'];
  ts: Transaction['ts'];
  hash?: Transaction['hash'];
}

export type TransactionBinaryMeta = string[];

export type TransactionPayload = {
  method: 'constructor' | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
};

export type ContractTransaction = Transaction & {
  payload: TransactionPayload;
};

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
    this.signature = opt.signature;
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
  signature?: string;
  recipient: Address;
  amount: bigint;
  payload?: TransactionPayload;
  hash!: string;
  ts: number;

  getSignatureData = async (): Promise<Uint8Array> => {
    const cborBlock = await createCborBlock<TransactionBinaryMeta>([
      this.accountNonce.toString(),
      this.amount.toString(),
      this.cu.toString(),
      this.cuLimit.toString(),
      this.from.did,
      JSON.stringify(this.payload || ''),
      this.recipient.did,
    ]);
    return cborBlock.bytes;
  };

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
      signature: transData[8],
      ts: Number(transData[9]),
    });
  };

  /**
   * 将区块数据保存，落文件
   */
  toCborBlock = async (): Promise<DefaultBlockType<TransactionBinaryMeta>> => {
    if (!this.hash) {
      await this.genHash();
    }
    if (!this.signature) {
      throw new Error('Transaction signature is empty');
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
      this.signature,
      this.ts.toString(),
    ]);

    return cborBlock;
  };
}
