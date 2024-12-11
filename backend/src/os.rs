use std::collections::HashMap;

use anyhow::{bail, Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{BoundingRect, Coord, Haversine, Length, LineString, Point};
use petgraph::graphmap::UnGraphMap;
use rstar::{primitives::GeomWithData, RTree};
use serde::Serialize;

use crate::fgb;

#[derive(Clone, Serialize)]
pub struct Link {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    geometry: LineString,
    id: String,
    road_classification: String,
    start_node: String,
    end_node: String,
}

#[derive(Clone, Serialize)]
pub struct Node {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    geometry: Point,
    id: String,
}

/// Returns OS links and nodes in the vicinity of the input
pub async fn read_os_network(line: &LineString, base_url: &str) -> Result<(Vec<Node>, Vec<Link>)> {
    let mut bbox = line.bounding_rect().unwrap();

    // Expand the bbox, so we're more likely to have a nice connected graph around the input
    // This horrible hack on WGS84 coordinates work well enough for small inputs
    let w = bbox.width();
    let h = bbox.height();
    bbox.set_min(Coord {
        x: bbox.min().x - w,
        y: bbox.min().y - h,
    });
    bbox.set_max(Coord {
        x: bbox.max().x + w,
        y: bbox.max().y + h,
    });

    let url1 = format!("{base_url}/os_nodes.fgb");
    let url2 = format!("{base_url}/os_links.fgb");
    let nodes = fgb::read_fgb(bbox, &url1, read_node)
        .await
        .context("nodes")?;
    let links = fgb::read_fgb(bbox, &url2, read_link)
        .await
        .context("links")?;

    let Some((path_nodes, path_links)) = map_match(&nodes, &links, line) else {
        bail!("No matching path");
    };

    //Ok((nodes, links))
    Ok((path_nodes, path_links))
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

/// Returns just the nodes and links best forming the path
fn map_match(
    nodes: &Vec<Node>,
    links: &Vec<Link>,
    line: &LineString,
) -> Option<(Vec<Node>, Vec<Link>)> {
    let closest_node = RTree::bulk_load(
        nodes
            .iter()
            .map(|node| GeomWithData::new(node.geometry, node.id.clone()))
            .collect(),
    );
    let start = &closest_node
        .nearest_neighbor(&line.points().next().unwrap())?
        .data;
    let end = &closest_node
        .nearest_neighbor(&line.points().last().unwrap())?
        .data;

    // Node IDs are strings, the edge weight is the index into links
    let mut graph: UnGraphMap<&String, usize> = UnGraphMap::new();
    for (idx, link) in links.iter().enumerate() {
        graph.add_edge(&link.start_node, &link.end_node, idx);
    }

    let node_lookup: HashMap<String, &Node> =
        HashMap::from_iter(nodes.iter().map(|node| (node.id.clone(), node)));

    let (_, path) = petgraph::algo::astar(
        &graph,
        start,
        |n| n == end,
        |(_, _, idx)| links[*idx].geometry.length::<Haversine>(),
        |_| 0.0,
    )?;

    let mut path_nodes = Vec::new();
    let mut path_links = Vec::new();
    for n in &path {
        path_nodes.push(node_lookup[*n].clone());
    }
    for pair in path.windows(2) {
        path_links.push(links[*graph.edge_weight(pair[0], pair[1]).unwrap()].clone());
    }

    Some((path_nodes, path_links))
}
