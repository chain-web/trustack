import { createNode, DidJson, SKChain } from 'sk-chain';
export class SkChain {
  sk!: SKChain;
  started = false;

  init = async (account: DidJson) => {
    this.sk = await createNode({
      networkid: 'testnet',
      account,
    });
    this.started = true;
  };
}
