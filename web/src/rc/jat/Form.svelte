<script lang="ts">
  import { state } from "../state";
  import Guidance from "./guidance/Guidance.svelte";

  export let junctionIdx: number;
  export let stage: "existing" | "proposed";
  export let idx: number;

  let scoreChoices: [string, string][] = [
    ["X", "X - black"],
    ["0", "0 - red"],
    ["1", "1 - amber"],
    ["2", "2 - green"],
  ];
</script>

<label>
  Name
  <input
    type="text"
    bind:value={$state.jats[junctionIdx].properties[stage].movements[idx].name}
  />
</label>

<fieldset>
  <label>
    <input
      type="radio"
      value="cycling"
      bind:group={$state.jats[junctionIdx].properties[stage].movements[idx]
        .kind}
    />
    Cycling
  </label>
  <label>
    <input
      type="radio"
      value="walking & wheeling"
      bind:group={$state.jats[junctionIdx].properties[stage].movements[idx]
        .kind}
    />
    Walking & Wheeling
  </label>
</fieldset>

{#if $state.jats[junctionIdx].properties[stage].movements[idx].kind == "cycling"}
  <Guidance />
{/if}

<fieldset>
  {#each scoreChoices as [value, label]}
    <label>
      <input
        type="radio"
        {value}
        bind:group={$state.jats[junctionIdx].properties[stage].movements[idx]
          .score}
      />
      {label}
    </label>
  {/each}
</fieldset>

<label>
  Comments
  <textarea
    bind:value={$state.jats[junctionIdx].properties[stage].movements[idx].notes}
  />
</label>
