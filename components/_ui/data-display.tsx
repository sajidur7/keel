import { useState, type ComponentProps, type ReactNode } from "react";
import { IconButton } from "./button";
import { IconArrowDownRight, IconArrowUpRight, IconCheck, IconCopy } from "./icons";
import { cn } from "../lib/cn";
import { Tooltip } from "./tooltip";
import { Progress } from "./progress";

/* ---------------- Description list ---------------- */

export type DescriptionItem = { label: ReactNode; value: ReactNode; /** Spans both columns in `columns={2}` layouts. */ full?: boolean };

/**
 * Key/value pairs for a record. `layout="horizontal"` (default) puts labels in a 136px column;
 * `stacked` puts them above values. `columns={2}` splits pairs into two columns from 768px.
 */
export function DescriptionList({
  items,
  layout = "horizontal",
  columns = 1,
  className,
}: {
  items: DescriptionItem[];
  layout?: "horizontal" | "stacked";
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-8", columns === 2 && "md:grid-cols-2", layout === "stacked" ? "gap-y-4" : "gap-y-0", className)}>
      {items.map((it, i) => (
        <div
          key={i}
          className={cn(
            "min-w-0",
            layout === "horizontal" ? "grid grid-cols-[minmax(96px,136px)_minmax(0,1fr)] items-baseline gap-3 py-[7px]" : "flex flex-col gap-1",
            it.full && "md:col-span-2",
          )}
        >
          <dt className="truncate text-small text-subtle">{it.label}</dt>
          <dd className="min-w-0 text-small break-words text-foreground">{it.value ?? <span className="text-faint">—</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------- Stat / KPI ---------------- */

export type StatProps = {
  label: ReactNode;
  /** The number. `null` shows an em dash (no data yet). */
  value: ReactNode;
  /** Explanation in a tooltip on the label. Gives the label its dashed underline. */
  help?: ReactNode;
  /** Small icon before the label (16px Lucide). Never an icon square. */
  icon?: ReactNode;
  /** Top-right slot: an IconButton menu, a "View" link, a period Select. */
  action?: ReactNode;

  /** Change vs the baseline, e.g. 6.2 for +6.2%. Sign decides the arrow. */
  delta?: number;
  /** Unit after the delta. Use "pt" for percentage points, "" for counts. */
  deltaUnit?: string;
  /** One- or two-word baseline: "vs Oct", "vs last week". */
  baseline?: ReactNode;
  /** For cost, churn and latency a drop is good. Flips delta colors. */
  lowerIsBetter?: boolean;
  /** Keeps the delta grey (metrics with no good direction). */
  neutral?: boolean;
  /** Quiet text in the delta row, e.g. "of $102.8k" or "12 new this week". */
  meta?: ReactNode;

  /** Progress toward a target. Renders a bar with "61% of $102.8k" under the number. */
  progress?: { value: number; max?: number; label?: ReactNode; tone?: "default" | "data" | "success" | "warning" | "danger" };
  /** Any small visual under the number: Sparkline, SegmentBar, BarChart. */
  chart?: ReactNode;
  /** Bottom row under a hairline: a link, a timestamp, a breakdown. */
  footer?: ReactNode;

  /** `stacked` (default) puts the delta on its own row; `inline` puts it beside the number. */
  layout?: "stacked" | "inline";
  size?: "sm" | "md" | "lg";
  /** `plain` for use inside StatGroup; `card` adds a hairline box for standalone use. */
  variant?: "plain" | "card";
  loading?: boolean;
  className?: string;
};

const statValueSize = { sm: "text-title", md: "text-display", lg: "text-stat" } as const;

/**
 * A headline number with its comparison. Every part except label and value is optional — turn parts on and
 * off with props: help (dashed underline + tooltip), icon, action, delta + baseline, meta, progress, chart,
 * footer. Put several in a StatGroup, or use `variant="card"` on its own.
 */
export function Stat({
  label, value, help, icon, action, delta, deltaUnit = "%", baseline, lowerIsBetter, neutral, meta,
  progress, chart, footer, layout = "stacked", size = "md", variant = "plain", loading, className,
}: StatProps) {
  const good = delta === undefined ? undefined : lowerIsBetter ? delta < 0 : delta > 0;
  const tone = neutral || !delta ? "text-subtle" : good ? "text-success" : "text-danger";
  const labelText = (
    <span className={cn("eyebrow", help && "underline decoration-faint decoration-dashed underline-offset-[4px]")}>{label}</span>
  );
  const labelEl = help ? (
    <Tooltip content={help}>
      <span tabIndex={0} className="w-fit cursor-help rounded-xs outline-none focus-visible:shadow-focus">{labelText}</span>
    </Tooltip>
  ) : labelText;

  const deltaRow = (delta !== undefined || meta) && (
    <span className="tabular flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-caption">
      {delta !== undefined && (
        <span className={cn("inline-flex items-center gap-0.5", tone)}>
          {delta > 0 ? <IconArrowUpRight size={12} /> : delta < 0 ? <IconArrowDownRight size={12} /> : null}
          {delta > 0 ? "+" : delta < 0 ? "−" : ""}{Math.abs(delta)}{deltaUnit}
        </span>
      )}
      {delta !== undefined && baseline && <span className="text-subtle">{baseline}</span>}
      {meta && <span className="text-subtle">{meta}</span>}
    </span>
  );

  const pct = progress ? Math.round((progress.value / (progress.max ?? 100)) * 100) : 0;

  return (
    <div
      aria-busy={loading || undefined}
      className={cn(
        "flex min-w-0 flex-col gap-2",
        variant === "card" && "rounded-lg bg-background p-4 shadow-card",
        className,
      )}
    >
      <div className="flex min-h-5 items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-faint [&_svg]:size-3.5 [&_svg]:shrink-0">{icon}{labelEl}</span>
        {action && <span className="-my-1 -mr-1 flex shrink-0 items-center">{action}</span>}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2" aria-hidden>
          <span className={cn("block w-24 animate-pulse rounded-sm bg-muted", size === "lg" ? "h-8" : size === "md" ? "h-6" : "h-5")} />
          <span className="block h-3 w-16 animate-pulse rounded-sm bg-muted" />
        </div>
      ) : (
        <div className={cn("flex min-w-0", layout === "inline" ? "flex-wrap items-baseline gap-x-2.5 gap-y-1" : "flex-col gap-1")}>
          <span className={cn("tabular truncate font-medium tracking-[-0.02em] text-foreground", statValueSize[size])}>
            {value ?? "—"}
          </span>
          {deltaRow}
        </div>
      )}

      {!loading && progress && (
        <div className="flex flex-col gap-1.5 pt-0.5">
          <Progress value={progress.value} max={progress.max} tone={progress.tone ?? "data"} />
          {progress.label !== undefined
            ? progress.label && <span className="tabular text-caption text-subtle">{progress.label}</span>
            : <span className="tabular text-caption text-subtle">{pct}% of target</span>}
        </div>
      )}
      {!loading && chart && <div className="min-w-0 pt-0.5">{chart}</div>}
      {footer && (
        <div className="-mx-4 mt-1 flex items-center justify-between gap-2 border-t border-border px-4 pt-3 text-caption text-subtle [&_a]:text-soft [&_a:hover]:text-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}

/** Row of Stats divided by hairlines. Wraps 2-up on phones. */
export function StatGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border shadow-card md:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]",
        "[&>*]:bg-background [&>*]:p-4",
        className,
      )}
      {...props}
    />
  );
}

/* ---------------- List ---------------- */

/** Simple vertical list with hairline dividers. Use for small sets (≤ 20) with one action each. */
export function List({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col", className)} {...props} />;
}
export function ListItem({
  leading,
  title,
  description,
  meta,
  trailing,
  onClick,
  selected,
  className,
}: {
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  const body = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="truncate text-small text-foreground">{title}</span>
        {description && <span className="truncate text-caption text-subtle">{description}</span>}
      </span>
      {meta && <span className="tabular shrink-0 text-caption text-subtle">{meta}</span>}
      {trailing}
    </>
  );
  const cls = cn(
    "flex w-full min-w-0 items-center gap-3 border-b border-border py-2.5 last:border-b-0",
    onClick && "cursor-pointer rounded-md px-2 -mx-2 outline-none hover:bg-hover focus-visible:shadow-focus",
    selected && "bg-selected",
    className,
  );
  return (
    <li className={onClick ? "border-b border-border last:border-b-0 [&>button]:border-b-0" : undefined}>
      {onClick ? <button type="button" className={cls} onClick={onClick} aria-current={selected || undefined}>{body}</button> : <div className={cls}>{body}</div>}
    </li>
  );
}

/* ---------------- Timeline / activity feed ---------------- */

export type TimelineEvent = {
  id: string;
  /** Avatar or small icon. Defaults to a dot. */
  marker?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  time: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

/** Chronological events, newest first. The rail is a single hairline; markers sit on it. */
export function Timeline({ events, className }: { events: TimelineEvent[]; className?: string }) {
  const dot = { default: "bg-faint", success: "bg-success", warning: "bg-warning", danger: "bg-danger", info: "bg-info" } as const;
  return (
    <ol className={cn("relative flex flex-col", className)}>
      {events.map((e, i) => (
        <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < events.length - 1 && <span aria-hidden className="absolute top-6 bottom-0 left-[9.5px] w-px bg-border" />}
          <span className="relative z-[1] flex size-5 shrink-0 items-center justify-center">
            {e.marker ?? <span className={cn("size-2 rounded-full ring-4 ring-background", dot[e.tone ?? "default"])} />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1 pt-px">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="min-w-0 text-small text-soft [&_b]:font-medium [&_b]:text-foreground">{e.title}</span>
              <time className="tabular shrink-0 text-caption text-faint">{e.time}</time>
            </div>
            {e.body && <div className="text-small text-subtle">{e.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Code block ---------------- */

/** Monospace block with a copy button. No syntax colors by default — admin code is usually ids, JSON and commands. */
export function CodeBlock({
  code,
  language,
  title,
  wrap,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  wrap?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={cn("group/code relative min-w-0 overflow-hidden rounded-lg bg-surface shadow-card", className)}>
      {(title || language) && (
        <div className="flex h-8 items-center justify-between border-b border-border px-3">
          <span className="text-caption text-subtle">{title ?? language}</span>
        </div>
      )}
      <pre className={cn("overflow-x-auto p-3 pr-12 font-mono text-caption leading-relaxed text-soft", wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre")}>
        <code>{code}</code>
      </pre>
      <span className={cn("absolute right-1.5", title || language ? "top-1" : "top-1.5")}>
        <IconButton
          label={copied ? "Copied" : "Copy code"}
          size="xs"
          onClick={async () => {
            try { await navigator.clipboard.writeText(code); } catch { /* clipboard may be blocked */ }
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
        >
          {copied ? <IconCheck className="text-success!" /> : <IconCopy />}
        </IconButton>
      </span>
    </div>
  );
}

/** Inline monospace value (ids, keys). */
export function Code({ className, ...props }: ComponentProps<"code">) {
  return <code className={cn("rounded-xs bg-muted px-1 py-px font-mono text-[0.92em] text-soft", className)} {...props} />;
}
