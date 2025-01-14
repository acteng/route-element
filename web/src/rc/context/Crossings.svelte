<script lang="ts">
  import {
    CircleLayer,
    ControlButton,
    LineLayer,
    VectorTileSource,
    type LayerClickInfo,
  } from "svelte-maplibre";
  import { Legend } from "svelte-utils";
  import {
    constructMatchExpression,
    isLine,
    isPoint,
    Popup,
  } from "svelte-utils/map";

  let show = false;

  function onClick(e: CustomEvent<LayerClickInfo>) {
    window.open(
      `https://www.openstreetmap.org/${e.detail.features[0].properties!.osm}`,
      "_blank",
    );
  }

  let legend: [string, string][] = [
    ["Zebra", "#66C5CC"],
    ["Parallel", "#F6CF71"],
    ["Pelican", "#F89C74"],
    ["Puffin", "#DCB0F2"],
    ["Toucan", "#87C55F"],
    ["Pegasus", "#9EB9F3"],
    ["Uncontrolled", "#FE88B1"],
    ["Signalised", "#C9DB74"],
    ["Unknown", "red"],
  ];
</script>

<ControlButton on:click={() => (show = !show)}>Crossings</ControlButton>
{#if show}
  <div>
    <Legend rows={legend} />
  </div>
{/if}

<VectorTileSource url={"pmtiles://https://atip.uk/layers/v1/crossings.pmtiles"}>
  <LineLayer
    sourceLayer="crossings"
    filter={isLine}
    paint={{
      "line-color": constructMatchExpression(
        ["get", "class"],
        Object.fromEntries(legend),
        "red",
      ),
      "line-width": 3,
    }}
    layout={{
      visibility: show ? "visible" : "none",
    }}
    hoverCursor="pointer"
    on:click={onClick}
  >
    <Popup let:props>
      <p>{props.class || "Unknown"} crossing</p>
    </Popup>
  </LineLayer>

  <CircleLayer
    sourceLayer="crossings"
    filter={isPoint}
    paint={{
      "circle-color": constructMatchExpression(
        ["get", "class"],
        Object.fromEntries(legend),
        "red",
      ),
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1,
        2,
        8,
        3,
        13,
        10,
      ],
    }}
    layout={{
      visibility: show ? "visible" : "none",
    }}
    hoverCursor="pointer"
    on:click={onClick}
  >
    <Popup let:props>
      <p>{props.class || "Unknown"} crossing</p>
    </Popup>
  </CircleLayer>
</VectorTileSource>

<style>
  div {
    background-color: white;
  }
</style>
