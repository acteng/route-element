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
  import { blankLink, loadState, type Link } from "./state";
  import Table from "./Table.svelte";

  let map: Map | undefined;
  let links: Link[] = loadState();
  let editLinkIdx: number | null = null;
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
    editLinkIdx = links.length - 1;
  }
</script>

{#if showTable}
  <Table {links} on:close={() => (showTable = false)} />
{/if}

<Layout>
  <div slot="left">
    {#if editLinkIdx == null}
      <button on:click={newLink}>New link</button>
      <button on:click={clear}>Clear</button>
      <button on:click={() => (showTable = true)}>Table of questions</button>

      <ol>
        {#each links as link, idx}
          <li>
            <ClickLink
              on:click={() => (editLinkIdx = idx)}
              color={link.properties.color}
            >
              {link.properties.name}
            </ClickLink>
          </li>
        {/each}
      </ol>
    {:else}
      <button on:click={() => (editLinkIdx = null)}>Done</button>

      <label>
        Name:
        <input type="text" bind:value={links[editLinkIdx].properties.name} />
      </label>

      <LinkForm bind:f={links[editLinkIdx]} />
    {/if}
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    {#await getStyle(new URLSearchParams(window.location.search).get("google") || "") then style}
      <MapLibre {style} standardControls hash bind:map>
        <GeoJSON data={gj} generateId>
          {#if editLinkIdx == null}
            <LineLayer
              manageHoverState
              paint={{
                "line-color": ["get", "color"],
                "line-width": hoverStateFilter(6, 9),
              }}
              hoverCursor="pointer"
              on:click={(e) => (editLinkIdx = e.detail.features[0].id)}
            />
          {:else}
            <LineLayer
              paint={{
                "line-color": "black",
                "line-opacity": 0.5,
                "line-width": 6,
              }}
            />
          {/if}
        </GeoJSON>

        {#if editLinkIdx != null}
          <EditLine
            bind:f={links[editLinkIdx]}
            onDone={() => (editLinkIdx = null)}
          />
        {/if}
      </MapLibre>
    {/await}
  </div>
</Layout>
