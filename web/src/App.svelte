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
  import type { FeatureCollection, LineString } from "geojson";

  //let baseURL = "https://assets.od2net.org/route-element";
  let baseURL = "http://localhost:5173/route-element/route-element";

  let maptilerApiKey = "MZEJTanw3WpxRvt7qDfo";
  let map: Map | undefined;
  let loaded = false;

  let showInput = true;
  let show: "ruc" | "pop_density" | "os_network" = "ruc";

  onMount(async () => {
    await init();
    loaded = true;
    cleanInput(JSON.stringify(exampleGj));
  });

  let inputGj: FeatureCollection<LineString> = emptyGeojson();
  let current: number | null = null;
  let line: Feature<LineString> | null = null;

  let output: Output = {
    length: 0,
    ruc: emptyGeojson(),
    pop_density: emptyGeojson(),
    os_nodes: emptyGeojson(),
    os_links: emptyGeojson(),
  };
  $: if (loaded && current != null && output.length == 0) {
    recalc();
  }

  $: numUrbanAreas = output.ruc.features.filter((f) =>
    f.properties.ruc11.startsWith("Urban"),
  ).length;

  function cleanInput(input: string) {
    inputGj = emptyGeojson();
    current = null;

    try {
      let gj: FeatureCollection = JSON.parse(input);
      gj.features = gj.features.filter((f) => f.geometry.type == "LineString");
      if (gj.features.length == 0) {
        throw new Error(`No LineStrings`);
      }
      inputGj = gj;
      current = 0;
    } catch (err) {
      window.alert(err);
    }
  }

  async function recalc() {
    if (loaded && current != null) {
      line = inputGj.features[current];
      if (map) {
        zoomTo(map, line);
      }

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
    {#if current != null}
      <button
        on:click={() => {
          current--;
          recalc();
        }}
      >
        Prev
      </button>
      {current + 1} / {inputGj.features.length}
      <button
        on:click={() => {
          current++;
          recalc();
        }}
      >
        Next
      </button>
    {/if}

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
