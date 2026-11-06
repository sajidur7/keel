import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("./"),
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@keel/components": r("../components"),
      "@keel/templates": r("../templates"),
      "@keel/tokens": r("../tokens"),
    },
  },
  server: { port: 5173, host: true, fs: { allow: [r("..")] } },
  build: { outDir: r("./dist"), emptyOutDir: true, chunkSizeWarningLimit: 1500 },
});
