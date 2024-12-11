use std::sync::Once;

use anyhow::Result;
use geo::{BoundingRect, Haversine, Intersects, Length, LineString, MultiPolygon};
use geojson::{Feature, Geometry};

use wasm_bindgen::prelude::*;

mod fgb;
mod os;

static START: Once = Once::new();

/// Takes a GeoJSON `Feature<LineString>` and returns a JSON object with some info
#[wasm_bindgen(js_name = evalRoute)]
pub async fn eval_route(input: JsValue, base_url: String) -> Result<String, JsValue> {
    setup();

    let f: Feature = serde_wasm_bindgen::from_value(input)?;
    let line: LineString = f.try_into().map_err(err_to_js)?;

    let ruc = read_ruc(&line, &base_url).await.map_err(err_to_js)?;
    let pop_density = read_pop_density(&line, &base_url)
        .await
        .map_err(err_to_js)?;
    let (os_nodes, os_links) = os::read_os_network(&line, &base_url)
        .await
        .map_err(err_to_js)?;

    Ok(serde_json::json!({
        "length": line.length::<Haversine>(),
        "ruc": ruc,
        "pop_density": pop_density,
        "os_nodes": os_nodes,
        "os_links": os_links,
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

async fn read_ruc(line: &LineString, base_url: &str) -> Result<Vec<Feature>> {
    let bbox = line.bounding_rect().unwrap();
    let url = format!("{base_url}/ruc.fgb");
    let mut polygons: Vec<(MultiPolygon, String)> =
        fgb::read_fgb(bbox, &url, fgb::get_multi_polygon, "RUC11").await?;
    polygons.retain(|(p, _)| p.intersects(line));
    Ok(polygons
        .into_iter()
        .map(|(p, ruc11)| {
            let mut f = Feature::from(Geometry::from(&p));
            f.set_property("RUC11", ruc11);
            f
        })
        .collect())
}

async fn read_pop_density(line: &LineString, base_url: &str) -> Result<Vec<Feature>> {
    let bbox = line.bounding_rect().unwrap();
    let url = format!("{base_url}/census.fgb");
    let mut polygons: Vec<(MultiPolygon, i32)> =
        fgb::read_fgb(bbox, &url, fgb::get_multi_polygon, "population_density").await?;
    polygons.retain(|(p, _)| p.intersects(line));
    Ok(polygons
        .into_iter()
        .map(|(p, pop_density)| {
            let mut f = Feature::from(Geometry::from(&p));
            f.set_property("pop_density", pop_density);
            f
        })
        .collect())
}
