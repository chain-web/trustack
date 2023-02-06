import type { GenesisConfig } from '../../config/types.js';
import type { BlockHeaderData } from '../../mate/block.js';
import { Block } from '../../mate/block.js';
import { createBlock } from '../../mate/utils.js';
import { BloomFilter } from '../ipld/logsBloom/bloomFilter.js';
import { getEmptyMptRoot } from '../skfs/mpt.js';

export const createGenesisBlock = async (
  genesis: GenesisConfig,
  stateRoot: string,
): Promise<Block> => {
  const logsBloom = new BloomFilter();
  logsBloom.loadData(genesis.logsBloom);
  const genesisBlockHeader: BlockHeaderData = {
    parent: genesis.parent,
    stateRoot,
    transactionsRoot: getEmptyMptRoot(),
    receiptsRoot: getEmptyMptRoot(),
    logsBloom,
    difficulty: genesis.difficulty,
    number: genesis.number,
    cuLimit: genesis.cuLimit,
    cuUsed: BigInt(0),
    ts: genesis.timestamp,
    slice: [1, 0],
    body: (await createBlock([])).cid,
    extraData: null,
  };

  const genesisBlock = new Block(genesisBlockHeader);
  genesisBlock.body = { transactions: [] };
  await genesisBlock.genHash();
  return genesisBlock;
};
