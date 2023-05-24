import { version } from '../config/index.js';
import { chainState } from '../lib/state/index.js';
import { getNow } from './performance.js';

/* eslint-disable no-console */
type simpleConsoleVal = string | number | boolean | object | undefined | null;

const readFile = async (name: string): Promise<string | undefined> => {
  const isNodejs = !globalThis.navigator;
  if (isNodejs) {
    // eslint-disable-next-line import/no-nodejs-modules
    const { resolve } = (await import('path')).default;
    const { existsSync, readFileSync } =
      // eslint-disable-next-line import/no-nodejs-modules
      (await import('fs')).default;
    const fileName = resolve(process.cwd(), `.logs/${name}.txt`);

    if (existsSync(fileName)) {
      return readFileSync(fileName).toString();
    }
  }
};

const writeToFile = async (
  name: string,
  content: string,
  createMode: boolean,
) => {
  const isNodejs = !globalThis.navigator;
  if (isNodejs) {
    // eslint-disable-next-line import/no-nodejs-modules
    const { resolve } = (await import('path')).default;
    const { existsSync, writeFileSync, rmSync, mkdirSync } =
      // eslint-disable-next-line import/no-nodejs-modules
      (await import('fs')).default;
    const fileName = resolve(process.cwd(), `.logs/${name}.txt`);

    if (createMode) {
      if (!existsSync('.logs')) {
        mkdirSync('.logs');
      }
      if (existsSync(fileName)) {
        rmSync(fileName, { recursive: true, force: true });
      }
      writeFileSync(fileName, content, {
        // create a new file .
        flag: 'w',
      });
    } else {
      writeFileSync(fileName, content, {
        // append to the file.
        flag: 'a',
      });
    }
  }
};

export class SKMessage {
  inited = false;
  init = (): void => {
    writeToFile(
      chainState.name,
      `${chainState.name}-v${version}-${getNow()}: init log module\n`,
      true,
    );
  };
  info = (...msg: simpleConsoleVal[]): void => {
    const prefix = `${chainState.name}-v${version}-${getNow()}:`;
    console.log(`${prefix}:`, ...msg);
    this.writeToFile(
      `${prefix} \n ${msg.map((m) => JSON.stringify(m)).join('\n')}`,
    );
  };
  error = (...msg: simpleConsoleVal[]): void => {
    const prefix = `${chainState.name}-v${version}-${getNow()}:`;
    console.error(`${prefix}:`, ...msg);
    this.writeToFile(
      `${prefix} \n ${msg.map((m) => JSON.stringify(m)).join('\n')}`,
    );
  };

  writeToFile = (log: string): void => {
    if (!this.inited) {
      this.init();
      this.inited = true;
    }
    writeToFile(chainState.name, log, false);
  };
  readFile = async (): Promise<string | undefined> => {
    return readFile(chainState.name);
  };
}

export const message = new SKMessage();
