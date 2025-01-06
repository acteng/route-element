<script lang="ts">
  export let done: boolean;
</script>

{#if done}
  <td style:background="green">X</td>
{:else}
  <td style:background="red"></td>
{/if}
