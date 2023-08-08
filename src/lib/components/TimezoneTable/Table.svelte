<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Store } from "tauri-plugin-store-api";

  import type { TableData } from "$types/Store";
  import { StoreConsts } from "$utils";

  import TableLabel from "./TableLabel.svelte";
  import THead from "./THead.svelte";
  import TBody from "./TBody.svelte";

  // BUG: throws errors on first load

  onMount(async () => {
    tabledata = (await TauriStore.get<TableData[]>(StoreConsts.table)) || [];
  });
  onDestroy(() => {
    clearInterval(interval);
  });

  let currenttime = new Date();
  const interval = setInterval(() => (currenttime = new Date()), 10_000);

  $: search = "";
  $: filteredtabledata = tabledata.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.place.toLowerCase().includes(search.toLowerCase()) ||
      row.timezone.toLowerCase().includes(search.toLowerCase()),
  );
  let sortedtabledata: TableData[] = [];

  let tabledata: TableData[] = [];
  let TauriStore = new Store(StoreConsts.path);
  TauriStore.onChange(async (key, value: TableData[] | null) => {
    if (key === StoreConsts.table && value) {
      tabledata = value;
    }
  });
</script>

<TableLabel now={currenttime} bind:search />

<table class="thepp-table">
  <THead {filteredtabledata} bind:sortedtabledata />

  <TBody {currenttime} {sortedtabledata} {tabledata} />
</table>
