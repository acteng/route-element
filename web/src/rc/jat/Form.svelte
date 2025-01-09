<script lang="ts">
  import Picker from "../Picker.svelte";
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

<Picker
  k="horiz-radio"
  label="User"
  bind:value={$state.jats[junctionIdx].properties[stage].movements[idx].kind}
  choices={[
    ["cycling", "Cycling"],
    ["walking & wheeling", "Walking & Wheeling"],
  ]}
/>

{#if $state.jats[junctionIdx].properties[stage].movements[idx].kind == "cycling"}
  <Guidance />
{/if}

<Picker
  k="horiz-radio"
  label="Score"
  bind:value={$state.jats[junctionIdx].properties[stage].movements[idx].score}
  choices={scoreChoices}
/>

<label>
  Comments
  <textarea
    bind:value={$state.jats[junctionIdx].properties[stage].movements[idx].notes}
  />
</label>
