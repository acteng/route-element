import type {
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Position,
} from "geojson";
import type { Map } from "maplibre-gl";
import { writable, type Writable } from "svelte/store";

export let map: Writable<Map | undefined> = writable(undefined);
export let state: Writable<State> = writable(loadState());

type State = {
  links: Link[];
  jats: JAT[];
};

export function gj(features: Feature[]): FeatureCollection {
  return {
    type: "FeatureCollection" as const,
    features,
  };
}

type Mode =
  | { kind: "neutral" }
  | { kind: "edit-link"; idx: number }
  | { kind: "edit-jat"; idx: number }
  | { kind: "edit-question"; idx: number };
export let mode: Writable<Mode> = writable({ kind: "neutral" });

export type Link = Feature<
  LineString,
  { name: string; color: string; answers: string[] }
>;
export type JAT = Feature<Point, { name: string; color: string }>;

export interface Question {
  name: string;
  description: string;
  choices: string[];
}

// Per side road and some other junction: SA01
// Per roundabout / signal junction: SA02
// Derived from crossings and area: SA06, SA07, SA10

function scores(): string[] {
  return ["", "2", "1", "0", "Critical"];
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
    },
  };
}

function loadState(): State {
  try {
    let x = JSON.parse(window.localStorage.getItem("tmp-rcv2") || "");
    if ("links" in x && "jats" in x) {
      return x;
    }
  } catch (err) {}
  return { links: [], jats: [] };
}
