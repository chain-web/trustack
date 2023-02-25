#!/usr/bin/env node
/* eslint-disable node/shebang */

import { cac } from 'cac';
import chalk from 'chalk';
import pkg from '../package.json' assert { type: 'json' };
import { builder } from './builder.js';
const version = pkg.version;
const cli = cac('sk-contract-builder');

export interface BuildOption {
  output?: string;
  watch?: boolean;
}

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
