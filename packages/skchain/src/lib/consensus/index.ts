import { CID, bytes } from 'multiformats';
import { Block } from '../../mate/block.js';
import type { BlockService } from '../ipld/blockService/blockService.js';
import { chainState } from '../state/index.js';
import { LifecycleStap } from '../state/lifecycle.js';
import type { SkNetwork } from '../skfs/network.js';
import { PubsubTopic } from '../skfs/network.js';
import { message } from '../../utils/message.js';
import {
  CONSENSUS_NODE_PERCENT,
  CONSENSUS_TIME_WINDOW_BASE,
  DO_CONSENSUS_INTERVAL,
} from '../../config/index.js';
import { NodeCollect } from './nodeCollect.js';
// import { Slice } from './slice.js';

interface ConsensusNewBlockData {
  cid: string;
  number: bigint;
}

interface PossibleChain {
  contribute: bigint; // 从分叉点开始，这条子链的打包者contribute的和
  // 子链的块
  blockMap: Map<
    string,
    {
      cid: string;
      block: Block;
      blockRoot: string;
    }
  >;
  // 子链也可能会有子链
  possibleChain: PossibleChain;
}

export enum NewBlockActions {
  // 合法的新区块
  NEXT_BLOCK = 'NEXT_BLOCK',
  // 合法的当前区块
  HEDAER_BLOCK = 'HEDAER_BLOCK',
  // 无效的区块
  INVALID_BLOCK = 'INVALID_BLOCK',
}

export class Consensus {
  constructor(blockService: BlockService, network: SkNetwork) {
    this.blockService = blockService;
    this.network = network;
    this.nodeCollect = new NodeCollect(this.blockService, this.network);
    // this.slice = new Slice(this.db);
  }

  blockPrefix = 'sk-block-new';
  blockService: BlockService;
  network: SkNetwork;
  nodeCollect: NodeCollect;
  // slice: Slice;
  // 是否已经同步完成，可以进行交易打包和参与共识
  private ready = true; // TODO default is false

  possibleChainMap = new Map<string, PossibleChain>();

  consensusInterval: NodeJS.Timeout | null = null;

  setIsReady = (ready: boolean): void => {
    this.ready = ready;
  };

  isReady = (): boolean => this.ready;

  init = async (): Promise<void> => {
    // await this.slice.init();
    await this.nodeCollect.init();
    // TODO
    await this.subNewBlock();
    this.doConsensus();
    chainState.send('CHANGE', {
      event: LifecycleStap.initedConsensus,
    });
  };

  /**
   * 广播新区块
   * @param nextBlock
   */
  public pubNewBlock = async (nextBlock: Block): Promise<void> => {
    const blockCid = await nextBlock.toCborBlock();
    // TODO
    // const nextData: ConsensusNewBlockData = {
    //   number: nextBlock.header.number,
    //   cid: blockCid.cid.toString(),
    // };
    // await this.db.pubsub.publish(
    //   this.blockPrefix,
    //   bytes.fromString(JSON.stringify(nextData)),
    // );
    await this.blockService.addBlock(nextBlock);
    chainState.send('CHANGE', {
      event: LifecycleStap.newBlock,
      data: [blockCid.cid.toString(), nextBlock.header.number],
    });
  };

  // 接收其他节点广播的新区块
  subNewBlock = async (): Promise<void> => {
    this.network.subscribe(PubsubTopic.BLOCK, async (data) => {
      const newData: ConsensusNewBlockData = JSON.parse(bytes.toString(data));
      const blockBinary = await this.blockService.db.getBlock(
        CID.parse(newData.cid),
      );
      if (!blockBinary) {
        throw new Error('block not found');
      }
      const newBlock = await Block.fromBinary(blockBinary);
      const headerBlock = await this.blockService.getHeaderBlock();
      const action = await this.processNewBlock(newBlock, headerBlock);
      await this.addAction(action, newBlock);
    });
  };

  addAction = async (
    action: NewBlockActions,
    newBlock: Block,
  ): Promise<void> => {
    const isConsensusTimeWindow = await this.inConsensusTimeWindow();
    if (isConsensusTimeWindow) {
      if (action === NewBlockActions.NEXT_BLOCK) {
        this.blockService.blockBuffer.addBlock(newBlock);
      }
    }
  };

  private async doConsensus() {
    const isConsensusTimeWindow = await this.inConsensusTimeWindow();
    if (!isConsensusTimeWindow) {
      // do consensus, to pick next block
      // POC
    } else {
      // wait for consensus time window
      this.consensusInterval && clearTimeout(this.consensusInterval);
      this.consensusInterval = setTimeout(() => {
        this.doConsensus();
      }, DO_CONSENSUS_INTERVAL);
    }
  }

  private inConsensusTimeWindow = async (): Promise<boolean> => {
    const headerBlock = await this.blockService.getHeaderBlock();
    const timeWindow =
      headerBlock.header.difficulty * CONSENSUS_TIME_WINDOW_BASE;
    const now = Date.now();
    if (now - headerBlock.header.ts > timeWindow) {
      return false;
    }
    // 收到的打包量大于总活跃节点量的 X%
    if (
      (this.blockService.blockBuffer.blockCount /
        this.nodeCollect.activeNodeCount) *
        100 >
      CONSENSUS_NODE_PERCENT
    ) {
      return false;
    }
    return true;
  };

  processNewBlock = async (
    newBlock: Block,
    headerBlock: Block,
  ): Promise<NewBlockActions> => {
    // console.log('receive new block', newBlock);
    // console.log(headerBlock);

    if (newBlock.header.number === headerBlock.header.number) {
      // 接收到的块小于等于当前最新块
      message.info('receive block: old');
      // 验证收到的块是否跟自己的本地存储块hash是否相同
      const savedBlock = await this.blockService.getBlockByNumber(
        newBlock.header.number,
      );
      if (savedBlock?.hash === newBlock.hash) {
        message.info('receive block: check pass');
        return NewBlockActions.HEDAER_BLOCK;
      } else {
        // TODO 对比收到的块和自己本地块的contribute
      }
    } else {
      // 收到的块是比自己节点存储的更新的
      message.info('receive block: new');
      if (headerBlock.header.number < newBlock.header.number) {
        // 收到的是下一个块
        if (newBlock.header.parent === headerBlock.hash) {
          // 验证通过是下一个块
          // await this.blockService.addBlockCidByNumber(
          //   newData.cid,
          //   newBlock.header.number,
          // );
          // await this.transAction.stopThisBlock();
          // chainState.send('CHANGE', {
          //   event: LifecycleStap.receivedNewBlock,
          // });
          return NewBlockActions.NEXT_BLOCK;
        }
      }
      // TODO 验证收到的块的合法性,验证过程会
      // this.possibleChainMap.set()
      //
      // 更新自己的本地存储块
      // await this.blockService.addBlock(newBlock);
    }
    return NewBlockActions.INVALID_BLOCK;
  };

  // compareContribute = async (_block: Block) => {
  //   // 对比相同高度两个block的sum contribute
  //   // 如果存储的contribute相等，就用上一block的hash的后几位，计算来进行确定性随即
  // };

  async stop(): Promise<void> {
    await this.nodeCollect.stop();
    this.consensusInterval && clearTimeout(this.consensusInterval);
  }
}
