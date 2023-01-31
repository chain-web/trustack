import { Trie } from '@ethereumjs/trie';
import { Level } from 'level';
import { bytes } from 'multiformats';
import { MptDb } from './mptDb.js';

interface MptOptions {
  useMemDb?: boolean;
}

/**
 * mpt
 * 基础数据结构
 */
export class Mpt {
  constructor(opts?: MptOptions) {
    if (opts?.useMemDb) {
      this.db = new MptDb();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.db = new MptDb(new Level('sk_mpt') as any);
  }

  private db: MptDb;
  private _trie?: Trie;

  get trie(): Trie {
    if (this._trie) {
      return this._trie;
    } else {
      throw new Error('need run initRootTree before use trie.');
    }
  }

  get root(): Buffer {
    return this.trie.root();
  }

  set root(root: Buffer) {
    this.trie.root(root);
  }

  initRootTree = (): void => {
    this._trie = new Trie({
      db: this.db,
    });
  };

  put = async (key: string, value: string): Promise<void> => {
    await this.trie.put(
      bytes.fromString(key) as Buffer,
      bytes.fromString(value) as Buffer,
    );
  };

  get = async (key: string): Promise<Buffer | null> => {
    return await this.trie.get(bytes.fromString(key) as Buffer);
  };

  // getKey = async (key: string): Promise<string | undefined> => {
  //   // TODO MPT
  //   const contentCid = this.rootTree.Links.find((ele) => ele.Name === key);
  //   if (contentCid) {
  //     return contentCid.Hash.toString();
  //   }
  // };

  // updateKey = async (key: string, data: CID) => {
  //   const index = this.rootTree.Links.findIndex((ele) => ele.Name === key);
  //   const link = createLink(key, (await this.db.block.stat(data)).size, data);
  //   if (index !== -1) {
  //     this.rootTree.Links[index] = link;
  //   } else {
  //     this.rootTree.Links.push(link);
  //   }
  // };

  // save = async () => {
  //   return await this.db.dag.put(this.rootTree);
  // };
}
