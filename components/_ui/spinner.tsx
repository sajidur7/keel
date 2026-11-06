import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

export type SpinnerProps = ComponentProps<"span"> & {
  size?: 12 | 14 | 16 | 20 | 24;
  /** Announced to screen readers. Pass "" when the parent already says it is loading. */
  label?: string;
};

/** A quiet circular spinner. Uses currentColor, so it takes the text color of its parent. */
export function Spinner({ size = 14, label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      className={cn("inline-flex shrink-0", className)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="animate-spin [animation-duration:700ms] motion-reduce:[animation-duration:2s]"
      >
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.75" />
        <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </span>
  );
}
