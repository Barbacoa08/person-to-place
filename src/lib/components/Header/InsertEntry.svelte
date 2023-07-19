<script lang="ts">
  import { Store } from "tauri-plugin-store-api";

  import { onMount } from "svelte";

  import { guid, StoreConsts } from "$utils";
  import type { TableData } from "$types/Store";
  import { Modal } from "$lib";
  import InsertIcon from "./InsertIcon.svelte";

  onMount(() => get());

  export let tabledata: TableData[] = [];

  let showModal = false;
  let name = "";
  let timezone = "";
  let notes = "";

  const store = new Store(StoreConsts.path);
  const insert = async (name: string, timezone: string, notes = "") => {
    const data: TableData = {
      id: guid(),
      name: name.trim(),
      timezone: timezone.trim(),
      notes: notes.trim(),
    };
    tabledata.push(data);
    await store.set(StoreConsts.table, tabledata);
    store.save();
    get();
  };

  const get = async () => {
    tabledata = (await store.get(StoreConsts.table)) || [];
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
      <label for="timezone">Timezone</label>
      <input id="timezone" type="text" bind:value={timezone} />
      <div style="font-size: small;">
        TODO: allow user to enter timezone or place and select from valid
        options
      </div>
    </div>
    <div>
      <label for="notes">Notes</label>
      <textarea id="notes" bind:value={notes} />
    </div>
  </form>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      cancel
    </button>

    <button
      class="modal-action-button"
      on:click={() => insert(name, timezone, notes)}
    >
      insert
    </button>
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
