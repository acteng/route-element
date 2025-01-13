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
