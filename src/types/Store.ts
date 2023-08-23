export interface Store {
  tabledata: TableData[];
  preferences: Preferences;
}

export interface TableData {
  id: string;
  name: string;
  timezone: string;
  place: string;
  notes: string;
}

export interface Preferences {
  use24HourTime: boolean;
  showTimezone: boolean;
  showPlace: boolean;
  showNotes: boolean;
  showDate: boolean;
  locale: string;
  localeDisplay: string;
}
