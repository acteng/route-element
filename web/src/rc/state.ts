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
  | { kind: "edit-jat"; idx: number }
  | { kind: "edit-jat-detail"; idx: number; stage: "existing" | "proposed" }
  | { kind: "edit-bus-stop"; idx: number }
  | { kind: "edit-crossing"; idx: number }
  | { kind: "edit-side-road"; idx: number }
  | { kind: "edit-question"; idx: number };
export let mode: Writable<Mode> = writable({ kind: "neutral" });

function loadState(): State {
  try {
    let x = JSON.parse(window.localStorage.getItem("tmp-rcv2") || "");
    if (
      "links" in x &&
      "jats" in x &&
      "bus_stops" &&
      "crossings" in x &&
      "side_roads" in x
    ) {
      return x;
    }
  } catch (err) {}
  return { links: [], jats: [], bus_stops: [], crossings: [], side_roads: [] };
}
