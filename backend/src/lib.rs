use std::sync::Once;

use anyhow::{Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{BoundingRect, Haversine, Intersects, Length, LineString, MultiPolygon};
use geojson::Feature;
use serde::Serialize;

use wasm_bindgen::prelude::*;

pub mod fgb;
mod os;

static START: Once = Once::new();

/// Takes a GeoJSON `Feature<LineString>` and returns a JSON object with some info
#[wasm_bindgen(js_name = evalRoute)]
pub async fn eval_route(input: JsValue, base_url: String) -> Result<String, JsValue> {
    setup();

    let f: Feature = serde_wasm_bindgen::from_value(input)?;
    let line: LineString = f.try_into().map_err(err_to_js)?;

    let ruc = read_all_ruc(&line, &base_url).await.map_err(err_to_js)?;
    let pop_density = read_all_pop_density(&line, &base_url)
        .await
        .map_err(err_to_js)?;
    let (os_nodes, os_links) = os::read_os_network(&line, &base_url)
        .await
        .map_err(err_to_js)?;

    Ok(serde_json::json!({
        "length": line.length::<Haversine>(),
        "ruc": geojson::ser::to_feature_collection_string(&ruc).unwrap(),
        "pop_density": geojson::ser::to_feature_collection_string(&pop_density).unwrap(),
        "os_nodes": geojson::ser::to_feature_collection_string(&os_nodes).unwrap(),
        "os_links": geojson::ser::to_feature_collection_string(&os_links).unwrap(),
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

#[derive(Serialize)]
pub struct RUC {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    pub geometry: MultiPolygon,
    ruc11: String,
}

#[derive(Serialize)]
pub struct PopDensity {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    pub geometry: MultiPolygon,
    pop_density: i32,
}

pub fn read_ruc(f: &FgbFeature) -> Result<RUC> {
    Ok(RUC {
        geometry: fgb::get_multi_polygon(f)?,
        ruc11: f.property("RUC11")?,
    })
}

pub fn read_pop_density(f: &FgbFeature) -> Result<PopDensity> {
    Ok(PopDensity {
        geometry: fgb::get_multi_polygon(f)?,
        pop_density: f.property("population_density")?,
    })
}

async fn read_all_ruc(line: &LineString, base_url: &str) -> Result<Vec<RUC>> {
    let bbox = line.bounding_rect().unwrap();
    let url = format!("{base_url}/ruc.fgb");
    let mut polygons = fgb::read_fgb(bbox, &url, read_ruc).await.context("ruc")?;
    polygons.retain(|x| x.geometry.intersects(line));
    Ok(polygons)
}

async fn read_all_pop_density(line: &LineString, base_url: &str) -> Result<Vec<PopDensity>> {
    let bbox = line.bounding_rect().unwrap();
    let url = format!("{base_url}/census.fgb");
    let mut polygons = fgb::read_fgb(bbox, &url, read_pop_density)
        .await
        .context("pop_density")?;
    polygons.retain(|x| x.geometry.intersects(line));
    Ok(polygons)
}
