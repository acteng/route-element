import type { Map } from "maplibre-gl";
import { init, RouteTool } from "route-snapper-ts";
import { emptyGeojson } from "svelte-utils/map";
import { get, writable, type Writable } from "svelte/store";
import { blankLink } from "../links/types";
import { mode, state } from "../state";

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
  try {
    let feature = JSON.parse(
      get(routeTool)!.inner.calculateRoute(get(waypoints)),
    );
    // TODO Is this possible still?
    if (!feature) {
      window.alert("No route drawn");
      return;
    }

    // TODO Make multiple links when freehand sections appear

    let f = blankLink(get(state).links.length);
    f.geometry = feature.geometry;
    // Discard waypoints and other things
    f.properties.name = feature.properties.route_name;

    state.update((x) => {
      x.links.push(f);
      return x;
    });
    mode.set({ kind: "edit-link", idx: get(state).links.length - 1 });
  } catch (err) {
    window.alert(`Bug: ${err}`);
  }

  waypoints.set([]);
  mode.set({ kind: "neutral" });
}
