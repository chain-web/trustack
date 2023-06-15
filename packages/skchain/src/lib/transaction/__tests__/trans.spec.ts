import { bytes } from 'multiformats';
import { testAccounts, testContracts } from '@trustack/common';
import { Address } from '../../../mate/address.js';
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
      // this test can not stack block
      const { transAction, close } = await createTestTransAction(
        'trans_create_contract',
        testAccounts[0],
      );

      const { trans } = await transAction.deploy({
        payload: bytes.fromString(testContracts.tokenContract.code),
      });
      expect(trans).not.toEqual(undefined);
      if (!trans) {
        throw new Error('no trans');
      } else {
        const status = await transAction.transStatus(trans.hash);
        expect(status.status).toEqual(TransStatus.waiting);
      }
      await close();
    });
  });
});
