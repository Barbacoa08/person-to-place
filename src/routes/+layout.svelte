<script lang="ts">
  import { Layout } from "@barbajoe/svelte-lib";
  import type { LogoData } from "@barbajoe/svelte-lib/dist/types";

  import { UserPreferences } from "$lib";

  const logo: LogoData = {
    href: "/",
    src: "/favicon.ico",
    alt: "Logo",
    ariaLabel: "go to landing page",
    text: "Person to Timezone",
  };
</script>

<Layout {logo}>
  <UserPreferences slot="header" />

  <slot />
</Layout>
