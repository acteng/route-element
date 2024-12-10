use std::sync::Once;

use anyhow::Result;
use geo::{Haversine, Length, LineString};
use geojson::Feature;

use wasm_bindgen::prelude::*;

static START: Once = Once::new();

/// Takes a GeoJSON `Feature<LineString>` and returns a JSON object with some info
#[wasm_bindgen(js_name = evalRoute)]
pub fn eval_route(input: JsValue) -> Result<String, JsValue> {
    setup();

    let f: Feature = serde_wasm_bindgen::from_value(input)?;
    let line: LineString = f.try_into().map_err(err_to_js)?;

    Ok(serde_json::json!({
        "length": line.length::<Haversine>(),
    })
    .to_string())
}

fn setup() {
    // Panics shouldn't happen, but if they do, console.log them.
    console_error_panic_hook::set_once();
    START.call_once(|| {
        console_log::init_with_level(log::Level::Info).unwrap();
    });
}

fn err_to_js<E: std::fmt::Display>(err: E) -> JsValue {
    JsValue::from_str(&err.to_string())
}
