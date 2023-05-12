import { createRPCClient } from '../dist/rpc/client.mjs';
import { createSubProcessNode } from './util.js';

describe('sknode multi node', () => {
  describe('simple multi node test', () => {
    it('should 1 node ok', async () => {
      const kill = await createSubProcessNode('3322');
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const client = await createRPCClient('3322');
      const { balance } = await client.getBalance.query(
        '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8',
      );
      expect(balance).toEqual('10000000');
      kill();
    }, 100000);
  });
});
