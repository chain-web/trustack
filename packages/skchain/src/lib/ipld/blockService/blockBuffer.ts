import type { Block } from '../../../mate/block.js';

export class BlockBuffer {
  constructor() {
    this.buffer = new Map();
  }

  buffer: Map<string, Block>;
  blockNumber = 0n;

  addBlock = (block: Block): void => {
    this.buffer.set(block.hash, block);
  };

  getBlock = (cid: string): Block | undefined => {
    return this.buffer.get(cid);
  };

  removeBlock = (cid: string): void => {
    this.buffer.delete(cid);
  };

  hasBlock = (cid: string): boolean => {
    return this.buffer.has(cid);
  };

  getBlockList = (): Block[] => {
    return Array.from(this.buffer.values());
  };
}
