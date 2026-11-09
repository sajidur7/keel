# Styling with StyleX in Keel

Keel uses StyleX (https://stylexjs.com) — atomic CSS compiled at build time. **No Tailwind, no CSS modules.**

## Rules
- Define styles with `stylex.create` at module level; apply with `{...stylex.props(s.a, cond && s.b)}`.
- Keel components take `xstyle` for overrides (applied last): `<Button xstyle={s.wide} />`. Pass compiled styles only — never raw objects.
- Tokens come from `tokens/tokens.stylex.ts`. New variables go in a `*.stylex.ts` file via `stylex.defineVars` (named exports only).
- Values allowed in `create`: literals, numbers (become px), tokens, template strings of tokens. No function calls (except StyleX ones), no spreads, no imports except `.stylex.ts` vars.
- Merge your own className with StyleX through the `sx(props, ...styles)` helper in `components/lib/sx.ts` — never put `className=` after a `{...stylex.props()}` spread (it overwrites it).

## Patterns
```ts
const s = stylex.create({
  row: {
    display: "flex", gap: 8, padding: 12, borderRadius: radius.lg,
    backgroundColor: { default: "transparent", ":hover": color.hover },          // pseudo-class
    outline: "none", ":focus-visible": { boxShadow: depth.focus },
    flexDirection: { default: "column", "@media (min-width: 768px)": "row" },      // media query
    ":is([data-state=open])": { backgroundColor: color.selected },                // Radix state attributes
  },
  icon: { opacity: { default: 0, [stylex.when.ancestor(":hover")]: 1 } },         // parent hover (add stylex.defaultMarker() on the parent)
  bar: (w: number) => ({ width: w }),                                              // dynamic style
  "::placeholder": {},                                                             // pseudo-elements are top-level keys
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });       // keyframes in the same file
```

## Build config (Vite)
```ts
stylex.vite({ useCSSLayers: false, unstable_moduleResolution: { type: "commonJS", rootDir }, aliases: { "@keel/tokens/*": [path + "/tokens/*"] } })
```
Put it before `react()`. Keep `browserslist` modern (Chrome 123+, Safari 17.5+, Firefox 120+) so `light-dark()` ships unchanged.
`components/styles.css` contains only element and `:root` selectors (a reset, fonts, theme switch), so any StyleX class wins.

## Icons
Lucide via Keel names. Inside Button/Input/menus they size from `IconSizeContext` — don't pass `size` unless you need a different one.
