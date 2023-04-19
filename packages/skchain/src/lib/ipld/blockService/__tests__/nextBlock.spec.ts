import { NextBlock } from '../nextBlock.js';
import { createTestBlockService } from './blockService.util.js';

const createTestNextBlock = async (name: string) => {
  const { bs, close } = await createTestBlockService({ name });
  const nb = new NextBlock(
    bs.getExistAccount,
    bs.addAccount,
    bs.stateRoot,
    bs.db.putCborBlock,
    bs.db.putRawBlock,
    bs.accountCache,
  );

  return { nb, close };
};

describe('NextBlock', () => {
  describe('test', () => {
    it('should create NextBlockok', async () => {
      const { nb: _, close } = await createTestNextBlock('test__next_block');
      await close();
    });
  });
});
