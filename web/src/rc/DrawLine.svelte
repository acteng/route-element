<script lang="ts">
  import type { Feature, LineString } from "geojson";
  import type { MapMouseEvent } from "maplibre-gl";
  import { MapEvents, Marker } from "svelte-maplibre";

  export let f: Feature<LineString>;

  function onMapClick(e: CustomEvent<MapMouseEvent>) {
    f.geometry.coordinates.push(e.detail.lngLat.toArray());
    f = f;
  }

  function removePoint(idx: number) {
    f.geometry.coordinates.splice(idx, 1);
    f = f;
  }
</script>

<MapEvents on:click={onMapClick} />

{#each f.geometry.coordinates as pt, idx}
  <Marker draggable bind:lngLat={pt} on:contextmenu={() => removePoint(idx)}>
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
