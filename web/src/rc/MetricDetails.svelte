<script lang="ts">
  import { type Metric } from "./metrics";

  export let metric: Metric;
</script>

<p>
  <b>2</b>
  : {metric.green}
</p>
<p>
  <b>1</b>
  : {metric.amber}
</p>
<p>
  <b>0</b>
  : {metric.red}
</p>
<p>
  <b>Critical</b>
  : {metric.critical}
</p>
