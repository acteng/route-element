<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { mode, state } from "../state";
</script>

Crossings:

<div>
  <button on:click={() => ($mode = { kind: "new-point", obj: "crossing" })}>
    New crossing
  </button>
</div>

<div>
  <ClickLink on:click={() => ($mode = { kind: "crossing-questions" })}>
    SA10
  </ClickLink>:
  <progress
    value={$state.crossings.filter((f) => f.properties.sa10 != "").length}
    max={$state.crossings.length}
  />
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
