export { BUILDER_NAMES } from './ast.utils.js';
import type { Output, Program } from '@swc/wasm-web';
import swc, { parseSync, transform } from '@swc/wasm-web';
import { walkTop } from './ast.utils.js';
import type { BuildCodeString } from './index.js';

export const builder = async (code: string): Promise<Output> => {
  const opt = parseSync(code, {
    syntax: 'typescript',
    target: 'es2022',
  });
  const contractAst = walkTop(opt) as Program;
  // const codeOpt = printSync(contractAst, {});
  // console.log(opt);
  // console.log(codeOpt);
  // TODO fix error, by https://github.com/swc-project/swc/issues/7140
  const contractCode = await transform(contractAst, {
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      target: 'es2022',
    },
  });

  return contractCode;
};

export const buildCodeString: BuildCodeString = async (code) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (swc as any)();
  const buildCode = await builder(code);

  return buildCode;
};
