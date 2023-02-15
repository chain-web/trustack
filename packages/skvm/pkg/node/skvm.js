import * as wasm from './skvm_bg.wasm';
import { __wbg_set_wasm } from './skvm_bg.js';
__wbg_set_wasm(wasm);
export * from './skvm_bg.js';
