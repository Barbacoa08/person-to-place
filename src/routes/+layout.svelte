<script lang="ts">
  import "./global.css";

  import { Layout } from "@barbajoe/svelte-lib";
  import type { LogoData } from "@barbajoe/svelte-lib/dist/types";

  import { SiteSearch } from "$lib";

  const logo: LogoData = {
    href: "/",
    src: "/favicon.ico",
    alt: "Logo",
    ariaLabel: "go to landing page",
    text: "Person to Timezone",
  };
</script>

<Layout {logo}>
  <SiteSearch slot="header" />

  <slot />
</Layout>
