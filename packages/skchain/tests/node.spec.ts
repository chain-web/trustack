import { bytes } from 'multiformats';
import { testCoinContract } from '../src/lib/contract/__tests__/contractTest.util.js';
import { TransStatus } from '../src/lib/transaction/index.js';
import { Address } from '../src/mate/address.js';
import { performanceCollecter } from '../src/utils/performance.js';
import { createTestSkChain, sleep } from './skchainTest.util.js';
import { testAccounts } from './testAccount.js';

describe('SkChain', () => {
  describe('test', () => {
    it('should create skchain ok', async () => {
      const chain = await createTestSkChain('create');
      expect(
        chain.chainState.getSnapshot().matches('inactive.initializing'),
      ).toEqual(true);
    });
    it('should init skchain ok', async () => {
      const chain = await createTestSkChain('init');
      await chain.run({ user: testAccounts[0] });
      expect(chain.chainState.getSnapshot().matches('active')).toEqual(true);
      expect(chain.did).toEqual(testAccounts[0].id);
      await chain.stop();
      expect(chain.chainState.getSnapshot().matches('inactive')).toEqual(true);
      performanceCollecter.enabled && performanceCollecter.print();
    });
    it('should transaction ok', async () => {
      const chain = await createTestSkChain('transaction');
      await chain.run({ user: testAccounts[0] });
      const { trans } = await chain.transaction({
        amount: 10n,
        recipient: new Address(testAccounts[4].id),
      });
      expect(chain.transAction.status.waitTransCount).toEqual(1);
      if (trans) {
        const status = await chain.transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.waiting);
      }
      // wait to stack
      await sleep(8000);
      expect(trans).not.toEqual(undefined);
      if (trans) {
        const status = await chain.transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.transed);
      }
      await chain.stop();
      performanceCollecter.enabled && performanceCollecter.print();
    }, 20000);
    it('should deploy and call contract at two ok', async () => {
      const chain = await createTestSkChain('contract');
      await chain.run({ user: testAccounts[2] });

      const { trans } = await chain.deploy({
        payload: bytes.fromString(testCoinContract),
      });

      if (!trans) {
        throw new Error('no trans');
      }
      // wait to stack
      await sleep(12000);
      const status = await chain.transAction.transStatus(trans.hash);
      expect(status.status).toEqual(TransStatus.transed);
      let account = await chain.getAccount(trans.recipient.did);
      if (!account) {
        throw new Error('no contract account');
      }
      const storage = await chain.db.getBlock(account.storageRoot);
      if (!storage) {
        throw new Error('no storage');
      }
      expect(
        Boolean(
          bytes
            .toString(storage)
            .match('12D3KooWHdhPrGCqsjD8j6yiHfumdzxfRxyYNPxJKN99RfgtoRuq'),
        ),
      ).toEqual(true);

      const { trans: trans2 } = await chain.transaction({
        amount: 0n,
        recipient: trans.recipient,
        payload: {
          method: 'send',
          args: [new Address(testAccounts[0].id).toParam(), 100n],
        },
      });
      if (!trans2) {
        throw new Error('no trans2');
      }
      await sleep(10000);
      account = await chain.getAccount(trans.recipient.did);
      if (!account) {
        throw new Error('no contract account');
      }
      const storage2 = await chain.db.getBlock(account.storageRoot);
      if (!storage2) {
        throw new Error('no storage');
      }
      const status2 = await chain.transAction.transStatus(trans2.hash);
      expect(status2.status).toEqual(TransStatus.transed);
      expect(
        Boolean(bytes.toString(storage2).match(`"${testAccounts[0].id}":100n`)),
      ).toEqual(true);
      await chain.stop();
    }, 30000);
    it('should deploy and call contract at one block ok', async () => {
      const chain = await createTestSkChain('contract');
      await chain.run({ user: testAccounts[2] });

      const { trans } = await chain.deploy({
        payload: bytes.fromString(testCoinContract),
      });

      if (!trans) {
        throw new Error('no trans');
      }
      const { trans: trans2 } = await chain.transaction({
        amount: 0n,
        recipient: trans.recipient,
        payload: {
          method: 'send',
          args: [new Address(testAccounts[0].id).toParam(), 100n],
        },
      });
      if (!trans2) {
        throw new Error('no trans2');
      }
      await sleep(15000);
      const account = await chain.getAccount(trans.recipient.did);
      if (!account) {
        throw new Error('no contract account');
      }
      const storage2 = await chain.db.getBlock(account.storageRoot);
      if (!storage2) {
        throw new Error('no storage');
      }
      const status = await chain.transAction.transStatus(trans.hash);
      expect(status.status).toEqual(TransStatus.transed);
      const status2 = await chain.transAction.transStatus(trans2.hash);
      expect(status2.status).toEqual(TransStatus.transed);
      expect(
        Boolean(bytes.toString(storage2).match(`"${testAccounts[0].id}":100n`)),
      ).toEqual(true);
      await chain.stop();
    }, 30000);
  });
});
