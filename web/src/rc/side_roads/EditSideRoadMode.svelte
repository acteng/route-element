<script lang="ts">
  import { tick } from "svelte";
  import { GeoJSON, LineLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { scores } from "../common";
  import DrawLine from "../DrawLine.svelte";
  import MetricDetails from "../MetricDetails.svelte";
  import { metrics } from "../metrics";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { gj, mode, state } from "../state";

  export let idx: number;

  let metric = metrics.SA01;

  $: valid = $state.side_roads[idx].geometry.coordinates.length >= 2;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }

  async function remove() {
    if (window.confirm("Really delete this side road?")) {
      $mode = { kind: "neutral" };
      await tick();
      $state.side_roads.splice(idx, 1);
      $state.side_roads = $state.side_roads;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })} disabled={!valid}>
      Done
    </button>
    <button on:click={remove}>Delete side road</button>
    {#if !valid}
      <p>A side road needs at least two points</p>
    {/if}

    <label>
      Name:
      <input type="text" bind:value={$state.side_roads[idx].properties.name} />
    </label>

    <Picker
      k="horiz-radio"
      label="SA01: conflict at side roads and priority junctions"
      bind:value={$state.side_roads[idx].properties.sa01}
      choices={scores()}
    />

    <p>{metric.description}</p>
    <MetricDetails {metric} />
  </div>

  <div slot="map">
    <ShowAllLayers except="side_roads" />

    <GeoJSON data={gj($state.side_roads)} generateId>
      <LineLayer
        paint={{
          "line-color": [
            "case",
            ["==", ["id"], idx],
            ["get", "color"],
            "black",
          ],
          "line-width": 3,
        }}
      />
    </GeoJSON>

    <DrawLine bind:f={$state.side_roads[idx]} />
  </div>
</SplitComponent>
