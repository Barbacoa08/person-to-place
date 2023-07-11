export interface Store {
  tabledata: TableData[];
  preferences: Preferences; // TODO: implement preferences
}

export interface TableData {
  id: string;
  name: string;
  timezone: string;
  notes: string;
}

export interface Preferences {
  use24HourTime: boolean;
  showTimezone: boolean;
  showNotes: boolean;
  locale: string;
}
