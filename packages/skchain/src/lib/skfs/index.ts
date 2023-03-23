import { Key } from 'interface-datastore';
import { MemoryLevel } from 'memory-level';
import type { AbstractLevel, AbstractSublevel } from 'abstract-level';
import { LevelDatastore } from 'datastore-level';
import { Level } from 'level';
import type { DefaultBlockType, RawBlockType } from '../../mate/utils.js';
// import type { SKFSNetwork } from './network/index.js';

export interface SkfsOptions {
  path: string;
  useMemoryBb?: boolean;
  // net: SKFSNetwork;
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

export class Skfs {
  constructor(options: SkfsOptions) {
    this._db = generateLevelDb(options);
    this.store = new LevelDatastore(
      this._db as unknown as Level<string, Uint8Array>,
    );
    this.skCache = this._db.sublevel('sk_cache_db');
  }

  store: LevelDatastore;
  // default db
  _db: DefaultLevel;
  // origin kv store
  skCache: DefaultSunLevel;

  open = async (): Promise<void> => {
    await this._db.open();
    await this.store.open();
    await this.skCache.open();
  };

  /**
   * put any ArrayBuffer data
   * @param key
   * @param data
   * @returns
   */
  put = async (key: string, data: Uint8Array): Promise<void> => {
    const idKey = new Key(key);
    return await this.store.put(idKey, data);
  };

  /**
   * @description put multiformats block
   * @param block multiformats block
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  putCborBlock = async (block: DefaultBlockType<any>): Promise<void> => {
    const key = new Key(block.cid.toString());
    return await this.store.put(key, block.bytes);
  };

  putRawBlock = async (block: RawBlockType): Promise<void> => {
    const key = new Key(block.cid.toString());
    return await this.store.put(key, block.value);
  };

  get = async (cid: string): Promise<Uint8Array | undefined> => {
    const key = new Key(cid);
    try {
      const data = await this.store.get(key);
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
    await this.store.delete(key);
  };

  clear = async (): Promise<void> => {
    await this.skCache.clear();
    await this._db.clear();
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
    await this.store.close();
    await this._db.close();
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
