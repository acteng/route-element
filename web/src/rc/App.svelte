<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import type { Map } from "maplibre-gl";
  import { MapLibre } from "svelte-maplibre";
  import { Layout } from "svelte-utils/two_column_layout";
  import { getStyle } from "./google";

  let map: Map | undefined;
</script>

<Layout>
  <div slot="left"></div>

  <div slot="main" style="position:relative; width: 100%; height: 100vh;">
    {#await getStyle(new URLSearchParams(window.location.search).get("google") || "") then style}
      <MapLibre {style} standardControls bind:map></MapLibre>
    {/await}
  </div>
</Layout>
