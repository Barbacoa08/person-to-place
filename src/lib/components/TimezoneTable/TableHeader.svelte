<script lang="ts">
  import Search from "svelte-search";

  import SearchIcon from "./SearchIcon.svelte";

  export let currenttime: Date;

  export let search = "";

  // TODO: get locale from user/browser/system
  $: currenttime24hr = currenttime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
</script>

<div class="container">
  <div class="table-search">
    <SearchIcon class="table-search-input-icon" />
    <Search autofocus label="Search Person or Timezone" bind:value={search} />
  </div>

  <div class="current-time">
    <div>Your current system time:</div>
    <div>{currenttime24hr}</div>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
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

  :global(.table-search [data-svelte-search] input) {
    width: calc(100% - 5rem);
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
  }
  :global(.table-search [data-svelte-search] input[type="search"]) {
    padding-left: 2rem;
  }
  :global(.table-search .table-search-input-icon) {
    position: absolute;
    margin: 1.9rem 0 0 0.4rem;
    color: var(--border-color-gray);
  }
</style>
