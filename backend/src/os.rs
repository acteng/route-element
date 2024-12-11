use anyhow::{bail, Result};
use flatgeobuf::{FeatureProperties, FgbFeature, GeozeroGeometry, HttpFgbReader};
use geo::{BoundingRect, LineString, Point, Rect};
use geojson::{Feature, Geometry};

/// Returns OS links and nodes in the vicinity of the input
pub async fn read_os_network(line: &LineString, base_url: &str) -> Result<Vec<Feature>> {
    let bbox = line.bounding_rect().unwrap();

    let url1 = format!("{base_url}/os_nodes.fgb");
    let nodes = read_nearby_points::<String>(bbox, &url1, "id").await?;

    Ok(nodes
        .into_iter()
        .map(|(n, id)| {
            let mut f = Feature::from(Geometry::from(&n));
            f.set_property("id", id);
            f
        })
        .collect())
}

// TODO Generalize...
async fn read_nearby_points<T: geozero::PropertyReadType>(
    bbox: Rect,
    url: &str,
    key: &str,
) -> Result<Vec<(Point, T)>> {
    let mut fgb = HttpFgbReader::open(url)
        .await?
        .select_bbox(bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y)
        .await?;

    let mut results = Vec::new();
    while let Some(feature) = fgb.next().await? {
        let point = get_point(feature)?;
        let value: T = feature.property(key)?;
        results.push((point, value));
    }
    Ok(results)
}

fn get_point(f: &FgbFeature) -> Result<Point> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::Point(p) => Ok(p),
        _ => bail!("Wrong type in fgb"),
    }
}
