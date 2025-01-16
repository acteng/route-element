use std::sync::{LazyLock, Mutex, Once};

use anyhow::{Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{BoundingRect, Coord, Haversine, Intersects, Length, LineString, MultiPolygon, Rect};
use geojson::Feature;
use serde::{Deserialize, Serialize};

use wasm_bindgen::prelude::*;

pub mod fgb;
pub mod os;

static START: Once = Once::new();

// Messily just store global state between makeRouteSnapper and other calls
static LAST_GRAPH: LazyLock<Mutex<Option<os::OsGraph>>> = LazyLock::new(|| Mutex::new(None));

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

/// Returns a bincoded route snapper graph covering a bbox
#[wasm_bindgen(js_name = makeRouteSnapper)]
pub async fn make_route_snapper(
    base_url: String,
    x1: f64,
    y1: f64,
    x2: f64,
    y2: f64,
) -> Result<Vec<u8>, JsValue> {
    setup();

    let bbox = Rect::new(Coord { x: x1, y: y1 }, Coord { x: x2, y: y2 });
    let os_graph = os::make_route_snapper(&base_url, bbox)
        .await
        .map_err(err_to_js)?;
    let result = bincode::serialize(&os_graph.graph).map_err(err_to_js);
    *LAST_GRAPH.lock().unwrap() = Some(os_graph);
    result
}

/// After makeRouteSnapper, this will debug the nodes and links used for snapping
#[wasm_bindgen(js_name = debugNetwork)]
pub fn debug_network() -> Result<String, JsValue> {
    if let Some(graph) = LAST_GRAPH.lock().unwrap().as_ref() {
        Ok(serde_json::json!({
            "os_nodes": geojson::ser::to_feature_collection_string(&graph.all_nodes).unwrap(),
            "os_links": geojson::ser::to_feature_collection_string(&graph.all_links).unwrap(),
        })
        .to_string())
    } else {
        Err(JsValue::from_str("have to call makeRouteSnapper first"))
    }
}

// TODO Combine these calls
/// Takes a Feature<LineString> and list of Nodes from the route snapper and returns a
/// FeatureCollection of LineStrings representing links, with splits inserted between signalized
/// junctions.
#[wasm_bindgen(js_name = splitLinks)]
pub fn split_links(input1: JsValue, input2: JsValue) -> Result<String, JsValue> {
    if let Some(graph) = LAST_GRAPH.lock().unwrap().as_ref() {
        let f: Feature = serde_wasm_bindgen::from_value(input1)?;
        let line: LineString = f.try_into().map_err(err_to_js)?;

        let full_path: Vec<RouteNode> = serde_wasm_bindgen::from_value(input2)?;
        serde_json::to_string(&os::split_links(graph, line, full_path)).map_err(err_to_js)
    } else {
        Err(JsValue::from_str("have to call makeRouteSnapper first"))
    }
}

/// Takes a list of Nodes from the route snapper and returns a FeatureCollection of LineStrings
/// representing side roads crossed by the path
#[wasm_bindgen(js_name = getSideRoads)]
pub fn get_side_roads(input: JsValue) -> Result<String, JsValue> {
    if let Some(graph) = LAST_GRAPH.lock().unwrap().as_ref() {
        let full_path: Vec<RouteNode> = serde_wasm_bindgen::from_value(input)?;
        serde_json::to_string(&os::get_side_roads(graph, full_path)).map_err(err_to_js)
    } else {
        Err(JsValue::from_str("have to call makeRouteSnapper first"))
    }
}

/// Takes a list of Nodes from the route snapper and returns a FeatureCollection of Points
/// for traffic signals along the route.
#[wasm_bindgen(js_name = getSignalizedJunctions)]
pub fn get_signalized_junctions(input: JsValue) -> Result<String, JsValue> {
    if let Some(graph) = LAST_GRAPH.lock().unwrap().as_ref() {
        let full_path: Vec<RouteNode> = serde_wasm_bindgen::from_value(input)?;
        serde_json::to_string(&os::get_signalized_junctions(graph, full_path)).map_err(err_to_js)
    } else {
        Err(JsValue::from_str("have to call makeRouteSnapper first"))
    }
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

#[derive(Deserialize)]
pub struct RouteNode {
    snapped: Option<u32>,
    free: Option<[f64; 2]>,
}
