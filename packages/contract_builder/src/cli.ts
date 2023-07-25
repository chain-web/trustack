#!/usr/bin/env node
/* eslint-disable import/no-nodejs-modules */
/* eslint-disable no-console */
/* eslint-disable node/shebang */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { cac } from 'cac';
import chalk from 'chalk';
import { parseSync, transformSync } from '@swc/core';

import { bytes } from 'multiformats';
import pkg from '../package.json' assert { type: 'json' };
import { buildCodeString } from './builder.js';
const version = pkg.version;
const cli = cac('sk-contract-builder');

export interface BuildOption {
  output?: string;
  watch?: boolean;
}

const builder = async (input: string, opts: BuildOption) => {
  try {
    console.log(chalk.green('starting build contract...'));
    input = resolve(input, './');
    // console.log(codeSnippet);
    const code = readFileSync(input).toString();
    // console.log(code);
    const res = buildCodeString(code, {
      parseSync,
      transformSync,
    });
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

cli
  .command('build [contract]')
  .option('--output <path>', `[string] output file`)
  .option('-w, --watch', `watch file change to build`)
  .example((bin) => {
    return bin;
  })
  .action(async (input: string, opt: BuildOption) => {
    try {
      await builder(input, opt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      chalk.red(`error when build contract:\n${e.stack}`);
      process.exit(1);
    }
  });

cli.help();
cli.version(version);

cli.parse();
