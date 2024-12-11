<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import init, { evalRoute } from "backend";
  import { Layout } from "svelte-utils/two_column_layout";
  import { Popup, isLine, isPolygon, isPoint } from "svelte-utils/map";
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

  let line: Feature<LineString, { kind: "input" }> | undefined;
  $: parseLines(map, inputGj);

  interface Output {
    length: number;
    ruc: Feature<Polygon, { ruc11: string }>[];
    pop_density: Feature<Polygon, { pop_density: number }>[];
    os_nodes: Feature<Point, { id: string }>[];
    os_links: Feature<
      LineString,
      {
        id: string;
        road_classification: string;
        start_node: string;
        end_node: string;
      }
    >[];
  }
  let output: Output = {
    length: 0,
    ruc: [],
    pop_density: [],
    os_nodes: [],
    os_links: [],
  };
  $: if (loaded && line && output.length == 0) {
    recalc();
  }

  $: numUrbanAreas = output.ruc.filter((f) =>
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
      line!.properties = { kind: "input" };
      zoomTo(map, gj);
    } catch (err) {
      window.alert(err);
    }
  }

  function makeGj(
    line: Feature<LineString, { kind: "input" }> | undefined,
    output: Output,
  ): FeatureCollection {
    let gj: FeatureCollection = {
      type: "FeatureCollection" as const,
      features: [
        ...output.ruc,
        ...output.pop_density,
        ...output.os_nodes,
        ...output.os_links,
      ],
    };
    if (line) {
      gj.features.push(line);
    }
    return gj;
  }

  async function recalc() {
    if (loaded && line) {
      try {
        output = JSON.parse(await evalRoute(line, baseURL));
        // TODO Hacky
        output.ruc = JSON.parse(output.ruc).features;
        output.pop_density = JSON.parse(output.pop_density).features;
        output.os_nodes = JSON.parse(output.os_nodes).features;
        output.os_links = JSON.parse(output.os_links).features;
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
    <p>{numUrbanAreas} urban OAs, {output.ruc.length - numUrbanAreas} rural</p>
  </div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    <MapLibre
      style={`https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerApiKey}`}
      standardControls
      bind:map
    >
      {#if line && showInput}
        <EditLine bind:f={line} />
      {/if}

      <GeoJSON data={makeGj(line, output)} generateId>
        <LineLayer
          filter={["==", ["get", "kind"], "input"]}
          layout={{
            visibility: showInput ? "visible" : "none",
          }}
          paint={{
            "line-width": 5,
            "line-color": "red",
          }}
        />

        <FillLayer
          filter={["all", isPolygon, ["has", "ruc11"]]}
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

        <FillLayer
          filter={["all", isPolygon, ["has", "pop_density"]]}
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

        <CircleLayer
          filter={isPoint}
          manageHoverState
          layout={{
            visibility: show == "os_network" ? "visible" : "none",
          }}
          paint={{
            "circle-color": "green",
            "circle-radius": hoverStateFilter(5, 8),
          }}
        />

        <LineLayer
          filter={["all", isLine, ["has", "road_classification"]]}
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
