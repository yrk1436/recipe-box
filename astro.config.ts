import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { validateRecipesIntegration } from "./src/lib/validate-build";

const site =
  process.env.PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:4321");

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap(), validateRecipesIntegration()],
  image: {
    remotePatterns: [],
  },
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
