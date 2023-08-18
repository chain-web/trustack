import { walkTop } from './ast.utils.js';
import { Output, Program, Options, ParseOptions, parseSync } from '@swc/core';
import { rollup } from 'rollup';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { wasm } from '@rollup/plugin-wasm';

export const buildCodeString = (
  code: string,
  buildConfig: {
    parseSync: (code: string, opt: ParseOptions) => Program;
    transformSync: (ast: Program, opt: Options) => Output;
  },
): Output => {
  const contractAst = parseAndProcessCode(code);
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

export const parseAndProcessCode = (code: string) => {
  const opt = parseSync(code, {
    syntax: 'typescript',
    target: 'es2022',
  });
  const contractAst = walkTop(opt);

  return contractAst;
};
export const boundleContract = async (entry: string) => {
  const bundle = await rollup({
    input: entry,
    plugins: [
      (typescript as any)({
        check: false,
      }),
      (commonjs as any)(),
      wasm(),
      (terser as any)({
        ecma: 2020,
        keep_classnames: true,
      }),
      nodeResolve(),
    ],
  });
  const res = await bundle.generate({
    format: 'esm',
    sourcemap: false,
  });
  const code = res.output[0].code.replace(/export{.+};/g, '');
  return code;
};
