import { SKChain } from 'skchain';
import { accounts } from '../page/test/accounts';

export const runTest = async (): Promise<boolean> => {
  const chain = new SKChain();
  chain.run({ user: accounts[0] });
  return true;
};
