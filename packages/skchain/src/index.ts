export { genetateDid } from './lib/p2p/did.js';
export type { DidJson } from './lib/p2p/did.js';
export { evalFunction } from './lib/contract/vm.js';

export { SKChain } from './skChain.js';
export { Address } from './mate/address.js';
export { Transaction } from './mate//transaction.js';
export { skCacheKeys } from './lib/ipfs/key.js';
import { Cache } from './lib/ipfs/cache.browser.js';
export { TransStatus } from './lib/transaction/index.js';
export { LifecycleStap } from './lib/state/lifecycle.js';

export { BaseContract } from './contractHelper.js';
export const localCache = new Cache('sk-common-cache');

export { tests } from './tests.js';
