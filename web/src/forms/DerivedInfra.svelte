<script lang="ts">
  import type { Crossing, Infrastructure } from "./infra_types";
  import { getObjectTag } from "./types";

  export let infra: Infrastructure;
</script>

{#if getObjectTag(infra) == "Crossing"}
  <p>Is signalized? {getObjectTag(infra.Crossing)}</p>
{:else}
  <p>Not a crossing</p>
{/if}
