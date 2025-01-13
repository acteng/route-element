<script lang="ts">
  import { Control } from "svelte-maplibre";
  import BusStops from "./BusStops.svelte";
  import Crossings from "./Crossings.svelte";
</script>

<Control>
  <div style="display: flex; flex-direction: column">
    <BusStops />
    <Crossings />
  </div>
</Control>
