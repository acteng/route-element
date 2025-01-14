<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { mode, state } from "../state";
  import Table from "./Table.svelte";
  import { blankLink, questions } from "./types";

  let showTable = false;

  function newLink() {
    let f = blankLink($state.links.length);
    $state.links = [...$state.links, f];
    $mode = { kind: "edit-link", idx: $state.links.length - 1 };
  }
</script>

{#if showTable}
  <Table on:close={() => (showTable = false)} />
{/if}

<div>
  <button on:click={newLink}>New link</button>
  <button on:click={() => (showTable = true)}>Table of questions</button>
</div>

Links:
<ol>
  {#each $state.links as link, idx}
    <li>
      <ClickLink
        on:click={() => ($mode = { kind: "edit-link", idx })}
        color={link.properties.color}
      >
        {link.properties.name}
      </ClickLink>
    </li>
  {/each}
</ol>

Questions:
<ol>
  {#each questions as q, idx}
    <li>
      <ClickLink on:click={() => ($mode = { kind: "link-questions", idx })}>
        {q.name}
      </ClickLink>:
      <progress
        value={$state.links.filter((f) => f.properties.answers[idx] != "")
          .length}
        max={$state.links.length}
      />
    </li>
  {/each}
</ol>

<style>
  progress {
    width: fit-content;
  }
</style>
