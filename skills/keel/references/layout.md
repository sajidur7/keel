# Layout

## The shell

```
AppShell
├─ Sidebar (248px, resizable 200–360, rail 56; drawer < 1024px)
│   ├─ SidebarBrand       52px, logo + workspace + switcher
│   ├─ search button      opens ⌘K
│   ├─ SidebarContent     SidebarSection (eyebrow title) → SidebarItem (30px, icon, label, count)
│   └─ SidebarFooter      plan/usage, help
└─ column
    ├─ Header             52px: SidebarTrigger · title · status · actions · notifications · avatar; tabs below
    └─ Page               px 12 / 16 / 24 (sm / lg); width full | wide 1280 | narrow 760
        ├─ PageHeading    (only when the header title isn't enough)
        ├─ PageToolbar    search, filters (wrap) · sort/view (right)
        └─ content
```

- Header and Page share horizontal padding so tabs, toolbar and table edges line up.
- One `Header` per screen. Primary action lives in the header's `actions`.
- The page scrolls; sidebar and header stay. Tables scroll inside `TableContainer`.

## Widths

| Page | Width |
|---|---|
| Lists, tables, audit logs | `full` |
| Dashboards, settings with tabs | `wide` (1280) |
| Forms, single record pages | `narrow` (760); form column ≤ 640 |
| Auth | 360 column, centered |

## Grids and rhythm

- `Grid cols={2|3|4|6}` steps down automatically. Gaps 8 / 16 / 24.
- Vertical rhythm: 4–8 inside a control, 12 between related items, 16–24 between groups, 32–48 between
  sections. Separate sections with `border-t border-border` + padding, not cards.
- Settings and long forms: `FormSection` = 240px title column + fields (stacked below 1024px).
- Detail: `SheetSection` with eyebrow titles and hairlines.

## Breakpoints

xs 320 (supported minimum) · sm 640 · md 768 (forms go horizontal, two-column grids) · lg 1024 (sidebar
docks) · xl 1280 (more table columns) · 2xl 1536.

## Responsive rules

- < 1024: sidebar → drawer (`SidebarTrigger` opens it); header actions collapse to icon buttons or a menu.
- < 768: forms single column; `DescriptionList columns={2}` → 1; split panes stack; date range shows one month.
- < 640: sheets and dialogs full width; pagination compact; breadcrumbs collapse middle items; toolbar
  wraps; secondary table columns hidden with `showFrom`.
- Never hide the primary action or the record name.
