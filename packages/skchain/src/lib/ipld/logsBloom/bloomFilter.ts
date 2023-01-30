import { MAX_TRANS_LIMIT } from '../../../config/index.js';
import { Bloom } from './bloom.js';

export class BloomFilter {
  constructor() {
    this.bloom = new Bloom(MAX_TRANS_LIMIT * 20, 5);
  }
  private bloom;

  add = (key: string): void => this.bloom.add(key);

  contains = (key: string): boolean => this.bloom.contains(key);

  getData = (): string => this.bloom.getData();

  loadData = (data: string): void => this.bloom.loadData(data);
}
