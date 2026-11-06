import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { IconX } from "./icons";
import { cn } from "../lib/cn";

export const TAG_TONES = ["neutral", "blue", "cyan", "teal", "green", "yellow", "orange", "red", "pink", "violet"] as const;
export type TagTone = (typeof TAG_TONES)[number];

const toneClass: Record<TagTone, string> = {
  neutral: "border-tag-neutral-border bg-tag-neutral-bg text-tag-neutral-text",
  blue: "border-tag-blue-border bg-tag-blue-bg text-tag-blue-text",
  cyan: "border-tag-cyan-border bg-tag-cyan-bg text-tag-cyan-text",
  teal: "border-tag-teal-border bg-tag-teal-bg text-tag-teal-text",
  green: "border-tag-green-border bg-tag-green-bg text-tag-green-text",
  yellow: "border-tag-yellow-border bg-tag-yellow-bg text-tag-yellow-text",
  orange: "border-tag-orange-border bg-tag-orange-bg text-tag-orange-text",
  red: "border-tag-red-border bg-tag-red-bg text-tag-red-text",
  pink: "border-tag-pink-border bg-tag-pink-bg text-tag-pink-text",
  violet: "border-tag-violet-border bg-tag-violet-bg text-tag-violet-text",
};

export const tagVariants = cva(
  "inline-flex max-w-full shrink-0 items-center gap-1 whitespace-nowrap rounded-full border leading-none font-normal",
  {
    variants: {
      tone: toneClass,
      size: { sm: "h-[18px] px-1.5 text-[11px]", md: "h-5 px-2 text-caption", lg: "h-6 px-2.5 text-small" },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type TagProps = ComponentProps<"span"> &
  VariantProps<typeof tagVariants> & {
    /** Small dot in the tag's own tone, useful for categories. */
    dot?: boolean;
    icon?: ReactNode;
    /** Shows a remove button. */
    onRemove?: () => void;
    removeLabel?: string;
  };

/** Category label. Tone carries the category; don't use tags for actions. */
export function Tag({ tone, size, dot, icon, onRemove, removeLabel, className, children, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ tone, size }), onRemove && "pr-0.5", className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current opacity-80" />}
      {icon && <span className="inline-flex [&_svg]:size-3">{icon}</span>}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : ""}`.trim()}
          className="inline-flex size-4 items-center justify-center rounded-full opacity-70 outline-none hover:bg-current/15 hover:opacity-100 focus-visible:shadow-focus"
        >
          <IconX size={12} />
        </button>
      )}
    </span>
  );
}

/* ---------------- Status pill ---------------- */

export type Status = "active" | "success" | "warning" | "danger" | "info" | "neutral" | "pending";
const statusDot: Record<Status, string> = {
  active: "bg-data",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-faint",
  pending: "bg-faint",
};

/**
 * A neutral pill with a colored dot. Unlike Tag, the pill itself stays grey so a column
 * full of statuses stays readable; only the dot carries the color. `pulse` animates the
 * dot for live states (respects reduced motion).
 */
export function StatusPill({
  status = "neutral",
  pulse,
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"span"> & { status?: Status; pulse?: boolean; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-muted leading-none text-soft shadow-[0_0_0_1px_var(--line-strong)]",
        size === "sm" ? "h-[18px] pr-1.5 pl-1.5 text-[11px]" : "h-5 pr-2 pl-1.5 text-caption",
        status === "pending" && "bg-transparent shadow-[inset_0_0_0_1px_var(--line-strong)]",
        className,
      )}
      {...props}
    >
      <span className="relative inline-flex size-1.5" aria-hidden>
        {pulse && <span className={cn("absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping", statusDot[status])} />}
        <span className={cn("relative size-1.5 rounded-full", statusDot[status], status === "pending" && "bg-transparent ring-1 ring-faint")} />
      </span>
      {children}
    </span>
  );
}

/* ---------------- Count badge ---------------- */

/** Small numeric pill used in nav items, tabs and buttons. Caps at `max` ("99+"). */
export function CountBadge({
  count,
  max = 99,
  tone = "neutral",
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & { count: number; max?: number; tone?: "neutral" | "strong" | "danger" }) {
  const label = count > max ? `${max}+` : String(count);
  return (
    <span
      className={cn(
        "tabular inline-flex h-4 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[11px] leading-none",
        tone === "neutral" && "bg-muted text-soft shadow-[0_0_0_1px_var(--line-strong)]",
        tone === "strong" && "bg-primary text-primary-foreground",
        tone === "danger" && "bg-danger-solid text-danger-foreground",
        className,
      )}
      aria-label={`${count}`}
      {...props}
    >
      {label}
    </span>
  );
}
