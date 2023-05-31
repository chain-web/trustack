import { createTestBlock } from '../../../mate/__tests__/metaTest.util.js';
import { NewBlockActions } from '../index.js';
import { createTestConsensus } from './consensusTest.util.js';

describe('chainState', () => {
  describe('test', () => {
    it('should init consensus ok', async () => {
      const { consensus, close } = await createTestConsensus();
      await consensus.init();
      await close();
    });
    it('should consensus processNewBlock ok', async () => {
      const { consensus, close } = await createTestConsensus();
      await consensus.init();
      const headerBlock = await createTestBlock();
      const newBlock = await createTestBlock(2n, headerBlock.hash);
      const action = await consensus.processNewBlock(newBlock, headerBlock);
      expect(action).toEqual(NewBlockActions.NEXT_BLOCK);

      const action2 = await consensus.processNewBlock(headerBlock, headerBlock);
      expect(action2).toEqual(NewBlockActions.INVALID_BLOCK);
      await close();
    });
  });
});
