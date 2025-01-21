<script lang="ts">
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import { scores } from "../common";
  import MetricDetails from "../MetricDetails.svelte";
  import { metrics } from "../metrics";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { mode, state } from "../state";

  let metric = metrics.SA10;

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

    <h2>SA10: pedestrian crossing speed</h2>
    <p>{metric.description}</p>

    <ol>
      {#each $state.crossings as x}
        <li>
          <span style:color={x.properties.color}>
            {x.properties.name}
          </span>

          <Picker
            k="horiz-radio"
            bind:value={x.properties.sa10}
            choices={scores()}
          />
        </li>
      {/each}
    </ol>

    <MetricDetails {metric} />
  </div>

  <div slot="map">
    <ShowAllLayers
      showColor="crossings"
      except=""
      showMissingProperty={["get", "sa10"]}
    />
  </div>
</SplitComponent>
