import { serdeJs } from '@trustack/common';
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
    const metaData = [
      this.accountNonce,
      this.amount,
      this.cu,
      this.cuLimit,
      this.from.did,
      this.payload,
      this.recipient.did,
    ];
    const binary = serdeJs.serialize({ c: metaData });
    return binary;
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
    const transData = (await takeBlockValue<[Uint8Array]>(binary))[0];
    const metaData = serdeJs.deserialize(transData).c as any;

    return new Transaction({
      accountNonce: metaData[0],
      amount: metaData[1],
      cu: metaData[2],
      cuLimit: metaData[3],
      from: new Address(metaData[4]),
      hash: metaData[5],
      payload: metaData[6] || undefined,
      recipient: new Address(metaData[7]),
      signature: metaData[8],
      ts: metaData[9],
    });
  };

  /**
   * 将区块数据保存，落文件
   */
  toCborBlock = async (): Promise<DefaultBlockType<[Uint8Array]>> => {
    if (!this.hash) {
      await this.genHash();
    }
    if (!this.signature) {
      throw new Error('Transaction signature is empty');
    }

    const metaData = [
      this.accountNonce,
      this.amount,
      this.cu,
      this.cuLimit,
      this.from.did,
      this.hash,
      this.payload,
      this.recipient.did,
      this.signature,
      this.ts,
    ];

    const binary = serdeJs.serialize({ c: metaData });

    const cborBlock = await createCborBlock<[Uint8Array]>([binary]);

    return cborBlock;
  };
}
