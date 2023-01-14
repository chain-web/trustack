import { constractHelper, ConstractHelper, BaseContract } from 'sk-chain';
import { factoryLevelUp } from './util';

// 合约数据存储也slice，还没想到好的解决办法
// TODO slice

interface GridItemData {
  id: string;
  owner: string;
  level: number;
  uTime: number;
}

interface UserData {
  rs: {
    coin: BigInt;
    clay: BigInt;
    coal: BigInt;
    blocks: BigInt;
  };
}

export default class Contract extends BaseContract {
  constructor() {
    super();
    // 数据的存储分片还是需要的
    // 真实存在链上的数据kv结构，key 暂定，可能需要方便进行分片，可能是 const did = constractHelper.hash(hexid);
    // value是dag put的cid
    // 外部应用方便直接用dag get，来获取数据
    this.gridDb = constractHelper.createSliceDb<GridItemData>('base32');
    this.userDb = constractHelper.createSliceDb<UserData>('base58');
  }
  userDb: ConstractHelper.SliceDb<UserData>;
  gridDb: ConstractHelper.SliceDb<GridItemData>;

  static levelBase = 3600 * 24 * 1000;
}
