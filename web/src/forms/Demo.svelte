<script lang="ts">
  import "@picocss/pico/css/pico.jade.min.css";
  import Picker from "../rc/Picker.svelte";
  import AutogenerateForm from "./AutogenerateForm.svelte";
  import DerivedInfra from "./DerivedInfra.svelte";
  import { infraSchema } from "./infra_schema";
  import type { Infrastructure } from "./infra_types";
  import { rcSchema } from "./rc_schema";
  import type { Infrastructure as RcInfrastructure } from "./rc_types";

  let schema: "infra" | "rc" = "infra";

  let infraProps: Infrastructure = {};
  let rcProps: RcInfrastructure = {};
</script>

<div class="left">
  <Picker
    k="dropdown"
    bind:value={schema}
    choices={[
      ["infra", "PowerBI definitions"],
      ["rc", "Route Check inspired"],
    ]}
  />

  {#if schema == "infra"}
    <DerivedInfra infra={infraProps} />
    <textarea rows="20">{JSON.stringify(infraProps, null, "  ")}</textarea>
  {:else}
    <textarea rows="20">{JSON.stringify(rcProps, null, "  ")}</textarea>
  {/if}
</div>
<div class="main">
  {#if schema == "infra"}
    <AutogenerateForm spec={infraSchema()} bind:value={infraProps} />
  {:else}
    <AutogenerateForm spec={rcSchema()} bind:value={rcProps} />
  {/if}
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
