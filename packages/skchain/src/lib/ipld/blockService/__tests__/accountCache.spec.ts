import { testAccounts } from '@trustack/common';
import { newAccount } from '../../../../mate/account.js';
import { createEmptyStorageRoot } from '../../../../mate/utils.js';
import { AccountCache } from '../accountCache.js';

describe('accont cache', () => {
  describe('test', () => {
    it('should simple use ok', async () => {
      const accountCache = new AccountCache();
      const storageRoot = await createEmptyStorageRoot();
      const accounts = testAccounts.map((item) =>
        newAccount(item.id, storageRoot),
      );
      accountCache.addPreLoadAccount(accounts[0]);
      accountCache.addUpdateAccount(accounts[1]);
      accountCache.addUpdateAccount(accounts[2]);
      expect(
        accountCache.getAllUpdateAccount().get(accounts[1].address.did),
      ).toEqual(accounts[1]);
      expect(accountCache.getCachedAccount(accounts[0].address.did)).toEqual(
        accounts[0],
      );
      expect(accountCache.getPreLoadAccount(accounts[0].address.did)).toEqual(
        accounts[0],
      );
      expect(accountCache.getPreLoadAccount(accounts[1].address.did)).toEqual(
        undefined,
      );
    });
  });
});
