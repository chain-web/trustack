import { Address, SKChain } from 'skchain';
import { accounts } from '../page/test/accounts';
import { clearIndexeddb } from '../utils/db.utils';

export const runTest = async (): Promise<boolean> => {
  await clearIndexeddb();
  const chain = new SKChain();
  await chain.run({ user: accounts[0] });
  await chain.transaction({
    amount: 10n,
    recipient: new Address(accounts[4].id),
  });
  return true;
};
