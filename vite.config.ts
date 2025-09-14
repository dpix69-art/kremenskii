import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// Для custom domain (kremenskii.art) base ДОЛЖЕН быть "/"
const base = "/";

export default defineConfig({
  root: "client",          // фронт лежит в client/
  base,                    // пути к ассетам с корня домена
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
