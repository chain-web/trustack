use boa_engine::{
    object::{FunctionBinding, ObjectInitializer},
    property::Attribute,
    Context, JsResult, JsValue, NativeFunction,
};
use js_sys::Uint8Array;
use wasm_bindgen_test::__rt::js_console_log;

use crate::SAVED_STORAGE;
// use wasm_bindgen::prelude::*;

pub(crate) fn log(_: &JsValue, args: &[JsValue], context: &mut Context<'_>) -> JsResult<JsValue> {
    let text = args[0]
        .to_string(context)
        .expect("log: get arg error")
        .to_std_string()
        .unwrap();
    js_console_log(&text);
    Ok(JsValue::new(""))
}

pub(crate) fn save_storage(
    _: &JsValue,
    args: &[JsValue],
    context: &mut Context<'_>,
) -> JsResult<JsValue> {
    let json_string = args[0]
        .to_string(context)
        .expect("log: get arg error")
        .to_std_string()
        .unwrap();
    // js_console_log(&json_string);
    unsafe {
        let mut saved_storage_ref = SAVED_STORAGE.borrow_mut();
        saved_storage_ref.clear();
        saved_storage_ref.append(json_string.as_bytes().to_vec().clone().as_mut());
    }
    Ok(JsValue::Boolean(true))
}

pub(crate) fn init_sk(context: &mut Context<'_>, storage: Uint8Array) -> Result<(), JsValue> {
    let attribute = Attribute::READONLY | Attribute::NON_ENUMERABLE | Attribute::PERMANENT;
    let obj = ObjectInitializer::new(context)
        .property("name", "sk_utils", attribute)
        .property(
            "storage",
            String::from_utf8(storage.to_vec()).expect("parse storage error"),
            attribute,
        )
        .function(
            NativeFunction::from_fn_ptr(log),
            FunctionBinding::from("log"),
            1,
        )
        .function(
            NativeFunction::from_fn_ptr(save_storage),
            FunctionBinding::from("save_storage"),
            1,
        )
        .build();

    context.register_global_property("__sk_utils__", obj, attribute).unwrap();
    Ok(())
}
