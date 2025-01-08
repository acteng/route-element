<script lang="ts">
  export let color: string | undefined = undefined;
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" on:click|preventDefault style:color><slot /></a>
