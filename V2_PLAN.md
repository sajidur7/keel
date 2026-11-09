# Keel v2 — working plan (local branch `v2`, DO NOT push, DO NOT touch Figma until user approves)

User asks (2026-11-09):
- Total redesign. Not Tailwind → StyleX (@stylexjs/stylex + @stylexjs/unplugin). No Tailwind anywhere (docs too).
- Cover EVERY Astryx component (list in /tmp/claude-0/astryx-src/comps.txt; Astryx src at /tmp/claude-0/astryx-src/repo — study APIs only, never copy code/styles) + keep ALL existing Keel components.
- Look: own style, mixing ideas — Kargul CRM 3D/tactile buttons, bencho.dev (micro-interactions), beautifului.dev (main ref: crafted AI-native primitives: thinking/streaming loaders, prompt bar, tool chips, approval card, diff table…). Don't copy.
- Skills for Claude Code (plugin + SKILL.md), Claude web (uploadable skill zip), Codex (AGENTS.md), Cursor (.cursor/rules) so devs get all components.
- Show in docs artifact for approval (new preview artifact). Keep old artifact C3gQX5cvWDqoqCA2pqtqjv untouched.

Toolchain facts (verified):
- vite.config: stylex.vite({ useCSSLayers: true, unstable_moduleResolution: { type: "commonJS", rootDir } }) BEFORE react().
- package.json "browserslist" modern → light-dark() stays native (dev + build). Theme = color-scheme on :root[data-theme].
- defineVars only in *.stylex.ts named exports. stylex.when.ancestor(":hover") + stylex.defaultMarker() works. Dynamic styles: arrow fns w/ simple args.
- Never put className after spread of stylex.props — use sx() helper that merges.

Structure:
- tokens/*.stylex.ts (color, space, radius, font, shadow/depth, motion, z)
- components/<category>.tsx ; components/index.ts barrel ; utils sx()
- docs-site (StyleX chrome), templates restyled.

Progress log:
- DONE: tokens/tokens.stylex.ts, components/{lib/sx.ts, styles.css, icons.tsx, spinner.tsx, action.tsx, overlay.tsx, content.tsx, feedback.tsx, inputs.tsx, choice.tsx}; preview in docs-site/src/main.tsx (temporary).
- IMPORTANT: useCSSLayers:false (StyleX sheet loads before styles.css in dev; layers broke the reset). styles.css uses only element/:root selectors.
- StyleX aliases in vite config: aliases {"@keel/tokens/*": [...]}.
- z tokens are defineConsts (numbers). Icon size prop is number.
- Direction screenshots sent to user (keel-v2-direction-light/dark.png).
- DONE components (all typecheck): action, overlay, content, feedback, inputs, choice, select, dates, pickers, container, layout, navigation, table, lists, data, chat, ai, utility (+ index.ts barrel). Full Astryx coverage verified + all v1 Keel comps + AI primitives.
- sx(p, ...styles) helper: Arg type loose; never pass raw objects as xstyle (must be stylex.create styles).
- NEXT: (1) docs-site rebuild in StyleX: registry of ~115 pages (Astryx names), demos per category in docs-site/src/demos/*.tsx (functions; code shown from raw source), auto API from TS via scripts/gen-api (typescript5 alias since TS7 has no JS API). (2) templates/ rewrite in StyleX (v1 copies at /tmp/claude-0/v1/templates). (3) skills: SKILL.md, skills/keel/*, AGENTS.md, .cursor/rules, llms.txt, claude.ai zip. (4) QA + publish NEW preview artifact (not the old one) + zip. No push, no Figma.
- DONE (docs): scripts/gen-api.mjs → docs-site/src/generated/api.json; docs-site/src/docs/{types.ts,kit.tsx}; demos/{action,chat,ai,container,content,feedback,forms,layout,navigation,overlay,table,data}.tsx. NEXT: demos/utility.tsx, docs-site/src/registry.tsx (pages), pages/{home,guides,foundations}.tsx, main.tsx shell (replace temporary preview), then templates.
- DONE: registry.tsx, pages/{guides,home}.tsx, main.tsx (docs shell), templates/* (shell, overview, customers, invoices, settings, members, audit-log, auth, assistant, index), docs-site/src/templates.tsx. NEXT: typecheck+fix, run dev, screenshot QA every page; then skills; then publish NEW artifact + zip.
