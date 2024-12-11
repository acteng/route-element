<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import init, { evalRoute } from "backend";
  import { Layout } from "svelte-utils/two_column_layout";
  import { emptyGeojson, Popup } from "svelte-utils/map";
  import type { Map } from "maplibre-gl";
  import { onMount } from "svelte";
  import {
    MapLibre,
    GeoJSON,
    LineLayer,
    FillLayer,
    hoverStateFilter,
    CircleLayer,
  } from "svelte-maplibre";
  import { exampleGj } from "./examples";
  import { zoomTo } from "./common";
  import EditLine from "./EditLine.svelte";
  import type {
    Feature,
    Point,
    Polygon,
    FeatureCollection,
    LineString,
  } from "geojson";

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

  interface Output {
    length: number;
    ruc: FeatureCollection<Polygon, { ruc11: string }>;
    pop_density: FeatureCollection<Polygon, { pop_density: number }>;
    os_nodes: FeatureCollection<Point, { id: string }>;
    os_links: FeatureCollection<
      LineString,
      {
        id: string;
        road_classification: string;
        start_node: string;
        end_node: string;
      }
    >;
  }
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

      <GeoJSON data={output.ruc}>
        <FillLayer
          manageHoverState
          layout={{
            visibility: show == "ruc" ? "visible" : "none",
          }}
          paint={{
            "fill-color": [
              "case",
              ["in", "Urban", ["get", "ruc11"]],
              "orange",
              "green",
            ],
            "fill-opacity": hoverStateFilter(0.3, 0.5),
          }}
        >
          <Popup openOn="hover" let:props>{props.ruc11}</Popup>
        </FillLayer>
      </GeoJSON>

      <GeoJSON data={output.pop_density}>
        <FillLayer
          manageHoverState
          layout={{
            visibility: show == "pop_density" ? "visible" : "none",
          }}
          paint={{
            "fill-color": "blue",
            "fill-opacity": hoverStateFilter(0.3, 0.5),
          }}
        >
          <Popup openOn="hover" let:props>
            {props.pop_density} people / square km
          </Popup>
        </FillLayer>
      </GeoJSON>

      <GeoJSON data={output.os_nodes}>
        <CircleLayer
          manageHoverState
          layout={{
            visibility: show == "os_network" ? "visible" : "none",
          }}
          paint={{
            "circle-color": "green",
            "circle-radius": hoverStateFilter(5, 8),
          }}
        />
      </GeoJSON>

      <GeoJSON data={output.os_links}>
        <LineLayer
          layout={{
            visibility: show == "os_network" ? "visible" : "none",
          }}
          paint={{
            "line-width": 3,
            "line-color": "black",
          }}
        >
          <Popup openOn="hover" let:props>
            {props.road_classification}
          </Popup>
        </LineLayer>
      </GeoJSON>
    </MapLibre>
  </div>
</Layout>
