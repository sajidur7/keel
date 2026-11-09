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

  // Accent — selection, focus, links, progress. Used sparingly.
  accent: ld("#3a5cf0", "#7b93ff"),
  accentStrong: ld("#2b49d6", "#a3b4ff"),
  accentTop: ld("#5675ff", "#5f7cff"),
  accentBottom: ld("#3152e8", "#3d5ce8"),
  accentSoft: ld("rgba(58,92,240,0.10)", "rgba(123,147,255,0.14)"),
  accentBorder: ld("rgba(58,92,240,0.32)", "rgba(123,147,255,0.36)"),
  onAccent: ld("#ffffff", "#ffffff"),
  focusRing: ld("rgba(58,92,240,0.35)", "rgba(123,147,255,0.45)"),

  // Status (text, soft background, border, solid top/bottom for 3D fills)
  success: ld("#15803d", "#4ade80"),
  successSoft: ld("rgba(22,163,74,0.10)", "rgba(74,222,128,0.12)"),
  successBorder: ld("rgba(22,163,74,0.28)", "rgba(74,222,128,0.28)"),
  successSolid: ld("#16a34a", "#22c55e"),
  warning: ld("#b45309", "#fbbf24"),
  warningSoft: ld("rgba(217,119,6,0.11)", "rgba(251,191,36,0.12)"),
  warningBorder: ld("rgba(217,119,6,0.30)", "rgba(251,191,36,0.28)"),
  warningSolid: ld("#d97706", "#f59e0b"),
  danger: ld("#dc2626", "#ff7b7b"),
  dangerSoft: ld("rgba(220,38,38,0.09)", "rgba(255,107,107,0.13)"),
  dangerBorder: ld("rgba(220,38,38,0.28)", "rgba(255,107,107,0.30)"),
  dangerTop: ld("#ef4444", "#f05252"),
  dangerBottom: ld("#d42020", "#c92a2a"),
  info: ld("#2563eb", "#7cb0ff"),
  infoSoft: ld("rgba(37,99,235,0.09)", "rgba(124,176,255,0.12)"),
  infoBorder: ld("rgba(37,99,235,0.26)", "rgba(124,176,255,0.28)"),

  // Depth ingredients (combined in `depth` below)
  highlight: ld("rgba(255,255,255,0.9)", "rgba(255,255,255,0.07)"),
  shadeXs: ld("rgba(17,17,26,0.06)", "rgba(0,0,0,0.35)"),
  shadeSm: ld("rgba(17,17,26,0.08)", "rgba(0,0,0,0.45)"),
  shadeMd: ld("rgba(17,17,26,0.10)", "rgba(0,0,0,0.5)"),
  shadeLg: ld("rgba(17,17,26,0.16)", "rgba(0,0,0,0.6)"),
  buttonTop: ld("#ffffff", "#26262c"),
  buttonBottom: ld("#f6f6f8", "#1e1e23"),
  knob: ld("#ffffff", "#f4f4f6"),

  // Charts (categorical, colorblind-checked order)
  chart1: ld("#3a5cf0", "#7b93ff"),
  chart2: ld("#0ea5a4", "#2dd4bf"),
  chart3: ld("#e0891b", "#fbbf24"),
  chart4: ld("#d9467a", "#f472b6"),
  chart5: ld("#7c5cd6", "#a78bfa"),
  chart6: ld("#6b7280", "#9ca3af"),
});

/* Tag / token tones — fg, bg, border for each hue. */
export const tone = stylex.defineVars({
  grayFg: ld("#52525b", "#c4c4cc"), grayBg: ld("#f1f1f4", "rgba(255,255,255,0.07)"), grayBd: ld("rgba(17,17,26,0.10)", "rgba(255,255,255,0.10)"),
  redFg: ld("#c42121", "#ff8a8a"), redBg: ld("#fdeeee", "rgba(255,107,107,0.12)"), redBd: ld("#f8cfcf", "rgba(255,107,107,0.24)"),
  orangeFg: ld("#c2410c", "#fdba74"), orangeBg: ld("#fff1e8", "rgba(251,146,60,0.12)"), orangeBd: ld("#fbd5bd", "rgba(251,146,60,0.24)"),
  amberFg: ld("#a16207", "#fcd34d"), amberBg: ld("#fdf6e3", "rgba(251,191,36,0.11)"), amberBd: ld("#f4e1a8", "rgba(251,191,36,0.24)"),
  greenFg: ld("#15803d", "#86efac"), greenBg: ld("#ebf8f0", "rgba(74,222,128,0.11)"), greenBd: ld("#c4ead2", "rgba(74,222,128,0.22)"),
  tealFg: ld("#0f766e", "#5eead4"), tealBg: ld("#e7f7f5", "rgba(45,212,191,0.11)"), tealBd: ld("#bce6e0", "rgba(45,212,191,0.22)"),
  blueFg: ld("#2b49d6", "#a3b4ff"), blueBg: ld("#edf1fe", "rgba(123,147,255,0.13)"), blueBd: ld("#cdd7fb", "rgba(123,147,255,0.26)"),
  violetFg: ld("#6d28d9", "#c4b5fd"), violetBg: ld("#f3effe", "rgba(167,139,250,0.13)"), violetBd: ld("#dcd1fb", "rgba(167,139,250,0.26)"),
  pinkFg: ld("#be185d", "#f9a8d4"), pinkBg: ld("#fdeef5", "rgba(244,114,182,0.12)"), pinkBd: ld("#f7cfe1", "rgba(244,114,182,0.24)"),
  limeFg: ld("#4d7c0f", "#bef264"), limeBg: ld("#f2f9e6", "rgba(190,242,100,0.10)"), limeBd: ld("#dbedbb", "rgba(190,242,100,0.22)"),
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
  focus: `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}`,
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
