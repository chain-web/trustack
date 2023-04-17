import { Network, createConfig } from '@trustack/network';
import type { LevelDatastore } from 'datastore-level';
import type { Message } from '@libp2p/interface-pubsub';
import type { DidJson } from '../p2p/did.js';
import { createPeerIdFromDidJson } from '../p2p/did.js';

export enum PubsubTopic {
  DID = 'did',
}

export class SkNetwork {
  constructor(opts: { tcpPort: number; wsPort: number }) {
    this.tcpPort = opts.tcpPort;
    this.wsPort = opts.wsPort;
  }

  private tcpPort: number;
  private wsPort: number;
  private _network!: Network;
  get network(): Network {
    if (!this._network) {
      throw new Error('network not init');
    }
    return this._network;
  }

  #subscribeMap = new Map<PubsubTopic, ((data: Uint8Array) => void)[]>();

  async init(did: DidJson, datastore: LevelDatastore): Promise<void> {
    const peerId = await createPeerIdFromDidJson(did);
    this._network = new Network({
      peerId,
      datastore,
    });

    await this.network.init(
      createConfig({ tcpPort: this.tcpPort, wsPort: this.wsPort }),
    );
    await this.network.start();
    this.network.node.pubsub.addEventListener(
      'message',
      ({ detail: msg }: CustomEvent<Message>) => {
        const handlers = this.#subscribeMap.get(msg.topic as PubsubTopic);
        if (handlers) {
          handlers.forEach((handler) => handler(msg.data));
        }
      },
    );
  }

  async publish(topic: PubsubTopic, data: Uint8Array): Promise<void> {
    await this.network.node.pubsub.publish(topic, data);
  }

  subscribe(topic: PubsubTopic, handler: (data: Uint8Array) => void): void {
    this.#subscribeMap.set(topic, [
      ...(this.#subscribeMap.get(topic) || []),
      handler,
    ]);
    return this.network.node.pubsub.subscribe(topic);
  }

  async stop(): Promise<void> {
    await this.network.node.stop();
  }
}
