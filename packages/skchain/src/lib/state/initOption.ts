import { genesis } from '../../config/testnet.config.js';
import type { SKChainOption } from '../../skChain.js';
import { BlockService } from '../ipld/blockService/blockService.js';
import { Skfs } from '../skfs/index.js';

export const genInitOption = (
  option?: Partial<SKChainOption>,
): SKChainOption => {
  const db = option?.db || new Skfs({ path: option?.datastorePath || 'skfs' });
  const initOption: SKChainOption = {
    db,
    blockService: option?.blockService || new BlockService(db),
    datastorePath: option?.datastorePath || 'skfs',
    tcpPort: option?.tcpPort || 4003,
    wsPort: option?.wsPort || 6004,
    genesis: option?.genesis || genesis,
  };
  return initOption;
};
