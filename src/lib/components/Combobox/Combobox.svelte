<script lang="ts">
  import fuzzysort from "fuzzysort";

  import { guid } from "$utils";
  import ClearInputIcon from "./ClearInputIcon.svelte";

  export let id: string = `barbajoe-combobox-${guid()}`;
  export let name: string = id;
  export let label: string;
  export let options: { text: string; value: string }[] = [];
  export let placeholder: string | undefined = undefined;
  export let place = "";
  export let timezone = "";
  export let required = false;

  const listboxId = `${id}-listbox`;
  const listItemId = (index: number) => `listbox-item-${index}`;

  let activeOption: string | undefined = undefined; // TODO: active item id?

  const filter = (text: string) => {
    const sanitized = text.trim().toLowerCase();

    return fuzzysort
      .go(sanitized, options, {
        key: "text",
        limit: 10,
      })
      .map((o) => o.obj);
  };
  $: items = filter(place);
  $: isExpanded = items.length > 1;
  let hoverIndex = 0;

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

<div class="combobox">
  <div class="group">
    <input type="hidden" value={timezone} />
    <input
      {id}
      {name}
      {required}
      {placeholder}
      bind:value={place}
      on:keydown={(event) => {
        if (["Tab", "Enter"].includes(event.key)) {
          if (isValidTimezone(items[hoverIndex].value)) {
            timezone = items[hoverIndex].value;
            place = items[hoverIndex].text;
          } else {
            timezone = "";
            place = "";
          }
          hoverIndex = 0;
        } else if (event.key === "Escape") {
          hoverIndex = 0;
          event.preventDefault();
          event.stopPropagation();
          timezone = "";
          place = "";
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          event.stopPropagation();
          hoverIndex = Math.min(hoverIndex + 1, items.length - 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          event.stopPropagation();
          hoverIndex = Math.max(hoverIndex - 1, 0);
        } else {
          hoverIndex = 0;
        }
      }}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-controls={listboxId}
      aria-expanded={isExpanded}
      data-active-option={activeOption}
    />
    <button
      type="button"
      aria-label="clear"
      class:hidden={place === ""}
      on:click={() => {
        place = "";
        timezone = "";
      }}
    >
      <ClearInputIcon />
    </button>
  </div>

  <ul
    id={listboxId}
    role="listbox"
    aria-label={label}
    class:hidden={!isExpanded}
  >
    {#each items as item, index}
      <li
        class="active"
        role="option"
        aria-selected={place === item.value || hoverIndex === index}
        id={listItemId(index)}
        tabindex={hoverIndex === index ? 0 : -1}
        on:click={() => {
          timezone = item.value;
          place = item.text;
        }}
        on:keydown={(event) => {
          // TODO: add a roving index
          if (event.key === "Enter") {
            timezone = item.value;
            place = item.text;
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
            hoverIndex = Math.min(hoverIndex + 1, items.length - 1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();
            hoverIndex = Math.max(hoverIndex - 1, 0);
          } else if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            timezone = "";
            place = "";
          }
        }}
      >
        {item.text}
      </li>
    {/each}
  </ul>
</div>

<style>
  .hidden {
    display: none;
  }

  .combobox {
    position: relative;

    & .group button {
      position: absolute;
      right: 0.5rem;
      top: 1rem;
      background-color: transparent;
      border: none;

      &:hover {
        cursor: pointer;
        color: var(--color-bg-accent);
      }
    }
  }

  ul[role="listbox"] {
    margin: 0;
    padding: 0;
    position: absolute;
    left: 0.3rem;
    list-style: none;
    background-color: var(--color-bg);
    box-sizing: border-box;
    border: 1px solid var(--color-link-text);
    border-radius: 0 0 0.2em 0.2em;
    width: calc(100% - 0.6rem);
    cursor: pointer;

    & li[role="option"] {
      padding: 0.5rem;

      &:hover,
      &:focus,
      &[aria-selected="true"] {
        background-color: var(--color-bg-accent);
      }
    }
  }
</style>
