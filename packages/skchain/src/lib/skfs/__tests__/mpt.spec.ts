import { bytes } from 'multiformats';
import { Mpt } from '../mpt.js';

const createTestSkMpt = (): Mpt => {
  return new Mpt('test_mpt', { useMemDb: true });
};

describe('SkMpt', () => {
  describe('test', () => {
    it('should create mpt ok', async () => {
      createTestSkMpt();
    });
    it('should get put ok', async () => {
      const mpt = createTestSkMpt();
      mpt.initRootTree();
      await mpt.put('testKey', 'testValue');
      const res = await mpt.get('testKey');
      expect(res).not.toBe(null);
      if (res) {
        expect(bytes.toString(res)).toEqual('testValue');
      }
    });
  });
});
