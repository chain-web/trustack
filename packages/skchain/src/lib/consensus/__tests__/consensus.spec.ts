import { createTestConsensus } from './consensusTest.util.js';

describe('chainState', () => {
  describe('test', () => {
    it('should init consensus ok', async () => {
      const consensus = await createTestConsensus();
      await consensus.init();
    });
  });
});
