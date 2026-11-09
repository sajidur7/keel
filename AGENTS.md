# AGENTS.md — Keel v2

Instructions for coding agents (Codex, Claude Code, Cursor, Copilot) working in this repo or in apps that use Keel.

## Stack
React 19 · TypeScript · Radix primitives (`radix-ui`) · Lucide icons via Keel names · **StyleX** (`@stylexjs/stylex`, `@stylexjs/unplugin`) · Vite.
**Never use Tailwind** or utility classes. Never hard-code colors, shadows or font sizes.

## Where things are
- `tokens/tokens.stylex.ts` — design tokens (`color`, `tone`, `depth`, `radius`, `font`, `motion`, `size`, `z`). Colors use `light-dark()`.
- `components/*.tsx` — every component, grouped by category; `components/index.ts` exports all of them (`@keel/components`).
- `templates/*.tsx` — annotated templates; `templates/screens/` — 105 full SaaS screens (dashboards, lists, records, work,
  settings, billing, AI, auth, onboarding, system). Copy the closest screen before designing a new one.
- `docs-site/` — the docs (built with Keel). `npm run dev` / `npm run build`.
- `skills/keel/` — the agent skill. Read `skills/keel/SKILL.md` first, then `references/components.md` for the full catalog.

## Rules
1. Compose Keel components first; check `skills/keel/references/components.md` before writing new markup.
2. Style gaps with `stylex.create` + tokens; pass overrides to components via `xstyle`.
3. Black, white and one flat blue. One primary (ink) button per view. Blue (`color.accent`) only for selection, focus, links,
   progress and chart series 1 — never a gradient. Red only for errors/destructive. No sparkle icons (use `IconAgent`), no
   gradient text or glows. Keys via `<Kbd>`/`shortcut` (drawn as icons). Use `Bezel` for proposals/insights.
4. Wrap form controls in `<Field>`. Label every `IconButton`. Give charts a `label`.
5. Cover hover, focus-visible, pressed, disabled, loading, empty and error states.
6. AI features: agents propose (`DiffTable`, `ApprovalCard`), people approve.

## Commands
- `npm run dev` — docs site with hot reload (regenerates API docs first)
- `npm run typecheck` — must pass
- `npm run build` — API docs + typecheck + production build to `docs-site/dist`
- `npm run api` — regenerate `docs-site/src/generated/api.json`; then `node scripts/gen-skill-catalog.mjs` to refresh the skill catalog

When you add or change a component: export it from `components/index.ts`, add a demo in `docs-site/src/demos/<category>.tsx`,
register a page in `docs-site/src/registry.tsx`, and run `npm run api && node scripts/gen-skill-catalog.mjs`.
