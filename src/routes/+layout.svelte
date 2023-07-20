<script lang="ts">
  import { Layout } from "@barbajoe/svelte-lib";
  import type { LogoData } from "@barbajoe/svelte-lib/dist/types";

  import "./global.css";

  import { InsertEntry, UserPreferences } from "$lib";

  const logo: LogoData = {
    href: "/",
    src: "/favicon.ico",
    alt: "Logo",
    ariaLabel: "go to landing page",
    text: "Person to Timezone",
  };
</script>

<Layout {logo}>
  <div class="header" slot="header">
    <InsertEntry />
    <UserPreferences />
  </div>

  <slot />
</Layout>

<style>
  .header {
    display: flex;
    gap: 1rem;
  }
</style>
