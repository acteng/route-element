<script lang="ts">
  import Picker from "../Picker.svelte";
  import { state } from "../state";
  import Guidance from "./guidance/Guidance.svelte";

  export let junctionIdx: number;
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
    bind:value={$state.jats[junctionIdx].properties.details.movements[idx].name}
  />
</label>

<Picker
  k="horiz-radio"
  bind:value={$state.jats[junctionIdx].properties.details.movements[idx].kind}
  choices={[
    ["cycling", "Cycling"],
    ["walking & wheeling", "Walking & Wheeling"],
  ]}
>
  User
</Picker>

{#if $state.jats[junctionIdx].properties.details.movements[idx].kind == "cycling"}
  <Guidance />
{/if}

<Picker
  k="horiz-radio"
  bind:value={$state.jats[junctionIdx].properties.details.movements[idx].score}
  choices={scoreChoices}
>
  Score
</Picker>

<label>
  Comments
  <textarea
    bind:value={$state.jats[junctionIdx].properties.details.movements[idx]
      .notes}
  />
</label>
