<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { mode, state } from "../state";
</script>

Bus stops:

<div>
  <button on:click={() => ($mode = { kind: "new-point", obj: "bus stop" })}>
    New bus stop
  </button>
</div>

<div>
  <ClickLink on:click={() => ($mode = { kind: "bus-stop-questions" })}>
    ST20
  </ClickLink>:
  <progress
    value={$state.bus_stops.filter((f) => f.properties.st20 != "").length}
    max={$state.bus_stops.length}
  />
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

<style>
  progress {
    width: fit-content;
  }
</style>
