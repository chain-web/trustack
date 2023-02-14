export { genetateDid } from './lib/p2p/did.js';
export type { DidJson } from './lib/p2p/did.js';

export { SKChain } from './skChain.js';
export { Address } from './mate/address.js';
export { skCacheKeys } from './lib/ipfs/key.js';
import { Cache } from './lib/ipfs/cache.browser.js';

export const localCache = new Cache('sk-common-cache');
