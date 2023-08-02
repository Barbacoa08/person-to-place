<script lang="ts">
  import cityTimezones from "city-timezones";

  import { Combobox } from "$lib";

  export let place = "";

  const options = cityTimezones.cityMapping.map((city) => ({
    text: `${city.city_ascii}, ${city.province}`,
    value: city.timezone,
  }));
</script>

<Combobox
  label="Place"
  id="place-combobox-selection"
  name="place-combobox-selection"
  required
  {options}
  bind:value={place}
/>
