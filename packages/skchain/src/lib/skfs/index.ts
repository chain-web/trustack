import { Key } from 'interface-datastore';
import { MemoryLevel } from 'memory-level';
import type { LevelDb } from 'datastore-level';
import { LevelDatastore } from 'datastore-level';
import { Level } from 'level';
import type { DefaultBlockType } from '../../mate/utils.js';
// import type { SKFSNetwork } from './network/index.js';

export interface SkfsOptions {
  path: string;
  useMemoryBb?: boolean;
  // net: SKFSNetwork;
}

export class Skfs {
  constructor(options: SkfsOptions) {
    this._db = this.generateDb(options);
    this.store = new LevelDatastore(this._db);
  }

  store: LevelDatastore;
  _db: LevelDb;

  generateDb = (options: SkfsOptions): LevelDb => {
    if (options.useMemoryBb) {
      return new MemoryLevel({
        keyEncoding: 'utf8',
        valueEncoding: 'view',
      });
    }

    return new Level<string, Uint8Array>(options.path, {
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
}
