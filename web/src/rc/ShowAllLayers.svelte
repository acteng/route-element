<script lang="ts">
  import {
    CircleLayer,
    GeoJSON,
    LineLayer,
    SymbolLayer,
  } from "svelte-maplibre";
  import { gj, state } from "./state";

  export let except:
    | ""
    | "links"
    | "bus_stops"
    | "crossings"
    | "jats"
    | "side_roads";
  export let showColor:
    | ""
    | "links"
    | "bus_stops"
    | "crossings"
    | "jats"
    | "side_roads" = "";
</script>

{#if except != "links"}
  <GeoJSON data={gj($state.links)}>
    <LineLayer
      paint={{
        "line-color": showColor == "links" ? ["get", "color"] : "black",
        "line-width": 6,
      }}
    />
  </GeoJSON>
{/if}

{#if except != "bus_stops"}
  <GeoJSON data={gj($state.bus_stops)}>
    <SymbolLayer
      layout={{
        "icon-image": "bus_stop",
        "icon-size": 3.0,
      }}
      paint={{
        "icon-color": showColor == "bus_stops" ? ["get", "color"] : "black",
      }}
    />
  </GeoJSON>
{/if}

{#if except != "crossings"}
  <GeoJSON data={gj($state.crossings)}>
    <SymbolLayer
      layout={{
        "icon-image": "crossing",
        "icon-size": 0.1,
      }}
      paint={{
        "icon-color": showColor == "crossings" ? ["get", "color"] : "black",
      }}
    />
  </GeoJSON>
{/if}

{#if except != "jats"}
  <GeoJSON data={gj($state.jats)}>
    <CircleLayer
      paint={{
        "circle-color": "rgba(0,0,0,0)",
        "circle-stroke-width": 5,
        "circle-stroke-color": showColor == "jats" ? ["get", "color"] : "black",
        "circle-radius": 20,
      }}
    />
  </GeoJSON>
{/if}

{#if except != "side_roads"}
  <GeoJSON data={gj($state.side_roads)}>
    <LineLayer
      paint={{
        "line-color": showColor == "side_roads" ? ["get", "color"] : "black",
        "line-width": 3,
      }}
    />
  </GeoJSON>
{/if}
