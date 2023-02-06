import { Block } from '../../../mate/block.js';
import { skCacheKeys } from '../../ipfs/key.js';
import { message } from '../../../utils/message.js';
import { LifecycleStap } from '../../state/lifecycle.js';
import { StateRoot } from '../../../mate/mpts/stateRoot.js';
import type { Skfs } from '../../skfs/index.js';
import { chainState } from '../../state/index.js';
import { BlockRoot } from './blockRoot.js';
import { isTxInBlock } from './util.js';

// 管理、已经存储的块索引
export class BlockService {
  constructor(
    db: Skfs,
    opts?: {
      blockRoot?: BlockRoot;
      stateRoot?: StateRoot;
    },
  ) {
    this.db = db;
    this.blockRoot = opts?.blockRoot || new BlockRoot();
    this.stateRoot = opts?.stateRoot || new StateRoot();
  }
  db: Skfs;
  blockRoot: BlockRoot;
  stateRoot: StateRoot;

  // 连续的已经验证通过的块高，在节点同步完成后是最新块
  checkedBlockHeight = 0n;

  private headerBlockNumber = 0n;

  getBlockByNumber = async (
    number: bigint,
  ): Promise<Omit<Block, 'body'> | undefined> => {
    const blockCid = await this.blockRoot.getBlockCidByNumber(number);
    if (blockCid) {
      const blockData = await this.db.get(blockCid);
      if (blockData) {
        const block = await Block.fromBinary(blockData);
        return block;
      }
    }
  };
  getHeaderBlock = async (): Promise<Omit<Block, 'body'> | undefined> => {
    return await this.getBlockByNumber(this.headerBlockNumber);
  };

  addBlock = async (block: Block): Promise<void> => {
    if (block.header.number > 0n) {
      // check block
      const prevBlock = await this.getBlockByNumber(block.header.number - 1n);
      if (this.checkOneBlock(block, prevBlock)) {
        throw new Error('checkOneBlock faild');
      }
      // update checked block
      if (block.header.number - 1n === this.checkedBlockHeight) {
        this.checkedBlockHeight = block.header.number;
      }
    }
    // save block
    const blockData = await block.toBlock();
    await this.db.putBlock(blockData);
    await this.blockRoot.addBlockToRootNode(
      blockData.cid.toString(),
      block.header.number,
    );
    // TODO
    // await this.chain.pinService.pin(cid);
  };

  // /**
  //  * @description 添加或更新指定块的cid
  //  * @param cid
  //  * @param number
  //  */
  // addBlockCidByNumber = async (cid: string, number: bigint): Promise<void> => {
  //   const prevBlock = await this.getBlockByNumber(this.checkedBlockHeight);
  //   const blockData = await this.db.get(cid);
  //   if (!blockData) {
  //     throw new Error('can not find cid data');
  //   }
  //   const nextBlock = await Block.fromBinary(blockData);
  //   if (this.checkOneBlock(nextBlock, prevBlock)) {
  //     this.checkedBlockHeight = nextBlock.header.number;
  //   }
  //   await this.blockRoot.addBlockToRootNode(cid, number);
  //   // TODO
  //   // await this.chain.pinService.pin(cid);
  // };

  // 删除指定块及其之后的块
  deleteFromStartNUmber = async (number: bigint): Promise<void> => {
    // const deleted = await this.blockRoot.deleteFromStartNUmber(number);
    // await this.chain.pinService.unpinFromList(deleted);
  };

  // 是否完全冷启动
  needGenseis = (): boolean => {
    return this.headerBlockNumber === 0n;
  };

  init = async (): Promise<void> => {
    chainState.send('CHANGE', {
      event: LifecycleStap.initingBlockService,
    });
    const rootCid = this.db.cacheGet(skCacheKeys['sk-block']);
    if (!rootCid) {
      await this.initGenseis();
    } else {
      await this.checkBlockRoot();
    }
    chainState.send('CHANGE', {
      event: LifecycleStap.initedBlockService,
    });
  };

  initGenseis = async (): Promise<void> => {};

  checkBlockRoot = async (): Promise<void> => {
    let prevBlock = await this.getBlockByNumber(this.checkedBlockHeight);

    let checkeFinish = false;
    while (!checkeFinish) {
      chainState.send('CHANGE', {
        event: LifecycleStap.checkingBlockIndex,
        data: [
          `${this.checkedBlockHeight.toString()}/${this.headerBlockNumber}`,
        ],
      });

      const checkBlock = await this.getBlockByNumber(
        this.checkedBlockHeight + 1n,
      );

      if (
        this.checkOneBlock(checkBlock, prevBlock) &&
        checkBlock?.header.number
      ) {
        this.checkedBlockHeight = checkBlock?.header.number;
      } else {
        checkeFinish = true;
        if (checkBlock) {
          //  check不通过，纠正数据, 删除错误块及其之后的块
          await this.deleteFromStartNUmber(this.checkedBlockHeight);

          chainState.send('CHANGE', {
            event: LifecycleStap.checkedBlockIndex,
            data: [
              'checkedBlockHeight: ',
              'delete after',
              this.checkedBlockHeight.toString(),
            ],
          });
        }
      }
      prevBlock = checkBlock;
    }

    chainState.send('CHANGE', {
      event: LifecycleStap.checkedBlockIndex,
      data: [
        'checkedBlock warn: ',
        'delete after',
        this.checkedBlockHeight.toString(),
      ],
    });
  };

  // check two block is adjacent
  checkOneBlock = (
    block: Block | undefined,
    prev: Block | undefined,
  ): boolean => {
    if (!block || !prev) {
      return false;
    }
    if (block.header.parent !== prev.hash) {
      return false;
    }
    if (block.header.number !== prev.header.number + 1n) {
      return false;
    }
    return true;
  };

  // 检查收到的blockRoot与自己本地的是否一致
  // syncFromBlockRoot = async (blockRoot: string) => {
  //   lifecycleEvents.emit(LifecycleStap.syncingHeaderBlock, blockRoot);
  //   const newBlockRoot = new BlockRoot(this.chain.db);
  //   await newBlockRoot.init(blockRoot);
  //   const newHeaderBlock = await newBlockRoot.getHeaderBlock();
  //   let prevBlock = await this.getBlockByNumber(this.checkedBlockHeight);
  //   while (this.checkedBlockHeight.isLessThan(newHeaderBlock.header.number)) {
  //     // 逐个set的去把区块同步到本地
  //     const set = await newBlockRoot.getSetAfterNumber(
  //       this.checkedBlockHeight.plus(1),
  //     );
  //     if (set) {
  //       for (const blockCid of set) {
  //         // 每个set再逐个block校验并同步
  //         const checkBlock = await Block.fromCidOnlyHeader(
  //           blockCid,
  //           this.chain.db,
  //         );
  //         if (this.checkOneBlock(checkBlock, prevBlock)) {
  //           this.checkedBlockHeight = this.checkedBlockHeight.plus(1);

  //           await this.addBlockCidByNumber(blockCid, this.checkedBlockHeight);
  //           prevBlock = checkBlock;
  //           lifecycleEvents.emit(
  //             LifecycleStap.syncingHeaderBlock,
  //             this.checkedBlockHeight.toString(),
  //             '/',
  //             newHeaderBlock.header.number.toString(),
  //           );
  //         } else {
  //           message.info('next block is not prev block + 1');
  //           this.checkedBlockHeight = this.checkedBlockHeight.minus(1);
  //           if (this.checkedBlockHeight.isEqualTo(0)) {
  //             return;
  //           }
  //           await this.deleteFromStartNUmber(this.checkedBlockHeight);
  //           await this.save();
  //           await this.syncFromBlockRoot(blockRoot);
  //           return;
  //         }
  //       }
  //     }
  //   }
  // };

  // 从块头向下查询某个交易发生的块
  findTxBlockWidthDeep = async (
    tx: string,
    deep: number,
  ): Promise<Omit<Block, 'body'> | undefined> => {
    let headerNumber = this.checkedBlockHeight;
    while (deep >= 0 && headerNumber >= 0n) {
      const currBlock = await this.getBlockByNumber(headerNumber);
      if (currBlock && (await isTxInBlock(tx, currBlock.header))) {
        return currBlock;
      }
      headerNumber = headerNumber - 1n;
      deep--;
    }
  };

  close = async (): Promise<void> => {
    await this.blockRoot.closeDb();
    await this.stateRoot.mpt.close();
  };
}
