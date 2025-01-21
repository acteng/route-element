<script lang="ts">
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import MetricDetails from "../MetricDetails.svelte";
  import { metrics, type Metric } from "../metrics";
  import Picker from "../Picker.svelte";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { mode, state } from "../state";
  import { questions } from "./types";

  export let qIdx: number;

  let metric: Metric | null = metrics[questions[qIdx].name];

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

    <h2>{questions[qIdx].name}: {questions[qIdx].description}</h2>
    {#if metric}
      <p>{metric.description}</p>
    {/if}

    <ol>
      {#each $state.links as link}
        <li>
          <span style:color={link.properties.color}>
            {link.properties.name}
          </span>

          <Picker
            k="horiz-radio"
            bind:value={link.properties.answers[qIdx]}
            choices={questions[qIdx].choices}
          />
        </li>
      {/each}
    </ol>

    {#if metric}
      <MetricDetails {metric} />
    {/if}
  </div>

  <div slot="map">
    <ShowAllLayers
      showColor="links"
      except=""
      showMissingProperty={["at", qIdx, ["get", "answers"]]}
    />
  </div>
</SplitComponent>
