import { genesis } from '../../config/testnet.config.js';
import type { SKChainOption } from '../../skChain.js';
import { BlockService } from '../ipld/blockService/blockService.js';
import { Skfs } from '../skfs/index.js';

export const genInitOption = (
  option?: Partial<SKChainOption>,
): SKChainOption => {
  const db = option?.db || new Skfs({ path: option?.datastorePath || 'skfs' });
  const initOption: SKChainOption = {
    name: genInitName(option),
    db,
    blockService: option?.blockService || new BlockService(db),
    datastorePath: option?.datastorePath || 'skfs',
    tcpPort: option?.tcpPort || 4003,
    wsPort: option?.wsPort || 6004,
    genesis: option?.genesis || genesis,
    bootstrap: option?.bootstrap || [],
    moduleConfig: {
      consensus: {
        blockProduction:
          option?.moduleConfig?.consensus?.blockProduction === undefined
            ? true
            : option?.moduleConfig?.consensus?.blockProduction,
      },
    },
  };
  return initOption;
};

export const genInitName = (option?: Partial<SKChainOption>): string => {
  return option?.name || 'skchain';
};
