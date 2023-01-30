import { Key } from 'interface-datastore';
import type { LevelDb } from 'datastore-level';
import { LevelDatastore } from 'datastore-level';
import type { DefaultBlockType } from '../../mate/utils.js';
// import type { SKFSNetwork } from './network/index.js';

export interface SkfsOptions {
  path: string | LevelDb;
  // net: SKFSNetwork;
}

export class Skfs {
  constructor(options: SkfsOptions) {
    this.store = new LevelDatastore(options.path);
  }

  store: LevelDatastore;

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
