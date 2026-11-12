/**
 * Data — numbers and charts. Plain SVG drawn from tokens; every chart has a screen-reader table.
 * Stat · StatGroup · Sparkline · LineChart · AreaChart · BarChart · DonutChart · ChartLegend ·
 * BarList · BreakdownBar · GaugeChart · Heatmap · FunnelChart · ScatterChart · BulletChart · ComboChart · RadarChart
 *
 * Look: series 1 is flat blue, the rest a grey ramp. Areas are filled with a fine dot texture, never a gradient.
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { ProgressBar, ProgressRing, SegmentBar, type ProgressTone } from "./feedback";
import { IconArrowDownRight, IconArrowRight, IconArrowUpRight, IconSizeContext } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Tooltip } from "./overlay";

export const CHART_COLORS = [color.chart1, color.chart2, color.chart3, color.chart4, color.chart5, color.chart6];
const fmtCompact = (n: number) => new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);

const d = stylex.create({
  // stat
  stat: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  statCard: { padding: 16, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  statOutline: { padding: 16, borderRadius: radius.xl, boxShadow: `inset 0 0 0 1px ${color.border}` },
  statSunken: { padding: 16, borderRadius: radius.xl, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}, inset 0 1px 2px ${color.shadeXs}` },
  statBezel: { padding: 4, gap: 0, borderRadius: radius.xxl, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}` },
  bezelInner: { display: "flex", flexDirection: "column", gap: 8, padding: 14, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, minWidth: 0 },
  bezelFoot: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingInline: 10, paddingTop: 8, paddingBottom: 4, fontSize: font.sm, color: color.fgMuted },
  statInk: {
    padding: 16, borderRadius: radius.xl, color: color.onInk, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink,
  },
  inkText: { color: color.onInk }, inkQuiet: { color: `color-mix(in srgb, ${color.onInk} 62%, transparent)` },
  inkDelta: { color: color.onInk, backgroundColor: color.inkWash, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color.onInk} 16%, transparent)` },
  clickable: {
    cursor: "pointer", textAlign: "start", outline: "none", transitionProperty: "box-shadow, transform", transitionDuration: motion.base,
    transform: { default: null, ":hover": "translateY(-1px)" }, ":focus-visible": { boxShadow: depth.focus },
  },
  tile: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: radius.lg, flexShrink: 0, color: color.fg,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
  },
  tileRow: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  badgeSlot: { display: "inline-flex", alignItems: "center", marginInlineStart: 4 },
  cmp: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: font.sm, color: color.fgMuted, paddingTop: 8, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: color.border },
  cmpVal: { color: color.fgSoft, fontWeight: font.medium, fontVariantNumeric: "tabular-nums" },
  side: { display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", columnGap: 12, rowGap: 8, minWidth: 0 },
  arrowOnly: { display: "inline-flex", alignItems: "center", gap: 2, fontWeight: font.medium },
  textDelta: { display: "inline-flex", alignItems: "center", gap: 2, fontWeight: font.semibold },
  targetWrap: { position: "relative" },
  targetMark: { position: "absolute", top: -3, bottom: -3, width: 2, borderRadius: 1, backgroundColor: color.fg, transform: "translateX(-1px)" },
  miniBars: { display: "flex", alignItems: "flex-end", gap: 3, height: 32 },
  miniBar: { flex: 1, borderRadius: 2, backgroundColor: color.chart3, minHeight: 2 },
  miniBarLast: { backgroundColor: color.chart1 },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 20 },
  labelRow: { display: "flex", alignItems: "center", gap: 6, minWidth: 0, color: color.fgMuted },
  label: { fontSize: font.sm, fontWeight: font.medium, color: color.fgMuted },
  help: { textDecorationLine: "underline", textDecorationStyle: "dashed", textDecorationColor: color.fgFaint, textUnderlineOffset: "4px", cursor: "help", borderRadius: radius.xs, outline: "none", ":focus-visible": { boxShadow: depth.focus } },
  action: { display: "flex", alignItems: "center", marginBlock: -4, marginInlineEnd: -4, flexShrink: 0 },
  sideRing: { alignItems: "flex-start" },
  valueCol: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  valueInline: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", columnGap: 10, rowGap: 4 },
  value: { fontWeight: font.semibold, letterSpacing: "-0.025em", lineHeight: 1.1, color: color.fg, fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  vsm: { fontSize: font.h3 }, vmd: { fontSize: "26px" }, vlg: { fontSize: "34px" },
  deltaRow: { display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 6, rowGap: 2, fontSize: font.sm, fontVariantNumeric: "tabular-nums" },
  delta: { display: "inline-flex", alignItems: "center", gap: 2, height: 20, paddingInline: 6, borderRadius: radius.full, fontWeight: font.medium },
  up: { color: color.fg, backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}` },
  down: { color: color.danger, backgroundColor: color.dangerSoft, boxShadow: `inset 0 0 0 1px ${color.dangerBorder}` },
  flat: { color: color.fgMuted, backgroundColor: color.muted },
  upText: { color: color.fg }, downText: { color: color.danger }, flatText: { color: color.fgMuted },
  quiet: { color: color.fgMuted },
  prog: { display: "flex", flexDirection: "column", gap: 6, paddingTop: 2, marginTop: "auto" },
  chart: { minWidth: 0, paddingTop: 2, marginTop: "auto" },
  foot: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginInline: -16, marginTop: 4, paddingInline: 16, paddingTop: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, fontSize: font.sm, color: color.fgMuted },
  skel: { display: "block", borderRadius: radius.sm, backgroundColor: color.muted },
  group: {
    display: "grid", gridTemplateColumns: { default: "repeat(2, minmax(0, 1fr))", "@media (min-width: 900px)": "repeat(auto-fit, minmax(170px, 1fr))" }, gap: 1, overflow: "hidden",
    borderRadius: radius.xl, backgroundColor: color.border, boxShadow: depth.card,
  },
  groupCell: { backgroundColor: color.surface, padding: 16, display: "grid", gridTemplateColumns: "minmax(0, 1fr)" },
  // charts
  wrap: { position: "relative", width: "100%", minWidth: 0 },
  svg: { display: "block", overflow: "visible" },
  axis: { fontSize: "10.5px", fill: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  grid: { stroke: color.border },
  sr: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" },
  tip: {
    position: "absolute", top: 0, zIndex: 5, pointerEvents: "none", display: "flex", flexDirection: "column", gap: 4, minWidth: 120, padding: 8,
    borderRadius: radius.md, backgroundColor: color.surfaceRaised, boxShadow: depth.popover, fontSize: font.sm, transform: "translateX(-50%)",
    transitionProperty: "left", transitionDuration: "60ms",
  },
  tipHead: { color: color.fgMuted, fontWeight: font.medium },
  tipRow: { display: "flex", alignItems: "center", gap: 6, justifyContent: "space-between" },
  tipName: { display: "flex", alignItems: "center", gap: 6, color: color.fgSoft },
  tipVal: { fontWeight: font.semibold, fontVariantNumeric: "tabular-nums", color: color.fg },
  sw: { width: 8, height: 8, borderRadius: 2, flexShrink: 0 },
  legend: { display: "flex", flexWrap: "wrap", gap: 14, fontSize: font.sm, color: color.fgSoft },
  legendItem: { display: "inline-flex", alignItems: "center", gap: 6 },
  legendVal: { color: color.fg, fontWeight: font.medium, fontVariantNumeric: "tabular-nums" },
  donutWrap: { display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  donutCenter: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" },
  donutVal: { fontSize: font.h3, fontWeight: font.semibold, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  donutLab: { fontSize: font.xs, color: color.fgMuted },
  bar: { transitionProperty: "opacity", transitionDuration: motion.fast },
  dim: { opacity: 0.35 },
});

/* ============================================================== Stat */

export type StatProps = StyleProps & {
  label: ReactNode;
  /** The number. `null` shows an em dash. */
  value: ReactNode;
  /** Explanation in a tooltip; gives the label a dashed underline. */
  help?: ReactNode;
  icon?: ReactNode;
  /** Put the icon in a raised tile beside the label. */
  iconTile?: boolean;
  /** Small thing after the label: a StatusPill "Live", a Tag. */
  badge?: ReactNode;
  /** Top-right: a MoreMenu, a "View" link, a period Select. */
  action?: ReactNode;
  /** Change vs the baseline, e.g. 6.2 for +6.2%. */
  delta?: number;
  /** "%" (default), "pt" for points, "" for counts. */
  deltaUnit?: string;
  /** pill (default) · text (colored number) · arrow (icon + number, no fill). */
  deltaStyle?: "pill" | "text" | "arrow";
  /** "vs Oct", "vs last week". */
  baseline?: ReactNode;
  /** Cost, churn, latency: a drop is good. */
  lowerIsBetter?: boolean;
  /** Keep the delta grey. */
  neutral?: boolean;
  /** Quiet text in the delta row: "of $102.8k". */
  meta?: ReactNode;
  /** Progress toward a target. `style`: bar (default), ring (beside the number) or segments. `target` draws a marker. */
  progress?: { value: number; max?: number; label?: ReactNode; tone?: ProgressTone; style?: "bar" | "ring" | "segments"; target?: number };
  /** Built-in trend under the number. */
  trend?: number[];
  /** line (default) · area (dotted fill) · bars (last bar blue). */
  trendType?: "line" | "area" | "bars";
  /** Put the trend to the right of the number instead of under it. */
  trendPosition?: "below" | "side";
  /** Any small visual under the number: Sparkline, SegmentBar, BarChart. */
  chart?: ReactNode;
  /** The previous period, under a dashed line: { label: "Last month", value: "$79,410" }. */
  compare?: { label: ReactNode; value: ReactNode };
  /** What the number is made of — a 100% bar plus legend. */
  breakdown?: { name: string; value: number }[];
  /** Bottom row under a hairline. */
  footer?: ReactNode;
  layout?: "stacked" | "inline";
  size?: "sm" | "md" | "lg";
  /** plain (in StatGroup) · card · outline · sunken · bezel (sunken shell, footer on the shell) · ink (dark hero tile). */
  variant?: "plain" | "card" | "outline" | "sunken" | "bezel" | "ink";
  /** Make the whole stat a link or button (lifts on hover). */
  href?: string;
  onClick?: () => void;
  loading?: boolean;
};

/** A headline number and its comparison. Every part except label and value can be turned on or off. */
export function Stat({
  label, value, help, icon, iconTile, badge, action, delta, deltaUnit = "%", deltaStyle = "pill", baseline, lowerIsBetter, neutral, meta, progress, trend, trendType = "line",
  trendPosition = "side", chart, compare, breakdown, footer, layout = "stacked", size = "md", variant = "plain", href, onClick, loading, ...p
}: StatProps) {
  const ink = variant === "ink";
  const good = delta === undefined ? undefined : lowerIsBetter ? delta < 0 : delta > 0;
  const kind = neutral || !delta ? "flat" : good ? "up" : "down";
  const pillTone = ink ? d.inkDelta : d[kind];
  const textTone = ink ? d.inkText : d[`${kind}Text` as "upText"];
  const quiet = ink ? d.inkQuiet : d.quiet;
  const labelEl = help
    ? <Tooltip content={help}><span tabIndex={0} {...px(d.label, d.help, ink && d.inkQuiet)}>{label}</span></Tooltip>
    : <span {...px(d.label, ink && d.inkQuiet)}>{label}</span>;
  const pct = progress ? Math.round((progress.value / (progress.max ?? 100)) * 100) : 0;
  const deltaEl = delta !== undefined && (
    <span {...px(deltaStyle === "pill" ? d.delta : deltaStyle === "text" ? d.textDelta : d.arrowOnly, deltaStyle === "pill" ? pillTone : textTone)}>
      {delta > 0 ? <IconArrowUpRight size={12} /> : delta < 0 ? <IconArrowDownRight size={12} /> : <IconArrowRight size={12} />}
      {deltaStyle !== "arrow" && (delta > 0 ? "+" : delta < 0 ? "−" : "")}{Math.abs(delta)}{deltaUnit}
    </span>
  );
  const trendEl = trend && trend.length > 1 && (
    trendType === "bars"
      ? <div {...px(d.miniBars)} style={trendPosition === "side" ? { width: 96, height: 36 } : undefined} aria-hidden>{trend.map((v, i) => { const mx = Math.max(...trend) || 1; return <span key={i} {...px(d.miniBar, i === trend.length - 1 && d.miniBarLast)} style={{ height: `${Math.max(6, (v / mx) * 100)}%` }} />; })}</div>
      : <Sparkline values={trend} area={trendType === "area"} tone={ink ? "inverse" : "accent"} width={trendPosition === "side" ? 96 : 160} height={36} />
  );
  const ring = progress?.style === "ring";
  const valueBlock = loading ? (
    <div aria-hidden style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span {...px(d.skel)} style={{ width: 96, height: size === "lg" ? 32 : size === "md" ? 26 : 20 }} />
      <span {...px(d.skel)} style={{ width: 64, height: 12 }} />
    </div>
  ) : (
    <div {...px(d.valueCol, layout === "inline" && d.valueInline)}>
      <span {...px(d.value, size === "sm" ? d.vsm : size === "lg" ? d.vlg : d.vmd, ink && d.inkText)}>{value ?? "—"}</span>
      {(delta !== undefined || meta) && (
        <span {...px(d.deltaRow)}>
          {deltaEl}
          {delta !== undefined && baseline && <span {...px(quiet)}>{baseline}</span>}
          {meta && <span {...px(quiet)}>{meta}</span>}
        </span>
      )}
    </div>
  );
  const total = breakdown?.reduce((a, b) => a + b.value, 0) ?? 0;
  const body = (
    <>
      <div {...px(d.top)}>
        <span {...px(iconTile ? d.tileRow : d.labelRow)}>
          {icon && (iconTile ? <span {...px(d.tile)}><IconSizeContext.Provider value={16}>{icon}</IconSizeContext.Provider></span> : <IconSizeContext.Provider value={14}>{icon}</IconSizeContext.Provider>)}
          {labelEl}{badge && <span {...px(d.badgeSlot)}>{badge}</span>}
        </span>
        {action && <span {...px(d.action)}>{action}</span>}
      </div>
      {(ring || (trendEl && trendPosition === "side")) && !loading
        ? <div {...px(d.side, ring && d.sideRing)}>{valueBlock}{ring ? <ProgressRing value={progress!.value} max={progress!.max} size={44} stroke={4} tone={progress!.tone} /> : trendEl}</div>
        : valueBlock}
      {!loading && progress && !ring && (
        <div {...px(d.prog)}>
          {progress.style === "segments"
            ? <SegmentBar value={progress.value} max={progress.max} tone={progress.tone ?? "default"} />
            : <div {...px(d.targetWrap)}>
                <ProgressBar value={progress.value} max={progress.max} tone={progress.tone ?? (ink ? "ink" : "default")} />
                {progress.target !== undefined && <span {...px(d.targetMark)} style={{ left: `${(progress.target / (progress.max ?? 100)) * 100}%` }} title="Target" />}
              </div>}
          {progress.label !== undefined ? progress.label && <span {...px(quiet)} style={{ fontSize: 12 }}>{progress.label}</span> : <span {...px(quiet)} style={{ fontSize: 12 }}>{pct}% of target</span>}
        </div>
      )}
      {!loading && trendEl && trendPosition === "below" && <div {...px(d.chart)}>{trendEl}</div>}
      {!loading && breakdown && <div {...px(d.chart)}><BreakdownBar items={breakdown} height={6} legend="compact" total={total} /></div>}
      {!loading && chart && <div {...px(d.chart)}>{chart}</div>}
      {!loading && compare && <div {...px(d.cmp)}><span>{compare.label}</span><span {...px(d.cmpVal)}>{compare.value}</span></div>}
      {footer && variant !== "bezel" && <div {...px(d.foot)}>{footer}</div>}
    </>
  );
  const surface = { plain: null, card: d.statCard, outline: d.statOutline, sunken: d.statSunken, bezel: d.statBezel, ink: d.statInk }[variant];
  const interactive = href || onClick;
  const inner = variant === "bezel"
    ? <><div {...px(d.bezelInner)}>{body}</div>{footer && <div {...px(d.bezelFoot)}>{footer}</div>}</>
    : body;
  if (href) return <a href={href} aria-busy={loading || undefined} {...sx(p, d.stat, surface, d.clickable)} style={{ textDecoration: "none", color: "inherit", ...p.style }}>{inner}</a>;
  if (onClick) return <button type="button" onClick={onClick} aria-busy={loading || undefined} {...sx(p, d.stat, surface, d.clickable)}>{inner}</button>;
  void interactive;
  return <div aria-busy={loading || undefined} {...sx(p, d.stat, surface)}>{inner}</div>;
}

/** Stats side by side, split by hairlines on one surface. Two-up on phones. */
export function StatGroup({ children, ...p }: StyleProps & { children: ReactNode }) {
  return <div {...sx(p, d.group)}>{(Array.isArray(children) ? children : [children]).map((c, i) => <div key={i} {...px(d.groupCell)}>{c}</div>)}</div>;
}

/* ============================================================== chart helpers */

function niceTicks(min: number, max: number, count = 4) {
  if (max === min) max = min + 1;
  const span = max - min; const step0 = span / count; const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? mag * 10;
  const lo = Math.floor(min / step) * step; const hi = Math.ceil(max / step) * step;
  const out: number[] = []; for (let v = lo; v <= hi + step / 2; v += step) out.push(Number(v.toFixed(10)));
  return out;
}
function useWidth<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => { if (!ref.current) return; const ro = new ResizeObserver(([e]) => setW(Math.max(120, Math.round(e.contentRect.width)))); ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return [ref, w] as const;
}
function SrTable({ labels, series }: { labels: string[]; series: { name: string; values: number[] }[] }) {
  return <table {...px(d.sr)}><thead><tr><th>Label</th>{series.map((s) => <th key={s.name}>{s.name}</th>)}</tr></thead><tbody>{labels.map((l, i) => <tr key={l + i}><th>{l}</th>{series.map((s) => <td key={s.name}>{s.values[i]}</td>)}</tr>)}</tbody></table>;
}

export type ChartSeries = { name: string; values: number[]; /** Index into the chart palette, or "muted" for a comparison line. */ color?: number | "muted"; dashed?: boolean };
const colorOf = (s: ChartSeries, i: number) => (s.color === "muted" ? color.fgFaint : CHART_COLORS[(typeof s.color === "number" ? s.color : i) % CHART_COLORS.length]);

/** A legend row. Optional values per item. */
export function ChartLegend({ items, ...p }: StyleProps & { items: { name: string; color: string; value?: ReactNode }[] }) {
  return <div {...sx(p, d.legend)}>{items.map((it) => <span key={it.name} {...px(d.legendItem)}><span {...px(d.sw)} style={{ backgroundColor: it.color }} />{it.name}{it.value !== undefined && <span {...px(d.legendVal)}>{it.value}</span>}</span>)}</div>;
}

function Tip({ x, label, rows, format }: { x: number; label: string; rows: { name: string; color: string; value: number }[]; format: (n: number) => string }) {
  return (
    <div {...px(d.tip)} style={{ left: x }}>
      <span {...px(d.tipHead)}>{label}</span>
      {rows.map((r) => <span key={r.name} {...px(d.tipRow)}><span {...px(d.tipName)}><span {...px(d.sw)} style={{ backgroundColor: r.color }} />{r.name}</span><span {...px(d.tipVal)}>{format(r.value)}</span></span>)}
    </div>
  );
}

/* ============================================================== LineChart / AreaChart */

export type LineChartProps = StyleProps & {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  format?: (n: number) => string;
  /** Accessible summary: "Revenue, last 12 weeks, up 8%". */
  label: string;
  /** Dot-textured fill under the first series. */
  area?: boolean;
  /** Start the y axis at 0. */
  zero?: boolean;
  /** Stack the series (AreaChart). */
  stacked?: boolean;
  legend?: boolean;
  curve?: boolean;
};

/** Trend over time. Hover (or touch) scrubs a crosshair with every series' value. */
export function LineChart({ labels, series, height = 220, format = fmtCompact, label, area = true, zero = false, stacked, legend, curve = true, ...p }: LineChartProps) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const gid = useMemo(() => `g${Math.random().toString(36).slice(2, 8)}`, []);
  const pad = { l: 40, r: 8, t: 10, b: 24 };
  const sums = stacked ? labels.map((_, i) => series.reduce((a, s) => a + (s.values[i] ?? 0), 0)) : [];
  const all = stacked ? sums : series.flatMap((s) => s.values);
  const ticks = niceTicks(zero || stacked ? 0 : Math.min(...all), Math.max(...all));
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const iw = w - pad.l - pad.r, ih = height - pad.t - pad.b;
  const x = (i: number) => pad.l + (labels.length > 1 ? (i / (labels.length - 1)) * iw : iw / 2);
  const y = (v: number) => pad.t + ih - ((v - lo) / (hi - lo || 1)) * ih;
  const cum = (si: number, i: number) => series.slice(0, si + 1).reduce((a, s) => a + (s.values[i] ?? 0), 0);
  const path = (pts: [number, number][]) => {
    if (!curve || pts.length < 3) return pts.map(([a, b], i) => `${i ? "L" : "M"}${a},${b}`).join("");
    let dd = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i]; const [x1, y1] = pts[i + 1]; const cx = (x0 + x1) / 2; dd += `C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
    return dd;
  };
  const step = Math.max(1, Math.ceil(labels.length / Math.max(2, Math.floor(iw / 64))));
  return (
    <div {...sx(p, d.wrap)}>
      <div ref={ref} style={{ position: "relative" }}
        onPointerMove={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); const i = Math.round(((e.clientX - r.left - pad.l) / iw) * (labels.length - 1)); setHover(Math.max(0, Math.min(labels.length - 1, i))); }}
        onPointerLeave={() => setHover(null)}>
        <svg role="img" aria-label={label} width={w} height={height} {...px(d.svg)}>
          <defs>{series.map((s, si) => <DotPattern key={si} id={`${gid}${si}`} fill={colorOf(s, si)} dense={!!stacked} />)}</defs>
          {ticks.map((t) => <g key={t}><line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} {...px(d.grid)} strokeDasharray={t === lo ? undefined : "2 4"} /><text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" {...px(d.axis)}>{format(t)}</text></g>)}
          {labels.map((l, i) => i % step === 0 && <text key={l + i} x={x(i)} y={height - 6} textAnchor="middle" {...px(d.axis)}>{l}</text>)}
          {[...series].map((s, si) => {
            const pts: [number, number][] = s.values.map((v, i) => [x(i), y(stacked ? cum(si, i) : v)]);
            const base: [number, number][] = stacked && si > 0 ? labels.map((_, i) => [x(i), y(cum(si - 1, i))]) : [[x(labels.length - 1), y(lo)], [x(0), y(lo)]];
            const fill = stacked || (area && si === 0);
            return (
              <g key={s.name}>
                {fill && <path d={`${path(pts)}L${stacked && si > 0 ? base.slice().reverse().map(([a, b]) => `${a},${b}`).join("L") : `${base[0][0]},${base[0][1]}L${base[1][0]},${base[1][1]}`}Z`} fill={`url(#${gid}${si})`} />}
                <path d={path(pts)} fill="none" stroke={colorOf(s, si)} strokeWidth={s.color === "muted" ? 1.25 : 2} strokeDasharray={s.dashed ? "4 4" : undefined} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })}
          {hover !== null && <>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke={color.borderStrong} />
            {series.map((s, si) => <circle key={s.name} cx={x(hover)} cy={y(stacked ? cum(si, hover) : s.values[hover])} r={4} fill={color.surface} stroke={colorOf(s, si)} strokeWidth={2} />)}
          </>}
        </svg>
        {hover !== null && <Tip x={Math.min(w - 70, Math.max(70, x(hover)))} label={labels[hover]} format={format} rows={series.map((s, si) => ({ name: s.name, color: colorOf(s, si), value: s.values[hover] }))} />}
      </div>
      {legend && series.length > 1 && <ChartLegend items={series.map((s, si) => ({ name: s.name, color: colorOf(s, si) }))} style={{ marginTop: 8 }} />}
      <SrTable labels={labels} series={series} />
    </div>
  );
}
/** Filled, stacked series (share of a total over time). */
export const AreaChart = (props: Omit<LineChartProps, "stacked" | "area">) => <LineChart stacked legend {...props} />;

/* ============================================================== BarChart */

export type BarChartProps = StyleProps & {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  format?: (n: number) => string;
  label: string;
  stacked?: boolean;
  /** Bars run left→right with labels on the left (rankings). */
  horizontal?: boolean;
  /** Index of a bar to emphasize; others dim. */
  highlight?: number;
  legend?: boolean;
};

/** Compare categories. Grouped or stacked; horizontal for long labels. */
export function BarChart({ labels, series, height = 220, format = fmtCompact, label, stacked, horizontal, highlight, legend, ...p }: BarChartProps) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const totals = labels.map((_, i) => (stacked ? series.reduce((a, s) => a + (s.values[i] ?? 0), 0) : Math.max(...series.map((s) => s.values[i] ?? 0))));
  const ticks = niceTicks(0, Math.max(...totals));
  const hi = ticks[ticks.length - 1];
  const r = 3;
  if (horizontal) {
    const rowH = 28; const h = labels.length * rowH + 8; const labW = Math.min(140, w * 0.35); const iw = w - labW - 48;
    return (
      <div {...sx(p, d.wrap)}>
        <div ref={ref}>
          <svg role="img" aria-label={label} width={w} height={h} {...px(d.svg)}>
            {labels.map((l, i) => {
              let acc = 0;
              return (
                <g key={l + i} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} {...px(d.bar, (highlight !== undefined ? highlight !== i : hover !== null && hover !== i) && d.dim)}>
                  <text x={0} y={i * rowH + rowH / 2 + 4} dy="0" {...px(d.axis)} style={{ fontSize: 12 }}>{l}</text>
                  {series.map((s, si) => { const v = s.values[i] ?? 0; const bw = (v / hi) * iw; const bx = labW + (stacked ? acc : 0); acc += stacked ? bw : 0; const bh = stacked ? 14 : 14 / series.length; return <rect key={si} x={bx} y={i * rowH + 7 + (stacked ? 0 : si * bh)} width={Math.max(0, bw)} height={bh} rx={r} fill={colorOf(s, si)} />; })}
                  <text x={labW + (totals[i] / hi) * iw + 6} y={i * rowH + rowH / 2 + 4} {...px(d.axis)}>{format(totals[i])}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {legend && series.length > 1 && <ChartLegend items={series.map((s, si) => ({ name: s.name, color: colorOf(s, si) }))} style={{ marginTop: 8 }} />}
        <SrTable labels={labels} series={series} />
      </div>
    );
  }
  const pad = { l: 40, r: 8, t: 10, b: 24 };
  const iw = w - pad.l - pad.r, ih = height - pad.t - pad.b;
  const band = iw / labels.length; const bw = Math.min(40, band * 0.62);
  const y = (v: number) => pad.t + ih - (v / hi) * ih;
  const step = Math.max(1, Math.ceil(labels.length / Math.max(2, Math.floor(iw / 48))));
  return (
    <div {...sx(p, d.wrap)}>
      <div ref={ref} style={{ position: "relative" }}>
        <svg role="img" aria-label={label} width={w} height={height} {...px(d.svg)}>
          {ticks.map((t) => <g key={t}><line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} {...px(d.grid)} strokeDasharray={t === 0 ? undefined : "2 4"} /><text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" {...px(d.axis)}>{format(t)}</text></g>)}
          {labels.map((l, i) => {
            const cx = pad.l + band * i + band / 2; let acc = 0;
            return (
              <g key={l + i} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} {...px(d.bar, (highlight !== undefined ? highlight !== i : hover !== null && hover !== i) && d.dim)}>
                <rect x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" />
                {series.map((s, si) => {
                  const v = s.values[i] ?? 0; const h = (v / hi) * ih;
                  if (stacked) { const yy = y(acc + v); acc += v; return <rect key={si} x={cx - bw / 2} y={yy} width={bw} height={Math.max(0, h)} rx={si === series.length - 1 ? r : 0} fill={colorOf(s, si)} />; }
                  const gw = bw / series.length; return <rect key={si} x={cx - bw / 2 + si * gw} y={y(v)} width={gw - (series.length > 1 ? 2 : 0)} height={Math.max(0, h)} rx={r} fill={colorOf(s, si)} />;
                })}
                {i % step === 0 && <text x={cx} y={height - 6} textAnchor="middle" {...px(d.axis)}>{l}</text>}
              </g>
            );
          })}
        </svg>
        {hover !== null && <Tip x={Math.min(w - 70, Math.max(70, pad.l + band * hover + band / 2))} label={labels[hover]} format={format} rows={series.map((s, si) => ({ name: s.name, color: colorOf(s, si), value: s.values[hover] ?? 0 }))} />}
      </div>
      {legend && series.length > 1 && <ChartLegend items={series.map((s, si) => ({ name: s.name, color: colorOf(s, si) }))} style={{ marginTop: 8 }} />}
      <SrTable labels={labels} series={series} />
    </div>
  );
}

/* ============================================================== DonutChart */

/** Share of a whole (≤ 6 parts). The center shows the total, or the hovered part. */
export function DonutChart({ data, size = 160, thickness = 18, format = fmtCompact, label, centerLabel = "Total", legend = true, ...p }: StyleProps & {
  data: { name: string; value: number; color?: number }[]; size?: number; thickness?: number; format?: (n: number) => string; label: string; centerLabel?: string; legend?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((a, x) => a + x.value, 0) || 1;
  const r = (size - thickness) / 2; const c = 2 * Math.PI * r; let acc = 0;
  const col = (x: { color?: number }, i: number) => CHART_COLORS[(x.color ?? i) % CHART_COLORS.length];
  return (
    <div {...sx(p, d.donutWrap)}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg role="img" aria-label={label} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color.muted} strokeWidth={thickness} />
          {data.map((x, i) => {
            const len = (x.value / total) * c; const gap = data.length > 1 ? 2 : 0; const el = (
              <circle key={x.name} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col(x, i)} strokeWidth={hover === i ? thickness + 4 : thickness}
                strokeDasharray={`${Math.max(0, len - gap)} ${c}`} strokeDashoffset={-acc} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}
                style={{ transition: "stroke-width 120ms", opacity: hover !== null && hover !== i ? 0.4 : 1 }} />
            );
            acc += len; return el;
          })}
        </svg>
        <div {...px(d.donutCenter)}><span {...px(d.donutVal)}>{format(hover !== null ? data[hover].value : total)}</span><span {...px(d.donutLab)}>{hover !== null ? data[hover].name : centerLabel}</span></div>
      </div>
      {legend && <ChartLegend items={data.map((x, i) => ({ name: x.name, color: col(x, i), value: `${Math.round((x.value / total) * 100)}%` }))} style={{ flexDirection: "column", gap: 8 }} />}
      <SrTable labels={data.map((x) => x.name)} series={[{ name: "Value", values: data.map((x) => x.value) }]} />
    </div>
  );
}

/* ============================================================== Sparkline */

/** The texture under lines and in "rest of" areas: fine dots, no gradient. */
export function DotPattern({ id, fill, dense }: { id: string; fill: string; dense?: boolean }) {
  const g = dense ? 3 : 4;
  return (
    <pattern id={id} width={g} height={g} patternUnits="userSpaceOnUse">
      <circle cx={g / 2} cy={g / 2} r={dense ? 0.85 : 0.7} fill={fill} opacity={dense ? 0.7 : 0.55} />
    </pattern>
  );
}

export type SparkTone = "accent" | "ink" | "muted" | "auto" | "inverse" | "success" | "danger";
const sparkColor = (t: SparkTone, up: boolean) =>
  ({ accent: color.chart1, ink: color.fg, muted: color.fgFaint, inverse: color.onInk, success: color.fg, danger: color.danger, auto: up ? color.fg : color.danger })[t];

/** A tiny trend for tables and stats. No axes. `type`: line (last point marked), area (dotted fill) or bars (last bar emphasized). */
export function Sparkline({ values, width = 96, height = 28, tone = "accent", area = false, type, label, ...p }: StyleProps & {
  values: number[]; width?: number; height?: number; tone?: SparkTone; /** Same as type="area". */ area?: boolean; type?: "line" | "area" | "bars"; label?: string;
}) {
  const id = useMemo(() => `s${Math.random().toString(36).slice(2, 8)}`, []);
  if (values.length < 2) return null;
  const kind = type ?? (area ? "area" : "line");
  const min = Math.min(...values), max = Math.max(...values);
  const up = values[values.length - 1] >= values[0];
  const stroke = sparkColor(tone, up);
  const aria = label ?? `Trend from ${values[0]} to ${values[values.length - 1]}`;
  if (kind === "bars") {
    const gap = 2; const bw = Math.max(2, (width - gap * (values.length - 1)) / values.length);
    return (
      <svg role="img" aria-label={aria} width={width} height={height} {...sx(p, d.svg)}>
        {values.map((v, i) => { const h = Math.max(2, ((v - Math.min(0, min)) / ((max - Math.min(0, min)) || 1)) * height); const last = i === values.length - 1;
          return <rect key={i} x={i * (bw + gap)} y={height - h} width={bw} height={h} rx={1.5} fill={last ? stroke : color.chart3} />; })}
      </svg>
    );
  }
  const x = (i: number) => 1 + (i / (values.length - 1)) * (width - 2);
  const y = (v: number) => 3 + (height - 6) - ((v - min) / (max - min || 1)) * (height - 6);
  const dd = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  return (
    <svg role="img" aria-label={aria} width={width} height={height} {...sx(p, d.svg)}>
      {kind === "area" && <><defs><DotPattern id={id} fill={stroke} /></defs><path d={`${dd}L${x(values.length - 1)},${height}L${x(0)},${height}Z`} fill={`url(#${id})`} /></>}
      <path d={dd} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={2.75} fill={color.surface} stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}

/* ============================================================== BarList */

/** A ranked list with a bar behind each row — top pages, sources, countries. The best tool for "which ones?". */
export function BarList({ items, format = fmtCompact, highlight = 0, onSelect, ...p }: StyleProps & {
  items: { name: ReactNode; value: number; icon?: ReactNode; href?: string }[]; format?: (n: number) => string; /** Index drawn in blue; -1 for none. */ highlight?: number; onSelect?: (i: number) => void;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul {...sx(p, c.barList)}>
      {items.map((it, i) => (
        <li key={i} {...px(c.blRow, onSelect && c.blClick)} onClick={onSelect ? () => onSelect(i) : undefined}>
          <span {...px(c.blFill, i === highlight && c.blFillOn)} style={{ width: `${(it.value / max) * 100}%` }} />
          <span {...px(c.blName)}><IconSizeContext.Provider value={14}>{it.icon}</IconSizeContext.Provider><span {...px(c.ellipsis)}>{it.name}</span></span>
          <span {...px(c.blVal)}>{format(it.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================== BreakdownBar */

/** Parts of a whole as one segmented bar with a legend. Segments get the chart palette (first is blue). */
export function BreakdownBar({ items, height = 10, legend = "full", total, format = fmtCompact, ...p }: StyleProps & {
  items: { name: string; value: number; color?: number }[]; height?: number; legend?: "full" | "compact" | "none"; total?: number; format?: (n: number) => string;
}) {
  const sum = (total ?? items.reduce((a, b) => a + b.value, 0)) || 1;
  const col = (x: { color?: number }, i: number) => CHART_COLORS[(x.color ?? i) % CHART_COLORS.length];
  return (
    <div {...sx(p, c.bdWrap)}>
      <div role="img" aria-label={items.map((x) => `${x.name} ${Math.round((x.value / sum) * 100)}%`).join(", ")} {...px(c.bdBar)} style={{ height }}>
        {items.map((x, i) => <span key={x.name} {...px(c.bdSeg)} style={{ flexGrow: x.value, backgroundColor: col(x, i) }} />)}
      </div>
      {legend !== "none" && (
        <div {...px(legend === "full" ? c.bdLegend : c.bdLegendC)}>
          {items.map((x, i) => (
            <span key={x.name} {...px(c.bdItem)}>
              <span {...px(d.sw)} style={{ backgroundColor: col(x, i) }} />
              <span {...px(c.ellipsis)}>{x.name}</span>
              <span {...px(c.bdPct)}>{Math.round((x.value / sum) * 100)}%</span>
              {legend === "full" && <span {...px(c.bdVal)}>{format(x.value)}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================== GaugeChart */

/** A half-dial for a score against a range: health, NPS, utilization. Optional threshold ticks. */
export function GaugeChart({ value, min = 0, max = 100, size = 180, thickness = 14, label, valueLabel, caption, thresholds, tone = "accent", ...p }: StyleProps & {
  value: number; min?: number; max?: number; size?: number; thickness?: number; label: string; valueLabel?: ReactNode; caption?: ReactNode; thresholds?: number[]; tone?: "accent" | "ink";
}) {
  const r = (size - thickness) / 2; const cx = size / 2; const cy = size / 2;
  const t = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const pt = (f: number, rr = r) => [cx - rr * Math.cos(Math.PI * f), cy - rr * Math.sin(Math.PI * f)];
  const arc = (f0: number, f1: number) => { const [x0, y0] = pt(f0); const [x1, y1] = pt(f1); return `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`; }; // a half-dial never needs the large arc
  const h = size / 2 + thickness / 2 + 2;
  return (
    <div {...sx(p, c.gauge)} style={{ width: size }}>
      <svg role="img" aria-label={`${label}: ${value} of ${max}`} width={size} height={h} {...px(d.svg)}>
        <path d={arc(0, 1)} fill="none" stroke={color.muted} strokeWidth={thickness} strokeLinecap="round" />
        {t > 0 && <path d={arc(0, Math.max(0.001, t))} fill="none" stroke={tone === "ink" ? color.fg : color.chart1} strokeWidth={thickness} strokeLinecap="round" />}
        {thresholds?.map((th) => { const f = (th - min) / (max - min || 1); const [x0, y0] = pt(f, r - thickness / 2 - 3); const [x1, y1] = pt(f, r + thickness / 2 + 3); return <line key={th} x1={x0} y1={y0} x2={x1} y2={y1} stroke={color.surface} strokeWidth={2} />; })}
        {(() => { const [nx, ny] = pt(t); return <circle cx={nx} cy={ny} r={thickness / 2 - 3} fill={color.surface} />; })()}
      </svg>
      <div {...px(c.gaugeText)}>
        <span {...px(d.donutVal)} style={{ fontSize: Math.max(18, size / 7) }}>{valueLabel ?? value}</span>
        {caption && <span {...px(d.donutLab)}>{caption}</span>}
      </div>
      <div {...px(c.gaugeEnds)}><span>{min}</span><span>{max}</span></div>
    </div>
  );
}

/* ============================================================== Heatmap */

/** Values on a grid — activity by day × hour, usage by week. Five steps from muted to blue; hover shows the value. */
export function Heatmap({ rows, columns, values, format = (n: number) => String(n), label, cell = 14, gap = 3, ...p }: StyleProps & {
  rows: string[]; columns: string[]; values: number[][]; format?: (n: number) => string; label: string; cell?: number; gap?: number;
}) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const flat = values.flat(); const max = Math.max(...flat, 1);
  const step = (v: number) => (v <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)));
  const fills = [color.muted, `color-mix(in srgb, ${color.chart1} 22%, ${color.surface})`, `color-mix(in srgb, ${color.chart1} 45%, ${color.surface})`, `color-mix(in srgb, ${color.chart1} 72%, ${color.surface})`, color.chart1];
  const labW = 34; const showEvery = Math.max(1, Math.ceil(columns.length / 12));
  return (
    <div {...sx(p, c.heat)}>
      <div style={{ overflowX: "auto" }}>
        <svg role="img" aria-label={label} width={labW + columns.length * (cell + gap)} height={rows.length * (cell + gap) + 18} {...px(d.svg)}>
          {rows.map((rname, r) => <text key={rname} x={0} y={r * (cell + gap) + cell - 3} {...px(d.axis)}>{rname}</text>)}
          {values.map((row, r) => row.map((v, ci) => (
            <rect key={`${r}-${ci}`} x={labW + ci * (cell + gap)} y={r * (cell + gap)} width={cell} height={cell} rx={3} fill={fills[step(v)]}
              stroke={hover?.r === r && hover?.c === ci ? color.fg : "none"} strokeWidth={1.5}
              onPointerEnter={() => setHover({ r, c: ci })} onPointerLeave={() => setHover(null)} />
          )))}
          {columns.map((cn, ci) => ci % showEvery === 0 && <text key={cn + ci} x={labW + ci * (cell + gap) + cell / 2} y={rows.length * (cell + gap) + 12} textAnchor="middle" {...px(d.axis)}>{cn}</text>)}
        </svg>
      </div>
      <div {...px(c.heatFoot)}>
        <span>{hover ? `${rows[hover.r]} · ${columns[hover.c]} — ${format(values[hover.r][hover.c])}` : "\u00a0"}</span>
        <span {...px(c.heatScale)}>Less{fills.map((f, i) => <span key={i} {...px(c.heatSw)} style={{ backgroundColor: f }} />)}More</span>
      </div>
    </div>
  );
}

/* ============================================================== FunnelChart */

/** Steps that narrow — signup → activation → paid. Bars shrink to scale; conversion between steps on the right. */
export function FunnelChart({ steps, format = fmtCompact, label, ...p }: StyleProps & { steps: { name: string; value: number }[]; format?: (n: number) => string; label: string }) {
  const max = steps[0]?.value || 1;
  return (
    <ol role="img" aria-label={label} {...sx(p, c.funnel)}>
      {steps.map((st, i) => {
        const pct = (st.value / max) * 100; const conv = i > 0 && steps[i - 1].value ? Math.round((st.value / steps[i - 1].value) * 100) : null;
        return (
          <li key={st.name} {...px(c.fRow)}>
            <span {...px(c.fName)}>{st.name}</span>
            <span {...px(c.fTrack)}><span {...px(c.fBar, i === 0 && c.fBarFirst)} style={{ width: `${Math.max(2, pct)}%` }}><span {...px(c.fVal, pct < 18 && c.fValOut)}>{format(st.value)}</span></span></span>
            <span {...px(c.fConv)}>{conv === null ? "100%" : `${conv}%`}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ============================================================== ScatterChart */

/** Two measures per item — size vs. growth, usage vs. revenue. Hover a dot for its name. Optional size channel. */
export function ScatterChart({ points, height = 240, label, xLabel, yLabel, format = fmtCompact, highlight, ...p }: StyleProps & {
  points: { name: string; x: number; y: number; size?: number }[]; height?: number; label: string; xLabel?: string; yLabel?: string; format?: (n: number) => string; highlight?: string[];
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 44, r: 12, t: 10, b: 30 };
  const xt = niceTicks(Math.min(...points.map((q) => q.x)), Math.max(...points.map((q) => q.x)));
  const yt = niceTicks(Math.min(...points.map((q) => q.y)), Math.max(...points.map((q) => q.y)));
  const iw = w - pad.l - pad.r, ih = height - pad.t - pad.b;
  const X = (v: number) => pad.l + ((v - xt[0]) / (xt[xt.length - 1] - xt[0] || 1)) * iw;
  const Y = (v: number) => pad.t + ih - ((v - yt[0]) / (yt[yt.length - 1] - yt[0] || 1)) * ih;
  const smax = Math.max(...points.map((q) => q.size ?? 1));
  return (
    <div {...sx(p, d.wrap)}>
      <div ref={ref} style={{ position: "relative" }}>
        <svg role="img" aria-label={label} width={w} height={height} {...px(d.svg)}>
          {yt.map((t) => <g key={`y${t}`}><line x1={pad.l} x2={w - pad.r} y1={Y(t)} y2={Y(t)} {...px(d.grid)} strokeDasharray="2 4" /><text x={pad.l - 8} y={Y(t)} dy="0.32em" textAnchor="end" {...px(d.axis)}>{format(t)}</text></g>)}
          {xt.map((t) => <text key={`x${t}`} x={X(t)} y={height - 14} textAnchor="middle" {...px(d.axis)}>{format(t)}</text>)}
          {xLabel && <text x={w - pad.r} y={height - 1} textAnchor="end" {...px(d.axis)}>{xLabel} →</text>}
          {yLabel && <text x={pad.l} y={8} {...px(d.axis)}>↑ {yLabel}</text>}
          {points.map((q, i) => {
            const on = highlight ? highlight.includes(q.name) : true; const r = q.size ? 4 + (q.size / smax) * 10 : 5;
            return <circle key={q.name + i} cx={X(q.x)} cy={Y(q.y)} r={hover === i ? r + 2 : r} fill={on ? color.chart1 : color.chart3} fillOpacity={q.size ? 0.55 : 0.9}
              stroke={on ? color.chart1 : color.chart3} strokeWidth={1.5} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} style={{ transition: "r 120ms" }} />;
          })}
        </svg>
        {hover !== null && <Tip x={Math.min(w - 70, Math.max(70, X(points[hover].x)))} label={points[hover].name} format={format}
          rows={[{ name: xLabel ?? "x", color: color.chart3, value: points[hover].x }, { name: yLabel ?? "y", color: color.chart1, value: points[hover].y }]} />}
      </div>
    </div>
  );
}

/* ============================================================== BulletChart */

/** One measure against a target and qualitative ranges — the compact replacement for a gauge in tables and stats. */
export function BulletChart({ value, target, ranges = [], max, label, format = fmtCompact, height = 14, showValues = true, ...p }: StyleProps & {
  value: number; target?: number; /** Upper bounds of poor/ok bands, e.g. [40, 75]. */ ranges?: number[]; max?: number; label: string; format?: (n: number) => string; height?: number; showValues?: boolean;
}) {
  const top = max ?? Math.max(value, target ?? 0, ...ranges) * 1.1;
  const pct = (v: number) => `${Math.min(100, (v / (top || 1)) * 100)}%`;
  return (
    <div {...sx(p, c.bullet)}>
      <div role="meter" aria-label={label} aria-valuenow={value} aria-valuemax={top} {...px(c.bTrack)} style={{ height }}>
        {[...ranges].reverse().map((r, i) => <span key={r} {...px(c.bRange)} style={{ width: pct(r), opacity: 0.5 + i * 0.25 }} />)}
        <span {...px(c.bValue)} style={{ width: pct(value), top: height * 0.3, bottom: height * 0.3 }} />
        {target !== undefined && <span {...px(c.bTarget)} style={{ left: pct(target) }} />}
      </div>
      {showValues && <div {...px(c.bLegend)}><span><b {...px(c.bStrong)}>{format(value)}</b> {label}</span>{target !== undefined && <span>Target {format(target)}</span>}</div>}
    </div>
  );
}

/* ============================================================== ComboChart */

/** Bars for volume plus a line for a rate on a second axis — orders and conversion, tickets and CSAT. */
export function ComboChart({ labels, bars, line, height = 240, label, format = fmtCompact, lineFormat = (n: number) => `${n}%`, ...p }: StyleProps & {
  labels: string[]; bars: { name: string; values: number[] }; line: { name: string; values: number[] }; height?: number; label: string; format?: (n: number) => string; lineFormat?: (n: number) => string;
}) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 40, r: 40, t: 10, b: 24 };
  const iw = w - pad.l - pad.r, ih = height - pad.t - pad.b;
  const bt = niceTicks(0, Math.max(...bars.values)); const bh = bt[bt.length - 1];
  const lt = niceTicks(Math.min(...line.values), Math.max(...line.values)); const llo = lt[0], lhi = lt[lt.length - 1];
  const band = iw / labels.length; const bw = Math.min(28, band * 0.56);
  const Yb = (v: number) => pad.t + ih - (v / (bh || 1)) * ih;
  const Yl = (v: number) => pad.t + ih - ((v - llo) / (lhi - llo || 1)) * ih;
  const cx = (i: number) => pad.l + band * i + band / 2;
  const step = Math.max(1, Math.ceil(labels.length / Math.max(2, Math.floor(iw / 48))));
  return (
    <div {...sx(p, d.wrap)}>
      <div ref={ref} style={{ position: "relative" }} onPointerLeave={() => setHover(null)}>
        <svg role="img" aria-label={label} width={w} height={height} {...px(d.svg)}>
          {bt.map((t) => <g key={t}><line x1={pad.l} x2={w - pad.r} y1={Yb(t)} y2={Yb(t)} {...px(d.grid)} strokeDasharray={t === 0 ? undefined : "2 4"} /><text x={pad.l - 8} y={Yb(t)} dy="0.32em" textAnchor="end" {...px(d.axis)}>{format(t)}</text></g>)}
          {lt.map((t) => <text key={`l${t}`} x={w - pad.r + 8} y={Yl(t)} dy="0.32em" {...px(d.axis)}>{lineFormat(t)}</text>)}
          {labels.map((l, i) => (
            <g key={l + i} onPointerEnter={() => setHover(i)}>
              <rect x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" />
              <rect x={cx(i) - bw / 2} y={Yb(bars.values[i])} width={bw} height={Math.max(0, ih + pad.t - Yb(bars.values[i]))} rx={3} fill={hover === i ? color.chart2 : color.chart3} />
              {i % step === 0 && <text x={cx(i)} y={height - 6} textAnchor="middle" {...px(d.axis)}>{l}</text>}
            </g>
          ))}
          <path d={line.values.map((v, i) => `${i ? "L" : "M"}${cx(i)},${Yl(v)}`).join("")} fill="none" stroke={color.chart1} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {line.values.map((v, i) => <circle key={i} cx={cx(i)} cy={Yl(v)} r={hover === i ? 4 : 2.5} fill={color.surface} stroke={color.chart1} strokeWidth={1.5} />)}
        </svg>
        {hover !== null && <Tip x={Math.min(w - 70, Math.max(70, cx(hover)))} label={labels[hover]} format={(n) => n.toLocaleString()}
          rows={[{ name: bars.name, color: color.chart3, value: bars.values[hover] }, { name: line.name, color: color.chart1, value: line.values[hover] }]} />}
      </div>
      <ChartLegend items={[{ name: bars.name, color: color.chart3 }, { name: line.name, color: color.chart1 }]} style={{ marginTop: 8 }} />
      <SrTable labels={labels} series={[bars, line]} />
    </div>
  );
}

/* ============================================================== RadarChart */

/** Several scores on shared axes — plan comparison, skills, health dimensions. Up to three series. */
export function RadarChart({ axes, series, size = 240, max, label, ...p }: StyleProps & {
  axes: string[]; series: ChartSeries[]; size?: number; max?: number; label: string;
}) {
  const top = max ?? Math.max(...series.flatMap((s) => s.values), 1);
  const cx = size / 2, cy = size / 2, R = size / 2 - 34;
  const pt = (i: number, v: number) => { const a = -Math.PI / 2 + (i / axes.length) * Math.PI * 2; const r = (v / top) * R; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const gid = useMemo(() => `r${Math.random().toString(36).slice(2, 8)}`, []);
  return (
    <div {...sx(p, c.radar)}>
      <svg role="img" aria-label={label} width={size} height={size} {...px(d.svg)}>
        <defs>{series.map((s, si) => <DotPattern key={si} id={`${gid}${si}`} fill={colorOf(s, si)} dense />)}</defs>
        {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={axes.map((_, i) => pt(i, top * f).join(",")).join(" ")} fill="none" {...px(d.grid)} strokeDasharray={f === 1 ? undefined : "2 4"} />)}
        {axes.map((ax, i) => { const [x, y] = pt(i, top); const [lx, ly] = pt(i, top * 1.18); return <g key={ax}><line x1={cx} y1={cy} x2={x} y2={y} {...px(d.grid)} /><text x={lx} y={ly} dy="0.32em" textAnchor={Math.abs(lx - cx) < 4 ? "middle" : lx > cx ? "start" : "end"} {...px(d.axis)} style={{ fontSize: 11 }}>{ax}</text></g>; })}
        {series.map((s, si) => <polygon key={s.name} points={s.values.map((v, i) => pt(i, v).join(",")).join(" ")} fill={`url(#${gid}${si})`} stroke={colorOf(s, si)} strokeWidth={1.75} strokeLinejoin="round" />)}
      </svg>
      {series.length > 1 && <ChartLegend items={series.map((s, si) => ({ name: s.name, color: colorOf(s, si) }))} />}
    </div>
  );
}

const c = stylex.create({
  ellipsis: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 },
  barList: { display: "flex", flexDirection: "column", gap: 4, margin: 0, padding: 0, listStyle: "none" },
  blRow: { position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, height: 30, paddingInline: 8, borderRadius: radius.sm, fontSize: font.md, isolation: "isolate" },
  blClick: { cursor: "pointer", ":hover": { backgroundColor: color.hover } },
  blFill: { position: "absolute", insetBlock: 0, left: 0, zIndex: -1, borderRadius: radius.sm, backgroundColor: color.muted },
  blFillOn: { backgroundColor: color.accentSoft, boxShadow: `inset 2px 0 0 ${color.chart1}` },
  blName: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, color: color.fg },
  blVal: { fontVariantNumeric: "tabular-nums", color: color.fgSoft, fontWeight: font.medium, flexShrink: 0 },
  bdWrap: { display: "flex", flexDirection: "column", gap: 10, minWidth: 0 },
  bdBar: { display: "flex", gap: 2, width: "100%", borderRadius: radius.full, overflow: "hidden" },
  bdSeg: { flexBasis: 0, minWidth: 3 },
  bdLegend: { display: "flex", flexDirection: "column", gap: 6, fontSize: font.sm },
  bdLegendC: { display: "flex", flexWrap: "wrap", columnGap: 12, rowGap: 4, fontSize: font.sm },
  bdItem: { display: "flex", alignItems: "center", gap: 6, minWidth: 0, color: color.fgSoft },
  bdPct: { color: color.fg, fontWeight: font.medium, fontVariantNumeric: "tabular-nums" },
  bdVal: { marginInlineStart: "auto", color: color.fgMuted, fontVariantNumeric: "tabular-nums" },
  gauge: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "100%" },
  gaugeText: { position: "absolute", left: 0, right: 0, bottom: 16, display: "flex", flexDirection: "column", alignItems: "center" },
  gaugeEnds: { display: "flex", justifyContent: "space-between", width: "100%", paddingInline: 4, fontSize: "10.5px", color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  heat: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  heatFoot: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: font.sm, color: color.fgMuted, fontVariantNumeric: "tabular-nums" },
  heatScale: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: font.xs, color: color.fgFaint },
  heatSw: { width: 10, height: 10, borderRadius: 2 },
  funnel: { display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" },
  fRow: { display: "grid", gridTemplateColumns: { default: "84px 1fr 40px", "@media (min-width: 640px)": "120px 1fr 48px" }, alignItems: "center", gap: 10, fontSize: font.md },
  fName: { color: color.fgSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  fTrack: { height: 26, borderRadius: radius.sm, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`, overflow: "hidden" },
  fBar: { position: "relative", display: "flex", alignItems: "center", height: "100%", borderRadius: radius.sm, backgroundColor: color.chart3 },
  fBarFirst: { backgroundColor: color.chart1 },
  fVal: { paddingInline: 8, fontSize: font.sm, fontWeight: font.semibold, color: color.onAccent, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
  fValOut: { position: "absolute", left: "100%", color: color.fg },
  fConv: { textAlign: "end", fontSize: font.sm, color: color.fgMuted, fontVariantNumeric: "tabular-nums" },
  bullet: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
  bTrack: { position: "relative", width: "100%", borderRadius: 3, backgroundColor: color.muted, overflow: "visible" },
  bRange: { position: "absolute", insetBlock: 0, left: 0, borderRadius: 3, backgroundColor: color.borderStrong },
  bValue: { position: "absolute", left: 0, borderRadius: 2, backgroundColor: color.fg },
  bTarget: { position: "absolute", top: -3, bottom: -3, width: 2.5, borderRadius: 1, backgroundColor: color.chart1, transform: "translateX(-1px)" },
  bLegend: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: font.sm, color: color.fgMuted, fontVariantNumeric: "tabular-nums" },
  bStrong: { color: color.fg, fontWeight: font.semibold },
  radar: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
});
