export interface Place {
  text: string;
  value: string;
  city: string;
  province: string;
  country: string;
  iso2: string;
  iso3: string;
  timezone: string;
}

export const emptyPlace: Place = {
  text: "",
  value: "",
  city: "",
  province: "",
  country: "",
  iso2: "",
  iso3: "",
  timezone: "",
};
