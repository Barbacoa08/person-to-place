import type { Preferences } from "$types/Store";
import { writable } from "svelte/store";

export const PreferencesStore = writable({
  locale: "en-US",
  showNotes: true,
  showTimezone: true,
  use24HourTime: true,
} as Preferences);
