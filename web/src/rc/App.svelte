<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import type { Map } from "maplibre-gl";
  import {
    GeoJSON,
    hoverStateFilter,
    LineLayer,
    MapLibre,
  } from "svelte-maplibre";
  import { Layout } from "svelte-utils/two_column_layout";
  import ClickLink from "./ClickLink.svelte";
  import EditLine from "./EditLine.svelte";
  import { getStyle } from "./google";
  import LinkForm from "./LinkForm.svelte";
  import { blankLink, loadState, questions, type Link } from "./state";
  import Table from "./Table.svelte";

  let map: Map | undefined;
  let links: Link[] = loadState();

  type Mode =
    | { kind: "neutral" }
    | { kind: "edit-link"; idx: number }
    | { kind: "edit-question"; idx: number };
  let mode: Mode = { kind: "neutral" };
  let showTable = false;

  $: gj = {
    type: "FeatureCollection" as const,
    features: links,
  };
  $: window.localStorage.setItem("tmp-rcv2", JSON.stringify(gj));

  function clear() {
    links = [];
  }

  function newLink() {
    let f = blankLink(links.length);
    links = [...links, f];
    mode = { kind: "edit-link", idx: links.length - 1 };
  }
</script>

{#if showTable}
  <Table {links} on:close={() => (showTable = false)} />
{/if}

<Layout>
  <div slot="left">
    {#if mode.kind == "neutral"}
      <button on:click={newLink}>New link</button>
      <button on:click={clear}>Clear</button>
      <button on:click={() => (showTable = true)}>Table of questions</button>

      Links:
      <ol>
        {#each links as link, idx}
          <li>
            <ClickLink
              on:click={() => (mode = { kind: "edit-link", idx })}
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
            <ClickLink on:click={() => (mode = { kind: "edit-question", idx })}>
              {q.name}
            </ClickLink>:
            <progress
              value={links.filter((f) => f.properties.answers[idx] != "")
                .length}
              max={links.length}
            />
          </li>
        {/each}
      </ol>
    {:else if mode.kind == "edit-link"}
      <button on:click={() => (mode = { kind: "neutral" })}>Done</button>

      <label>
        Name:
        <input type="text" bind:value={links[mode.idx].properties.name} />
      </label>

      <LinkForm bind:f={links[mode.idx]} />
    {:else if mode.kind == "edit-question"}
      <button on:click={() => (mode = { kind: "neutral" })}>Done</button>

      <h2>{questions[mode.idx].name}</h2>
      <ol>
        {#each links as link, idx}
          <li>
            <span style:color={link.properties.color}>
              {link.properties.name}
            </span>

            <select bind:value={link.properties.answers[idx]}>
              {#each questions[mode.idx].choices as value}
                <option {value}>{value}</option>
              {/each}
            </select>
          </li>
        {/each}
      </ol>
    {/if}
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    {#await getStyle(new URLSearchParams(window.location.search).get("google") || "") then style}
      <MapLibre {style} standardControls hash bind:map>
        <GeoJSON data={gj} generateId>
          {#if mode.kind == "neutral" || mode.kind == "edit-question"}
            <LineLayer
              manageHoverState
              paint={{
                "line-color": ["get", "color"],
                "line-width": hoverStateFilter(6, 9),
              }}
              hoverCursor="pointer"
              on:click={(e) =>
                (mode = { kind: "edit-link", idx: e.detail.features[0].id })}
            />
          {:else if mode.kind == "edit-link"}
            <LineLayer
              paint={{
                "line-color": [
                  "case",
                  ["==", ["id"], mode.idx],
                  ["get", "color"],
                  "black",
                ],
                "line-opacity": ["case", ["==", ["id"], mode.idx], 1.0, 0.5],
                "line-width": 6,
              }}
            />
          {/if}
        </GeoJSON>

        {#if mode.kind == "edit-link"}
          <EditLine
            bind:f={links[mode.idx]}
            onDone={() => (mode = { kind: "neutral" })}
          />
        {/if}
      </MapLibre>
    {/await}
  </div>
</Layout>

<style>
  progress {
    width: fit-content;
  }
</style>
