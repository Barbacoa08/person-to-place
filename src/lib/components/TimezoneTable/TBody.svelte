<script lang="ts">
  import { Modal } from "@barbajoe/svelte-lib";
  import { onDestroy } from "svelte";
  import { Store } from "tauri-plugin-store-api";

  import { SelectPlace } from "$lib/components";
  import { DeleteIcon } from "$lib/icons";
  import { EditIcon } from "$lib/icons";

  import { emptyPlace } from "$types/Place";
  import type { Preferences, TableData } from "$types/Store";
  import { StoreConsts } from "$utils";
  import { PreferencesStore } from "$utils/stores";

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

  let showModal = false;
  let modification: "Edit" | "Delete" = "Edit";
  let selectedRow: TableData = {
    id: "",
    name: "",
    place: "",
    timezone: "",
    notes: "",
  };
  $: place = {
    ...emptyPlace,
    text: selectedRow.place,
    value: selectedRow.timezone,
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
        <button
          id={`edit-entry-${row.id}`}
          class="action-button"
          aria-label="edit entry"
          on:click={() => {
            showModal = true;
            modification = "Edit";
            selectedRow = row;
          }}
        >
          <EditIcon height="1rem" width="1rem" />
        </button>

        <button
          id={`delete-entry-${row.id}`}
          class="action-button"
          aria-label="delete entry"
          on:click={() => {
            showModal = true;
            modification = "Delete";
            selectedRow = row;
          }}
        >
          <DeleteIcon height="1rem" width="1rem" />
        </button>
      </td>
    </tr>
  {/each}
</tbody>

<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">
    {modification} Entry
  </svelte:fragment>

  <form>
    <div>
      <label for="modify-entry-name">Name</label>
      <input
        disabled={modification === "Delete"}
        id="modify-entry-name"
        type="text"
        bind:value={selectedRow.name}
      />
    </div>

    <div>
      {#if modification === "Edit"}
        <SelectPlace id={`modify-place-${selectedRow.id}`} bind:place />
      {:else if modification === "Delete"}
        <label for="delete-entry-place">Place</label>
        <input
          disabled
          type="text"
          id="delete-entry-place"
          value={selectedRow.place}
        />
      {/if}
    </div>

    <div>
      <label for="modify-entry-notes">Notes</label>
      <textarea
        disabled={modification === "Delete"}
        id="modify-entry-notes"
        bind:value={selectedRow.notes}
      />
    </div>
  </form>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      Cancel
    </button>

    <button
      class="modal-action-button"
      on:click={() => {
        if (modification === "Delete") {
          deleteEntry(selectedRow.id);
        } else {
          const update = {
            ...selectedRow,
            place: place.text,
            timezone: place.value,
          };
          editEntry(update);
        }

        showModal = false;
      }}
    >
      {modification === "Delete" ? "Delete" : "Update"}
    </button>
  </svelte:fragment>
</Modal>

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
