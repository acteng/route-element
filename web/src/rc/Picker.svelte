<script lang="ts">
  export let k: "horiz-radio" | "vert-radio" | "dropdown";
  export let label: string;
  export let value: string;
  // [value, label] or both[]
  export let choices: [string, string][] | string[];

  let fullChoices =
    choices[0].length == 2 ? choices : choices.map((x) => [x, x]);
</script>

{#if k == "horiz-radio" || k == "vert-radio"}
  <fieldset>
    {label}

    <div class:horiz_radio={k == "horiz-radio"}>
      {#each fullChoices as [v, l]}
        <label>
          <input type="radio" value={v} bind:group={value} on:change />
          {l}
        </label>
      {/each}
    </div>
  </fieldset>
{:else if k == "dropdown"}
  <label>
    {label}
    <select bind:value on:change>
      {#each fullChoices as [v, l]}
        <option value={v}>{l}</option>
      {/each}
    </select>
  </label>
{/if}

<style>
  .horiz_radio {
    display: flex;
    justify-content: space-between;
  }
</style>
