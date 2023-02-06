import { bytes } from 'multiformats';
import { createTestDiskSkMpt, createTestSkMpt } from './utils.js';

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
    it('should disk get put ok', async () => {
      const mpt = createTestDiskSkMpt('test__mpt');
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
