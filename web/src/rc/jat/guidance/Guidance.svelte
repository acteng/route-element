<script lang="ts">
  import { Modal } from "svelte-utils";
  import Picker from "../../Picker.svelte";
  import { getGuidance, getMovementTypes, junctionTypes } from "./data";

  let open = false;

  let junctionType = junctionTypes[0];
  let movementType = getMovementTypes(junctionType)[0];

  function resetMovementType() {
    movementType = getMovementTypes(junctionType)[0];
  }
</script>

<button class="secondary" on:click={() => (open = true)}>
  LTN 1/20 scoring guidance
</button>

{#if open}
  <Modal on:close={() => (open = false)}>
    <h1>LTN 1/20 scoring guidance</h1>
    <p>
      Guidance from <a
        target="_blank"
        href="https://assets.publishing.service.gov.uk/media/5ffa1f96d3bf7f65d9e35825/cycle-infrastructure-design-ltn-1-20.pdf"
      >
        LTN 1/20 appendix B
      </a>
      .
    </p>

    <div style="display: flex; justify-content: space-between">
      <Picker
        k="vert-radio"
        bind:value={junctionType}
        on:change={resetMovementType}
        choices={junctionTypes}
      >
        Type of junction
      </Picker>

      {#key junctionType}
        <Picker
          k="vert-radio"
          bind:value={movementType}
          choices={getMovementTypes(junctionType)}
        >
          Type of movement
        </Picker>
      {/key}
    </div>

    <table>
      <tr>
        <th class="type-header">Type of junction and movement</th>
        <th class="score-zero-header">
          <p><b>Score = 0</b></p>
          <p>
            Suitable only for confident existing cyclists, and may be avoided by
            some experienced cyclists
          </p>
          <p>
            Conditions are most likely to give rise to the most common collision
            types
          </p>
        </th>
        <th class="score-one-header">
          <p><b>Score = 1</b></p>
          <p>
            Likely to be more acceptable to most cyclists, but may still pose
            problems for less confident or new cyclists
          </p>
          <p>
            The risk of collisions has been reduced by design layout or traffic
            management interventions
          </p>
        </th>
        <th class="score-two-header">
          <p><b>Score = 2</b></p>
          <p>Suitable for all potential and existing cyclists</p>
          <p>
            The potential for collisions has been removed, or managed to a high
            standard of safety for cyclists
          </p>
        </th>
      </tr>

      {#each getGuidance(junctionType, movementType) as row}
        <tr>
          <td class="type-row">
            {row.junctionType}
            <br />
            <br />
            {row.movementType}
          </td>
          <td class="score-zero">
            <ul>
              {#each row.scoreZero as x}
                <li>{x}</li>
              {/each}
            </ul>
          </td>
          <td class="score-one">
            <ul>
              {#each row.scoreOne as x}
                <li>{x}</li>
              {/each}
            </ul>
          </td>
          <td class="score-two">
            <ul>
              {#each row.scoreTwo as x}
                <li>{x}</li>
              {/each}
            </ul>
          </td>
        </tr>
      {/each}
    </table>

    <button on:click={() => (open = false)}>OK</button>
  </Modal>
{/if}

<style>
  th,
  th > p {
    color: white;
  }
  .type-header {
    background-color: #287f6f;
  }
  .score-zero-header {
    background-color: #e40521;
  }
  .score-one-header {
    background-color: #c89213;
  }
  .score-two-header {
    background-color: #61a730;
  }

  .type-row {
    background-color: #cfdbd7;
  }
  .score-zero {
    background-color: #fbd9ce;
  }
  .score-one {
    background-color: #f5e8d3;
  }
  .score-two {
    background-color: #e5edd8;
  }

  td,
  th {
    padding: 0.25em;
  }
</style>
