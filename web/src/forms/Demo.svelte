<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import AutogenerateForm from "./AutogenerateForm.svelte";
  import { crossingSchema } from "./infra_schema";
  import type { Crossing } from "./infra_types";

  let props: Crossing = {};
</script>

<div class="left">
  <textarea rows="20">{JSON.stringify(props, null, "  ")}</textarea>
</div>
<div class="main">
  <AutogenerateForm spec={crossingSchema()} bind:value={props} />
</div>

<style>
  div {
    float: left;
  }
  .left {
    width: 25%;
  }
  .main {
    width: 75%;
  }
</style>
