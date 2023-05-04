import { bytes } from 'multiformats';
import { testDid } from '../../../mate/__tests__/metaTest.util.js';
import { runSkfsBasicTest } from './skfs_utils..js';
import { createTestDiskSkfs, createTestSkfs } from './utils.js';

describe('Skfs: mem', () => {
  runSkfsBasicTest('mem', createTestSkfs);
});
describe('Skfs: desk', () => {
  runSkfsBasicTest('disk', createTestDiskSkfs);
  it('should delete test db ok', async () => {
    const skfs = await createTestDiskSkfs('test__skfs_delete');
    const data = bytes.fromString(testDid);

    await skfs.putData('did', data);
    const backData = await skfs.getData('did');
    expect(backData).not.toEqual(undefined);
    if (backData) {
      expect(bytes.toString(backData)).toEqual(testDid);
    }
    await skfs.close();
    const skfs2 = await createTestDiskSkfs('test__skfs_delete');
    const backData2 = await skfs2.getData('did');
    expect(backData2).toEqual(undefined);
    await skfs2.close();
  });
});
