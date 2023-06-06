import { testAccounts } from '@trustack/common';
import { createSubProcessNode } from './util.js';

describe('sknode multi node', () => {
  describe('simple multi node test', () => {
    it('should 1 node ok', async () => {
      const { kill, client } = await createSubProcessNode({ port: 3322 });
      const { balance } = await client.getBalance.query(testAccounts[0].id);
      expect(balance).toEqual('10000000');
      kill();
    });

    it('should 2 node ok', async () => {
      const { kill: kill1, client: client1 } = await createSubProcessNode({
        port: 3322,
      });
      const { kill: kill2, client: client2 } = await createSubProcessNode({
        port: 3422,
      });

      const { balance: balance1 } = await client1.getBalance.query(
        testAccounts[0].id,
      );
      const { balance: balance2 } = await client2.getBalance.query(
        testAccounts[0].id,
      );
      expect(balance1).toEqual(balance2);
      kill1();
      kill2();
    });
  });
});
