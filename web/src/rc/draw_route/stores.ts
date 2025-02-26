import init, { OsGraph } from "backend";
import type { Map } from "maplibre-gl";
import { init as init2, RouteTool } from "route-snapper-ts";
import { emptyGeojson } from "svelte-utils/map";
import { get, writable, type Writable } from "svelte/store";
import { blankCrossing } from "../crossings/types";
import { blankJAT } from "../jat/types";
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
    let graph = await new OsGraph(
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
        graph.getRouteSnapper(),
        writable(emptyGeojson()),
        writable(true),
        writable(0),
      ),
    );
    mode.set({ kind: "draw-route", graph });
  } catch (err) {
    window.alert(err);
  }
}

export function finishRoute(graph: OsGraph) {
  try {
    let feature = JSON.parse(
      get(routeTool)!.inner.calculateRoute(get(waypoints)),
    );
    // TODO Is this possible still?
    if (!feature) {
      window.alert("No route drawn");
      return;
    }

    state.update((x) => {
      for (let split of JSON.parse(
        graph.splitLinks(feature, feature.properties.full_path),
      ).features) {
        let f = blankLink(x.links.length);
        f.geometry = split.geometry;
        // Discard waypoints and other things
        // TODO Need to rename split links
        f.properties.name = feature.properties.route_name;
        x.links.push(f);
      }

      for (let f of JSON.parse(
        graph.getSideRoadCrossings(feature.properties.full_path),
      ).features) {
        x.crossings.push(
          blankCrossing(x.crossings.length, f.geometry.coordinates),
        );
      }

      for (let junction of JSON.parse(
        graph.getSignalizedJunctions(feature.properties.full_path),
      )) {
        let jat = blankJAT(x.jats.length, coordToPt(junction.pt));
        jat.properties.details.arms = junction.arms.map(([name, pt]) => {
          return {
            point: coordToPt(pt),
            name,
          };
        });

        x.jats.push(jat);
      }

      return x;
    });

    mode.set({ kind: "edit-link", idx: get(state).links.length - 1 });
  } catch (err) {
    window.alert(`Bug: ${err}`);
  }

  waypoints.set([]);
  mode.set({ kind: "neutral" });
}

function coordToPt(pt: any): [number, number] {
  return [pt.x, pt.y];
}
