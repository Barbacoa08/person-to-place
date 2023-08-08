<script lang="ts">
  import { Modal } from "@barbajoe/svelte-lib";
  import { toast } from "@zerodevx/svelte-toast";
  import { Store } from "tauri-plugin-store-api";

  import { guid, StoreConsts } from "$utils";
  import { SelectPlace } from "$lib/components";
  import type { TableData } from "$types/Store";
  import { emptyPlace, type Place } from "$types/Place";

  import { InsertIcon } from "$lib/icons";

  let showModal = false;
  let name = "";
  let notes = "";
  let place: Place = { ...emptyPlace };

  const store = new Store(StoreConsts.path);
  const insert = async () => {
    if (!name.trim() || !place.text.trim()) {
      toast.push("Name and Place are required");
      return;
    }

    const data: TableData = {
      id: guid(),
      name: name.trim(),
      place: place.text.trim(),
      timezone: place.timezone.trim(),
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
    place = { ...emptyPlace };
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
      <SelectPlace bind:place />
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
