import pkg from '../../package.json' assert { type: 'json' };
import * as mainConfig from './mainnet.config.js';
import * as testConfig from './testnet.config.js';

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
