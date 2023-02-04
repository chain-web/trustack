import { BlockRoot } from '../blockRoot.js';

const createTestBlockRoot = (): BlockRoot => {
  const root = new BlockRoot();
  return root;
};

describe('SkMpt', () => {
  describe('test', () => {
    it('should create block root ok', async () => {
      const root = createTestBlockRoot();
      await root.closeDb();
    });
    it('should get index ok', async () => {
      const root = createTestBlockRoot();
      const res = root.getIndex(100_0001n);
      expect(res.curIndex).toEqual(1n);
      expect(res.setIndex).toEqual(1n);
      await root.closeDb();
    });
    it('should addBlockToRootNode ok', async () => {
      const root = createTestBlockRoot();
      await root.addBlockToRootNode('test_cid', 10n);
      await root.closeDb();
    });
    it('should getBlockCidByNumber ok', async () => {
      const root = createTestBlockRoot();
      await root.addBlockToRootNode('test_cid', 10n);
      const res = await root.getBlockCidByNumber(10n);
      expect(res).toEqual('test_cid');
      const res2 = await root.getBlockCidByNumber(100n);
      expect(res2).toEqual(undefined);
      const res3 = await root.getBlockCidByNumber(100n);
      expect(res3).toEqual(undefined);

      await root.closeDb();
    });
  });
});
