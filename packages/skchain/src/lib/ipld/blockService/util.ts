import { Mpt } from '../../skfs/mpt.js';
import type { BlockHeaderData } from './../../../mate/block.js';
export const isTxInBlock = async (
  tx: string,
  blockHeader: BlockHeaderData,
): Promise<boolean> => {
  if (blockHeader.logsBloom.contains(tx)) {
    const transactionMpt = new Mpt('transactionMpt_temp', { useMemDb: true });
    await transactionMpt.initRootTree();
    const txData = await transactionMpt.get(tx);
    if (txData) {
      return true;
    }
  }
  return false;
};
