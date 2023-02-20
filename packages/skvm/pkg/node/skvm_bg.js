let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

const lTextDecoder =
  typeof TextDecoder === 'undefined'
    ? (0, module.require)('util').TextDecoder
    : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder =
  typeof TextEncoder === 'undefined'
    ? (0, module.require)('util').TextEncoder
    : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3));
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = (...args) => {
    // First up with a closure we increment the internal reference
    // count. This ensures that the Rust closure environment won't
    // be deallocated while we're invoking it.
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      if (--state.cnt === 0) {
        wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
      } else {
        state.a = a;
      }
    }
  };
  real.original = state;

  return real;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
  wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcc6833f78ca783f0(
    arg0,
    arg1,
    addHeapObject(arg2),
  );
}

/**
 * Evaluate the given ECMAScript code.
 * @param {string} src
 * @param {bigint} cu_limit
 * @returns {string}
 */
export function evaluate(src, cu_limit) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      src,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.evaluate(retptr, ptr0, len0, cu_limit);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr1 = r0;
    var len1 = r1;
    if (r3) {
      ptr1 = 0;
      len1 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr1, len1);
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
  const ptr = malloc(array.length * 4);
  const mem = getUint32Memory0();
  for (let i = 0; i < array.length; i++) {
    mem[ptr / 4 + i] = addHeapObject(array[i]);
  }
  WASM_VECTOR_LEN = array.length;
  return ptr;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error('out of js stack');
  heap[--stack_pointer] = obj;
  return stack_pointer;
}
/**
 * Handler for `console.log` invocations.
 *
 * If a test is currently running it takes the `args` array and stringifies
 * it and appends it to the current output of the test. Otherwise it passes
 * the arguments to the original `console.log` function, psased as
 * `original`.
 * @param {Array<any>} args
 */
export function __wbgtest_console_log(args) {
  try {
    wasm.__wbgtest_console_log(addBorrowedObject(args));
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

/**
 * Handler for `console.debug` invocations. See above.
 * @param {Array<any>} args
 */
export function __wbgtest_console_debug(args) {
  try {
    wasm.__wbgtest_console_debug(addBorrowedObject(args));
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

/**
 * Handler for `console.info` invocations. See above.
 * @param {Array<any>} args
 */
export function __wbgtest_console_info(args) {
  try {
    wasm.__wbgtest_console_info(addBorrowedObject(args));
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

/**
 * Handler for `console.warn` invocations. See above.
 * @param {Array<any>} args
 */
export function __wbgtest_console_warn(args) {
  try {
    wasm.__wbgtest_console_warn(addBorrowedObject(args));
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

/**
 * Handler for `console.error` invocations. See above.
 * @param {Array<any>} args
 */
export function __wbgtest_console_error(args) {
  try {
    wasm.__wbgtest_console_error(addBorrowedObject(args));
  } finally {
    heap[stack_pointer++] = undefined;
  }
}

function __wbg_adapter_78(arg0, arg1, arg2, arg3, arg4) {
  wasm.wasm_bindgen__convert__closures__invoke3_mut__h0dcf3c62e8540416(
    arg0,
    arg1,
    addHeapObject(arg2),
    arg3,
    addHeapObject(arg4),
  );
}

function __wbg_adapter_97(arg0, arg1, arg2, arg3) {
  wasm.wasm_bindgen__convert__closures__invoke2_mut__h3dccb3e59e78a9da(
    arg0,
    arg1,
    addHeapObject(arg2),
    addHeapObject(arg3),
  );
}

/**
 * Runtime test harness support instantiated in JS.
 *
 * The node.js entry script instantiates a `Context` here which is used to
 * drive test execution.
 */
export class WasmBindgenTestContext {
  static __wrap(ptr) {
    const obj = Object.create(WasmBindgenTestContext.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_wasmbindgentestcontext_free(ptr);
  }
  /**
   * Creates a new context ready to run tests.
   *
   * A `Context` is the main structure through which test execution is
   * coordinated, and this will collect output and results for all executed
   * tests.
   */
  constructor() {
    const ret = wasm.wasmbindgentestcontext_new();
    return WasmBindgenTestContext.__wrap(ret);
  }
  /**
   * Inform this context about runtime arguments passed to the test
   * harness.
   *
   * Eventually this will be used to support flags, but for now it's just
   * used to support test filters.
   * @param {any[]} args
   */
  args(args) {
    const ptr0 = passArrayJsValueToWasm0(args, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.wasmbindgentestcontext_args(this.ptr, ptr0, len0);
  }
  /**
   * Executes a list of tests, returning a promise representing their
   * eventual completion.
   *
   * This is the main entry point for executing tests. All the tests passed
   * in are the JS `Function` object that was plucked off the
   * `WebAssembly.Instance` exports list.
   *
   * The promise returned resolves to either `true` if all tests passed or
   * `false` if at least one test failed.
   * @param {any[]} tests
   * @returns {Promise<any>}
   */
  run(tests) {
    const ptr0 = passArrayJsValueToWasm0(tests, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.wasmbindgentestcontext_run(this.ptr, ptr0, len0);
    return takeObject(ret);
  }
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return addHeapObject(ret);
}

export function __wbg_crypto_e1d53a1d73fb10b8(arg0) {
  const ret = getObject(arg0).crypto;
  return addHeapObject(ret);
}

export function __wbindgen_is_object(arg0) {
  const val = getObject(arg0);
  const ret = typeof val === 'object' && val !== null;
  return ret;
}

export function __wbg_process_038c26bf42b093f8(arg0) {
  const ret = getObject(arg0).process;
  return addHeapObject(ret);
}

export function __wbg_versions_ab37218d2f0b24a8(arg0) {
  const ret = getObject(arg0).versions;
  return addHeapObject(ret);
}

export function __wbindgen_object_drop_ref(arg0) {
  takeObject(arg0);
}

export function __wbg_node_080f4b19d15bc1fe(arg0) {
  const ret = getObject(arg0).node;
  return addHeapObject(ret);
}

export function __wbindgen_is_string(arg0) {
  const ret = typeof getObject(arg0) === 'string';
  return ret;
}

export function __wbg_require_78a3dcfbdba9cbce() {
  return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_msCrypto_6e7d3e1f92610cbb(arg0) {
  const ret = getObject(arg0).msCrypto;
  return addHeapObject(ret);
}

export function __wbg_getRandomValues_805f1c3d65988a5a() {
  return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
  }, arguments);
}

export function __wbg_randomFillSync_6894564c2c334c42() {
  return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
  }, arguments);
}

export function __wbg_log_06ce2db1f244c264(arg0, arg1) {
  console.log(getStringFromWasm0(arg0, arg1));
}

export function __wbg_String_43e240bbca514dff(arg0, arg1) {
  const ret = String(getObject(arg1));
  const ptr0 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len0;
  getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}

export function __wbindgen_string_get(arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === 'string' ? obj : undefined;
  var ptr0 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len0 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len0;
  getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}

export function __wbindgen_number_new(arg0) {
  const ret = arg0;
  return addHeapObject(ret);
}

export function __wbg_static_accessor_document_c0babe68ba1eebc2() {
  const ret = document;
  return addHeapObject(ret);
}

export function __wbg_getElementById_21c1ba70eb74a26a(arg0, arg1, arg2) {
  const ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
  return addHeapObject(ret);
}

export function __wbg_settextcontent_3c2a95e53849fa65(arg0, arg1, arg2) {
  getObject(arg0).textContent = getStringFromWasm0(arg1, arg2);
}

export function __wbg_textcontent_82de0d7910ca2cb5(arg0, arg1) {
  const ret = getObject(arg1).textContent;
  const ptr0 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len0;
  getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}

export function __wbindgen_object_clone_ref(arg0) {
  const ret = getObject(arg0);
  return addHeapObject(ret);
}

export function __wbg_stack_e72a6800a9172afa(arg0) {
  const ret = getObject(arg0).stack;
  return addHeapObject(ret);
}

export function __wbg_stack_67cc9e651682cbe5(arg0, arg1) {
  const ret = getObject(arg1).stack;
  const ptr0 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len0;
  getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}

export function __wbg_self_ec4002dd45e47d74(arg0) {
  const ret = getObject(arg0).self;
  return addHeapObject(ret);
}

export function __wbindgen_jsval_eq(arg0, arg1) {
  const ret = getObject(arg0) === getObject(arg1);
  return ret;
}

export function __wbg_new_abda76e883ba8a5f() {
  const ret = new Error();
  return addHeapObject(ret);
}

export function __wbg_stack_658279fe44541cf6(arg0, arg1) {
  const ret = getObject(arg1).stack;
  const ptr0 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len0 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len0;
  getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}

export function __wbg_error_f851667af71bcfc6(arg0, arg1) {
  try {
    console.error(getStringFromWasm0(arg0, arg1));
  } finally {
    wasm.__wbindgen_free(arg0, arg1);
  }
}

export function __wbindgen_cb_drop(arg0) {
  const obj = takeObject(arg0).original;
  if (obj.cnt-- == 1) {
    obj.a = 0;
    return true;
  }
  const ret = false;
  return ret;
}

export function __wbindgen_is_function(arg0) {
  const ret = typeof getObject(arg0) === 'function';
  return ret;
}

export function __wbg_newnoargs_2b8b6bd7753c76ba(arg0, arg1) {
  const ret = new Function(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
}

export function __wbg_call_95d1ea488d03e4e8() {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_self_e7c1f827057f6584() {
  return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_window_a09ec664e14b1b81() {
  return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_globalThis_87cbb8506fecf3a9() {
  return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_global_c85a9259e621f3db() {
  return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
  }, arguments);
}

export function __wbindgen_is_undefined(arg0) {
  const ret = getObject(arg0) === undefined;
  return ret;
}

export function __wbg_forEach_c070c0d203ce2e51(arg0, arg1, arg2) {
  try {
    var state0 = { a: arg1, b: arg2 };
    var cb0 = (arg0, arg1, arg2) => {
      const a = state0.a;
      state0.a = 0;
      try {
        return __wbg_adapter_78(a, state0.b, arg0, arg1, arg2);
      } finally {
        state0.a = a;
      }
    };
    getObject(arg0).forEach(cb0);
  } finally {
    state0.a = state0.b = 0;
  }
}

export function __wbg_message_a95c3ef248e4b57a(arg0) {
  const ret = getObject(arg0).message;
  return addHeapObject(ret);
}

export function __wbg_name_c69a20c4b1197dc0(arg0) {
  const ret = getObject(arg0).name;
  return addHeapObject(ret);
}

export function __wbg_call_9495de66fdbe016b() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
  }, arguments);
}

export function __wbg_getTime_7c59072d1651a3cf(arg0) {
  const ret = getObject(arg0).getTime();
  return ret;
}

export function __wbg_getTimezoneOffset_2a6b27fb18493a56(arg0) {
  const ret = getObject(arg0).getTimezoneOffset();
  return ret;
}

export function __wbg_new0_25059e40b1c02766() {
  const ret = new Date();
  return addHeapObject(ret);
}

export function __wbg_new_9d3a9ce4282a18a8(arg0, arg1) {
  try {
    var state0 = { a: arg0, b: arg1 };
    var cb0 = (arg0, arg1) => {
      const a = state0.a;
      state0.a = 0;
      try {
        return __wbg_adapter_97(a, state0.b, arg0, arg1);
      } finally {
        state0.a = a;
      }
    };
    const ret = new Promise(cb0);
    return addHeapObject(ret);
  } finally {
    state0.a = state0.b = 0;
  }
}

export function __wbg_resolve_fd40f858d9db1a04(arg0) {
  const ret = Promise.resolve(getObject(arg0));
  return addHeapObject(ret);
}

export function __wbg_then_ec5db6d509eb475f(arg0, arg1) {
  const ret = getObject(arg0).then(getObject(arg1));
  return addHeapObject(ret);
}

export function __wbg_buffer_cf65c07de34b9a08(arg0) {
  const ret = getObject(arg0).buffer;
  return addHeapObject(ret);
}

export function __wbg_new_537b7341ce90bb31(arg0) {
  const ret = new Uint8Array(getObject(arg0));
  return addHeapObject(ret);
}

export function __wbg_set_17499e8aa4003ebd(arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0);
}

export function __wbg_length_27a2afe8ab42b09f(arg0) {
  const ret = getObject(arg0).length;
  return ret;
}

export function __wbg_newwithlength_b56c882b57805732(arg0) {
  const ret = new Uint8Array(arg0 >>> 0);
  return addHeapObject(ret);
}

export function __wbg_subarray_7526649b91a252a6(arg0, arg1, arg2) {
  const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
  return addHeapObject(ret);
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbindgen_memory() {
  const ret = wasm.memory;
  return addHeapObject(ret);
}

export function __wbindgen_closure_wrapper3914(arg0, arg1, arg2) {
  const ret = makeMutClosure(arg0, arg1, 1191, __wbg_adapter_28);
  return addHeapObject(ret);
}
