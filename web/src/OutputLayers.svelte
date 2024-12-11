<script lang="ts">
  import {
    GeoJSON,
    LineLayer,
    FillLayer,
    hoverStateFilter,
    CircleLayer,
  } from "svelte-maplibre";
  import { Popup } from "svelte-utils/map";
  import { type Output } from "./common";

  export let output: Output;
  export let show: "ruc" | "pop_density" | "os_network";
</script>

<GeoJSON data={output.ruc}>
  <FillLayer
    manageHoverState
    layout={{
      visibility: show == "ruc" ? "visible" : "none",
    }}
    paint={{
      "fill-color": [
        "case",
        ["in", "Urban", ["get", "ruc11"]],
        "orange",
        "green",
      ],
      "fill-opacity": hoverStateFilter(0.3, 0.5),
    }}
  >
    <Popup openOn="hover" let:props>{props.ruc11}</Popup>
  </FillLayer>
</GeoJSON>

<GeoJSON data={output.pop_density}>
  <FillLayer
    manageHoverState
    layout={{
      visibility: show == "pop_density" ? "visible" : "none",
    }}
    paint={{
      "fill-color": "blue",
      "fill-opacity": hoverStateFilter(0.3, 0.5),
    }}
  >
    <Popup openOn="hover" let:props>
      {props.pop_density} people / square km
    </Popup>
  </FillLayer>
</GeoJSON>

<GeoJSON data={output.os_links}>
  <LineLayer
    layout={{
      visibility: show == "os_network" ? "visible" : "none",
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
      visibility: show == "os_network" ? "visible" : "none",
    }}
    paint={{
      "circle-color": "green",
      "circle-radius": hoverStateFilter(5, 8),
    }}
  >
    <Popup openOn="hover" let:props>
      {props.id}
    </Popup>
  </CircleLayer>
</GeoJSON>
