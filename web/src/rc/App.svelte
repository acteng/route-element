<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import { MapLibre } from "svelte-maplibre";
  import {
    Layout,
    mapContents,
    sidebarContents,
  } from "svelte-utils/two_column_layout";
  import busStopIcon from "./assets/bus_stop.png?url";
  import EditBusStopMode from "./bus_stops/EditBusStopMode.svelte";
  import EditCrossingMode from "./crossings/EditCrossingMode.svelte";
  import { getStyle } from "./google";
  import EditJATDetailMode from "./jat/EditJATDetailMode.svelte";
  import EditJATMode from "./jat/EditJATMode.svelte";
  import EditLinkMode from "./links/EditLinkMode.svelte";
  import EditQuestionMode from "./links/EditQuestionMode.svelte";
  import NeutralMode from "./NeutralMode.svelte";
  import EditSideRoadMode from "./side_roads/EditSideRoadMode.svelte";
  import { map, mode, state } from "./state";

  $: window.localStorage.setItem("tmp-rcv2", JSON.stringify($state));

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
      <MapLibre
        {style}
        standardControls
        hash
        bind:map={$map}
        images={[
          {
            id: "bus_stop",
            url: busStopIcon,
            options: {
              sdf: true,
            },
          },
        ]}
      >
        <div bind:this={mapDiv} />
        {#if $mode.kind == "neutral"}
          <NeutralMode />
        {:else if $mode.kind == "edit-link"}
          <EditLinkMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-jat"}
          <EditJATMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-jat-detail"}
          <EditJATDetailMode junctionIdx={$mode.idx} stage={$mode.stage} />
        {:else if $mode.kind == "edit-bus-stop"}
          <EditBusStopMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-crossing"}
          <EditCrossingMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-side-road"}
          <EditSideRoadMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-question"}
          <EditQuestionMode qIdx={$mode.idx} />
        {/if}
      </MapLibre>
    {/await}
  </div>
</Layout>
