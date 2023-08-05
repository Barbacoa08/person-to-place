<script lang="ts">
  import { Store } from "tauri-plugin-store-api";

  import { onDestroy, onMount } from "svelte";

  import type { Preferences, TableData } from "$types/Store";
  import { StoreConsts } from "$utils";
  import { PreferencesStore } from "$utils/stores";

  import TableLabel from "./TableLabel.svelte";
  import DeleteEntry from "./DeleteEntry.svelte";
  import EditEntry from "./EditEntry.svelte";
  import SortableTh from "./SortableTH.svelte";
  import { tableSort } from "./utils";

  onMount(async () => {
    tabledata = (await TauriStore.get<TableData[]>(StoreConsts.table)) || [];
  });
  onDestroy(() => {
    clearInterval(interval);
    unsubscribe();
  });

  let currenttime = new Date();
  const interval = setInterval(() => (currenttime = new Date()), 10_000);

  $: search = "";
  $: filteredtabledata = tabledata.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.place.toLowerCase().includes(search.toLowerCase()) ||
      row.timezone.toLowerCase().includes(search.toLowerCase()),
  );
  $: sortedtabledata = sortData(
    [...filteredtabledata],
    sortCriteria,
    sortDirection,
  );

  type SortDirection = "asc" | "desc" | undefined;
  let nameSorted = false;
  let nameSortDirection: SortDirection = undefined;
  let timezoneSorted = false;
  let timezoneSortDirection: SortDirection = undefined;
  let placeSorted = false;
  let placeSortDirection: SortDirection = undefined;

  type SortCriteria = "name" | "timezone" | "place" | undefined;
  let sortCriteria: SortCriteria;
  $: if (nameSorted) {
    sortCriteria = "name";
  }
  $: if (timezoneSorted) {
    sortCriteria = "timezone";
  }
  $: if (placeSorted) {
    sortCriteria = "place";
  }

  $: sortDirection =
    nameSortDirection || timezoneSortDirection || placeSortDirection;

  const sortData = (
    data: TableData[],
    criteria: SortCriteria,
    dir: SortDirection,
  ): TableData[] => {
    switch (criteria) {
      case "name":
        timezoneSorted = false;
        placeSorted = false;
        return data.sort((a, b) => tableSort(a, b, "name", dir));
      case "timezone":
        nameSorted = false;
        placeSorted = false;
        return data.sort((a, b) => tableSort(a, b, "timezone", dir));
      case "place":
        nameSorted = false;
        timezoneSorted = false;
        return data.sort((a, b) => tableSort(a, b, "place", dir));
      default:
        // NOTE: this should only be hit on initial load
        return data;
    }
  };

  // bound variables
  let tabledata: TableData[] = [];
  let preferences: Preferences;
  const unsubscribe = PreferencesStore.subscribe(
    (value) => (preferences = value),
  );

  let TauriStore = new Store(StoreConsts.path);
  TauriStore.onChange(async (key, value: TableData[] | null) => {
    if (key === StoreConsts.table && value) {
      tabledata = value;
    }
  });

  const editEntry = async (updatedRow: TableData) => {
    tabledata = tabledata.filter((row) => row.id !== updatedRow.id);
    await TauriStore.set(StoreConsts.table, [...tabledata, updatedRow]);
    await TauriStore.save();
  };
  const deleteEntry = async (id: string) => {
    tabledata = tabledata.filter((row) => row.id !== id);
    await TauriStore.set(StoreConsts.table, tabledata);
    await TauriStore.save();
  };
</script>

<TableLabel now={currenttime} bind:search />

<table class="thepp-table">
  <thead>
    <tr>
      <SortableTh
        bind:sorted={nameSorted}
        bind:sortDirection={nameSortDirection}
      >
        Name
      </SortableTh>

      <th>Currently</th>

      {#if preferences.showTimezone}
        <SortableTh
          bind:sorted={timezoneSorted}
          bind:sortDirection={timezoneSortDirection}
        >
          Timezone
        </SortableTh>
      {/if}

      {#if preferences.showPlace}
        <SortableTh
          bind:sorted={placeSorted}
          bind:sortDirection={placeSortDirection}
        >
          Place
        </SortableTh>
      {/if}

      {#if preferences.showNotes}
        <th>Notes</th>
      {/if}

      <th />
    </tr>
  </thead>

  <tbody>
    {#each sortedtabledata as row}
      <tr>
        <td>{row.name}</td>

        <td>
          {currenttime.toLocaleString(preferences.locale, {
            timeZone: row.timezone,
            hour: "numeric",
            minute: "numeric",
            day: preferences.showDate ? "2-digit" : undefined,
            month: preferences.showDate ? "long" : undefined,
            hour12: !preferences.use24HourTime,
          })}
        </td>

        {#if preferences.showTimezone}
          <td>{row.timezone}</td>
        {/if}

        {#if preferences.showPlace}
          <td>{row.place}</td>
        {/if}

        {#if preferences.showNotes}
          <td class="notes-expandable">{row.notes}</td>
        {/if}

        <td class="action-button-cell">
          <EditEntry {row} {editEntry} />

          <DeleteEntry {row} {deleteEntry} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .notes-expandable {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition: transform 0.15s cubic-bezier(0, 0.2, 0.5, 3) 0s;

    /* show tooltip with full content on hover of this td */
    &:hover {
      overflow: visible;
      white-space: normal;
      transform: scale(1.02);
    }
  }
</style>
