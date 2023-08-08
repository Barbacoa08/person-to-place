<script lang="ts">
  import type { Preferences, TableData } from "$types/Store";
  import { PreferencesStore } from "$utils/stores";
  import { onDestroy } from "svelte";

  import SortableTh from "./SortableTH.svelte";
  import { tableSort } from "./utils";

  onDestroy(() => {
    unsubscribe();
  });

  let preferences: Preferences;
  const unsubscribe = PreferencesStore.subscribe(
    (value) => (preferences = value),
  );

  export let filteredtabledata: TableData[] = [];
  export let sortedtabledata: TableData[] = [];

  $: sortData([...filteredtabledata], sortCriteria, sortDirection);

  type SortDirection = "asc" | "desc" | undefined;
  let nameSorted = false;
  let nameSortDirection: SortDirection = undefined;
  let timezoneSorted = false;
  let timezoneSortDirection: SortDirection = undefined;
  let placeSorted = false;
  let placeSortDirection: SortDirection = undefined;

  type SortCriteria = "name" | "timezone" | "place" | undefined;
  let sortCriteria: SortCriteria;
  $: if (nameSorted) {
    sortCriteria = "name";
  }
  $: if (timezoneSorted) {
    sortCriteria = "timezone";
  }
  $: if (placeSorted) {
    sortCriteria = "place";
  }

  $: sortDirection =
    nameSortDirection || timezoneSortDirection || placeSortDirection;

  const sortData = (
    data: TableData[],
    criteria: SortCriteria,
    dir: SortDirection,
  ) => {
    switch (criteria) {
      case "name":
        timezoneSorted = false;
        placeSorted = false;
        data.sort((a, b) => tableSort(a, b, "name", dir));
        break;
      case "timezone":
        nameSorted = false;
        placeSorted = false;
        data.sort((a, b) => tableSort(a, b, "timezone", dir));
        break;
      case "place":
        nameSorted = false;
        timezoneSorted = false;
        data.sort((a, b) => tableSort(a, b, "place", dir));
        break;
    }

    sortedtabledata = data;
  };

  // TODO: save sort criteria and direction in store
</script>

<thead>
  <tr>
    <SortableTh bind:sorted={nameSorted} bind:sortDirection={nameSortDirection}>
      Name
    </SortableTh>

    <th>Currently</th>

    {#if preferences.showTimezone}
      <SortableTh
        bind:sorted={timezoneSorted}
        bind:sortDirection={timezoneSortDirection}
      >
        Timezone
      </SortableTh>
    {/if}

    {#if preferences.showPlace}
      <SortableTh
        bind:sorted={placeSorted}
        bind:sortDirection={placeSortDirection}
      >
        Place
      </SortableTh>
    {/if}

    {#if preferences.showNotes}
      <th>Notes</th>
    {/if}

    <th />
  </tr>
</thead>
