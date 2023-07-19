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
  const set = async (name: string, timezone: string, notes = "") => {
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
  class="insert"
  aria-label="insert enry"
  on:click={() => (showModal = true)}
>
  <InsertIcon width="1rem" height="1rem" />
</button>

<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">Insert Entry</svelte:fragment>

  <div>
    <label for="name">Name</label>
    <input id="name" type="text" bind:value={name} />
  </div>
  <div>
    <label for="timezone">Timezone</label>
    <input id="timezone" type="text" bind:value={timezone} />
  </div>
  <div>
    <label for="notes">Notes</label>
    <textarea id="notes" bind:value={notes} />
  </div>

  <div>
    <button on:click={() => set(name, timezone, notes)}>add</button>
  </div>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      close
    </button>

    <button
      class="modal-action-button"
      on:click={() => set(name, timezone, notes)}
    >
      save
    </button>
  </svelte:fragment>
</Modal>

<style>
  button.insert {
    color: var(--color-link-text);
    background: none;
    cursor: pointer;

    display: flex;
    align-items: center;

    border: 1px solid var(--color-link-text);
    padding: 0.3rem 0.5rem;
    border-radius: 0.5rem;
  }
</style>
