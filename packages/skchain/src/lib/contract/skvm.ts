import { evaluate, init } from 'skvm';

export const evalFunction = async (codeStr: string): Promise<string> => {
  await init();
  codeStr = `
    const evalFn = ${codeStr}
    evalFn()
  `;
  return evaluate(codeStr);
};
