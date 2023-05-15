import { testAccounts } from '@trustack/common';
import { createRPCClient } from '../dist/rpc/client.mjs';
import { createSubProcessNode } from './util.js';

describe('sknode multi node', () => {
  describe('simple multi node test', () => {
    it('should 1 node ok', async () => {
      const kill = await createSubProcessNode('3322');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const client = await createRPCClient('3322');
      const { balance } = await client.getBalance.query(testAccounts[0].id);
      expect(balance).toEqual('10000000');
      kill();
    }, 25000);

    it('should 2 node ok', async () => {
      const kill1 = await createSubProcessNode('3322');
      const kill2 = await createSubProcessNode('3422');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const client1 = await createRPCClient('3322');
      const client2 = await createRPCClient('3422');
      const { balance: balance1 } = await client1.getBalance.query(
        testAccounts[0].id,
      );
      const { balance: balance2 } = await client2.getBalance.query(
        testAccounts[0].id,
      );
      expect(balance1).toEqual(balance2);
      kill1();
      kill2();
    }, 30000);
  });
});
