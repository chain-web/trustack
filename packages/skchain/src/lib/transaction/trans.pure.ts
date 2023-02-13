import { bytes } from 'multiformats';
import type { transMeta } from '../../mate/transaction.js';
import { Transaction } from '../../mate/transaction.js';
import { message } from '../../utils/message.js';
import { signById } from '../p2p/did.js';
import { chainState } from '../state/index.js';
import { Address } from './../../mate/address.js';

export const genTransMeta = async (
  tm: Pick<transMeta, 'amount' | 'recipient'> & {
    payload?: Transaction['payload'];
  },
  did: string,
  priv: string,
): Promise<transMeta | undefined> => {
  // 只是做交易检查和预处理
  if (!chainState.getSnapshot().matches('active')) {
    message.error('wait for inited');
    return;
  }
  if (!tm.amount || !tm.recipient) {
    // 校验
    message.error('need trans amount and recipient');
    return;
  }
  const signMeta = {
    ...tm,
    from: new Address(did),
    ts: Date.now(),
    cu: BigInt(100), // todo
  };
  const transMeta: transMeta = {
    ...signMeta,
    // 这里使用交易原始信息通过ipfs存储后的cid进行签名会更好？
    signature: await signById(priv, bytes.fromString(JSON.stringify(signMeta))),
  };
  return transMeta;
};

export const genTransactionClass = async (
  tm: transMeta,
): Promise<Transaction> => {
  const trans = new Transaction({
    from: tm.from,
    cu: tm.cu,
    cuLimit: BigInt(10000),
    payload: tm.payload,
    recipient: tm.recipient,
    accountNonce: BigInt(0),
    amount: tm.amount,
    ts: tm.ts,
  });
  await trans.genHash();
  return trans;
};

// export const runContract = async (
//   account: Account,
//   trans: Transaction,
//   chain: SKChain,
//   contract: Contract,
// ): Promise<{
//   account: string;
//   opCode: string;
//   value: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   funcReturn: any;
// }> => {
//   const storage = (await chain.db.get(account.storageRoot)).value[0];
//   const storeObj = JSON.parse(storage || '[]');
//   for (let i = 0; i < storeObj.length; i++) {
//     const ele = storeObj[i];
//     if (ele.type === 'sk_slice_db') {
//       for (let j = 0; j < Object.keys(ele.value).length; j++) {
//         const key = Object.keys(ele.value)[j];
//         const cid = ele.value[key];
//         const val = await chain.db.dag.get(CID.parse(cid));
//         ele.value[key] = val.value;
//       }
//     }
//   }
//   const code = await chain.db.block.get(account.codeCid);
//   const { saves, funcReturn } = contract.runFunction(
//     code,
//     trans,
//     JSON.stringify(storeObj),
//   );
//   // console.log('res', saves);
//   for (let i = 0; i < saves.length; i++) {
//     const ele = saves[i];
//     if (ele.type === 'sk_slice_db') {
//       for (let j = 0; j < Object.keys(ele.value).length; j++) {
//         const key = Object.keys(ele.value)[j];
//         const value = ele.value[key];
//         const cid = await chain.db.dag.put(value);
//         ele.value[key] = cid.toString();
//       }
//     }
//   }
//   // console.log('res', saves);
//   return {
//     account: trans.recipient.did,
//     opCode: accountOpCodes.updateState,
//     value: JSON.stringify(saves),
//     funcReturn: funcReturn || null,
//   };
// };
