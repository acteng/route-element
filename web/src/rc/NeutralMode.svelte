<script lang="ts">
  import {
    CircleLayer,
    GeoJSON,
    hoverStateFilter,
    LineLayer,
    SymbolLayer,
  } from "svelte-maplibre";
  import { downloadGeneratedFile } from "svelte-utils";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import BusStopSidebar from "./bus_stops/Sidebar.svelte";
  import { numId } from "./common";
  import CrossingSidebar from "./crossings/Sidebar.svelte";
  import JATSidebar from "./jat/Sidebar.svelte";
  import LinkSidebar from "./links/Sidebar.svelte";
  import SideRoadSidebar from "./side_roads/Sidebar.svelte";
  import { gj, mode, state } from "./state";

  function clear() {
    $state.links = [];
    $state.jats = [];
    $state.bus_stops = [];
    $state.crossings = [];
    $state.side_roads = [];
  }
</script>

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

    <LinkSidebar />

    <hr />

    <JATSidebar />

    <hr />

    <BusStopSidebar />

    <hr />

    <CrossingSidebar />

    <hr />

    <SideRoadSidebar />
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
      <SymbolLayer
        manageHoverState
        layout={{
          "icon-image": "bus_stop",
          "icon-size": 3.0,
        }}
        paint={{
          "icon-color": ["get", "color"],
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
      <SymbolLayer
        manageHoverState
        layout={{
          "icon-image": "crossing",
          "icon-size": 0.1,
        }}
        paint={{
          "icon-color": ["get", "color"],
        }}
        hoverCursor="pointer"
        on:click={(e) =>
          ($mode = {
            kind: "edit-crossing",
            idx: numId(e.detail.features[0].id),
          })}
      />
    </GeoJSON>

    <GeoJSON data={gj($state.side_roads)} generateId>
      <LineLayer
        manageHoverState
        paint={{
          "line-color": ["get", "color"],
          "line-width": hoverStateFilter(3, 6),
        }}
        hoverCursor="pointer"
        on:click={(e) =>
          ($mode = {
            kind: "edit-side-road",
            idx: numId(e.detail.features[0].id),
          })}
      />
    </GeoJSON>
  </div>
</SplitComponent>
