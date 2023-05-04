import pkg from '../../package.json' assert { type: 'json' };
import * as mainConfig from './mainnet.config.js';
import * as testConfig from './testnet.config.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toParam = function () {
  return this.toString() + 'n';
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

export const LOAD_CONTRACT_DATA_FUNC = '__vm__load_data';

export const NETWORK_GET_NODE_COUNT_INTERVAL = 10 * 1000; // ms
export const NETWORK_PUB_NODE_COUNT_INTERVAL =
  2 * NETWORK_GET_NODE_COUNT_INTERVAL; // ms
export const NETWORK_MAX_NODE_COUNT_Buffer = 10;

export const CONSENSUS_TIME_WINDOW_BASE = 1n; // ms
export const CONSENSUS_NODE_PERCENT = 60; // ms
export const DO_CONSENSUS_INTERVAL = 600; // ms
