<script lang="ts">
  import type { Link } from "./state";

  export let f: Link;
</script>

<label>
  Question 1
  <select bind:value={f.properties.q1}>
    <option value=""></option>
    <option value="a">A</option>
    <option value="b">B</option>
  </select>
</label>

<label>
  Question 2
  <select bind:value={f.properties.q2}>
    <option value=""></option>
    <option value="c">C</option>
    <option value="d">D</option>
  </select>
</label>

<label>
  Question 3
  <input type="number" bind:value={f.properties.q3} />
</label>
