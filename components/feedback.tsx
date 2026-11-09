/**
 * Feedback & status.
 * Badge · CountBadge · StatusPill · StatusDot · Banner · Alert · InlineMessage · InfoTip · ProgressBar · ProgressRing ·
 * SegmentBar · ProgressDots · Skeleton · SkeletonText · Spinner · Toaster/useToast · EmptyState ·
 * StatusPage · NotFoundPage · ForbiddenPage · ServerErrorPage · OfflineState · PermissionState
 */
import * as stylex from "@stylexjs/stylex";
import { Toast as T } from "radix-ui";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius, z } from "../tokens/tokens.stylex";
import { Button, IconButton } from "./action";
import {
  IconAlertCircle, IconAlertTriangle, IconCheckCircle, IconHelp, IconInfo, IconLock, IconSizeContext, IconWifiOff, IconX, IconXCircle,
} from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Popover, PopoverContent, PopoverTrigger } from "./overlay";
export { Spinner } from "./spinner";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const pulse = stylex.keyframes({ "0%": { transform: "scale(1)", opacity: 0.55 }, "100%": { transform: "scale(2.6)", opacity: 0 } });
const shimmer = stylex.keyframes({ from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } });
const indet = stylex.keyframes({ from: { transform: "translateX(-100%)" }, to: { transform: "translateX(260%)" } });
const toastIn = stylex.keyframes({ from: { opacity: 0, transform: "translateY(10px) scale(0.97)" }, to: { opacity: 1, transform: "none" } });
const toastOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0, transform: "translateX(24px)" } });

const st = stylex.create({
  fgNeutral: { color: color.fgMuted }, fgInfo: { color: color.info }, fgSuccess: { color: color.success }, fgWarning: { color: color.warning }, fgDanger: { color: color.danger },
  bgNeutral: { backgroundColor: color.fgFaint }, bgInfo: { backgroundColor: color.accent }, bgSuccess: { backgroundColor: color.successSolid }, bgWarning: { backgroundColor: color.warningSolid }, bgDanger: { backgroundColor: color.danger },
  softNeutral: { backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}` },
  softInfo: { backgroundColor: color.infoSoft, boxShadow: `inset 0 0 0 1px ${color.infoBorder}` },
  softSuccess: { backgroundColor: color.successSoft, boxShadow: `inset 0 0 0 1px ${color.successBorder}` },
  softWarning: { backgroundColor: color.warningSoft, boxShadow: `inset 0 0 0 1px ${color.warningBorder}` },
  softDanger: { backgroundColor: color.dangerSoft, boxShadow: `inset 0 0 0 1px ${color.dangerBorder}` },
});
const cap = (t: StatusTone) => (t[0].toUpperCase() + t.slice(1)) as "Neutral" | "Info" | "Success" | "Warning" | "Danger";
const fgOf = (t: StatusTone) => st[`fg${cap(t)}`];
const bgOf = (t: StatusTone) => st[`bg${cap(t)}`];
const softOf = (t: StatusTone) => st[`soft${cap(t)}`];
const ICON: Record<StatusTone, ReactNode> = {
  neutral: <IconInfo />, info: <IconInfo />, success: <IconCheckCircle />, warning: <IconAlertTriangle />, danger: <IconAlertCircle />,
};

const f = stylex.create({
  row: { display: "flex", alignItems: "center", gap: 6 },
  col: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 },
  strong: { fontWeight: font.medium, color: color.fg },
  soft: { color: color.fgSoft },
  muted: { color: color.fgMuted, fontSize: font.sm },
  srOnly: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" },
  // badge
  badgeWrap: { position: "relative", display: "inline-flex" },
  badge: {
    position: "absolute", top: -5, right: -6, zIndex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
    minWidth: 16, height: 16, paddingInline: 4, borderRadius: radius.full, fontSize: "10px", fontWeight: font.semibold, lineHeight: 1,
    color: "#fff", boxShadow: `0 0 0 2px ${color.surface}, inset 0 1px 0 rgba(255,255,255,0.25)`, fontVariantNumeric: "tabular-nums",
  },
  badgeDot: { minWidth: 8, width: 8, height: 8, padding: 0, top: -1, right: -1 },
  badgeInline: { position: "static", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" },
  count: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, paddingInline: 5,
    borderRadius: radius.full, fontSize: font.xs, fontWeight: font.medium, lineHeight: 1, fontVariantNumeric: "tabular-nums",
    color: color.fgSoft, backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}`,
  },
  countAccent: { color: color.onAccent, backgroundColor: color.accent, boxShadow: "none" },
  // status pill
  pill: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 22, paddingInlineStart: 7, paddingInlineEnd: 9,
    borderRadius: radius.full, fontSize: font.sm, fontWeight: font.medium, whiteSpace: "nowrap", color: color.fg,
    backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.border}, 0 1px 1px ${color.shadeXs}`,
  },
  // status dot
  dotWrap: { position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 },
  dot: { width: "100%", height: "100%", borderRadius: "50%", boxShadow: `0 0 0 2px ${color.surface}` },
  dotPulse: { position: "absolute", inset: 0, borderRadius: "50%", animationName: pulse, animationDuration: "1.6s", animationIterationCount: "infinite", animationTimingFunction: "ease-out" },
  // banner / alert
  banner: {
    display: "flex", alignItems: "flex-start", gap: 10, paddingInline: 14, paddingBlock: 10, borderRadius: radius.lg, fontSize: font.md, color: color.fg,
  },
  bannerFlat: { borderRadius: 0, boxShadow: "none" },
  bannerIcon: { display: "inline-flex", marginTop: 1, flexShrink: 0 },
  bannerEnd: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginInlineStart: "auto" },
  alert: {
    display: "flex", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: radius.xl, fontSize: font.md,
    backgroundColor: color.surface, boxShadow: depth.card, position: "relative", overflow: "hidden",
  },
  alertBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  alertIcon: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: radius.md, flexShrink: 0,
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  inline: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: font.sm, lineHeight: 1.4 },
  // info tip
  tipBtn: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", verticalAlign: "middle", borderRadius: "50%",
    color: { default: color.fgFaint, ":hover": color.fgSoft }, outline: "none", ":focus-visible": { boxShadow: depth.focus }, cursor: "help",
  },
  tipBody: { maxWidth: 280, fontSize: font.md, lineHeight: 1.5, color: color.fgSoft },
  // progress
  track: { position: "relative", width: "100%", overflow: "hidden", borderRadius: radius.full, backgroundColor: color.muted, boxShadow: `inset 0 1px 1px ${color.shadeXs}` },
  xs: { height: 3 }, sm: { height: 5 }, md: { height: 8 }, lg: { height: 12 },
  fill: {
    position: "relative", display: "block", height: "100%", borderRadius: radius.full, transitionProperty: "width", transitionDuration: motion.slow, transitionTimingFunction: motion.ease,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
  },
  fillDefault: { backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})` },
  fillInk: { backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})` },
  indet: { position: "absolute", top: 0, bottom: 0, width: "40%", animationName: indet, animationDuration: "1.3s", animationIterationCount: "infinite", animationTimingFunction: motion.inOut },
  progHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 6, fontSize: font.sm },
  marks: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: color.surface, opacity: 0.8 },
  disabled: { opacity: 0.5 },
  ringNum: { position: "absolute", fontWeight: font.semibold, fontVariantNumeric: "tabular-nums" },
  // segments
  segs: { display: "flex", gap: 2, width: "100%" },
  seg: { flex: 1, borderRadius: 2, backgroundColor: color.muted },
  // dots
  dots: { display: "inline-flex", alignItems: "center", gap: 5 },
  pdot: { width: 6, height: 6, borderRadius: radius.full, backgroundColor: color.borderStrong, transitionProperty: "width, background-color", transitionDuration: motion.base, transitionTimingFunction: motion.spring },
  pdotOn: { width: 18, backgroundColor: color.fg },
  pdotInv: { backgroundColor: "rgba(255,255,255,0.35)" },
  pdotInvOn: { backgroundColor: "#fff" },
  // skeleton
  skel: {
    display: "block", borderRadius: radius.sm, backgroundColor: color.muted,
    backgroundImage: `linear-gradient(90deg, transparent 0%, ${color.hover} 40%, ${color.highlight} 50%, ${color.hover} 60%, transparent 100%)`,
    backgroundSize: "200% 100%", animationName: shimmer, animationDuration: "1.6s", animationIterationCount: "infinite", animationTimingFunction: "linear",
  },
  skelLines: { display: "flex", flexDirection: "column", gap: 8 },
  dim: (w: number | string, h: number | string) => ({ width: w, height: h }),
  // toast
  viewport: {
    position: "fixed", right: 0, bottom: 0, zIndex: z.toast, display: "flex", flexDirection: "column", gap: 8,
    width: "100%", maxWidth: 400, padding: 16, margin: 0, listStyle: "none", outline: "none",
  },
  toast: {
    position: "relative", display: "flex", alignItems: "flex-start", gap: 10, padding: 12, paddingInlineEnd: 36,
    borderRadius: radius.xl, backgroundColor: color.surfaceRaised, boxShadow: depth.popover, fontSize: font.md,
    ":is([data-state=open])": { animationName: toastIn, animationDuration: motion.base, animationTimingFunction: motion.spring },
    ":is([data-state=closed])": { animationName: toastOut, animationDuration: motion.fast },
    ":is([data-swipe=move])": { transform: "translateX(var(--radix-toast-swipe-move-x))" },
  },
  toastClose: { position: "absolute", top: 8, right: 8 },
  toastIcon: { display: "inline-flex", marginTop: 1 },
  // empty
  empty: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6, paddingBlock: 40, paddingInline: 16, maxWidth: 420, marginInline: "auto" },
  emptyCompact: { paddingBlock: 20, gap: 4 },
  emptyArt: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, marginBottom: 8, borderRadius: radius.xl, color: color.icon,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: `${depth.raised}, 0 8px 20px -10px ${color.shadeLg}`,
  },
  emptyTitle: { fontSize: font.xl, fontWeight: font.semibold, color: color.fg, letterSpacing: "-0.01em" },
  emptyDesc: { fontSize: font.md, color: color.fgMuted, lineHeight: 1.55, textWrap: "pretty" },
  emptyActions: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 12 },
  // status page
  page: { display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center", paddingBlock: 48, paddingInline: 16 },
  pageInner: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8, maxWidth: 440 },
  code: {
    fontFamily: font.mono, fontSize: "56px", fontWeight: font.semibold, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8,
    backgroundImage: `linear-gradient(180deg, ${color.fg}, ${color.fgFaint})`, backgroundClip: "text", color: "transparent",
  },
  pageTitle: { fontSize: font.h2, fontWeight: font.semibold, letterSpacing: "-0.015em" },
  detail: { marginTop: 12, fontFamily: font.mono, fontSize: font.sm, color: color.fgFaint },
});

/* ============================================================== Badge / CountBadge */

/** A number or dot pinned to the corner of an icon/avatar (unread, alerts). Wrap the element. */
export function Badge({ children, count, dot, max = 99, tone = "danger", label }: {
  children?: ReactNode; count?: number; dot?: boolean; max?: number; tone?: StatusTone; label?: string;
}) {
  const show = dot || (count !== undefined && count > 0);
  const text = count !== undefined && count > max ? `${max}+` : count;
  const el = show && <span aria-label={label ?? (dot ? "New" : `${count}`)} {...px(f.badge, bgOf(tone), dot && f.badgeDot, !children && f.badgeInline)}>{!dot && text}</span>;
  if (!children) return el || null;
  return <span {...px(f.badgeWrap)}>{children}{el}</span>;
}

/** A small count next to a label (tabs, nav, filters). */
export function CountBadge({ children, tone = "neutral", xstyle }: { children: ReactNode; tone?: "neutral" | "accent" } & StyleProps) {
  return <span {...sx({ xstyle }, f.count, tone === "accent" && f.countAccent)}>{children}</span>;
}

/* ============================================================== StatusDot / StatusPill */

/** A colored dot for live state. `pulse` for "happening now". */
export function StatusDot({ tone = "success", pulse, label, xstyle }: { tone?: StatusTone; pulse?: boolean; label?: string } & StyleProps) {
  return (
    <span role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...sx({ xstyle }, f.dotWrap)}>
      {pulse && <span {...px(f.dotPulse, bgOf(tone))} />}
      <span {...px(f.dot, bgOf(tone))} />
    </span>
  );
}

export type Status = "active" | "success" | "warning" | "danger" | "info" | "neutral" | "pending";
const STATUS_TONE: Record<Status, StatusTone> = { active: "success", success: "success", warning: "warning", danger: "danger", info: "info", neutral: "neutral", pending: "warning" };

/** A record's state — a dot and a word on a white pill. Words should be the status name ("Paid", "Overdue"). */
export function StatusPill({ status = "neutral", children, pulse, xstyle }: { status?: Status; children: ReactNode; pulse?: boolean } & StyleProps) {
  return <span {...sx({ xstyle }, f.pill)}><StatusDot tone={STATUS_TONE[status]} pulse={pulse ?? status === "active"} />{children}</span>;
}

/* ============================================================== Banner / Alert / InlineMessage */

export type BannerProps = StyleProps & {
  tone?: StatusTone;
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode | false;
  /** Buttons/links on the right. */
  action?: ReactNode;
  onDismiss?: () => void;
  /** Full-bleed strip across the top of the page (no radius). */
  flat?: boolean;
};

/** A page- or section-level message that stays until resolved (trial ending, sync paused). */
export function Banner({ tone = "info", title, children, icon, action, onDismiss, flat, ...p }: BannerProps) {
  return (
    <div role={tone === "danger" || tone === "warning" ? "alert" : "status"} {...sx(p, f.banner, softOf(tone), flat && f.bannerFlat)}>
      {icon !== false && <span {...px(f.bannerIcon, fgOf(tone))}><IconSizeContext.Provider value={16}>{icon ?? ICON[tone]}</IconSizeContext.Provider></span>}
      <div {...px(f.col)}>
        {title && <p {...px(f.strong)}>{title}</p>}
        {children && <div {...px(f.soft)}>{children}</div>}
      </div>
      {(action || onDismiss) && (
        <div {...px(f.bannerEnd)}>
          {action}
          {onDismiss && <IconButton label="Dismiss" size="xs" onClick={onDismiss} tooltip={false}><IconX /></IconButton>}
        </div>
      )}
    </div>
  );
}

/** A raised message card inside content — a result, a warning before a form, a next step. */
export function Alert({ tone = "info", title, children, icon, action, onDismiss, ...p }: Omit<BannerProps, "flat">) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} {...sx(p, f.alert)}>
      <span aria-hidden {...px(f.alertBar, bgOf(tone))} />
      {icon !== false && <span {...px(f.alertIcon, softOf(tone), fgOf(tone))}><IconSizeContext.Provider value={16}>{icon ?? ICON[tone]}</IconSizeContext.Provider></span>}
      <div {...px(f.col)}>
        {title && <p {...px(f.strong)}>{title}</p>}
        {children && <div {...px(f.soft)}>{children}</div>}
        {action && <div {...px(f.actions)}>{action}</div>}
      </div>
      {onDismiss && <IconButton label="Dismiss" size="xs" onClick={onDismiss} tooltip={false}><IconX /></IconButton>}
    </div>
  );
}

/** One line of status beside a field or row: "Saved", "Couldn't sync". */
export function InlineMessage({ tone = "info", children, xstyle }: { tone?: StatusTone; children: ReactNode } & StyleProps) {
  return (
    <span role="status" {...sx({ xstyle }, f.inline, fgOf(tone))}>
      <IconSizeContext.Provider value={14}>{ICON[tone]}</IconSizeContext.Provider>
      <span>{children}</span>
    </span>
  );
}

/* ============================================================== InfoTip */

/** A "?" that explains a term. Opens on click/tap (works on touch), unlike Tooltip. */
export function InfoTip({ children, label = "More info", size = 14 }: { children: ReactNode; label?: string; size?: 12 | 14 | 16 }) {
  return (
    <Popover>
      <PopoverTrigger aria-label={label} {...px(f.tipBtn)}><IconHelp size={size} /></PopoverTrigger>
      <PopoverContent side="top" align="center" arrow><div {...px(f.tipBody)}>{children}</div></PopoverContent>
    </Popover>
  );
}

/* ============================================================== Progress */

export type ProgressTone = "default" | "ink" | "success" | "warning" | "danger";
const fillOf = (t: ProgressTone) => (t === "default" ? f.fillDefault : t === "ink" ? f.fillInk : bgOf(t));

export type ProgressBarProps = StyleProps & {
  value?: number;
  max?: number;
  tone?: ProgressTone;
  size?: "xs" | "sm" | "md" | "lg";
  /** Visible label above the bar. */
  label?: ReactNode;
  /** Show "42%" (or your formatter's text) at the end of the label row. */
  showValue?: boolean | ((value: number, max: number) => ReactNode);
  /** Tick marks at these values. */
  marks?: number[];
  disabled?: boolean;
};

/** Completion of a known amount. Leave `value` undefined for indeterminate. */
export function ProgressBar({ value, max = 100, tone = "default", size = "sm", label, showValue, marks, disabled, ...p }: ProgressBarProps) {
  const pct = value === undefined ? undefined : Math.min(100, Math.max(0, (value / max) * 100));
  const shown = typeof showValue === "function" && value !== undefined ? showValue(value, max) : `${Math.round(pct ?? 0)}%`;
  return (
    <div {...sx(p, disabled && f.disabled)} style={{ width: "100%", ...p.style }}>
      {(label || showValue) && <div {...px(f.progHead)}><span {...px(f.soft)}>{label}</span>{showValue && pct !== undefined && <span {...px(f.strong)} style={{ fontVariantNumeric: "tabular-nums" }}>{shown}</span>}</div>}
      <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={typeof label === "string" ? label : undefined} {...px(f.track, f[size])}>
        {pct === undefined ? <span {...px(f.fill, f.indet, fillOf(tone))} /> : <span {...px(f.fill, fillOf(tone))} style={{ width: `${pct}%` }} />}
        {marks?.map((m) => <span key={m} aria-hidden {...px(f.marks)} style={{ left: `${(m / max) * 100}%` }} />)}
      </div>
    </div>
  );
}
/** v1 name. */
export const Progress = ProgressBar;

/** Circular progress for tight spots — a quota in a sidebar footer, a score. */
export function ProgressRing({ value, max = 100, size = 32, stroke = 3, tone = "default", label, showValue = true }: {
  value: number; max?: number; size?: number; stroke?: number; tone?: ProgressTone; label?: string; showValue?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  const col = { default: color.accent, ink: color.fg, success: color.successSolid, warning: color.warningSolid, danger: color.danger }[tone];
  return (
    <span role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color.muted} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset 280ms" }} />
      </svg>
      {showValue && size >= 28 && <span {...px(f.ringNum)} style={{ fontSize: size >= 44 ? 12 : 10 }}>{Math.round(pct)}</span>}
    </span>
  );
}

/** A score or capacity as discrete blocks. `tone="auto"`: low = danger, mid = warning, high = success. */
export function SegmentBar({ value, max = 100, segments = 12, tone = "default", height = 8, label }: {
  value: number; max?: number; segments?: number; tone?: ProgressTone | "auto"; height?: number; label?: string;
}) {
  const filled = Math.round((Math.min(max, Math.max(0, value)) / max) * segments);
  const ratio = filled / segments;
  const t: ProgressTone = tone === "auto" ? (ratio < 0.34 ? "danger" : ratio < 0.67 ? "warning" : "success") : tone;
  return (
    <div role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label} {...px(f.segs)}>
      {Array.from({ length: segments }, (_, i) => <span key={i} {...px(f.seg, i < filled && fillOf(t))} style={{ height }} />)}
    </div>
  );
}

/** Position in a short sequence (tour steps, carousel pages). The current dot stretches. */
export function ProgressDots({ count, current, tone = "default", label }: { count: number; current: number; tone?: "default" | "inverse"; label?: string }) {
  return (
    <span role="img" aria-label={label ?? `Step ${current + 1} of ${count}`} {...px(f.dots)}>
      {Array.from({ length: count }, (_, i) => <span key={i} {...px(f.pdot, tone === "inverse" && f.pdotInv, i === current && (tone === "inverse" ? f.pdotInvOn : f.pdotOn))} />)}
    </span>
  );
}

/* ============================================================== Skeleton */

/** A shimmering placeholder in the shape of what's loading. */
export function Skeleton({ width = "100%", height = 12, radius: r, circle, xstyle }: { width?: number | string; height?: number | string; radius?: number; circle?: boolean } & StyleProps) {
  return <span aria-hidden {...sx({ xstyle, style: circle || r !== undefined ? { borderRadius: circle ? "50%" : r } : undefined }, f.skel, f.dim(width, height))} />;
}
/** A paragraph placeholder; the last line is shorter. */
export function SkeletonText({ lines = 3, xstyle }: { lines?: number } & StyleProps) {
  return <div aria-hidden {...sx({ xstyle }, f.skelLines)}>{Array.from({ length: lines }, (_, i) => <Skeleton key={i} width={i === lines - 1 ? "62%" : "100%"} />)}</div>;
}

/* ============================================================== Toast */

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: StatusTone;
  action?: { label: string; onClick: () => void };
  duration?: number;
};
type ToastEntry = ToastOptions & { id: number; open: boolean };
const ToastCtx = createContext<((t: ToastOptions) => void) | null>(null);

/** `const toast = useToast(); toast({ title: "Invoice sent", action: { label: "Undo", onClick } })` */
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <Toaster>");
  return ctx;
}

/** Wrap your app once. Toasts stack bottom-right, max 3, swipe right to dismiss. */
export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const push = useCallback((t: ToastOptions) => setToasts((l) => [...l.slice(-2), { ...t, id: Date.now() + Math.random(), open: true }]), []);
  const close = (id: number) => { setToasts((l) => l.map((t) => (t.id === id ? { ...t, open: false } : t))); setTimeout(() => setToasts((l) => l.filter((t) => t.id !== id)), 300); };
  return (
    <ToastCtx.Provider value={push}>
      <T.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map((t) => (
          <T.Root key={t.id} open={t.open} onOpenChange={(o) => !o && close(t.id)} duration={t.duration} type={t.tone === "danger" ? "foreground" : "background"} {...px(f.toast)}>
            {t.tone && t.tone !== "neutral" && <span {...px(f.toastIcon, fgOf(t.tone))}><IconSizeContext.Provider value={16}>{ICON[t.tone]}</IconSizeContext.Provider></span>}
            <div {...px(f.col)}>
              <T.Title {...px(f.strong)}>{t.title}</T.Title>
              {t.description && <T.Description {...px(f.soft)}>{t.description}</T.Description>}
            </div>
            {t.action && <T.Action altText={t.action.label} asChild><Button size="xs" onClick={t.action.onClick}>{t.action.label}</Button></T.Action>}
            <T.Close asChild><IconButton label="Close" size="xs" tooltip={false} xstyle={f.toastClose}><IconX /></IconButton></T.Close>
          </T.Root>
        ))}
        <T.Viewport {...px(f.viewport)} />
      </T.Provider>
    </ToastCtx.Provider>
  );
}

/* ============================================================== EmptyState */

export type EmptyStateProps = StyleProps & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** One primary action, at most one secondary. */
  actions?: ReactNode;
  compact?: boolean;
  headingLevel?: 2 | 3 | 4;
};

/** Nothing here yet — say why, and what to do next. */
export function EmptyState({ icon, title, description, actions, compact, headingLevel = 3, ...p }: EmptyStateProps) {
  const H = `h${headingLevel}` as "h3";
  return (
    <div {...sx(p, f.empty, compact && f.emptyCompact)}>
      {icon && <span aria-hidden {...px(f.emptyArt)}><IconSizeContext.Provider value={22}>{icon}</IconSizeContext.Provider></span>}
      <H {...px(f.emptyTitle)}>{title}</H>
      {description && <p {...px(f.emptyDesc)}>{description}</p>}
      {actions && <div {...px(f.emptyActions)}>{actions}</div>}
    </div>
  );
}

/* ============================================================== Status pages */

export type StatusPageProps = StyleProps & {
  code?: string;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Request id or timestamp, shown in mono for support. */
  detail?: ReactNode;
};

/** A full-page error or blocking state. Plain words: what happened, what to do. */
export function StatusPage({ code, icon, title, description, actions, detail, ...p }: StatusPageProps) {
  return (
    <div {...sx(p, f.page)}>
      <div {...px(f.pageInner)}>
        {code ? <p aria-hidden {...px(f.code)}>{code}</p> : icon && <span aria-hidden {...px(f.emptyArt)}><IconSizeContext.Provider value={22}>{icon}</IconSizeContext.Provider></span>}
        <h1 {...px(f.pageTitle)}>{title}</h1>
        {description && <p {...px(f.emptyDesc)}>{description}</p>}
        {actions && <div {...px(f.emptyActions)}>{actions}</div>}
        {detail && <p {...px(f.detail)}>{detail}</p>}
      </div>
    </div>
  );
}
type PP = { actions?: ReactNode } & StyleProps;
export const NotFoundPage = (p: PP) => <StatusPage code="404" title="We can't find that page" description="It may have been moved or deleted, or the link is wrong." {...p} />;
export const ForbiddenPage = ({ role, ...p }: PP & { role?: string }) => <StatusPage code="403" title="You don't have access" description={role ? `Your role (${role}) can't open this. Ask an admin for access.` : "Ask an admin for access."} {...p} />;
export const ServerErrorPage = ({ requestId, ...p }: PP & { requestId?: string }) => <StatusPage code="500" title="Something went wrong on our side" description="Try again in a moment. If it keeps happening, contact support." detail={requestId && `Request ${requestId}`} {...p} />;
export function OfflineState({ onRetry, ...p }: { onRetry?: () => void } & StyleProps) {
  return <EmptyState icon={<IconWifiOff />} title="You're offline" description="Check your connection. We'll keep what you've typed." actions={onRetry && <Button onClick={onRetry}>Try again</Button>} {...p} />;
}
export function PermissionState({ what = "this section", requestAccess, ...p }: { what?: string; requestAccess?: () => void } & StyleProps) {
  return <EmptyState icon={<IconLock />} title={`You can't see ${what}`} description="Your role doesn't include it. An admin can give you access." actions={requestAccess && <Button onClick={requestAccess}>Request access</Button>} {...p} />;
}
export function ErrorState({ title = "Couldn't load this", description, onRetry, ...p }: { title?: ReactNode; description?: ReactNode; onRetry?: () => void } & StyleProps) {
  return <EmptyState icon={<IconXCircle />} title={title} description={description} actions={onRetry && <Button onClick={onRetry}>Try again</Button>} compact {...p} />;
}

