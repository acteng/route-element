<script lang="ts">
  import { GeoJSON, LineLayer } from "svelte-maplibre";
  import { gj, state } from "./state";
</script>

<GeoJSON data={gj($state.links)}>
  <LineLayer
    paint={{
      "line-color": ["get", "color"],
      "line-width": 6,
    }}
  />
</GeoJSON>
