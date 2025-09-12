// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],          // никаких dev-плагинов в проде
  base: "./",                  // GitHub Pages-safe: относительные ассеты

  // твои алиасы:
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  // корень фронтенда
  root: path.resolve(__dirname, "client"),

  // public лежит в корне репо (не в client/)
  publicDir: path.resolve(__dirname, "public"),

  // билд в dist/public (как у тебя)
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
  },

  server: {
    fs: { strict: true, deny: ["**/.*"] },
  },
});
