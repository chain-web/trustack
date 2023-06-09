import { peerid } from '@trustack/common';
import { Transaction } from '../../mate/transaction.js';
import { message } from '../../utils/message.js';
import { chainState } from '../state/index.js';
import { Address } from './../../mate/address.js';

export const genTransactionClass = async (
  amount: Transaction['amount'],
  recipient: Transaction['recipient'],
  did: string,
  priv: string,
  payload: Transaction['payload'],
): Promise<Transaction | undefined> => {
  // 只是做交易检查和预处理
  if (!chainState.getSnapshot().matches('active')) {
    message.error('wait for inited');
    return;
  }
  if (amount === undefined || recipient === undefined) {
    // 校验
    message.error('need trans amount and recipient');
    return;
  }

  const trans = new Transaction({
    from: new Address(did),
    cu: BigInt(1000), // TODO
    cuLimit: BigInt(10000), // TODO
    payload,
    recipient,
    accountNonce: BigInt(0), // TODO
    amount,
    ts: Date.now(),
  });
  trans.signature = await peerid.signById(priv, await trans.getSignatureData());
  await trans.genHash();
  return trans;
};
