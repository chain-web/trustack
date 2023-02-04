import { createTestDiskSkfs } from '../../../skfs/__tests__/utils.js';
import { BlockService } from '../blockService.js';

const createTestBlockService = async (): Promise<BlockService> => {
  const skfs = await createTestDiskSkfs();
  const root = new BlockService(skfs);
  return root;
};

describe('block service', () => {
  describe('test', () => {
    it('should block root init ok', async () => {
      const blockService = await createTestBlockService();
      await blockService.init();
      await blockService.close();
    });
  });
});
