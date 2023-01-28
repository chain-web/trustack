import { CID } from 'multiformats/cid';
import type { SKDB } from '../lib/ipfs/ipfs.interface.js';
import type { BlockHeaderData } from './block.js';
import type { Address } from './address.js';

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
    mothed: 'constructor' | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[];
  };
  hash!: string;
  ts: number;

  genHash = async (db: SKDB): Promise<void> => {
    const obj = {
      accountNonce: this.accountNonce,
      cu: this.cu,
      cuLimit: this.cuLimit,
      recipient: this.recipient,
      amount: this.amount,
      payload: this.payload || null,
      ts: this.ts,
    };
    const cid = await db.dag.put(obj);
    this.hash = cid.toString();
  };

  static fromCid = async (db: SKDB, cid: string): Promise<Transaction> => {
    const transData = (await db.dag.get(CID.parse(cid))).value;
    return new Transaction({
      accountNonce: BigInt(transData[0]),
      amount: BigInt(transData[1]),
      cu: BigInt(transData[2]),
      cuLimit: BigInt(transData[3]),
      from: transData[4],
      hash: transData[5],
      payload: transData[6],
      recipient: transData[7],
      ts: transData[8],
    });
  };

  /**
   * 将区块数据保存，落文件
   */
  commit = async (db: SKDB, blockNumber: bigint): Promise<string> => {
    this.blockNumber = blockNumber;
    const transCid = await db.dag.put([
      this.accountNonce.toString(),
      this.amount.toString(),
      this.cu.toString(),
      this.cuLimit.toString(),
      this.from,
      this.hash,
      this.payload || null,
      this.recipient,
      this.ts,
    ]);
    return transCid;
  };
}
