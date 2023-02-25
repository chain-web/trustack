import { TransStatus } from '../src/lib/transaction/index.js';
import { Address } from '../src/mate/address.js';
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
    });
    it('should transaction ok', async () => {
      const chain = await createTestSkChain('init');
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
      await sleep(6000);
      expect(trans).not.toEqual(undefined);
      if (trans) {
        const status = await chain.transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.transed);
      }
      await chain.stop();
    }, 10000);
  });
});
