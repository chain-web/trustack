import { deserialize } from './deserialize.mjs';
import { serialize } from './serialize.mjs';

export const name = 'serde-js';

export const code = 0x58;

export const decode = deserialize;

export const encode = serialize;
