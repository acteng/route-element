<script lang="ts">
  import { tick } from "svelte";
  import { GeoJSON, SymbolLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import icon from "../assets/bus_stop.png?url";
  import { scores } from "../common";
  import DraggableMarker from "../DraggableMarker.svelte";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { gj, mode, state } from "../state";

  export let idx: number;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }

  async function remove() {
    if (window.confirm("Really delete this bus stop?")) {
      $mode = { kind: "neutral" };
      await tick();
      $state.bus_stops.splice(idx, 1);
      $state.bus_stops = $state.bus_stops;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>
    <button on:click={remove}>Delete bus stop</button>

    <label>
      Name:
      <input type="text" bind:value={$state.bus_stops[idx].properties.name} />
    </label>

    <Picker
      k="horiz-radio"
      bind:value={$state.bus_stops[idx].properties.st20}
      choices={scores()}
    >
      ST20: bus stops
    </Picker>
  </div>

  <div slot="map">
    <ShowAllLayers except="bus_stops" />

    <GeoJSON data={gj($state.bus_stops)} generateId>
      <SymbolLayer
        filter={["!=", ["id"], idx]}
        layout={{
          "icon-image": "bus_stop",
          "icon-size": 3.0,
        }}
        paint={{
          "icon-color": "black",
        }}
      />
    </GeoJSON>

    <DraggableMarker
      bind:lngLat={$state.bus_stops[idx].geometry.coordinates}
      color={$state.bus_stops[idx].properties.color}
    >
      <img src={icon} />
    </DraggableMarker>
  </div>
</SplitComponent>
