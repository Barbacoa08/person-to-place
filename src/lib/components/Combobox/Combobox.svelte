<script lang="ts">
  import fuzzysort from "fuzzysort";

  import { guid } from "$utils";

  export let id: string = `barbajoe-combobox-${guid()}`;
  export let name: string = id;
  export let label: string;
  export let options: { text: string; value: string }[] = [];
  export let placeholder: string | undefined = undefined;
  export let value = "";
  const listboxId = `${id}-listbox`;

  let isExpanded = false;
  let activeOption: string | undefined = undefined; // TODO: active item id?

  const filter = (text: string) => {
    const sanitized = text.trim().toLowerCase();

    return fuzzysort
      .go(sanitized, options, {
        key: "text",
        limit: 10,
      })
      .map((o: any) => o.obj);
  };
  $: items = filter(value); // TODO: improve UX

  const isValidTimezone = (timezone: string) => {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
      throw new Error("Time zones are not available in this environment");
    }

    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch (ex) {
      return false;
    }
  };
</script>

<label for={id}>{label}</label>
<!-- TODO: add timezone as `value` and place in label? -->
<input
  {id}
  {name}
  {placeholder}
  bind:value
  on:click={() => (isExpanded = true)}
  on:blur={() => {
    // BUG: need to be able to differentiate between clicking on an item and clicking outside the combobox
    value = items[0]?.value || (isValidTimezone(value) ? value : "");
    isExpanded = false;
  }}
  on:keydown={(event) => {
    if (["Tab", "Enter"].includes(event.key)) {
      value = items[0]?.value || (isValidTimezone(value) ? value : "");
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      isExpanded = false;
      items = [];
      value = isValidTimezone(value) ? value : "";
    }
  }}
  type="text"
  role="combobox"
  aria-autocomplete="list"
  aria-controls={listboxId}
  aria-expanded={isExpanded}
  data-active-option={activeOption}
/>
<ul id={listboxId} role="listbox" aria-label={label} class:hidden={!isExpanded}>
  {#each items as item}
    <li
      class="active"
      role="option"
      aria-selected={value === item.value}
      id={`listbox-item-${item.value}`}
      on:click={() => {
        value = item.value;
        isExpanded = false;
      }}
      on:keydown={(event) => {
        // TODO: add a roving index
        if (event.key === "Enter") {
          value = item.value;
          isExpanded = false;
        }
      }}
    >
      {item.text}
    </li>
  {/each}
</ul>

<style>
  .hidden {
    display: none;
  }
</style>
