import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), solidJs(), partytown({
		config: {
			forward: ["dataLayer.push"],
		}
	})],
	output: "server",
	adapter: cloudflare()
});