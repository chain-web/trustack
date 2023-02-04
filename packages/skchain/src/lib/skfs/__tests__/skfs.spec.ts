import { bytes } from 'multiformats';
import { createBlock, takeBlockValue } from '../../../mate/utils.js';
import type { Skfs } from '../index.js';
import { createTestDiskSkfs, createTestSkfs } from './utils.js';

describe('Skfs', () => {
  const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
  const runTest = (type: string, createFn: () => Promise<Skfs>) => {
    describe(`test: ${type}`, () => {
      it('should open db ok', async () => {
        const skfs = await createFn();
        await skfs.close();
      });
      it('should db put and get ok', async () => {
        const skfs = await createFn();
        const data = bytes.fromString(testDid);

        await skfs.put('did', data);
        const backData = await skfs.get('did');
        expect(backData).not.toEqual(undefined);
        if (backData) {
          expect(bytes.toString(backData)).toEqual(testDid);
        }
        await skfs.close();
      });
      it('should db put block and get ok', async () => {
        const skfs = await createFn();
        const blockVal = { user: testDid };
        const block = await createBlock(blockVal);
        await skfs.putBlock(block);
        const cid = block.cid.toString();
        const backData = await skfs.get(cid);
        expect(backData).not.toEqual(undefined);
        if (backData) {
          const value = await takeBlockValue<typeof blockVal>(backData);
          expect(value.user).toEqual(testDid);
        }
        await skfs.del(cid);
        const backData2 = await skfs.get(cid);
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

  runTest('mem', createTestSkfs);
  runTest('disk', createTestDiskSkfs);
});
