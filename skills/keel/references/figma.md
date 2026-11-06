# Figma library

File: **Keel — Admin Design System** (Figma, your team “Sajidur Rahman Shimul's team”).

## What's inside

- **Variables** — *Keel / Color* (modes **Dark** and **Light**: every color token + 30 tag tones) and
  *Keel / Dimension* (space, radius, sizes, font sizes, borders). Every variable has scopes set and a WEB code
  syntax (`var(--card)`, `var(--radius-md)`), so Dev Mode shows the exact CSS variable.
- **Styles** — Keel text styles (Eyebrow, Caption, Small, Body, Title, Page title, Display, Stat, Mono; Medium
  variants) in Geist; effect styles for overlay, raised and top highlight.
- **Icons** — 93 Lucide icons as components (`Icon/Search` …), 16px, 1.5px stroke, color bound to
  `color/icon`. Code name = `Icon` + component name.
- **Components** — component sets with `State` (and `Size`, `Variant`, `Tone`, `Checked` where relevant),
  text properties for labels, boolean properties for optional parts, instance-swap properties for icons.
  Every docs component (66) has a set; its `State=…` variants mirror the page's **All states** demo cell for cell,
  with colors bound to variables and icons as `Icon/…` instances. Layout and Pickers & upload have their own pages;
  Sheet, Command palette, Popconfirm, Spinner, Status page and Progress dots are on Feedback.

- **Templates** — the nine admin screens (Overview, Customers, Customer detail, New invoice, Settings, Members & roles,
  Audit log, Sign in, Forgot password) at 1440px, built from the same layout as the code. Colors are bound to
  variables, so each screen switches between Dark and Light; icons are instances from the Icons page.
- **Stat** — one component with toggles: Show help underline, icon, action, delta, meta, progress, chart, footer;
  `Variant=Plain | Card`, `Delta=Up | Down | Neutral`.

## Switching theme

Select a frame (or the page) → right panel → *Layer* → Variable mode → *Keel / Color* → Dark or Light. All
components follow.

## Customising like Ant's kit

- Change a **token** in `tokens/tokens.json`, run `npm run tokens`, then update the matching Figma variable
  (same name) — or re-import `tokens/tokens.studio.json` with Tokens Studio.
- Change a **component** by editing the main component on its page; instances update.
- New icon: add the Lucide icon in code with `keelIcon(…)`, run `npx tsx scripts/export-icons.tsx`, drop the SVG
  into the Icons page as a 16px component named `Icon/<Name>`, bind its stroke to `color/icon`.

## Naming

Variables `color/<token>`, `tag/<tone>/<part>`, `space/<step>`, `radius/<name>`, `size/<name>`. Components use
the code component name; variants `Property=Value`.
