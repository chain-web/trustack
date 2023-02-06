import { createTestStateRoot } from '../../../../mate/mpts/__tests__/mptTest.util.js';
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

export const createTestBlockService = async (
  name?: string,
): Promise<BlockService> => {
  const skfs = await createTestDiskSkfs(name);
  const blockRoot = createTestBlockRoot(`${name}_blockRoot`);
  // TODO
  const stateRoot = createTestStateRoot(`${name}_stateRoot`);
  const root = new BlockService(skfs, { blockRoot, stateRoot });
  return root;
};

export const closeTestBlockService = async (
  blockService: BlockService,
): Promise<void> => {
  await blockService.close();
  await blockService.db.close();
};
