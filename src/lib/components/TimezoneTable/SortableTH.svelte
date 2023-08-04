<script lang="ts">
  import { ChevronDown, ChevronUp, ChevronUpDown } from "$lib/icons";

  export let sorted: boolean = false;
  export let sortDirection: "asc" | "desc" | undefined = undefined;
</script>

<th
  on:click={() => {
    if (!sorted) {
      sortDirection = "asc";
      sorted = true;
    } else if (sortDirection === "asc") {
      sortDirection = "desc";
      sorted = true;
    } else if (sortDirection === "desc") {
      sortDirection = undefined;
      sorted = false;
    }
  }}
>
  <div class="sortable">
    <slot />

    {#if sorted}
      {#if sortDirection === "desc"}
        <ChevronUp height="1rem" />
      {:else if sortDirection === "asc"}
        <ChevronDown height="1rem" style="align-self: end" />
      {/if}
    {:else}
      <ChevronUpDown />
    {/if}
  </div>
</th>
