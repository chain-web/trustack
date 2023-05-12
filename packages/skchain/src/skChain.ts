import { LifecycleStap } from './lib/state/lifecycle.js';
import type { GenesisConfig } from './config/types.js';
import { chainState } from './lib/state/index.js';
import { version } from './config/index.js';
import { TransactionAction } from './lib/transaction/index.js';
import { message } from './utils/message.js';
import { skCacheKeys } from './lib/skfs/key.js';
import type { DidJson } from './lib/p2p/did.js';
import { genetateDid } from './lib/p2p/did.js';
import { Consensus } from './lib/consensus/index.js';
import { logClassPerformance } from './utils/performance.js';
import { SkNetwork } from './lib/skfs/network.js';
import { genInitOption } from './lib/state/initOption.js';
import type { Skfs } from './lib/skfs/index.js';
import type { BlockService } from './lib/ipld/blockService/blockService.js';

export interface SKChainOption {
  name: string;
  genesis: GenesisConfig;
  db: Skfs;
  blockService: BlockService;
  datastorePath: string;
  tcpPort: number;
  wsPort: number;
}

export interface SKChainRunOpts {
  user?: DidJson;
}

@logClassPerformance()
export class SKChain {
  constructor(option?: Partial<SKChainOption>) {
    const initOption = genInitOption(option);
    this.chainState.name = initOption.name;
    message.init();
    this.chainState.send('INITIALIZE', {
      data: initOption,
    });
    this.db = initOption.db;
    this.network = new SkNetwork({
      tcpPort: initOption.tcpPort,
      wsPort: initOption.wsPort,
    });
    this.blockService = initOption.blockService;

    this.consensus = new Consensus(this.blockService, this.network);
    this.transAction = new TransactionAction(this.blockService, this.consensus);
    // this.transTest = new TransactionTest(this);
    // this.pinService = new PinService(this);

    // 对外暴露的一些方法
    this.transaction = this.transAction.transaction.bind(this.transAction);
    this.deploy = this.transAction.deploy.bind(this.transAction);
    this.getAccount = this.blockService.getAccount.bind(this.blockService);
  }

  version = version;
  // 数据存取服务
  db: Skfs;
  network: SkNetwork;
  message = message;

  // 交易
  transAction: TransactionAction;
  // transTest: TransactionTest;

  private blockService: BlockService;
  // pinService: PinService;

  private consensus: Consensus;
  // did of current node
  did!: string;

  // // public methods
  transaction;
  deploy;
  getAccount;

  chainState = chainState;

  async run(opts?: SKChainRunOpts): Promise<void> {
    this.chainState.send('START');
    this.chainState.send('CHANGE', { event: LifecycleStap.startCreateSKChain });
    const user = opts?.user || (await genetateDid());
    await this.db.cachePut(skCacheKeys.accountId, user.id);
    await this.db.cachePut(skCacheKeys.accountPrivKey, user.privKey);
    this.did = user.id;
    try {
      await this.db.open();
      await this.network.init(user, this.db.datastore);
      await this.db.initBitswap(this.network);
      await this.blockService.init();
      // await this.db.swarm.connect(
      //   '/ip4/47.99.47.82/tcp/4003/ws/p2p/12D3KooWDd6gAZ1Djtt4bhAG7djGKM32ETxiiiJCCWnH5ypK2csa',
      // );

      await this.transAction.init();
      await this.blockService.goToNextBlock();

      await this.consensus.init();
      this.chainState.send('STARTED');
    } catch (error) {
      message.error('init error', error as string);
    }
  }

  async stop(): Promise<void> {
    await this.consensus.stop();
    await this.transAction.stop();
    await this.blockService.close();
    await this.network.stop();
    await this.db.close();
    this.chainState.send('STOP');
  }
}
