import { createTestStateRoot } from '../../../../mate/mpts/__tests__/mptTest.util.js';
import type { Skfs } from '../../../skfs/index.js';
import {
  createTestDiskSkMpt,
  createTestDiskSkfs,
} from '../../../skfs/__tests__/utils.js';
import { chainState } from '../../../state/index.js';
import { genInitOption } from '../../../state/initOption.js';
import { BlockRoot } from '../blockRoot.js';
import { BlockService } from '../blockService.js';

export const createTestBlockRoot = async (
  name?: string,
): Promise<BlockRoot> => {
  name = name || 'test__block_root_mot';
  const mpt = await createTestDiskSkMpt(name);
  const root = new BlockRoot({ mpt, name });
  return root;
};

export const createTestBlockService = async (opts?: {
  name?: string;
  skfs?: Skfs;
  noInitState?: boolean; // 是否初始化state
}): Promise<{ bs: BlockService; close: () => void }> => {
  let skfs = opts?.skfs;
  if (!skfs) {
    skfs = await createTestDiskSkfs(opts?.name);
  }
  const blockRoot = await createTestBlockRoot(`${opts?.name}_blockRoot`);
  const stateRoot = await createTestStateRoot(`${opts?.name}_stateRoot`);
  const root = new BlockService(skfs, { blockRoot, stateRoot });
  if (!opts?.noInitState) {
    chainState.send('INITIALIZE', {
      data: await genInitOption({ db: skfs, blockService: root }),
    });
  }
  await root.init();
  return {
    bs: root,
    close: async () => {
      await root.close();
      await root.db.close();
    },
  };
};
