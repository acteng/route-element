<script lang="ts">
  import { Modal } from "svelte-utils";
  import { questions, type Link } from "./state";
  import TableCell from "./TableCell.svelte";

  export let links: Link[];
</script>

<Modal on:close>
  <table>
    <thead>
      <tr>
        <th>Link</th>
        {#each questions as q}
          <th>{q.name}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each links as link}
        <tr>
          <td>{link.properties.name}</td>
          {#each link.properties.answers as value}
            <TableCell done={value != ""} />
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>
