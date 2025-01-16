import type { Feature, Point } from "geojson";
import { colors, type Position } from "../common";

export type JAT = Feature<
  Point,
  {
    name: string;
    color: string;
    // Indirection for future-proofing dealing with existing/proposed
    details: JunctionAssessment;
  }
>;

export interface JunctionAssessment {
  arms: Arm[];
  movements: Movement[];
  notes: string;
}

export interface Arm {
  point: Position;
  name: string;
}

export type MovementKind = "cycling" | "walking & wheeling";

export interface Movement {
  point1: Position;
  point2: Position;
  point3: Position;
  kind: MovementKind;
  score: "0" | "1" | "2" | "X";
  name: string;
  notes: string;
}

export function blankJAT(idx: number, pt: Position): JAT {
  return {
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: pt,
    },
    properties: {
      name: "Untitled JAT",
      color: colors[idx % colors.length],
      details: {
        arms: [],
        movements: [],
        notes: "",
      },
    },
  };
}
