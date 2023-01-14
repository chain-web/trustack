import { LifecycleStap } from './lib/state/lifecycle.js';
import { GenesisConfig } from './config/types.js';
import { chainState } from './lib/state/index.js';
import { Skfs } from 'lib/skfs/index.js';
import { SKFSNetwork } from 'lib/skfs/network/index.js';
// import { skCacheKeys } from './lib/ipfs/key';
// import { SKDB } from './lib/ipfs/ipfs.interface';
// import { TransactionAction } from './lib/transaction';
// import { Ipld } from './lib/ipld';
// import {version} from '../package.json';
// import { Consensus } from './lib/consensus';
// import { Genesis } from './lib/genesis';
// import { TransactionTest } from './lib/transaction/test';
// import { message } from './utils/message';
// import { BlockService } from './lib/ipld/blockService/blockService';
// import { PinService } from './lib/ipld/pinService';

export interface SKChainOption {
  genesis: GenesisConfig;
  datastorePath: string;
}

export class SKChain {
  constructor(option?: SKChainOption) {
    this.chainState.send('INITIALIZE');
    // this.version = version;
    this.db = new Skfs({
      path: option?.datastorePath || 'skfs',
      net: new SKFSNetwork(),
    });
    // this.ipld = new Ipld(this);
    // this.blockService = new BlockService(this);
    // this.did = this.db.cache.get(skCacheKeys.accountId);
    // this.genesis = new Genesis(this, option.genesis);
    // this.consensus = new Consensus(this);
    // this.transAction = new TransactionAction(this);
    // this.transTest = new TransactionTest(this);
    // this.pinService = new PinService(this);

    // 对外暴露的一些方法
    // this.transaction = this.transAction.transaction;
    // this.deploy = this.transAction.deploy;
  }

  version = '1.0.0';
  // 数据存取服务
  db: Skfs;
  // 创世配置
  // genesis: Genesis;
  // // 交易
  // transAction: TransactionAction;
  // transTest: TransactionTest;
  // // 数据操作
  // ipld: Ipld;

  // blockService: BlockService;
  // pinService: PinService;

  // // 共识
  // consensus: Consensus;
  // // 当前节点did
  // did: string;
  // inited = false;

  // // public methods
  // transaction;
  // deploy;

  chainState = chainState;

  run = () => {
    this.chainState.send('START');
    this.chainState.send('CHANGE', { event: LifecycleStap.startCreateSKChain });
  };

  // init = async () => {
  //   try {
  //     await this.blockService.init();
  //     await this.genesis.checkGenesisBlock();
  //     // await this.db.swarm.connect(
  //     //   '/ip4/47.99.47.82/tcp/4003/ws/p2p/12D3KooWDd6gAZ1Djtt4bhAG7djGKM32ETxiiiJCCWnH5ypK2csa',
  //     // );
  //     lifecycleEvents.emit(LifecycleStap.initingIpld);
  //     await this.ipld.init();
  //     lifecycleEvents.emit(LifecycleStap.initedIpld);
  //     lifecycleEvents.emit(LifecycleStap.initingTransaction);
  //     await this.transAction.init();
  //     lifecycleEvents.emit(LifecycleStap.initedTransaction);
  //     await this.consensus.init();
  //   } catch (error) {
  //     message.error('init error', error);
  //   }

  //   this.inited = true;
  // };

  // getHeaderBlock = async () => {
  //   return await this.blockService.getHeaderBlock();
  // };
}

new SKChain();
