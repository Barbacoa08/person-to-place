<script lang="ts">
  import cityTimezones from "city-timezones";

  import { emptyPlace, type Place } from "$types/Place";

  import { Combobox } from "./Combobox";

  export let id: string = "place-combobox-selection";
  export let place: Place = { ...emptyPlace };

  const options = cityTimezones.cityMapping.map(
    (city) =>
      ({
        text: `${city.city_ascii}, ${city.country}`,
        value: city.timezone,
        city: city.city,
        country: city.country,
        iso2: city.iso2,
        iso3: city.iso3,
        timezone: city.timezone,
      }) as Place,
  );
</script>

<Combobox label="Place" {id} name={id} required {options} bind:place />
