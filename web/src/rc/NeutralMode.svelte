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
  import { numId } from "./common";
  import Table from "./links/Table.svelte";
  import {
    blankBusStop,
    blankCrossing,
    blankJAT,
    blankLink,
    gj,
    map,
    mode,
    questions,
    state,
  } from "./state";

  let showTable = false;

  function clear() {
    $state.links = [];
    $state.jats = [];
    $state.bus_stops = [];
    $state.crossings = [];
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

  function newBusStop() {
    if (!$map) {
      return;
    }
    let f = blankBusStop($state.bus_stops.length, $map.getCenter().toArray());
    $state.bus_stops = [...$state.bus_stops, f];
    $mode = { kind: "edit-bus-stop", idx: $state.bus_stops.length - 1 };
  }

  function newCrossing() {
    if (!$map) {
      return;
    }
    let f = blankCrossing($state.crossings.length, $map.getCenter().toArray());
    $state.crossings = [...$state.crossings, f];
    $mode = { kind: "edit-crossing", idx: $state.crossings.length - 1 };
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

    <hr />

    Bus stops:

    <div>
      <button on:click={newBusStop}>New bus stop</button>
    </div>

    <ol>
      {#each $state.bus_stops as bus_stop, idx}
        <li>
          <ClickLink
            on:click={() => ($mode = { kind: "edit-bus-stop", idx })}
            color={bus_stop.properties.color}
          >
            {bus_stop.properties.name}
          </ClickLink>
        </li>
      {/each}
    </ol>

    <hr />

    Crossings:

    <div>
      <button on:click={newCrossing}>New crossing</button>
    </div>

    <ol>
      {#each $state.crossings as crossing, idx}
        <li>
          <ClickLink
            on:click={() => ($mode = { kind: "edit-crossing", idx })}
            color={crossing.properties.color}
          >
            {crossing.properties.name}
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
          ($mode = { kind: "edit-link", idx: numId(e.detail.features[0].id) })}
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
          ($mode = { kind: "edit-jat", idx: numId(e.detail.features[0].id) })}
      />
    </GeoJSON>

    <GeoJSON data={gj($state.bus_stops)} generateId>
      <CircleLayer
        manageHoverState
        paint={{
          "circle-color": ["get", "color"],
          "circle-radius": hoverStateFilter(10, 15),
        }}
        hoverCursor="pointer"
        on:click={(e) =>
          ($mode = {
            kind: "edit-bus-stop",
            idx: numId(e.detail.features[0].id),
          })}
      />
    </GeoJSON>

    <GeoJSON data={gj($state.crossings)} generateId>
      <CircleLayer
        manageHoverState
        paint={{
          "circle-color": ["get", "color"],
          "circle-radius": hoverStateFilter(10, 15),
        }}
        hoverCursor="pointer"
        on:click={(e) =>
          ($mode = {
            kind: "edit-crossing",
            idx: numId(e.detail.features[0].id),
          })}
      />
    </GeoJSON>
  </div>
</SplitComponent>

<style>
  progress {
    width: fit-content;
  }
</style>
