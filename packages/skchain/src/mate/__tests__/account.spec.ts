import { Account, newAccount } from '../account.js';
import { createBlock, createEmptyStorageRoot } from '../utils.js';

describe('Account', () => {
  describe('origin account test', () => {
    const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
    it('should create account ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const account = newAccount(testDid, storageRoot);
      expect(account.account.did).toEqual(testDid);
      expect(account.storageRoot).toEqual(storageRoot);
    });
    it('should set account storageRoot ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const storageRootNew = await createBlock({ name: testDid });
      const account = newAccount(testDid, storageRoot);
      account.updateState(storageRootNew.cid);
      expect(account.nonce).toEqual(1n);
      expect(account.storageRoot).toEqual(storageRootNew.cid);
    });
    it('should plus account blance ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const account = newAccount(testDid, storageRoot);
      account.plusBlance(1000n, Date.now());
      account.plusBlance(1000n, Date.now() + 1000);
      expect(account.getBlance()).toEqual(2000n);
      expect(account.nonce).toEqual(2n);
    });
    it('should minus account blance ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const account = newAccount(testDid, storageRoot);
      account.plusBlance(2000n, Date.now());
      account.minusBlance(1000n);
      account.minusBlance(200n);
      expect(account.getBlance()).toEqual(800n);
      expect(account.nonce).toEqual(3n);
    });
    it('should account to binary ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const account = newAccount(testDid, storageRoot);
      account.plusBlance(2000n, Date.now());
      account.minusBlance(1000n);
      await account.toBinary();
    });
    it('should account from binary ok', async () => {
      const testTimestamp = 1674975141922;
      const storageRoot = await createEmptyStorageRoot();
      const account = newAccount(testDid, storageRoot);
      account.plusBlance(2000n, Date.now());
      account.plusBlance(2000n, testTimestamp);
      account.minusBlance(1000n);
      expect(account.getOriginBlanceData()[testTimestamp]).toEqual(2000n);
      const binary = await account.toBinary();
      const accountFromBinart = await Account.fromBinary(binary);
      expect(accountFromBinart.nonce).toEqual(3n);
      expect(accountFromBinart.getBlance()).toEqual(3000n);
      expect(accountFromBinart.getOriginBlanceData()[testTimestamp]).toEqual(
        2000n,
      );
    });
  });
});
