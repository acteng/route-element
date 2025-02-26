This is a quick exploration of how to calculate some characteristics about a route.

## Generating the RUC file

Generate the RUC layer using `atip-data-prep`, then grab the temporary GeoJSON file.

Convert: `ogr2ogr ruc.fgb rural_urban_classification.geojson`

## Generating the census file

Same, but for `tmp_census_output_areas`

## Getting OS data

Download the GB-wide gpkg from <https://osdatahub.os.uk/downloads/open/OpenRoads>. Create a FGB with links and nodes:

```
ogr2ogr os_links.fgb oproad_gb.gpkg -t_srs EPSG:4326 -sql 'SELECT id, road_classification, start_node, end_node, name_1 as name, geometry FROM road_link'
ogr2ogr os_nodes.fgb oproad_gb.gpkg -t_srs EPSG:4326 -sql 'SELECT id, geometry FROM road_node'
```

## Get traffic signal nodes from OSM

OS appears to have no dataset indicating signalized juntions.

```
cd data_prep
osmium tags-filter ~/Downloads/england-latest.osm.pbf n/highway=traffic_signals -o tsigs.osm.pbf
osmium export tsigs.osm.pbf -o tsigs.geojson
cargo run --release -- /home/dabreegster/cloudflare_sync/route-element/os_nodes.fgb tsigs.geojson
ogr2ogr tsig_os_nodes.fgb tsig_os_nodes.geojson
```
