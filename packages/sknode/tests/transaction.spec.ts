import { testAccounts, wait } from '@trustack/common';
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
        const { kill, client } = await createSubProcessNode({
          port,
          clearDB: true,
          userIndex: i,
        });
        kills.push(kill);
        nodes.push(client);
      }

      await nodes[0].transaction.query({
        amount: '1000',
        recipient: testAccounts[3].id,
      });
      // TODO
      // await wait(100000);
      // for (let i = 0; i < count; i++) {
      //   const { balance } = await nodes[i].getBalance.query(testAccounts[3].id);
      //   console.log('balance: ', i, balance);
      //   expect(balance).toEqual('1000');
      // }

      // kill nodes
      for (let i = 0; i < count; i++) {
        kills[i]();
      }
    }, 600000);
  });
});
