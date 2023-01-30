import type { CID } from 'multiformats';
import { BloomFilter } from '../lib/ipld/logsBloom/bloomFilter.js';
import type { Transaction } from './transaction.js';
import type { DefaultBlockType } from './utils.js';
import { createBlock, takeBlockValue } from './utils.js';

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
  extraData: { [key: string]: unknown } | null; // 当前块自定义数据，不能超过？kb
  body: CID;
}

// 区块，块数据体基础数据结构
export interface BlockBodyData {
  transactions: Transaction['hash'][];
}

export type BlockBinary = {
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
};

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

export const initBlockBody = {
  transactions: [],
};

export class Block {
  constructor(header: Omit<BlockHeaderData, 'hash'>) {
    if (!header.extraData) {
      header.extraData = {};
    }
    this.header = header;
  }
  hash!: string;
  header: BlockHeaderData;
  body?: BlockBodyData;

  /**
   * parse a block,只包含块头，但不解析body
   */
  public static fromBinary = async (
    binary: Uint8Array,
  ): Promise<Omit<Block, 'body'>> => {
    const blockData = await takeBlockValue<BlockBinary>(binary);
    const headerData = blockData.header;
    const header: Partial<BlockHeaderData> = {};
    blockHeaderKeys.map((key, i) => {
      header[key] = headerData[i] as never;
      if (key === 'logsBloom') {
        // load BloomFilter data
        header['logsBloom'] = new BloomFilter();
        header['logsBloom'].loadData(headerData[i] as string);
      }
      if (bnHeaderKeys.includes(key)) {
        // 恢复bignumber
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (header[key] as any) = BigInt(headerData[i] as string);
      }
    });

    const newBlock = new Block(header as BlockHeaderData);
    newBlock.hash = blockData.hash;
    return newBlock;
  };

  /**
   * parse body from block data
   */
  updateBodyByBinary = async (data: Uint8Array): Promise<void> => {
    this.body = await takeBlockValue<Block['body']>(data);
  };

  genHash = async (): Promise<void> => {
    const obj = {
      ...this.header,
      logsBloom: this.header.logsBloom.getData(),
      body: this.body || null,
    };
    // ts，hash 不参与生成块hash
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (obj as any).hash;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (obj as any).ts;
    const hash = (await createBlock(obj)).cid.toString();
    this.hash = hash;
  };

  toBlock = async (): Promise<DefaultBlockType<unknown>> => {
    if (!this.hash) {
      await this.genHash();
    }
    if (this.body) {
      this.header.body = (await createBlock(this.body)).cid;
    }
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
    const block = await createBlock(blockData);
    return block;
  };
}
