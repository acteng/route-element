use std::collections::{HashMap, HashSet};

use anyhow::{bail, Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{
    BoundingRect, Closest, ClosestPoint, Coord, Distance, Haversine, Length, LineLocatePoint,
    LineString, Point, Rect,
};
use geojson::{Feature, GeoJson, Geometry};
use log::info;
use petgraph::graphmap::UnGraphMap;
use route_snapper_graph::{Edge, EdgeID, NodeID, RouteSnapperMap};
use rstar::{primitives::GeomWithData, RTree};
use serde::Serialize;

use crate::{fgb, OsGraph, RouteNode};

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

pub fn bbox_for_os(line: &LineString) -> Rect {
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

    bbox
}

/// Returns OS links and nodes in the vicinity of the input
pub async fn read_os_network(line: &LineString, base_url: &str) -> Result<(Vec<Node>, Vec<Link>)> {
    let bbox = bbox_for_os(line);
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

pub fn read_link(f: &FgbFeature) -> Result<Link> {
    Ok(Link {
        geometry: fgb::get_linestring(f)?,
        id: f.property("id")?,
        road_classification: f.property("road_classification")?,
        start_node: f.property("start_node")?,
        end_node: f.property("end_node")?,
    })
}

pub fn read_node(f: &FgbFeature) -> Result<Node> {
    Ok(Node {
        geometry: fgb::get_point(f)?,
        id: f.property("id")?,
    })
}

/// Returns just the nodes and links best forming the path
pub fn map_match(
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
            // Big subtlety! Because the nodes and links are separately read in by bounding box,
            // links crossing the bbox might not have one of their nodes present. If the search
            // goes that far, skip it. To deal with in practice, increase the buffer around the
            // input.
            .filter(|(n, _)| node_lookup.contains_key(n))
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
        // Due to the node/link and bbox issue, don't even consider links leaving the bbox
        if node_lookup.contains_key(&link.start_node) && node_lookup.contains_key(&link.end_node) {
            graph.add_edge(&link.start_node, &link.end_node, idx);
        }
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

pub async fn make_route_snapper(base_url: &str, bbox: Rect) -> Result<OsGraph> {
    // Before downloading, sanity check the bbox size
    let dist = Haversine::distance(bbox.min().into(), bbox.max().into());
    if dist > 25_000.0 {
        bail!(
            "Zoom in more to draw a route. The map currently covers a diagonal distance of {dist}m"
        );
    }

    let url1 = format!("{base_url}/os_nodes.fgb");
    let url2 = format!("{base_url}/os_links.fgb");
    let os_nodes = fgb::read_fgb(bbox, &url1, read_node)
        .await
        .context("nodes")?;
    let os_links = fgb::read_fgb(bbox, &url2, read_link)
        .await
        .context("links")?;

    // Convert to RouteSnapperMap
    let mut node_lookup: HashMap<String, NodeID> = HashMap::new();
    let mut nodes: Vec<Coord> = Vec::new();
    for node in os_nodes {
        node_lookup.insert(node.id, NodeID(nodes.len() as u32));
        nodes.push(node.geometry.into());
    }
    let mut links_per_node: HashMap<NodeID, Vec<EdgeID>> = HashMap::new();
    let mut node_pair_to_edge: HashMap<(NodeID, NodeID), EdgeID> = HashMap::new();

    let mut edges = Vec::new();
    for link in os_links {
        // Skip links crossing the bbox
        if let (Some(node1), Some(node2)) = (
            node_lookup.get(&link.start_node).cloned(),
            node_lookup.get(&link.end_node).cloned(),
        ) {
            let edge_id = EdgeID(edges.len() as u32);
            links_per_node
                .entry(node1)
                .or_insert_with(Vec::new)
                .push(edge_id);
            links_per_node
                .entry(node2)
                .or_insert_with(Vec::new)
                .push(edge_id);
            node_pair_to_edge.insert((node1, node2), edge_id);
            node_pair_to_edge.insert((node2, node1), edge_id);

            edges.push(Edge {
                node1,
                node2,
                geometry: link.geometry,
                name: None,

                // Isn't serialized, doesn't matter
                length_meters: 0.0,
                forward_cost: None,
                backward_cost: None,
            });
        }
    }

    Ok(OsGraph {
        links_per_node,
        node_pair_to_edge,
        graph: RouteSnapperMap {
            nodes,
            edges,
            override_forward_costs: Vec::new(),
            override_backward_costs: Vec::new(),
        },
    })
}

pub fn get_side_roads(graph: &OsGraph, full_path: Vec<RouteNode>) -> GeoJson {
    let mut batches: Vec<Vec<NodeID>> = Vec::new();
    for batch in full_path.chunk_by(|a, b| a.snapped.is_some() == b.snapped.is_some()) {
        // Ignore freehand segments
        if batch[0].snapped.is_some() {
            batches.push(
                batch
                    .into_iter()
                    .map(|n| NodeID(n.snapped.unwrap()))
                    .collect(),
            );
        }
    }

    // TODO This'll usually have an error at the beginning and end, extending the route itself.
    // Hard to distinguish.
    let mut features = Vec::new();
    for batch in batches {
        let edges_in_this_batch: HashSet<EdgeID> = batch
            .windows(2)
            .map(|pair| graph.node_pair_to_edge[&(pair[0], pair[1])])
            .collect();

        for node in batch {
            for edge in &graph.links_per_node[&node] {
                if !edges_in_this_batch.contains(edge) {
                    features.push(Feature::from(Geometry::from(
                        &graph.graph.edges[edge.0 as usize].geometry,
                    )));
                }
            }
        }
    }

    GeoJson::from(features)
}
