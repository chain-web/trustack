/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { SKChain } from '../../skChain.js';
import { SKChainLibBase } from '../base.js';

export class PinService extends SKChainLibBase {
  constructor(chain: SKChain) {
    super(chain);
  }

  pin = async (hash: string) => {
    await this.chain.db.pin.add(hash);
  };

  unpin = async (hash: string) => {
    await this.chain.db.pin.rm(hash);
  };

  unpinFromList = async (list: string[]) => {
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      await this.unpin(element);
    }
  };
}
