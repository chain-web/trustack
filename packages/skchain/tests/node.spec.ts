import { genesis } from '../src/config/testnet.config.js';
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
    // it('should init skchain ok', async () => {
    //   const chain = new SKChain({
    //     genesis: genesis,
    //     datastorePath: 'test_skfs',
    //   });
    //   await chain.db.clear();
    //   await chain.run();
    //   expect(chain.chainState.getSnapshot().matches('active')).toEqual(true);
    //   await chain.stop();
    //   expect(chain.chainState.getSnapshot().matches('inactive')).toEqual(true);
    // });
  });
});
