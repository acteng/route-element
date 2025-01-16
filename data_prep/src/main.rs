use std::collections::HashSet;
use std::fs::File;
use std::io::BufReader;

use anyhow::{bail, Result};
use flatgeobuf::{
    FallibleStreamingIterator, FeatureProperties, FgbFeature, FgbReader, GeozeroGeometry,
};
use geo::{Distance, Haversine, Point};
use geojson::{Feature, Geometry};
use rstar::{primitives::GeomWithData, RTree};
use serde::{Deserialize, Serialize};

/// Call with `os_nodes.fgb tsigs.geojson`. It'll match traffic signals to OS nodes, write
/// `tsig_os_nodes.geojson` and `extra_tsigs.geojson`.
fn main() -> Result<()> {
    let args: Vec<String> = std::env::args().collect();
    // TODO Quite high, but the OS nodes are very simplified
    let dist_threshold = 30.0;

    let mut nodes = read_nodes(&args[1])?;
    println!("Got {} nodes", nodes.size());

    let tsigs = read_tsigs(&args[2])?;
    println!("Got {} tsigs. Matching", tsigs.len());

    // TODO Doing the matching in WGS84 riskily
    let mut nodes_with_tsig = HashSet::new();
    let mut leftover_tsigs = Vec::new();
    for tsig in tsigs {
        // Assume there are more OSM tsigs than OS nodes. Never match one tsig to multiple OS
        // nodes.
        if let Some(node) = nodes.nearest_neighbor(&tsig) {
            let dist = Haversine::distance(tsig, *node.geom());
            if dist < dist_threshold {
                nodes_with_tsig.insert(node.data.clone());
                continue;
            }
        }

        leftover_tsigs.push(tsig);
    }

    println!("Writing extra_tsigs.geojson");
    write_tsigs("extra_tsigs.geojson", leftover_tsigs)?;

    println!("Writing tsig_os_nodes.geojson");
    let mut outs = Vec::new();
    for node in nodes.drain() {
        let mut f = Feature::from(Geometry::from(node.geom()));
        f.set_property("traffic_signals", nodes_with_tsig.contains(&node.data));
        f.set_property("id", node.data);
        outs.push(f);
    }
    std::fs::write(
        "tsig_os_nodes.geojson",
        serde_json::to_string(&geojson::GeoJson::from(outs))?,
    )?;

    Ok(())
}

/////

fn read_tsigs(path: &str) -> Result<Vec<Point>> {
    let input = std::fs::read_to_string(path)?;
    Ok(
        geojson::de::deserialize_feature_collection_str_to_vec::<PointGJ>(&input)?
            .into_iter()
            .map(|f| f.geometry)
            .collect(),
    )
}

fn write_tsigs(path: &str, tsigs: Vec<Point>) -> Result<()> {
    let f = File::create(path)?;
    let features = tsigs
        .into_iter()
        .map(|pt| PointGJ { geometry: pt })
        .collect::<Vec<_>>();
    geojson::ser::to_feature_collection_writer(f, &features)?;
    Ok(())
}

#[derive(Serialize, Deserialize)]
struct PointGJ {
    #[serde(
        deserialize_with = "geojson::de::deserialize_geometry",
        serialize_with = "geojson::ser::serialize_geometry"
    )]
    geometry: Point,
}

/////

// TODO Use backend's fgb helpers?
fn read_nodes(path: &str) -> Result<RTree<GeomWithData<Point, String>>> {
    let mut nodes = Vec::new();
    let mut fgb = FgbReader::open(BufReader::new(File::open(path)?))?.select_all()?;
    while let Some(feature) = fgb.next()? {
        let pt = get_point(&feature)?;
        let id: String = feature.property("id")?;
        nodes.push(GeomWithData::new(pt, id));
    }

    Ok(RTree::bulk_load(nodes))
}

fn get_point(f: &FgbFeature) -> Result<Point> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::Point(p) => Ok(p),
        _ => bail!("Wrong type in fgb"),
    }
}
