import { testAccounts } from '@trustack/common';
import { bytes } from 'multiformats';
import { Transaction } from 'skchain';
import { createSubProcessNode } from './util.js';

describe('sknode multi node', () => {
  describe('simple multi node test', () => {
    it('should transaction ok', async () => {
      const { kill, client } = await createSubProcessNode({
        port: 3322,
        user: testAccounts[0],
      });
      const { hex } = await client.transaction.query({
        amount: '10',
        recipient: testAccounts[1].id,
      });
      if (!hex) {
        throw new Error('no hex');
      }
      const trans = await Transaction.fromBinary(bytes.fromHex(hex));
      expect(trans.amount).toEqual(10n);
      kill();
    });
  });
});
