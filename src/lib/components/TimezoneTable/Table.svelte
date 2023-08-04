<script lang="ts">
  import { Store } from "tauri-plugin-store-api";

  import { onDestroy, onMount } from "svelte";

  import type { Preferences, TableData } from "$types/Store";
  import { StoreConsts } from "$utils";
  import { PreferencesStore } from "$utils/stores";

  import TableHeader from "./TableHeader.svelte";
  import DeleteEntry from "./DeleteEntry.svelte";
  import EditEntry from "./EditEntry.svelte";
  import SortableTh from "./SortableTH.svelte";

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
  $: sortedtabledata = filteredtabledata.sort((a, b) => {
    /*
      TODO: sort by all three options, sort by _only_ one
      option at a time, reset others when any one changes.
    */
    if (nameSorted && nameSortDirection === "asc") {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    } else if (nameSorted && nameSortDirection === "desc") {
      if (a.name < b.name) return 1;
      else if (a.name > b.name) return -1;
      else return 0;
    } else {
      return 0;
    }
  });
  let nameSorted = false;
  let nameSortDirection: "asc" | "desc" | undefined = undefined;

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

<TableHeader now={currenttime} bind:search />

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
        <SortableTh>Timezone</SortableTh>
      {/if}

      {#if preferences.showPlace}
        <SortableTh>Place</SortableTh>
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
