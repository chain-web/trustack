import { takeBlockValue } from '../../../mate/utils.js';
import type { Skfs } from '../../skfs/index.js';
import type { BlockHeaderData } from './../../../mate/block.js';
export const isTxInBlock = async (
  tx: string,
  blockHeader: BlockHeaderData,
  gdbGet: Skfs['get'],
): Promise<boolean> => {
  if (blockHeader.logsBloom.contains(tx)) {
    const transData = await gdbGet(blockHeader.transactionsRoot);
    if (transData) {
      const transArr = await takeBlockValue<string[]>(transData);
      const transSet = new Set(transArr);
      if (transSet.has(tx)) {
        return true;
      }
    }
  }
  return false;
};
