import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Multi-page static site: every existing HTML page is kept as its own
// build entry so Vite bundles/copies them all into dist/ untouched,
// except index.html which also gets the wallet-widget script processed.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        journey: resolve(__dirname, "journey.html"),
        alliance: resolve(__dirname, "alliance.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html")
      }
    }
  }
});
