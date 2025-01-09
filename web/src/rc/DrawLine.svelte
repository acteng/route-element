<script lang="ts">
  import type { Feature, LineString } from "geojson";
  import type { MapMouseEvent } from "maplibre-gl";
  import { MapEvents, Marker } from "svelte-maplibre";

  export let f: Feature<LineString>;

  function onMapClick(e: CustomEvent<MapMouseEvent>) {
    f.geometry.coordinates.push(e.detail.lngLat.toArray());
    f = f;
  }
</script>

<MapEvents on:click={onMapClick} />

{#each f.geometry.coordinates as pt}
  <Marker draggable bind:lngLat={pt}>
    <span class="dot" />
  </Marker>
{/each}

<style>
  .dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    background-color: red;
  }

  .dot:hover {
    border: 1px solid black;
    cursor: pointer;
  }
</style>
