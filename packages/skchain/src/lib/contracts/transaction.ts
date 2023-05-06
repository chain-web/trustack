// export const skSdk = window.sk;
// import { skSdk } from '../contract/skSdk';

export interface TransactionContractParam {
  from: string;
  recipient: string;
  amount: bigint;
}

// export const transContract = (
//   trans: TransactionContractParam,
// ): {
//   account: string;
//   opCode: skSdk.accountOpCodes;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   value: any;
// }[] => {
//   const fromAccount = skSdk.getAccount(trans.from);
//   if (fromAccount.getBlance().minus(trans.amount).isLessThan(0)) {
//     return [
//       {
//         account: trans.from,
//         opCode: skSdk.errorCodes['Insufficient balance'],
//         value: skSdk.errorCodes['Insufficient balance'],
//       },
//     ];
//   }

//   return [
//     {
//       account: trans.from,
//       opCode: skSdk.accountOpCodes.minus,
//       value: trans.amount,
//     },
//     {
//       account: trans.recipient,
//       opCode: skSdk.accountOpCodes.plus,
//       value: trans.amount,
//     },
//   ];
// };
