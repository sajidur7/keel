# Tokens

Source of truth: `tokens/tokens.json`. `npm run tokens` writes `tokens/tokens.css` (CSS variables, dark default
+ `[data-theme="light"]`), `tokens/theme.css` (Tailwind v4 `@theme`), `tokens/figma-variables.json` and
`tokens/tokens.studio.json`. Never edit the generated files.

Setup in an app's CSS:

```css
@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "<keel>/components/styles.css";
```

Theme: dark by default. Set `data-theme="light"` on `<html>` for light. Components never use `dark:` variants;
the same utility resolves per theme.

## Color (utility name → role)

| Token | Dark | Light | Use |
|---|---|---|---|
| `background` | #111214 | #fafaf9 | Page canvas |
| `surface` | #18191c | #f3f3f1 | Sidebar, table footer, read-only fields, quiet zones |
| `card` | #1e2023 | #ffffff | Controls, cards, sheets, dialogs |
| `popover` | #1b1c1f | #ffffff | Menus, popovers, tooltips |
| `muted` | #27292d | #ececea | Segmented track, count badges, muted button |
| `hover` / `selected` | white 4.5% / 7.5% | black 4% / 6.5% | Row & item hover, selected rows |
| `border` | #24262a | #e7e7e4 | Hairlines between rows and sections |
| `input` | #2f3237 | #dcdcd8 | Field ring at rest |
| `line-strong` | #373a40 | #d3d3cf | Hovered field ring, checkbox ring, dropzone |
| `foreground` | #ededee | #17181a | Primary text |
| `soft` | #a6a9b1 | #53534d | Secondary text, values in lists |
| `subtle` | #6f727b | #7d7d77 | Labels, metadata, table headers |
| `faint` | #4b4e55 | #a7a7a1 | Placeholders, eyebrows, disabled |
| `icon` | #8b8e97 | #6c6c66 | Icons at rest |
| `primary` / `primary-foreground` | #f2f2f3 / #111214 | #17181a / #fafaf9 | The primary button, checked controls |
| `ring` | 55% foreground | 50% foreground | Focus ring |
| `data` / `data-muted` / `track` | #3ec8b4 / #24524b / #2e3135 | #14998a / #b8e3dc / #e2e2de | Live dots, chart series, progress |
| `success` `warning` `danger` `info` | | | Status text/dots; each has `-bg` and `-border` |
| `danger-solid` | #d9443c | #c8382f | Danger button fill |

Tag tones (`tag-{tone}-bg|border|text`): neutral, blue, cyan, teal, green, yellow, orange, red, pink, violet.

Rules: text uses only `foreground/soft/subtle/faint` (+ status colors for status words). Never lower text
contrast with opacity — pick the next grey. Selection is a tint (`bg-selected`), not a colored border.

## Type

Geist (sans) and Geist Mono. Utilities: `text-stat` 28 · `text-display` 22 · `text-page` 18 · `text-title` 16 ·
`text-body` 14 · `text-small` 13 · `text-caption` 12 · `text-eyebrow` 11. Weights 400 / 500 / 600 only.
`eyebrow` utility = 11px, 500, uppercase, 0.08em, `faint` — section labels and KPI labels. `tabular` utility for
numbers. Sentence case everywhere.

## Space, size, radius

- Spacing: Tailwind's 4px scale (`p-3` = 12px). Rhythm: 8 inside controls, 12 between related items, 16–24
  between groups, 32–48 between page sections.
- Controls: 22 / 26 / 30 / 36px (`xs/sm/md/lg`). Table header 36, rows 32 / 40 / 48. Sidebar 248 (rail 56).
  Header 52. Sheet 440 (360–720).
- Radius: `rounded-xs` 3 (kbd) · `sm` 5 (menu items) · `md` 8 (buttons, inputs) · `lg` 10 (cards, menus,
  tables) · `xl` 12 (dialogs, sheets) · `full` (tags, pills, avatars). Controls are rectangles; labels are pills.

## Elevation

`shadow-raised` (1px top highlight + ring; secondary buttons, active nav), `shadow-raised-primary`,
`shadow-field` (input ring), `shadow-card` (ring, no drop), `shadow-overlay` (menus, dialogs, sheets),
`shadow-focus` (focus-visible ring). In-flow elements never get drop shadows. Max two floating layers.

## Motion

`duration-fast` 120ms (hover, press) · `duration-base` 180ms (popovers, switches) · `duration-slow` 260ms
(sheets, progress). `ease-out` to enter, `ease-in` to exit, `ease-in-out` for movement. Under
`prefers-reduced-motion` all durations are 0.

## Z-index

sticky 10 · sidebar 20 · header 30 · dropdown 40 · sheet 50 · modal 60 · popover 70 · toast 80 · tooltip 90.
Use as `z-(--z-dropdown)`.
