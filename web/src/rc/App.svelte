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

  type Link = Feature<LineString, {}>;

  let map: Map | undefined;
  let links: Link[] = [];
  let editLinkIdx: number | null = null;

  $: gj = {
    type: "FeatureCollection" as const,
    features: links,
  };

  function newLink() {
    let f = {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [],
      },
      properties: {},
    };
    links = [...links, f];
    editLinkIdx = links.length - 1;
  }
</script>

<Layout>
  <div slot="left">
    {#if editLinkIdx == null}
      <button on:click={newLink}>New link</button>

      <ol>
        {#each links as link, idx}
          <li><Link on:click={() => (editLinkIdx = idx)}>Link</Link></li>
        {/each}
      </ol>
    {:else}
      <button on:click={() => (editLinkIdx = null)}>Done</button>
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
                "line-color": hoverStateFilter("black", "cyan"),
                "line-width": 3,
              }}
              hoverCursor="pointer"
              on:click={(e) => (editLinkIdx = e.detail.features[0].id)}
            />
          {:else}
            <LineLayer
              paint={{
                "line-color": "black",
                "line-opacity": 0.5,
                "line-width": 3,
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
