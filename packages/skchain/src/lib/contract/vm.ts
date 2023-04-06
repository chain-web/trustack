import type { EvalResult } from '@faithstack/contract';
import { BUILDER_NAMES, evaluate, init } from '@faithstack/contract';
import { bytes } from 'multiformats';

export const evalFunction = async (codeStr: string): Promise<EvalResult> => {
  await init();
  const codeString = [
    `
    const evalFn = ${codeStr}`,
    `
    evalFn()
  `,
  ];
  return evaluate({
    codeString,
    cuLimit: 1000n,
    storage: bytes.fromString(''),
  });
};

export const evalClass = async (
  codeStr: string,
  method: string,
  params: string[] = [],
): Promise<EvalResult> => {
  await init();
  const codeString = [
    `
    ${codeStr}
    `,
    `
    const __run__class__ = new ${BUILDER_NAMES.CONTRACT_CLASS_NAME}();
    __run__class__.${BUILDER_NAMES.CONSTRUCTOR_METHOD}();
    __run__class__.${method}(${params?.join(',')});
  
  `,
  ];
  return evaluate({
    codeString,
    cuLimit: 1000n,
    storage: bytes.fromString(''),
  });
};
