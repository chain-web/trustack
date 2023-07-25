import { walkTop } from './ast.utils.js';
import type { Output, Program, Options, ParseOptions } from '@swc/core';

export const buildCodeString = (
  code: string,
  buildConfig: {
    parseSync: (code: string, opt: ParseOptions) => Program;
    transformSync: (ast: Program, opt: Options) => Output;
  },
): Output => {
  const opt = buildConfig.parseSync(code, {
    syntax: 'typescript',
    target: 'es2022',
  });
  const contractAst = walkTop(opt);
  // const codeOpt = printSync(contractAst, {});
  // console.log(opt);
  // console.log(codeOpt);
  const contractCode = buildConfig.transformSync(contractAst, {
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      target: 'es2022',
    },
  });

  return contractCode;
};
