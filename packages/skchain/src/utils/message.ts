import { version } from '../config/index.js';
import { getNow } from './performance.js';

/* eslint-disable no-console */
type simpleConsoleVal = string | number | boolean | object | undefined | null;

type BaseSKMessageFunc = (...msg: simpleConsoleVal[]) => void;

export class SKMessage {
  constructor(opts?: Partial<Record<'info' | 'error', BaseSKMessageFunc>>) {
    this.info = opts?.info || SKMessage.defaultInfo;
    this.error = opts?.error || SKMessage.defaultError;
  }
  info: BaseSKMessageFunc;
  error: BaseSKMessageFunc;

  static logger = (...msg: simpleConsoleVal[]): void => {
    console.log(`sk-v${version}-${getNow()}:`, ...msg);
  };
  static error = (...msg: simpleConsoleVal[]): void => {
    console.error(`sk-v${version}-${getNow()}:`, ...msg);
  };

  static defaultInfo: BaseSKMessageFunc = (...msg) => {
    SKMessage.logger(...msg);
  };
  static defaultError: BaseSKMessageFunc = (...msg) => {
    SKMessage.error(...msg);
  };
}

export const message = new SKMessage();
