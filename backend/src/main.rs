use anyhow::{bail, Context, Result};
use geo::{BoundingRect, Intersects, LineString};
use serde::Deserialize;

use backend::{fgb, os};

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

    let mut ruc = fgb::read_fgb_cli(bbox, &format!("{base_dir}/ruc.fgb"), backend::read_ruc)
        .context("ruc")?;
    ruc.retain(|x| x.geometry.intersects(line));

    let mut pop_density = fgb::read_fgb_cli(
        bbox,
        &format!("{base_dir}/census.fgb"),
        backend::read_pop_density,
    )
    .context("pop_density")?;
    pop_density.retain(|x| x.geometry.intersects(line));

    let (_nodes, links) = os_path(line, base_dir)?;

    println!(
        "{} ruc, {} pop_density, {} links",
        ruc.len(),
        pop_density.len(),
        links.len()
    );

    Ok(())
}

fn os_path(line: &LineString, base_dir: &str) -> Result<(Vec<os::Node>, Vec<os::Link>)> {
    let bbox = os::bbox_for_os(line);
    let nodes = fgb::read_fgb_cli(bbox, &format!("{base_dir}/os_nodes.fgb"), os::read_node)
        .context("os_nodes")?;
    let links = fgb::read_fgb_cli(bbox, &format!("{base_dir}/os_links.fgb"), os::read_link)
        .context("os_links")?;

    let Some((path_nodes, path_links)) = os::map_match(&nodes, &links, line) else {
        bail!("Couldn't find path");
    };
    Ok((path_nodes, path_links))
}
