<script lang="ts">
  import { Modal } from "svelte-utils";
  import { questions, type Link } from "./state";

  export let links: Link[];
</script>

<Modal on:close>
  <table>
    <thead>
      <tr>
        <th></th>
        {#each links as link}
          <th style:color={link.properties.color}>{link.properties.name}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each questions as q, idx}
        <tr>
          <th>{q.name}</th>
          {#each links as link}
            {@const value = link.properties.answers[idx]}
            <td style:background={value == "" ? "red" : "green"}>{value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>
