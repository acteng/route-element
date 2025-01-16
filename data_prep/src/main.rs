use std::fs::File;
use std::io::BufReader;

use anyhow::{bail, Result};
use flatgeobuf::{
    FallibleStreamingIterator, FeatureProperties, FgbFeature, FgbReader, FgbWriter, GeometryType,
    GeozeroGeometry,
};
use geo::Point;
use rstar::{primitives::GeomWithData, RTree};
use serde::Deserialize;

/// Call with `os_nodes.fgb tsigs.geojson`. It'll match traffic signals to OS nodes, write
/// `tsig_os_nodes.fgb` and `extra_tsigs.geojson`.
fn main() -> Result<()> {
    let args: Vec<String> = std::env::args().collect();

    let nodes = read_nodes(&args[1])?;
    println!("Got {} nodes", nodes.size());

    let tsigs = read_tsigs(&args[2])?;
    println!("Got {} tsigs", tsigs.len());

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

#[derive(Deserialize)]
struct PointGJ {
    #[serde(deserialize_with = "geojson::de::deserialize_geometry")]
    geometry: Point,
}

/////

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
