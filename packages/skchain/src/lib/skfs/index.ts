import { Key } from 'interface-datastore';
import { MemoryLevel } from 'memory-level';
import type { LevelDb } from 'datastore-level';
import type { AbstractLevel, AbstractSublevel } from 'abstract-level';
import { LevelDatastore } from 'datastore-level';
import { Level } from 'level';
import type { DefaultBlockType } from '../../mate/utils.js';
// import type { SKFSNetwork } from './network/index.js';

export interface SkfsOptions {
  path: string;
  useMemoryBb?: boolean;
  // net: SKFSNetwork;
}

export const leveldb_prefix = '.leveldb/';

export class Skfs {
  constructor(options: SkfsOptions) {
    this._db = this.generateDb(options);
    this.store = new LevelDatastore(this._db);
    this.skCache = this._db.sublevel('sk_cache_db');
  }

  store: LevelDatastore;
  // default db
  _db: LevelDb;
  // origin kv store
  skCache: AbstractSublevel<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AbstractLevel<any, string, Uint8Array>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    string,
    string
  >;

  generateDb = (options: SkfsOptions): LevelDb => {
    if (options.useMemoryBb) {
      return new MemoryLevel({
        keyEncoding: 'utf8',
        valueEncoding: 'view',
      });
    }

    return new Level<string, Uint8Array>(`${leveldb_prefix}${options.path}`, {
      keyEncoding: 'utf8',
      valueEncoding: 'view',
    }) as unknown as LevelDb;
  };

  open = async (): Promise<void> => {
    await this.store.open();
  };

  put = async (key: string, data: Uint8Array): Promise<void> => {
    const idKey = new Key(key);
    return await this.store.put(idKey, data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  putBlock = async (block: DefaultBlockType<any>): Promise<void> => {
    const key = new Key(block.cid.toString());
    return await this.store.put(key, block.bytes);
  };

  get = async (cid: string): Promise<Uint8Array> => {
    const key = new Key(cid);
    return await this.store.get(key);
  };

  cacheGet = async (key: string): Promise<string> => {
    return await this.skCache.get(key);
  };
  cachePut = async (key: string, data: string): Promise<void> => {
    return await this.skCache.put(key, data);
  };
}
