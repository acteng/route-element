import type { Map } from "maplibre-gl";
import { init, RouteTool } from "route-snapper-ts";
import { emptyGeojson } from "svelte-utils/map";
import { writable, type Writable } from "svelte/store";
import { mode } from "../state";

export interface Waypoint {
  point: [number, number];
  snapped: boolean;
}

export let routeTool: Writable<RouteTool | null> = writable(null);
export const waypoints: Writable<Waypoint[]> = writable([]);

export async function setupRouteTool(map: Map) {
  await init();

  let url = "https://atip.uk/route-snappers/v3/LAD_Leeds.bin.gz";
  let resp = await fetch(url);
  let buffer = await resp.arrayBuffer();
  new Uint8Array(buffer);

  // The stores are unused; the WASM API is used directly. This TS wrapper is unused.
  routeTool.set(
    new RouteTool(
      map,
      new Uint8Array(buffer),
      writable(emptyGeojson()),
      writable(true),
      writable(0),
    ),
  );
}

export function finishRoute() {
  waypoints.set([]);
  mode.set({ kind: "neutral" });
}
