import { serdeJs } from '@trustack/common';
import { bytes } from 'multiformats';
import {
  createCborBlock,
  createSerdeJsBlock,
  takeBlockValue,
} from '../utils.js';
import { testDid } from './metaTest.util.js';

describe('data utils', () => {
  describe('test', () => {
    const testData = { did: testDid };
    it('should cbor block simple use ok', async () => {
      const block = await createCborBlock(testData);
      expect(block.value.did).toEqual(testDid);
      const takeBlock = await takeBlockValue<typeof testData>(block.bytes);
      expect(takeBlock.did).toEqual(testDid);
    });
    it('should cbor block width uint8array ok', async () => {
      const testUint8Array = new Uint8Array([1, 2, 3, 4, 5]);
      const block = await createCborBlock([testUint8Array]);
      expect(block.value[0]).toEqual(testUint8Array);
      const takeBlock = await takeBlockValue<[Uint8Array]>(block.bytes);
      expect(takeBlock[0]).toEqual(testUint8Array);
    });
    it('should raw block ok', async () => {
      const block = await createCborBlock(bytes.fromString(testDid));
      expect(bytes.toString(block.value)).toEqual(testDid);
    });
    it('should serdeJs block ok', async () => {
      const block = await createSerdeJsBlock(testData);
      expect(block.value).toEqual(testData);
      const back = serdeJs.deserialize<typeof testData>(block.bytes);
      expect(back).toEqual(testData);
    });
  });
});
