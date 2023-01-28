/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import init, { evaluate } from 'cwjsr/web/cwjsr';

let evalFunc: typeof evaluate;

export const getEval = async () => {
  if (!evalFunc) {
    if (init) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (init as any)();
    }
    evalFunc = evaluate;
  }
  return evalFunc;
};
