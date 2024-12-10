This is a quick exploration of how to calculate some characteristics about a route.

## Generating the RUC file

Generate the RUC layer using `atip-data-prep`, then grab the temporary GeoJSON file.

Convert: `ogr2ogr ruc.fgb rural_urban_classification.geojson`

## Generating the census file

Same, but for `tmp_census_output_areas`
