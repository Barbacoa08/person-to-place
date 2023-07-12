<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { Store } from "tauri-plugin-store-api";

  import { onMount } from "svelte";

  import { Modal } from "$lib";
  import type { Preferences } from "$types/Store";
  import SettingsIcon from "./SettingsIcon.svelte";
  import { StoreConsts } from "$utils";

  onMount(async () => {
    preferences =
      (await store.get(StoreConsts.preferences)) ||
      ({
        locale: await invoke("current_locale"),
        showNotes: true,
        showTimezone: true,
        use24HourTime: true,
      } as Preferences);
  });

  let showModal = false;

  let preferences: Preferences;

  const store = new Store(StoreConsts.path);
  const savePreferences = async () => {
    saved = true; // optimistic update
    await store.set(StoreConsts.preferences, preferences);
    store.save();
  };

  // TODO: consider checking saved vs form data before setting saved to false
  let saved = true;
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

  <form on:change={() => (saved = false)}>
    {#if preferences}
      <label>
        <span>Locale</span>
        <input type="text" bind:value={preferences.locale} />
      </label>

      <label>
        <input type="checkbox" bind:checked={preferences.use24HourTime} />
        <span>Use 24 hour time</span>
      </label>

      <label>
        <input type="checkbox" bind:checked={preferences.showTimezone} />
        <span>Show timezone</span>
      </label>

      <label>
        <input type="checkbox" bind:checked={preferences.showNotes} />
        <span>Show notes</span>
      </label>
    {/if}
  </form>

  <div class="form-status" class:success={saved} class:error={!saved}>
    {saved ? "Data Saved" : "Unsaved Changes"}
  </div>

  <svelte:fragment slot="dialog-footer">
    <button class="modal-button" on:click={() => (showModal = false)}>
      close
    </button>

    <button class="modal-button" on:click={savePreferences}> save </button>
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

  form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  form label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  form label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
  }
  form label input[type="text"] {
    width: 100%;
  }

  .form-status {
    font-size: 2rem;
    margin-top: 0.5rem;
  }
  .form-status.success {
    color: var(--color-success-text);
  }
  .form-status.error {
    color: var(--color-error-text);
  }
</style>
