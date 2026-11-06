import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

/** Placeholder block while content loads. Shape it to the real content so nothing jumps. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("rounded-sm bg-muted motion-safe:animate-[keel-pulse_1.6s_var(--ease-in-out)_infinite]", className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

/**
 * Empty state: what this space is for, and the one action that fills it.
 * Keep it to a title, one line, and at most two buttons. No illustrations.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  size = "md",
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" && "gap-2 py-8",
        size === "md" && "gap-3 py-14",
        size === "lg" && "gap-3 py-24",
        className,
      )}
    >
      {icon && (
        <span className="mb-1 inline-flex size-9 items-center justify-center rounded-lg bg-card text-icon shadow-raised [&_svg]:size-4">
          {icon}
        </span>
      )}
      <div className="flex max-w-80 flex-col gap-1">
        <p className="text-body font-medium">{title}</p>
        {description && <p className="text-small text-subtle">{description}</p>}
      </div>
      {action && <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{action}</div>}
    </div>
  );
}
