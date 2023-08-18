export type { DidJson } from '@trustack/common';

export { SKChain } from './skChain.js';
export { Address } from './mate/address.js';
export { Transaction } from './mate/transaction.js';
export { skCacheKeys } from './lib/skfs/key.js';
import { Cache } from './lib/skfs/cache.browser.js';
export { TransStatus } from './lib/transaction/index.js';
export type { TransactionOption } from './lib/transaction/index.js';
export { LifecycleStap, peerid } from '@trustack/common';

export { BaseContract } from './contractHelper.js';
export const localCache = new Cache('sk-common-cache');
