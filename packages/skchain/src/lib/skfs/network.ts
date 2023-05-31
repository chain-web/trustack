import { Network, createConfig } from '@trustack/network';
import type { LevelDatastore } from 'datastore-level';
import type { Message } from '@libp2p/interface-pubsub';
import type { DidJson } from '@trustack/common';
import type { PeerId } from '@libp2p/interface-peer-id';
import type { Multiaddr } from '@multiformats/multiaddr';
import { createPeerIdFromDidJson } from '../p2p/did.js';

export enum PubsubTopic {
  DID = 'did',
  NEW_BLOCK = 'newBlock',
  TRANSACTION = 'transaction',
  ACTIVENODE = 'activeNode',
}

export class SkNetwork {
  constructor(opts: { tcpPort: number; wsPort: number; bootstrap: string[] }) {
    this.tcpPort = opts.tcpPort;
    this.wsPort = opts.wsPort;
    this.bootstrap = opts.bootstrap;
  }

  private tcpPort: number;
  private wsPort: number;
  private bootstrap: string[];
  private _network!: Network;
  get network(): Network {
    if (!this._network) {
      throw new Error('network not init');
    }
    return this._network;
  }

  #subscribeMap = new Map<PubsubTopic, ((data: Uint8Array) => void)[]>();
  private pingMap = new Map<
    NodeJS.Timeout,
    { abortController: AbortController }
  >();

  async init(did: DidJson, datastore: LevelDatastore): Promise<void> {
    const peerId = await createPeerIdFromDidJson(did);
    this._network = new Network({
      peerId,
      datastore,
    });

    await this.network.init(
      createConfig({
        tcpPort: this.tcpPort,
        wsPort: this.wsPort,
        bootstrap: this.bootstrap,
      }),
    );

    await this.network.start();
    this.network.node.services.pubsub.addEventListener(
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
    await this.network.node.services.pubsub.publish(topic, data);
  }

  subscribe(topic: PubsubTopic, handler: (data: Uint8Array) => void): void {
    this.#subscribeMap.set(topic, [
      ...(this.#subscribeMap.get(topic) || []),
      handler,
    ]);
    return this.network.node.services.pubsub.subscribe(topic);
  }

  async ping(
    peerId: PeerId | Multiaddr | Multiaddr[],
    timeout = 5000,
  ): Promise<number> {
    const abortController = new AbortController();
    const pingTimer = setTimeout(() => abortController.abort(), timeout);
    this.pingMap.set(pingTimer, { abortController });
    let ping = -1;
    try {
      ping = await this.network.node.services.ping.ping(peerId, {
        signal: abortController.signal,
      });
      // message.info(`ping ${peerId.toString()} ${ping}ms`);
    } catch (error) {
      // message.info(`ping ${peerId.toString()} error ${error}`);
    }
    clearTimeout(pingTimer);
    return ping;
  }

  async getNetWorkStatus(): Promise<{ peerCount: number }> {
    const peerCount = (await this.network.node.peerStore.all()).length;
    return { peerCount };
  }

  async stop(): Promise<void> {
    this.pingMap.forEach(({ abortController }, pingTimer) => {
      clearTimeout(pingTimer);
      abortController.abort();
    });
    await this.network.node.stop();
  }
}
