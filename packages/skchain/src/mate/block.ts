import { Transaction } from './transaction.js';
import { CID } from 'multiformats';
import { BloomFilter } from '../lib/ipld/logsBloom/bloomFilter.js';
import { encode, decode, ByteView, code } from '@ipld/dag-cbor';

export interface createBlockOpt {
  transactions: Transaction[];
}

// 区块，块头基础数据结构
export interface BlockHeaderData {
  parent: string; // 父级区块 stateRoot
  stateRoot: string; // 全账户状态树根节点hash
  transactionsRoot: string; // 当前块的交易树根节点hash
  receiptsRoot: string; // 当前块的收据树根节点hash
  logsBloom: BloomFilter; // 当前块交易接收者的bloom，用于快速查找
  difficulty: bigint; // 难度，用来调整出块时间，由于不挖矿，具体实现待定
  number: bigint; // 当前块序号
  cuLimit: bigint; // 当前块，计算量上限
  cuUsed: bigint; // 当前块消耗的计算量
  ts: number; // 当前块最后一个交易的时间戳
  slice: [number, number]; // 分片信息
  extraData?: { [key: string]: unknown }; // 当前块自定义数据，不能超过？kb
  body: CID;
}

// 区块，块数据体基础数据结构
export interface BlockBodyData {
  transactions: Transaction['hash'][];
}

export type BlockBinary = ByteView<{
  header: (
    | string
    | number
    | bigint
    | BloomFilter
    | [number, number]
    | {
        [key: string]: unknown;
      }
    | CID
  )[];
  hash: string;
}>;

const blockHeaderKeys: (keyof BlockHeaderData)[] = [
  'body',
  'cuLimit',
  'cuUsed',
  'difficulty',
  'extraData',
  'logsBloom',
  'number',
  'parent',
  'receiptsRoot',
  'slice',
  'stateRoot',
  'transactionsRoot',
  'ts',
];

const bnHeaderKeys = ['cuLimit', 'cuUsed', 'difficulty', 'number'];

export class Block {
  constructor(header: Omit<BlockHeaderData, 'hash'>) {
    if (!header.extraData) {
      header.extraData = {};
    }
    this.header = header;
  }
  hash!: string;
  header: BlockHeaderData;
  body: BlockBodyData = {
    transactions: [],
  };

  /**
   * 创建一个新的块
   */
  // public static createNew = (): Block => {
  //   const blockHeader = {}
  //   const blockBody = {}
  //   return new Block(blockHeader, blockBody)
  // };

  /**
   * 从已有cid，读取一个区块,只包含块头，但不解析body
   */
  public static fromBinaryOnlyHeader = (
    binary: BlockBinary,
  ): Omit<Block, 'body'> => {
    const blockData = decode<BlockBinary>(binary);
    const headerData = blockData.header;
    const header: Partial<BlockHeaderData> = {};
    blockHeaderKeys.map((key, i) => {
      header[key] = headerData[i];
      if (key === 'logsBloom') {
        // load BloomFilter data
        header[key] = new BloomFilter();
        header[key]?.loadData(headerData[i]);
      }
      if (bnHeaderKeys.includes(key)) {
        // 恢复bignumber
        (header[key] as any) = BigInt(headerData[i]);
      }
    });

    const newBlock = new Block(header as BlockHeaderData);
    newBlock.hash = blockData.hash;
    return newBlock;
  };

  /**
   * 从已有cid，读取一个区块,包含块头、body
   */
  public static fromBinary = ([blockBinary, bodyBinary]: [
    BlockBinary,
    ByteView<BlockBodyData>,
  ]): Block => {
    const block = Block.fromBinaryOnlyHeader(blockBinary) as Block;
    block.body = decode<BlockBodyData>(bodyBinary);
    return block;
  };

  genHash = async () => {
    const obj = {
      ...this.header,
      logsBloom: this.header.logsBloom.getData(),
      body: this.body,
    };
    // ts，hash 不参与生成块hash
    delete (obj as any).hash;
    delete (obj as any).ts;
    // TODO block?
    const hash = CID.create(1, code, encode(obj)).toString();
    if (!hash) {
      throw new Error('hash is null');
    }
    this.hash = hash;
  };

  bodyToBinary = () => {
    return encode(this.body);
  };

  toBinary = () => {
    const bodyBinary = this.bodyToBinary();
    // TODO block?
    const bodyCid = CID.asCID(bodyBinary);
    if (!bodyCid) {
      throw new Error('bodyCid is null');
    }
    this.header.body = bodyCid;
    const blockData = {
      header: blockHeaderKeys.map((ele) => {
        let val = this.header[ele];
        if (bnHeaderKeys.includes(ele)) {
          // bigNumber转为string存储
          return (val as bigint).toString();
        }
        if (ele === 'logsBloom') {
          val = this.header.logsBloom.getData();
        }
        return val;
      }),
      hash: this.hash,
    };
    return [encode(blockData), bodyBinary];
  };
}
