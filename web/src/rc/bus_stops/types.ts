import type { Feature, Point } from "geojson";
import { colors, type Position } from "../common";

export type BusStop = Feature<
  Point,
  {
    name: string;
    color: string;
    // TODO Also partly sa05?
    st20: string;
  }
>;

export function blankBusStop(idx: number, pt: Position): BusStop {
  return {
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: pt,
    },
    properties: {
      name: "Untitled bus stop",
      color: colors[idx % colors.length],
      st20: "",
    },
  };
}
