<script lang="ts">
  import { Modal } from "@barbajoe/svelte-lib";

  import { SelectPlace } from "$lib/components";
  import { EditIcon } from "$lib/icons";
  import type { TableData } from "$types/Store";

  export let row: TableData;
  export let editEntry: (updatedRow: TableData) => void;

  let showModal = false;
  $: updatedRow = row;
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
      <input id="edit-entry-name" type="text" bind:value={updatedRow.name} />
    </div>

    <div>
      <SelectPlace
        bind:place={updatedRow.place}
        bind:timezone={updatedRow.timezone}
      />
    </div>

    <div>
      <label for="edit-entry-notes">Notes</label>
      <textarea id="edit-entry-notes" bind:value={updatedRow.notes} />
    </div>
  </form>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      Cancel
    </button>

    <button
      class="modal-action-button"
      on:click={() => {
        editEntry(updatedRow);
        showModal = false;
      }}
    >
      Update
    </button>
  </svelte:fragment>
</Modal>
