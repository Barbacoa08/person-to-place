<script lang="ts">
  import { Modal } from "@barbajoe/svelte-lib";

  import { SelectPlace } from "$lib/components";
  import { EditIcon } from "$lib/icons";
  import type { TableData } from "$types/Store";
  import { emptyPlace, type Place } from "$types/Place";

  export let row: TableData;
  export let editEntry: (updatedRow: TableData) => void;

  let showModal = false;
  $: place = { ...emptyPlace, text: row.place, value: row.timezone };
</script>

<button
  id={`edit-entry-${row.id}`}
  class="action-button"
  aria-label="edit entry"
  on:click={() => (showModal = true)}
>
  <EditIcon height="1rem" width="1rem" />
</button>

<!-- TODO: centralize Modal so that we don't generate so much HTML -->
<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">Edit Entry</svelte:fragment>

  <form>
    <div>
      <label for="edit-entry-name">Name</label>
      <input id="edit-entry-name" type="text" bind:value={row.name} />
    </div>

    <div>
      <SelectPlace id={`edit-place-${row.id}`} bind:place />
    </div>

    <div>
      <label for="edit-entry-notes">Notes</label>
      <textarea id="edit-entry-notes" bind:value={row.notes} />
    </div>
  </form>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      Cancel
    </button>

    <button
      class="modal-action-button"
      on:click={() => {
        const update = {
          ...row,
          place: place.text,
          timezone: place.value,
        };
        editEntry(update);
        showModal = false;
      }}
    >
      Update
    </button>
  </svelte:fragment>
</Modal>
