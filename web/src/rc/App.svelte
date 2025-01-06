<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import type { Feature, LineString } from "geojson";
  import type { Map } from "maplibre-gl";
  import {
    GeoJSON,
    hoverStateFilter,
    LineLayer,
    MapLibre,
  } from "svelte-maplibre";
  import { Layout } from "svelte-utils/two_column_layout";
  import EditLine from "./EditLine.svelte";
  import { getStyle } from "./google";
  import Link from "./Link.svelte";

  type Link = Feature<LineString, { name: string; color: string }>;

  let map: Map | undefined;
  let links: Link[] = loadState();
  let editLinkIdx: number | null = null;

  $: gj = {
    type: "FeatureCollection" as const,
    features: links,
  };
  $: window.localStorage.setItem("tmp-rcv2", JSON.stringify(gj));

  function loadState(): Link[] {
    try {
      let gj = JSON.parse(window.localStorage.getItem("tmp-rcv2") || "");
      if ("features" in gj) {
        return gj.features;
      }
    } catch (err) {}
    return [];
  }

  function clear() {
    links = [];
  }

  function newLink() {
    // Vivid from https://carto.com/carto-colors/
    let colors = [
      "#66C5CC",
      "#F6CF71",
      "#F89C74",
      "#DCB0F2",
      "#87C55F",
      "#9EB9F3",
      "#FE88B1",
      "#C9DB74",
      "#8BE0A4",
      "#B497E7",
      "#D3B484",
      "#B3B3B3",
    ];

    let f = {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [],
      },
      properties: {
        name: "Untitled link",
        color: colors[links.length % colors.length],
      },
    };
    links = [...links, f];
    editLinkIdx = links.length - 1;
  }
</script>

<Layout>
  <div slot="left">
    {#if editLinkIdx == null}
      <button on:click={newLink}>New link</button>
      <button on:click={clear}>Clear</button>

      <ol>
        {#each links as link, idx}
          <li>
            <Link
              on:click={() => (editLinkIdx = idx)}
              color={link.properties.color}
            >
              {link.properties.name}
            </Link>
          </li>
        {/each}
      </ol>
    {:else}
      <button on:click={() => (editLinkIdx = null)}>Done</button>

      <label>
        Name:
        <input type="text" bind:value={links[editLinkIdx].properties.name} />
      </label>
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
