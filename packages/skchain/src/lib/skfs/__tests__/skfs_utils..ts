import { bytes } from 'multiformats';
import {
  createCborBlock,
  createRawBlock,
  takeBlockValue,
} from '../../../mate/utils.js';
import { testDid } from '../../../mate/__tests__/metaTest.util.js';
import type { Skfs } from '../index.js';

export const runSkfsBasicTest = (
  type: string,
  createFn: () => Promise<Skfs>,
): void => {
  describe(`test: ${type}`, () => {
    it('should open db ok', async () => {
      const skfs = await createFn();
      await skfs.close();
    });
    it('should db put and get ok', async () => {
      const skfs = await createFn();
      const data = bytes.fromString(testDid);

      await skfs.putData('did', data);
      const backData = await skfs.get('did');
      expect(backData).not.toEqual(undefined);
      if (backData) {
        expect(bytes.toString(backData)).toEqual(testDid);
      }
      await skfs.close();
    });
    it('should db put data and get ok', async () => {
      const skfs = await createFn();
      const blockVal = { user: testDid };
      const block = await createCborBlock(blockVal);
      await skfs.putData(block.cid.toString(), block.bytes);
      const cid = block.cid.toString();
      const backData = await skfs.getData(cid);
      expect(backData).not.toEqual(undefined);
      if (backData) {
        const value = await takeBlockValue<typeof blockVal>(backData);
        expect(value.user).toEqual(testDid);
      }
      await skfs.delData(cid);
      const backData2 = await skfs.getData(cid);
      expect(backData2).toEqual(undefined);
      await skfs.close();
    });
    it('should db put block and get ok', async () => {
      const skfs = await createFn();
      const blockVal = { user: testDid };
      const block = await createCborBlock(blockVal);
      await skfs.putCborBlock(block);
      const backData = await skfs.getBlock(block.cid);
      expect(backData).not.toEqual(undefined);
      if (backData) {
        const value = await takeBlockValue<typeof blockVal>(backData);
        expect(value.user).toEqual(testDid);
      }
      await skfs.delBlock(block.cid);
      const backData2 = await skfs.getBlock(block.cid);
      expect(backData2).toEqual(undefined);
      await skfs.close();
    });
    it('should db put block and get ok', async () => {
      const skfs = await createFn();
      const block = await createRawBlock(bytes.fromString(testDid));
      await skfs.putRawBlock(block);

      const backData = await skfs.getBlock(block.cid);
      expect(backData).not.toEqual(undefined);
      if (backData) {
        expect(bytes.toString(backData)).toEqual(testDid);
      }
      await skfs.delBlock(block.cid);
      const backData2 = await skfs.getBlock(block.cid);
      expect(backData2).toEqual(undefined);
      await skfs.close();
    });

    it('should db put and get cache ok', async () => {
      const skfs = await createFn();

      await skfs.cachePut('test_key', 'test_val');
      const val = await skfs.cacheGet('test_key');
      expect(val).toEqual('test_val');
      const val1 = await skfs.cacheGet('test_key_new');
      expect(val1).toEqual(undefined);
      await skfs.close();
    });
  });
};
