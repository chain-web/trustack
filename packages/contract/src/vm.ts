import { bytes } from 'multiformats';
import { BUILDER_NAMES, evaluate, init } from './index.mjs';
import type { EvalResult } from './proto_ts/eval_result.js';

const defaultCuLimit = 1000000n;

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
    cuLimit: defaultCuLimit,
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
    cuLimit: defaultCuLimit,
    storage: bytes.fromString(''),
  });
};

export const evalCode = async (code: string): Promise<EvalResult> => {
  await init();
  return evaluate({
    codeString: [code],
    cuLimit: defaultCuLimit,
    storage: bytes.fromString(''),
  });
};
