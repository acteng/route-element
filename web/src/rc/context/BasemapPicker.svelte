<script lang="ts">
  import Picker from "../Picker.svelte";
  import { basemap } from "../state";

  function choices(): [string, string][] {
    let list = [
      ["streets", "MapTiler Streets"],
      ["dataviz", "MapTiler Dataviz"],
      ["uk-openzoomstack-light", "OS Open Zoomstack"],
      ["openstreetmap", "OpenStreetMap"],
    ] as [string, string][];
    if (new URLSearchParams(window.location.search).has("google")) {
      list.splice(0, 1, ["google", "Google satellite"]);
    }
    return list;
  }
</script>

<Picker k="dropdown" bind:value={$basemap} choices={choices()} />
