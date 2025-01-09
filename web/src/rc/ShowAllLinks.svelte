<script lang="ts">
  import { GeoJSON, LineLayer } from "svelte-maplibre";
  import { gj, state } from "./state";

  export let showColor = false;
</script>

<GeoJSON data={gj($state.links)}>
  <LineLayer
    paint={{
      "line-color": showColor ? ["get", "color"] : "black",
      "line-width": 6,
    }}
  />
</GeoJSON>
