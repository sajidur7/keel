# Keel tokens

Source of truth: `tokens/tokens.stylex.ts`. Import in any StyleX file:
`import { color, depth, radius, font, motion, size, tone, z } from "@keel/tokens/tokens.stylex";`
Colors are `light-dark(light, dark)`; the theme is `color-scheme` on `<html data-theme="light|dark">` (or the OS).

## color
| Token | Use |
|---|---|
| `canvas` | page background behind everything |
| `surface` | panels, cards, tables |
| `surfaceRaised` | menus, popovers, dialogs, composer |
| `surfaceSunken` | wells, code, table headers, dialog footers |
| `surfaceInverse` / `fgInverse` | tooltips, floating selection bar |
| `muted` | quiet fills: tracks, soft buttons, chips |
| `hover` / `selected` | row and item hover / selected fills |
| `border` / `borderStrong` / `borderInput` | hairlines; stronger rings; input rings |
| `fg` `fgSoft` `fgMuted` `fgFaint` | text, from primary to placeholder |
| `icon` | default icon color |
| `inkTop` `inkBottom` `onInk` | primary button gradient and its text |
| `accent` `accentStrong` `accentSoft` `accentBorder` `focusRing` | selection, links, focus, progress |
| `success*` `warning*` `danger*` `info*` | status text, Soft bg, Border ring, Solid fill |
| `chart1`…`chart6` | categorical chart colors in order |
| `highlight` `shadeXs`…`shadeLg` | depth ingredients (prefer `depth.*`) |

## tone (tags, avatars, tinted chips)
`gray red orange amber green teal blue violet pink lime` × `Fg` / `Bg` / `Bd`. Use `toneStyle[tone]` from content.tsx for a ready style.

## depth
`raised` (secondary buttons, tiles) · `raisedHover` · `pressed` · `ink` / `inkPressed` (primary) · `solid` / `solidPressed` (accent, danger) ·
`recessed` (inputs) · `card` / `cardHover` · `popover` · `dialog` · `knob` · `focus` / `focusDanger`.
Combine with a focus ring: ``boxShadow: { default: depth.raised, ":focus-visible": `${depth.raised}, ${depth.focus}` }``.

## radius
`xs 4 · sm 6 · md 8 (controls) · lg 10 · xl 14 (cards) · xxl 18 (dialogs, composer) · full`.

## font
Families `sans` (Geist), `mono` (Geist Mono). Sizes `xs 11 · sm 12 · md 13 (UI default) · lg 14 (body) · xl 16 · h3 18 · h2 22 · h1 28 · display 36`.
Weights `regular 420 · medium 520 · semibold 600 · bold 680`. Prefer `<Text variant>` over raw sizes.

## size
Control heights `xs 24 · sm 28 · md 32 · lg 40`; `sidebar 240`, `sidebarRail 56`, `header 52`.

## motion
`fast 120ms` (hover, press) · `base 180ms` (open/close) · `slow 280ms` (sheets) · `ease` · `spring` (knobs, indicators) · `inOut`.

## z (constants)
`sticky 10 · header 20 · overlay 40 · modal 50 · popover 60 · toast 70 · tooltip 80`.
