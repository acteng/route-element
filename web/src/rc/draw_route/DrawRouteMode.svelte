<script lang="ts">
  import type { FeatureCollection } from "geojson";
  import type { Map, MapMouseEvent } from "maplibre-gl";
  import { RouteTool } from "route-snapper-ts";
  import { onDestroy } from "svelte";
  import { GeoJSON, LineLayer, MapEvents, Marker } from "svelte-maplibre";
  import { emptyGeojson } from "svelte-utils/map";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import DebugNetwork from "./DebugNetwork.svelte";
  import { routeTool, waypoints, type Waypoint } from "./stores";

  export let map: Map;
  export let finish: () => void;
  export let cancel: () => void;
  export let editingExisting: boolean;

  onDestroy(() => {
    $waypoints = [];
    $routeTool?.stop();
    map.getCanvas().style.cursor = "inherit";
  });

  let showDebug = true;

  let drawMode: "append-start" | "append-end" | "adjust" = editingExisting
    ? "adjust"
    : "append-end";
  let snapMode: "snap" | "free" = "snap";
  let undoStates: Waypoint[][] = [];

  interface ExtraNode {
    point: [number, number];
    insertIdx: number;
    snapped: boolean;
  }
  let extraNodes: ExtraNode[] = [];
  $: updateExtraNodes($routeTool, $waypoints, drawMode, draggingExtraNode);

  let cursor: Waypoint | null = null;
  let hoveringOnMarker = false;
  let draggingMarker = false;
  let draggingExtraNode = false;
  $: previewGj = getPreview(
    $routeTool,
    $waypoints,
    drawMode,
    cursor,
    hoveringOnMarker || draggingMarker,
  );

  $: updateCursor($waypoints);
  function updateCursor(waypoints: Waypoint[]) {
    let cursor = waypoints.length == 0 ? "crosshair" : "inherit";
    map.getCanvas().style.cursor = cursor;
  }

  function undo() {
    let state = undoStates.pop();
    undoStates = undoStates;
    if (state) {
      $waypoints = state;
    }
  }

  function captureUndoState() {
    if (undoStates.length == 100) {
      undoStates.shift();
    }
    undoStates = [...undoStates, JSON.parse(JSON.stringify($waypoints))];
  }

  function toggleSnap() {
    snapMode = snapMode == "snap" ? "free" : "snap";
    if (cursor) {
      cursor.snapped = snapMode == "snap";
    }
  }

  function onMapClick(e: CustomEvent<MapMouseEvent>) {
    captureUndoState();
    waypoints.update((w) => {
      if (drawMode == "append-start") {
        w.splice(0, 0, {
          point: e.detail.lngLat.toArray(),
          snapped: snapMode == "snap",
        });
      } else if (drawMode == "append-end") {
        w.push({
          point: e.detail.lngLat.toArray(),
          snapped: snapMode == "snap",
        });
      }
      return w;
    });
  }

  function onMouseMove(e: CustomEvent<MapMouseEvent>) {
    cursor = {
      point: e.detail.lngLat.toArray(),
      snapped: snapMode == "snap",
    };
  }

  function toggleSnapped(idx: number) {
    captureUndoState();
    waypoints.update((w) => {
      w[idx].snapped = !w[idx].snapped;
      return w;
    });
  }

  function removeWaypoint(idx: number) {
    captureUndoState();
    waypoints.update((w) => {
      w.splice(idx, 1);
      return w;
    });
    hoveringOnMarker = false;
  }

  function calculateRoutes(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
  ): FeatureCollection {
    try {
      if (routeTool) {
        return JSON.parse(routeTool.inner.calculateRoute(waypoints));
      }
    } catch (err) {}
    return emptyGeojson();
  }

  function getPreview(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
    drawMode: "append-start" | "append-end" | "adjust",
    cursor: Waypoint | null,
    suppress: boolean,
  ): FeatureCollection {
    if (suppress) {
      return emptyGeojson();
    }
    try {
      if (routeTool && waypoints.length > 0 && cursor) {
        if (drawMode == "append-start") {
          return JSON.parse(
            routeTool.inner.calculateRoute([cursor, waypoints[0]]),
          );
        } else if (drawMode == "append-end") {
          return JSON.parse(
            routeTool.inner.calculateRoute([
              waypoints[waypoints.length - 1],
              cursor,
            ]),
          );
        }
      }
    } catch (err) {}
    return emptyGeojson();
  }

  function updateExtraNodes(
    routeTool: RouteTool | null,
    waypoints: Waypoint[],
    drawMode: "append-start" | "append-end" | "adjust",
    draggingExtraNode: boolean,
  ) {
    if (draggingExtraNode) {
      return;
    }
    if (!routeTool || drawMode != "adjust") {
      extraNodes = [];
      return;
    }

    let nodes: ExtraNode[] = [];
    let insertIdx = 1;

    for (let i = 0; i < waypoints.length - 1; i++) {
      let extra = JSON.parse(
        routeTool.inner.getExtraNodes(waypoints[i], waypoints[i + 1]),
      );
      for (let [x, y, snapped] of extra) {
        nodes.push({ point: [x, y], snapped, insertIdx });
      }
      insertIdx++;
    }

    extraNodes = nodes;
  }

  function addNode(node: ExtraNode) {
    // Turn an extra node into a waypoint. Capture state before the user drags
    // around the new waypoint.
    captureUndoState();
    waypoints.update((w) => {
      w.splice(node.insertIdx, 0, {
        point: node.point,
        snapped: node.snapped,
      });
      return w;
    });
    draggingExtraNode = true;
  }

  function updateDrag(node: ExtraNode) {
    // Don't constantly update undoStates
    waypoints.update((w) => {
      w[node.insertIdx].point = node.point;
      return w;
    });
  }

  function finalizeDrag() {
    draggingExtraNode = false;
  }

  function keyDown(e: KeyboardEvent) {
    let tag = (e.target as HTMLElement).tagName;
    let formFocused = tag == "INPUT" || tag == "TEXTAREA";

    if (e.key === "Enter" && !formFocused) {
      e.stopPropagation();
      if ($waypoints.length >= 2) {
        finish();
      }
    } else if (e.key === "Escape") {
      e.stopPropagation();
      cancel();
    } else if (e.key == "s" && !formFocused) {
      toggleSnap();
    } else if (e.key == "1" && !formFocused) {
      drawMode = "append-start";
    } else if (e.key == "2" && !formFocused) {
      drawMode = "append-end";
    } else if (e.key == "3" && !formFocused) {
      drawMode = "adjust";
    } else if (e.key == "z" && e.ctrlKey) {
      e.stopPropagation();
      undo();
    }
  }

  function startDraggingWaypoint() {
    captureUndoState();
    draggingMarker = true;
  }
</script>

<svelte:window on:keydown={keyDown} />

<SplitComponent>
  <div slot="sidebar">
    {#if editingExisting}
      <h2>Editing a route</h2>
    {:else}
      <h2>Drawing a new route</h2>
    {/if}

    <button on:click={finish} disabled={$waypoints.length < 2}>Finish</button>
    <button class="secondary" disabled={undoStates.length == 0} on:click={undo}>
      {#if undoStates.length == 0}
        Undo
      {:else}
        Undo ({undoStates.length})
      {/if}
    </button>
    <button class="secondary" on:click={cancel}>Cancel</button>

    <fieldset>
      <label>
        <input
          type="radio"
          value="snap"
          bind:group={snapMode}
          on:change={toggleSnap}
        />
        Snap to roads
      </label>
      <label>
        <input
          type="radio"
          value="free"
          bind:group={snapMode}
          on:change={toggleSnap}
        />
        Draw anywhere
      </label>
    </fieldset>

    <fieldset>
      <label>
        <input type="radio" value="append-start" bind:group={drawMode} />
        Extend from start (
        <b>1</b>
        )
      </label>
      <label>
        <input type="radio" value="append-end" bind:group={drawMode} />
        Extend from end (
        <b>2</b>
        )
      </label>
      <label>
        <input type="radio" value="adjust" bind:group={drawMode} />
        Adjust middle points (
        <b>3</b>
        )
      </label>
    </fieldset>

    <label>
      <input type="checkbox" bind:checked={showDebug} />
      Debug the network
    </label>
  </div>

  <div slot="map">
    <MapEvents on:click={onMapClick} on:mousemove={onMouseMove} />

    <DebugNetwork {showDebug} />

    {#each extraNodes as node}
      <Marker
        draggable
        bind:lngLat={node.point}
        on:dragstart={() => addNode(node)}
        on:drag={() => updateDrag(node)}
        on:dragend={finalizeDrag}
        zIndex={0}
      >
        <span
          class="dot"
          class:snapped-node={node.snapped}
          class:free-node={!node.snapped}
          class:hide={draggingExtraNode}
        />
      </Marker>
    {/each}

    {#each $waypoints as waypt, idx}
      <Marker
        draggable
        bind:lngLat={waypt.point}
        on:click={() => toggleSnapped(idx)}
        on:contextmenu={() => removeWaypoint(idx)}
        on:mouseenter={() => (hoveringOnMarker = true)}
        on:mouseleave={() => (hoveringOnMarker = false)}
        on:dragstart={startDraggingWaypoint}
        on:dragend={() => (draggingMarker = false)}
        zIndex={1}
      >
        <span class="dot" class:snapped={waypt.snapped}>{idx + 1}</span>
      </Marker>
    {/each}

    <GeoJSON data={calculateRoutes($routeTool, $waypoints)} generateId>
      <LineLayer
        paint={{
          "line-color": "black",
          "line-width": 10,
        }}
      />
    </GeoJSON>

    <GeoJSON data={previewGj}>
      <LineLayer
        paint={{
          "line-color": "black",
          "line-width": 3,
        }}
      />
    </GeoJSON>
  </div>
</SplitComponent>

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    background-color: blue;
    font-weight: bold;
  }

  .dot:hover {
    border: 1px solid black;
    cursor: pointer;
  }

  .snapped {
    background-color: red;
  }

  .free-node,
  .snapped-node {
    width: 20px;
    height: 20px;
    background-color: grey;
  }

  .snapped-node:hover {
    border: 3px solid red;
  }

  .free-node:hover {
    border: 3px solid blue;
  }

  .hide {
    visibility: hidden;
  }
</style>
