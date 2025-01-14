import init, { getSideRoads, makeRouteSnapper } from "backend";
import type { Map } from "maplibre-gl";
import { init as init2, RouteTool } from "route-snapper-ts";
import { emptyGeojson } from "svelte-utils/map";
import { get, writable, type Writable } from "svelte/store";
import { colors } from "../common";
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
  await init2();

  let baseURL =
    import.meta.env.MODE == "development"
      ? "http://localhost:5173/route-element/route-element"
      : "https://assets.od2net.org/route-element";

  let b = map.getBounds();
  try {
    let buffer = await makeRouteSnapper(
      baseURL,
      b.getEast(),
      b.getNorth(),
      b.getWest(),
      b.getSouth(),
    );

    // The stores are unused; the WASM API is used directly. This TS wrapper is unused.
    routeTool.set(
      new RouteTool(
        map,
        buffer,
        writable(emptyGeojson()),
        writable(true),
        writable(0),
      ),
    );
    mode.set({ kind: "draw-route" });
  } catch (err) {
    window.alert(err);
  }
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

    addSideRoads(feature.properties.full_path);

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

type Node = { snapped: number } | { free: [number, number] };

function addSideRoads(nodes: Node[]) {
  state.update((x) => {
    for (let f of JSON.parse(getSideRoads(nodes)).features) {
      // Mimic blankSideRoad
      f.properties.name = "Untitled side road";
      f.properties.sa01 = "";
      f.properties.color = colors[x.side_roads.length % colors.length];
      x.side_roads.push(f);
    }
    return x;
  });
}
