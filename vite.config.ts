import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: "client",
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    // Optimizations
    target: "es2020",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        // Stable chunk names for better Cloudflare caching
        chunkFileNames: "assets/[name]-[hash:8].js",
        entryFileNames: "assets/[name]-[hash:8].js",
        assetFileNames: "assets/[name]-[hash:8].[ext]",
        // Manual chunks to split vendor from app code
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
    // Report compressed sizes
    reportCompressedSize: true,
  },
});
