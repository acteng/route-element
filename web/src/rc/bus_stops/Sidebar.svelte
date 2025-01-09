<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { map, mode, state } from "../state";
  import { blankBusStop } from "./types";

  function newBusStop() {
    if (!$map) {
      return;
    }
    let f = blankBusStop($state.bus_stops.length, $map.getCenter().toArray());
    $state.bus_stops = [...$state.bus_stops, f];
    $mode = { kind: "edit-bus-stop", idx: $state.bus_stops.length - 1 };
  }
</script>

Bus stops:

<div>
  <button on:click={newBusStop}>New bus stop</button>
</div>

<ol>
  {#each $state.bus_stops as bus_stop, idx}
    <li>
      <ClickLink
        on:click={() => ($mode = { kind: "edit-bus-stop", idx })}
        color={bus_stop.properties.color}
      >
        {bus_stop.properties.name}
      </ClickLink>
    </li>
  {/each}
</ol>
