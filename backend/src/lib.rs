use std::sync::Once;

use anyhow::{bail, Result};
use flatgeobuf::{FeatureProperties, FgbFeature, GeozeroGeometry, HttpFgbReader};
use geo::{BoundingRect, Haversine, Intersects, Length, LineString, MultiPolygon, Rect};
use geojson::{Feature, Geometry};

use wasm_bindgen::prelude::*;

static START: Once = Once::new();

/// Takes a GeoJSON `Feature<LineString>` and returns a JSON object with some info
#[wasm_bindgen(js_name = evalRoute)]
pub async fn eval_route(input: JsValue) -> Result<String, JsValue> {
    setup();

    let f: Feature = serde_wasm_bindgen::from_value(input)?;
    let line: LineString = f.try_into().map_err(err_to_js)?;

    let ruc = read_ruc(&line).await.map_err(err_to_js)?;
    let pop_density = read_pop_density(&line).await.map_err(err_to_js)?;

    Ok(serde_json::json!({
        "length": line.length::<Haversine>(),
        "ruc": ruc,
        "pop_density": pop_density,
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

async fn read_nearby_polygons<T: geozero::PropertyReadType>(
    bbox: Rect,
    url: &str,
    key: &str,
) -> Result<Vec<(MultiPolygon, T)>> {
    let mut fgb = HttpFgbReader::open(url)
        .await?
        .select_bbox(bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y)
        .await?;

    let mut polygons = Vec::new();
    while let Some(feature) = fgb.next().await? {
        let polygon = get_multi_polygon(feature)?;
        let value: T = feature.property(key)?;
        polygons.push((polygon, value));
    }
    Ok(polygons)
}

fn get_multi_polygon(f: &FgbFeature) -> Result<MultiPolygon> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::Polygon(p) => Ok(MultiPolygon(vec![p])),
        geo::Geometry::MultiPolygon(mp) => Ok(mp),
        _ => bail!("Wrong type in fgb"),
    }
}

async fn read_ruc(line: &LineString) -> Result<Vec<Feature>> {
    let bbox = line.bounding_rect().unwrap();
    let url = "https://assets.od2net.org/route-element/ruc.fgb";
    let mut polygons = read_nearby_polygons::<String>(bbox, url, "RUC11").await?;
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

async fn read_pop_density(line: &LineString) -> Result<Vec<Feature>> {
    let bbox = line.bounding_rect().unwrap();
    let url = "https://assets.od2net.org/route-element/census.fgb";
    let mut polygons = read_nearby_polygons::<i32>(bbox, url, "population_density").await?;
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
