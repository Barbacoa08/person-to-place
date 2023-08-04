<script lang="ts">
  import { Layout } from "@barbajoe/svelte-lib";
  import type { LogoData } from "@barbajoe/svelte-lib/dist/types";
  import { SvelteToast } from "@zerodevx/svelte-toast";

  import "./global.css";

  import { InsertEntry, UserPreferences } from "$lib/components";

  const logo: LogoData = {
    href: "/",
    src: "/favicon.ico",
    alt: "Logo",
    ariaLabel: "go to landing page",
    text: "Person to Timezone",
  };

  const options = {
    duration: 2000,
  };
</script>

<Layout {logo}>
  <div class="header" slot="header">
    <InsertEntry />
    <UserPreferences />
  </div>

  <slot />
</Layout>

<SvelteToast {options} />

<style>
  .header {
    display: flex;
    gap: 1rem;
  }
</style>
