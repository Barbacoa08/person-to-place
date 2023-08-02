<script lang="ts">
  // NOTE: could also use this API as a backup: https://api-ninjas.com/api/timezone
  import cityTimezones from "city-timezones";

  import { Combobox } from "$lib";

  export let place = "";

  const options = cityTimezones.cityMapping.map((city) => ({
    text: `${city.city_ascii}, ${city.province}`,
    value: city.timezone,
  }));
  $: console.log("options", options);
</script>

<Combobox
  id="place-combobox-selection"
  label="Place"
  name="place-combobox-selection"
  {options}
  bind:value={place}
/>
