<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { blankJAT, map, mode, state } from "../state";

  function newJAT() {
    if (!$map) {
      return;
    }
    let f = blankJAT($state.jats.length, $map.getCenter().toArray());
    $state.jats = [...$state.jats, f];
    $mode = { kind: "edit-jat", idx: $state.jats.length - 1 };
  }
</script>

JATs:

<div>
  <button on:click={newJAT}>New JAT</button>
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
