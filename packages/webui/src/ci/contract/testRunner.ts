import { evalCode } from '@trustack/contract';
import { bytes } from 'multiformats';

export const runContractBundleTest = async (): Promise<boolean> => {
  const codeByte = (await import('./test.contract.js')) as unknown as {
    default: Uint8Array;
  };
  const codeString = bytes.toString(codeByte.default);

  const res = await evalCode(
    `${codeString};const func = new __contract_class_name__(); func.getValue();`,
  );
  return res.funcResult === '10000000000000n';
};
