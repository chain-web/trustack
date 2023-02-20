import { evaluate, init } from '@faithstack/vm';
import { CONSTRUCTOR_METHOD, CONTRACT_CLASS_NAME } from '@faithstack/contract';

export const evalFunction = async (codeStr: string): Promise<string> => {
  await init();
  codeStr = `
    const evalFn = ${codeStr}
    evalFn()
  `;
  return evaluate(codeStr, 1000n);
};

export const evalClass = async (
  codeStr: string,
  method: string,
  params: string[] = [],
): Promise<string> => {
  await init();
  codeStr = `
    ${codeStr}
    const __run__class__ = new ${CONTRACT_CLASS_NAME}();
    __run__class__.${CONSTRUCTOR_METHOD}();
    __run__class__.${method}(${params?.join(',')});
  
  `;
  return evaluate(codeStr, 1000n);
};
