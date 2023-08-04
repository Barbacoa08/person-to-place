<script lang="ts">
  export let width = "1.5rem";
  export let height = "1.5rem";
  export let fill = "none";
  export let stroke = "currentColor";
</script>

<svg
  {height}
  {width}
  {fill}
  {stroke}
  stroke-width="1.5"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  {...$$restProps}
>
  <path
    xmlns="http://www.w3.org/2000/svg"
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M12 4.5v15m7.5-7.5h-15"
  />
</svg>
