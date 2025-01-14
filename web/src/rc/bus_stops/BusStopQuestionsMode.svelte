<script lang="ts">
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { scores } from "../common";
  import MetricDetails from "../MetricDetails.svelte";
  import { metrics } from "../metrics";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { mode, state } from "../state";

  let metric = metrics.ST20;

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

    <h2>
      ST20: bus stops
      <p>{metric.description}</p>

      <ol>
        {#each $state.bus_stops as bs}
          <li>
            <span style:color={bs.properties.color}>
              {bs.properties.name}
            </span>

            <Picker
              k="horiz-radio"
              bind:value={bs.properties.st20}
              choices={scores()}
            />
          </li>
        {/each}
      </ol>

      <MetricDetails {metric} />
    </h2>
  </div>

  <div slot="map">
    <ShowAllLayers except="" />
  </div>
</SplitComponent>
