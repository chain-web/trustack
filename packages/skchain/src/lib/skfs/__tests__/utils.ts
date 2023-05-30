import type { DidJson } from '@trustack/common';
import { Skfs, leveldb_prefix } from '../index.js';
import { Mpt } from '../mpt.js';
import { SkNetwork } from '../network.js';

export const createTestSkMpt = (): Mpt => {
  return new Mpt('test_mpt', { useMemDb: true });
};

export const createTestDiskSkMpt = async (name: string): Promise<Mpt> => {
  await rmDbFile(name);
  const mpt = new Mpt(name);
  return mpt;
};

export const createTestSkfs = async (): Promise<Skfs> => {
  const skfs = new Skfs({
    path: 'test__skfs',
    useMemoryBb: true,
  });
  await skfs.open();

  return skfs;
};

export const createTestDiskSkfs = async (name?: string): Promise<Skfs> => {
  name = name || 'test__skfs';
  await rmDbFile(name);
  const skfs = new Skfs({
    path: name,
  });
  await skfs.open();

  return skfs;
};

export const createTestSkNetWork = async (
  tcpPort: number,
  wsPort: number,
  did: DidJson,
  skfs?: Skfs,
): Promise<{ network: SkNetwork; skfs: Skfs; close: () => void }> => {
  skfs = skfs || (await createTestDiskSkfs(`test__sk_network_${tcpPort}`));

  const network = new SkNetwork({
    tcpPort,
    wsPort,
    bootstrap: [],
  });
  await network.init(did, skfs.datastore);
  await skfs.initBitswap(network);

  return {
    network,
    skfs,
    close: async () => {
      await network.stop();
      await skfs?.close();
    },
  };
};

export const connect2Network = async (
  n1: SkNetwork,
  n2: SkNetwork,
): Promise<void> => {
  await n1.network.node.peerStore.patch(n2.network.node.peerId, {
    multiaddrs: n2.network.node.getMultiaddrs(),
  });
  await n1.network.node.dial(n2.network.node.getMultiaddrs());
};

const rmDbFile = async (name: string = '') => {
  let isNodejs = false;
  try {
    // eslint-disable-next-line import/no-nodejs-modules
    await import('fs');
    isNodejs = true;
  } catch (error) {}
  if (isNodejs) {
    // eslint-disable-next-line import/no-nodejs-modules
    const { resolve } = (await import('path')).default;
    // eslint-disable-next-line import/no-nodejs-modules
    const { existsSync, rmSync } = (await import('fs')).default;

    const dbFile = resolve(process.cwd(), `${leveldb_prefix()}${name}`);
    if (existsSync(dbFile)) {
      rmSync(dbFile, { recursive: true, force: true });
    }
  }
};
