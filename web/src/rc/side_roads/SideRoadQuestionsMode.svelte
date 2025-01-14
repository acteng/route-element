<script lang="ts">
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { scores } from "../common";
  import MetricDetails from "../MetricDetails.svelte";
  import { metrics } from "../metrics";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { mode, state } from "../state";

  let metric = metrics.SA01;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key == "Escape") {
      $mode = { kind: "neutral" };
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar">
    <button on:click={() => ($mode = { kind: "neutral" })}>Done</button>

    <h2>SA01: Conflict at Side ROads and Priority Junctions</h2>
    <p>{metric.description}</p>

    <ol>
      {#each $state.side_roads as x}
        <li>
          <span style:color={x.properties.color}>
            {x.properties.name}
          </span>

          <Picker
            k="horiz-radio"
            bind:value={x.properties.sa01}
            choices={scores()}
          />
        </li>
      {/each}
    </ol>

    <MetricDetails {metric} />
  </div>

  <div slot="map">
    <ShowAllLayers except="" />
  </div>
</SplitComponent>
