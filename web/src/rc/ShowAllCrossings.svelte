<script lang="ts">
  import { CircleLayer, GeoJSON } from "svelte-maplibre";
  import { gj, state } from "./state";
</script>

<GeoJSON data={gj($state.crossings)}>
  <CircleLayer
    paint={{
      "circle-color": "black",
      "circle-radius": 10,
    }}
  />
</GeoJSON>
