import { genesis } from '../src/config/testnet.config.js';
import { SKChain } from '../src/skChain.js';

describe('SkChain', () => {
  describe('test', () => {
    it('should create skchain ok', () => {
      const chain = new SKChain({
        genesis: genesis,
        datastorePath: 'test',
      });
      expect(chain.chainState.getSnapshot().context.event).toEqual(
        'INITIALIZE',
      );
    });
  });
});
