<script lang="ts">
  import { tick } from "svelte";
  import { GeoJSON, LineLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { gj, mode, questions, state } from "../state";
  import DrawLine from "./DrawLine.svelte";

  export let idx: number;

  $: valid = $state.links[idx].geometry.coordinates.length >= 2;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape" && valid) {
      $mode = { kind: "neutral" };
    }
  }

  async function remove() {
    if (window.confirm("Really delete this link?")) {
      $mode = { kind: "neutral" };
      await tick();
      $state.links.splice(idx, 1);
      $state.links = $state.links;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })} disabled={!valid}>
      Done
    </button>
    <button on:click={remove}>Delete link</button>
    {#if !valid}
      <p>A link needs at least two points</p>
    {/if}

    <label>
      Name:
      <input type="text" bind:value={$state.links[idx].properties.name} />
    </label>

    {#each questions as q, qIdx}
      <label>
        {q.name}: {q.description}
        <select bind:value={$state.links[idx].properties.answers[qIdx]}>
          {#each q.choices as value}
            <option {value}>{value}</option>
          {/each}
        </select>
      </label>
    {/each}
  </div>

  <div slot="map">
    <ShowAllLayers except="links" />

    <GeoJSON data={gj($state.links)} generateId>
      <LineLayer
        paint={{
          "line-color": [
            "case",
            ["==", ["id"], idx],
            ["get", "color"],
            "black",
          ],
          "line-width": 6,
        }}
      />
    </GeoJSON>

    <DrawLine bind:f={$state.links[idx]} />
  </div>
</SplitComponent>
