import { bytes } from 'multiformats';
import { testAccounts } from '../../../../tests/testAccount.js';
import { createCborBlock, takeBlockValue } from '../../../mate/utils.js';
import { testDid } from '../../../mate/__tests__/metaTest.util.js';
import { connect2Network, createTestSkNetWork } from './utils.js';

describe('Skfs', () => {
  describe(`test: bitswap`, () => {
    it('should db put and get ok', async () => {
      const {
        skfs: fs1,
        close: c1,
        network: n1,
      } = await createTestSkNetWork(6607, 6608, testAccounts[0]);

      const {
        skfs: fs2,
        close: c2,
        network: n2,
      } = await createTestSkNetWork(6707, 6708, testAccounts[1]);
      connect2Network(n1, n2);
      const data = bytes.fromString(testDid);
      const block = await createCborBlock({ user: testDid });
      await fs1.putData('did', data);
      await fs1.putCborBlock(block);
      const backData = await fs2.getBlock(block.cid);
      expect(backData).not.toEqual(undefined);
      if (backData) {
        const value = await takeBlockValue<{ user: string }>(backData);
        expect(value.user).toEqual(testDid);
      }

      await c1();
      await c2();
    }, 20000);
  });
});
