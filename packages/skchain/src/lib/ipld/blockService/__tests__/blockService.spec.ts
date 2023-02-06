import { genesis } from '../../../../config/testnet.config.js';
import { createGenesisBlock } from '../../../genesis/genesis.util.js';
import {
  closeTestBlockService,
  createTestBlockService,
} from './blockService.util.js';

describe('block service', () => {
  describe('test', () => {
    it('should block root init ok', async () => {
      const blockService = await createTestBlockService({
        name: 'test__block_init',
      });
      await blockService.init();
      await closeTestBlockService(blockService);
    });
    it('should add block ok', async () => {
      const blockService = await createTestBlockService({
        name: 'test__block_add',
      });
      await blockService.init();
      const block = await createGenesisBlock(genesis, 'stateRoot');
      await blockService.addBlock(block);
      const blockBack = await blockService.getBlockByNumber(0n);
      expect(blockBack).not.toEqual(undefined);
      if (blockBack) {
        expect(blockBack.hash).toEqual(block.hash);
      }
      await closeTestBlockService(blockService);
    });
  });
});
