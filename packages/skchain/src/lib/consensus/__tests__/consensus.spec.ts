import { createTestBlockService } from '../../ipld/blockService/__tests__/blockService.util.js';
import { createTestDiskSkfs } from '../../skfs/__tests__/utils.js';
import { Consensus } from '../index.js';

describe('chainState', () => {
  describe('test', () => {
    it('should init consensus ok', async () => {
      const db = await createTestDiskSkfs('test__init__consensus');
      const blockService = await createTestBlockService({
        skfs: db,
        name: 'test__init__consensus',
      });
      const consensus = new Consensus(db, blockService);
      await consensus.init();
    });
  });
});
