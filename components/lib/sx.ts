import * as stylex from "@stylexjs/stylex";
import type { CSSProperties } from "react";

/** A StyleX style (or a falsy value) — what `xstyle` props accept. */
export type XStyle = stylex.StyleXStyles | false | null | undefined;

/** Props every Keel component accepts for one-off styling. Prefer `xstyle` (StyleX) over className. */
export type StyleProps = {
  /** StyleX overrides, applied last: `xstyle={styles.wide}`. */
  xstyle?: XStyle | XStyle[];
  className?: string;
  style?: CSSProperties;
};

/** Anything stylex.props accepts: styles, falsy values, dynamic-style tuples, nested arrays. */
type Arg = stylex.StyleXStyles | boolean | null | undefined | readonly unknown[];

/**
 * Merge StyleX styles with a consumer's className/style. Later styles win.
 *   <div {...sx(props, s.base, isOn && s.on)} />
 * The consumer's `xstyle` is applied after the component's own styles.
 */
export function sx(p: StyleProps | undefined, ...styles: Arg[]): { className?: string; style?: CSSProperties } {
  const out = stylex.props(...(styles as never[]), (p?.xstyle ?? null) as never);
  const className = [out.className, p?.className].filter(Boolean).join(" ") || undefined;
  const style = p?.style ? { ...out.style, ...p.style } : out.style;
  return { className, style };
}

/** stylex.props for internal parts that take no consumer overrides. */
export const px = (...styles: Arg[]) => stylex.props(...(styles as never[]));

/** Join plain class names (for Radix data attributes etc.). */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ") || undefined;
