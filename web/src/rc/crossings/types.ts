import type { Feature, Point } from "geojson";
import { colors, type Position } from "../common";

export type Crossing = Feature<
  Point,
  {
    name: string;
    color: string;
    // TODO Likely some more
    sa10: string;
  }
>;

export function blankCrossing(idx: number, pt: Position): Crossing {
  return {
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: pt,
    },
    properties: {
      name: "Untitled crossing",
      color: colors[idx % colors.length],
      sa10: "",
    },
  };
}
