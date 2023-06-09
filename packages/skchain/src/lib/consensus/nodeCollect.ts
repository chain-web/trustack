import { wait } from '@trustack/common';
import { bytes } from 'multiformats';
import {
  NETWORK_GET_NODE_COUNT_INTERVAL,
  NETWORK_PUB_NODE_COUNT_INTERVAL,
} from '../../config/index.js';
import { message } from '../../utils/message.js';
import { tryParseExistJson } from '../../utils/utils.js';
import type { BlockService } from '../ipld/blockService/blockService.js';
import type { SkNetwork } from '../skfs/network.js';
import { PubsubTopic } from '../skfs/network.js';

export class NodeCollect {
  constructor(blockService: BlockService, network: SkNetwork) {
    this.blockService = blockService;
    this.network = network;
  }

  blockService: BlockService;
  network: SkNetwork;

  public nodeCount = 0;
  public activeNodeRate = 0;
  private pubActiveNodeRateTimeout!: NodeJS.Timeout;
  private updateActiveNodeRateTimeout!: NodeJS.Timeout;
  private updatingActiveNodeCount = false;
  private publishingActiveNodeCount = false;

  public get activeNodeCount(): number {
    return this.nodeCount * this.activeNodeRate;
  }

  async init(): Promise<void> {
    await this.subActiveNodeCount();
    // TODO fix this
    // await this.startUpdateActiveNodeCount();
  }

  private async startUpdateActiveNodeCount(): Promise<void> {
    this.updateActiveNodeRateTimeout = setTimeout(() => {
      this.updateActiveNodeCount();
    }, NETWORK_GET_NODE_COUNT_INTERVAL);
    this.pubActiveNodeRateTimeout = setTimeout(() => {
      this.pubActiveNodeCount();
    }, NETWORK_PUB_NODE_COUNT_INTERVAL);
  }

  // activeCount = allNodeCount * inDBAccountRate * activeNodeRate
  // inDBAccountRate = inDbAccountCount / allDBNodeCount
  // activeNodeRate = activeCount / peers.length
  // allNodeCount = activeCount / (inDBAccountRate * activeNodeRate) = peers.length / inDBAccountRate
  private async updateActiveNodeCount(): Promise<void> {
    if (!this.updateActiveNodeRateTimeout) {
      // force stop
      return;
    }
    this.updatingActiveNodeCount = true;
    let activeCount = 0;
    let inDBAccountCount = 0;
    const peers = await this.network.network.node.peerStore.all();
    message.info('peers.length', peers.length);

    if (peers.length > 0) {
      for (let i = 0; i < peers.length; i++) {
        if (!this.updateActiveNodeRateTimeout) {
          // force stop
          return;
        }
        const peer = peers[i];
        const ping = await this.network.ping(peer.id, 10000);
        if (ping > 0) {
          activeCount++;
        }

        if (await this.blockService.stateRoot.get(peer.id.toString())) {
          inDBAccountCount++;
        }
      }
      const accountCount = await this.blockService.stateRoot.size();
      const inDBAccountRate = Math.max(inDBAccountCount, 1) / accountCount;
      this.activeNodeRate = activeCount / peers.length;
      this.nodeCount = Math.round(peers.length / inDBAccountRate);
    }
    this.updatingActiveNodeCount = false;

    this.updateActiveNodeRateTimeout = setTimeout(() => {
      this.updateActiveNodeCount();
    }, NETWORK_GET_NODE_COUNT_INTERVAL);
  }

  private async waitForTimeout(): Promise<void> {
    while (this.updatingActiveNodeCount || this.publishingActiveNodeCount) {
      await wait(200);
    }
  }

  private async pubActiveNodeCount(): Promise<void> {
    if (!this.pubActiveNodeRateTimeout) {
      // force stop
      return;
    }
    // message.info('activeNodeCount', this.nodeCount, this.activeNodeRate);
    this.publishingActiveNodeCount = true;
    this.activeNodeCount > 0 &&
      (await this.network.publish(
        PubsubTopic.ACTIVENODE,
        bytes.fromString(JSON.stringify([this.nodeCount, this.activeNodeRate])),
      ));
    this.publishingActiveNodeCount = false;
    this.pubActiveNodeRateTimeout = setTimeout(() => {
      this.pubActiveNodeCount();
    }, NETWORK_PUB_NODE_COUNT_INTERVAL);
  }

  private async subActiveNodeCount(): Promise<void> {
    this.network.subscribe(PubsubTopic.ACTIVENODE, (data) => {
      // TODO
      const cur = tryParseExistJson(bytes.toString(data));
      // this.activeNodeCountBuffer.push(cur);
      // if (this.activeNodeCountBuffer.length > NETWORK_MAX_NODE_COUNT_Buffer) {
      //   this.activeNodeCountBuffer.shift();
      // }
      // // get average of active node count
      // this.activeNodeCount =
      //   this.activeNodeCount +
      //   _.sum(this.activeNodeCountBuffer) /
      //     this.activeNodeCountBuffer.length /
      //     2;
    });
  }

  async stop(): Promise<void> {
    // have some problem, can not stop all async function right now
    clearTimeout(this.pubActiveNodeRateTimeout);
    clearTimeout(this.updateActiveNodeRateTimeout);
    this.pubActiveNodeRateTimeout = undefined as unknown as NodeJS.Timeout;
    this.updateActiveNodeRateTimeout = undefined as unknown as NodeJS.Timeout;
    await this.waitForTimeout();
  }
}
