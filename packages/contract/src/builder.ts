import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { bytes } from 'multiformats';
import { Output, parseSync, printSync, transformSync } from '@swc/core';
import chalk from 'chalk';
import type { BuildOption } from './cli.js';
import { walkTop } from './ast.utils.js';

export const buildeCodeString = (code: string): Output => {
  const opt = parseSync(code, {
    syntax: 'typescript',
    target: 'es2022',
  });
  const contractAst = walkTop(opt);
  const codeOpt = printSync(contractAst, {});
  // console.log(opt);
  // console.log(codeOpt);
  const contractCode = transformSync(contractAst, {
    jsc: {
      parser: {
        syntax: 'typescript',
      },
      target: 'es2022',
    },
  });

  return contractCode;
};

export const builder = async (input: string, opts: BuildOption) => {
  try {
    console.log(chalk.green('starting build contract...'));
    input = resolve(input, './');
    // console.log(codeSnippet);
    let code = readFileSync(input).toString();
    // console.log(code);
    const res = buildeCodeString(code);
    // console.log(contractCode);
    const resultUint8 = bytes.fromString(res.code);
    // const resultU8String = `export default new Uint8Array([${resultUint8.toString()}]);`;
    // console.log(resultUint8);
    writeFileSync(
      resolve(input, '../index.contract.bin'),
      resultUint8.toString(),
      {
        flag: 'w+',
      },
    );
    writeFileSync(resolve(input, '../index.contract.js'), res.code, {
      flag: 'w+',
    });
    console.log(chalk.green('contract build success'));
  } catch (error) {
    console.log(error);
  }
};
