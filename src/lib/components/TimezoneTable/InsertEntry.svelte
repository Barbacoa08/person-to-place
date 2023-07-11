<script lang="ts">
  import { Store } from "tauri-plugin-store-api";

  import { onMount } from "svelte";

  import { guid, StoreConsts } from "$utils";
  import type { TableData } from "$types/Store";

  onMount(() => get());

  const store = new Store(StoreConsts.path);

  let name = "";
  let timezone = "";
  let notes = "";
  export let tabledata: TableData[] = [];

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
  const reset = async () => {
    await store.reset();
    store.save();
    get();
  };
</script>

<section>
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

  <div>
    <span><b>HARD</b> reset of DB:</span><button on:click={reset}>reset</button>
  </div>
</section>
