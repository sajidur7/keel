import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";

/*
  Minimal charts, drawn as plain SVG from tokens. Rules baked in:
  - One data hue (--data). Comparison series are grey. Status colors only for status.
  - Thin gridlines on --border, compact axis labels, tabular numbers.
  - Every chart has an accessible summary (`label`) and a hidden data table for screen readers.
  Use them only for real data that answers a question on the page.
*/

const fmtCompact = (n: number) => new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);

function niceTicks(min: number, max: number, count = 4) {
  if (max === min) max = min + 1;
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? mag * 10;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

function SrTable({ labels, series }: { labels: string[]; series: { name: string; values: number[] }[] }) {
  return (
    <table className="sr-only">
      <thead><tr><th>Label</th>{series.map((s) => <th key={s.name}>{s.name}</th>)}</tr></thead>
      <tbody>{labels.map((l, i) => <tr key={l}><th>{l}</th>{series.map((s) => <td key={s.name}>{s.values[i]}</td>)}</tr>)}</tbody>
    </table>
  );
}

export type ChartSeries = { name: string; values: number[]; /** "data" (default, the one hue) or "muted" for comparison. */ tone?: "data" | "muted"; dashed?: boolean };

/** Width of an element, kept in sync with ResizeObserver so SVG text never stretches. */
function useWidth<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(120, Math.round(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/* ---------------- Line chart ---------------- */

export function LineChart({
  labels, series, height = 200, format = fmtCompact, label, area = true, zero = false, className,
}: {
  labels: string[];
  series: ChartSeries[];
  height?: number;
  format?: (n: number) => string;
  /** Accessible summary, e.g. "Revenue, last 12 weeks, up 8%". */
  label: string;
  /** Soft fill under the first series. */
  area?: boolean;
  /** Start the y-axis at zero. Off by default for lines, so small changes stay visible. */
  zero?: boolean;
  className?: string;
}) {
  const [ref, W] = useWidth<HTMLElement>();
  const [hover, setHover] = useState<number | null>(null);
  const H = height; const padL = 36; const padR = 8; const padT = 8; const padB = 22;
  const all = series.flatMap((s) => s.values);
  const lo = Math.min(...all); const hi = Math.max(...all);
  const ticks = niceTicks(zero ? Math.min(0, lo) : lo - (hi - lo) * 0.15, hi);
  const yMin = ticks[0]; const yMax = ticks[ticks.length - 1];
  const x = (i: number) => padL + (i / Math.max(1, labels.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const every = Math.ceil(labels.length / 6);

  return (
    <figure ref={ref} className={cn("relative w-full min-w-0", className)}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block overflow-visible" role="img" aria-label={label}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - padL) / (W - padL - padR)) * (labels.length - 1));
          setHover(Math.max(0, Math.min(labels.length - 1, i)));
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--border)" />
            <text x={padL - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-faint text-[10px] tabular">{format(t)}</text>
          </g>
        ))}
        {labels.map((l, i) => {
          const last = i === labels.length - 1;
          if (!last && (i % every !== 0 || labels.length - 1 - i < every / 2)) return null;
          return <text key={l + i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : last ? "end" : "middle"} className="fill-faint text-[10px]">{l}</text>;
        })}
        {area && series[0] && (
          <path d={`${path(series[0].values)}L${x(series[0].values.length - 1)},${y(yMin)}L${x(0)},${y(yMin)}Z`} fill="var(--data)" fillOpacity={0.07} />
        )}
        {[...series].reverse().map((s) => (
          <path key={s.name} d={path(s.values)} fill="none" stroke={s.tone === "muted" ? "var(--faint)" : "var(--data)"} strokeWidth={1.75}
            strokeDasharray={s.dashed ? "4 4" : undefined} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={H - padB} stroke="var(--line-strong)" />
            {series.map((s) => (
              <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r={3.5} fill="var(--background)" stroke={s.tone === "muted" ? "var(--faint)" : "var(--data)"} strokeWidth={1.75} />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 flex min-w-28 -translate-x-1/2 flex-col gap-1 rounded-md bg-popover px-2.5 py-2 text-caption shadow-overlay"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <span className="text-subtle">{labels[hover]}</span>
          {series.map((s) => (
            <span key={s.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-soft"><span className={cn("h-0.5 w-2.5 rounded-full", s.tone === "muted" ? "bg-faint" : "bg-data")} />{s.name}</span>
              <span className="tabular font-medium">{format(s.values[hover])}</span>
            </span>
          ))}
        </div>
      )}
      <SrTable labels={labels} series={series} />
    </figure>
  );
}

/* ---------------- Bar chart ---------------- */

export function BarChart({
  labels, values, compare, height = 180, format = fmtCompact, label, highlight, className,
}: {
  labels: string[];
  values: number[];
  /** Previous period, drawn as a grey bar behind. */
  compare?: number[];
  height?: number;
  format?: (n: number) => string;
  label: string;
  /** Index drawn in the data hue; the rest are muted. Default: all bars in the data hue. */
  highlight?: number;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...values, ...(compare ?? [0]));
  const ticks = niceTicks(0, max, 3);
  const top = ticks[ticks.length - 1];
  return (
    <figure className={cn("relative flex w-full min-w-0 flex-col gap-1.5", className)} aria-label={label} role="img">
      <div className="relative mt-2 flex items-end gap-[3px] pl-8 sm:gap-2" style={{ height }} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <span key={t} aria-hidden className="pointer-events-none absolute right-0 left-8 border-t border-border [&>span]:-left-8" style={{ bottom: `${(t / top) * 100}%` }}>
            <span className="tabular absolute top-0 left-0 -translate-y-1/2 text-[10px] leading-none text-faint">{format(t)}</span>
          </span>
        ))}
        {values.map((v, i) => {
          const muted = highlight !== undefined && highlight !== i;
          return (
            <div key={i} className="relative mx-auto flex h-full min-w-0 max-w-14 flex-1 items-end" onMouseEnter={() => setHover(i)}>
              {compare && <span className="absolute bottom-0 left-[15%] w-[70%] rounded-t-[2px] bg-track" style={{ height: `${(compare[i] / top) * 100}%` }} />}
              <span
                className={cn("relative w-full rounded-t-[3px] transition-[height,opacity] duration-slow ease-out", muted ? "bg-data-muted" : "bg-data", hover !== null && hover !== i && "opacity-60")}
                style={{ height: `${Math.max(1, (v / top) * 100)}%` }}
              />
              {hover === i && (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 flex -translate-x-1/2 flex-col items-center rounded-md bg-popover px-2 py-1 text-caption whitespace-nowrap shadow-overlay">
                  <span className="text-subtle">{labels[i]}</span>
                  <span className="tabular font-medium">{format(v)}</span>
                  {compare && <span className="tabular text-faint">was {format(compare[i])}</span>}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px] pl-8 sm:gap-2" aria-hidden>
        {labels.map((l, i) => (
          <span key={i} className={cn("mx-auto min-w-0 max-w-14 flex-1 truncate text-center text-[10px] text-faint", labels.length > 12 && i % 2 === 1 && "invisible sm:visible")}>{l}</span>
        ))}
      </div>
      <SrTable labels={labels} series={[{ name: "Value", values }, ...(compare ? [{ name: "Previous", values: compare }] : [])]} />
    </figure>
  );
}

/* ---------------- Donut ---------------- */

/**
 * Share of a whole, max ~5 slices. Slices use the data hue at stepped opacity (one entity, one hue).
 * If the parts aren't parts of one whole, use a bar chart.
 */
export function DonutChart({
  data, size = 140, thickness = 14, label, centerLabel, centerValue, format = (n: number) => String(n), className,
}: {
  data: { name: string; value: number }[];
  size?: number;
  thickness?: number;
  label: string;
  centerLabel?: string;
  centerValue?: string;
  format?: (n: number) => string;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const opac = [1, 0.7, 0.48, 0.3, 0.18];
  let acc = 0;
  const arcs = useMemo(
    () =>
      data.map((d, i) => {
        const len = (d.value / total) * c;
        const gap = data.length > 1 ? Math.min(2, len / 2) : 0;
        const a = { d, i, dash: `${Math.max(0, len - gap)} ${c}`, offset: -acc };
        acc += len;
        return a;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, total, c],
  );
  return (
    <figure className={cn("flex flex-wrap items-center gap-5", className)}>
      <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={thickness} />
          {arcs.map((a) => (
            <circle key={a.d.name} cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--data)" strokeOpacity={opac[a.i] ?? 0.15}
              strokeWidth={thickness} strokeDasharray={a.dash} strokeDashoffset={a.offset} />
          ))}
        </svg>
        {(centerValue || centerLabel) && (
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="tabular text-title font-medium">{centerValue}</span>}
            {centerLabel && <span className="text-[11px] text-subtle">{centerLabel}</span>}
          </span>
        )}
      </span>
      <ul className="flex min-w-36 flex-1 flex-col gap-1.5">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-caption">
            <span className="size-2 shrink-0 rounded-[2px] bg-data" style={{ opacity: opac[i] ?? 0.15 }} />
            <span className="min-w-0 flex-1 truncate text-soft">{d.name}</span>
            <span className="tabular text-foreground">{format(d.value)}</span>
            <span className="tabular w-10 text-right text-faint">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ---------------- Sparkline ---------------- */

/**
 * Tiny trend without axes. `variant="bars"` (default) shows discrete periods; `line` for continuous values.
 * Last value is emphasized; earlier bars are muted so the eye reads "where are we now".
 */
export function Sparkline({
  values, variant = "bars", width = 64, height = 16, tone = "data", label, className,
}: {
  values: number[];
  variant?: "bars" | "line";
  width?: number;
  height?: number;
  tone?: "data" | "danger" | "neutral";
  label?: string;
  className?: string;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const strong = tone === "danger" ? "var(--danger)" : tone === "neutral" ? "var(--soft)" : "var(--data)";
  const soft = tone === "danger" ? "color-mix(in srgb, var(--danger) 35%, transparent)" : tone === "neutral" ? "var(--faint)" : "var(--data-muted)";
  if (variant === "line") {
    const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * width},${height - 1 - ((v - min) / (max - min || 1)) * (height - 2)}`).join(" ");
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn("shrink-0 overflow-visible", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        <polyline points={pts} fill="none" stroke={strong} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }
  const bw = (width - (values.length - 1)) / values.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={cn("shrink-0", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {values.map((v, i) => {
        const h = Math.max(1.5, (v / max) * height);
        return <rect key={i} x={i * (bw + 1)} y={height - h} width={bw} height={h} rx={0.75} fill={i === values.length - 1 ? strong : soft} />;
      })}
    </svg>
  );
}
