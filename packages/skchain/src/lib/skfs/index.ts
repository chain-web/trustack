// import { LevelDatastore } from 'datastore-level';
import type { SKFSNetwork } from './network/index.js';

export interface SkfsOptions {
  path: string;
  net: SKFSNetwork;
}

export class Skfs {
  constructor(_options: SkfsOptions) {
    // this.store = new LevelDatastore(options.path);
  }

  // store: LevelDatastore;
}
