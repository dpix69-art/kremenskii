import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// Если деплой на project pages (user.github.io/REPO/), можно задать base:
// const base = `/${process.env.GITHUB_REPOSITORY?.split("/")[1]}/`;

export default defineConfig({
  // фронт лежит в client/
  root: "client",
  // base, если нужно подкаталого (GH Pages project):
  // base,
  plugins: [
    react(),
    ViteImageOptimizer({
      includePublic: true,
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 50 },
      resize: [{ width: 800 }, { width: 1600 }, { width: 2400 }],
    }),
  ],
  build: {
    outDir: "dist",        // => client/dist
    emptyOutDir: true,
  },
  // publicDir по умолчанию "client/public" — менять не нужно
});
