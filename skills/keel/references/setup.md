# Setting up Keel in an app (Vite + React 19)

```bash
npm i react react-dom radix-ui lucide-react @stylexjs/stylex @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D @stylexjs/unplugin @vitejs/plugin-react vite typescript
```

Copy `components/` and `tokens/` from the Keel repo into your app (e.g. `src/keel/`), or add the repo as a workspace package.

**vite.config.ts**
```ts
import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: false,
      unstable_moduleResolution: { type: "commonJS", rootDir: r("./") },
      aliases: { "@keel/tokens/*": [r("./src/keel/tokens/*")], "@keel/components/*": [r("./src/keel/components/*")] },
    }),
    react(),
  ],
  resolve: { alias: { "@keel/components": r("./src/keel/components"), "@keel/tokens": r("./src/keel/tokens") } },
});
```

**package.json**
```json
"browserslist": ["chrome >= 123", "edge >= 123", "safari >= 17.5", "firefox >= 120"]
```

**tsconfig paths**: `"@keel/components": ["./src/keel/components/index.ts"], "@keel/tokens/*": ["./src/keel/tokens/*"]`.

**main.tsx**
```tsx
import "@keel/components/styles.css";
import { KeelProvider } from "@keel/components";
createRoot(document.getElementById("root")!).render(<KeelProvider defaultMode="system"><App /></KeelProvider>);
```

`KeelProvider` = `ThemeProvider` (data-theme on html, persisted) + `TooltipProvider` + `Toaster` (for `useToast`).
Next.js: use `@stylexjs/unplugin`'s webpack/rspack entry or `@stylexjs/postcss-plugin`; the rest is identical.
