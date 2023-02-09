import { LifecycleStap } from './lib/state/lifecycle.js';
import type { GenesisConfig } from './config/types.js';
import { Skfs } from './lib/skfs/index.js';
import { chainState } from './lib/state/index.js';
import { version } from './config/index.js';
// import { skCacheKeys } from './lib/ipfs/key';
// import { SKDB } from './lib/ipfs/ipfs.interface';
// import { TransactionAction } from './lib/transaction/index.js';
// import { Ipld } from './lib/ipld';
// import { Consensus } from './lib/consensus';
import { Genesis } from './lib/genesis/index.js';
import { genesis as testNetGenesis } from './config/testnet.config.js';
import { BlockService } from './lib/ipld/blockService/blockService.js';
import { message } from './utils/message.js';
import { skCacheKeys } from './lib/ipfs/key.js';
import type { DidJson } from './lib/p2p/did.js';
import { genetateDid } from './lib/p2p/did.js';
import { Consensus } from './lib/consensus/index.js';
// import { TransactionTest } from './lib/transaction/test';
// import { message } from './utils/message';
// import { BlockService } from './lib/ipld/blockService/blockService';
// import { PinService } from './lib/ipld/pinService';

export interface SKChainOption {
  genesis: GenesisConfig;
  db?: Skfs;
  blockService?: BlockService;
  datastorePath?: string;
}

export interface SKChainRunOpts {
  user?: DidJson;
}

export class SKChain {
  constructor(option?: SKChainOption) {
    this.chainState.send('INITIALIZE');
    this.db =
      option?.db ||
      new Skfs({
        path: option?.datastorePath || 'skfs',
      });
    // this.ipld = new Ipld(this);
    this.blockService = option?.blockService || new BlockService(this.db);
    // this.did = this.db.cache.get(skCacheKeys.accountId);
    this.genesis = new Genesis(
      this.blockService,
      option?.genesis || testNetGenesis,
    );
    this.consensus = new Consensus(this.db, this.blockService);
    // this.transAction = new TransactionAction();
    // this.transTest = new TransactionTest(this);
    // this.pinService = new PinService(this);

    // 对外暴露的一些方法
    // this.transaction = this.transAction.transaction;
    // this.deploy = this.transAction.deploy;
  }

  version = version;
  // 数据存取服务
  db: Skfs;
  // 创世配置
  genesis: Genesis;
  // // 交易
  // transAction: TransactionAction;
  // transTest: TransactionTest;
  // // 数据操作
  // ipld: Ipld;

  blockService: BlockService;
  // pinService: PinService;

  // // 共识
  consensus: Consensus;
  // did of current node
  did!: string;

  // // public methods
  // transaction;
  // deploy;

  chainState = chainState;

  run = async (opts?: SKChainRunOpts): Promise<void> => {
    this.chainState.send('START');
    this.chainState.send('CHANGE', { event: LifecycleStap.startCreateSKChain });
    const user = opts?.user || (await genetateDid());
    await this.db.cachePut(skCacheKeys.accountId, user.id);
    await this.db.cachePut(skCacheKeys.accountPrivKey, user.privKey);
    this.did = user.id;
    try {
      await this.db.open();
      await this.blockService.init();
      await this.genesis.checkGenesisBlock();
      // await this.db.swarm.connect(
      //   '/ip4/47.99.47.82/tcp/4003/ws/p2p/12D3KooWDd6gAZ1Djtt4bhAG7djGKM32ETxiiiJCCWnH5ypK2csa',
      // );
      // this.chainState.send('CHANGE', {
      //   event: LifecycleStap.initingTransaction,
      // });
      // await this.transAction.init();
      // this.chainState.send('CHANGE', {
      //   event: LifecycleStap.initedTransaction,
      // });
      await this.consensus.init();
      this.chainState.send('STARTED');
    } catch (error) {
      message.error('init error', error as string);
    }
  };

  stop = async (): Promise<void> => {
    await this.blockService.close();
    await this.db.close();
    this.chainState.send('STOP');
  };

  // getHeaderBlock = async () => {
  //   return await this.blockService.getHeaderBlock();
  // };
}
