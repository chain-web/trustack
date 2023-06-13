import { testAccounts, wait } from '@trustack/common';
import { createSubProcessNode } from './util.js';

describe('SkChain transaction', () => {
  describe('multi node test', () => {
    it('should 4 node simple transaction ok', async () => {
      const count = 4;
      // create nodes
      const nodes = [];
      const kills = [];
      const awaitForBlocks = [];
      for (let i = 0; i < count; i++) {
        const port = 3322 + i * 10;
        const { kill, client, awaitForBlock } = await createSubProcessNode({
          port,
          clearDB: true,
          userIndex: i,
        });
        kills.push(kill);
        nodes.push(client);
        awaitForBlocks.push(awaitForBlock);
      }

      // wait for peer connect
      let peerCount = 0;
      while (peerCount < count) {
        // every node connect to each other, and connect to relay node, so peerCount should eqal to count
        await wait(1000);
        const {
          status: { peerCount: pc },
        } = await nodes[0].getNetworkStatus.query();
        peerCount = pc;
      }

      // send transaction
      await nodes[0].transaction.query({
        amount: '1000',
        recipient: testAccounts[3].id,
      });

      // wait for 1 block
      await Promise.all(awaitForBlocks.map((f) => f(1)));
      for (let i = 0; i < count; i++) {
        const { balance } = await nodes[i].getBalance.query(testAccounts[3].id);
        expect(balance).toEqual('1000');
      }

      // kill nodes
      for (let i = 0; i < count; i++) {
        kills[i]();
      }
    });
  });
});
