import { genesis } from '../src/config/testnet.config.js';
import { createTestBlockService } from '../src/lib/ipld/blockService/__tests__/blockService.util.js';
import { createTestDiskSkfs } from '../src/lib/skfs/__tests__/utils.js';
import { SKChain } from '../src/skChain.js';

describe('SkChain', () => {
  describe('test', () => {
    it('should create skchain ok', () => {
      const chain = new SKChain({
        genesis: genesis,
        datastorePath: 'test__skfs',
      });
      expect(
        chain.chainState.getSnapshot().matches('inactive.initializing'),
      ).toEqual(true);
    });
    it('should init skchain ok', async () => {
      const skfs = await createTestDiskSkfs('test__init_skchain_fs');
      const blockService = await createTestBlockService({
        name: 'test__init_skchain_bs',
        skfs,
      });
      const chain = new SKChain({
        genesis: genesis,
        db: skfs,
        blockService,
      });
      await chain.db.clear();
      await chain.run();
      expect(chain.chainState.getSnapshot().matches('active')).toEqual(true);
      await chain.stop();
      expect(chain.chainState.getSnapshot().matches('inactive')).toEqual(true);
    });
  });
});
