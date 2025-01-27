<script lang="ts">
  import { Modal } from "svelte-utils";
  import FormV2 from "../forms/FormV2.svelte";

  let props = {};
</script>

<Modal on:close>
  <FormV2 bind:props />

  <textarea disabled>{JSON.stringify(props, null, "  ")}</textarea>
</Modal>
