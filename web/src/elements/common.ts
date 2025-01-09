// @ts-nocheck
import bbox from "@turf/bbox";
import type {
  FeatureCollection,
  GeoJSON,
  LineString,
  Point,
  Polygon,
} from "geojson";
import type { Map } from "maplibre-gl";
import { emptyGeojson } from "svelte-utils/map";

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

export function emptyOutput(): Output {
  return {
    length: 0,
    ruc: emptyGeojson(),
    pop_density: emptyGeojson(),
    os_nodes: emptyGeojson(),
    os_links: emptyGeojson(),
  };
}

export function zoomTo(map: Map, gj: GeoJSON) {
  map.fitBounds(bbox(gj) as [number, number, number, number], {
    animate: false,
    padding: 10,
  });
}
