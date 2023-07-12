<script>
  export let saved = false;
</script>

<div class={saved ? "saved" : "unsaved"}>
  {#if saved}
    Data Saved
  {:else}
    Unsaved Changes
  {/if}
</div>

<style>
  div {
    margin-top: 0.5rem;
    font-size: var(--font-size-lg);
    border-radius: 4px;
    padding: 10px;
    color: #002738;
  }

  .saved {
    background-color: #c7e5c1;
  }

  .unsaved {
    background-color: #ffe8cc;
  }
</style>
