<script lang="ts">
  // @ts-nocheck
  import type { Feature, LineString } from "geojson";
  import { Marker } from "svelte-maplibre";

  export let f: Feature<LineString>;
</script>

{#each f.geometry.coordinates as pt}
  <Marker draggable bind:lngLat={pt}>
    <span class="dot" />
  </Marker>
{/each}

<style>
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: flex;
    background-color: grey;
  }

  .dot:hover {
    border: 1px solid black;
    cursor: pointer;
  }
</style>
