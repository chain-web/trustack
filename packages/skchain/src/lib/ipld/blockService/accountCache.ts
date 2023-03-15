import type { Account } from '../../../mate/account.js';

export class AccountCache {
  // constructor() {}
  // 缓存未写入block的账户数据
  private updates: Map<string, Account> = new Map();
  private preLoadAccount: Map<string, Account> = new Map();

  getAllUpdateAccount(): AccountCache['updates'] {
    return this.updates;
  }

  getPreLoadAccount(did: string): Account | undefined {
    return this.preLoadAccount.get(did);
  }

  addPreLoadAccount(account: Account): void {
    this.preLoadAccount.set(account.address.did, account);
  }

  addUpdateAccount(account: Account): void {
    this.updates.set(account.address.did, account);
  }

  getCachedAccount(did: string): Account | undefined {
    return this.updates.get(did) || this.preLoadAccount.get(did);
  }
}
