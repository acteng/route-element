<script lang="ts">
  import {
    CircleLayer,
    GeoJSON,
    hoverStateFilter,
    LineLayer,
    SymbolLayer,
  } from "svelte-maplibre";
  import { downloadGeneratedFile, Modal } from "svelte-utils";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import BusStopSidebar from "./bus_stops/Sidebar.svelte";
  import { numId } from "./common";
  import CrossingSidebar from "./crossings/Sidebar.svelte";
  import { setupRouteTool } from "./draw_route/stores";
  import ExperimentForm from "./ExperimentForm.svelte";
  import JATSidebar from "./jat/Sidebar.svelte";
  import LinkSidebar from "./links/Sidebar.svelte";
  import { checkState, gj, map, mode, state } from "./state";

  let showImport = false;
  let fileInput: HTMLInputElement;
  async function loadFile(e: Event) {
    try {
      let x = JSON.parse(await fileInput.files![0].text());
      if (checkState(x)) {
        $state = x;
        showImport = false;
        return;
      }
    } catch (err) {}
    window.alert("Something's wrong with that file");
  }

  function clear() {
    $state.links = [];
    $state.jats = [];
    $state.bus_stops = [];
    $state.crossings = [];
  }

  async function drawRoute() {
    await setupRouteTool($map!);
  }

  let experimentForm = false;
</script>

<SplitComponent>
  <div slot="sidebar">
    <div>
      <button class="secondary" on:click={() => (showImport = true)}>
        Load file
      </button>
      <button
        class="secondary"
        on:click={() =>
          downloadGeneratedFile("rcv2.geojson", JSON.stringify($state))}
      >
        Download
      </button>
      <button class="secondary" on:click={clear}>Clear</button>
    </div>

    <button on:click={drawRoute}>Draw an entire route</button>

    <button on:click={() => (experimentForm = true)}>Try new form</button>

    <hr />

    <LinkSidebar />

    <hr />

    <JATSidebar />

    <hr />

    <BusStopSidebar />

    <hr />

    <CrossingSidebar />
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
  </div>
</SplitComponent>

{#if showImport}
  <Modal on:close={() => (showImport = false)}>
    <h1>Load a file previously downloaded from this tool</h1>

    <input bind:this={fileInput} on:change={loadFile} type="file" />
  </Modal>
{/if}

{#if experimentForm}
  <ExperimentForm on:close={() => (experimentForm = false)} />
{/if}
