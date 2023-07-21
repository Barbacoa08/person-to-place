<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { Store } from "tauri-plugin-store-api";

  import { onMount } from "svelte";

  import { Modal } from "$lib";
  import { PreferencesStore, StoreConsts } from "$utils";

  import type { Preferences } from "$types/Store";

  import SettingsIcon from "./SettingsIcon.svelte";

  onMount(() => getPreferences());

  let showModal = false;

  let preferences: Preferences;
  const store = new Store(StoreConsts.path);
  const savePreferences = async () => {
    PreferencesStore.set(preferences);
    await store.set(StoreConsts.preferences, preferences);
    await store.save();
    // TODO: show "saved" message
  };
  const getPreferences = async () => {
    try {
      const result = await store.get<Preferences>(StoreConsts.preferences);
      if (result) {
        preferences = result;
        PreferencesStore.set(preferences);
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
      PreferencesStore.set(preferences);
    }
  };
</script>

<button
  class="modal-button"
  aria-label="User Preferences"
  on:click={() => {
    showModal = true;
    getPreferences();
  }}
>
  <SettingsIcon width="1rem" height="1rem" />
</button>

<Modal bind:showModal>
  <svelte:fragment slot="dialog-header-text">User Preferences</svelte:fragment>

  <div class="form-container">
    <form on:change={savePreferences}>
      {#if preferences}
        <label>
          <div>Locale</div>
          <input type="text" bind:value={preferences.locale} />
          <div class="helper-text">TODO: make searchable dropdown</div>
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
  </div>
</Modal>

<style>
  form label input[type="text"] {
    width: 10rem;
  }
</style>
