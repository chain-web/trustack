import { bytes } from 'multiformats';
import { Mpt } from '../../lib/skfs/mpt.js';

export class StateRoot {
  constructor(opts?: { mpt?: Mpt }) {
    this.mpt = opts?.mpt || new Mpt('state_root');
    this.mpt.initRootTree();
    this.put = this.mpt.put;
    this.get = this.mpt.get;
  }
  mpt: Mpt;

  get root(): string {
    return bytes.toHex(this.mpt.root);
  }

  put: Mpt['put'];
  get: Mpt['get'];
}
