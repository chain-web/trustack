import * as wasm from 'cwjsr/node/cwjsr';

export const getEval = async (): Promise<unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return wasm as any;
};
