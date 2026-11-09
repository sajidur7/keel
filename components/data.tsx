/**
 * Data — numbers and charts. Plain SVG drawn from tokens; every chart has a screen-reader table.
 * Stat · StatGroup · Sparkline · LineChart · AreaChart · BarChart · DonutChart · ChartLegend
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { ProgressBar, type ProgressTone } from "./feedback";
import { IconArrowDownRight, IconArrowUpRight, IconSizeContext } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Tooltip } from "./overlay";

export const CHART_COLORS = [color.chart1, color.chart2, color.chart3, color.chart4, color.chart5, color.chart6];
const fmtCompact = (n: number) => new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);

const d = stylex.create({
  // stat
  stat: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  statCard: { padding: 16, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 20 },
  labelRow: { display: "flex", alignItems: "center", gap: 6, minWidth: 0, color: color.fgMuted },
  label: { fontSize: font.sm, fontWeight: font.medium, color: color.fgMuted },
  help: { textDecorationLine: "underline", textDecorationStyle: "dashed", textDecorationColor: color.fgFaint, textUnderlineOffset: "4px", cursor: "help", borderRadius: radius.xs, outline: "none", ":focus-visible": { boxShadow: depth.focus } },
  action: { display: "flex", alignItems: "center", marginBlock: -4, marginInlineEnd: -4, flexShrink: 0 },
  valueCol: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  valueInline: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", columnGap: 10, rowGap: 4 },
  value: { fontWeight: font.semibold, letterSpacing: "-0.025em", lineHeight: 1.1, color: color.fg, fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  vsm: { fontSize: font.h3 }, vmd: { fontSize: "26px" }, vlg: { fontSize: "34px" },
  deltaRow: { display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 6, rowGap: 2, fontSize: font.sm, fontVariantNumeric: "tabular-nums" },
  delta: { display: "inline-flex", alignItems: "center", gap: 2, height: 20, paddingInline: 6, borderRadius: radius.full, fontWeight: font.medium },
  up: { color: color.success, backgroundColor: color.successSoft },
  down: { color: color.danger, backgroundColor: color.dangerSoft },
  flat: { color: color.fgMuted, backgroundColor: color.muted },
  quiet: { color: color.fgMuted },
  prog: { display: "flex", flexDirection: "column", gap: 6, paddingTop: 2 },
  chart: { minWidth: 0, paddingTop: 2 },
  foot: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginInline: -16, marginTop: 4, paddingInline: 16, paddingTop: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, fontSize: font.sm, color: color.fgMuted },
  skel: { display: "block", borderRadius: radius.sm, backgroundColor: color.muted },
  group: {
    display: "grid", gridTemplateColumns: { default: "repeat(2, minmax(0, 1fr))", "@media (min-width: 900px)": "repeat(auto-fit, minmax(170px, 1fr))" }, gap: 1, overflow: "hidden",
    borderRadius: radius.xl, backgroundColor: color.border, boxShadow: depth.card,
  },
  groupCell: { backgroundColor: color.surface, padding: 16 },
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
  /** Top-right: a MoreMenu, a "View" link, a period Select. */
  action?: ReactNode;
  /** Change vs the baseline, e.g. 6.2 for +6.2%. */
  delta?: number;
  /** "%" (default), "pt" for points, "" for counts. */
  deltaUnit?: string;
  /** "vs Oct", "vs last week". */
  baseline?: ReactNode;
  /** Cost, churn, latency: a drop is good. */
  lowerIsBetter?: boolean;
  /** Keep the delta grey. */
  neutral?: boolean;
  /** Quiet text in the delta row: "of $102.8k". */
  meta?: ReactNode;
  /** Progress toward a target. */
  progress?: { value: number; max?: number; label?: ReactNode; tone?: ProgressTone };
  /** Any small visual under the number: Sparkline, SegmentBar, BarChart. */
  chart?: ReactNode;
  /** Bottom row under a hairline. */
  footer?: ReactNode;
  layout?: "stacked" | "inline";
  size?: "sm" | "md" | "lg";
  /** plain (inside StatGroup) or card (standalone). */
  variant?: "plain" | "card";
  loading?: boolean;
};

/** A headline number and its comparison. Every part except label and value can be turned on or off. */
export function Stat({ label, value, help, icon, action, delta, deltaUnit = "%", baseline, lowerIsBetter, neutral, meta, progress, chart, footer, layout = "stacked", size = "md", variant = "plain", loading, ...p }: StatProps) {
  const good = delta === undefined ? undefined : lowerIsBetter ? delta < 0 : delta > 0;
  const tone = neutral || !delta ? d.flat : good ? d.up : d.down;
  const labelEl = help
    ? <Tooltip content={help}><span tabIndex={0} {...px(d.label, d.help)}>{label}</span></Tooltip>
    : <span {...px(d.label)}>{label}</span>;
  const pct = progress ? Math.round((progress.value / (progress.max ?? 100)) * 100) : 0;
  return (
    <div aria-busy={loading || undefined} {...sx(p, d.stat, variant === "card" && d.statCard)}>
      <div {...px(d.top)}>
        <span {...px(d.labelRow)}><IconSizeContext.Provider value={14}>{icon}</IconSizeContext.Provider>{labelEl}</span>
        {action && <span {...px(d.action)}>{action}</span>}
      </div>
      {loading ? (
        <div aria-hidden style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span {...px(d.skel)} style={{ width: 96, height: size === "lg" ? 32 : size === "md" ? 26 : 20 }} />
          <span {...px(d.skel)} style={{ width: 64, height: 12 }} />
        </div>
      ) : (
        <div {...px(d.valueCol, layout === "inline" && d.valueInline)}>
          <span {...px(d.value, size === "sm" ? d.vsm : size === "lg" ? d.vlg : d.vmd)}>{value ?? "—"}</span>
          {(delta !== undefined || meta) && (
            <span {...px(d.deltaRow)}>
              {delta !== undefined && (
                <span {...px(d.delta, tone)}>
                  {delta > 0 ? <IconArrowUpRight size={12} /> : delta < 0 ? <IconArrowDownRight size={12} /> : null}
                  {delta > 0 ? "+" : delta < 0 ? "−" : ""}{Math.abs(delta)}{deltaUnit}
                </span>
              )}
              {delta !== undefined && baseline && <span {...px(d.quiet)}>{baseline}</span>}
              {meta && <span {...px(d.quiet)}>{meta}</span>}
            </span>
          )}
        </div>
      )}
      {!loading && progress && (
        <div {...px(d.prog)}>
          <ProgressBar value={progress.value} max={progress.max} tone={progress.tone ?? "default"} />
          {progress.label !== undefined ? progress.label && <span {...px(d.quiet)} style={{ fontSize: 12 }}>{progress.label}</span> : <span {...px(d.quiet)} style={{ fontSize: 12 }}>{pct}% of target</span>}
        </div>
      )}
      {!loading && chart && <div {...px(d.chart)}>{chart}</div>}
      {footer && <div {...px(d.foot)}>{footer}</div>}
    </div>
  );
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
  /** Soft gradient under the first series. */
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
          <defs>{series.map((s, si) => <linearGradient key={si} id={`${gid}${si}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={colorOf(s, si)} stopOpacity={stacked ? 0.35 : 0.22} /><stop offset="100%" stopColor={colorOf(s, si)} stopOpacity={stacked ? 0.08 : 0} /></linearGradient>)}</defs>
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

/** A tiny trend line for tables and stats. No axes. The last point is marked. */
export function Sparkline({ values, width = 96, height = 28, tone = "accent", area = true, label, ...p }: StyleProps & {
  values: number[]; width?: number; height?: number; tone?: "accent" | "success" | "danger" | "muted" | "auto"; area?: boolean; label?: string;
}) {
  const id = useMemo(() => `s${Math.random().toString(36).slice(2, 8)}`, []);
  if (values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const x = (i: number) => 1 + (i / (values.length - 1)) * (width - 2);
  const y = (v: number) => 2 + (height - 4) - ((v - min) / (max - min || 1)) * (height - 4);
  const t = tone === "auto" ? (values[values.length - 1] >= values[0] ? "success" : "danger") : tone;
  const stroke = { accent: color.accent, success: color.successSolid, danger: color.danger, muted: color.fgFaint }[t];
  const dd = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  return (
    <svg role="img" aria-label={label ?? `Trend from ${values[0]} to ${values[values.length - 1]}`} width={width} height={height} {...sx(p, d.svg)}>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity={0.25} /><stop offset="100%" stopColor={stroke} stopOpacity={0} /></linearGradient></defs>
      {area && <path d={`${dd}L${x(values.length - 1)},${height}L${x(0)},${height}Z`} fill={`url(#${id})`} />}
      <path d={dd} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={2.5} fill={stroke} />
    </svg>
  );
}
