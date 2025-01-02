<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import type { Map } from "maplibre-gl";
  import { MapLibre } from "svelte-maplibre";
  import { Layout } from "svelte-utils/two_column_layout";

  let maptilerApiKey = "MZEJTanw3WpxRvt7qDfo";
  let map: Map | undefined;
</script>

<Layout>
  <div slot="left"></div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    <MapLibre
      style={`https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerApiKey}`}
      standardControls
      bind:map
    ></MapLibre>
  </div>
</Layout>
