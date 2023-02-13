import type { BlockService } from '../../ipld/blockService/blockService.js';
import { createTestBlockService } from '../../ipld/blockService/__tests__/blockService.util.js';
import type { Skfs } from '../../skfs/index.js';
import { createTestDiskSkfs } from '../../skfs/__tests__/utils.js';
import { Consensus } from '../index.js';

export const createTestConsensus = async (opts?: {
  db?: Skfs;
  blockService?: BlockService;
}): Promise<Consensus> => {
  const db = opts?.db || (await createTestDiskSkfs('test__init_consensus'));
  const blockService =
    opts?.blockService ||
    (await createTestBlockService({
      skfs: db,
      name: 'test__init_consensus',
    }));
  const consensus = new Consensus(db, blockService);

  return consensus;
};
