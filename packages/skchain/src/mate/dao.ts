import type { BloomFilter } from '../lib/ipld/logsBloom/bloomFilter';
import type { Address } from './address';

export interface DaoMeta {
  owner: Dao['owner'];
  dbs: Dao['dbs'];
  accountBloom: Dao['accountBloom'];
  contracts: Dao['contracts'];
}

// DAO, decentralized autonomous organization 元数据
export class Dao {
  constructor(meta: DaoMeta) {
    this.owner = meta.owner;
    this.dbs = meta.dbs;
    this.accountBloom = meta.accountBloom;
    this.contracts = meta.contracts;
  }

  owner: Address;
  dbs: string[];
  contracts: string[];
  accountBloom: BloomFilter;
}
