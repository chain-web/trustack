import { CID } from 'multiformats';
import { Address } from './address.js';
import type { DefaultBlockType } from './utils.js';
import { createCborBlock, takeBlockValue } from './utils.js';

interface AccountMeta {
  codeCid: Account['codeCid'];
  owner: Account['owner'];
  address: Account['address'];
  contribute: Account['contribute'];
  nonce: Account['nonce'];
  balance: Account['balance'];
  storageRoot: Account['storageRoot'];
}

export type AccountBinaryMeta = [
  string,
  [string, string][],
  string | null,
  string,
  string | null,
  string,
  string,
];

// 账户，基础数据结构
export class Account {
  constructor(meta: AccountMeta) {
    // TODO cannot use
    this.nonce = meta.nonce;
    this.balance = meta.balance;
    this.address = meta.address;
    this.contribute = meta.contribute;
    this.storageRoot = meta.storageRoot;
    this.codeCid = meta.codeCid;
    this.owner = meta.owner;
  }
  address: Address;
  // 当前账户交易次数
  nonce: bigint;

  // 当前账户的贡献值
  contribute: bigint;
  // 账户余额 {age: amount},这里age是交易发起的时间
  private balance: {
    [key: string]: bigint;
  };
  // 合约数据库地址，可能没法用hash
  storageRoot: CID;
  // 存储合约代码的地址
  codeCid: CID | null; // v1

  // 合约的所有者
  owner: string | null;

  /**
   * 用存储account 数据的 cid string生成一个account实例
   * @param db
   * @param cid
   * @returns
   */
  public static fromBinary = async (binary: Uint8Array): Promise<Account> => {
    const accountData = await takeBlockValue<AccountBinaryMeta>(binary);
    const bl: Account['balance'] = {};
    accountData[1].map((ele: [string, string]) => {
      bl[ele[0]] = BigInt(ele[1]);
    });
    const accountMeta: AccountMeta = {
      address: new Address(accountData[0]),
      balance: bl,
      contribute: BigInt(accountData[3]),
      owner: accountData[4],
      nonce: BigInt(accountData[5]),
      storageRoot: CID.parse(accountData[6]),
      codeCid: null,
    };
    if (accountData[2]) {
      accountMeta.codeCid = CID.parse(accountData[2]);
    }
    return new Account(accountMeta);
  };

  // 每进行一次交易，执行此操作
  setNextNonce = (): void => {
    this.nonce = this.nonce + 1n;
  };

  /**
   * 获取当前账户余额
   * @returns
   */
  getBlance = (): bigint => {
    return Object.keys(this.balance).reduce((sum, cur) => {
      return sum + this.balance[cur as unknown as number];
    }, 0n);
  };

  /**
   * 获取账户余额原始数据
   * @returns
   */
  getOriginBlanceData = (): Account['balance'] => {
    return this.balance;
  };

  /**
   * 支出余额
   * @param amount
   * @returns
   */
  minusBlance = (amount: bigint): void => {
    if (amount > this.getBlance()) {
      throw new Error('dont have such amount to minus');
    }
    const zero = 0n;
    const blanceKeys = Object.keys(this.balance).sort((a, b) => +b - +a);
    // 从年龄最大的blance开始进行减法，直到能把amount全部减掉
    while (amount !== zero) {
      const curIndex = blanceKeys.shift();
      if (curIndex) {
        const last = this.balance[curIndex] - amount;
        if (last <= zero) {
          amount = -last;
          delete this.balance[curIndex];
        } else {
          this.balance[curIndex] = last;
          amount = zero;
        }
      }
    }
    this.setNextNonce();
  };

  /**
   * 余额增加
   * @param amount
   */
  plusBlance = (amount: bigint, timestamp: string | number): void => {
    this.balance[timestamp] = amount;
    this.setNextNonce();
  };

  // 更新状态树
  updateState = (cid: CID): void => {
    this.storageRoot = cid;
    this.setNextNonce();
  };

  toCborBlock = async (): Promise<DefaultBlockType<AccountBinaryMeta>> => {
    const block = await createCborBlock<AccountBinaryMeta>([
      this.address.did,
      Object.keys(this.balance).map((key) => {
        return [key, this.balance[key].toString()];
      }),
      this.codeCid?.toString() || null,
      this.contribute.toString(),
      this.owner || null,
      this.nonce.toString(),
      this.storageRoot.toString(),
    ]);
    return block;
  };
}

export const newAccount = (
  did: string,
  storageRoot: CID,
  codeCid: CID | null = null,
  owner: string | null = null,
): Account => {
  return new Account({
    address: new Address(did),
    contribute: 0n,
    nonce: 0n,
    balance: {},
    storageRoot,
    codeCid,
    owner,
  });
};
