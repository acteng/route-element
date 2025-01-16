<script lang="ts">
  import bearing from "@turf/bearing";
  import destination from "@turf/destination";
  import type { Feature, FeatureCollection } from "geojson";
  import type { MapMouseEvent } from "maplibre-gl";
  import {
    CircleLayer,
    GeoJSON,
    hoverStateFilter,
    LineLayer,
    MapEvents,
    Marker,
    SymbolLayer,
    type LayerClickInfo,
  } from "svelte-maplibre";
  import { Popup } from "svelte-utils/map";
  import movementUrl from "../assets/movement.svg?url";
  import panUrl from "../assets/pan.svg?url";
  import type { Position } from "../common";
  import { map, state, type State } from "../state";
  import { colors } from "./colors";
  import type { Arm, Movement } from "./types";

  type Mode =
    | { mode: "select" }
    | { mode: "editing"; id: ID }
    | { mode: "new-arm" }
    | { mode: "new-movement" };
  type Kind = "arm" | "movement";
  type ID = { kind: Kind; idx: number };

  export let junctionIdx: number;
  export let mode: Mode;
  export let hoveringSidebar: ID | null;
  export let select: (id: ID) => Promise<void>;
  export let stopEditing: () => Promise<void>;

  $: hoverGj = getHoverData($state, mode, hoveringSidebar);

  let scoreColors = {
    0: colors.red.background,
    1: colors.amber.background,
    2: colors.green.background,
    X: colors.critical.background,
  };

  function getHoverData(
    state: State,
    mode: Mode,
    hoveringSidebar: ID | null,
  ): FeatureCollection {
    let gj: FeatureCollection = {
      type: "FeatureCollection" as const,
      features: [],
    };
    let id = mode.mode == "editing" ? mode.id : hoveringSidebar;
    if (id != null) {
      if (id.kind == "arm") {
        gj.features.push(
          armFeature(
            state.jats[junctionIdx].properties.details.arms[id.idx],
            id.idx,
          ),
        );
      } else {
        gj.features.push(
          lineFeature(
            state.jats[junctionIdx].properties.details.movements[id.idx],
            id.idx,
          ),
        );
      }
    }
    return gj;
  }

  async function onMapClick(e: CustomEvent<MapMouseEvent>) {
    if (!$map) {
      return;
    }

    // TODO Clicks on a LineLayer or Marker should stop the event from reaching here. Until then, use this hack
    for (let _ of $map.queryRenderedFeatures(e.detail.point, {
      layers: ["jat-cycling", "jat-walking-wheeling"],
    })) {
      return;
    }

    if (mode.mode == "select") {
      return;
    }
    // Deselect something
    if (mode.mode == "editing") {
      await stopEditing();
      return;
    }

    if (mode.mode == "new-arm") {
      $state.jats[junctionIdx].properties.details.arms = [
        ...$state.jats[junctionIdx].properties.details.arms,
        {
          point: e.detail.lngLat.toArray() as Position,
          name: "",
        },
      ];
      await select({
        kind: "arm",
        idx: $state.jats[junctionIdx].properties.details.arms.length - 1,
      });
    } else {
      $state.jats[junctionIdx].properties.details.movements = [
        ...$state.jats[junctionIdx].properties.details.movements,
        {
          point1: e.detail.lngLat.toArray() as Position,
          // Offset 5 and 10 meters to the north
          point2: destination(e.detail.lngLat.toArray(), 0.005, 0).geometry
            .coordinates as Position,
          point3: destination(e.detail.lngLat.toArray(), 0.01, 0).geometry
            .coordinates as Position,
          kind: "cycling",
          score: "X",
          name: "",
          notes: "",
        },
      ];
      await select({
        kind: "movement",
        idx: $state.jats[junctionIdx].properties.details.movements.length - 1,
      });
    }
  }

  async function onFeatureClick(e: CustomEvent<LayerClickInfo>) {
    await select({ kind: "movement", idx: e.detail.features[0].id as number });
  }

  // For rendering movements only
  function toGj(state: State): FeatureCollection {
    let gj = {
      type: "FeatureCollection" as const,
      features: state.jats[junctionIdx].properties.details.movements.map(
        (movement, idx) => lineFeature(movement, idx),
      ),
    };
    for (let m of state.jats[junctionIdx].properties.details.movements) {
      gj.features.push(arrowFeature(m, gj.features.length));
      // Arrows at both ends
      if (m.kind == "walking & wheeling") {
        let opposite = { ...m, point1: m.point3, point3: m.point1 };
        gj.features.push(arrowFeature(opposite, gj.features.length));
      }
    }

    return gj;
  }

  function lineFeature(movement: Movement, id: number): Feature {
    return {
      type: "Feature",
      id,
      properties: {
        name: movement.name,
        kind: movement.kind,
        color: scoreColors[movement.score],
      },
      geometry: {
        type: "LineString",
        coordinates: [movement.point1, movement.point2, movement.point3],
      },
    };
  }

  function arrowFeature(movement: Movement, id: number): Feature {
    return {
      type: "Feature",
      id,
      properties: {
        kind: movement.kind,
        color: scoreColors[movement.score],
        angle: bearing(movement.point2, movement.point3),
      },
      geometry: {
        type: "Point",
        coordinates: movement.point3,
      },
    };
  }
  function armFeature(arm: Arm, id: number): Feature {
    return {
      type: "Feature",
      id,
      properties: {
        kind: "arm",
      },
      geometry: {
        type: "Point",
        coordinates: arm.point,
      },
    };
  }

  function armLabel(idx: number): string {
    return String.fromCharCode(idx + "A".charCodeAt(0));
  }
</script>

<MapEvents on:click={onMapClick} />

{#if mode.mode != "editing"}
  <div class="control-panel">
    <button class="outline" on:click={stopEditing}>
      <img src={panUrl} alt="Move map" style="vertical-align: middle;" />
      {#if mode.mode == "select"}
        <b>Move map</b>
      {:else}
        Move map
      {/if}
    </button>
    <button class="outline" on:click={() => (mode = { mode: "new-arm" })}>
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        style="vertical-align: middle;"
      >
        <circle cx="12" cy="12" r="12" fill="white" />
        <text x="6" y="16" fill="#4472c4">A</text>
      </svg>
      {#if mode.mode == "new-arm"}
        <b>New arm</b>
      {:else}
        New arm
      {/if}
    </button>
    <button class="outline" on:click={() => (mode = { mode: "new-movement" })}>
      <img
        src={movementUrl}
        alt="New movement"
        style="vertical-align: middle;"
      />
      {#if mode.mode == "new-movement"}
        <b>New movement</b>
      {:else}
        New movement
      {/if}
    </button>
  </div>
{/if}

{#each $state.jats[junctionIdx].properties.details.arms as arm, idx}
  <Marker
    draggable
    bind:lngLat={arm.point}
    on:dragend={() => select({ kind: "arm", idx })}
    on:click={() => select({ kind: "arm", idx })}
  >
    <span class="dot" style:color="#4472c4" style:background-color="white">
      {armLabel(idx)}
    </span>
  </Marker>
{/each}

{#each $state.jats[junctionIdx].properties.details.movements as movement, idx}
  <Marker
    draggable
    bind:lngLat={movement.point1}
    on:dragend={() => select({ kind: "movement", idx })}
    on:click={() => select({ kind: "movement", idx })}
  >
    <span
      class="dot"
      style:background-color={scoreColors[movement.score]}
      style:opacity={movement.kind == "walking & wheeling" ? "0%" : "100%"}
    />
  </Marker>

  <Marker
    draggable
    bind:lngLat={movement.point2}
    on:dragend={() => select({ kind: "movement", idx })}
    on:click={() => select({ kind: "movement", idx })}
  >
    <span class="dot" style:background-color={scoreColors[movement.score]} />
  </Marker>

  <Marker
    draggable
    bind:lngLat={movement.point3}
    on:dragend={() => select({ kind: "movement", idx })}
    on:click={() => select({ kind: "movement", idx })}
  >
    <span
      class="dot"
      style:background-color={scoreColors[movement.score]}
      style:opacity="0%"
    />
  </Marker>
{/each}

<GeoJSON data={toGj($state)}>
  <!-- TODO Two layers due to https://github.com/maplibre/maplibre-gl-js/issues/1235 -->
  <LineLayer
    id="jat-cycling"
    manageHoverState
    paint={{
      "line-width": hoverStateFilter(6, 10),
      "line-color": ["get", "color"],
    }}
    filter={["==", ["get", "kind"], "cycling"]}
    on:click={onFeatureClick}
  >
    <Popup let:props>{props.name || "Untitled movement"}</Popup>
  </LineLayer>
  <LineLayer
    id="jat-walking-wheeling"
    manageHoverState
    paint={{
      "line-width": hoverStateFilter(6, 8),
      "line-color": ["get", "color"],
      "line-dasharray": [3, 2],
    }}
    filter={["==", ["get", "kind"], "walking & wheeling"]}
    on:click={onFeatureClick}
  >
    <Popup let:props>{props.name || "Untitled movement"}</Popup>
  </LineLayer>

  <SymbolLayer
    id="jat-arrow"
    filter={["has", "angle"]}
    paint={{
      "text-color": ["get", "color"],
      "text-halo-color": "white",
      "text-halo-width": 3.0,
    }}
    layout={{
      "text-field": "⬆",
      "text-overlap": "always",
      "text-rotate": ["get", "angle"],
      "text-size": 70,
    }}
  />
</GeoJSON>

<GeoJSON data={hoverGj}>
  <LineLayer
    paint={{ "line-width": 5, "line-color": "yellow", "line-gap-width": 45 }}
  />

  <CircleLayer
    filter={["==", ["get", "kind"], "arm"]}
    paint={{
      "circle-radius": 20,
      "circle-opacity": 0,
      "circle-stroke-width": 5,
      "circle-stroke-color": "yellow",
    }}
  />
</GeoJSON>

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 25px;
    font-weight: bold;
  }

  .dot:hover {
    border: 3px solid black;
    cursor: pointer;
  }

  .control-panel {
    background: white;
    position: absolute;
    top: 10px;

    left: 50%;
    transform: translate(-50%, 0);
  }
</style>
