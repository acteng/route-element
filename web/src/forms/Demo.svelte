<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import AutogenerateForm from "./AutogenerateForm.svelte";
  import { infraSchema } from "./infra_schema";
  import type { Infrastructure } from "./infra_types";

  let props: Infrastructure = {};
</script>

<div class="left">
  <textarea rows="20">{JSON.stringify(props, null, "  ")}</textarea>
</div>
<div class="main">
  <AutogenerateForm spec={infraSchema()} bind:value={props} />
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
