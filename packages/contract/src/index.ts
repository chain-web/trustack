export * from '@faithstack/contract_builder';

import { evaluate as evalFn } from '@faithstack/vm';
import { EvalResult } from './proto_ts/eval_result.js';
export { init } from '@faithstack/vm';

export { EvalResult } from './proto_ts/eval_result.js';
export interface EvaluateParams {
  codeString: string[];
  cuLimit: bigint;
  storage: Uint8Array;
}

export const evaluate = (opts: EvaluateParams): EvalResult => {
  const pbRes = evalFn(opts.codeString, opts.cuLimit, opts.storage);
  return EvalResult.fromBinary(pbRes);
};
