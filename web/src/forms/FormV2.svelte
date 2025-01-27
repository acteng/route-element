<script lang="ts">
  import AutogenerateForm from "./AutogenerateForm.svelte";
  import type { Field } from "./types";
  import type { Intervention } from "./v2_types";
  import schemaJson from "./v2.json";

  export let props: Intervention;

  let x: Field = schemaJson;
</script>

<AutogenerateForm spec={x} bind:value={props} />
