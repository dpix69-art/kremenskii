import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "node:path";

// Для custom domain (kremenskii.art) base = "/"
const base = "/";

export default defineConfig({
  root: "client",          // фронт лежит в client/
  base,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"), // ⟵ ВАЖНО: alias @ → client/src
    },
  },
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
});
