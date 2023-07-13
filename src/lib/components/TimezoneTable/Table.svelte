<script lang="ts">
  import { onDestroy } from "svelte";

  import type { Preferences, TableData } from "$types/Store";
  import { PreferencesStore } from "$utils/stores";

  import TableHeader from "./TableHeader.svelte";
  import InsertEntry from "./InsertEntry.svelte";

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
</script>

<InsertEntry bind:tabledata />

<TableHeader now={currenttime} bind:search />

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Currently</th>
      <th>Notes</th>
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
            hour12: preferences.use24HourTime,
          })}
        </td>

        <td class="limitcolumnwidth">{row.notes}</td>
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
