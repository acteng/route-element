<script lang="ts">
  import {
    CircleLayer,
    GeoJSON,
    hoverStateFilter,
    LineLayer,
  } from "svelte-maplibre";
  import { downloadGeneratedFile } from "svelte-utils";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ClickLink from "./ClickLink.svelte";
  import {
    blankJAT,
    blankLink,
    gj,
    map,
    mode,
    questions,
    state,
  } from "./state";
  import Table from "./Table.svelte";

  let showTable = false;

  function clear() {
    $state.links = [];
    $state.jats = [];
  }

  function newLink() {
    let f = blankLink($state.links.length);
    $state.links = [...$state.links, f];
    $mode = { kind: "edit-link", idx: $state.links.length - 1 };
  }

  function newJAT() {
    if (!$map) {
      return;
    }
    let f = blankJAT($state.jats.length, $map.getCenter().toArray());
    $state.jats = [...$state.jats, f];
    $mode = { kind: "edit-jat", idx: $state.jats.length - 1 };
  }
</script>

{#if showTable}
  <Table on:close={() => (showTable = false)} />
{/if}

<SplitComponent>
  <div slot="sidebar">
    <div>
      <button
        class="secondary"
        on:click={() =>
          downloadGeneratedFile("rcv2.geojson", JSON.stringify($state))}
      >
        Download
      </button>
      <button class="secondary" on:click={clear}>Clear</button>
    </div>

    <hr />

    <div>
      <button on:click={newLink}>New link</button>
      <button on:click={() => (showTable = true)}>Table of questions</button>
    </div>

    Links:
    <ol>
      {#each $state.links as link, idx}
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
            value={$state.links.filter((f) => f.properties.answers[idx] != "")
              .length}
            max={$state.links.length}
          />
        </li>
      {/each}
    </ol>

    <hr />

    JATs:

    <div>
      <button on:click={newJAT}>New JAT</button>
    </div>

    <ol>
      {#each $state.jats as jat, idx}
        <li>
          <ClickLink
            on:click={() => ($mode = { kind: "edit-jat", idx })}
            color={jat.properties.color}
          >
            {jat.properties.name}
          </ClickLink>
        </li>
      {/each}
    </ol>
  </div>

  <div slot="map">
    <GeoJSON data={gj($state.links)} generateId>
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

    <GeoJSON data={gj($state.jats)} generateId>
      <CircleLayer
        manageHoverState
        paint={{
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-width": 5,
          "circle-stroke-color": ["get", "color"],
          "circle-radius": hoverStateFilter(20, 25),
        }}
        hoverCursor="pointer"
        on:click={(e) =>
          ($mode = { kind: "edit-jat", idx: e.detail.features[0].id })}
      />
    </GeoJSON>
  </div>
</SplitComponent>

<style>
  progress {
    width: fit-content;
  }
</style>
