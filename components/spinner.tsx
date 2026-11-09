import * as stylex from "@stylexjs/stylex";
import { color } from "../tokens/tokens.stylex";
import { sx, type StyleProps } from "./lib/sx";

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });

const s = stylex.create({
  root: {
    display: "inline-block", flexShrink: 0, borderRadius: "50%",
    borderStyle: "solid", borderColor: "currentColor", borderRightColor: "transparent", borderBottomColor: "transparent",
    opacity: 0.85, animationName: spin, animationDuration: "0.7s", animationTimingFunction: "linear", animationIterationCount: "infinite",
  },
  size: (px: number) => ({ width: px, height: px, borderWidth: px >= 20 ? 2 : 1.5 }),
  muted: { color: color.fgMuted },
});

export type SpinnerProps = StyleProps & {
  /** Diameter in px. Match the text beside it: 12 for captions, 14 for body. */
  size?: number;
  /** Announced to screen readers. Pass "" when visible text already says it. */
  label?: string;
  tone?: "current" | "muted";
};

/** A small ring that spins. Inherits the text color unless `tone="muted"`. */
export function Spinner({ size = 14, label = "Loading", tone = "current", ...p }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      {...sx(p, s.root, s.size(size), tone === "muted" && s.muted)}
    />
  );
}
