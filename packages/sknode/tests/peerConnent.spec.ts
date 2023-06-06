import { wait } from '@trustack/common';
import { createSubProcessNode } from './util.js';

describe('SkChain p2p', () => {
  describe('multi node test', () => {
    it('should 6 node connect ok', async () => {
      const count = 6;
      // create nodes
      const nodes = [];
      const kills = [];
      for (let i = 0; i < count; i++) {
        const port = 3322 + i * 10;
        const { kill, client } = await createSubProcessNode({
          port,
          clearDB: true,
        });
        kills.push(kill);
        nodes.push(client);
      }

      await wait(15 * 1000);
      for (let i = 0; i < count - 1; i++) {
        const {
          status: { peerCount },
        } = await nodes[i].getNetworkStatus.query();
        expect(peerCount).toBeGreaterThan(count - 2);
      }

      // kill nodes
      for (let i = 0; i < count; i++) {
        kills[i]();
      }
    }, 600000);
  });
});
