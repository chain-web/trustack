import { bytes } from 'multiformats';
import { Mpt } from '../../skfs/mpt.js';

// 操作已经存储的块索引
export class BlockRoot {
  constructor(opts?: { mpt?: Mpt }) {
    this.db = opts?.mpt || new Mpt('block_root');
    this.db.initRootTree();
  }
  // 块cid存储在一个类似二维数组的结构里，setSize是内层数组的单组大小
  static setSize = 100_0000n;

  dbMap = new Map<string, Mpt>();

  db: Mpt;

  getDb(index: bigint): Mpt {
    const key = index.toString();
    if (!this.dbMap.has(key)) {
      const db = new Mpt(`block_${index}`);
      db.initRootTree();
      this.dbMap.set(key, db);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.dbMap.get(key)!;
  }

  get root(): string {
    this.commit();
    return bytes.toHex(this.db.root);
  }

  set root(root: string) {
    this.db.root = bytes.fromHex(root) as Buffer;
  }

  // 根据区块高度，算出所在set信息
  getIndex = (number: bigint): { setIndex: bigint; curIndex: bigint } => {
    const setIndex = number / BlockRoot.setSize;
    const curIndex = number % BlockRoot.setSize;
    return {
      setIndex,
      curIndex,
    };
  };

  addBlockToRootNode = async (cid: string, number: bigint): Promise<void> => {
    const { setIndex, curIndex } = this.getIndex(number);
    const mpt = this.getDb(setIndex);
    await mpt.put(curIndex.toString(), cid);
  };

  // 删除指定块之后的所有块数据
  // deleteFromStartNUmber = async (number: BigNumber) => {
  //   const { setIndex, curIndex } = this.genIndex(number);
  //   const set = this.rootNode.Links[setIndex];
  //   let deleted = [];
  //   if (set) {
  //     // 删除当前set中的部分
  //     const setData = (await this.db.dag.get(set.Hash)).value;
  //     deleted.push(...setData.slice(curIndex));
  //     const newSetData = setData.splice(0, curIndex);
  //     const newSetCid = await this.db.dag.put(newSetData);
  //     set.Hash = newSetCid;
  //   }
  //   while (this.rootNode.Links.length > setIndex + 1) {
  //     const poped = this.rootNode.Links.pop();
  //     if (poped) {
  //       const setData = (await this.db.dag.get(poped.Hash)).value;
  //       deleted = deleted.concat(setData);
  //     }
  //   }
  //   message.info(`deleteFromStartNUmber ${number}`, deleted);
  //   return deleted;
  // };

  // 获取指定高度的块cid
  getBlockCidByNumber = async (number: bigint): Promise<string | undefined> => {
    const { curIndex, setIndex } = this.getIndex(number);
    const mpt = this.getDb(setIndex);
    const cidBuf = await mpt.get(curIndex.toString());
    if (cidBuf) {
      return bytes.toString(cidBuf);
    }
  };

  // 获取指定高度的块，所在set，并且只包含指定块之后的块
  // getSetAfterNumber = async (number: bigint) => {
  //   const { curIndex } = this.genIndex(number);
  //   const setData = await this.getSetByNumber(number);
  //   setData?.splice(0, curIndex);
  //   return setData;
  // };

  commit = async (): Promise<void> => {
    for (const [index, mpt] of this.dbMap.entries()) {
      await this.db.put(index, mpt.root);
    }
  };

  closeDb = async (): Promise<void> => {
    await this.db.close();
    for (const [_index, mpt] of this.dbMap.entries()) {
      await mpt.close();
    }
  };
}
