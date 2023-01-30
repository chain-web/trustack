import { genesis } from '../../config/testnet.config.js';
import { BloomFilter } from '../../lib/ipld/logsBloom/bloomFilter.js';
import { Block } from '../block.js';
import { createEmptyStorageRoot } from '../utils.js';

const createSimpleTestBlock = async (): Promise<Block> => {
  const storageRoot = await createEmptyStorageRoot();
  const logsBloom = new BloomFilter();
  logsBloom.loadData(genesis.logsBloom);
  const block = new Block({
    parent: genesis.parent,
    stateRoot: storageRoot.toString(),
    transactionsRoot: storageRoot.toString(),
    receiptsRoot: storageRoot.toString(),
    logsBloom,
    difficulty: genesis.difficulty,
    number: genesis.number,
    cuLimit: genesis.cuLimit,
    cuUsed: BigInt(0),
    ts: genesis.timestamp,
    slice: [1, 0],
    body: storageRoot,
    extraData: null,
  });

  return block;
};

describe('Block', () => {
  describe('origin Block test', () => {
    it('should create Block ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const block = await createSimpleTestBlock();
      expect(block.header.cuUsed).toEqual(0n);
      expect(block.header.body).toEqual(storageRoot);
    });
    it('should block to binary ok', async () => {
      const block = await createSimpleTestBlock();
      await block.toBlock();
    });
    it('should block from binary ok', async () => {
      const storageRoot = await createEmptyStorageRoot();
      const block = await createSimpleTestBlock();
      expect(block.header.body).toEqual(storageRoot);

      const blockData = await block.toBlock();
      const accountFromBlock = await Block.fromBinary(blockData.bytes);
      expect(accountFromBlock.header.cuUsed).toEqual(0n);
      expect(accountFromBlock.header.body.toString()).toEqual(
        storageRoot.toString(),
      );
    });
    // it('should block updateBodyByBinary ok', async () => {
    //   // TODO
    // });
  });
});
