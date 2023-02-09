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

  put = async (did: string, cid: string): Promise<void> => {
    await this.mpt.put(did, cid);
  };
  get = async (did: string): Promise<CID | undefined> => {
    const cid = await this.mpt.get(did);
    if (cid) {
      return CID.parse(bytes.toString(cid));
    }
  };
}
