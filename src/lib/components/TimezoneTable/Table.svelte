<script lang="ts">
  import { Store } from "tauri-plugin-store-api";

  import { onDestroy, onMount } from "svelte";

  import { StoreConsts } from "$utils";
  import { PreferencesStore } from "$utils/stores";
  import type { Preferences, TableData } from "$types/Store";

  import TableHeader from "./TableHeader.svelte";

  onMount(async () => {
    tabledata = (await TauriStore.get<TableData[]>(StoreConsts.table)) || [];
  });
  onDestroy(() => {
    clearInterval(interval);
    unsubscribe();
  });

  let currenttime = new Date();
  const interval = setInterval(() => (currenttime = new Date()), 60_000);

  $: search = "";
  $: filteredtabledata = tabledata.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  // bound variables
  let tabledata: TableData[] = [];
  let preferences: Preferences;
  const unsubscribe = PreferencesStore.subscribe(
    (value) => (preferences = value)
  );

  let TauriStore = new Store(StoreConsts.path);
  TauriStore.onChange(async (key, value: TableData[] | null) => {
    if (key === StoreConsts.table && value) {
      tabledata = value;
    }
  });
</script>

<TableHeader now={currenttime} bind:search />

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Currently</th>
      {#if preferences.showTimezone}
        <th>Timezone</th>
      {/if}
      {#if preferences.showNotes}
        <th>Notes</th>
      {/if}
    </tr>
  </thead>

  <tbody>
    {#each filteredtabledata as row}
      <tr>
        <td>{row.name}</td>

        <td>
          {currenttime.toLocaleString(preferences.locale, {
            timeZone: row.timezone,
            hour: "numeric",
            minute: "numeric",
            day: "2-digit",
            month: "long",
            hour12: !preferences.use24HourTime,
          })}
        </td>

        {#if preferences.showTimezone}
          <td>{row.timezone}</td>
        {/if}

        {#if preferences.showNotes}
          <td class="limitcolumnwidth">{row.notes}</td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1rem;
  }
  table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .limitcolumnwidth {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* show tooltip with full content on hover of this td */
  .limitcolumnwidth:hover {
    overflow: visible;
    white-space: normal;
    background-color: var(--color-bg-accent);
  }
</style>
