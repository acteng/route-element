use std::collections::HashMap;

use anyhow::{bail, Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{
    BoundingRect, Closest, ClosestPoint, Coord, Distance, Haversine, Length, LineLocatePoint,
    LineString, Point,
};
use log::info;
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
        bail!("Couldn't find path");
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
    input: &LineString,
) -> Option<(Vec<Node>, Vec<Link>)> {
    let closest_node = RTree::bulk_load(
        nodes
            .iter()
            .map(|node| GeomWithData::new(node.geometry, node.id.clone()))
            .collect(),
    );
    let start = closest_node
        .nearest_neighbor(&input.points().next().unwrap())?
        .data
        .clone();
    let end = closest_node
        .nearest_neighbor(&input.points().last().unwrap())?
        .data
        .clone();

    // Try greedy first
    if let Some(result) = greedy_snap(nodes, links, start.clone(), end.clone(), input) {
        return Some(result);
    }
    info!("Greedy failed, falling back to Dijkstra");
    dijkstra(nodes, links, start, end)
}

// Adapted from https://github.com/a-b-street/15m/blob/main/graph/src/snap.rs
fn greedy_snap(
    nodes: &Vec<Node>,
    links: &Vec<Link>,
    start: String,
    end: String,
    input: &LineString,
) -> Option<(Vec<Node>, Vec<Link>)> {
    // Node IDs are strings, the edge weight is the index into links
    let node_lookup: HashMap<String, &Node> =
        HashMap::from_iter(nodes.iter().map(|node| (node.id.clone(), node)));
    let mut links_per_node: HashMap<String, Vec<&Link>> = HashMap::new();
    for link in links {
        links_per_node
            .entry(link.start_node.clone())
            .or_insert_with(Vec::new)
            .push(link);
        links_per_node
            .entry(link.end_node.clone())
            .or_insert_with(Vec::new)
            .push(link);
    }

    let mut current = start;
    let mut fraction_along = 0.0;
    let mut path_nodes = Vec::new();
    let mut path_links = Vec::new();

    while current != end {
        let next_steps = links_per_node[&current].iter().flat_map(|link| {
            if link.start_node != current {
                Some((link.start_node.clone(), link))
            } else if link.end_node != current {
                Some((link.end_node.clone(), link))
            } else {
                // A loop on n
                None
            }
        });

        match next_steps
            .filter_map(|(n, link)| {
                // Find the closest point on the input linestring to this possible next
                // node
                match input.closest_point(&node_lookup[&n].geometry) {
                    Closest::Intersection(pt) | Closest::SinglePoint(pt) => {
                        // How far along on the input linestring is it? If we'd move backwards,
                        // skip it
                        let new_fraction_along = input.line_locate_point(&pt)?;
                        if new_fraction_along > fraction_along {
                            let dist = (100.0 * Haversine::distance(pt, node_lookup[&n].geometry))
                                as usize;
                            Some((n, link, dist, new_fraction_along))
                        } else {
                            None
                        }
                    }
                    Closest::Indeterminate => None,
                }
            })
            // TODO Maybe also use new_fraction_along to judge the best next step
            .min_by_key(|(_, _, dist, _)| *dist)
        {
            Some((n, link, _, new_fraction_along)) => {
                fraction_along = new_fraction_along;
                path_nodes.push(node_lookup[&n].clone());
                #[allow(suspicious_double_ref_op)]
                path_links.push(link.clone().clone());
                current = n;
            }
            None => {
                log::info!("Got stuck at {current}");
                return None;
            }
        }
    }

    Some((path_nodes, path_links))
}

fn dijkstra(
    nodes: &Vec<Node>,
    links: &Vec<Link>,
    start: String,
    end: String,
) -> Option<(Vec<Node>, Vec<Link>)> {
    let node_lookup: HashMap<String, &Node> =
        HashMap::from_iter(nodes.iter().map(|node| (node.id.clone(), node)));

    // Node IDs are strings, the edge weight is the index into links
    let mut graph: UnGraphMap<&String, usize> = UnGraphMap::new();
    for (idx, link) in links.iter().enumerate() {
        graph.add_edge(&link.start_node, &link.end_node, idx);
    }

    let (_, path) = petgraph::algo::astar(
        &graph,
        &start,
        |n| *n == end,
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
