---
name: keel
description: Build admin and back-office UIs with the Keel v2 design system — React 19 + Radix + StyleX (never Tailwind), tactile 3D buttons, recessed inputs, light/dark tokens, 140+ components (tables, forms, pickers, overlays, navigation, charts, chat and AI-agent primitives) and full page templates. Use whenever building, redesigning or reviewing an admin panel, dashboard, CRM, internal tool, settings area or AI assistant screen with Keel.
---

# Keel v2 — tactile admin design system

Keel is for the screens people use all day to find, check and change records — and, increasingly, to work with an
AI assistant. It is **dense, calm and tactile**: things you press look pressable, fields look like wells, color is
reserved for meaning.

## Non-negotiables

1. **Styling is StyleX only.** Never write Tailwind classes, CSS modules or inline style objects for design values.
   Use `stylex.create` with Keel tokens (`color`, `depth`, `radius`, `font`, `motion`, `size`, `tone`, `z` from
   `tokens/tokens.stylex.ts`) and pass overrides to components through `xstyle`. Inline `style` only for truly
   dynamic numbers (a measured width).
2. **Use Keel components before writing markup.** Import from `@keel/components` (components/index.ts). The full
   catalog with props is in `skills/keel/references/components.md` — check it before inventing anything.
3. **Never hard-code colors or shadows.** Every color is a token written as `light-dark()`, so both themes work by
   default. Depth comes from `depth.*` tokens (raised, pressed, ink, recessed, card, popover, dialog, focus).
4. **One primary action per view.** Primary is *ink* (black in light, white in dark), not brand blue. Accent blue is for
   selection, focus, links and progress.
5. **Every interactive thing has all its states**: hover, focus-visible (accent ring), pressed (sinks 1px), disabled,
   loading, error, empty. Keel components already do; your own pieces must too.

## Setup (if the project doesn't have Keel yet)

Read `skills/keel/references/setup.md`. In short: `@stylexjs/stylex` + `@stylexjs/unplugin` (Vite plugin before React,
`useCSSLayers: false`), a modern `browserslist`, import `components/styles.css` once, wrap the app in `<KeelProvider>`.

## How to build a screen

1. Pick the pattern in `skills/keel/references/patterns.md` (list, detail drawer, form, settings, dashboard, assistant, auth).
2. Start from the matching template in `templates/` — they are complete, working screens.
3. Compose with components from the catalog. Lay out with `Page`, `PageHeading`, `Section`, `Stack`, `Grid`.
4. Style only the gaps with StyleX + tokens (`skills/keel/references/styling.md`).
5. Run the checklist in `skills/keel/references/qa.md` — both themes, 390 / 768 / 1440, keyboard only.

## Quick reference

```tsx
import * as stylex from "@stylexjs/stylex";
import { AppShell, Sidebar, SidebarItem, Header, Page, PageHeading, Button, DataTable, Drawer, DrawerContent, Field, Input, useToast } from "@keel/components";
import { color, depth, radius } from "@keel/tokens/tokens.stylex";

const s = stylex.create({ panel: { backgroundColor: color.surface, boxShadow: depth.card, borderRadius: radius.xl, padding: 16 } });
```

- Buttons: `variant` primary | secondary (default) | accent | danger | soft | outline | ghost | danger-ghost | link; `size` xs | sm | md | lg; `leading`, `trailing`, `loading`.
- Icon-only: `<IconButton label="Edit"><IconEdit /></IconButton>` — label is required and becomes the tooltip.
- Forms: wrap every control in `<Field label error description>`; controls pick up ids and invalid state.
- Lists of records: `DataTable` (sort, filter, select + floating `TableSelectionToolbar`, expand, paginate, density, columns).
- Details: `Drawer` + `DrawerContent` with `DrawerSection`s; confirmations: `AlertDialog`; quick confirm: `Popconfirm`.
- Feedback: `useToast()` after actions (with Undo), `Banner` for persistent page state, `EmptyState` for nothing-yet.
- AI: `ChatLayout` + `ChatMessage` + `ChatComposer`; `Thinking`, `ChatToolCalls`, `ApprovalCard`, `DiffTable`, `TaskList`, `InsightCard`.
- Icons: Lucide via Keel names (`IconSearch`, `IconTrash`…). Inside controls they size themselves.

## References

- `skills/keel/references/components.md` — every export with its props (generated from source).
- `skills/keel/references/tokens.md` — color, depth, radius, type, motion tokens and when to use each.
- `skills/keel/references/styling.md` — StyleX rules, `xstyle`, pseudo-classes, media queries, dynamic styles.
- `skills/keel/references/patterns.md` — page recipes with the components to use.
- `skills/keel/references/setup.md` — install and configure in a new app.
- `skills/keel/references/qa.md` — the review checklist.
