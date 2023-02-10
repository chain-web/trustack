import { NextBlock } from '../nextBlock.js';
import { createTestBlockService } from './blockService.util.js';

const createTestNextBlock = async (name: string) => {
  const blockService = await createTestBlockService({ name });
  return new NextBlock(blockService.getExistAccount);
};

describe('NextBlock', () => {
  describe('test', () => {
    it('should create NextBlockok', async () => {
      const nb = await createTestNextBlock('test__next_block');
    });
  });
});
