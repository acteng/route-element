<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import type { Map } from "maplibre-gl";
  import { MapLibre } from "svelte-maplibre";
  import {
    Layout,
    mapContents,
    sidebarContents,
  } from "svelte-utils/two_column_layout";
  import EditLinkMode from "./EditLinkMode.svelte";
  import EditQuestionMode from "./EditQuestionMode.svelte";
  import { getStyle } from "./google";
  import NeutralMode from "./NeutralMode.svelte";
  import { gj, mode } from "./state";

  let map: Map | undefined;

  $: window.localStorage.setItem("tmp-rcv2", JSON.stringify($gj));

  let sidebarDiv: HTMLDivElement;
  let mapDiv: HTMLDivElement;
  $: if (sidebarDiv && $sidebarContents) {
    sidebarDiv.innerHTML = "";
    sidebarDiv.appendChild($sidebarContents);
  }
  $: if (mapDiv && $mapContents) {
    mapDiv.innerHTML = "";
    mapDiv.appendChild($mapContents);
  }
</script>

<Layout>
  <div slot="left">
    <div bind:this={sidebarDiv} />
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    {#await getStyle(new URLSearchParams(window.location.search).get("google") || "") then style}
      <MapLibre {style} standardControls hash bind:map>
        <div bind:this={mapDiv} />
        {#if $mode.kind == "neutral"}
          <NeutralMode />
        {:else if $mode.kind == "edit-link"}
          <EditLinkMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-question"}
          <EditQuestionMode qIdx={$mode.idx} />
        {/if}
      </MapLibre>
    {/await}
  </div>
</Layout>
