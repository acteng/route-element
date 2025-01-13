<script lang="ts">
  import type { MapMouseEvent } from "maplibre-gl";
  import { MapEvents } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { blankBusStop } from "./bus_stops/types";
  import { blankCrossing } from "./crossings/types";
  import { blankJAT } from "./jat/types";
  import ShowAllLayers from "./ShowAllLayers.svelte";
  import { mode, state } from "./state";

  export let obj: "jat" | "bus stop" | "crossing";

  function onMapClick(e: CustomEvent<MapMouseEvent>) {
    let pt = e.detail.lngLat.toArray();

    if (obj == "jat") {
      let f = blankJAT($state.jats.length, pt);
      $state.jats = [...$state.jats, f];
      $mode = { kind: "edit-jat", idx: $state.jats.length - 1 };
    } else if (obj == "crossing") {
      let f = blankCrossing($state.crossings.length, pt);
      $state.crossings = [...$state.crossings, f];
      $mode = { kind: "edit-crossing", idx: $state.crossings.length - 1 };
    } else if (obj == "bus stop") {
      let f = blankBusStop($state.bus_stops.length, pt);
      $state.bus_stops = [...$state.bus_stops, f];
      $mode = { kind: "edit-bus-stop", idx: $state.bus_stops.length - 1 };
    }
  }
</script>

<MapEvents on:click={onMapClick} />

<SplitComponent>
  <div slot="sidebar">
    <h1>Click map to create new {obj}</h1>
    <button on:click={() => ($mode = { kind: "neutral" })}>Cancel</button>
  </div>

  <div slot="map">
    <ShowAllLayers except="" />
  </div>
</SplitComponent>
