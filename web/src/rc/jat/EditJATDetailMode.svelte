<script lang="ts">
  import { tick } from "svelte";
  import { CircleLayer, GeoJSON } from "svelte-maplibre";
  import { SplitComponent } from "svelte-utils/two_column_layout";
  import ShowAllLayers from "../ShowAllLayers.svelte";
  import { mode as appMode, gj, state } from "../state";
  import ClickableCard from "./ClickableCard.svelte";
  import { colors } from "./colors";
  import Form from "./Form.svelte";
  import { generateMovements } from "./generate";
  import MapControls from "./MapControls.svelte";
  import { describeScore } from "./score";

  export let junctionIdx: number;

  type Mode =
    | { mode: "select" }
    | { mode: "editing"; id: ID }
    | { mode: "new-arm" }
    | { mode: "new-movement" };
  type Kind = "arm" | "movement";
  type ID = { kind: Kind; idx: number };

  let mode: Mode = { mode: "select" };
  // When changing to a form, preserve the list position and restore later
  // TODO Some of this could be in Mode
  let preserveListScroll: number | null = null;
  let hoveringSidebar: ID | null = null;
  let sidebar: HTMLDivElement;

  async function select(id: ID) {
    preserveListScroll = sidebar.scrollTop;
    mode = { mode: "editing", id };
    hoveringSidebar = null;
    // Scroll to the top of the form, which can be long for movements
    await tick();
    sidebar.scrollTop = 0;
  }

  async function stopEditing() {
    mode = { mode: "select" };
    if (preserveListScroll != null) {
      await tick();
      sidebar.scrollTop = preserveListScroll;
      preserveListScroll = null;
    }
  }

  function armLabel(idx: number): string {
    return String.fromCharCode(idx + "A".charCodeAt(0));
  }

  function deleteItem() {
    if (mode.mode != "editing") {
      return;
    }
    // TODO Modal
    if (!window.confirm(`Delete this ${mode.id.kind}?`)) {
      return;
    }
    if (mode.id.kind == "movement") {
      $state.jats[junctionIdx].properties.details.movements.splice(
        mode.id.idx,
        1,
      );
      $state.jats[junctionIdx].properties.details.movements =
        $state.jats[junctionIdx].properties.details.movements;
    } else {
      $state.jats[junctionIdx].properties.details.arms.splice(mode.id.idx, 1);
      $state.jats[junctionIdx].properties.details.arms =
        $state.jats[junctionIdx].properties.details.arms;
    }
    stopEditing();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (mode.mode != "editing") {
      return;
    }
    let tag = (e.target as HTMLElement).tagName;
    let formFocused = tag == "INPUT" || tag == "TEXTAREA";

    if (e.key == "Escape" || (e.key == "Enter" && !formFocused)) {
      e.stopPropagation();
      stopEditing();
    } else if (e.key == "Delete" && !formFocused) {
      e.stopPropagation();
      deleteItem();
    }
  }

  let scoreColors = {
    0: colors.red,
    1: colors.amber,
    2: colors.green,
    X: colors.critical,
  };

  function autogenerateMovements() {
    if (
      $state.jats[junctionIdx].properties.details.movements.length > 0 &&
      !window.confirm(`Overwrite all cycling movements?`)
    ) {
      return;
    }
    let ww = $state.jats[junctionIdx].properties.details.movements.filter(
      (m) => m.kind == "walking & wheeling",
    );
    $state.jats[junctionIdx].properties.details.movements = [
      ...ww,
      ...generateMovements($state.jats[junctionIdx].properties.details.arms),
    ];
  }

  // Capitalise the first letter of each word
  function capitaliseWords(words: string): string {
    return words
      .split(" ")
      .map((word) =>
        word.length > 0 ? word[0].toUpperCase() + word.substr(1) : word,
      )
      .join(" ");
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<SplitComponent>
  <div slot="sidebar" bind:this={sidebar}>
    <h2>JAT for {$state.jats[junctionIdx].properties.name}</h2>

    {#if mode.mode != "editing"}
      <button
        on:click={() => ($appMode = { kind: "edit-jat", idx: junctionIdx })}
      >
        Done
      </button>

      <h3>Arms</h3>
      {#each $state.jats[junctionIdx].properties.details.arms as arm, idx}
        <ClickableCard
          name={`${armLabel(idx)} - ${arm.name || "Unnamed arm"}`}
          on:click={() => select({ kind: "arm", idx })}
          on:mouseenter={() => (hoveringSidebar = { kind: "arm", idx })}
          on:mouseleave={() => (hoveringSidebar = null)}
          hasSlot={false}
        />
      {/each}

      <h3>Movements</h3>
      <p>
        Total JAT score
        <i>{$state.jats[junctionIdx].properties.name}</i>
        : {describeScore($state.jats[junctionIdx].properties.details)}
      </p>
      <button
        class="secondary"
        on:click={autogenerateMovements}
        disabled={$state.jats[junctionIdx].properties.details.arms.length < 2}
      >
        Generate cycling movements between all arms
      </button>
      {#each $state.jats[junctionIdx].properties.details.movements as movement, idx}
        {@const color = scoreColors[movement.score]}
        <ClickableCard
          name={movement.name || "Unnamed movement"}
          on:click={() => select({ kind: "movement", idx })}
          on:mouseenter={() => (hoveringSidebar = { kind: "movement", idx })}
          on:mouseleave={() => (hoveringSidebar = null)}
        >
          <div
            style="width: 100%; display: flex; justify-content: space-between"
          >
            <span
              style="padding: 4px; color: {color.font}; background-color: {color.background}"
            >
              Score: {movement.score}
            </span>
            <span>{capitaliseWords(movement.kind)}</span>
          </div>
        </ClickableCard>
      {/each}
    {:else if mode.id.kind == "movement"}
      <Form {junctionIdx} idx={mode.id.idx} />
      <button on:click={stopEditing}>Save</button>
      <button on:click={deleteItem}>Delete</button>
    {:else}
      <button on:click={() => (mode = { mode: "select" })}>Done</button>
      <button on:click={deleteItem}>Delete</button>

      <label>
        Arm name
        <input
          type="text"
          bind:value={$state.jats[junctionIdx].properties.details.arms[
            mode.id.idx
          ].name}
        />
      </label>
    {/if}
  </div>

  <div slot="map">
    <ShowAllLayers except="jats" />

    <GeoJSON data={gj($state.jats)} generateId>
      <CircleLayer
        filter={["!=", ["id"], junctionIdx]}
        paint={{
          "circle-color": "rgba(0,0,0,0)",
          "circle-stroke-width": 5,
          "circle-stroke-color": "black",
          "circle-radius": 20,
        }}
      />
    </GeoJSON>

    <MapControls
      {junctionIdx}
      {mode}
      {hoveringSidebar}
      {select}
      {stopEditing}
    />
  </div>
</SplitComponent>
