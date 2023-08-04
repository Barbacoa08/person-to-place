<script lang="ts">
  import { Modal } from "@barbajoe/svelte-lib";

  import { DeleteIcon } from "$lib/icons";
  import type { TableData } from "$types/Store";

  export let row: TableData;
  export let deleteEntry: (id: string) => void;

  let showModal = false;
</script>

<button
  class="action-button"
  aria-label="delete entry"
  on:click={() => (showModal = true)}
>
  <DeleteIcon height="1rem" width="1rem" />
</button>

<!-- TODO: centralize Modal so that we don't generate so much HTML -->
<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">Delete Entry</svelte:fragment>

  <p>Are you sure you want to delete "{row.name}"?</p>

  <form>
    <div>
      <label for="delete-entry-name">Name</label>
      <input disabled type="text" id="delete-entry-name" value={row.name} />
    </div>

    <div>
      <label for="delete-entry-place">Place</label>
      <input disabled type="text" id="delete-entry-place" value={row.place} />
    </div>

    {#if row.notes}
      <div>
        <label for="delete-entry-notes">Notes</label>
        <textarea disabled id="delete-entry-notes" value={row.notes} />
      </div>
    {/if}
  </form>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      Cancel
    </button>

    <button
      class="modal-action-button"
      on:click={() => {
        deleteEntry(row.id);
        showModal = false;
      }}
    >
      Delete
    </button>
  </svelte:fragment>
</Modal>
