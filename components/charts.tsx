/**
 * Charts with a header built in — a headline number, the chart, and its controls in one piece.
 * PillBarChart · ValueChart · UsageMeter
 *
 * Look: blue first, then the grey ramp; fills are a fine dot texture, never a gradient. Hover or drag to read a point.
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { color, font, motion, radius } from "../tokens/tokens.stylex";
import { SegmentedControl } from "./action";
import { CHART_COLORS, ChartLegend, DotPattern } from "./data";
import { IconArrowDownRight, IconArrowUpRight } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";

const fmtCompact = (n: number) => new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);
const sr = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" } as const;

function useWidth<T extends HTMLElement>(fallback = 480) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => { if (!ref.current) return; const ro = new ResizeObserver(([e]) => setW(Math.max(120, Math.round(e.contentRect.width)))); ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return [ref, w] as const;
}

const s = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 14, minWidth: 0, position: "relative" },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, minWidth: 0 },
  titles: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  title: { fontSize: font.lg, fontWeight: font.semibold, color: color.fg },
  sub: { fontSize: font.sm, color: color.fgMuted },
  big: { display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: 8, rowGap: 2, minWidth: 0 },
  num: { fontSize: "32px", lineHeight: 1.1, fontWeight: font.semibold, letterSpacing: "-0.03em", color: color.fg, fontVariantNumeric: "tabular-nums" },
  frac: { color: color.fgFaint, fontSize: "20px", letterSpacing: "-0.01em" },
  unit: { fontSize: font.md, color: color.fgMuted },
  deltaRow: { display: "flex", alignItems: "center", gap: 6, fontSize: font.sm, color: color.fgMuted, fontVariantNumeric: "tabular-nums", minHeight: 18 },
  up: { display: "inline-flex", alignItems: "center", gap: 3, color: color.fg, fontWeight: font.medium },
  down: { display: "inline-flex", alignItems: "center", gap: 3, color: color.danger, fontWeight: font.medium },
  // pill bars
  plot: { display: "flex", alignItems: "stretch", gap: { default: 3, "@media (min-width: 480px)": 6 }, minWidth: 0, cursor: "crosshair", touchAction: "pan-y" },
  col: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", transitionProperty: "opacity", transitionDuration: motion.fast },
  dim: { opacity: 0.38 },
  pos: { display: "flex", flexDirection: "column-reverse", justifyContent: "flex-start", gap: 3, width: "100%", maxWidth: 14 },
  neg: { display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: 14 },
  seg: { width: "100%", borderRadius: radius.full, minHeight: 3 },
  negSeg: { width: "100%", borderRadius: radius.full, minHeight: 3, boxShadow: `inset 0 0 0 1.5px ${color.borderStrong}`, backgroundColor: color.surfaceSunken },
  base: { width: "100%", height: 1, backgroundColor: color.border, marginBlock: 5 },
  axis: { display: "flex", justifyContent: "space-between", fontSize: font.xs, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  // usage meter
  track: { display: "flex", gap: 2, height: 28, padding: 3, borderRadius: radius.lg, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}, inset 0 1px 2px ${color.shadeXs}` },
  part: { minWidth: 4, borderRadius: radius.sm, transitionProperty: "opacity, flex-grow", transitionDuration: motion.base },
  free: { minWidth: 0, borderRadius: radius.sm, backgroundImage: `radial-gradient(${color.borderStrong} 1px, transparent 1.2px)`, backgroundSize: "5px 5px", opacity: 0.8 },
  chips: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 26, paddingInline: 9, borderRadius: radius.full, fontSize: font.sm, color: color.fgSoft, cursor: "default",
    boxShadow: { default: `inset 0 0 0 1px ${color.border}`, ":hover": `inset 0 0 0 1px ${color.borderStrong}` }, backgroundColor: color.surface, fontVariantNumeric: "tabular-nums",
  },
  chipDot: { width: 7, height: 7, borderRadius: 2, flexShrink: 0 },
  chipVal: { color: color.fgFaint },
  of: { fontSize: font.md, color: color.fgMuted },
  // value chart
  svgWrap: { position: "relative", minWidth: 0, touchAction: "pan-y", cursor: "crosshair" },
  svg: { display: "block", overflow: "visible" },
});

export type PillBarSeries = { name: string; values: number[]; /** Index into the chart palette. */ color?: number };
export type PillBarChartProps = StyleProps & {
  labels: string[];
  /** Stacked upwards, first series at the bottom. */
  series: PillBarSeries[];
  /** Drawn below the baseline as hollow capsules: refunds, bounces, churn. Pass positive numbers. */
  negative?: { name: string; values: number[] };
  title?: ReactNode;
  description?: ReactNode;
  /** Headline number. Defaults to the total of all series; follows the bar under the pointer. */
  value?: number;
  unit?: ReactNode;
  /** Top-right slot: a SegmentedControl for Day / Week, a menu. */
  action?: ReactNode;
  height?: number;
  format?: (n: number) => string;
  legend?: boolean;
  /** For screen readers. */
  label: string;
};

/** Stacked capsule bars: each series is its own rounded segment with a gap, so the stack reads at a glance. */
export function PillBarChart({ labels, series, negative, title, description, value, unit, action, height = 180, format = (n) => n.toLocaleString(), legend = true, label, ...p }: PillBarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const totals = labels.map((_, i) => series.reduce((a, x) => a + (x.values[i] ?? 0), 0));
  const maxPos = Math.max(1, ...totals);
  const maxNeg = negative ? Math.max(1, ...negative.values) : 0;
  const gaps = (series.length - 1) * 3;
  const negH = negative ? Math.round(Math.min(0.28, maxNeg / (maxPos + maxNeg)) * height) : 0;
  const posH = height - negH - (negative ? 11 : 0);
  const colorOf = (x: PillBarSeries, i: number) => CHART_COLORS[(x.color ?? [0, 2, 1, 4, 3, 5][i % 6]) % CHART_COLORS.length];
  const grand = totals.reduce((a, b) => a + b, 0);
  const shown = active === null ? value ?? grand : totals[active];
  const pick = (e: React.PointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setActive(Math.max(0, Math.min(labels.length - 1, Math.floor(((e.clientX - r.left) / r.width) * labels.length)))); };
  return (
    <figure {...sx(p, s.root)} aria-label={label}>
      {(title || action) && (
        <div {...px(s.head)}>
          <div {...px(s.titles)}>{title && <span {...px(s.title)}>{title}</span>}{description && <span {...px(s.sub)}>{description}</span>}</div>
          {action}
        </div>
      )}
      <div {...px(s.big)}><span {...px(s.num)}>{format(shown)}</span><span {...px(s.unit)}>{active === null ? unit : labels[active]}</span></div>
      <div {...px(s.plot)} style={{ height }} onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => setActive(null)} aria-hidden>
        {labels.map((l, i) => (
          <div key={l + i} {...px(s.col, active !== null && active !== i && s.dim)}>
            <div {...px(s.pos)} style={{ height: posH }}>
              {series.map((x, si) => { const v = x.values[i] ?? 0; return v > 0 && <span key={x.name} {...px(s.seg)} style={{ height: Math.max(3, (v / maxPos) * (posH - gaps)), backgroundColor: colorOf(x, si) }} />; })}
            </div>
            {negative && <><span {...px(s.base)} /><div {...px(s.neg)} style={{ height: negH }}><span {...px(s.negSeg)} style={{ height: Math.max(3, ((negative.values[i] ?? 0) / maxNeg) * negH) }} /></div></>}
          </div>
        ))}
      </div>
      <div {...px(s.axis)}><span>{labels[0]}</span><span>{labels[labels.length - 1]}</span></div>
      {legend && (
        <ChartLegend items={[
          ...series.map((x, si) => ({ name: x.name, color: colorOf(x, si), value: active === null ? undefined : format(x.values[active] ?? 0) })),
          ...(negative ? [{ name: negative.name, color: color.borderStrong, value: active === null ? undefined : `−${format(negative.values[active] ?? 0)}` }] : []),
        ]} />
      )}
      <table style={sr}><thead><tr><th>Label</th>{series.map((x) => <th key={x.name}>{x.name}</th>)}{negative && <th>{negative.name}</th>}</tr></thead>
        <tbody>{labels.map((l, i) => <tr key={l + i}><th>{l}</th>{series.map((x) => <td key={x.name}>{x.values[i]}</td>)}{negative && <td>{negative.values[i]}</td>}</tr>)}</tbody></table>
    </figure>
  );
}

/** Smooth path through points (monotone-ish cubic) so the line never overshoots. */
function smooth(pts: [number, number][]) {
  if (pts.length < 3) return pts.map((q, i) => `${i ? "L" : "M"}${q[0]},${q[1]}`).join("");
  let dPath = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const t = 0.18;
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    dPath += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return dPath;
}

export type ValueChartRange = { label: string; values: number[]; /** Shown after the change: "today", "this week". */ caption?: string };
export type ValueChartProps = StyleProps & {
  /** One series per range tab. The headline is the last value of the selected range. */
  ranges: ValueChartRange[];
  defaultRange?: string;
  title?: ReactNode;
  /** Formats the headline; the part after the decimal point is drawn quieter. */
  format?: (n: number) => string;
  height?: number;
  /** Dot-textured fill under the line. */
  area?: boolean;
  /** For screen readers. */
  label: string;
};

/** A headline value with its line and range tabs — balances, prices, MRR. Drag across the line to read any point. */
export function ValueChart({ ranges, defaultRange, title, format = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD" }), height = 150, area = true, label, ...p }: ValueChartProps) {
  const [range, setRange] = useState(defaultRange ?? ranges[ranges.length - 1]?.label);
  const [at, setAt] = useState<number | null>(null);
  const [ref, w] = useWidth<HTMLDivElement>();
  const id = useId().replace(/:/g, "");
  const cur = ranges.find((r) => r.label === range) ?? ranges[0];
  const vals = cur.values;
  useEffect(() => setAt(null), [range]);
  const { pts, line } = useMemo(() => {
    const mn = Math.min(...vals), mx = Math.max(...vals), span = mx - mn || 1, pad = 8;
    const q = vals.map((v, i) => [pad + (i / Math.max(1, vals.length - 1)) * (w - pad * 2), pad + (1 - (v - mn) / span) * (height - pad * 2)] as [number, number]);
    return { pts: q, line: smooth(q) };
  }, [vals, w, height]);
  const i = at ?? vals.length - 1;
  const v = vals[i]; const first = vals[0]; const diff = v - first; const pct = first ? (diff / first) * 100 : 0;
  const text = format(v); const dot = text.lastIndexOf("."); const whole = dot > -1 ? text.slice(0, dot) : text; const frac = dot > -1 ? text.slice(dot) : "";
  const pick = (e: React.PointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setAt(Math.max(0, Math.min(vals.length - 1, Math.round(((e.clientX - r.left) / r.width) * (vals.length - 1))))); };
  const [px0, py0] = pts[i];
  return (
    <figure {...sx(p, s.root)} aria-label={label}>
      <div {...px(s.titles)}>
        {title && <span {...px(s.sub)}>{title}</span>}
        <span {...px(s.num)}>{whole}<span {...px(s.frac)}>{frac}</span></span>
        <span {...px(s.deltaRow)}>
          <span {...px(diff < 0 ? s.down : s.up)}>{diff < 0 ? <IconArrowDownRight size={12} /> : <IconArrowUpRight size={12} />}{diff < 0 ? "−" : "+"}{fmtCompact(Math.abs(diff))} · {Math.abs(pct).toFixed(1)}%</span>
          {cur.caption && <span>{cur.caption}</span>}
        </span>
      </div>
      <div ref={ref} {...px(s.svgWrap)} onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => setAt(null)} aria-hidden>
        <svg width={w} height={height} {...px(s.svg)}>
          <defs><DotPattern id={`vc${id}`} fill={color.chart1} /></defs>
          {area && <path d={`${line}L${pts[pts.length - 1][0]},${height}L${pts[0][0]},${height}Z`} fill={`url(#vc${id})`} />}
          <path d={line} fill="none" stroke={color.chart1} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {at !== null && <line x1={px0} x2={px0} y1={0} y2={height} stroke={color.borderStrong} strokeWidth={1} strokeDasharray="2 3" />}
          <circle cx={px0} cy={py0} r={5} fill={color.surface} stroke={color.chart1} strokeWidth={2} />
        </svg>
      </div>
      {ranges.length > 1 && <SegmentedControl size="sm" fullWidth label="Range" value={cur.label} onValueChange={setRange} items={ranges.map((r) => ({ value: r.label, label: r.label }))} />}
      <table style={sr}><caption>{label}</caption><tbody>{vals.map((x, k) => <tr key={k}><th>{k + 1}</th><td>{x}</td></tr>)}</tbody></table>
    </figure>
  );
}

export type UsageMeterProps = StyleProps & {
  items: { name: string; value: number; /** Index into the chart palette. */ color?: number }[];
  /** Capacity. The unused part is drawn as a dotted track. */
  max: number;
  title?: ReactNode;
  /** Top-right slot: a Button such as "Compact" or "Upgrade". */
  action?: ReactNode;
  format?: (n: number) => string;
  /** Show each part's value on its chip. */
  values?: boolean;
};

/** What is using a limited budget — seats, storage, tokens, API calls — as one bar of parts with a chip per part. */
export function UsageMeter({ items, max, title, action, format = fmtCompact, values = true, ...p }: UsageMeterProps) {
  const [active, setActive] = useState<string | null>(null);
  const used = items.reduce((a, b) => a + b.value, 0);
  const colorOf = (i: number, c?: number) => CHART_COLORS[(c ?? [0, 1, 2, 3, 5, 4][i % 6]) % CHART_COLORS.length];
  const cur = items.find((x) => x.name === active);
  return (
    <div {...sx(p, s.root)} role="group" aria-label={typeof title === "string" ? title : "Usage"}>
      {(title || action) && <div {...px(s.head)}><span {...px(s.title)} style={{ alignSelf: "center" }}>{title}</span>{action}</div>}
      <div {...px(s.big)}><span {...px(s.num)}>{format(cur ? cur.value : used)}</span><span {...px(s.of)}>{cur ? cur.name : `of ${format(max)}`}</span></div>
      <div {...px(s.track)} role="img" aria-label={`${format(used)} of ${format(max)} used`}>
        {items.map((x, i) => <span key={x.name} onPointerEnter={() => setActive(x.name)} onPointerLeave={() => setActive(null)} {...px(s.part)} style={{ flexGrow: x.value, flexBasis: 0, backgroundColor: colorOf(i, x.color), opacity: active && active !== x.name ? 0.35 : 1 }} />)}
        {max > used && <span {...px(s.free)} style={{ flexGrow: max - used, flexBasis: 0 }} />}
      </div>
      <div {...px(s.chips)}>
        {items.map((x, i) => (
          <span key={x.name} onPointerEnter={() => setActive(x.name)} onPointerLeave={() => setActive(null)} {...px(s.chip)}>
            <span {...px(s.chipDot)} style={{ backgroundColor: colorOf(i, x.color) }} />{x.name}{values && <span {...px(s.chipVal)}>{format(x.value)}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
