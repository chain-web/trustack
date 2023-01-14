import Dexie, { Table } from 'dexie';

export type TransTypes = 'take' | 'build' | 'levelUp';

export interface MapTransDb {
  id?: number;
  gridId: string;
  tx: string;
  type: TransTypes;
  ts: number;
}

export class MapDbDexie extends Dexie {
  trans!: Table<MapTransDb>;

  constructor() {
    super('map.db');
    this.version(1).stores({
      trans: '++id, tx, type, ts, gridId', // Primary key and indexed props
    });
  }
}

export const mapDb = new MapDbDexie();
