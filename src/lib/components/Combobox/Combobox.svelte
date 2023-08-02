<script lang="ts">
  import fuzzysort from "fuzzysort";

  import { onClickOutside } from "./helpers";
  import { guid } from "$utils";

  export let id: string = `barbajoe-combobox-${guid()}`;
  export let name: string = id;
  export let label: string;
  export let options: { text: string; value: string }[] = [];
  export let placeholder: string | undefined = undefined;
  export let value = "";
  const listboxId = `${id}-listbox`;

  let isExpanded = false; // TODO: control
  let activeOption: string | undefined = undefined; // TODO: active item id?
  let activedescendant: string | undefined = undefined; // TODO: active item id?
  $: console.log("value", value);

  export let filter = (text: string) => {
    const sanitized = text.trim().toLowerCase();

    return fuzzysort
      .go(sanitized, options, {
        key: "text",
        limit: 10,
      })
      .map((o: any) => o.obj);
  };
  $: items = filter(value); // TODO: fix
  $: console.log("items", items);
</script>

<label for={id}>{label}</label>
<input
  {id}
  {name}
  {placeholder}
  bind:value
  on:click={() => (isExpanded = true)}
  on:blur={() => (isExpanded = false)}
  type="text"
  role="combobox"
  aria-autocomplete="list"
  aria-controls={listboxId}
  aria-expanded={isExpanded}
  data-active-option={activeOption}
  aria-activedescendant={activedescendant}
/>
<span aria-hidden="true" data-trigger="multiselect"></span>
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
