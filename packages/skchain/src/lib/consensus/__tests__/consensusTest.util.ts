import type { DidJson } from '@trustack/common';
import { testAccounts } from '@trustack/common';
import type { BlockService } from '../../ipld/blockService/blockService.js';
import { createTestBlockService } from '../../ipld/blockService/__tests__/blockService.util.js';
import type { Skfs } from '../../skfs/index.js';
import { SkNetwork } from '../../skfs/network.js';
import {
  createTestDiskSkfs,
  createTestSkNetWork,
} from '../../skfs/__tests__/utils.js';
import { Consensus } from '../index.js';
import { NodeCollect } from '../nodeCollect.js';

export const createTestConsensus = async (opts?: {
  db?: Skfs;
  blockService?: BlockService;
  network?: SkNetwork;
  tcpPort?: number;
  wsPort?: number;
  did?: DidJson;
}): Promise<{ consensus: Consensus; close: () => void }> => {
  const db = opts?.db || (await createTestDiskSkfs('test__init_consensus'));
  let close = () => {};
  let bs = opts?.blockService;
  if (!opts?.blockService) {
    const newBs = await createTestBlockService({
      skfs: db,
      name: 'test__init_consensus',
    });
    bs = newBs.bs;
    close = newBs.close;
  }

  const network = new SkNetwork({
    tcpPort: opts?.tcpPort || 6688,
    wsPort: opts?.wsPort || 6689,
  });
  await bs?.init();
  await network.init(opts?.did || testAccounts[0], db.datastore);
  await db.initBitswap(network);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const consensus = new Consensus(bs!, network);

  return {
    consensus,
    close: async () => {
      await consensus.stop();
      await network.stop();
      close && (await close());
    },
  };
};

export const createTestNodeCollect = async (opts?: {
  tcpPort?: number;
  wsPort?: number;
  did?: DidJson;
}): Promise<{ nodeCollect: NodeCollect; close: () => void }> => {
  const tcpPort = opts?.tcpPort || 6678;
  const wsPort = opts?.wsPort || 6789;
  const did = opts?.did || testAccounts[0];
  const skfs = await createTestDiskSkfs(`test__sk_network_${tcpPort}`);

  const { bs, close: closeBs } = await createTestBlockService({
    name: `test__node_collect_${tcpPort}}`,
    skfs,
  });
  const { network, close: closeNetwork } = await createTestSkNetWork(
    tcpPort,
    wsPort,
    did,
    bs.db,
  );
  const nodeCollect = new NodeCollect(bs, network);
  await nodeCollect.init();

  return {
    nodeCollect,
    close: async () => {
      await await nodeCollect.stop();
      await closeNetwork();
      await closeBs();
    },
  };
};
