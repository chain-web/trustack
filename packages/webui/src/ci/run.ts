import { Address, LifecycleStap, TransStatus, evalFunction } from 'skchain';
import { testContracts } from '@trustack/common';
import { bytes } from 'multiformats';
import { accounts } from '../page/test/accounts';
import { createTestSkChain } from './util';

export const runTest = async (): Promise<boolean> => {
  const chain = await createTestSkChain(accounts[0]);
  await chain.transaction({
    amount: 10n,
    recipient: new Address(accounts[4].id),
  });
  return true;
};

export const runSkvmTest = async (): Promise<boolean> => {
  const add = () => {
    return 1 + 1;
  };
  const res = await evalFunction(add.toString());
  return res.funcResult === '2';
};

export const runContractTest = async (): Promise<boolean> => {
  const chain = await createTestSkChain(accounts[2]);

  const { trans } = await chain.deploy({
    payload: bytes.fromString(testContracts.tokenContract.code),
  });

  if (!trans) {
    throw new Error('no trans');
  }
  const { trans: trans2 } = await chain.transaction({
    amount: 0n,
    recipient: trans.recipient,
    payload: {
      method: 'send',
      args: [new Address(accounts[0].id).toParam(), 100n],
    },
  });
  if (!trans2) {
    throw new Error('no trans2');
  }

  await chain.chainState.waitForLifecycle(LifecycleStap.newBlock);

  const account = await chain.getAccount(trans.recipient.did);
  if (!account) {
    throw new Error('no contract account');
  }
  const storage2 = await chain.db.get(account.storageRoot.toString());
  if (!storage2) {
    throw new Error('no storage');
  }
  const status = await chain.transAction.transStatus(trans.hash);
  if (status.status !== TransStatus.transed) {
    return false;
  }
  const status2 = await chain.transAction.transStatus(trans2.hash);
  if (status2.status !== TransStatus.transed) {
    return false;
  }
  return Boolean(bytes.toString(storage2).match(`"${accounts[0].id}":100n`));
};
