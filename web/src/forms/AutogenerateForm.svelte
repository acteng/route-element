<script lang="ts">
  import humanizeString from "humanize-string";
  import { slide } from "svelte/transition";
  import {
    isBarewordEnumCase,
    isCheckbox,
    isEnum,
    isNumber,
    isOneLiner,
    isStruct,
    isTextbox,
    type Field,
  } from "./types";

  // This component creates a form to collect the property described by spec, and put the result in value
  export let spec: Field;
  // value's type depends on the Field. It's too difficult to express.
  export let value: any;

  // Blank out initial values if needed
  let oneOfCase = "";
  if (isStruct(spec)) {
    value ||= {};
    for (let member of spec.members) {
      if (isOneLiner(member) || isTextbox(member)) {
        value[member.name] ||= "";
      } else if (isCheckbox(member)) {
        value[member.name] ||= false;
      } else {
        value[member.name] ||= {};
      }
    }
  } else if (isEnum(spec)) {
    value ||= {};
    if (isBarewordEnumCase(value)) {
      oneOfCase = value;
    } else {
      oneOfCase = Object.keys(value)[0] || "";
    }
  }

  function stringOneOf() {
    value = oneOfCase;
  }
  function otherOneOf() {
    value = {};
    value[oneOfCase] = {};
  }
</script>

{#if spec.description}
  <p>{spec.description}</p>
{/if}

{#if isStruct(spec)}
  <div>
    <h4>{humanizeString(spec.name)}</h4>
    {#each spec.members as x}
      <svelte:self spec={x} bind:value={value[x.name]} />
    {/each}
  </div>
{:else if isEnum(spec)}
  <div>
    <h4>{humanizeString(spec.name)}</h4>

    {#each spec.oneOf as x}
      {#if isBarewordEnumCase(x)}
        <label>
          <input
            type="radio"
            bind:group={oneOfCase}
            on:change={stringOneOf}
            value={x}
          />
          {x}
          <br />
        </label>
      {:else}
        <label>
          <input
            type="radio"
            bind:group={oneOfCase}
            on:change={otherOneOf}
            value={x.name}
          />
          {x.name}
          <br />
        </label>

        {#if oneOfCase == x.name && typeof value == "object"}
          <div transition:slide={{ duration: 500 }}>
            <svelte:self spec={x} bind:value={value[x.name]} />
          </div>
        {/if}
      {/if}
    {/each}
  </div>
{:else if isNumber(spec)}
  <label>
    {spec.name}:
    <input type="number" bind:value style="width: 30%" />
  </label>
{:else if isOneLiner(spec)}
  <label>
    {spec.name}
    <input type="text" bind:value />
  </label>
{:else if isTextbox(spec)}
  <label>
    {spec.name}
    <textarea bind:value />
  </label>
{:else if isCheckbox(spec)}
  <label>
    <input type="checkbox" bind:checked={value} />
    {spec.name}
  </label>
{/if}

<style>
  div {
    border: solid 1px black;
    padding: 10px;
  }
</style>
