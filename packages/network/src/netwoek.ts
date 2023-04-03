import type { Libp2p, Libp2pOptions } from 'libp2p';
import { createLibp2p } from 'libp2p';
import type { Datastore } from 'interface-datastore';
import type { PeerId } from '@libp2p/interface-peer-id';

interface NetworkOptions {
  peerId: PeerId;
  datastore: Datastore;
}

export class Network {
  constructor(opts: NetworkOptions) {
    this.peerId = opts.peerId;
    this.datastore = opts.datastore;
  }
  peerId: PeerId;
  datastore: Datastore;
  node!: Libp2p;

  async init(opts: Libp2pOptions): Promise<void> {
    this.node = await createLibp2p({
      peerId: this.peerId,
      datastore: this.datastore,
      start: false,
      ...opts,
    });
  }

  async start(): Promise<void> {
    await this.node.start();
  }
}
