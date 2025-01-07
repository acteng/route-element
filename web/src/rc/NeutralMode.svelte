<script lang="ts">
  import { GeoJSON, hoverStateFilter, LineLayer } from "svelte-maplibre";
  import { downloadGeneratedFile } from "svelte-utils";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ClickLink from "./ClickLink.svelte";
  import { blankLink, gj, links, mode, questions } from "./state";
  import Table from "./Table.svelte";

  let showTable = false;

  function clear() {
    $links = [];
  }

  function newLink() {
    let f = blankLink($links.length);
    $links = [...$links, f];
    $mode = { kind: "edit-link", idx: $links.length - 1 };
  }
</script>

{#if showTable}
  <Table on:close={() => (showTable = false)} />
{/if}

<SplitComponent>
  <div slot="sidebar">
    <div>
      <button on:click={newLink}>New link</button>
      <button on:click={clear}>Clear</button>
      <button on:click={() => (showTable = true)}>Table of questions</button>
      <button
        on:click={() =>
          downloadGeneratedFile("rcv2.geojson", JSON.stringify($gj))}
      >
        Download
      </button>
    </div>

    Links:
    <ol>
      {#each $links as link, idx}
        <li>
          <ClickLink
            on:click={() => ($mode = { kind: "edit-link", idx })}
            color={link.properties.color}
          >
            {link.properties.name}
          </ClickLink>
        </li>
      {/each}
    </ol>

    Questions:
    <ol>
      {#each questions as q, idx}
        <li>
          <ClickLink on:click={() => ($mode = { kind: "edit-question", idx })}>
            {q.name}
          </ClickLink>:
          <progress
            value={$links.filter((f) => f.properties.answers[idx] != "").length}
            max={$links.length}
          />
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

<style>
  progress {
    width: fit-content;
  }
</style>
