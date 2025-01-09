<script lang="ts">
  import { CircleLayer, GeoJSON } from "svelte-maplibre";
  import { gj, state } from "./state";
</script>

<GeoJSON data={gj($state.jats)}>
  <CircleLayer
    paint={{
      "circle-color": "rgba(0,0,0,0)",
      "circle-stroke-width": 5,
      "circle-stroke-color": "black",
      "circle-radius": 20,
    }}
  />
</GeoJSON>
