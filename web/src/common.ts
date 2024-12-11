import type { Map } from "maplibre-gl";
import type {
  Point,
  Polygon,
  GeoJSON,
  FeatureCollection,
  LineString,
} from "geojson";
import bbox from "@turf/bbox";

export interface Output {
  length: number;
  ruc: FeatureCollection<Polygon, { ruc11: string }>;
  pop_density: FeatureCollection<Polygon, { pop_density: number }>;
  os_nodes: FeatureCollection<Point, { id: string }>;
  os_links: FeatureCollection<
    LineString,
    {
      id: string;
      road_classification: string;
      start_node: string;
      end_node: string;
    }
  >;
}

export function zoomTo(map: Map, gj: GeoJSON) {
  map.fitBounds(bbox(gj) as [number, number, number, number], {
    animate: false,
    padding: 10,
  });
}
