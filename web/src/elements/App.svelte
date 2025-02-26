<script lang="ts">
  // @ts-nocheck
  import "@picocss/pico/css/pico.jade.min.css";
  import init, { evalRoute } from "backend";
  import type { Feature, FeatureCollection, LineString } from "geojson";
  import type { Map } from "maplibre-gl";
  import { onMount } from "svelte";
  import { GeoJSON, LineLayer, MapLibre } from "svelte-maplibre";
  import { emptyGeojson } from "svelte-utils/map";
  import { Layout } from "svelte-utils/two_column_layout";
  import { emptyOutput, zoomTo, type Output } from "./common";
  import EditLine from "./EditLine.svelte";
  import { exampleGj } from "./examples";
  import OutputLayers from "./OutputLayers.svelte";

  let baseURL =
    import.meta.env.MODE == "development"
      ? "http://localhost:5173/route-element/route-element"
      : "https://assets.od2net.org/route-element";

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

  let output = emptyOutput();
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
      // TODO Bit of a hack to trigger reactivity
      output = emptyOutput();
    } catch (err) {
      window.alert(err);
    }
  }

  async function recalc() {
    if (loaded && current != null) {
      output = emptyOutput();
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

  let fileInput: HTMLInputElement;
  async function loadFile(e: Event) {
    cleanInput(await fileInput.files![0].text());
  }
</script>

<Layout>
  <div slot="left">
    <p>Input:</p>

    <label>
      Load a GeoJSON file
      <input bind:this={fileInput} on:change={loadFile} type="file" />
    </label>

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

    {#if output.length == 0}
      <p>Loading...</p>
    {:else}
      <p>Length: {Math.round(output.length)} m</p>
      <p>
        {numUrbanAreas} urban OAs, {output.ruc.features.length - numUrbanAreas} rural
      </p>
      <p>
        {output.os_links.features.length} links, {output.os_nodes.features
          .length}
        nodes
      </p>
      <p>{summarizeLinks(output)}</p>
    {/if}
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
