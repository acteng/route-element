<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import type { StyleSpecification } from "maplibre-gl";
  import { onMount } from "svelte";
  import { MapLibre } from "svelte-maplibre";
  import {
    Layout,
    mapContents,
    sidebarContents,
  } from "svelte-utils/two_column_layout";
  import busStopIcon from "./assets/bus_stop.png?url";
  import crossingIcon from "./assets/crossing.png?url";
  import { getStyle } from "./basemaps";
  import BusStopQuestionsMode from "./bus_stops/BusStopQuestionsMode.svelte";
  import EditBusStopMode from "./bus_stops/EditBusStopMode.svelte";
  import ContextualLayers from "./context/ContextualLayers.svelte";
  import CrossingQuestionsMode from "./crossings/CrossingQuestionsMode.svelte";
  import EditCrossingMode from "./crossings/EditCrossingMode.svelte";
  import DrawRouteMode from "./draw_route/DrawRouteMode.svelte";
  import { finishRoute } from "./draw_route/stores";
  import EditJATDetailMode from "./jat/EditJATDetailMode.svelte";
  import EditJATMode from "./jat/EditJATMode.svelte";
  import EditLinkMode from "./links/EditLinkMode.svelte";
  import LinkQuestionsMode from "./links/LinkQuestionsMode.svelte";
  import NeutralMode from "./NeutralMode.svelte";
  import NewPointMode from "./NewPointMode.svelte";
  import { basemap, map, mode, state } from "./state";

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

  let style: string | StyleSpecification | null = null;
  onMount(async () => {
    style = await getStyle($basemap);
  });
  async function changeStyle(newStyle: string) {
    style = await getStyle(newStyle);
  }
  $: changeStyle($basemap);
</script>

<Layout>
  <div slot="left">
    <div bind:this={sidebarDiv} />
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    {#if style}
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
          {
            id: "crossing",
            url: crossingIcon,
            options: {
              sdf: true,
            },
          },
        ]}
      >
        <div bind:this={mapDiv} />
        {#if $mode.kind == "neutral"}
          <NeutralMode />
        {:else if $mode.kind == "new-point"}
          <NewPointMode obj={$mode.obj} />
        {:else if $mode.kind == "edit-link"}
          <EditLinkMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-jat"}
          <EditJATMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-jat-detail"}
          <EditJATDetailMode junctionIdx={$mode.idx} />
        {:else if $mode.kind == "edit-bus-stop"}
          <EditBusStopMode idx={$mode.idx} />
        {:else if $mode.kind == "edit-crossing"}
          <EditCrossingMode idx={$mode.idx} />
        {:else if $mode.kind == "crossing-questions"}
          <CrossingQuestionsMode />
        {:else if $mode.kind == "link-questions"}
          <LinkQuestionsMode qIdx={$mode.idx} />
        {:else if $mode.kind == "bus-stop-questions"}
          <BusStopQuestionsMode />
        {:else if $mode.kind == "draw-route" && $map}
          <DrawRouteMode
            graph={$mode.graph}
            map={$map}
            editingExisting={false}
            finish={() => finishRoute($mode.graph)}
            cancel={() => ($mode = { kind: "neutral" })}
          />
        {/if}

        <ContextualLayers />
      </MapLibre>
    {/if}
  </div>
</Layout>
