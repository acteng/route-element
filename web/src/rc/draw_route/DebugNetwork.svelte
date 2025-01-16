<script lang="ts">
  import { OsGraph } from "backend";
  import type { FeatureCollection } from "geojson";
  import { CircleLayer, GeoJSON, LineLayer } from "svelte-maplibre";
  import { Popup } from "svelte-utils/map";

  export let graph: OsGraph;
  export let showDebug: boolean;

  function getData(): {
    os_nodes: FeatureCollection;
    os_links: FeatureCollection;
  } {
    let x = JSON.parse(graph.debugNetwork());
    return {
      os_nodes: JSON.parse(x.os_nodes),
      os_links: JSON.parse(x.os_links),
    };
  }

  let output = getData();
</script>

<GeoJSON data={output.os_links}>
  <LineLayer
    layout={{
      visibility: showDebug ? "visible" : "none",
    }}
    paint={{
      "line-width": 3,
      "line-color": "black",
    }}
  >
    <Popup openOn="hover" let:props>
      {props.road_classification}
    </Popup>
  </LineLayer>
</GeoJSON>

<GeoJSON data={output.os_nodes}>
  <CircleLayer
    manageHoverState
    layout={{
      visibility: showDebug ? "visible" : "none",
    }}
    paint={{
      "circle-color": ["case", ["get", "traffic_signals"], "green", "black"],
      "circle-radius": 5,
    }}
  />
</GeoJSON>
