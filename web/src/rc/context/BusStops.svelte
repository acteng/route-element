<script lang="ts">
  import {
    CircleLayer,
    ControlButton,
    VectorTileSource,
  } from "svelte-maplibre";
  import { SequentialLegend } from "svelte-utils";
  import { makeColorRamp, Popup } from "svelte-utils/map";

  let show = false;

  let colorScale = ["#CDE594", "#80C6A3", "#1F9EB7", "#186290", "#080C54"];
  let limits = [0, 3, 10, 20, 30, 100];
</script>

<ControlButton on:click={() => (show = !show)}>Bus stops</ControlButton>
{#if show}
  <div>
    <p>Peak hourly frequency:</p>
    <SequentialLegend {colorScale} {limits} />
  </div>
{/if}

<VectorTileSource url={"pmtiles://https://atip.uk/layers/v1/bus_stops.pmtiles"}>
  <CircleLayer
    sourceLayer="bus_stops"
    paint={{
      "circle-color": makeColorRamp(["get", "peak"], limits, colorScale),
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
    manageHoverState
  >
    <Popup let:props>
      <p>
        Stop name: <b>{props.stop_name}</b>
      </p>
      <p>
        Peak: <b>{props.peak}</b>
        buses during the busiest hour of any day
      </p>
      <p>The peak hour is {props.peak_description}</p>
      <p>
        Total buses per day: <b>{props.total}</b>
        (for {props.total_description}, the busiest day of the week)
      </p>
    </Popup>
  </CircleLayer>
</VectorTileSource>

<style>
  div {
    background-color: white;
  }
</style>
