import type { Feature, LineString } from "geojson";

export type Link = Feature<
  LineString,
  { name: string; color: string } & LinkDetails
>;

export interface LinkDetails {
  q1: "a" | "b" | "";
  q2: "c" | "d" | "";
  q3: number;
}

export function blankLink(idx: number): Link {
  // Vivid from https://carto.com/carto-colors/
  let colors = [
    "#66C5CC",
    "#F6CF71",
    "#F89C74",
    "#DCB0F2",
    "#87C55F",
    "#9EB9F3",
    "#FE88B1",
    "#C9DB74",
    "#8BE0A4",
    "#B497E7",
    "#D3B484",
    "#B3B3B3",
  ];

  return {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: [],
    },
    properties: {
      name: "Untitled link",
      color: colors[idx % colors.length],

      q1: "",
      q2: "",
      q3: 0,
    },
  };
}

export function loadState(): Link[] {
  try {
    let gj = JSON.parse(window.localStorage.getItem("tmp-rcv2") || "");
    if ("features" in gj) {
      return gj.features;
    }
  } catch (err) {}
  return [];
}
