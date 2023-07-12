<script lang="ts">
  import { onDestroy } from "svelte";

  import TableHeader from "./TableHeader.svelte";
  import InsertEntry from "./InsertEntry.svelte";
  import type { TableData } from "$types/Store";

  onDestroy(() => clearInterval(interval));

  let currenttime = new Date();
  const interval = setInterval(() => (currenttime = new Date()), 60_000);

  $: search = "";
  $: filteredtabledata = tabledata.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  let tabledata: TableData[] = [];

  // TODO: replace all "en-US" with stored locale preference
  // and all other preferences
</script>

<InsertEntry bind:tabledata />

<TableHeader now={currenttime} bind:search />

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Currently</th>
      <th>Notes</th>
    </tr>
  </thead>

  <tbody>
    {#each filteredtabledata as row}
      <tr>
        <td>{row.name}</td>

        <td>
          {currenttime.toLocaleString("en-US", {
            timeZone: row.timezone,
            hour: "numeric",
            minute: "numeric",
            day: "2-digit",
            month: "long",
            hour12: false,
          })}
        </td>

        <td class="limitcolumnwidth">{row.notes}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1rem;
  }
  table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .limitcolumnwidth {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* show tooltip with full content on hover of this td */
  .limitcolumnwidth:hover {
    overflow: visible;
    white-space: normal;
    background-color: var(--color-bg-accent);
  }
</style>
