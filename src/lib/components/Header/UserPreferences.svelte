<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { Store } from "tauri-plugin-store-api";

  import { onMount } from "svelte";

  import { Modal } from "$lib";
  import type { Preferences } from "$types/Store";
  import SettingsIcon from "./SettingsIcon.svelte";
  import { StoreConsts } from "$utils";
  import SaveStatus from "./SaveStatus.svelte";

  onMount(async () => {
    try {
      const result = await store.get<Preferences>(StoreConsts.preferences);
      if (result) {
        preferences = result;
      } else {
        throw new Error("Preferences not found in store");
      }
    } catch (error) {
      console.error("Failed to load preferences from store", error);
      preferences = {
        locale: await invoke("current_locale").catch(() => "en-US"),
        showNotes: true,
        showTimezone: true,
        use24HourTime: true,
      } as Preferences;
    }
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

  <SaveStatus {saved} />

  <svelte:fragment slot="dialog-footer">
    <button class="modal-action-button" on:click={() => (showModal = false)}>
      close
    </button>

    <button class="modal-action-button" on:click={savePreferences}> save </button>
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
</style>
