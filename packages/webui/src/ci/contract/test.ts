import { evalFunction } from 'skchain';
import { buildCode } from './builder';

export const runBuildContractTest = async (): Promise<boolean> => {
  const code = await buildCode();
  // console.log(code);
  // evalFunction(``);
  // TODO: eval code to test
  return true;
};
