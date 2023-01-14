import BigNumber from 'bignumber.js';
import { Address, SKChain } from 'sk-chain';
import { Contract } from './index.d';
import { skService } from '../../../state/sk.state';
export const contractAddressKey = 'map-contract-address';
interface ContractOptions {
  amount?: BigNumber;
}

export const createContractService = <T>(
  address: string,
  chain: SKChain,
  opts?: ContractOptions,
) => {
  const contractService = new Proxy(
    {},
    {
      get(_obj, mothed: string) {
        return (...arg: any) => {
          return chain.transaction({
            recipient: new Address(address),
            amount: opts?.amount || new BigNumber(0),
            payload: {
              mothed,
              args: [...arg],
            },
          });
        };
      },
    },
  ) as T;

  return contractService;
};

export let mapContract: Contract;

skService.onChange((ctx) => {
  if (ctx.chain.started) {
    mapContract = createContractService<Contract>(
      localStorage.getItem(contractAddressKey)!,
      skService.state.context.chain.sk,
    );
  }
});
