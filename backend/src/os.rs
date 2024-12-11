use anyhow::Result;
use geo::{BoundingRect, LineString, Point};
use geojson::{Feature, Geometry};

use crate::fgb;

/// Returns OS links and nodes in the vicinity of the input
pub async fn read_os_network(
    line: &LineString,
    base_url: &str,
) -> Result<(Vec<Feature>, Vec<Feature>)> {
    let bbox = line.bounding_rect().unwrap();

    let url1 = format!("{base_url}/os_nodes.fgb");
    let nodes: Vec<(Point, String)> = fgb::read_fgb(bbox, &url1, fgb::get_point, "id").await?;

    // TODO Need to read more properties; make a proper struct, then start using that for GJ output
    // too
    let url2 = format!("{base_url}/os_links.fgb");
    let links: Vec<(LineString, String)> =
        fgb::read_fgb(bbox, &url2, fgb::get_linestring, "road_classification").await?;

    Ok((
        nodes
            .into_iter()
            .map(|(n, id)| {
                let mut f = Feature::from(Geometry::from(&n));
                f.set_property("id", id);
                f
            })
            .collect(),
        links
            .into_iter()
            .map(|(l, road_classification)| {
                let mut f = Feature::from(Geometry::from(&l));
                f.set_property("road_classification", road_classification);
                f
            })
            .collect(),
    ))
}
