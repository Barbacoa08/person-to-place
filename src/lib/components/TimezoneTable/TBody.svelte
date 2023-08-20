<script lang="ts">
  import { onDestroy } from "svelte";
  import { Store } from "tauri-plugin-store-api";

  import type { Preferences, TableData } from "$types/Store";
  import { StoreConsts } from "$utils";
  import { PreferencesStore } from "$utils/stores";

  import DeleteEntry from "./DeleteEntry.svelte";
  import EditEntry from "./EditEntry.svelte";

  onDestroy(() => {
    unsubscribe();
  });

  export let currenttime: Date;
  export let sortedtabledata: TableData[] = [];
  export let tabledata: TableData[] = [];

  let preferences: Preferences;
  const unsubscribe = PreferencesStore.subscribe(
    (value) => (preferences = value),
  );

  let TauriStore = new Store(StoreConsts.path);
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

  /**
   * IMPROVEMENT: explore a more elegant solution. This will work for
   * small data sets, which is fine for all current usecases,
   * but it's a bit lazy all the same.
   */
  $: expanded = new Array(sortedtabledata.length).fill(false);
</script>

<tbody>
  {#each sortedtabledata as row, i}
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
        <td
          class="notes-expandable"
          class:note-expanded={expanded[i]}
          on:dblclick={() => {
            expanded[i] = !expanded[i];
          }}
        >
          {row.notes}
        </td>
      {/if}

      <td class="action-button-cell">
        <EditEntry {row} {editEntry} />

        <DeleteEntry {row} {deleteEntry} />
      </td>
    </tr>
  {/each}
</tbody>

<style>
  .notes-expandable {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition: transform 0.15s cubic-bezier(0, 0.2, 0.5, 3) 0s;

    /* show tooltip with full content on hover of this td */
    &:hover,
    &.note-expanded {
      overflow: visible;
      white-space: normal;
      transform: scale(1.02);
    }
  }
</style>
