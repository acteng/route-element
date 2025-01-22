<script lang="ts">
  import type { MapMouseEvent } from "maplibre-gl";
  import { MapEvents } from "svelte-maplibre";

  function rightClick(e: CustomEvent<MapMouseEvent>) {
    let lon = e.detail.lngLat.lng;
    let lat = e.detail.lngLat.lat;
    window.open(
      `http://maps.google.com/maps?q=&layer=c&cbll=${lat},${lon}&cbp=11,0,0,0,0`,
      "_blank",
    );
  }
</script>

<MapEvents on:contextmenu={rightClick} />
