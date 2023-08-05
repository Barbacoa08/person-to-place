<script lang="ts">
  import { onDestroy } from "svelte";
  import Search from "svelte-search";

  import { SearchIcon } from "$lib/icons";
  import type { Preferences } from "$types/Store";
  import { PreferencesStore } from "$utils";

  onDestroy(() => unsubscribe());

  export let now: Date;
  export let search = "";

  let preferences: Preferences;
  const unsubscribe = PreferencesStore.subscribe(
    (value) => (preferences = value),
  );
  $: currenttime = now.toLocaleString(preferences.locale, {
    hour: "numeric",
    minute: "numeric",
    hour12: !preferences.use24HourTime,
  });
</script>

<div class="container">
  <div class="table-search">
    <SearchIcon class="table-search-input-icon" />
    <Search
      autofocus
      label="Search Person, Place, or Timezone"
      bind:value={search}
    />
  </div>

  <div class="current-time">
    <div>Your current system time:</div>
    <div>{currenttime}</div>
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

  .table-search {
    min-width: 310px;
  }

  :global(.table-search [data-svelte-search] label) {
    margin: 0;
    font-size: larger;
  }
  :global(.table-search [data-svelte-search] input) {
    margin: 0;
  }
  :global(.table-search [data-svelte-search] input[type="search"]) {
    padding-left: 2rem;
  }
  :global(.table-search .table-search-input-icon) {
    position: absolute;
    margin: 4rem 0 0 0.4rem;
    color: var(--border-color-gray);
  }
</style>
