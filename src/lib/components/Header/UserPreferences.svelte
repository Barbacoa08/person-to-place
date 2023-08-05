<script lang="ts">
  import { Link, Modal } from "@barbajoe/svelte-lib";
  import { invoke } from "@tauri-apps/api/tauri";
  import { toast } from "@zerodevx/svelte-toast";
  import ISO6391 from "iso-639-1";
  import { Store } from "tauri-plugin-store-api";
  import { onMount } from "svelte";

  import { InfoIcon, SettingsIcon } from "$lib/icons";
  import type { Preferences } from "$types/Store";
  import { PreferencesStore, StoreConsts } from "$utils";
  import Tooltip from "./Tooltip.svelte";

  onMount(() => getPreferences());

  let showModal = false;

  let preferences: Preferences;
  const store = new Store(StoreConsts.path);
  const savePreferences = async () => {
    const isoLocale = ISO6391.getCode(preferences.localeDisplay);
    const intlLocale = (() => {
      try {
        return new Intl.Locale(preferences.localeDisplay);
      } catch (error) {
        return { language: null, region: null };
      }
    })();

    if (ISO6391.validate(isoLocale)) {
      // user entered a language, eg, English
      preferences.locale = isoLocale;
      preferences.localeDisplay = ISO6391.getName(isoLocale);
    } else if (ISO6391.validate(preferences.localeDisplay)) {
      // user entered a code, eg, en
      preferences.locale = preferences.localeDisplay;
    } else if (intlLocale.language && intlLocale.region) {
      // user entered a locale, eg, en-US
      const formatted = `${intlLocale.language}-${intlLocale.region}`;
      preferences.locale = formatted;
      preferences.localeDisplay = formatted;
    } else {
      toast.push("Invalid Locale");
      return;
    }

    PreferencesStore.set(preferences);
    await store.set(StoreConsts.preferences, preferences);
    await store.save();
    toast.push("Preferences Saved");
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
      toast.push("Failed to load preferences from store");
      console.error("Failed to load preferences from store", error);
      preferences = {
        locale: await invoke("current_locale").catch(() => "en-US"),
        showNotes: true,
        showTimezone: true,
        showPlace: true,
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
        <div class="grid">
          <div>
            <h3>General</h3>

            <label>
              <div class="input-label-with-tooltip">
                Locale (language) <Tooltip>
                  <InfoIcon />
                  <svelte:fragment slot="tooltiptext">
                    <div>
                      Must be a valid Language, two digit ISO, or two digit ISO
                      followed by two digit dialect.
                    </div>
                    <div>
                      Examples: en-US, en-GB, English, French, zh, Chinese,
                      中文, ab, Abkhaz, аҧсуа бызшәа
                    </div>
                  </svelte:fragment>
                </Tooltip>
              </div>

              <input
                type="text"
                bind:value={preferences.localeDisplay}
                placeholder="en-US"
              />

              <div class="helper-text">
                Must be a valid <Link
                  href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
                  isExternal
                >
                  ISO name
                </Link>
              </div>
            </label>

            <label>
              <input type="checkbox" bind:checked={preferences.showNotes} />
              <span>Show notes</span>
            </label>
          </div>

          <div>
            <h3>Time Display</h3>

            <label>
              <input type="checkbox" bind:checked={preferences.use24HourTime} />
              <span>Use 24 hour time</span>
            </label>

            <label>
              <input type="checkbox" bind:checked={preferences.showDate} />
              <span>Show Date</span>
              <div class="helper-text">
                This can be helpful in circumstances when entries are more than
                a few hours apart
              </div>
            </label>

            <label>
              <input type="checkbox" bind:checked={preferences.showTimezone} />
              <span>Show Timezone</span>
            </label>

            <label>
              <input type="checkbox" bind:checked={preferences.showPlace} />
              <span>Show Place</span>
            </label>
          </div>
        </div>
      {/if}
    </form>
  </div>
</Modal>

<style>
  form label input[type="text"] {
    width: 10rem;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;

    & > div {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    & .input-label-with-tooltip {
      display: flex;
      gap: 0.5rem;
    }
  }
</style>
