//! A ECMAScript WASM implementation based on boa_engine.

#![doc(
    html_logo_url = "https://raw.githubusercontent.com/boa-dev/boa/main/assets/logo.svg",
    html_favicon_url = "https://raw.githubusercontent.com/boa-dev/boa/main/assets/logo.svg"
)]
#![cfg_attr(not(test), forbid(clippy::unwrap_used))]
#![warn(missing_docs, clippy::dbg_macro)]
#![deny(
    // rustc lint groups https://doc.rust-lang.org/rustc/lints/groups.html
    warnings,
    future_incompatible,
    let_underscore,
    nonstandard_style,
    rust_2018_compatibility,
    rust_2018_idioms,
    rust_2021_compatibility,
    unused,

    // rustc allowed-by-default lints https://doc.rust-lang.org/rustc/lints/listing/allowed-by-default.html
    macro_use_extern_crate,
    meta_variable_misuse,
    missing_abi,
    missing_copy_implementations,
    missing_debug_implementations,
    non_ascii_idents,
    noop_method_call,
    single_use_lifetimes,
    trivial_casts,
    trivial_numeric_casts,
    // unreachable_pub,
    unsafe_op_in_unsafe_fn,
    unused_crate_dependencies,
    unused_import_braces,
    unused_lifetimes,
    unused_qualifications,
    unused_tuple_struct_fields,
    variant_size_differences,

    // rustdoc lints https://doc.rust-lang.org/rustdoc/lints.html
    rustdoc::broken_intra_doc_links,
    rustdoc::private_intra_doc_links,
    rustdoc::missing_crate_level_docs,
    rustdoc::private_doc_tests,
    rustdoc::invalid_codeblock_attributes,
    rustdoc::invalid_rust_codeblocks,
    rustdoc::bare_urls,

    // clippy categories https://doc.rust-lang.org/clippy/
    clippy::all,
    clippy::correctness,
    clippy::suspicious,
    clippy::style,
    clippy::complexity,
    clippy::perf,
    clippy::pedantic,
    clippy::nursery,
)]

mod proto_rs;
mod sk;
mod utils;

use boa_engine::{Context, Source};
use getrandom as _;
use js_sys::{Array, Uint8Array};
use proto_rs::eval_result;
use protobuf::{Message, SpecialFields};
use sk::window_sk::init_sk;
use std::cell::RefCell;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;
// use wasm_bindgen_test::__rt::js_console_log;

// pub fn vec_to_js_array(vec: Vec<String>) -> Array {
//     vec.into_iter().map(JsValue::from).collect()
// }

static mut SAVED_STORAGE: RefCell<Vec<u8>> = RefCell::new(Vec::<u8>::new());

/// Evaluate the given ECMAScript code.
#[wasm_bindgen]
pub fn evaluate(src: Array, cu_limit: u64, storage: Uint8Array) -> Result<Uint8Array, JsValue> {
    set_panic_hook();
    let mut code_list = src
        .to_vec()
        .into_iter()
        .map(|v| v.as_string().unwrap())
        .collect::<Vec<String>>();

    let mut ctx = Context::builder()
        .build()
        .expect("Building the default context should not fail");
    ctx.cost_record.set_cu_limit(cu_limit);
    ctx.cost_record.set_use_cu_limit();
    init_sk(&mut ctx, storage).expect("init sk error");

    let mut result = vec![];
    let mut cu_costs = vec![];
    loop {
        if code_list.len() == 0 {
            break;
        }
        let code = code_list.remove(0);
        // js_console_log(&format!("code: {:?}", &code));
        let step_result = ctx.eval(Source::from_bytes(code.as_bytes()));
        // let step_res = match step_result.clone() {
        //     Ok(v) => {
        //         v.display().to_string()
        //     }
        //     Err(e) => e.to_string(),
        // };
        // js_console_log(&format!("step_result: {:?}", &step_res));
        result.push(step_result);
        cu_costs.push(ctx.cost_record.cu_cost.to_string());
        // js_console_log(&format!("cost--i: {:?}", &ctx.cost_record.cu_cost.to_string()));
        ctx.cost_record.reset_cu_cost();
    }

    match result.pop().unwrap() {
        Ok(v) => {
            let res_pb = eval_result::EvalResult {
                cu_cost: cu_costs,
                func_result: v.display().to_string(),
                storage: unsafe { SAVED_STORAGE.get_mut().to_vec() },
                special_fields: SpecialFields::new(),
            }
            .write_to_bytes()
            .expect("EvalResult to bytes error");
            let js_u8a = Uint8Array::new_with_length(res_pb.len() as u32);
            js_u8a.copy_from(&res_pb);
            Ok(js_u8a)
        }
        Err(e) => Err(JsValue::from(format!("Uncaught {}", e))),
    }
}
