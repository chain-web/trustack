import type { DidJson } from 'skchain';
import { SKChain } from 'skchain';
import { clearIndexeddb } from '../utils/db.utils';

export const createTestSkChain = async (account: DidJson): Promise<SKChain> => {
  await clearIndexeddb();
  const chain = new SKChain();
  await chain.run({ user: account });
  return chain;
};
