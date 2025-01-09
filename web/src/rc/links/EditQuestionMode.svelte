<script lang="ts">
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { mode, state } from "../state";
  import { questions } from "./types";

  export let qIdx: number;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>

    <h2>{questions[qIdx].name}: {questions[qIdx].description}</h2>
    <ol>
      {#each $state.links as link}
        <li>
          <span style:color={link.properties.color}>
            {link.properties.name}
          </span>

          <select bind:value={link.properties.answers[qIdx]}>
            {#each questions[qIdx].choices as value}
              <option {value}>{value}</option>
            {/each}
          </select>
        </li>
      {/each}
    </ol>
  </div>

  <div slot="map">
    <ShowAllLayers showLinkColor except="" />
  </div>
</SplitComponent>
