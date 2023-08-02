import type { Preferences } from "$types/Store";
import { writable } from "svelte/store";

export const PreferencesStore = writable({
  locale: "en-US",
  localeDisplay: "English (United States)",
  showDate: true,
  showNotes: true,
  showTimezone: true,
  showPlace: true,
  use24HourTime: true,
} as Preferences);
