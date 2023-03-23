import type { AbstractLevel } from 'abstract-level';
import { BaseDatastore } from 'datastore-core';
import type { Datastore, Key } from 'interface-datastore';
import { generateLevelDb, leveldb_prefix } from './index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultDatastoreDb = AbstractLevel<any, Uint8Array, Uint8Array>;

export class IpfsDatastore extends BaseDatastore implements Datastore {
  constructor(path?: string) {
    super();
    this._db = generateLevelDb({
      path: `${leveldb_prefix}${path || 'ipfs_datastore_db'}`,
    });
  }

  _db: DefaultDatastoreDb;
  open(): Promise<void> {
    return this._db.open();
  }
  put(key: Key, value: Uint8Array): Promise<void> {
    return this._db.put(key.uint8Array(), value);
  }
  get(key: Key): Promise<Uint8Array> {
    return this._db.get(key.uint8Array());
  }
  async has(key: Key): Promise<boolean> {
    try {
      const _data = await this.get(key);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return false;
    }
  }
  delete(key: Key): Promise<void> {
    return this._db.del(key.uint8Array());
  }
  close(): Promise<void> {
    return this._db.close();
  }
}
