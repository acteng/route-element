<script lang="ts">
  import ClickLink from "../ClickLink.svelte";
  import { mode, state } from "../state";
  import { blankSideRoad } from "./types";

  function newSideRoad() {
    let f = blankSideRoad($state.side_roads.length);
    $state.side_roads = [...$state.side_roads, f];
    $mode = { kind: "edit-side-road", idx: $state.side_roads.length - 1 };
  }
</script>

Side roads:

<div>
  <button on:click={newSideRoad}>New side road</button>
</div>

<ol>
  {#each $state.side_roads as side_road, idx}
    <li>
      <ClickLink
        on:click={() => ($mode = { kind: "edit-side-road", idx })}
        color={side_road.properties.color}
      >
        {side_road.properties.name}
      </ClickLink>
    </li>
  {/each}
</ol>
