import { Mpt } from '../mpt';
import type { BlockHeaderData } from './../../../mate/block';
import type { SKDB } from './../../ipfs/ipfs.interface';
export const isTxInBlock = async (
  tx: string,
  blockHeader: BlockHeaderData,
  db: SKDB,
): Promise<boolean> => {
  if (blockHeader.logsBloom.contains(tx)) {
    const transactionMpt = new Mpt(db, blockHeader.transactionsRoot);
    await transactionMpt.initRootTree();
    const txData = await transactionMpt.getKey(tx);
    if (txData) {
      return true;
    }
  }
  return false;
};
