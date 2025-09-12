// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

// Узнаём __dirname в ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode }) => {
  const isDev = mode === "development";
  const plugins = [react()];

  // Подключаем dev-плагины ТОЛЬКО в dev-режиме
  if (isDev) {
    try {
      const { default: runtimeErrorOverlay } = await import(
        "@replit/vite-plugin-runtime-error-modal"
      );
      plugins.push(runtimeErrorOverlay());
    } catch {}
    // Подключаем cartographer только в dev и если есть REPL_ID
    if (process.env.REPL_ID) {
      try {
        const m = await import("@replit/vite-plugin-cartographer");
        plugins.push(m.cartographer());
      } catch {}
    }
  }

  return {
    plugins,

    // ВАЖНО для GitHub Pages — относительные ассеты
    base: "./",

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    // Корень фронтенда
    root: path.resolve(__dirname, "client"),

    // Твой публичный каталог лежит в корне репозитория
    publicDir: path.resolve(__dirname, "public"),

    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      sourcemap: false,
    },

    server: {
      fs: { strict: true, deny: ["**/.*"] },
    },
  };
});
