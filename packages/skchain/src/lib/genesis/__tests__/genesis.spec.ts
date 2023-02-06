import { genesis } from '../../../config/testnet.config.js';
import {
  closeTestBlockService,
  createTestBlockService,
} from '../../ipld/blockService/__tests__/blockService.util.js';
import { Genesis } from '../index.js';

describe('Genesis', () => {
  describe('test', () => {
    it('should Genesis check ok', async () => {
      const blockService = await createTestBlockService({
        name: 'test__genesis_check',
      });
      const gs = new Genesis(blockService, genesis);
      await gs.checkGenesisBlock();
      const block0 = await blockService.getBlockByNumber(0n);
      expect(block0).not.toEqual(undefined);
      if (block0) {
        expect(block0.header.number).toEqual(0n);
      }
      await closeTestBlockService(blockService);
    });
  });
});
