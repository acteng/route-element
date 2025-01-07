<script lang="ts">
  import { GeoJSON, LineLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import DrawLine from "./DrawLine.svelte";
  import { gj, links, mode, questions } from "./state";

  export let idx: number;
</script>

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>

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

    <DrawLine
      bind:f={$links[idx]}
      onDone={() => ($mode = { kind: "neutral" })}
    />
  </div>
</SplitComponent>
