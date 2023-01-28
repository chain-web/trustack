/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TransactionAction } from '../../transaction/index.js';
import { Bloom } from './bloom.js';

export class BloomFilter {
  constructor() {
    this.bloom = new Bloom(TransactionAction.MAX_TRANS_LIMIT * 20, 5);
  }
  private bloom;

  add = (key: string) => this.bloom.add(key);

  contains = (key: string) => this.bloom.contains(key);

  getData = (): string => this.bloom.getData();

  loadData = (data: string) => this.bloom.loadData(data);
}
