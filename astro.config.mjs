import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import partytown from "@astrojs/partytown";

import solidJs from "@astrojs/solid-js";

const envNames = [
	"DATABASE_HOST",
	"DATABASE_USERNAME",
	"DATABASE_PASSWORD",
	"PUBLIC_KAKAO_REST_API_KEY",
	"PUBLIC_KAKAO_REDIRECT_URL",
	"R2_ACCESS_KEY",
	"R2_SECRET_KEY",
	"BUCKET_NAME",
	"CLOUDFLARE_ACCOUNT_ID",
];

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind({
		config: {
			applyBaseStyles: false
		}
	}), solidJs(), partytown({
		config: {
			forward: ["dataLayer.push"],
		}
	})],
	output: "server",
	server: {
		headers: {
			"Cache-Control": "max-age=120",
		},
	},
	adapter: cloudflare(),
	vite: {
		define: envNames.reduce((pv, v) => {
			pv[`process.env.${v}`] = JSON.stringify(process.env[v])
			return pv;
		}, {}),
	}
});