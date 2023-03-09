use boa_engine::{
    object::{FunctionBinding, ObjectInitializer},
    property::Attribute,
    Context, JsResult, JsValue, NativeFunction,
};
use wasm_bindgen_test::__rt::js_console_log;
// use wasm_bindgen::prelude::*;

#[allow(clippy::unnecessary_wraps)]
pub(crate) fn log(_: &JsValue, args: &[JsValue], context: &mut Context<'_>) -> JsResult<JsValue> {
    let text = args[0]
        .to_string(context)
        .expect("log: get arg error")
        .to_std_string()
        .unwrap();
    js_console_log(&text);
    Ok(JsValue::new(""))
}

#[allow(clippy::unnecessary_wraps)]
pub(crate) fn init_sk(context: &mut Context<'_>) -> Result<(), JsValue> {
    let attribute = Attribute::READONLY | Attribute::NON_ENUMERABLE | Attribute::PERMANENT;
    let obj = ObjectInitializer::new(context)
        .property("name", "sk_utils", attribute)
        .function(
            NativeFunction::from_fn_ptr(log),
            FunctionBinding::from("log"),
            1,
        )
        .build();

    context.register_global_property("__sk_utils__", obj, attribute);
    Ok(())
}
