import { BranchNode, ExtensionNode, LeafNode } from '@ethereumjs/trie';
import { CID, bytes } from 'multiformats';
import { Mpt } from '../../lib/skfs/mpt.js';

export class StateRoot {
  constructor(opts?: { mpt?: Mpt }) {
    this.mpt = opts?.mpt || new Mpt('state_root');
    this.mpt.initRootTree();
  }
  mpt: Mpt;

  get root(): string {
    return bytes.toHex(this.mpt.root);
  }

  async size(): Promise<number> {
    let count = 0;
    // cost lots of time, bad performance
    await this.mpt.trie.walkTrie(
      this.mpt.root,
      async (_, node, keyProgress, walkController) => {
        if (node instanceof BranchNode || node instanceof ExtensionNode) {
          walkController.allChildren(node, keyProgress);
        } else if (node instanceof LeafNode) {
          count++;
        }
      },
    );
    // TODO: why 1.1? why count not equal to size?
    return Math.round(count * 1.1);
  }

  put = async (did: string, cid: string): Promise<void> => {
    await this.mpt.put(did, cid);
  };
  get = async (did: string): Promise<CID | undefined> => {
    const cid = await this.mpt.get(did);
    if (cid) {
      return CID.parse(bytes.toString(cid));
    }
  };

  async close(): Promise<void> {
    await this.mpt.close();
  }
}
