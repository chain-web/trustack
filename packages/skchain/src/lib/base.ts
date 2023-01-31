import type { SKChain } from '../skChain.js';
export class SKChainLibBase {
  constructor(chain: SKChain) {
    this.chain = chain;
  }

  chain: SKChain;
}
