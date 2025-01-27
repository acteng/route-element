<script lang="ts">
  import { Modal } from "svelte-utils";
  import Form from "../forms/Form.svelte";

  let props = {};
</script>

<Modal on:close>
  <Form bind:props />

  <textarea disabled>{JSON.stringify(props, null, "  ")}</textarea>
</Modal>
