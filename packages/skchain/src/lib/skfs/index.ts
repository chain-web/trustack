import { Key } from 'interface-datastore';
import { MemoryLevel } from 'memory-level';
import type { AbstractLevel, AbstractSublevel } from 'abstract-level';
import { LevelDatastore } from 'datastore-level';
import { Level } from 'level';
import type { Bitswap } from 'ipfs-bitswap';
import { createBitswap } from 'ipfs-bitswap';
import { LevelBlockstore } from 'blockstore-level';
import type { MultihashHasher } from 'multiformats';
import { sha256, sha512 } from 'multiformats/hashes/sha2';
import { identity } from 'multiformats/hashes/identity';
import type { DefaultBlockType, RawBlockType } from '../../mate/utils.js';
import type { SkNetwork } from './network.js';

export interface SkfsOptions {
  path: string;
  useMemoryBb?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultLevel = AbstractLevel<any, string, Uint8Array>;

export type DefaultSunLevel = AbstractSublevel<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AbstractLevel<any, string, Uint8Array>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  string,
  string
>;

export const leveldb_prefix = '.leveldb/';

const hashers: MultihashHasher[] = [sha256, sha512, identity];

export class Skfs {
  constructor(options: SkfsOptions) {
    this._datadb = generateLevelDb({
      useMemoryBb: options.useMemoryBb,
      path: `${options.path}_data_db`,
    });
    this._blockdb = generateLevelDb({
      useMemoryBb: options.useMemoryBb,
      path: `${options.path}_block_db`,
    });
    this.datastore = new LevelDatastore(
      this._datadb as unknown as Level<string, Uint8Array>,
    );
    this.blockstore = new LevelBlockstore(
      this._blockdb as unknown as Level<string, Uint8Array>,
    );
    this.skCache = this._datadb.sublevel('sk_cache_db');
  }

  #bitswap!: Bitswap;
  datastore: LevelDatastore;
  blockstore: LevelBlockstore;
  // default db
  _datadb: DefaultLevel;
  _blockdb: DefaultLevel;
  // origin kv store
  skCache: DefaultSunLevel;

  get bitswap(): Bitswap {
    if (!this.#bitswap) {
      throw new Error('bitswap not init');
    }
    return this.#bitswap;
  }

  open = async (): Promise<void> => {
    await this._blockdb.open();
    await this._datadb.open();
    await this.datastore.open();
    await this.skCache.open();
  };

  async initBitswap(network: SkNetwork): Promise<void> {
    this.#bitswap = createBitswap(network.network.node, this.blockstore, {
      hashLoader: {
        getHasher: async (codecOrName: string | number) => {
          const hasher = hashers.find((hasher) => {
            return hasher.code === codecOrName || hasher.name === codecOrName;
          });

          if (hasher != null) {
            return await Promise.resolve(hasher);
          }

          throw new Error(
            `Could not load hasher for code/name "${codecOrName}"`,
          );
        },
      },
    });
  }

  /**
   * put any ArrayBuffer data
   * @param key
   * @param data
   * @returns
   */
  put = async (key: string, data: Uint8Array): Promise<Key> => {
    const idKey = new Key(key);
    return await this.datastore.put(idKey, data);
  };

  /**
   * @description put multiformats block
   * @param block multiformats block
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  putCborBlock = async (block: DefaultBlockType<any>): Promise<Key> => {
    const key = new Key(block.cid.toString());
    return await this.datastore.put(key, block.bytes);
  };

  putRawBlock = async (block: RawBlockType): Promise<Key> => {
    const key = new Key(block.cid.toString());
    return await this.datastore.put(key, block.value);
  };

  get = async (cid: string): Promise<Uint8Array | undefined> => {
    const key = new Key(cid);
    try {
      const data = await this.datastore.get(key);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.notFound) {
        return undefined;
      } else {
        throw new Error(error);
      }
    }
  };

  del = async (cid: string): Promise<void> => {
    const key = new Key(cid);
    await this.datastore.delete(key);
  };

  clear = async (): Promise<void> => {
    await this.skCache.clear();
    await this._datadb.clear();
    await this._blockdb.clear();
  };

  cacheGetExist = async (key: string): Promise<string> => {
    const res = await this.cacheGet(key);
    if (!res) {
      throw new Error(`cacheGet ${key} result not exist`);
    }
    return res;
  };

  cacheGet = async (key: string): Promise<string | undefined> => {
    try {
      const data = await this.skCache.get(key);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.notFound) {
        return undefined;
      } else {
        throw new Error(error);
      }
    }
  };
  cachePut = async (key: string, data: string): Promise<void> => {
    return await this.skCache.put(key, data);
  };

  close = async (): Promise<void> => {
    await this.skCache.close();
    await this.datastore.close();
    await this._datadb.close();
    await this._blockdb.close();
  };
}

export const generateLevelDb = <
  KDefault = string,
  VDefault = Uint8Array,
>(options: {
  useMemoryBb?: boolean;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): AbstractLevel<any, KDefault, VDefault> => {
  if (options.useMemoryBb) {
    return new MemoryLevel({
      keyEncoding: 'utf8',
      valueEncoding: 'view',
    });
  }

  return new Level<KDefault, VDefault>(`${leveldb_prefix}${options.path}`, {
    keyEncoding: 'utf8',
    valueEncoding: 'view',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as unknown as AbstractLevel<any, KDefault, VDefault>;
};
