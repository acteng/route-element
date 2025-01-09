<script lang="ts">
  import { CircleLayer, GeoJSON } from "svelte-maplibre";
  import { gj, state } from "./state";
</script>

<GeoJSON data={gj($state.bus_stops)}>
  <CircleLayer
    paint={{
      "circle-color": "black",
      "circle-radius": 10,
    }}
  />
</GeoJSON>
