<script lang="ts">
  import Search from "svelte-search";

  let value = "";

  export let currenttime: Date;
  $: currenttime24hr = currenttime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
</script>

<div class="container">
  <Search autofocus label="Search Person or Timezone" bind:value />

  <div class="current-time">
    <div>Your current system time:</div>
    <div>{currenttime24hr}</div>
  </div>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .current-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .current-time div:first-child {
    margin-bottom: 0.5rem;
  }

  .current-time div:last-child {
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
