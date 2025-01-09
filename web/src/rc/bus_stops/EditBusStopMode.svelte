<script lang="ts">
  import { tick } from "svelte";
  import { CircleLayer, GeoJSON, Marker } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { scores } from "../common";
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

    <label>
      ST20: bus stops
      <select bind:value={$state.bus_stops[idx].properties.st20}>
        {#each scores() as value}
          <option {value}>{value}</option>
        {/each}
      </select>
    </label>
  </div>

  <div slot="map">
    <ShowAllLayers except="bus_stops" />

    <GeoJSON data={gj($state.bus_stops)} generateId>
      <CircleLayer
        filter={["!=", ["id"], idx]}
        paint={{
          "circle-color": "black",
          "circle-radius": 10,
        }}
      />
    </GeoJSON>

    <Marker draggable bind:lngLat={$state.bus_stops[idx].geometry.coordinates}>
      <span
        class="dot"
        style:background-color={$state.bus_stops[idx].properties.color}
      />
    </Marker>
  </div>
</SplitComponent>

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
  }

  .dot:hover {
    cursor: pointer;
  }
</style>
