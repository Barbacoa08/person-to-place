<script lang="ts">
  import { Modal } from "@barbajoe/svelte-lib";
  import { toast } from "@zerodevx/svelte-toast";
  import { Store } from "tauri-plugin-store-api";

  import { guid, StoreConsts } from "$utils";
  import { SelectPlace } from "$lib/components";
  import type { TableData } from "$types/Store";

  import { InsertIcon } from "$lib/icons";

  let showModal = false;
  let name = "";
  let timezone = "";
  let notes = "";
  let place = "";

  const store = new Store(StoreConsts.path);
  const insert = async () => {
    if (!name.trim() || !timezone.trim()) {
      toast.push("Name and Timezone are required");
      return;
    }

    const data: TableData = {
      id: guid(),
      name: name.trim(),
      place: place.trim(),
      timezone: timezone.trim(),
      notes: notes.trim(),
    };
    const tabledata: TableData[] = (await store.get(StoreConsts.table)) || [];
    await store.set(StoreConsts.table, [...tabledata, data]);
    await store.save();
    toast.push("Entry Inserted");
    clearAndClose();
  };

  const clearAndClose = () => {
    name = "";
    timezone = "";
    place = "";
    notes = "";
    showModal = false;
  };
</script>

<button
  class="modal-button"
  aria-label="insert enry"
  on:click={() => (showModal = true)}
>
  <InsertIcon width="1rem" height="1rem" />
</button>

<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">Insert Entry</svelte:fragment>

  <form>
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" bind:value={name} />
    </div>

    <div>
      <SelectPlace bind:place bind:timezone />
    </div>

    <div>
      <label for="notes">Notes</label>
      <textarea id="notes" bind:value={notes} />
    </div>
  </form>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={clearAndClose}>
      cancel
    </button>

    <button class="modal-action-button" on:click={insert}> insert </button>
  </svelte:fragment>
</Modal>

<style>
  form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
