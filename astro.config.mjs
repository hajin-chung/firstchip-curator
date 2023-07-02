import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import solidJs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify/functions";
const envNames = ["DATABASE_URI", "PUBLIC_KAKAO_REST_API_KEY", "PUBLIC_KAKAO_REDIRECT_URL", "R2_ACCESS_KEY", "R2_SECRET_KEY", "BUCKET_NAME", "CLOUDFLARE_ACCOUNT_ID"];

// // check process env
// envNames.forEach((name) => {
//   if (process.env[name]) {
//     throw new Error(`no environment variable named ${name}`);
//   }
// });


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), solidJs(), partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  })],
  output: "server",
  server: {},
  adapter: netlify(),
  vite: {
    define: envNames.reduce((pv, v) => {
      pv[`process.env.${v}`] = JSON.stringify(process.env[v]);
      return pv;
    }, {})
  }
});