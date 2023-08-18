import { bytes } from 'multiformats';

export const runBuildContractTest = async (): Promise<boolean> => {
  const codeByte = (await import('./test.contract.js')) as unknown as {
    default: Uint8Array;
  };
  const codeString = bytes.toString(codeByte.default);

  console.log(codeString);
  // TODO: eval code to test
  return true;
};
