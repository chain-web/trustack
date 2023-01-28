import type { IPFS } from 'ipfs-core';
import type { Cache } from './cache';
import type { Cache as Cacheb } from './cache.browser';

export type CacheCommon = Cache | Cacheb;

export interface NetworkConfig {
  tcp: number;
  ws: number;
  api: number;
  geteway: number;
}

export interface SKDB extends IPFS {
  cache: Cache | Cacheb;
  cacheCommon: Cache | Cacheb;
}
