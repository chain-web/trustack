import { LifecycleStap, testAccounts, wait } from '@trustack/common';
import { Address } from '../src/mate/address.js';
import { createTestSkChain } from './skchainTest.util.js';

describe('SkChain moduleConfig', () => {
  describe('consensus module config test', () => {
    it('should block production ok', async () => {
      const chain = await createTestSkChain('block_production', {
        moduleConfig: {
          consensus: {
            blockProduction: false,
          },
        },
      });
      await chain.run({ user: testAccounts[0] });
      const { trans } = await chain.transaction({
        amount: 10n,
        recipient: new Address(testAccounts[4].id),
      });

      if (!trans) {
        throw new Error('no trans');
      }

      let hasNewBlock = false;
      chain.chainState.waitForLifecycle(LifecycleStap.newBlock).then(() => {
        hasNewBlock = true;
      });

      await wait(12000);

      expect(hasNewBlock).toBe(false);

      await chain.stop();
    });
  });
});
