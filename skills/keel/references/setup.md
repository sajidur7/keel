# Setting up Keel in an app (Vite + React 19)

Tested end to end in an empty folder: these exact steps build and typecheck.

**1. Install**
```bash
npm i react react-dom radix-ui lucide-react @stylexjs/stylex @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D vite typescript @vitejs/plugin-react @stylexjs/unplugin @types/react @types/react-dom @types/node
```

**2. Copy Keel in** — Keel is source you own. Keep `components/` and `tokens/` side by side (components import `../tokens/tokens.stylex`).
```bash
npx degit sajidur7/keel/components src/keel/components
npx degit sajidur7/keel/tokens src/keel/tokens
```
(Or copy the two folders by hand. When this skill ships with `assets/`, copy `assets/components` and `assets/tokens`.)

**3. vite.config.ts** — StyleX goes before React.
```ts
import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: false,
      unstable_moduleResolution: { type: "commonJS", rootDir: __dirname },
    }),
    react(),
  ],
});
```

**4. package.json** — add these two keys so `light-dark()` colours ship as-is.
```json
"type": "module",
"browserslist": ["chrome >= 123", "edge >= 123", "safari >= 17.5", "firefox >= 120"]
```

**5. tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler", "jsx": "react-jsx",
    "strict": true, "skipLibCheck": true, "noEmit": true, "types": ["vite/client"]
  },
  "include": ["src"]
}
```

**6. index.html** (project root)
```html
<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>App</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
```

**7. src/main.tsx**
```tsx
import "./keel/components/styles.css";
import { createRoot } from "react-dom/client";
import { KeelProvider, Button } from "./keel/components";

createRoot(document.getElementById("root")!).render(
  <KeelProvider defaultMode="system">
    <Button variant="primary">Hello Keel</Button>
  </KeelProvider>,
);
```

Run `npx vite` to develop, `npx vite build` to ship, `npx tsc --noEmit` to typecheck.

`KeelProvider` = `ThemeProvider` (data-theme on html, persisted) + `TooltipProvider` + `Toaster` (for `useToast`).

## Optional: `@keel/*` import aliases
If you prefer `import { Button } from "@keel/components"`:
- vite `resolve.alias`: `{ "@keel/components": r("./src/keel/components"), "@keel/tokens": r("./src/keel/tokens") }` where `const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))`
- the same paths in `stylex.vite({ aliases: { "@keel/tokens/*": [r("./src/keel/tokens/*")], "@keel/components/*": [r("./src/keel/components/*")] } })`
- tsconfig `paths`: `"@keel/components": ["./src/keel/components/index.ts"], "@keel/tokens/*": ["./src/keel/tokens/*"]`

## Templates and screens
`templates/` (9 annotated templates, 105 screens) import from `@keel/components` and `@keel/tokens/*`, so set up the aliases above before copying any of them in.

## Next.js
Use `@stylexjs/unplugin`'s webpack/rspack entry or `@stylexjs/postcss-plugin`; the rest is identical. Components that use state need `"use client"` at the top of the file that imports them.

## Common problems
- **Unstyled page** — `styles.css` is not imported, or the StyleX plugin is after `react()`.
- **"Could not find a declaration file for module 'react'"** — install `@types/react @types/react-dom`.
- **Colours wrong in old browsers** — the `browserslist` key is missing.
- **`__dirname is not defined`** — only happens outside Vite's config loader; use `fileURLToPath(new URL(".", import.meta.url))` instead.
