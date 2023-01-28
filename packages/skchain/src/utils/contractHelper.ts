import type { ContractResultSaveItem as CRI } from '../lib/contract/index.js';
import type { Address } from '../mate/address.js';
import type { Transaction } from './../mate/transaction.js';

export type SliceKeyType = 'base58' | 'base32';

export namespace ConstractHelper {
  export type SliceDb<T> = {
    get: (key: string) => T;
    has: (key: string) => boolean;
    delete: (key: string) => void;
    set: (key: string, value: T) => void;
  };
  export type ContractResultItem = CRI;
  export type ContractFuncReruen<T> = Promise<{
    origin: T;
    trans: Transaction;
  }>;
}

class SliceDb<T> implements ConstractHelper.SliceDb<T> {
  constructor(keyType: SliceKeyType) {
    this.keyType = keyType;
  }
  // TODO 用keyType，用来做分片存储
  keyType: SliceKeyType;
  db: Map<string, T> = new Map();

  get = this.db.get as ConstractHelper.SliceDb<T>['get'];
  set = this.db.set;
  has = this.db.has;
  delete = this.db.delete;
}

const createSliceDb = <T>(keyType: SliceKeyType): SliceDb<T> => {
  return new SliceDb<T>(keyType);
};

const hash = (_str: string): void => {
  // return sk.genCidString(str);
};

export class BaseContract {
  msg = {
    sender: {} as Address,
    ts: 0,
  };
}
export const constractHelper = {
  createSliceDb,
  hash,
  // eslint-disable-next-line no-console
  log: console.log,
};
