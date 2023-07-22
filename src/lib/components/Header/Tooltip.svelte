<div class="tooltip">
  <slot />

  <div class="tooltiptext">
    <slot name="tooltiptext" />
  </div>
</div>

<style>
  .tooltip {
    position: relative;
    display: inline-block;

    & .tooltiptext {
      visibility: hidden;
      width: 25ch;
      background-color: black;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
      font-size: small;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      /* Position the tooltip */
      position: absolute;
      z-index: 1;
      bottom: 110%;
      left: 50%;
      margin-left: -12ch;

      /* Fade in/out animation */
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .tooltip:hover .tooltiptext,
  .tooltip:focus .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
</style>
