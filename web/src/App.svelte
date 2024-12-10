<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import init, { evalRoute } from "backend";
  import { Layout } from "svelte-utils/two_column_layout";
  import { Popup, isLine, isPolygon } from "svelte-utils/map";
  import type { Map } from "maplibre-gl";
  import { onMount } from "svelte";
  import {
    MapLibre,
    GeoJSON,
    LineLayer,
    FillLayer,
    hoverStateFilter,
  } from "svelte-maplibre";
  import { exampleGj } from "./examples";
  import { zoomTo } from "./common";
  import EditLine from "./EditLine.svelte";
  import type {
    Feature,
    Polygon,
    FeatureCollection,
    LineString,
  } from "geojson";

  let maptilerApiKey = "MZEJTanw3WpxRvt7qDfo";
  let map: Map | undefined;
  let loaded = false;

  onMount(async () => {
    await init();
    loaded = true;
  });

  let inputGj = JSON.stringify(exampleGj);

  let line: Feature<LineString> | undefined;
  $: parseLines(map, inputGj);

  interface Output {
    length: number;
    ruc: Feature<Polygon, { RUC11: string }>[];
  }
  let output: Output = {
    length: 0,
    ruc: [],
  };
  $: if (loaded && line && output.length == 0) {
    recalc();
  }

  $: numUrbanAreas = output.ruc.filter((f) =>
    f.properties.RUC11.startsWith("Urban"),
  ).length;

  function parseLines(map: Map | undefined, inputGj: string) {
    if (!map) {
      return;
    }
    line = undefined;

    try {
      let gj = JSON.parse(inputGj);

      if (
        gj.features.length == 0 ||
        gj.features[0].geometry.type != "LineString"
      ) {
        throw new Error(`Need a FeatureCollection with a LineString`);
      }

      line = gj.features[0];
      zoomTo(map, gj);
    } catch (err) {
      window.alert(err);
    }
  }

  function makeGj(
    line: Feature<LineString> | undefined,
    output: Output,
  ): FeatureCollection {
    let gj: FeatureCollection = {
      type: "FeatureCollection" as const,
      features: output.ruc,
    };
    if (line) {
      gj.features.push(line);
    }
    return gj;
  }

  async function recalc() {
    if (loaded && line) {
      try {
        output = JSON.parse(await evalRoute(line));
      } catch (err) {
        window.alert(err);
      }
    }
  }
</script>

<Layout>
  <div slot="left">
    <p>Input:</p>
    <textarea bind:value={inputGj} rows={5} />

    <p>Output:</p>
    <button on:click={recalc}>Recalculate</button>
    <p>Length: {Math.round(output.length)} m</p>
    <p>{numUrbanAreas} urban OAs, {output.ruc.length - numUrbanAreas} rural</p>
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    <MapLibre
      style={`https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerApiKey}`}
      standardControls
      bind:map
    >
      {#if line}
        <EditLine bind:f={line} />
      {/if}

      <GeoJSON data={makeGj(line, output)} generateId>
        <LineLayer
          filter={isLine}
          paint={{
            "line-width": 5,
            "line-color": "red",
          }}
        />

        <FillLayer
          filter={isPolygon}
          manageHoverState
          paint={{
            "fill-color": [
              "case",
              ["in", "Urban", ["get", "RUC11"]],
              "orange",
              "green",
            ],
            "fill-opacity": hoverStateFilter(0.3, 0.5),
          }}
        >
          <Popup openOn="hover" let:props>{props.RUC11}</Popup>
        </FillLayer>
      </GeoJSON>
    </MapLibre>
  </div>
</Layout>
