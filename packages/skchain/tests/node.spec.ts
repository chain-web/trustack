import { performanceCollecter } from '../src/utils/performance.js';
import { createTestSkChain } from './skchainTest.util.js';
import { testAccounts } from './testAccount.js';

describe('SkChain', () => {
  describe('test', () => {
    it('should create skchain ok', async () => {
      const chain = await createTestSkChain('create');
      expect(
        chain.chainState.getSnapshot().matches('inactive.initializing'),
      ).toEqual(true);
    });
    it('should init skchain ok', async () => {
      const chain = await createTestSkChain('init');
      await chain.run({ user: testAccounts[0] });
      expect(chain.chainState.getSnapshot().matches('active')).toEqual(true);
      expect(chain.did).toEqual(testAccounts[0].id);
      await chain.stop();
      expect(chain.chainState.getSnapshot().matches('inactive')).toEqual(true);
      performanceCollecter.enabled && performanceCollecter.print();
    });
  });
});
