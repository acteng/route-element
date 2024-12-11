use anyhow::{bail, Result};
use flatgeobuf::{FeatureProperties, FgbFeature, GeozeroGeometry, HttpFgbReader};
use geo::{LineString, MultiPolygon, Point, Rect};

pub async fn read_fgb<Geom, F: Fn(&FgbFeature) -> Result<Geom>, T: geozero::PropertyReadType>(
    bbox: Rect,
    url: &str,
    get_geom: F,
    key: &str,
) -> Result<Vec<(Geom, T)>> {
    let mut fgb = HttpFgbReader::open(url)
        .await?
        .select_bbox(bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y)
        .await?;

    let mut results = Vec::new();
    while let Some(feature) = fgb.next().await? {
        let geom = get_geom(feature)?;
        let value: T = feature.property(key)?;
        results.push((geom, value));
    }
    Ok(results)
}

pub fn get_multi_polygon(f: &FgbFeature) -> Result<MultiPolygon> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::Polygon(p) => Ok(MultiPolygon(vec![p])),
        geo::Geometry::MultiPolygon(mp) => Ok(mp),
        _ => bail!("Wrong type in fgb"),
    }
}

pub fn get_point(f: &FgbFeature) -> Result<Point> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::Point(p) => Ok(p),
        _ => bail!("Wrong type in fgb"),
    }
}

pub fn get_linestring(f: &FgbFeature) -> Result<LineString> {
    let mut p = geozero::geo_types::GeoWriter::new();
    f.process_geom(&mut p)?;
    match p.take_geometry().unwrap() {
        geo::Geometry::LineString(ls) => Ok(ls),
        _ => bail!("Wrong type in fgb"),
    }
}
