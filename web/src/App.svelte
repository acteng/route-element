<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import init, { evalRoute } from "backend";
  import { Layout } from "svelte-utils/two_column_layout";
  import type { Map } from "maplibre-gl";
  import { onMount } from "svelte";
  import { MapLibre, GeoJSON, LineLayer } from "svelte-maplibre";
  import { exampleGj } from "./examples";
  import { zoomTo } from "./common";
  import type { Feature, FeatureCollection, LineString } from "geojson";

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

  function makeGj(line: Feature<LineString> | undefined): FeatureCollection {
    let gj: FeatureCollection = {
      type: "FeatureCollection" as const,
      features: [],
    };
    if (line) {
      gj.features.push(line);
    }
    return gj;
  }
</script>

<Layout>
  <div slot="left">
    <p>Input:</p>
    <textarea bind:value={inputGj} rows={5} />

    <p>Output:</p>
    {#if line && loaded}
      <p>{evalRoute(line)}</p>
    {/if}
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    <MapLibre
      style={`https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerApiKey}`}
      standardControls
      bind:map
    >
      <GeoJSON data={makeGj(line)}>
        <LineLayer
          paint={{
            "line-width": 5,
            "line-color": "red",
          }}
        />
      </GeoJSON>
    </MapLibre>
  </div>
</Layout>
