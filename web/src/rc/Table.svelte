<script lang="ts">
  import { Modal } from "svelte-utils";
  import type { Link } from "./state";
  import TableCell from "./TableCell.svelte";

  export let links: Link[];
</script>

<Modal on:close>
  <table>
    <thead>
      <tr>
        <th>Link</th>
        <th>Question 1</th>
        <th>Question 2</th>
        <th>Question 3</th>
      </tr>
    </thead>
    <tbody>
      {#each links as link}
        <tr>
          <td>{link.properties.name}</td>
          <TableCell done={link.properties.q1 != ""} />
          <TableCell done={link.properties.q2 != ""} />
          <TableCell done={link.properties.q3 != 0} />
        </tr>
      {/each}
    </tbody>
  </table>
</Modal>
