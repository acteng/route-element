<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { map, mode, state } from "../state";
  import { blankCrossing } from "./types";

  function newCrossing() {
    if (!$map) {
      return;
    }
    let f = blankCrossing($state.crossings.length, $map.getCenter().toArray());
    $state.crossings = [...$state.crossings, f];
    $mode = { kind: "edit-crossing", idx: $state.crossings.length - 1 };
  }
</script>

Crossings:

<div>
  <button on:click={newCrossing}>New crossing</button>
</div>

<ol>
  {#each $state.crossings as crossing, idx}
    <li>
      <ClickLink
        on:click={() => ($mode = { kind: "edit-crossing", idx })}
        color={crossing.properties.color}
      >
        {crossing.properties.name}
      </ClickLink>
    </li>
  {/each}
</ol>
