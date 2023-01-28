import { SKFSNetwork } from './network/index.js';
import { LevelDatastore } from 'datastore-level';

export interface SkfsOptions {
  path: string;
  net: SKFSNetwork;
}

export class Skfs {
  constructor(options: SkfsOptions) {
    // this.store = new LevelDatastore(options.path);
  }

  // store: LevelDatastore;
}
