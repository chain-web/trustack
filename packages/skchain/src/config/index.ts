import pkg from '../../package.json' assert { type: 'json' };
import * as mainConfig from './mainnet.config.js';
import * as testConfig from './testnet.config.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const configMap = {
  mainnet: mainConfig,
  testnet: testConfig,
};

// export const isBrowser = (() => {
//   try {
//     window.navigator;
//     return true;
//   } catch (error) {
//     return false;
//   }
// })();

export const version = pkg.version;

export const MAX_TRANS_LIMIT = 50; // 每个block能打包的交易上限
export const WAIT_TIME_LIMIT = 4 * 1000; // 每个交易从被发出到能进行打包的最短时间间隔 ms
export const BLOCK_INTERVAL_TIME_LIMIT = 4 * 1000; // 两个块之间打包的最短时间间隔 ms
