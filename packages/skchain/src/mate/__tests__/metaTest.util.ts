import { testAccounts } from '@trustack/common';
import { genesis } from '../../config/testnet.config.js';
import { BloomFilter } from '../../lib/ipld/logsBloom/bloomFilter.js';
import { signById } from '../../lib/p2p/did.js';
import type { Account } from '../account.js';
import { newAccount } from '../account.js';
import { Address } from '../address.js';
import { Block } from '../block.js';
import { Transaction } from '../transaction.js';
import { createCborBlock, createEmptyStorageRoot } from '../utils.js';

export const testDid = testAccounts[0].id;
export const createTestAccount = async (): Promise<Account> => {
  const storageRoot = await createEmptyStorageRoot();
  const account = newAccount(testDid, storageRoot);
  return account;
};

export const createTestTranscation = async (): Promise<Transaction> => {
  const trans = new Transaction({
    from: new Address(testDid),
    accountNonce: 1n,
    cu: 1n,
    cuLimit: 10n,
    recipient: new Address(testDid),
    amount: 1n,
    ts: Date.now(),
  });

  const signature = await signById(
    testAccounts[0].privKey,
    await trans.getSignatureData(),
  );
  trans.signature = signature;
  return trans;
};

export const createTestBlock = async (
  number = 1n,
  parent = genesis.parent,
): Promise<Block> => {
  const transaction = await createTestTranscation();
  await transaction.genHash();
  const block = new Block({
    parent,
    stateRoot: 'stateRoot',
    transactionsRoot: 'transactionsRoot',
    receiptsRoot: 'receiptsRoot',
    logsBloom: new BloomFilter(),
    difficulty: 1n,
    number,
    cuLimit: 1n,
    cuUsed: 1n,
    ts: Date.now(),
    slice: [1, 1],
    extraData: null,
    body: (await createCborBlock([])).cid,
  });
  block.body = { transactions: [transaction.hash] };
  await block.genHash();
  return block;
};
