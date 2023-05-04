import { createCborBlock } from '../../utils.js';
import { createTestStateRoot } from './mptTest.util.js';

describe('stateRoot', () => {
  describe('test', () => {
    it('should put get ok', async () => {
      const stateRoot = await createTestStateRoot();
      const block = await createCborBlock('test_cid');
      await stateRoot.put('test_did', block.cid.toString());
      const cid = await stateRoot.get('test_did');
      expect(cid).not.toEqual(undefined);
      if (cid) {
        expect(cid.bytes).toEqual(block.cid.bytes);
      }
      await stateRoot.close();
    });
    it('should get size ok', async () => {
      const stateRoot = await createTestStateRoot();
      const count = 100;

      for (let i = 0; i < count; i++) {
        const block = await createCborBlock(`test_cid${i}`);
        await stateRoot.put(`test_did${i}`, block.cid.toString());
      }
      const size = await stateRoot.size();
      expect(size).toBeGreaterThan(count * 0.95);
      expect(size).toBeLessThan(count * 1.05);
      await stateRoot.close();
    }, 20000);
  });
});
