import { version } from '../config/index.js';

/* eslint-disable no-console */
type simpleConsoleVal = string | number | boolean | object;

type BaseSKMessageFunc = (...msg: simpleConsoleVal[]) => void;

export class SKMessage {
  constructor(opts?: Partial<Record<'info' | 'error', BaseSKMessageFunc>>) {
    this.info = opts?.info || SKMessage.defaultInfo;
    this.error = opts?.error || SKMessage.defaultError;
  }
  info: BaseSKMessageFunc;
  error: BaseSKMessageFunc;

  static logger = (...msg: simpleConsoleVal[]): void => {
    console.log(`sk-v${version}:`, ...msg);
  };
  static error = (...msg: simpleConsoleVal[]): void => {
    console.error(`sk-v${version}:`, ...msg);
  };

  static defaultInfo: BaseSKMessageFunc = (...msg) => {
    SKMessage.logger(...msg);
  };
  static defaultError: BaseSKMessageFunc = (...msg) => {
    SKMessage.error(...msg);
  };
}

export const message = new SKMessage();
