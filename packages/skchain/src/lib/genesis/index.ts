import type { GenesisConfig } from '../../config/types.js';
import type { Account } from '../../mate/account.js';
import { newAccount } from '../../mate/account.js';
import { createEmptyStorageRoot } from '../../mate/utils.js';
import type { BlockService } from '../ipld/blockService/blockService.js';
import { chainState } from '../state/index.js';
import { LifecycleStap } from '../state/lifecycle.js';
import { createGenesisBlock } from './genesis.util.js';
export class Genesis {
  constructor(blockService: BlockService, genesis: GenesisConfig) {
    this.blockService = blockService;
    this.genesis = genesis;
  }
  private blockService: BlockService;
  // 创世配置
  private genesis: GenesisConfig;
  checkGenesisBlock = async (): Promise<void> => {
    chainState.send('CHANGE', {
      event: LifecycleStap.checkingGenesisBlock,
    });
    if (!this.blockService.needGenseis()) {
      // 不是完全冷启动
      // this.checkGenesis();
      chainState.send('CHANGE', {
        event: LifecycleStap.checkedGenesisBlock,
      });
    } else {
      // 完全冷启动
      chainState.send('CHANGE', {
        event: LifecycleStap.creatingGenesisBlock,
      });
      // 初始化预设账号
      const stateRoot = await this.initAlloc(this.genesis.alloc);
      // 创建创世区块

      const genesisBlock = await createGenesisBlock(this.genesis, stateRoot);

      // 将创世块cid存储到块索引
      await this.blockService.addBlock(genesisBlock);
      chainState.send('CHANGE', {
        event: LifecycleStap.checkedGenesisBlock,
      });
    }
  };

  // 设置预设账号
  initAlloc = async (alloc: GenesisConfig['alloc']): Promise<string> => {
    const accounts: Account[] = [];
    if (alloc) {
      const dids = Object.keys(alloc);
      for (const did of dids) {
        const storageRoot = await createEmptyStorageRoot();
        const account = newAccount(did, storageRoot);
        // 给每个初始账号充值
        account.plusBlance(alloc[did].balance, '1641000000000');
        accounts.push(account);
      }
    }
    for (const account of accounts) {
      await this.blockService.addAccount(account);
    }
    return this.blockService.stateRoot.root;
  };

  // 检查链合法性
  // checkGenesis(_genesisBlock: Block) {
  //   // 暂时未确定，要搞什么
  // }
}
