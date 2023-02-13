import { Account, newAccount } from '../account.js';
import { createCborBlock, createEmptyStorageRoot } from '../utils.js';
import { createTestAccount } from './metaTest.util.js';

describe('Account', () => {
  describe('origin account test', () => {
    const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
    it('should create account ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const account = newAccount(testDid, storageRoot);
      expect(account.address.did).toEqual(testDid);
      expect(account.storageRoot).toEqual(storageRoot);
    });
    it('should set account storageRoot ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const storageRootNew = await createCborBlock({ name: testDid });
      const account = newAccount(testDid, storageRoot);

      account.updateState(storageRootNew.cid);
      expect(account.nonce).toEqual(1n);
      expect(account.storageRoot).toEqual(storageRootNew.cid);
    });
    it('should plus account blance ok', async () => {
      const account = await createTestAccount();

      account.plusBlance(1000n, Date.now());
      account.plusBlance(1000n, Date.now() + 1000);
      expect(account.getBlance()).toEqual(2000n);
      expect(account.nonce).toEqual(2n);
    });
    it('should minus account blance ok', async () => {
      const account = await createTestAccount();

      account.plusBlance(2000n, Date.now());
      account.minusBlance(1000n);
      account.minusBlance(200n);
      expect(account.getBlance()).toEqual(800n);
      expect(account.nonce).toEqual(3n);
    });
    it('should account to binary ok', async () => {
      const account = await createTestAccount();

      account.plusBlance(2000n, Date.now());
      account.minusBlance(1000n);
      await account.toCborBlock();
    });
    it('should account from binary ok', async () => {
      const testTimestamp = 1674975141922;

      const account = await createTestAccount();

      account.plusBlance(2000n, Date.now());
      account.plusBlance(2000n, testTimestamp);
      account.minusBlance(1000n);
      expect(account.getOriginBlanceData()[testTimestamp]).toEqual(2000n);
      const block = await account.toCborBlock();
      const accountFromBlock = await Account.fromBinary(block.bytes);
      expect(accountFromBlock.nonce).toEqual(3n);
      expect(accountFromBlock.getBlance()).toEqual(3000n);
      expect(accountFromBlock.getOriginBlanceData()[testTimestamp]).toEqual(
        2000n,
      );
    });
  });
});
