import type { Feature, LineString } from "geojson";
import { colors, scores } from "../common";

export type Link = Feature<
  LineString,
  { name: string; color: string; answers: string[] }
>;

export function blankLink(idx: number): Link {
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

// Per side road and priority junction: SA01
// - raised table, continuous footway, radius
// - and still a judgment
// Per roundabout / signal junction: SA02
// Derived from crossings and area: SA06, SA07, SA10

interface Question {
  name: string;
  description: string;
  choices: string[];
}

export let questions: Question[] = [
  {
    name: "Street or path check",
    description: "Is this on-carriageway or a traffic-free path?",
    choices: ["", "Street check", "Path check"],
  },
  {
    name: "SA03",
    description: "lane widths",
    choices: scores(),
  },
  {
    name: "SA04",
    description: "trip hazards",
    choices: scores(),
  },
  {
    name: "SA05",
    description: "kerbside activity",
    choices: scores(),
  },
  {
    name: "SA08",
    description: "motor traffic speed",
    choices: scores(),
  },
  {
    name: "SA09",
    description: "motor traffic volume",
    choices: scores(),
  },
  {
    name: "SA11",
    description: "footway widths",
    choices: scores(),
  },
  {
    name: "SA12",
    description: "effective width next to tram lines",
    choices: scores(),
  },
  {
    name: "SA13",
    description: "crossing angle of tram/train rails",
    choices: scores(),
  },
  {
    name: "SA14",
    description: "cycling surface and maintenance defects",
    choices: scores(),
  },
  {
    name: "SA15",
    description: "WW surface and maintenance defects",
    choices: scores(),
  },
  {
    name: "SA16",
    description: "guard railing",
    choices: scores(),
  },
];
