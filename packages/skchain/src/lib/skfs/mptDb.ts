import { MemoryLevel } from 'memory-level';

import type { BatchDBOp, DB } from '@ethereumjs/util';
import type { AbstractLevel } from 'abstract-level';

const ENCODING_OPTS = { keyEncoding: 'utf8', valueEncoding: 'utf8' };

export class MptDb implements DB<string, string> {
  readonly _leveldb: AbstractLevel<
    string | Buffer | Uint8Array,
    string,
    string
  >;

  constructor(
    leveldb?: AbstractLevel<
      string | Buffer | Uint8Array,
      string,
      string
    > | null,
  ) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS);
  }

  open(): Promise<void> {
    return this._leveldb.open();
  }

  async get(key: string): Promise<string | undefined> {
    let value: string | undefined = undefined;
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS);
    } catch (error: any) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error;
      }
    }
    return value;
  }

  async put(key: string, val: string): Promise<void> {
    await this._leveldb.put(key, val, ENCODING_OPTS);
  }

  async del(key: string): Promise<void> {
    await this._leveldb.del(key, ENCODING_OPTS);
  }

  async batch(opStack: BatchDBOp<string, string>[]): Promise<void> {
    await this._leveldb.batch(opStack, ENCODING_OPTS);
  }

  shallowCopy(): MptDb {
    return new MptDb(this._leveldb);
  }
  close = async (): Promise<void> => {
    await this._leveldb.close();
  };
}
