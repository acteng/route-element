<script lang="ts">
  import { CircleLayer, GeoJSON } from "svelte-maplibre";
  import { gj, state } from "./state";
</script>

<GeoJSON data={gj($state.jats)}>
  <CircleLayer
    paint={{
      "circle-color": ["get", "color"],
      "circle-radius": 20,
    }}
  />
</GeoJSON>
