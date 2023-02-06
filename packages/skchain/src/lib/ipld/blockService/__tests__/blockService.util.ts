import { createTestStateRoot } from '../../../../mate/mpts/__tests__/mptTest.util.js';
import type { Skfs } from '../../../skfs/index.js';
import {
  createTestDiskSkMpt,
  createTestDiskSkfs,
} from '../../../skfs/__tests__/utils.js';
import { BlockRoot } from '../blockRoot.js';
import { BlockService } from '../blockService.js';

export const createTestBlockRoot = (name?: string): BlockRoot => {
  name = name || 'test__block_root_mot';
  const mpt = createTestDiskSkMpt(name);
  const root = new BlockRoot({ mpt });
  return root;
};

export const createTestBlockService = async (opts?: {
  name?: string;
  skfs?: Skfs;
}): Promise<BlockService> => {
  let skfs = opts?.skfs;
  if (!skfs) {
    skfs = await createTestDiskSkfs(opts?.name);
  }
  const blockRoot = createTestBlockRoot(`${opts?.name}_blockRoot`);
  const stateRoot = createTestStateRoot(`${opts?.name}_stateRoot`);
  const root = new BlockService(skfs, { blockRoot, stateRoot });
  return root;
};

export const closeTestBlockService = async (
  blockService: BlockService,
): Promise<void> => {
  await blockService.close();
  await blockService.db.close();
};
