import type { Feature, LineString } from "geojson";

export type Link = Feature<
  LineString,
  { name: string; color: string; answers: string[] }
>;

export interface Question {
  name: string;
  choices: string[];
}

export let questions: Question[] = [
  {
    name: "Question 1",
    choices: ["", "A", "B"],
  },
  {
    name: "Question 2",
    choices: ["", "C", "D"],
  },
  {
    name: "Question 3",
    choices: ["", "e", "ffff"],
  },
];

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
      answers: Array(questions.length).fill(""),
    },
  };
}

export function loadState(): Link[] {
  try {
    let gj = JSON.parse(window.localStorage.getItem("tmp-rcv2") || "");
    if ("features" in gj && "answers" in gj.features[0].properties) {
      return gj.features;
    }
  } catch (err) {}
  return [];
}
