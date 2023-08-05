<script lang="ts">
  import fuzzysort from "fuzzysort";

  import { guid } from "$utils";
  import { emptyPlace, type Place } from "$types/Place";

  import ClearInputIcon from "./ClearInputIcon.svelte";
  import { text } from "@sveltejs/kit";

  export let id: string = `barbajoe-combobox-${guid()}`;
  export let name: string = id;
  export let label: string;
  export let options: Place[] = [];
  export let placeholder: string | undefined = undefined;
  export let place: Place = emptyPlace;
  export let required = false;

  const listboxId = `${id}-listbox`;
  const listItemId = (index: number) => `listbox-item-${index}`;

  const filter = (text: string) => {
    const sanitized = text.trim().toLowerCase();

    return fuzzysort
      .go(sanitized, options, {
        key: "text",
        limit: 10,
      })
      .map((o) => o.obj);
  };
  $: items = filter(place.text);
  $: isCollapsed =
    place.text === items[0]?.text && place.value === items[0]?.value;
  /*
    NOTE: must hide listbox due to loose fuzzy matching having overlaps such as:
    "Hamburg, Hamburg" -> "Novo Hamburgo, Rio Grande do Sul"
    "Chincha Alta, Ica" -> "Chimaltenango, Chimaltenango"
  */

  let hoverIndex = -1;
  const resetHoverIndex = () => (hoverIndex = -1);
  $: activedescendant = listItemId(hoverIndex);

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

<!--
  TODO: `aria-live="polite"` does work, but it's hacky and doesn't give as good of a UX as Deque's example.
  Need to spend some time getting this working properly.
  Deque's example: https://dequeuniversity.com/library/aria/predictive-text
-->
<div class="combobox" aria-live="polite">
  <div class="group">
    <input
      {id}
      {name}
      {required}
      {placeholder}
      bind:value={place.text}
      on:keydown={(event) => {
        if (["Tab", "Enter"].includes(event.key)) {
          hoverIndex = hoverIndex === -1 ? 0 : hoverIndex;
          if (isValidTimezone(items[hoverIndex].timezone)) {
            place = items[hoverIndex];
          } else {
            place = emptyPlace;
          }
          resetHoverIndex();
        } else if (event.key === "Escape") {
          resetHoverIndex();
          event.preventDefault();
          event.stopPropagation();
          place = emptyPlace;
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          event.stopPropagation();
          hoverIndex = Math.min(hoverIndex + 1, items.length - 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          event.stopPropagation();
          hoverIndex = Math.max(hoverIndex - 1, 0);
        } else {
          resetHoverIndex();
        }
      }}
      type="text"
      role="combobox"
      autocomplete="off"
      aria-owns={listboxId}
      aria-autocomplete="list"
      aria-controls={listboxId}
      aria-expanded={!isCollapsed}
      aria-activedescendant={activedescendant}
    />
    <button
      type="button"
      aria-label="clear"
      class:hidden={place.text === ""}
      on:click={() => {
        place = emptyPlace;
      }}
    >
      <ClearInputIcon />
    </button>
  </div>

  <ul
    id={listboxId}
    role="listbox"
    aria-label={label}
    class:hidden={isCollapsed}
  >
    {#each items as item, index}
      <li
        class="active"
        role="option"
        aria-selected={place.text === item.text || hoverIndex === index}
        id={listItemId(index)}
        tabindex={hoverIndex === index ? 0 : -1}
        on:click={() => {
          place = item;
        }}
        on:keydown={(event) => {
          // TODO: add a roving index
          if (event.key === "Enter") {
            place = item;
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
            place = emptyPlace;
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
