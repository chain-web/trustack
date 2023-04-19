import { bytes } from 'multiformats';
import { sleep } from '../../../../tests/skchainTest.util.js';
import { testAccounts } from '../../../../tests/testAccount.js';
import { Address } from '../../../mate/address.js';
import { testCoinContract } from '../../contract/__tests__/contractTest.util.js';
import { TransStatus } from '../index.js';
import { createTestTransAction } from './transTest.util.js';

describe('transcation', () => {
  describe('simple test', () => {
    it('should create transAction ok', async () => {
      const { transAction, close } = await createTestTransAction(
        'trans_create',
        testAccounts[0],
      );
      await transAction.init();
      await close();
    });
    it('should trans ok', async () => {
      const { transAction, close } = await createTestTransAction(
        'trans_one',
        testAccounts[0],
      );

      const { trans } = await transAction.transaction({
        amount: 10n,
        recipient: new Address(testAccounts[4].id),
      });
      expect(trans).not.toEqual(undefined);
      expect(transAction.status.waitTransCount).toEqual(1);
      if (trans) {
        const status = await transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.waiting);
      }
      await close();
    });
    it('should deploy contract ok', async () => {
      const { transAction, close } = await createTestTransAction(
        'trans_create_contract',
        testAccounts[0],
      );

      const { trans } = await transAction.deploy({
        payload: bytes.fromString(testCoinContract),
      });
      expect(trans).not.toEqual(undefined);
      await sleep(8000);
      if (!trans) {
        throw new Error('no trans');
      } else {
        const status = await transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.waiting);
      }
      await close();
    }, 20000);
  });
});
