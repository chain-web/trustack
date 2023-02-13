import { genesis } from '../src/config/testnet.config.js';
import { createTestBlockService } from '../src/lib/ipld/blockService/__tests__/blockService.util.js';
import { createTestDiskSkfs } from '../src/lib/skfs/__tests__/utils.js';
import { SKChain } from '../src/skChain.js';

export const createTestSkChain = async (name: string): Promise<SKChain> => {
  const skfs = await createTestDiskSkfs(`test__skchain_${name}_fs`);
  const blockService = await createTestBlockService({
    name: `test__skchain_${name}_bs`,
    skfs,
  });
  const chain = new SKChain({
    genesis: genesis,
    db: skfs,
    blockService,
  });

  return chain;
};
