import vinext from "vinext";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      // The Worker entry runs in RSC; server rendering runs as its child.
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
});
