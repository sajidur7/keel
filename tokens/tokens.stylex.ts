/**
 * Keel v2 design tokens — the single source of truth.
 *
 * Every color is written once as `light-dark(light, dark)`. The theme is chosen by
 * `color-scheme` on the root (`<html data-theme="light|dark">`, or the OS setting when
 * no attribute is set), so there is no class to apply and no flash on switch.
 *
 * Use these from any component:  import { color, depth, radius, font, motion } from "@keel/tokens/tokens.stylex";
 */
import * as stylex from "@stylexjs/stylex";

const ld = (light: string, dark: string) => `light-dark(${light}, ${dark})`;

/* ------------------------------------------------------------------ color */
export const color = stylex.defineVars({
  // Surfaces, back to front
  canvas: ld("#f4f4f6", "#09090b"), // page behind everything
  surface: ld("#ffffff", "#121215"), // panels, cards, table
  surfaceRaised: ld("#ffffff", "#19191d"), // menus, popovers, dialogs
  surfaceSunken: ld("#f7f7f9", "#0d0d10"), // wells, code, inputs at rest
  surfaceInverse: ld("#18181b", "#f4f4f6"),
  muted: ld("#efeff2", "#1c1c21"), // quiet fills (secondary chips, tracks)
  hover: ld("rgba(17,17,26,0.045)", "rgba(255,255,255,0.055)"),
  selected: ld("rgba(17,17,26,0.075)", "rgba(255,255,255,0.09)"),
  scrim: ld("rgba(10,10,14,0.32)", "rgba(0,0,0,0.6)"),

  // Lines
  border: ld("rgba(17,17,26,0.10)", "rgba(255,255,255,0.08)"),
  borderStrong: ld("rgba(17,17,26,0.16)", "rgba(255,255,255,0.14)"),
  borderInput: ld("rgba(17,17,26,0.14)", "rgba(255,255,255,0.11)"),

  // Text & icons
  fg: ld("#17171b", "#ededf0"),
  fgSoft: ld("#4b4b55", "#b4b4be"),
  fgMuted: ld("#6e6e79", "#83838f"),
  fgFaint: ld("#a0a0aa", "#5a5a65"),
  icon: ld("#6b6b76", "#8d8d99"),
  fgInverse: ld("#ffffff", "#111114"),

  // Ink — the primary action. Black on light, white on dark (never brand-colored).
  inkTop: ld("#34343b", "#ffffff"),
  inkBottom: ld("#17171b", "#dedee4"),
  inkRing: ld("#0b0b0e", "rgba(0,0,0,0.55)"),
  inkHighlight: ld("rgba(255,255,255,0.22)", "rgba(255,255,255,1)"),
  inkShade: ld("rgba(0,0,0,0.28)", "rgba(0,0,0,0.16)"),
  onInk: ld("#ffffff", "#111114"),
  inkWash: ld("rgba(255,255,255,0.09)", "rgba(0,0,0,0.045)"), // hover layer over ink
  solidWash: ld("rgba(255,255,255,0.12)", "rgba(255,255,255,0.08)"), // hover layer over accent/danger
  buttonWash: ld("rgba(17,17,26,0.025)", "rgba(255,255,255,0.035)"), // hover layer over secondary

  // Accent — selection, focus, links, progress, the active nav item. Flat blue, never a gradient.
  accent: ld("#2b5cff", "#7d9bff"),
  accentStrong: ld("#1d47d8", "#a8bcff"),
  accentTop: ld("#2b5cff", "#7d9bff"),
  accentBottom: ld("#2b5cff", "#7d9bff"),
  accentSoft: ld("rgba(43,92,255,0.07)", "rgba(125,155,255,0.12)"),
  accentBorder: ld("rgba(43,92,255,0.30)", "rgba(125,155,255,0.34)"),
  onAccent: ld("#ffffff", "#0b0f1f"),
  focusRing: ld("rgba(43,92,255,0.14)", "rgba(125,155,255,0.20)"),

  // Blue — the one hue. Flat, never a gradient. Links, focus, the primary chart series, "now" markers.
  blue: ld("#2b5cff", "#7d9bff"),
  blueStrong: ld("#1d47d8", "#a8bcff"),
  blueSoft: ld("rgba(43,92,255,0.08)", "rgba(125,155,255,0.13)"),
  blueBorder: ld("rgba(43,92,255,0.28)", "rgba(125,155,255,0.32)"),
  onBlue: ld("#ffffff", "#0b0f1f"),

  // Status. Monochrome too — meaning comes from icon + word, not hue.
  // Only `danger` keeps a color, and only for errors and destructive actions.
  success: ld("#17171b", "#ededf0"),
  successSoft: ld("rgba(17,17,26,0.05)", "rgba(255,255,255,0.07)"),
  successBorder: ld("rgba(17,17,26,0.16)", "rgba(255,255,255,0.16)"),
  successSolid: ld("#17171b", "#ededf0"),
  warning: ld("#4b4b55", "#b4b4be"),
  warningSoft: ld("rgba(17,17,26,0.04)", "rgba(255,255,255,0.05)"),
  warningBorder: ld("rgba(17,17,26,0.22)", "rgba(255,255,255,0.22)"),
  warningSolid: ld("#8a8a94", "#7a7a85"),
  danger: ld("#d42020", "#ff6b6b"),
  dangerSoft: ld("rgba(212,32,32,0.07)", "rgba(255,107,107,0.11)"),
  dangerBorder: ld("rgba(212,32,32,0.24)", "rgba(255,107,107,0.28)"),
  dangerTop: ld("#e53535", "#ef4b4b"),
  dangerBottom: ld("#c81c1c", "#c92a2a"),
  info: ld("#4b4b55", "#b4b4be"),
  infoSoft: ld("rgba(17,17,26,0.04)", "rgba(255,255,255,0.05)"),
  infoBorder: ld("rgba(17,17,26,0.14)", "rgba(255,255,255,0.14)"),

  // Depth ingredients (combined in `depth` below)
  highlight: ld("rgba(255,255,255,0.9)", "rgba(255,255,255,0.07)"),
  shadeXs: ld("rgba(17,17,26,0.06)", "rgba(0,0,0,0.35)"),
  shadeSm: ld("rgba(17,17,26,0.08)", "rgba(0,0,0,0.45)"),
  shadeMd: ld("rgba(17,17,26,0.10)", "rgba(0,0,0,0.5)"),
  shadeLg: ld("rgba(17,17,26,0.16)", "rgba(0,0,0,0.6)"),
  buttonTop: ld("#ffffff", "#26262c"),
  buttonBottom: ld("#f6f6f8", "#1e1e23"),
  knob: ld("#ffffff", "#f4f4f6"),

  // Charts — series 1 is blue (the one that matters), the rest a grey ramp.
  chart1: ld("#2b5cff", "#7d9bff"),
  chart2: ld("#17171b", "#ededf0"),
  chart3: ld("#b4b4bc", "#5c5c66"),
  chart4: ld("#45454d", "#cfcfd6"),
  chart5: ld("#d6d6dc", "#3a3a42"),
  chart6: ld("#93939c", "#77777f"),
});

/* Tag / token tones — fg, bg, border for each hue. */
/* Tag / token tones. Monochrome plus one blue: hues collapse into weights of grey; blue stays blue, red stays red.
   Names are kept so existing code keeps working. */
const soft = { fg: ld("#52525b", "#c4c4cc"), bg: ld("#f1f1f4", "rgba(255,255,255,0.07)"), bd: ld("rgba(17,17,26,0.10)", "rgba(255,255,255,0.10)") };
const line = { fg: ld("#17171b", "#ededf0"), bg: ld("#ffffff", "rgba(255,255,255,0.02)"), bd: ld("rgba(17,17,26,0.22)", "rgba(255,255,255,0.22)") };
const solid = { fg: ld("#ffffff", "#111114"), bg: ld("#26262c", "#e4e4e9"), bd: ld("#17171b", "#ffffff") };
const quiet = { fg: ld("#6e6e79", "#8d8d99"), bg: ld("transparent", "transparent"), bd: ld("rgba(17,17,26,0.14)", "rgba(255,255,255,0.14)") };
const strong = { fg: ld("#17171b", "#ededf0"), bg: ld("#e4e4e9", "rgba(255,255,255,0.14)"), bd: ld("rgba(17,17,26,0.16)", "rgba(255,255,255,0.16)") };
export const tone = stylex.defineVars({
  grayFg: soft.fg, grayBg: soft.bg, grayBd: soft.bd,
  redFg: ld("#c42121", "#ff8a8a"), redBg: ld("#fdeeee", "rgba(255,107,107,0.12)"), redBd: ld("#f8cfcf", "rgba(255,107,107,0.24)"),
  orangeFg: quiet.fg, orangeBg: quiet.bg, orangeBd: quiet.bd,
  amberFg: quiet.fg, amberBg: quiet.bg, amberBd: quiet.bd,
  greenFg: line.fg, greenBg: line.bg, greenBd: line.bd,
  tealFg: line.fg, tealBg: line.bg, tealBd: line.bd,
  blueFg: ld("#1d47d8", "#a8bcff"), blueBg: ld("rgba(43,92,255,0.07)", "rgba(125,155,255,0.12)"), blueBd: ld("rgba(43,92,255,0.22)", "rgba(125,155,255,0.26)"),
  violetFg: strong.fg, violetBg: strong.bg, violetBd: strong.bd,
  pinkFg: solid.fg, pinkBg: solid.bg, pinkBd: solid.bd,
  limeFg: line.fg, limeBg: line.bg, limeBd: line.bd,
});

/* ------------------------------------------------------------------ depth
   The "tactile" system. Every raised thing has three layers:
   a 1px top highlight (light catching the edge), a hairline ring, and a soft drop.
   Pressed things lose the drop and gain an inner shade. */
export const depth = stylex.defineVars({
  none: "0 0 #0000",
  ring: `0 0 0 1px ${color.border}`,
  raised: `inset 0 1px 0 ${color.highlight}, 0 0 0 1px ${color.borderStrong}, 0 1px 2px ${color.shadeSm}, 0 2px 4px -2px ${color.shadeXs}`,
  raisedHover: `inset 0 1px 0 ${color.highlight}, 0 0 0 1px ${color.borderStrong}, 0 2px 4px ${color.shadeSm}, 0 4px 8px -4px ${color.shadeMd}`,
  pressed: `inset 0 1px 2px ${color.shadeMd}, 0 0 0 1px ${color.borderStrong}`,
  ink: `inset 0 1px 0 ${color.inkHighlight}, inset 0 -1px 0 ${color.inkShade}, 0 0 0 1px ${color.inkRing}, 0 1px 2px ${color.shadeMd}, 0 3px 6px -3px ${color.shadeLg}`,
  inkPressed: `inset 0 1px 3px ${color.inkShade}, 0 0 0 1px ${color.inkRing}`,
  solid: `inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.22), 0 1px 2px ${color.shadeMd}, 0 3px 6px -3px ${color.shadeLg}`,
  solidPressed: `inset 0 1px 3px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.25)`,
  recessed: `inset 0 1px 1.5px ${color.shadeXs}, 0 0 0 1px ${color.borderInput}`,
  card: `0 0 0 1px ${color.border}, 0 1px 2px ${color.shadeXs}, 0 2px 6px -2px ${color.shadeXs}`,
  cardHover: `0 0 0 1px ${color.borderStrong}, 0 2px 4px ${color.shadeSm}, 0 8px 20px -8px ${color.shadeMd}`,
  popover: `inset 0 1px 0 ${color.highlight}, 0 0 0 1px ${color.borderStrong}, 0 4px 10px -2px ${color.shadeMd}, 0 16px 32px -12px ${color.shadeLg}`,
  dialog: `inset 0 1px 0 ${color.highlight}, 0 0 0 1px ${color.borderStrong}, 0 12px 28px -6px ${color.shadeLg}, 0 32px 64px -24px ${color.shadeLg}`,
  knob: `0 0 0 0.5px rgba(0,0,0,0.12), 0 1px 1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.22)`,
  focus: `0 0 0 2px ${color.surface}, 0 0 0 3.5px ${color.blue}`,
  focusDanger: `0 0 0 1px ${color.danger}, 0 0 0 4px ${color.dangerBorder}`,
});

/* ------------------------------------------------------------------ shape & type */
export const radius = stylex.defineVars({
  xs: "4px", sm: "6px", md: "8px", lg: "10px", xl: "14px", xxl: "18px", full: "999px",
});

export const font = stylex.defineVars({
  sans: '"Geist Variable", "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"Geist Mono Variable", "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace',
  // sizes
  xs: "11px", sm: "12px", md: "13px", lg: "14px", xl: "16px", h3: "18px", h2: "22px", h1: "28px", display: "36px",
  // weights
  regular: "420", medium: "520", semibold: "600", bold: "680",
});

export const motion = stylex.defineVars({
  fast: "120ms", base: "180ms", slow: "280ms",
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
});

/* Control heights — one scale for buttons, inputs, selects, segmented, toggles. */
export const size = stylex.defineVars({
  xs: "24px", sm: "28px", md: "32px", lg: "40px",
  sidebar: "240px", sidebarRail: "56px", header: "52px",
});

/* Stacking order (constants, inlined at build). */
export const z = stylex.defineConsts({
  sticky: 10, header: 20, overlay: 40, modal: 50, popover: 60, toast: 70, tooltip: 80,
});
