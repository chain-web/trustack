/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CID } from 'multiformats';
import type { PBNode } from '@ipld/dag-pb';
import { createLink } from '@ipld/dag-pb';
import { message } from './../../utils/message.js';
import type { SKDB } from './../ipfs/ipfs.interface.js';

/**
 * mpt
 * 基础数据结构
 */
export class Mpt {
  constructor(db: SKDB, root: string) {
    this.db = db;
    this.root = root;
  }

  db: SKDB;
  root: string;
  rootTree!: PBNode;

  initRootTree = async () => {
    try {
      this.rootTree = (await this.db.dag.get(CID.parse(this.root))).value;
      if (!this.rootTree) {
        message.error('rootTree is null', this.root);
      }
    } catch (error) {
      message.error(error);
    }
  };

  getKey = async (key: string): Promise<string | undefined> => {
    // TODO MPT
    const contentCid = this.rootTree.Links.find((ele) => ele.Name === key);
    if (contentCid) {
      return contentCid.Hash.toString();
    }
  };

  updateKey = async (key: string, data: CID) => {
    const index = this.rootTree.Links.findIndex((ele) => ele.Name === key);
    const link = createLink(key, (await this.db.block.stat(data)).size, data);
    if (index !== -1) {
      this.rootTree.Links[index] = link;
    } else {
      this.rootTree.Links.push(link);
    }
  };

  save = async () => {
    return await this.db.dag.put(this.rootTree);
  };
}
