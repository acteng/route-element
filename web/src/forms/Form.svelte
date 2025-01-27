<script lang="ts">
  import AutogenerateForm from "./AutogenerateForm.svelte";
  import { crossingSchema } from "./infra_schema";
  import type { Crossing } from "./infra_types";

  export let props: Crossing;
</script>

<AutogenerateForm spec={crossingSchema()} bind:value={props} />
