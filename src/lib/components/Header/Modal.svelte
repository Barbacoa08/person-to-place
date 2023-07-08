<!-- copy-pasted (mostly) from: https://svelte.dev/examples/modal -->
<script lang="ts">
  export let showModal = false;

  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <slot name="header" />

    <slot />

    <button on:click={() => dialog.close()}> close </button>
  </div>
</dialog>

<style>
  dialog {
    width: 32em;
    height: 30rem;
    border-radius: 0.2em;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    height: -webkit-fill-available;
    display: grid;
    grid-template-rows: auto auto 1fr auto;

    padding: 1em;
  }
  dialog > div > button {
    font-size: var(--font-size-base);
    background-color: rgba(0, 0, 0, 0.3);
    color: var(--color-link-text);
    border: 1px solid var(--border-color-gray);
    border-radius: 0.2em;
    margin-top: 1rem;
    padding: 0.2em 0.5em;
    cursor: pointer;

    justify-self: end;
  }
  dialog > div > button:focus,
  dialog > div > button:hover {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-link-text);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
