use std::collections::{HashMap, HashSet};

use anyhow::{bail, Context, Result};
use flatgeobuf::{FeatureProperties, FgbFeature};
use geo::{
    BoundingRect, Closest, ClosestPoint, Coord, Distance, Haversine, Length, LineInterpolatePoint,
    LineLocatePoint, LineString, Point, Rect,
};
use geojson::{Feature, GeoJson, Geometry};
use log::{error, info};
use petgraph::graphmap::UnGraphMap;
use route_snapper_graph::{Edge, EdgeID, NodeID, RouteSnapperMap};
use rstar::{primitives::GeomWithData, RTree};
use serde::Serialize;
use utils::LineSplit;
use wasm_bindgen::prelude::*;

use crate::{fgb, RouteNode};

#[wasm_bindgen]
pub struct OsGraph {
    graph: RouteSnapperMap,
    links_per_node: HashMap<NodeID, Vec<EdgeID>>,
    // TODO Might break with multi-graphs
    node_pair_to_edge: HashMap<(NodeID, NodeID), EdgeID>,

    signalized_junctions: HashSet<NodeID>,
    all_links: Vec<Link>,
    all_nodes: Vec<Node>,
}

#[wasm_bindgen]
#[derive(Clone, Serialize)]
pub struct Link {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    geometry: LineString,
    id: String,
    name: String,
    road_classification: String,
    start_node: String,
    end_node: String,
}

#[wasm_bindgen]
#[derive(Clone, Serialize)]
pub struct Node {
    #[serde(serialize_with = "geojson::ser::serialize_geometry")]
    geometry: Point,
    id: String,
    traffic_signals: bool,
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
        name: f.property("name").ok().unwrap_or_else(String::new),
        road_classification: f.property("road_classification")?,
        start_node: f.property("start_node")?,
        end_node: f.property("end_node")?,
    })
}

pub fn read_node(f: &FgbFeature) -> Result<Node> {
    Ok(Node {
        geometry: fgb::get_point(f)?,
        id: f.property("id")?,
        traffic_signals: f.property("traffic_signals")?,
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

impl OsGraph {
    pub async fn create(base_url: &str, bbox: Rect) -> Result<OsGraph> {
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
        let mut signalized_junctions = HashSet::new();
        for node in &os_nodes {
            let id = NodeID(nodes.len() as u32);
            node_lookup.insert(node.id.clone(), id);
            nodes.push(node.geometry.into());
            if node.traffic_signals {
                signalized_junctions.insert(id);
            }
        }
        let mut links_per_node: HashMap<NodeID, Vec<EdgeID>> = HashMap::new();
        let mut node_pair_to_edge: HashMap<(NodeID, NodeID), EdgeID> = HashMap::new();

        let mut edges = Vec::new();
        for link in &os_links {
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
                    geometry: link.geometry.clone(),
                    name: Some(link.name.clone()),

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

            signalized_junctions,
            all_nodes: os_nodes,
            all_links: os_links,
        })
    }

    pub fn get_route_snapper(&self) -> Result<Vec<u8>> {
        Ok(bincode::serialize(&self.graph)?)
    }

    pub fn debug_network(&self) -> serde_json::Value {
        serde_json::json!({
            "os_nodes": geojson::ser::to_feature_collection_string(&self.all_nodes).unwrap(),
            "os_links": geojson::ser::to_feature_collection_string(&self.all_links).unwrap(),
        })
    }

    pub fn get_side_road_crossings(&self, full_path: Vec<RouteNode>) -> GeoJson {
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
            let nodes_in_this_batch: HashSet<NodeID> = batch.iter().cloned().collect();
            let edges_in_this_batch: HashSet<EdgeID> = batch
                .windows(2)
                .map(|pair| self.node_pair_to_edge[&(pair[0], pair[1])])
                .collect();

            for node in batch {
                for edge in &self.links_per_node[&node] {
                    if !edges_in_this_batch.contains(edge) {
                        // Take a point a fixed distance away from the route
                        let dist_away: f64 = 10.0;
                        let side_road = &self.graph.edges[edge.0 as usize];
                        let len = side_road.geometry.length::<Haversine>();
                        let distance = if nodes_in_this_batch.contains(&side_road.node1) {
                            dist_away.min(len)
                        } else {
                            (len - 10.0).max(0.0)
                        };
                        let pt = side_road
                            .geometry
                            .line_interpolate_point(distance / len)
                            .unwrap();
                        features.push(Feature::from(Geometry::from(&pt)));
                    }
                }
            }
        }

        GeoJson::from(features)
    }

    pub fn get_signalized_junctions(&self, full_path: Vec<RouteNode>) -> Vec<SignalizedJunction> {
        let mut junctions = Vec::new();
        for node in full_path {
            if let Some(x) = node.snapped {
                let node_id = NodeID(x);
                if self.signalized_junctions.contains(&node_id) {
                    let pt = self.graph.nodes[x as usize];
                    let arms = self.links_per_node[&node_id]
                        .iter()
                        .map(|edge| make_arm(self, *edge, node_id))
                        .collect();
                    junctions.push(SignalizedJunction { pt, arms });
                }
            }
        }
        junctions
    }

    pub fn split_links(&self, full_ls: LineString, full_path: Vec<RouteNode>) -> GeoJson {
        let mut split_pts: Vec<Coord> = Vec::new();
        for node in &full_path {
            if let Some(x) = node.snapped {
                if self.signalized_junctions.contains(&NodeID(x)) {
                    split_pts.push(self.graph.nodes[x as usize]);
                }
            }
        }
        // TODO Not quite right, because it'll double count on either side of frees
        for pair in full_path.windows(2) {
            if pair[0].snapped.is_some() != pair[1].snapped.is_some() {
                split_pts.push(pair[0].free.or(pair[1].free).unwrap().into());
            }
        }

        let Some(splits) = split_line_at_points(&full_ls, &split_pts) else {
            error!("Couldn't split");
            return GeoJson::from(vec![Feature::from(Geometry::from(&full_ls))]);
        };
        GeoJson::from(
            splits
                .into_iter()
                .map(|ls| Feature::from(Geometry::from(&ls)))
                .collect::<Vec<_>>(),
        )
    }
}

fn split_line_at_points(ls: &LineString, pts: &Vec<Coord>) -> Option<Vec<LineString>> {
    let mut fractions = Vec::new();
    for pt in pts {
        fractions.push(ls.line_locate_point(&Point::from(*pt))?);
    }

    // Make sure to handle the start and end
    fractions.push(0.0);
    fractions.push(1.0);
    fractions.sort_by_key(|x| (x * 10000.0) as usize);
    fractions.dedup();

    let mut result = Vec::new();
    for split in ls.line_split_many(&fractions)? {
        if let Some(ls) = split {
            result.push(ls);
        }
    }
    Some(result)
}

#[derive(Serialize)]
pub struct SignalizedJunction {
    pt: Coord,
    arms: Vec<(String, Coord)>,
}

fn make_arm(graph: &OsGraph, edge: EdgeID, node: NodeID) -> (String, Coord) {
    // Take a point a fixed distance away from the junction node
    let dist_away: f64 = 10.0;
    let edge = &graph.graph.edges[edge.0 as usize];
    let len = edge.geometry.length::<Haversine>();
    let distance = if edge.node1 == node {
        dist_away.min(len)
    } else {
        (len - 10.0).max(0.0)
    };
    let pt = edge
        .geometry
        .line_interpolate_point(distance / len)
        .unwrap();
    (edge.name.clone().unwrap(), pt.into())
}
