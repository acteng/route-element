<script lang="ts">
  import { GeoJSON, hoverStateFilter, LineLayer } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { gj, links, mode, questions } from "./state";

  export let qIdx: number;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>

    <h2>{questions[qIdx].name}: {questions[qIdx].description}</h2>
    <ol>
      {#each $links as link}
        <li>
          <span style:color={link.properties.color}>
            {link.properties.name}
          </span>

          <select bind:value={link.properties.answers[qIdx]}>
            {#each questions[qIdx].choices as value}
              <option {value}>{value}</option>
            {/each}
          </select>
        </li>
      {/each}
    </ol>
  </div>

  <div slot="map">
    <GeoJSON data={$gj} generateId>
      <LineLayer
        manageHoverState
        paint={{
          "line-color": ["get", "color"],
          "line-width": hoverStateFilter(6, 9),
        }}
        hoverCursor="pointer"
        on:click={(e) =>
          ($mode = { kind: "edit-link", idx: e.detail.features[0].id })}
      />
    </GeoJSON>
  </div>
</SplitComponent>
