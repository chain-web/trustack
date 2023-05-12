import { genesis } from '../src/config/testnet.config.js';
import { BlockService } from '../src/lib/ipld/blockService/blockService.js';
import { createTestBlockRoot } from '../src/lib/ipld/blockService/__tests__/blockService.util.js';
import { createTestDiskSkfs } from '../src/lib/skfs/__tests__/utils.js';
import { createTestStateRoot } from '../src/mate/mpts/__tests__/mptTest.util.js';
import type { SKChainOption } from '../src/skChain.js';
import { SKChain } from '../src/skChain.js';

export const createTestSkChain = async (
  name: string,
  opts: Partial<Omit<SKChainOption, 'genesis' | 'db' | 'blockService'>> = {},
): Promise<SKChain> => {
  const skfs = await createTestDiskSkfs(`test__skchain_${name}_fs`);

  const blockRoot = await createTestBlockRoot(`${name}_blockRoot`);
  const stateRoot = await createTestStateRoot(`${name}_stateRoot`);
  const bs = new BlockService(skfs, { blockRoot, stateRoot });

  const chain = new SKChain({
    name,
    genesis: genesis,
    db: skfs,
    blockService: bs,
    ...opts,
  });

  return chain;
};

export const sleep = async (timeout: number): Promise<boolean> => {
  return new Promise((reslove) => {
    setTimeout(() => {
      reslove(true);
    }, timeout);
  });
};
