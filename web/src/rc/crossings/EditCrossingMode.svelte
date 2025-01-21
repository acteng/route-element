<script lang="ts">
  import { tick } from "svelte";
  import { GeoJSON, SymbolLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import icon from "../assets/crossing.png?url";
  import { scores } from "../common";
  import DraggableMarker from "../DraggableMarker.svelte";
  import MetricDetails from "../MetricDetails.svelte";
  import { metrics } from "../metrics";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { gj, mode, state } from "../state";

  export let idx: number;

  let metric = metrics.SA10;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }

  async function remove() {
    if (window.confirm("Really delete this crossing?")) {
      $mode = { kind: "neutral" };
      await tick();
      $state.crossings.splice(idx, 1);
      $state.crossings = $state.crossings;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>
    <button on:click={remove}>Delete crossing</button>

    <label>
      Name:
      <input type="text" bind:value={$state.crossings[idx].properties.name} />
    </label>

    <Picker
      k="horiz-radio"
      bind:value={$state.crossings[idx].properties.sa10}
      choices={scores()}
    >
      SA10: pedestrian crossing speed
    </Picker>

    <p>{metric.description}</p>
    <MetricDetails {metric} />
  </div>

  <div slot="map">
    <ShowAllLayers except="crossings" showMissingProperty={["get", "sa10"]} />

    <GeoJSON data={gj($state.crossings)} generateId>
      <SymbolLayer
        filter={["!=", ["id"], idx]}
        layout={{
          "icon-image": "crossing",
          "icon-size": 0.1,
        }}
        paint={{
          "icon-color": "black",
        }}
      />
    </GeoJSON>

    <DraggableMarker
      bind:lngLat={$state.crossings[idx].geometry.coordinates}
      color={$state.crossings[idx].properties.color}
    >
      <img src={icon} alt="" />
    </DraggableMarker>
  </div>
</SplitComponent>
