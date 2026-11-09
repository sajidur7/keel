/**
 * Layout — arranging things on the page.
 * AppShell · Layout · Page · Header · PageHeading · PageToolbar · Section · Stack · HStack · VStack · Inline · Grid · Center ·
 * Divider · AspectRatio · ScrollableArea · ResizeHandle · SplitPane · Sticky
 */
import * as stylex from "@stylexjs/stylex";
import { ScrollArea as SA } from "radix-ui";
import { createElement, useRef, useState, type ComponentProps, type ElementType, type ReactNode } from "react";
import { color, depth, font, motion, radius, size as sz, z } from "../tokens/tokens.stylex";
import { px, sx, type StyleProps } from "./lib/sx";
import { SidebarProvider } from "./navigation";

const L = stylex.create({
  shell: { display: "flex", minHeight: "100dvh", width: "100%", backgroundColor: color.canvas, color: color.fg },
  shellInset: { padding: { default: 0, "@media (min-width: 768px)": 8 }, gap: { default: 0, "@media (min-width: 768px)": 8 } },
  main: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
  mainInset: {
    backgroundColor: color.surface, borderRadius: { default: 0, "@media (min-width: 768px)": radius.xl },
    boxShadow: { default: "none", "@media (min-width: 768px)": depth.card }, overflow: "clip",
  },
  banner: { flexShrink: 0 },
  // Layout (panes)
  layout: { display: "grid", gridTemplateRows: "auto 1fr auto", minHeight: 0, height: "100%", width: "100%" },
  lMid: { display: "flex", minHeight: 0, minWidth: 0 },
  lContent: { flex: 1, minWidth: 0, overflowY: "auto" },
  lSide: { flexShrink: 0, overflowY: "auto" },
  lDividers: { borderColor: color.border, borderStyle: "solid", borderWidth: 0 },
  // page & header
  page: { flex: 1, width: "100%", marginInline: "auto", paddingInline: { default: 16, "@media (min-width: 768px)": 24, "@media (min-width: 1200px)": 32 }, paddingBlock: 24, display: "flex", flexDirection: "column", gap: 20 },
  full: { maxWidth: "none" }, wide: { maxWidth: 1280 }, narrow: { maxWidth: 760 },
  header: {
    position: "sticky", top: 0, zIndex: z.header, flexShrink: 0, backgroundColor: color.surface, // solid on purpose: backdrop-filter escapes rounded clipping in Chromium
    // backdrop-filter escapes the parent's rounded clip in Chromium — take the panel's corners directly.
    borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit",
  },
  headerLine: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  headRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: sz.header, paddingInline: { default: 12, "@media (min-width: 768px)": 20 } },
  headStart: { display: "flex", alignItems: "center", gap: 8, minWidth: { default: 96, "@media (min-width: 640px)": 0 }, flexShrink: 1 },
  headTitleCol: { display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 },
  headTitleRow: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  headTitle: { fontSize: font.lg, fontWeight: font.semibold, letterSpacing: "-0.005em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  headStatus: { display: { default: "none", "@media (min-width: 640px)": "inline-flex" }, flexShrink: 0, alignItems: "center" },
  headEnd: { display: "flex", alignItems: "center", gap: 8, flexShrink: { default: 1, "@media (min-width: 640px)": 0 }, minWidth: 0, overflowX: { default: "auto", "@media (min-width: 640px)": "visible" }, scrollbarWidth: "none", paddingBlock: { default: 4, "@media (min-width: 640px)": 0 } },
  headTabs: { paddingInline: { default: 12, "@media (min-width: 768px)": 20 }, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  heading: { display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  headingText: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  h1: { fontSize: font.h1, fontWeight: font.semibold, letterSpacing: "-0.02em", lineHeight: 1.2 },
  h1Sm: { fontSize: font.h2 },
  sub: { fontSize: font.lg, color: color.fgMuted, maxWidth: "70ch", textWrap: "pretty" },
  eyebrow: { fontSize: font.xs, fontWeight: font.medium, letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgMuted },
  toolbar: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 },
  toolbarStart: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minWidth: 0, flex: 1 },
  toolbarEnd: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  // section
  section: { display: "flex", flexDirection: "column", gap: 12, minWidth: 0 },
  sectionHead: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  sectionTitle: { fontSize: font.xl, fontWeight: font.semibold, letterSpacing: "-0.01em" },
  sectionDesc: { fontSize: font.md, color: color.fgMuted },
  sectionCard: { padding: 16, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  sectionDivided: { paddingTop: 20, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border },
  // stacks
  flex: { display: "flex", minWidth: 0 },
  col: { flexDirection: "column" },
  row: { flexDirection: "row" },
  wrap: { flexWrap: "wrap" },
  gap: (g: number) => ({ gap: g }),
  align: (a: string) => ({ alignItems: a }),
  justify: (j: string) => ({ justifyContent: j }),
  grow: { flex: 1 },
  grid: { display: "grid", minWidth: 0 },
  cols: (c: string) => ({ gridTemplateColumns: c }),
  center: { display: "flex", alignItems: "center", justifyContent: "center" },
  inline: { display: "inline-flex" },
  // divider
  hr: { flexShrink: 0, backgroundColor: color.border, borderWidth: 0 },
  hrH: { height: 1, width: "100%" },
  hrV: { width: 1, alignSelf: "stretch" },
  hrStrong: { backgroundColor: color.borderStrong },
  hrDashed: { backgroundColor: "transparent", backgroundImage: `linear-gradient(90deg, ${color.borderStrong} 50%, transparent 50%)`, backgroundSize: "6px 1px" },
  hrBleed: { marginInline: -16, width: "calc(100% + 32px)" },
  labelled: { display: "flex", alignItems: "center", gap: 12, width: "100%", fontSize: font.sm, color: color.fgMuted },
  line: { flex: 1, height: 1, backgroundColor: color.border },
  // aspect
  aspect: { position: "relative", width: "100%", overflow: "hidden", backgroundColor: color.muted },
  aspectFill: { position: "absolute", inset: 0, width: "100%", height: "100%" },
  // scroll
  sa: { position: "relative", overflow: "hidden", minHeight: 0 },
  saVp: { width: "100%", height: "100%", borderRadius: "inherit" },
  saBar: { display: "flex", userSelect: "none", touchAction: "none", padding: 2, transitionProperty: "background-color", transitionDuration: motion.fast, ":hover": { backgroundColor: color.hover } },
  saBarV: { width: 10 }, saBarH: { height: 10, flexDirection: "column" },
  saThumb: { flex: 1, position: "relative", borderRadius: 10, backgroundColor: color.borderStrong, ":hover": { backgroundColor: color.fgFaint } },
  // split / resize
  split: { display: "flex", flexDirection: { default: "column", "@media (min-width: 768px)": "row" }, minHeight: 0, width: "100%" },
  pane: { minHeight: 0, minWidth: 0, overflow: "auto" },
  paneStart: { width: { default: "100%", "@media (min-width: 768px)": "var(--split)" }, flexShrink: 0 },
  paneEnd: { flex: 1, borderTopWidth: { default: 1, "@media (min-width: 768px)": 0 }, borderTopStyle: "solid", borderTopColor: color.border },
  handle: {
    position: "relative", display: { default: "none", "@media (min-width: 768px)": "block" }, width: 1, flexShrink: 0, cursor: "col-resize", outline: "none",
    backgroundColor: { default: color.border, ":hover": color.accent, ":focus-visible": color.accent, ":active": color.accent },
    transitionProperty: "background-color", transitionDuration: motion.fast,
    "::after": { content: '""', position: "absolute", top: 0, bottom: 0, left: -4, width: 9 },
  },
  handleH: { display: "block", width: "100%", height: 1, cursor: "row-resize", "::after": { content: '""', position: "absolute", left: 0, right: 0, top: -4, height: 9 } },
  grip: {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 6, height: 28, borderRadius: 4,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised, pointerEvents: "none",
  },
  sticky: { position: "sticky", zIndex: z.sticky },
});

/* ============================================================== AppShell */

export type AppShellProps = StyleProps & {
  /** <SideNav>/<Sidebar> — collapses to a rail; ⌘B toggles. */
  sideNav?: ReactNode;
  /** v1 prop name for sideNav. */
  sidebar?: ReactNode;
  /** A TopNav across the top (product-level nav). */
  topNav?: ReactNode;
  /** A full-width Banner above everything. */
  banner?: ReactNode;
  children: ReactNode;
  /** inset: content floats on a rounded panel beside the sidebar (default). flush: edge to edge. */
  variant?: "inset" | "flush";
  defaultCollapsed?: boolean;
};

/** The whole app frame: side nav + (top nav) + content. Content sits on a raised, rounded panel. */
export function AppShell({ sideNav, sidebar, topNav, banner, children, variant = "inset", defaultCollapsed, ...p }: AppShellProps) {
  const side = sideNav ?? sidebar;
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        {banner && <div {...px(L.banner)}>{banner}</div>}
        {topNav}
        <div {...sx(p, L.shell, variant === "inset" && L.shellInset)} style={{ flex: 1, minHeight: 0, ...p.style }}>
          {side}
          <div {...px(L.main, variant === "inset" && L.mainInset)}>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ============================================================== Layout (panes) */

/** Regions inside a screen: header, footer, a start pane (list), an end pane (inspector) and the content. */
export function Layout({ header, footer, start, end, children, startWidth = 280, endWidth = 320, dividers = true, ...p }: StyleProps & {
  header?: ReactNode; footer?: ReactNode; start?: ReactNode; end?: ReactNode; children: ReactNode; startWidth?: number; endWidth?: number; dividers?: boolean;
}) {
  const line = (side: "b" | "t" | "e" | "s") => dividers ? { [side === "b" ? "borderBottomWidth" : side === "t" ? "borderTopWidth" : side === "e" ? "borderInlineEndWidth" : "borderInlineStartWidth"]: 1 } : undefined;
  return (
    <div {...sx(p, L.layout)}>
      <div {...px(dividers && L.lDividers)} style={line("b")}>{header}</div>
      <div {...px(L.lMid)}>
        {start && <aside {...px(L.lSide, dividers && L.lDividers)} style={{ width: startWidth, ...line("e") }}>{start}</aside>}
        <div {...px(L.lContent)}>{children}</div>
        {end && <aside {...px(L.lSide, dividers && L.lDividers)} style={{ width: endWidth, ...line("s") }}>{end}</aside>}
      </div>
      <div {...px(dividers && L.lDividers)} style={line("t")}>{footer}</div>
    </div>
  );
}

/* ============================================================== Page & Header */

/** The scrolling body of a screen with Keel's gutters. `narrow` for forms and settings. */
export function Page({ width = "full", children, xstyle, className, style, ...rest }: Omit<ComponentProps<"main">, "className" | "style"> & StyleProps & { width?: "full" | "wide" | "narrow" }) {
  return <main {...rest} {...sx({ xstyle, className, style }, L.page, L[width])}>{children}</main>;
}

export type HeaderProps = StyleProps & {
  title: ReactNode;
  /** Pill or count beside the title (hidden under 640px). */
  status?: ReactNode;
  /** Breadcrumbs above the title. */
  breadcrumb?: ReactNode;
  /** Before the title — usually <SidebarTrigger />. */
  start?: ReactNode;
  actions?: ReactNode;
  /** Profile, notifications. */
  end?: ReactNode;
  /** Tabs as the header's bottom edge. */
  tabs?: ReactNode;
};

/** The sticky top bar of a screen: title, status, actions, profile. Frosted when content scrolls under it. */
export function Header({ title, status, breadcrumb, start, actions, end, tabs, ...p }: HeaderProps) {
  return (
    <header {...sx(p, L.header, !tabs && L.headerLine)}>
      <div {...px(L.headRow)}>
        <div {...px(L.headStart)}>
          {start}
          <div {...px(L.headTitleCol)}>
            {breadcrumb}
            <div {...px(L.headTitleRow)}><h1 {...px(L.headTitle)}>{title}</h1>{status && <span {...px(L.headStatus)}>{status}</span>}</div>
          </div>
        </div>
        <div {...px(L.headEnd)}>{actions}{end}</div>
      </div>
      {tabs && <div {...px(L.headTabs)}>{tabs}</div>}
    </header>
  );
}

/** A big title block at the top of a page body. */
export function PageHeading({ title, description, eyebrow, actions, size = "md", ...p }: StyleProps & { title: ReactNode; description?: ReactNode; eyebrow?: ReactNode; actions?: ReactNode; size?: "sm" | "md" }) {
  return (
    <div {...sx(p, L.heading)}>
      <div {...px(L.headingText)}>
        {eyebrow && <span {...px(L.eyebrow)}>{eyebrow}</span>}
        <h1 {...px(L.h1, size === "sm" && L.h1Sm)}>{title}</h1>
        {description && <p {...px(L.sub)}>{description}</p>}
      </div>
      {actions && <div {...px(L.toolbarEnd)}>{actions}</div>}
    </div>
  );
}

/** Filters and search on the left, view options/actions on the right. Wraps on small screens. */
export function PageToolbar({ children, end, ...p }: StyleProps & { children?: ReactNode; end?: ReactNode }) {
  return <div {...sx(p, L.toolbar)}><div {...px(L.toolbarStart)}>{children}</div>{end && <div {...px(L.toolbarEnd)}>{end}</div>}</div>;
}

/** A titled region of a page. `variant="card"` puts it on a surface; `divided` adds a hairline on top. */
export function Section({ title, description, action, variant = "plain", children, as = "section", ...p }: StyleProps & {
  title?: ReactNode; description?: ReactNode; action?: ReactNode; variant?: "plain" | "card" | "divided"; children: ReactNode; as?: ElementType;
}) {
  return createElement(as, sx(p, L.section, variant === "card" && L.sectionCard, variant === "divided" && L.sectionDivided),
    (title || action) && <div {...px(L.sectionHead)}><div {...px(L.headingText)}>{title && <h2 {...px(L.sectionTitle)}>{title}</h2>}{description && <p {...px(L.sectionDesc)}>{description}</p>}</div>{action}</div>,
    children,
  );
}

/* ============================================================== Stack, Grid, Center */

type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around";
const A: Record<Align, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
const J: Record<Justify, string> = { start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around" };

export type StackProps = Omit<ComponentProps<"div">, "className" | "style"> & StyleProps & {
  direction?: "column" | "row";
  /** px. Use the 4-pt scale: 4, 8, 12, 16, 20, 24, 32. */
  gap?: number;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  as?: ElementType;
};

/** Flexbox with a gap. VStack/HStack are the common shorthands. */
export function Stack({ direction = "column", gap = 12, align, justify, wrap, as = "div", children, xstyle, className, style, ...rest }: StackProps) {
  return createElement(as, { ...rest, ...sx({ xstyle, className, style }, L.flex, direction === "column" ? L.col : L.row, L.gap(gap), !!align && L.align(A[align]), !!justify && L.justify(J[justify]), wrap && L.wrap) }, children);
}
export const VStack = (p: Omit<StackProps, "direction">) => <Stack direction="column" {...p} />;
export const HStack = (p: Omit<StackProps, "direction">) => <Stack direction="row" align="center" {...p} />;
/** A wrapping row (tags, buttons). */
export const Inline = ({ gap = 8, ...p }: Omit<StackProps, "direction" | "wrap">) => <Stack direction="row" align="center" wrap gap={gap} {...p} />;

export type GridProps = Omit<ComponentProps<"div">, "className" | "style"> & StyleProps & {
  /** A number of equal columns, or "auto" with `minItemWidth` for a responsive grid. */
  columns?: number | "auto";
  minItemWidth?: number;
  gap?: number;
  /** v1: cols (1–6) collapse to 1 column on phones. */
  cols?: number;
};

/** Equal columns that collapse on small screens, or an auto-fill grid with a minimum item width. */
export function Grid({ columns, cols, minItemWidth = 240, gap = 16, children, xstyle, className, style, ...rest }: GridProps) {
  const n = columns ?? cols ?? "auto";
  const tpl = n === "auto" ? `repeat(auto-fill, minmax(min(${minItemWidth}px, 100%), 1fr))` : `repeat(auto-fit, minmax(min(${Math.max(160, Math.round(960 / n))}px, 100%), 1fr))`;
  return <div {...rest} {...sx({ xstyle, className, style }, L.grid, L.cols(tpl), L.gap(gap))}>{children}</div>;
}

/** Centers its child on both axes (empty states, loaders). */
export function Center({ children, inline, minHeight, ...p }: StyleProps & { children: ReactNode; inline?: boolean; minHeight?: number | string }) {
  return <div {...sx(p, L.center, inline && L.inline)} style={{ minHeight, ...p.style }}>{children}</div>;
}

/* ============================================================== Divider */

/** A hairline between groups. `label` puts text in the middle ("or"). */
export function Divider({ orientation = "horizontal", variant = "default", label, bleed, ...p }: StyleProps & { orientation?: "horizontal" | "vertical"; variant?: "default" | "strong" | "dashed"; label?: ReactNode; bleed?: boolean }) {
  if (label) return <div role="separator" {...sx(p, L.labelled)}><span {...px(L.line)} />{label}<span {...px(L.line)} /></div>;
  return <div role="separator" aria-orientation={orientation} {...sx(p, L.hr, orientation === "horizontal" ? L.hrH : L.hrV, variant === "strong" && L.hrStrong, variant === "dashed" && L.hrDashed, bleed && L.hrBleed)} />;
}

/* ============================================================== AspectRatio */

/** Keeps media at a ratio (16/9, 1, 4/3) while filling the width. */
export function AspectRatio({ ratio = 16 / 9, children, rounded = true, ...p }: StyleProps & { ratio?: number; children: ReactNode; rounded?: boolean }) {
  return <div {...sx(p, L.aspect)} style={{ aspectRatio: String(ratio), borderRadius: rounded ? 12 : 0, ...p.style }}><div {...px(L.aspectFill)}>{children}</div></div>;
}

/* ============================================================== ScrollableArea */

/** A scrolling region with thin custom scrollbars. Give it a height (or let a flex parent). */
export function ScrollableArea({ children, height, maxHeight, axis = "y", label, ...p }: StyleProps & { children: ReactNode; height?: number | string; maxHeight?: number | string; axis?: "x" | "y" | "both"; label?: string }) {
  return (
    <SA.Root type="hover" {...sx(p, L.sa)} style={{ height, maxHeight, ...p.style }}>
      <SA.Viewport aria-label={label} tabIndex={label ? 0 : undefined} {...px(L.saVp)} style={{ maxHeight }}>{children}</SA.Viewport>
      {axis !== "x" && <SA.Scrollbar orientation="vertical" {...px(L.saBar, L.saBarV)}><SA.Thumb {...px(L.saThumb)} /></SA.Scrollbar>}
      {axis !== "y" && <SA.Scrollbar orientation="horizontal" {...px(L.saBar, L.saBarH)}><SA.Thumb {...px(L.saThumb)} /></SA.Scrollbar>}
    </SA.Root>
  );
}

/* ============================================================== ResizeHandle & SplitPane */

/** A draggable divider. Arrow keys move it; double-click resets. Wire `onResize` to your pane size. */
export function ResizeHandle({ orientation = "vertical", value, min = 0, max = 100, onResize, onReset, label = "Resize", grip = true }: {
  orientation?: "vertical" | "horizontal"; value: number; min?: number; max?: number; onResize: (next: number, e?: PointerEvent | React.PointerEvent) => void; onReset?: () => void; label?: string; grip?: boolean;
}) {
  const drag = useRef(false);
  const [hover, setHover] = useState(false);
  return (
    <div role="separator" aria-orientation={orientation} aria-valuenow={Math.round(value)} aria-valuemin={min} aria-valuemax={max} aria-label={label} tabIndex={0}
      onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}
      onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (drag.current) onResize(value, e); }} onPointerUp={() => (drag.current = false)}
      onKeyDown={(e) => { const d = e.shiftKey ? 10 : 2; if (e.key === (orientation === "vertical" ? "ArrowLeft" : "ArrowUp")) onResize(Math.max(min, value - d)); if (e.key === (orientation === "vertical" ? "ArrowRight" : "ArrowDown")) onResize(Math.min(max, value + d)); }}
      onDoubleClick={onReset} {...px(L.handle, orientation === "horizontal" && L.handleH)}>
      {grip && hover && orientation === "vertical" && <span {...px(L.grip)} />}
    </div>
  );
}

/** Two panes with a draggable divider (list | detail). Stacks on phones. */
export function SplitPane({ start, end, defaultSize = 40, min = 20, max = 80, ...p }: StyleProps & { start: ReactNode; end: ReactNode; defaultSize?: number; min?: number; max?: number }) {
  const [size, setSize] = useState(defaultSize);
  const ref = useRef<HTMLDivElement>(null);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div ref={ref} {...sx(p, L.split)} style={{ ["--split" as string]: `${size}%`, ...p.style }}>
      <div {...px(L.pane, L.paneStart)}>{start}</div>
      <ResizeHandle value={size} min={min} max={max} onReset={() => setSize(defaultSize)} label="Resize panes"
        onResize={(next, e) => { if (e && ref.current && "clientX" in e) { const r = ref.current.getBoundingClientRect(); setSize(clamp(((e.clientX - r.left) / r.width) * 100)); } else setSize(clamp(next)); }} />
      <div {...px(L.pane, L.paneEnd)}>{end}</div>
    </div>
  );
}

/** Sticks to the top (or bottom) of its scroll container — table toolbars, form footers. */
export function Sticky({ edge = "top", offset = 0, children, ...p }: StyleProps & { edge?: "top" | "bottom"; offset?: number; children: ReactNode }) {
  return <div {...sx(p, L.sticky)} style={{ [edge]: offset, ...p.style }}>{children}</div>;
}
