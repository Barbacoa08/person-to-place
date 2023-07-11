<script lang="ts">
  import { Modal } from "$lib";
  import SettingsIcon from "./SettingsIcon.svelte";

  let showModal = false;
</script>

<button
  class="preferences"
  aria-label="User Preferences"
  on:click={() => (showModal = true)}
>
  <SettingsIcon width="1rem" height="1rem" />
</button>

<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">User Preferences</svelte:fragment>

  <div>
    <p>TODO: add preferences</p>
  </div>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-button" on:click={() => (showModal = false)}>
      cancel
    </button>

    <button class="modal-button" on:click={() => (showModal = false)}>
      save
    </button>
  </svelte:fragment>
</Modal>

<style>
  button.preferences {
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
