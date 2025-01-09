<script lang="ts">
  import { Marker } from "svelte-maplibre";

  // This is the geojson Position type
  export let lngLat: number[];
  export let color: string;
  export let radius = "30px";
  export let outline = false;
</script>

<Marker draggable bind:lngLat>
  <span
    class="dot"
    style:background-color={outline ? undefined : color}
    style:border-color={outline ? color : undefined}
    style:width={radius}
    style:height={radius}
    class:outline
  >
    <slot />
  </span>
</Marker>

<style>
  .dot {
    border-radius: 50%;
    display: flex;
  }

  .dot:hover {
    cursor: pointer;
  }

  .outline {
    border-width: 5px;
    border-style: solid;
  }
</style>
