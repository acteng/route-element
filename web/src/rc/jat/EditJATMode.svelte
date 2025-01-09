<script lang="ts">
  import { tick } from "svelte";
  import { CircleLayer, GeoJSON } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import DraggableMarker from "../DraggableMarker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
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
    <ShowAllLayers except="jats" />

    <GeoJSON data={gj($state.jats)} generateId>
      <CircleLayer
        filter={["!=", ["id"], idx]}
        paint={{
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-width": 5,
          "circle-stroke-color": "black",
          "circle-radius": 20,
        }}
      />
    </GeoJSON>

    <DraggableMarker
      bind:lngLat={$state.jats[idx].geometry.coordinates}
      radius="50px"
      outline
      color={$state.jats[idx].properties.color}
    />
  </div>
</SplitComponent>
