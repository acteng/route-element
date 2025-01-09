import type { Feature, LineString } from "geojson";
import { colors } from "../common";

export type SideRoad = Feature<
  LineString,
  {
    name: string;
    color: string;
    sa01: string;
  }
>;

export function blankSideRoad(idx: number): SideRoad {
  return {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [],
    },
    properties: {
      name: "Untitled side road",
      color: colors[idx % colors.length],
      sa01: "",
    },
  };
}
