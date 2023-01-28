// import { AbortSignal } from 'abort-controller';
import { resolve } from 'path';
import { create } from 'ipfs-core';
import type { CID } from 'multiformats';
import type { DidJson } from '../p2p/did';
import { nodeNetwork } from '../p2p/libp2p';
import type { networkidType } from '../../config/types';
import { message } from '../../utils/message';
import { skCacheKeys } from './key';
import { Cache } from './cache';
import type { CacheCommon, NetworkConfig, SKDB } from './ipfs.interface';

export const cacheCommon: CacheCommon = new Cache(`sk_cache`);

export const createIpfs = async ({
  did,
  storePath,
  network,
  networkid,
}: {
  did: DidJson;
  storePath: { main: string };
  network: NetworkConfig;
  networkid: networkidType;
}): Promise<SKDB> => {
  // Create the repo
  const repo = storePath.main;
  // 不知道为什么，ipfs与SKDB ipfs不符
  const ipfs: any = await create({
    // repo: ossRepo,
    init: {
      // 首次创建repo，用这个账户私钥
      privateKey: did.privKey,
    },
    repo,
    config: {
      // // 非首次创建的repo，用这个
      Identity: {
        PrivKey: did.privKey,
        PeerID: did.id,
      },
      Bootstrap: [],
      API: {
        // HTTPHeaders: {
        //   'Access-Control-Allow-Origin': ['*'],
        //   'Access-Control-Allow-Credentials': ['true'],
        // },
      },
      Swarm: {},
      Addresses: {
        Swarm: [`/dns4/wrtc-star1.zicui.net/tcp/443/wss/p2p-webrtc-star/`],
      },
      Pubsub: { Enabled: true },
    },
    EXPERIMENTAL: { ipnsPubsub: true },
    libp2p: nodeNetwork.createLibp2p,
  });
  message.info('id: ', await ipfs.id());

  const cache = new Cache(resolve(repo, `./sk_cache_${networkid}`));
  cache.put(skCacheKeys.accountId, did.id);
  cache.put(skCacheKeys.accountPublicKey, did.pubKey || '');
  cache.put(skCacheKeys.accountPrivKey, did.privKey);

  cacheCommon.put(skCacheKeys.accountId, did.id);
  cacheCommon.put(skCacheKeys.accountPrivKey, did.privKey);
  // 添加默认的超时时间
  const dagGet = async (
    name: CID,
    options: Parameters<typeof ipfs.dag.get>[1],
  ) => ipfs.dag.get(name, { ...(options as Object), timeout: 30000 });
  const dagPut = async (
    name: CID,
    val: Parameters<typeof ipfs.dag.put>[1],
    options: Parameters<typeof ipfs.dag.put>[2],
  ) => {
    return ipfs.dag.put(name, val, { ...(options as Object), timeout: 30000 });
  };
  const skdb = {
    ...ipfs,
    cache,
    dag: {
      ...ipfs.dag,
      put: dagPut,
      get: dagGet,
    },
  };
  return skdb;
};
