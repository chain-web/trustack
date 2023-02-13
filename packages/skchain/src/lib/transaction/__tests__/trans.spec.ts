import { testAccounts } from '../../../../tests/testAccount.js';
import { Address } from '../../../mate/address.js';
import { TransStatus } from '../index.js';
import { createTestTransAction } from './transTest.util.js';

describe('transcation', () => {
  describe('simple test', () => {
    it('should create transAction ok', async () => {
      const transAction = await createTestTransAction(
        'trans_create',
        testAccounts[0],
      );
      await transAction.init();
      await transAction.stop();
    });
    it('should trans ok', async () => {
      const transAction = await createTestTransAction(
        'trans_one',
        testAccounts[0],
      );

      const { trans } = await transAction.transaction({
        amount: 10n,
        recipient: new Address(testAccounts[4].id),
      });
      expect(trans).not.toEqual(undefined);
      if (trans) {
        const status = await transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.waiting);
      }
    });
  });
});
