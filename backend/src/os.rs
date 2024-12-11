use anyhow::{Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{BoundingRect, LineString, Point};
use serde::Serialize;

use crate::fgb;

#[derive(Serialize)]
pub struct Link {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    geometry: LineString,
    id: String,
    road_classification: String,
    start_node: String,
    end_node: String,
}

#[derive(Serialize)]
pub struct Node {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    geometry: Point,
    id: String,
}

/// Returns OS links and nodes in the vicinity of the input
pub async fn read_os_network(line: &LineString, base_url: &str) -> Result<(Vec<Node>, Vec<Link>)> {
    let bbox = line.bounding_rect().unwrap();

    let url1 = format!("{base_url}/os_nodes.fgb");
    let url2 = format!("{base_url}/os_links.fgb");
    let nodes = fgb::read_fgb(bbox, &url1, read_node)
        .await
        .context("nodes")?;
    let links = fgb::read_fgb(bbox, &url2, read_link)
        .await
        .context("links")?;

    Ok((nodes, links))
}

fn read_link(f: &FgbFeature) -> Result<Link> {
    Ok(Link {
        geometry: fgb::get_linestring(f)?,
        id: f.property("id")?,
        road_classification: f.property("road_classification")?,
        start_node: f.property("start_node")?,
        end_node: f.property("end_node")?,
    })
}

fn read_node(f: &FgbFeature) -> Result<Node> {
    Ok(Node {
        geometry: fgb::get_point(f)?,
        id: f.property("id")?,
    })
}
