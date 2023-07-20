import type { Address } from './mate/address.js';

export class BaseContract {
  msg = {
    sender: {} as Address,
    ts: 0,
  };
}
