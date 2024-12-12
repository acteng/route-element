use anyhow::{Context, Result};
use geo::{BoundingRect, Intersects, LineString};
use serde::Deserialize;

fn main() -> Result<()> {
    let args: Vec<_> = std::env::args().collect();
    let route_input = &args[1];
    let fgb_base_dir = &args[2];

    for input in geojson::de::deserialize_feature_collection_str_to_vec::<GeoJsonLineString>(
        &std::fs::read_to_string(route_input)?,
    )? {
        handle(&input.geometry, fgb_base_dir)?;
    }

    Ok(())
}

#[derive(Deserialize)]
struct GeoJsonLineString {
    #[serde(deserialize_with = "geojson::de::deserialize_geometry")]
    geometry: LineString,
}

fn handle(line: &LineString, base_dir: &str) -> Result<()> {
    let bbox = line.bounding_rect().unwrap();

    let mut ruc =
        backend::fgb::read_fgb_cli(bbox, &format!("{base_dir}/ruc.fgb"), backend::read_ruc)
            .context("ruc")?;
    ruc.retain(|x| x.geometry.intersects(line));

    let mut pop_density = backend::fgb::read_fgb_cli(
        bbox,
        &format!("{base_dir}/census.fgb"),
        backend::read_pop_density,
    )
    .context("pop_density")?;
    pop_density.retain(|x| x.geometry.intersects(line));

    println!("{} ruc, {} pop_density", ruc.len(), pop_density.len());

    Ok(())
}
