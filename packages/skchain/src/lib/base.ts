import type { SKChain } from '../skChain';
export class SKChainLibBase {
  constructor(chain: SKChain) {
    this.chain = chain;
  }

  chain: SKChain;
}
