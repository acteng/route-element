<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { mode, state } from "../state";
</script>

JATs:

<div>
  <button on:click={() => ($mode = { kind: "new-point", obj: "jat" })}>
    New JAT
  </button>
</div>

<ol>
  {#each $state.jats as jat, idx}
    <li>
      <ClickLink
        on:click={() => ($mode = { kind: "edit-jat", idx })}
        color={jat.properties.color}
      >
        {jat.properties.name}
      </ClickLink>
    </li>
  {/each}
</ol>
