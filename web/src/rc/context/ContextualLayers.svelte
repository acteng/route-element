<script lang="ts">
  import { Control } from "svelte-maplibre";
  import BasemapPicker from "./BasemapPicker.svelte";
  import BusStops from "./BusStops.svelte";
  import Crossings from "./Crossings.svelte";
</script>

<Control>
  <div style="display: flex; flex-direction: column">
    <BusStops />
    <Crossings />
    <BasemapPicker />
  </div>
</Control>
