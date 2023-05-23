import type { Libp2p, Libp2pOptions } from 'libp2p';
import { createLibp2p } from 'libp2p';
import type { Datastore } from 'interface-datastore';
import type { PeerId } from '@libp2p/interface-peer-id';
import type { PubSub } from '@libp2p/interface-pubsub';
import type { CircuitRelayService } from 'libp2p/circuit-relay';
import type { DualKadDHT } from '@libp2p/kad-dht';
import type { identifyService } from 'libp2p/identify';

interface NetworkOptions {
  peerId: PeerId;
  datastore: Datastore;
}

export type IServiceMap = {
  pubsub: PubSub;
  relay?: CircuitRelayService;
  dht: DualKadDHT;
  identify: ReturnType<ReturnType<typeof identifyService>>;
};

export class Network {
  constructor(opts: NetworkOptions) {
    this.peerId = opts.peerId;
    this.datastore = opts.datastore;
  }
  peerId: PeerId;
  datastore: Datastore;
  node!: Libp2p<IServiceMap>;

  async init(opts: Libp2pOptions<IServiceMap>): Promise<void> {
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
