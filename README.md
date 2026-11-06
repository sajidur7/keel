# Keel

A calm, dense design system for admin interfaces. Dark first, with a complete light mode. Hierarchy comes from
type, not boxes. Color is only for status and tags.

- **Tokens**: one source (`tokens/tokens.json`) that builds to CSS variables, a Tailwind v4 `@theme`, Figma variables and Tokens Studio.
- **Components**: 75+ React + TypeScript components on Radix, Tailwind v4 and cva, each with every state.
- **Templates**: nine working admin screens.
- **Docs site**: built with Keel itself, in the style of ant.design.
- **Figma library**: variables, text styles, Lucide icons and component sets.
- **Claude skill**: `skills/keel` teaches Claude Code and Claude Design to build with Keel.

## Quick start

```bash
npm install
npm run dev        # docs site at http://localhost:5173
npm run build      # tokens → typecheck → static docs in docs-site/dist
npm run tokens     # rebuild tokens after editing tokens/tokens.json
npm run typecheck
```

Use it in your own app (React 19 + Tailwind v4):

```bash
npm i react-dom radix-ui class-variance-authority clsx tailwind-merge lucide-react \
      @fontsource-variable/geist @fontsource-variable/geist-mono
npm i -D tailwindcss @tailwindcss/vite
```

Copy `tokens/` and `components/` into your repo, for example as `src/keel/`. Then add this to your CSS entry:

```css
@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "./keel/components/styles.css";
```

```tsx
import { TooltipProvider, Toaster, Button, IconPlus } from "./keel/components";

<TooltipProvider>
  <Toaster>
    <Button variant="primary" leading={<IconPlus />}>New invoice</Button>
  </Toaster>
</TooltipProvider>
```

Theme: dark is the default. Set `data-theme="light"` on `<html>` for light.

## Structure

```
tokens/            tokens.json (source) · build.mjs · tokens.css · theme.css · figma-variables.json · tokens.studio.json
components/
  _ui/             primitives: button, input, select, checkbox, date-picker, table, dialog, sheet, tag, tabs, tree, …
  _common/         app-level: sidebar, layout (AppShell, Header, Page), command palette, charts
  lib/cn.ts        class merge helper
  styles.css       imports tokens, keyframes, reduced motion
  index.ts         public API
templates/         overview, customers (+ detail sheet), invoice form, settings, members & roles, audit log, login, forgot password
docs-site/         the documentation website (Vite)
figma/icons/       the Lucide icons Keel uses, as SVG + icons.json
scripts/           export-icons.tsx
skills/keel/       Claude skill: SKILL.md + references/
.claude-plugin/    plugin.json + marketplace.json, so the repo installs as a Claude Code plugin
SKILL.md · llms.txt
```

## Icons

Keel uses [Lucide](https://lucide.dev) through thin wrappers (`IconSearch`, `IconTrash`, …). The wrappers are
16px by default, with a 1.5px absolute stroke, and are `aria-hidden` unless you give them a `label`. To add an
icon:

```tsx
import { Truck } from "lucide-react";
import { keelIcon } from "./keel/components";
export const IconTruck = keelIcon(Truck);
```

## Figma

**Keel — Admin Design System**: https://www.figma.com/design/oOZ1MBB4ycKuRKKPl4MT5q

- 113 variables: *Keel / Color* (Dark + Light modes) and *Keel / Dimension*. Each has a WEB code syntax, such as `var(--card)`.
- Geist text styles, effect styles, and 93 Lucide icon components.
- A component set for every one of the 66 docs components, across Buttons, Inputs, Selection controls, Tags & status, Avatar,
  Navigation, Data display, Table, Feedback, Layout and Pickers & upload. Each variant (`State=…`) matches a cell of that
  page's **All states** demo, and every docs page links to its set with **Open in Figma**.
- Cover, Getting started and Foundations pages.
- A **Templates** page with all nine admin screens at 1440px, bound to the same variables (switch to Light the same way).
- Stat with on/off parts (help underline, icon, action, delta, meta, progress, chart, footer) and Plain/Card variants.

To switch theme, select a frame, then open Layer → Variable mode → Keel / Color → Light. To change a token,
edit `tokens.json`, run `npm run tokens`, and update the Figma variable with the same name, or re-import
`tokens/tokens.studio.json`.

## Claude skill

Claude Code (as a plugin):

```bash
/plugin marketplace add <path-or-git-url-of-this-repo>
/plugin install keel@keel
```

Or copy `skills/keel/` into `~/.claude/skills/keel/`. For Claude.ai or Claude Design, zip `skills/keel/` and
upload it under Settings → Capabilities → Skills. The skill covers tokens, component APIs, states, layout,
page patterns, a QA checklist, Figma, and copy-paste snippets.

## Principles

1. Density over decoration: 32–40px rows and 30px controls.
2. Hierarchy through type, not boxes.
3. The primary button is white in dark mode and near-black in light mode. It is the only bright fill.
4. Color is reserved for status and tags.
5. Every component has hover, focus-visible, active, disabled and loading states, plus error, read-only and empty where they apply.
6. Layouts are responsive from 320px. Below 1024px the sidebar becomes a drawer, and tables scroll inside their container.
7. Keyboard first: ⌘K, `/` to search, J/K between records, Esc to close.

## QA

Every docs page and template was checked at 320, 768, 1024 and 1440px in dark and light (728 renders):

- no page-level horizontal scroll
- no console errors

See `skills/keel/references/qa.md` for the checklist.
