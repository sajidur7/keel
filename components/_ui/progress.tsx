import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type Tone = "default" | "data" | "success" | "warning" | "danger";
const toneBg: Record<Tone, string> = {
  default: "bg-foreground",
  data: "bg-data",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

/** Linear progress. Omit `value` for an indeterminate bar. */
export function Progress({
  value,
  max = 100,
  tone = "default",
  size = "sm",
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & { value?: number; max?: number; tone?: Tone; size?: "xs" | "sm" | "md" }) {
  const pct = value === undefined ? undefined : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("relative w-full overflow-hidden rounded-full bg-track", size === "xs" ? "h-[3px]" : size === "sm" ? "h-1" : "h-1.5", className)}
      {...props}
    >
      {pct === undefined ? (
        <span className={cn("absolute inset-y-0 w-2/5 rounded-full animate-[keel-indeterminate_1.2s_var(--ease-in-out)_infinite]", toneBg[tone])} />
      ) : (
        <span className={cn("block h-full rounded-full transition-[width] duration-slow ease-out", toneBg[tone])} style={{ width: `${pct}%` }} />
      )}
    </div>
  );
}

/** Circular progress for compact spots (a quota in a sidebar footer, a step score). */
export function ProgressRing({
  value,
  max = 100,
  size = 32,
  stroke = 3,
  tone = "default",
  label,
  showValue = true,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  tone?: Tone;
  label?: string;
  showValue?: boolean;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = { default: "var(--foreground)", data: "var(--data)", success: "var(--success)", warning: "var(--warning)", danger: "var(--danger)" }[tone];
  return (
    <span
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          className="transition-[stroke-dashoffset] duration-slow ease-out"
        />
      </svg>
      {showValue && size >= 28 && (
        <span className="tabular absolute text-[10px] font-medium" style={{ fontSize: size >= 44 ? 12 : 10 }}>{Math.round(pct)}</span>
      )}
    </span>
  );
}

/**
 * Segmented bar — a score or capacity as discrete blocks. `tone="auto"` colors filled
 * segments by how full the bar is (low = danger, mid = warning, high = success);
 * pass a fixed tone when "more" isn't "better".
 */
export function SegmentBar({
  value,
  max = 100,
  segments = 12,
  tone = "data",
  size = "md",
  className,
  label,
}: {
  value: number;
  max?: number;
  segments?: number;
  tone?: "auto" | Tone;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const pct = Math.min(1, Math.max(0, value / max));
  const filled = Math.round(pct * segments);
  const autoTone: Tone = pct < 0.34 ? "danger" : pct < 0.67 ? "warning" : "success";
  const t = tone === "auto" ? autoTone : tone;
  return (
    <span
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cn("inline-flex w-full items-center gap-[2px]", size === "md" ? "h-2.5" : "h-1.5", className)}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span key={i} className={cn("h-full min-w-[2px] flex-1 rounded-[1.5px]", i < filled ? toneBg[t] : "bg-track")} />
      ))}
    </span>
  );
}
