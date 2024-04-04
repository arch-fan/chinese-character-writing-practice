import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: "https://arch-fan.github.io",
  base: "chinese-character-writing-practice",
  integrations: [tailwind(), preact()]
});