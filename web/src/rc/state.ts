import { OsGraph } from "backend";
import type { Feature, FeatureCollection } from "geojson";
import type { Map } from "maplibre-gl";
import { writable, type Writable } from "svelte/store";
import type { BusStop } from "./bus_stops/types";
import type { Crossing } from "./crossings/types";
import type { JAT } from "./jat/types";
import type { Link } from "./links/types";
import type { SideRoad } from "./side_roads/types";

export let map: Writable<Map | undefined> = writable(undefined);
export let state: Writable<State> = writable(loadState());

export type State = {
  links: Link[];
  jats: JAT[];
  bus_stops: BusStop[];
  crossings: Crossing[];
  side_roads: SideRoad[];
};

export function gj(features: Feature[]): FeatureCollection {
  return {
    type: "FeatureCollection" as const,
    features,
  };
}

type Mode =
  | { kind: "neutral" }
  | { kind: "new-point"; obj: "jat" | "bus stop" | "crossing" }
  | { kind: "edit-link"; idx: number }
  | { kind: "link-questions"; idx: number }
  | { kind: "edit-jat"; idx: number }
  | { kind: "edit-jat-detail"; idx: number }
  | { kind: "edit-bus-stop"; idx: number }
  | { kind: "bus-stop-questions" }
  | { kind: "edit-crossing"; idx: number }
  | { kind: "edit-side-road"; idx: number }
  | { kind: "side-road-questions" }
  | { kind: "draw-route"; graph: OsGraph };
export let mode: Writable<Mode> = writable({ kind: "neutral" });

export function checkState(x: any): boolean {
  return (
    "links" in x &&
    "jats" in x &&
    "bus_stops" &&
    "crossings" in x &&
    "side_roads" in x
  );
}

function loadState(): State {
  try {
    let x = JSON.parse(window.localStorage.getItem("tmp-rcv2") || "");
    if (checkState(x)) {
      return x;
    }
  } catch (err) {}
  return { links: [], jats: [], bus_stops: [], crossings: [], side_roads: [] };
}
