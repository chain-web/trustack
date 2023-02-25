import { bytes } from 'multiformats';
import { createCborBlock, takeBlockValue } from '../utils.js';
import { testDid } from './metaTest.util.js';

describe('data utils', () => {
  describe('test', () => {
    const testData = { did: testDid };
    it('should cbor block ok', async () => {
      const block = await createCborBlock(testData);
      expect(block.value.did).toEqual(testDid);
      const takeBlock = await takeBlockValue<typeof testData>(block.bytes);
      expect(takeBlock.did).toEqual(testDid);
    });
    it('should raw block ok', async () => {
      const block = await createCborBlock(bytes.fromString(testDid));
      expect(bytes.toString(block.value)).toEqual(testDid);
    });
  });
});
