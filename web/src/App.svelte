<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import init, { evalRoute } from "backend";
  import { Layout } from "svelte-utils/two_column_layout";
  import { emptyGeojson } from "svelte-utils/map";
  import type { Map } from "maplibre-gl";
  import { onMount } from "svelte";
  import { MapLibre, GeoJSON, LineLayer } from "svelte-maplibre";
  import { exampleGj } from "./examples";
  import { zoomTo, type Output } from "./common";
  import EditLine from "./EditLine.svelte";
  import OutputLayers from "./OutputLayers.svelte";
  import type { Feature, LineString } from "geojson";

  //let baseURL = "https://assets.od2net.org/route-element";
  let baseURL = "http://localhost:5173/route-element/route-element";

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

  let output: Output = {
    length: 0,
    ruc: emptyGeojson(),
    pop_density: emptyGeojson(),
    os_nodes: emptyGeojson(),
    os_links: emptyGeojson(),
  };
  $: if (loaded && line && output.length == 0) {
    recalc();
  }

  $: numUrbanAreas = output.ruc.features.filter((f) =>
    f.properties.ruc11.startsWith("Urban"),
  ).length;

  let showInput = true;
  let show: "ruc" | "pop_density" | "os_network" = "ruc";

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

  async function recalc() {
    if (loaded && line) {
      try {
        // TODO Hacky
        let x = JSON.parse(await evalRoute(line, baseURL));
        output = {
          length: x.length,
          ruc: JSON.parse(x.ruc),
          pop_density: JSON.parse(x.pop_density),
          os_nodes: JSON.parse(x.os_nodes),
          os_links: JSON.parse(x.os_links),
        };
      } catch (err) {
        window.alert(err);
      }
    }
  }

  function summarizeLinks(output: Output): string {
    return output.os_links.features
      .map((f) => f.properties.road_classification)
      .join(", ");
  }
</script>

<Layout>
  <div slot="left">
    <p>Input:</p>
    <textarea bind:value={inputGj} rows={5} />

    <p>Output:</p>
    <button on:click={recalc}>Recalculate</button>

    <label>
      <input type="checkbox" bind:checked={showInput} />
      Show input route
    </label>
    <br />

    <fieldset>
      <label>
        <input type="radio" value="ruc" bind:group={show} />
        RUC
      </label>
      <label>
        <input type="radio" value="pop_density" bind:group={show} />
        Pop density
      </label>
      <label>
        <input type="radio" value="os_network" bind:group={show} />
        OS links and nodes
      </label>
    </fieldset>

    <p>Length: {Math.round(output.length)} m</p>
    <p>
      {numUrbanAreas} urban OAs, {output.ruc.features.length - numUrbanAreas} rural
    </p>
    <p>
      {output.os_links.features.length} links, {output.os_nodes.features.length}
      nodes
    </p>
    <p>{summarizeLinks(output)}</p>
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    <MapLibre
      style={`https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerApiKey}`}
      standardControls
      bind:map
    >
      {#if line && showInput}
        <EditLine bind:f={line} />
        <GeoJSON data={line}>
          <LineLayer
            layout={{
              visibility: showInput ? "visible" : "none",
            }}
            paint={{
              "line-width": 5,
              "line-color": "red",
            }}
          />
        </GeoJSON>
      {/if}

      <OutputLayers {output} {show} />
    </MapLibre>
  </div>
</Layout>
