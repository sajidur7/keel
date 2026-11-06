---
name: keel
description: Build admin screens with the Keel design system — calm, dense, dark-first UIs for back-office tools. Covers tokens (dark + light), React + Tailwind v4 + Radix components with every interaction state, Lucide icons, the app shell (248px sidebar, 52px header), list pages with filters and data tables, detail sheets, forms with validation, settings, users and roles, audit logs, overview dashboards, and a screenshot QA pass at 320/768/1024/1440 in both themes. Use whenever building, redesigning or reviewing an admin panel, back office, internal tool, CMS or SaaS settings area, in Claude Code or Claude Design.
---

# Keel — admin design system

Keel is for the admin side of products: screens people use all day to find, check and change records. It is
**dense, calm and fast to scan**. User-facing apps get their own designs; Keel does not try to be a marketing or
consumer style.

The code lives in this repo: `tokens/` (source of truth), `components/` (`_ui` primitives, `_common` app-level
pieces), `templates/` (real screens), `docs-site/` (documentation built with Keel). Import everything from
`components/index.ts`.

## Leading words

- **Dense**: tables and lists are the work. 40px rows, 13px text, 12px cell padding. Nothing decorative between
  the user and the data.
- **Calm**: a graphite ladder of surfaces and four text greys carries the hierarchy. Color appears only for
  status, category tags and one data hue — so when something is colored, it means something.
- **One bright button**: the primary action is white in dark mode, near-black in light mode. One per view.
  Never a blue or purple CTA.
- **Every state**: hover, focus-visible, active, selected, disabled, loading, empty, error and read-only are
  designed for every control and every panel — not added later.
- **Keyboard**: ⌘K command palette, visible focus rings, shortcuts shown as `Kbd` where actions live.

## Build a screen

1. **Name the job.** One sentence: what does the user come here to do, and what do they do next? List the
   records, the 3–6 attributes that decide an action, the primary action, and the destructive actions. Done
   when you can say which component answers each item ([components.md](references/components.md) → choice table).
2. **Pick the page pattern** ([patterns.md](references/patterns.md)): list page, detail sheet vs detail page,
   create/edit form, settings, users and roles, audit log, overview, auth. Start from the matching file in
   `templates/` when one exists. Done when the page has one pattern and you know why.
3. **Lay it out in the shell** ([layout.md](references/layout.md)): `AppShell` → `Sidebar` → `Header` (title,
   status, actions, tabs) → `Page` → toolbar → content. Group with whitespace and hairlines; reach for `Card`
   only when grouping truly needs a boundary. Done when nothing is boxed that didn't need to be.
4. **Use tokens only** ([tokens.md](references/tokens.md)). Tailwind's default palette is switched off; write
   `bg-card`, `text-subtle`, `border-line-strong`, `shadow-raised`, `rounded-md`. No hex, no `blue-500`, no
   arbitrary colors. Done when a search for `#` and `rgb(` in your JSX finds nothing.
5. **Design every state** ([states.md](references/states.md)): loading (skeleton shaped like the content),
   empty (first use vs filtered), error (inline, with retry), no permission, offline, read-only, and each
   control's hover/focus/disabled. Done when each panel has been seen in each state.
6. **Write the words**: sentence case, verb + object buttons ("Send invoice", "Delete 3 customers"), errors
   that say how to fix it. No "Submit", "OK", "Success!", "Please".
7. **Run the QA pass** ([qa.md](references/qa.md)): screenshots at 320, 768, 1024 and 1440 in dark and light;
   no page-level horizontal scroll, no clipped text, focus visible, numbers right-aligned and tabular. Done when
   every check passes on screenshots you looked at.

## Rules that apply everywhere

- **Primary vs the rest**: `variant="primary"` once per view. Secondary is the default. Ghost/subtle in dense
  toolbars. `danger` only to confirm destruction; destructive menu items are red text, last, after a separator.
- **Status ≠ category**: state that changes (paid, overdue, live) is a `StatusPill` (grey pill, colored dot,
  the word carries meaning). Categories (plan, segment) are `Tag` tones, one meaning per tone per product.
- **Numbers**: `align="right"` in tables (applies tabular figures), compact on axes, `—` for no data, never a
  fake `$0`. Every headline number has a baseline ("+6.2% vs Oct"); lower-is-better metrics flip colors.
- **Tables scroll inside themselves**, never the page. Hide secondary columns on small screens with
  `showFrom`. Name column first with a muted second line; row actions last as a `…` menu.
- **Sheets for triage, pages for destinations**: open a row in a right `Sheet` when the user will return to the
  list; give it a page with a breadcrumb when it has its own tabs and history; use a `Dialog` only for a small
  single task.
- **Friction matches risk**: reversible → do it + toast with Undo; irreversible routine → `ConfirmDialog` naming
  object and count; irreversible large → `ConfirmDialog` with `confirmText`; low-risk single object → `Popconfirm`.
- **Icons are Lucide** through Keel wrappers (`IconSearch`, `IconTrash`…): 16px, 14px in small controls,
  1.5px stroke. Another Lucide icon: `export const IconTruck = keelIcon(Truck)`. Icon-only buttons need a
  `label`. No emoji as icons.
- **Motion** is short and quiet: 120ms hover/press, 180ms popovers, 260ms sheets, ease-out in, ease-in out.
  Reduced motion turns it all off.
- **Responsive 320 → wide**: sidebar becomes a drawer below 1024px; toolbars wrap; forms go single column below
  768px; dialogs and sheets go full width on phones.

## Avoid

Excessive cards and boxes · gradients · glassmorphism or backdrop blur · decorative illustrations · emoji ·
rainbow dashboards (one data hue, grey comparisons) · giant hero sections · charts to fill space · icon squares
next to every KPI · sentences under numbers (explanations go in tooltips) · generic Tailwind-template look ·
Inter or Space Grotesk · purple or blue as the brand color · hard-coded colors · disabled buttons with no
explanation · zebra striping and vertical table lines · page-level horizontal scroll.

## Critique an existing admin screen

1. One-line verdict. 2. What works (2–4 specifics). 3. Issues ranked by harm: **task** (can the user find,
check and change the record fast?) → **honesty** (numbers that disagree, misleading deltas) → **salience** (does
the eye land on what needs action?) → **hierarchy** (boxes doing the job type should do) → **states** (missing
loading/empty/error/focus) → **words** → polish. Each issue: element, what the user sees, the Keel fix.
4. Offer to fix in one pass with screenshots before and after.

## Claude Design and Figma

- In **Claude Design**, use the Keel Design System artifact (tokens, components, guidelines) and follow the
  same rules. Dark theme first; check light.
- The **Figma library** (“Keel — Admin Design System”) has the same tokens as Figma Variables — collection
  *Keel / Color* with Dark and Light modes, *Keel / Dimension* — plus Keel text and effect styles, Lucide icon
  components, and component sets with every state. Details: [figma.md](references/figma.md).

## Reference files

| File | Read when |
|---|---|
| [tokens.md](references/tokens.md) | Choosing any color, size, radius, shadow, motion value |
| [components.md](references/components.md) | Picking a component; its key props and traps |
| [layout.md](references/layout.md) | Shell, page widths, grids, breakpoints, spacing rhythm |
| [states.md](references/states.md) | The state matrix and how each state looks |
| [patterns.md](references/patterns.md) | List, detail, form, settings, roles, audit, overview, auth |
| [snippets.md](references/snippets.md) | Copy-ready code for the common screens |
| [qa.md](references/qa.md) | Before showing anyone: the screenshot pass |
| [figma.md](references/figma.md) | Working in the Figma library or syncing tokens |
