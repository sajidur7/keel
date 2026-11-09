# Keel v2

A tactile, dense design system for admin products and AI-assistant screens.
**React 19 · Radix · StyleX (no Tailwind) · Lucide · light & dark.**

- **140+ documented components** covering every [Astryx](https://astryx.atmeta.com/components) category — Action, Chat, Container,
  Content, Feedback, Form Controls, Layout, Navigation, Overlay, Table & List, Utility — plus everything from Keel v1
  (Stat, charts, Transfer, Cascader, OTP, Popconfirm, Coachmark…) and a set of AI primitives (Thinking, ApprovalCard, DiffTable,
  TaskList, InsightCard, PromptBar, ToolChips…).
- **Tactile look**: buttons and tiles have a top highlight, a hairline ring and a soft drop and sink when pressed; inputs are
  recessed wells; primary actions are ink (black on light, white on dark).
- **Tokens** in one StyleX file (`tokens/tokens.stylex.ts`); every color is `light-dark()`, so themes switch with
  `color-scheme` — no classes, no flash.
- **Docs site** with live demos, copyable code for every example, *All states* demos, API tables generated from TypeScript,
  and full component source.
- **Templates**: overview, customers (table + drawer), new invoice, settings, members & roles, audit log, AI assistant, sign in,
  forgot password.
- **Agent skills** for Claude Code, Claude (web/desktop), Codex and Cursor.

## Run the docs

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # docs-site/dist
```

## Use Keel in an app

See `skills/keel/references/setup.md`. In short: install `@stylexjs/stylex` + `@stylexjs/unplugin`, add the plugin before React
in Vite, use a modern `browserslist`, import `components/styles.css`, and wrap the app in `<KeelProvider>`.

```tsx
import { Button, Field, Input, useToast } from "@keel/components";
```

Style your own pieces with the same tokens:

```tsx
import * as stylex from "@stylexjs/stylex";
import { color, depth, radius } from "@keel/tokens/tokens.stylex";
const s = stylex.create({ panel: { backgroundColor: color.surface, boxShadow: depth.card, borderRadius: radius.xl } });
```

## Repo

```
tokens/tokens.stylex.ts     design tokens (StyleX defineVars)
components/                 one file per category + index.ts
templates/                  complete screens
docs-site/                  documentation (Vite + StyleX), demos, API generation
skills/keel/                agent skill: SKILL.md + references (catalog generated from source)
AGENTS.md                   Codex / generic agents
.cursor/rules/keel.mdc      Cursor
.claude-plugin/             Claude Code plugin
llms.txt                    index for LLM tools
scripts/                    gen-api, gen-skill-catalog, pack-skill, export-icons
```

## Agent setup

| Tool | How |
|---|---|
| Claude Code | `/plugin marketplace add sajidur7/keel` then install **keel**, or copy `skills/keel` into `.claude/skills/` |
| Claude (web & desktop) | `./scripts/pack-skill.sh` → upload `keel-skill.zip` in Settings → Capabilities → Skills |
| Codex | reads `AGENTS.md` automatically |
| Cursor | reads `.cursor/rules/keel.mdc` automatically |

## Updating docs after component changes

```bash
npm run api && node scripts/gen-skill-catalog.mjs
```
