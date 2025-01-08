<script lang="ts">
  import { tick } from "svelte";
  import { CircleLayer, GeoJSON, Marker } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ShowAllLinks from "../ShowAllLinks.svelte";
  import { gj, mode, state } from "../state";

  export let idx: number;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }

  async function remove() {
    if (window.confirm("Really delete this JAT?")) {
      $mode = { kind: "neutral" };
      await tick();
      $state.jats.splice(idx, 1);
      $state.jats = $state.jats;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>
    <button on:click={remove}>Delete JAT</button>

    <label>
      Name:
      <input type="text" bind:value={$state.jats[idx].properties.name} />
    </label>

    <button
      on:click={() =>
        ($mode = { kind: "edit-jat-detail", idx, stage: "existing" })}
    >
      Existing
    </button>
    <button
      on:click={() =>
        ($mode = { kind: "edit-jat-detail", idx, stage: "proposed" })}
    >
      Proposed
    </button>
  </div>

  <div slot="map">
    <ShowAllLinks />

    <GeoJSON data={gj($state.jats)} generateId>
      <CircleLayer
        filter={["!=", ["id"], idx]}
        paint={{
          "circle-color": "black",
          "circle-radius": 20,
        }}
      />
    </GeoJSON>

    <Marker draggable bind:lngLat={$state.jats[idx].geometry.coordinates}>
      <span
        class="dot"
        style:background-color={$state.jats[idx].properties.color}
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
    border: 1px solid black;
    cursor: pointer;
  }
</style>
