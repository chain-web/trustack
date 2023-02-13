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
    });
  });
});
