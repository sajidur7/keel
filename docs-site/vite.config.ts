import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("./"),
  base: "./",
  plugins: [
    // StyleX must run before React so Fast Refresh keeps working.
    stylex.vite({
      useCSSLayers: false,
      unstable_moduleResolution: { type: "commonJS", rootDir: r("..") },
      // StyleX resolves .stylex.ts imports itself, so it needs the same aliases as Vite.
      aliases: { "@keel/tokens/*": [r("../tokens/*")], "@keel/components/*": [r("../components/*")] },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@keel/components": r("../components"),
      "@keel/templates": r("../templates"),
      "@keel/tokens": r("../tokens"),
    },
  },
  server: { port: 5173, host: true, fs: { allow: [r("..")] } },
  build: { outDir: r("./dist"), emptyOutDir: true, chunkSizeWarningLimit: 2500 },
});
