import initType from './pkg/web/skvm';
export const init = initType;
export type EvaluateResult = [string, string];
export function evaluate(src: string, cu_limit: bigint): [string, string];
