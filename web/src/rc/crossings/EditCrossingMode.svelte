<script lang="ts">
  import { tick } from "svelte";
  import { CircleLayer, GeoJSON, Marker } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { gj, mode, scores, state } from "../state";

  export let idx: number;

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

    <label>
      SA10: pedestrian crossing speed
      <select bind:value={$state.crossings[idx].properties.sa10}>
        {#each scores() as value}
          <option {value}>{value}</option>
        {/each}
      </select>
    </label>
  </div>

  <div slot="map">
    <ShowAllLayers except="crossings" />

    <GeoJSON data={gj($state.crossings)} generateId>
      <CircleLayer
        filter={["!=", ["id"], idx]}
        paint={{
          "circle-color": "black",
          "circle-radius": 10,
        }}
      />
    </GeoJSON>

    <Marker draggable bind:lngLat={$state.crossings[idx].geometry.coordinates}>
      <span
        class="dot"
        style:background-color={$state.crossings[idx].properties.color}
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
