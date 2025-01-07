<script lang="ts">
  import { questions, type Link } from "./state";

  export let f: Link;
</script>

{#each questions as q, idx}
  <label>
    {q.name}
    <select bind:value={f.properties.answers[idx]}>
      {#each q.choices as value}
        <option {value}>{value}</option>
      {/each}
    </select>
  </label>
{/each}
