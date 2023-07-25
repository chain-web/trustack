import { buildCodeString } from '@trustack/contract_builder';

export const buildCode = async (): Promise<string> => {
  const codeString = await import('./test.contract.ts?raw');
  // console.log(codeString);
  const { code } = await buildCodeString(codeString.default);

  return code;
};
