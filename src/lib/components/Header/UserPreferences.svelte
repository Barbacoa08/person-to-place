<script lang="ts">
  import SettingsIcon from "./SettingsIcon.svelte";

  // TODO: add Modal
  // let showModal = false;
</script>

<!-- <button aria-label="User Preferences" on:click={() => (showModal = true)}> -->
<button aria-label="User Preferences">
  <SettingsIcon width="1rem" height="1rem" />
</button>

<style>
  button {
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
