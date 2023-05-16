import { testAccounts, wait } from '@trustack/common';
import { createRPCClient } from '../dist/rpc/client.mjs';
import { createSubProcessNode } from './util.js';

describe('SkChain transaction', () => {
  describe('multi node test', () => {
    it('should 6 node simple transaction ok', async () => {
      const count = 6;
      // create nodes
      const nodes = [];
      const kills = [];
      for (let i = 0; i < count; i++) {
        const port = `${3322 + i * 10}`;
        const kill = await createSubProcessNode(port);
        kills.push(kill);
        const client = await createRPCClient('3322');
        nodes.push(client);
      }

      await wait(10000);
      await nodes[0].transaction.query({
        amount: '1000',
        recipient: testAccounts[3].id,
      });
      await wait(10000);
      for (let i = 0; i < count; i++) {
        const { balance } = await nodes[i].getBalance.query(testAccounts[3].id);
        expect(balance).toEqual('1000');
      }

      // kill nodes
      for (let i = 0; i < count; i++) {
        kills[i]();
      }
    }, 600000);
  });
});
