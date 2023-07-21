<script lang="ts">
  import { rawTimeZones } from "@vvo/tzdb";
  import { toast } from "@zerodevx/svelte-toast";
  import { Store } from "tauri-plugin-store-api";

  import { onMount } from "svelte";

  import { guid, StoreConsts } from "$utils";
  import { Modal } from "$lib";
  import type { TableData } from "$types/Store";

  import InsertIcon from "./InsertIcon.svelte";

  onMount(async () => {
    tabledata = (await store.get(StoreConsts.table)) || [];
  });

  let showModal = false;
  let tabledata: TableData[] = [];
  let name = "";
  let timezone = "";
  let notes = "";

  const store = new Store(StoreConsts.path);
  const insert = async (name: string, timezone: string, notes = "") => {
    if (!name.trim() || !timezone.trim()) {
      toast.push("Name and Timezone are required");
      return;
    }

    const data: TableData = {
      id: guid(),
      name: name.trim(),
      timezone: timezone.trim(),
      notes: notes.trim(),
    };
    tabledata.push(data);
    await store.set(StoreConsts.table, tabledata);
    await store.save();
    toast.push("Entry Inserted");
    clearAndClose();
  };

  const clearAndClose = () => {
    name = "";
    timezone = "";
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
      <label for="timezone">Timezone</label>
      <select id="timezone" bind:value={timezone}>
        {#each rawTimeZones as tz}
          <option value={tz.name}>
            {tz.abbreviation}: {tz.alternativeName} ({tz.name})
          </option>
        {/each}
      </select>
      <div class="helper-text">
        TODO: allow user to enter timezone or place and select from valid
        options
      </div>
    </div>
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" bind:value={name} />
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
