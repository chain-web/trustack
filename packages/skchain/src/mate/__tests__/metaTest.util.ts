import type { Account } from '../account.js';
import { newAccount } from '../account.js';
import { createEmptyStorageRoot } from '../utils.js';

export const testDid = '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8';
export const createTestAccount = async (): Promise<Account> => {
  const storageRoot = await createEmptyStorageRoot();
  const account = newAccount(testDid, storageRoot);
  return account;
};
