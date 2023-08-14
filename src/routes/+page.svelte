<script lang="ts">
  import { driver } from "driver.js";
  import { onMount } from "svelte";
  import { Store } from "tauri-plugin-store-api";

  import { TimezoneTable } from "$lib/components";
  import type { Preferences } from "$types/Store";
  import { StoreConsts } from "$utils";

  import "driver.js/dist/driver.css";

  const store = new Store(StoreConsts.path);
  onMount(() => {
    store.get<Preferences>(StoreConsts.preferences).then((preferences) => {
      console.log("preferences", preferences);

      if (!preferences) {
        const driverObj = driver({
          showProgress: true,
          steps: [
            {
              element: "#driverjs-preferences-button",
              popover: {
                title: "User Preferences",
                description:
                  "This is where you probably want to start. You'll set what you want and how you want to see it.",
              },
            },
            {
              element: "#driverjs-thepp-table",
              popover: {
                title: "The star of the show!",
                description:
                  "This is where all of your data shows up. Is it time to add some people and places?",
              },
            },
            {
              element: "#driverjs-insert-entry",
              popover: {
                title: "Insert Entry",
                description:
                  "Finally, this is how you add people and their places. You can also add notes if you want to specify if a person has ideal working/meeting times, or a cute cat!",
              },
            },
          ],
        });

        driverObj.drive();
      }
    });
  });
</script>

<TimezoneTable />
