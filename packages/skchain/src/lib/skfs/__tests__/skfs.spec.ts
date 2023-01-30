import { MemoryLevel } from 'memory-level';
import { bytes } from 'multiformats';
import { createBlock, takeBlockValue } from '../../../mate/utils.js';
import { Skfs } from '../index.js';

describe('Skfs', () => {
  const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
  describe('test', () => {
    it('should open db ok', async () => {
      const skfs = new Skfs({
        path: new MemoryLevel({
          keyEncoding: 'utf8',
          valueEncoding: 'view',
        }),
      });
      await skfs.open();
    });
    it('should db put and get ok', async () => {
      const skfs = new Skfs({
        path: new MemoryLevel({
          keyEncoding: 'utf8',
          valueEncoding: 'view',
        }),
      });
      await skfs.open();
      const data = bytes.fromString(testDid);

      await skfs.put('did', data);
      const backData = await skfs.get('did');
      expect(bytes.toString(backData)).toEqual(testDid);
    });
    it('should db put block and get ok', async () => {
      const skfs = new Skfs({
        path: new MemoryLevel({
          keyEncoding: 'utf8',
          valueEncoding: 'view',
        }),
      });
      await skfs.open();
      const blockVal = { user: testDid };
      const block = await createBlock(blockVal);
      await skfs.putBlock(block);
      const backData = await skfs.get(block.cid.toString());
      const value = await takeBlockValue<typeof blockVal>(backData);
      expect(value.user).toEqual(testDid);
    });
  });
});
