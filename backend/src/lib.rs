use std::sync::Once;

use anyhow::{bail, Result};
use flatgeobuf::{FeatureProperties, FgbFeature, GeozeroGeometry, HttpFgbReader};
use geo::{BoundingRect, Haversine, Length, LineString, Polygon, Rect};
use geojson::{Feature, Geometry};

use wasm_bindgen::prelude::*;

static START: Once = Once::new();

/// Takes a GeoJSON `Feature<LineString>` and returns a JSON object with some info
#[wasm_bindgen(js_name = evalRoute)]
pub async fn eval_route(input: JsValue) -> Result<String, JsValue> {
    setup();

    let f: Feature = serde_wasm_bindgen::from_value(input)?;
    let line: LineString = f.try_into().map_err(err_to_js)?;

    let bbox = line.bounding_rect().unwrap();
    let url = "https://assets.od2net.org/route-element/ruc.fgb";
    let polygons = read_nearby_polygons(bbox, url).await.map_err(err_to_js)?;

    Ok(serde_json::json!({
        "length": line.length::<Haversine>(),
        "ruc": polygons.iter().map(|(p, ruc11)| {
            let mut f = Feature::from(Geometry::from(p));
            f.set_property("RUC11", ruc11.clone());
            f
        }).collect::<Vec<_>>(),
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

// TODO and one fixed prop; generalize htis
async fn read_nearby_polygons(bbox: Rect, url: &str) -> Result<Vec<(Polygon, String)>> {
    let mut fgb = HttpFgbReader::open(url)
        .await?
        .select_bbox(bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y)
        .await?;

    let mut polygons = Vec::new();
    while let Some(feature) = fgb.next().await? {
        let polygon = get_polygon(feature)?;
        let value: String = feature.property("RUC11")?;
        polygons.push((polygon, value));
    }
    Ok(polygons)
}

fn get_polygon(f: &FgbFeature) -> Result<Polygon> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::Polygon(p) => Ok(p),
        _ => bail!("Wrong type in fgb"),
    }
}
