<script lang="ts">
  import { tick } from "svelte";
  import { GeoJSON, LineLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import DrawLine from "./DrawLine.svelte";
  import { gj, links, mode, questions } from "./state";

  export let idx: number;

  $: valid = $links[idx].geometry.coordinates.length >= 2;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape" && valid) {
      $mode = { kind: "neutral" };
    }
  }

  async function remove() {
    if (window.confirm("Really delete this link?")) {
      $mode = { kind: "neutral" };
      await tick();
      $links.splice(idx, 1);
      $links = $links;
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
      <input type="text" bind:value={$links[idx].properties.name} />
    </label>

    {#each questions as q, qIdx}
      <label>
        {q.name}: {q.description}
        <select bind:value={$links[idx].properties.answers[qIdx]}>
          {#each q.choices as value}
            <option {value}>{value}</option>
          {/each}
        </select>
      </label>
    {/each}
  </div>

  <div slot="map">
    <GeoJSON data={$gj} generateId>
      <LineLayer
        paint={{
          "line-color": [
            "case",
            ["==", ["id"], idx],
            ["get", "color"],
            "black",
          ],
          "line-opacity": ["case", ["==", ["id"], idx], 1.0, 0.5],
          "line-width": 6,
        }}
      />
    </GeoJSON>

    <DrawLine bind:f={$links[idx]} />
  </div>
</SplitComponent>
