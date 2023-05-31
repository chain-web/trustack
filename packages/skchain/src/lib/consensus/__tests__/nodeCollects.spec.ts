import { wait } from '@trustack/common';
import { NETWORK_GET_NODE_COUNT_INTERVAL } from '../../../config/index.js';
import { genetateDid } from '../../p2p/did.js';
import type { NodeCollect } from '../nodeCollect.js';
import { createTestNodeCollect } from './consensusTest.util.js';

describe('Sknetwork', () => {
  describe(`test`, () => {
    it('should nodeCollect init ok', async () => {
      const { nodeCollect, close } = await createTestNodeCollect();
      await nodeCollect.init();
      await wait(NETWORK_GET_NODE_COUNT_INTERVAL * 2.1);
      await close();
    }, 100000);
    // TODO: fix this test
    // it(
    //   'should nodeCollects - multi node ok',
    //   async () => {
    //     const count = 6;
    //     const nodeCollects: NodeCollect[] = [];
    //     const closes = [];
    //     const accounts = [];
    //     for (let i = 1; i < count + 1; i++) {
    //       const account = await genetateDid();
    //       const { nodeCollect, close } = await createTestNodeCollect({
    //         tcpPort: 6678 + i,
    //         wsPort: 6789 + i,
    //         did: account,
    //       });
    //       nodeCollects.push(nodeCollect);
    //       accounts.push(account);
    //       closes.push(close);
    //       // message.info(`NodeCollect ${i} init ok`);
    //     }

    //     await wait(NETWORK_GET_NODE_COUNT_INTERVAL * 3.1);

    //     const countSum = nodeCollects.reduce((sum, nc) => {
    //       return sum + nc.activeNodeCount;
    //     }, 0);

    //     // when init, the countSum should be greater than count * (count - 1) * 0.7
    //     expect(countSum).toBeGreaterThan((count - 1) * count * 0.7);

    //     // // close half
    //     for (let i = 0; i < count / 2; i++) {
    //       const c = closes.pop();
    //       nodeCollects.pop();
    //       await c?.();
    //     }
    //     await wait(NETWORK_GET_NODE_COUNT_INTERVAL * 3.1);
    //     const countSum2 = nodeCollects.reduce(
    //       (sum, nc) => sum + nc.activeNodeCount,
    //       0,
    //     );
    //     // // when close half, the countSum2 should be less than countSum, and greater than countSum * 0.7
    //     expect(countSum2).toBeGreaterThan(
    //       (nodeCollects.length - 1) * nodeCollects.length * 0.7,
    //     );
    //     expect(countSum2).toBeLessThanOrEqual(
    //       (nodeCollects.length - 1) * nodeCollects.length,
    //     );

    //     // close all
    //     for (let i = 0; i < closes.length; i++) {
    //       await closes[i]();
    //     }
    //   },
    //   400 * 1000,
    // );
  });
});
