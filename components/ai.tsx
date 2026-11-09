/**
 * AI — primitives for agent and assistant features (ideas inspired by beautifului.dev, designed for Keel).
 * Thinking · PixelLoader · LoadingState · StreamingText · PromptBar · PromptSuggestions · ToolChips · ApprovalCard ·
 * RecommendationCard · ConfidenceMeter · ContextCard · ContextChips · InsightCard · DiffTable · TaskList · ParameterCard · AiBadge
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Button, IconButton } from "./action";
import { Slider } from "./choice";
import { formatDuration } from "./content";
import { Sparkline } from "./data";
import {
  IconArrowUp, IconCheck, IconChevronDown, IconCircleDashed, IconFile, IconLink, IconSizeContext, IconSparkles, IconX, IconXCircle,
} from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";

const shine = stylex.keyframes({ from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } });
const blink = stylex.keyframes({ "0%, 100%": { opacity: 1 }, "50%": { opacity: 0 } });
const pix = stylex.keyframes({ "0%, 100%": { opacity: 0.15, transform: "scale(0.8)" }, "50%": { opacity: 1, transform: "scale(1)" } });
const slideIn = stylex.keyframes({ from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "none" } });

const a = stylex.create({
  row: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  col: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  muted: { color: color.fgMuted, fontSize: font.sm },
  strong: { fontWeight: font.semibold, color: color.fg },
  // thinking
  think: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: font.md, color: color.fgMuted, cursor: "pointer", borderRadius: radius.sm, outline: "none", ":focus-visible": { boxShadow: depth.focus } },
  shimmer: {
    backgroundImage: `linear-gradient(90deg, ${color.fgFaint} 0%, ${color.fgFaint} 35%, ${color.fg} 50%, ${color.fgFaint} 65%, ${color.fgFaint} 100%)`,
    backgroundSize: "200% 100%", backgroundClip: "text", color: "transparent", animationName: shine, animationDuration: "2.2s", animationIterationCount: "infinite", animationTimingFunction: "linear",
    fontWeight: font.medium,
  },
  spark: { display: "inline-flex", color: color.accent },
  elapsed: { fontVariantNumeric: "tabular-nums", color: color.fgFaint, fontSize: font.sm },
  reason: { marginTop: 8, paddingInlineStart: 12, borderInlineStartWidth: 2, borderInlineStartStyle: "solid", borderInlineStartColor: color.border, color: color.fgMuted, fontSize: font.md, lineHeight: 1.6, whiteSpace: "pre-wrap" },
  chev: { display: "inline-flex", transitionProperty: "transform", transitionDuration: motion.fast },
  chevOpen: { transform: "rotate(180deg)" },
  // pixel loader
  grid: { display: "grid", gap: 3 },
  px: { width: 6, height: 6, borderRadius: 1.5, backgroundColor: color.accent, animationName: pix, animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" },
  loading: { display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  steps: { display: "flex", flexDirection: "column", gap: 2 },
  stepLine: { animationName: slideIn, animationDuration: motion.base },
  // streaming
  caret: { display: "inline-block", width: 2, height: "1.1em", marginInlineStart: 1, verticalAlign: "text-bottom", backgroundColor: color.accent, animationName: blink, animationDuration: "0.9s", animationIterationCount: "infinite" },
  // prompt bar
  prompt: {
    display: "flex", alignItems: "center", gap: 8, height: 44, paddingInlineStart: 14, paddingInlineEnd: 6, borderRadius: radius.full, backgroundColor: color.surfaceRaised,
    boxShadow: { default: depth.popover, ":focus-within": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}, 0 12px 24px -12px ${color.shadeLg}` },
    transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  promptInput: { flex: 1, minWidth: 0, height: "100%", outline: "none", fontSize: font.lg, color: color.fg, "::placeholder": { color: color.fgFaint } },
  round: { borderRadius: radius.full, width: 32, paddingInline: 0 },
  sugg: { display: "flex", flexWrap: "wrap", gap: 6 },
  suggBtn: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 28, paddingInline: 12, borderRadius: radius.full, fontSize: font.sm, color: color.fgSoft, cursor: "pointer", outline: "none",
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: { default: depth.raised, ":hover": depth.raisedHover, ":focus-visible": `${depth.raised}, ${depth.focus}` },
    ":hover": { color: color.fg }, transitionProperty: "box-shadow, color", transitionDuration: motion.fast,
  },
  // tool chips
  chip: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 26, paddingInline: 10, borderRadius: radius.full, fontSize: font.sm, fontWeight: font.medium,
    color: color.fgSoft, backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}`, cursor: "pointer", outline: "none", ":focus-visible": { boxShadow: depth.focus },
    transitionProperty: "background-color, color, box-shadow", transitionDuration: motion.fast,
  },
  chipOn: { color: color.accentStrong, backgroundColor: color.accentSoft, boxShadow: `inset 0 0 0 1px ${color.accentBorder}` },
  chipRun: { color: color.fg, backgroundColor: color.surface, boxShadow: depth.raised },
  // cards
  card: { display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, minWidth: 0, animationName: slideIn, animationDuration: motion.base },
  cardHead: { display: "flex", alignItems: "flex-start", gap: 10 },
  cardIcon: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: radius.lg, flexShrink: 0, color: color.accent,
    backgroundColor: color.accentSoft, boxShadow: `inset 0 0 0 1px ${color.accentBorder}`,
  },
  warnIcon: { color: color.warning, backgroundColor: color.warningSoft, boxShadow: `inset 0 0 0 1px ${color.warningBorder}` },
  title: { fontSize: font.lg, fontWeight: font.semibold, color: color.fg, letterSpacing: "-0.005em" },
  desc: { fontSize: font.md, color: color.fgSoft, lineHeight: 1.55 },
  actions: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 },
  actionsEnd: { marginInlineStart: "auto", display: "flex", gap: 8 },
  details: { borderRadius: radius.md, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`, padding: 10, fontFamily: font.mono, fontSize: "12px", lineHeight: 1.6, color: color.fgSoft, whiteSpace: "pre-wrap", overflowX: "auto", maxHeight: 200, overflowY: "auto" },
  resolved: { display: "flex", alignItems: "center", gap: 6, fontSize: font.sm, fontWeight: font.medium },
  ok: { color: color.success }, bad: { color: color.danger },
  // confidence
  meter: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: font.sm, color: color.fgMuted },
  bars: { display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14 },
  bar: { width: 4, borderRadius: 1, backgroundColor: color.border },
  barOn: { backgroundColor: color.accent },
  // context
  ctxCard: {
    display: "flex", alignItems: "center", gap: 10, padding: 10, minWidth: 0, width: 240, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: depth.card,
    position: "relative",
  },
  ctxIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: radius.md, flexShrink: 0, backgroundColor: color.muted, color: color.icon },
  ctxText: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1 },
  ctxTitle: { fontWeight: font.medium, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  ctxMeta: { fontSize: font.xs, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  ctxRow: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 },
  // insight
  insight: { gap: 10 },
  insightTop: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  big: { fontSize: "26px", fontWeight: font.semibold, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  aiTag: {
    display: "inline-flex", alignItems: "center", gap: 4, height: 20, paddingInline: 7, borderRadius: radius.full, fontSize: font.xs, fontWeight: font.semibold,
    color: color.accentStrong, backgroundImage: `linear-gradient(90deg, ${color.accentSoft}, color-mix(in srgb, ${color.chart5} 14%, transparent))`, boxShadow: `inset 0 0 0 1px ${color.accentBorder}`,
  },
  // diff table
  diff: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: font.md, borderRadius: radius.xl, overflow: "hidden", boxShadow: depth.card, backgroundColor: color.surface },
  dth: { height: 34, paddingInline: 12, textAlign: "start", fontSize: font.sm, fontWeight: font.medium, color: color.fgMuted, backgroundColor: color.surfaceSunken, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  dtd: { height: 42, paddingInline: 12, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, verticalAlign: "middle" },
  old: { color: color.danger, textDecorationLine: "line-through", textDecorationColor: color.dangerBorder, backgroundColor: color.dangerSoft, borderRadius: 4, paddingInline: 4, marginInlineEnd: 6 },
  neu: { color: color.success, backgroundColor: color.successSoft, borderRadius: 4, paddingInline: 4, fontWeight: font.medium },
  rowDone: { opacity: 0.55 },
  // tasks
  tasks: { display: "flex", flexDirection: "column", borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, overflow: "hidden" },
  task: { display: "flex", alignItems: "center", gap: 10, paddingInline: 14, minHeight: 44, borderBottomWidth: { default: 1, ":last-child": 0 }, borderBottomStyle: "solid", borderBottomColor: color.border },
  taskIcon: { display: "inline-flex", width: 16, justifyContent: "center", flexShrink: 0 },
  taskText: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  taskTitle: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  taskDone: { color: color.fgMuted },
  taskMeta: { fontSize: font.xs, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  queued: { color: color.fgFaint }, running: { color: color.accent }, done: { color: color.success }, failed: { color: color.danger },
  // params
  param: { display: "flex", flexDirection: "column", gap: 6 },
  paramHead: { display: "flex", justifyContent: "space-between", fontSize: font.md },
  paramVal: { fontFamily: font.mono, fontSize: font.sm, color: color.fgSoft },
});

/* ============================================================== Thinking */

/** "Thinking…" with a moving sheen and elapsed time. Click to show the reasoning if you have it. */
export function Thinking({ label = "Thinking", startTime, reasoning, done, doneLabel, ...p }: StyleProps & { label?: string; startTime?: number; reasoning?: string; done?: boolean; doneLabel?: string }) {
  const [now, setNow] = useState(Date.now());
  const [open, setOpen] = useState(false);
  const start = useRef(startTime ?? Date.now());
  const [frozen, setFrozen] = useState<number | null>(null);
  useEffect(() => { if (done) { setFrozen(Date.now() - start.current); return; } const id = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, [done]);
  const ms = frozen ?? now - start.current;
  return (
    <div {...sx(p)}>
      <button type="button" aria-expanded={reasoning ? open : undefined} disabled={!reasoning} onClick={() => setOpen((v) => !v)} {...px(a.think)} style={{ cursor: reasoning ? "pointer" : "default" }}>
        <span {...px(a.spark)}>{done ? <IconSparkles size={14} /> : <Spinner size={12} label="" />}</span>
        <span {...px(!done && a.shimmer)}>{done ? doneLabel ?? `Thought for ${Math.max(1, Math.round(ms / 1000))}s` : `${label}…`}</span>
        {!done && <span {...px(a.elapsed)}>{formatDuration(ms)}</span>}
        {reasoning && <span {...px(a.chev, open && a.chevOpen)}><IconChevronDown size={14} /></span>}
      </button>
      {reasoning && open && <div {...px(a.reason)}>{reasoning}</div>}
    </div>
  );
}

/* ============================================================== PixelLoader & LoadingState */

/** A grid of pixels that ripple — for "working on it" moments longer than a spinner. */
export function PixelLoader({ size = 4, label = "Working", ...p }: StyleProps & { size?: number; label?: string }) {
  const cells = useMemo(() => Array.from({ length: size * size }, (_, i) => ({ i, delay: ((i % size) + Math.floor(i / size)) * 90 })), [size]);
  return <span role="status" aria-label={label} {...sx(p, a.grid)} style={{ gridTemplateColumns: `repeat(${size}, 6px)` }}>{cells.map((c) => <span key={c.i} {...px(a.px)} style={{ animationDuration: "1.4s", animationDelay: `${c.delay}ms` }} />)}</span>;
}

/** A longer wait with what's happening now: pixel loader, the current step, elapsed time. */
export function LoadingState({ title = "Working on it", steps = [], current = 0, startTime, ...p }: StyleProps & { title?: ReactNode; steps?: string[]; current?: number; startTime?: number }) {
  const [now, setNow] = useState(Date.now());
  const start = useRef(startTime ?? Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(id); }, []);
  return (
    <div role="status" {...sx(p, a.loading)}>
      <PixelLoader />
      <div {...px(a.col)} style={{ gap: 2, flex: 1 }}>
        <span {...px(a.strong)}>{title}</span>
        {steps[current] && <span key={current} {...px(a.muted, a.stepLine)}>{steps[current]}</span>}
      </div>
      <span {...px(a.elapsed)}>{formatDuration(now - start.current)}</span>
    </div>
  );
}

/* ============================================================== StreamingText */

/** Reveals text at a reading pace with a caret — for demos and for smoothing bursty streams. */
export function StreamingText({ text, speed = 40, onDone, ...p }: StyleProps & { text: string; /** Characters per second ×10. */ speed?: number; onDone?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => { setN(0); }, [text]);
  useEffect(() => {
    if (n >= text.length) { onDone?.(); return; }
    const id = setTimeout(() => setN((x) => Math.min(text.length, x + Math.max(1, Math.round(speed / 10)))), 30);
    return () => clearTimeout(id);
  }, [n, text, speed]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span aria-live="polite" {...sx(p)}>{text.slice(0, n)}{n < text.length && <span aria-hidden {...px(a.caret)} />}</span>;
}

/* ============================================================== PromptBar & suggestions */

/** A one-line "ask AI" pill — for search pages, empty states and table headers. */
export function PromptBar({ value, onValueChange, onSubmit, placeholder = "Ask about your data…", busy, leading = <IconSparkles size={16} />, ...p }: StyleProps & {
  value: string; onValueChange: (v: string) => void; onSubmit: (v: string) => void; placeholder?: string; busy?: boolean; leading?: ReactNode;
}) {
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(value.trim()); }} {...sx(p, a.prompt)}>
      <span {...px(a.spark)}>{leading}</span>
      <input value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} {...px(a.promptInput)} />
      <IconButton type="submit" label="Ask" variant="primary" disabled={!value.trim() || busy} loading={busy} xstyle={a.round}><IconArrowUp /></IconButton>
    </form>
  );
}

/** Starter prompts as raised pills. */
export function PromptSuggestions({ items, onPick, ...p }: StyleProps & { items: { label: string; icon?: ReactNode }[]; onPick: (label: string) => void }) {
  return <div {...sx(p, a.sugg)}>{items.map((it) => <button key={it.label} type="button" onClick={() => onPick(it.label)} {...px(a.suggBtn)}><IconSizeContext.Provider value={14}>{it.icon}</IconSizeContext.Provider>{it.label}</button>)}</div>;
}

/* ============================================================== ToolChips */

export type ToolChip = { id: string; label: string; icon?: ReactNode; state?: "off" | "on" | "running" };
/** Tools the assistant can use; toggle them, and see which one is running now. */
export function ToolChips({ tools, onToggle, ...p }: StyleProps & { tools: ToolChip[]; onToggle?: (id: string) => void }) {
  return (
    <div role="group" aria-label="Tools" {...sx(p, a.sugg)}>
      {tools.map((t) => (
        <button key={t.id} type="button" aria-pressed={t.state === "on" || t.state === "running"} onClick={() => onToggle?.(t.id)} {...px(a.chip, t.state === "on" && a.chipOn, t.state === "running" && a.chipRun)}>
          {t.state === "running" ? <Spinner size={11} label="" /> : <IconSizeContext.Provider value={13}>{t.icon}</IconSizeContext.Provider>}
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ============================================================== ApprovalCard */

export type ApprovalState = "pending" | "approved" | "rejected";

/** The agent wants to do something consequential — show exactly what, and let a person approve or reject. */
export function ApprovalCard({ title, description, details, state = "pending", onApprove, onReject, onAlwaysAllow, approveLabel = "Approve", tone = "default", ...p }: StyleProps & {
  title: ReactNode; description?: ReactNode; details?: ReactNode; state?: ApprovalState; onApprove: () => void; onReject: () => void; onAlwaysAllow?: () => void; approveLabel?: string; tone?: "default" | "warning";
}) {
  return (
    <div role="group" aria-label="Approval needed" {...sx(p, a.card)}>
      <div {...px(a.cardHead)}>
        <span {...px(a.cardIcon, tone === "warning" && a.warnIcon)}><IconSparkles size={16} /></span>
        <div {...px(a.col)} style={{ gap: 2 }}><span {...px(a.title)}>{title}</span>{description && <span {...px(a.desc)}>{description}</span>}</div>
      </div>
      {details && <div {...px(a.details)}>{details}</div>}
      {state === "pending" ? (
        <div {...px(a.actions)}>
          {onAlwaysAllow && <Button size="sm" variant="ghost" onClick={onAlwaysAllow}>Always allow</Button>}
          <span {...px(a.actionsEnd)}>
            <Button size="sm" variant="secondary" leading={<IconX />} onClick={onReject}>Reject</Button>
            <Button size="sm" variant="primary" leading={<IconCheck />} onClick={onApprove}>{approveLabel}</Button>
          </span>
        </div>
      ) : <span {...px(a.resolved, state === "approved" ? a.ok : a.bad)}>{state === "approved" ? <IconCheck size={14} /> : <IconXCircle size={14} />}{state === "approved" ? "Approved" : "Rejected"}</span>}
    </div>
  );
}

/* ============================================================== Recommendation & Confidence */

/** How sure the model is, as five bars plus a word. */
export function ConfidenceMeter({ value, ...p }: StyleProps & { /** 0–1 */ value: number }) {
  const n = Math.round(value * 5);
  const word = value >= 0.8 ? "High" : value >= 0.5 ? "Medium" : "Low";
  return (
    <span role="meter" aria-valuemin={0} aria-valuemax={1} aria-valuenow={value} aria-label={`Confidence ${word}`} {...sx(p, a.meter)}>
      <span {...px(a.bars)}>{Array.from({ length: 5 }, (_, i) => <span key={i} {...px(a.bar, i < n && a.barOn)} style={{ height: 6 + i * 2 }} />)}</span>
      {word} confidence
    </span>
  );
}

/** A suggestion with its reasoning, confidence and one-click actions. */
export function RecommendationCard({ title, rationale, confidence, actions, meta, ...p }: StyleProps & { title: ReactNode; rationale?: ReactNode; confidence?: number; actions?: ReactNode; meta?: ReactNode }) {
  return (
    <div {...sx(p, a.card)}>
      <div {...px(a.row)} style={{ justifyContent: "space-between" }}><AiBadge />{confidence !== undefined && <ConfidenceMeter value={confidence} />}</div>
      <div {...px(a.col)} style={{ gap: 4 }}><span {...px(a.title)}>{title}</span>{rationale && <span {...px(a.desc)}>{rationale}</span>}</div>
      {(actions || meta) && <div {...px(a.actions)}>{meta && <span {...px(a.muted)}>{meta}</span>}<span {...px(a.actionsEnd)}>{actions}</span></div>}
    </div>
  );
}

/** "AI" label for generated content. */
export function AiBadge({ label = "AI", ...p }: StyleProps & { label?: string }) {
  return <span {...sx(p, a.aiTag)}><IconSparkles size={11} />{label}</span>;
}

/* ============================================================== Context */

export type ContextItem = { id: string; title: string; meta?: string; kind?: "file" | "link" | "record"; icon?: ReactNode };
/** A piece of context attached to a prompt: a file, a page, a record. */
export function ContextCard({ item, onRemove, ...p }: StyleProps & { item: ContextItem; onRemove?: () => void }) {
  return (
    <div {...sx(p, a.ctxCard)}>
      <span {...px(a.ctxIcon)}><IconSizeContext.Provider value={16}>{item.icon ?? (item.kind === "link" ? <IconLink /> : <IconFile />)}</IconSizeContext.Provider></span>
      <span {...px(a.ctxText)}><span {...px(a.ctxTitle)}>{item.title}</span>{item.meta && <span {...px(a.ctxMeta)}>{item.meta}</span>}</span>
      {onRemove && <IconButton label={`Remove ${item.title}`} size="xs" onClick={onRemove}><IconX /></IconButton>}
    </div>
  );
}
/** A scrollable row of ContextCards. */
export function ContextChips({ items, onRemove, ...p }: StyleProps & { items: ContextItem[]; onRemove?: (id: string) => void }) {
  return <div {...sx(p, a.ctxRow)}>{items.map((it) => <ContextCard key={it.id} item={it} onRemove={onRemove && (() => onRemove(it.id))} />)}</div>;
}

/* ============================================================== InsightCard */

/** A generated finding about a metric: the number, a trend, a one-line why, and a follow-up. */
export function InsightCard({ title, value, trend, explanation, onAsk, ...p }: StyleProps & { title: ReactNode; value?: ReactNode; trend?: number[]; explanation: ReactNode; onAsk?: () => void }) {
  return (
    <div {...sx(p, a.card, a.insight)}>
      <div {...px(a.row)} style={{ justifyContent: "space-between" }}><span {...px(a.muted)} style={{ fontWeight: 520 }}>{title}</span><AiBadge label="Insight" /></div>
      <div {...px(a.insightTop)}>{value && <span {...px(a.big)}>{value}</span>}{trend && <Sparkline values={trend} tone="auto" width={120} height={36} />}</div>
      <p {...px(a.desc)}>{explanation}</p>
      {onAsk && <div><Button size="sm" variant="soft" leading={<IconSparkles />} onClick={onAsk}>Ask a follow-up</Button></div>}
    </div>
  );
}

/* ============================================================== DiffTable */

export type DiffRow = { id: string; label: ReactNode; field: string; from: ReactNode; to: ReactNode; status?: "pending" | "accepted" | "rejected" };
/** AI-proposed edits to records — old value struck, new value highlighted; accept or reject each, or all. */
export function DiffTable({ rows, onAccept, onReject, onAcceptAll, ...p }: StyleProps & { rows: DiffRow[]; onAccept: (id: string) => void; onReject: (id: string) => void; onAcceptAll?: () => void }) {
  const pending = rows.filter((r) => (r.status ?? "pending") === "pending").length;
  return (
    <div {...sx(p, a.col)} style={{ gap: 10 }}>
      <div {...px(a.row)} style={{ justifyContent: "space-between" }}>
        <span {...px(a.row)}><AiBadge label="Proposed" /><span {...px(a.muted)}>{pending} of {rows.length} changes to review</span></span>
        {onAcceptAll && pending > 0 && <Button size="sm" variant="primary" leading={<IconCheck />} onClick={onAcceptAll}>Accept all</Button>}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table {...px(a.diff)}>
          <thead><tr><th {...px(a.dth)}>Record</th><th {...px(a.dth)}>Field</th><th {...px(a.dth)}>Change</th><th {...px(a.dth)} style={{ width: 80 }} /></tr></thead>
          <tbody>
            {rows.map((r) => {
              const st = r.status ?? "pending";
              return (
                <tr key={r.id} {...px(st !== "pending" && a.rowDone)}>
                  <td {...px(a.dtd)}>{r.label}</td>
                  <td {...px(a.dtd, a.muted)}>{r.field}</td>
                  <td {...px(a.dtd)}>{st !== "accepted" && <span {...px(a.old)}>{r.from}</span>}{st !== "rejected" && <span {...px(a.neu)}>{r.to}</span>}</td>
                  <td {...px(a.dtd)} style={{ textAlign: "end", whiteSpace: "nowrap" }}>
                    {st === "pending" ? <>
                      <IconButton label="Reject change" size="xs" onClick={() => onReject(r.id)}><IconX /></IconButton>
                      <IconButton label="Accept change" size="xs" variant="secondary" onClick={() => onAccept(r.id)}><IconCheck /></IconButton>
                    </> : <span {...px(a.resolved, st === "accepted" ? a.ok : a.bad)} style={{ justifyContent: "flex-end" }}>{st === "accepted" ? "Accepted" : "Rejected"}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================== TaskList */

export type AgentTask = { id: string; title: ReactNode; status: "queued" | "running" | "done" | "failed"; meta?: ReactNode };
/** An agent's plan and progress, one row per task. */
export function TaskList({ tasks, ...p }: StyleProps & { tasks: AgentTask[] }) {
  const icon = (s: AgentTask["status"]) => s === "running" ? <Spinner size={12} label="" /> : s === "done" ? <IconCheck size={14} /> : s === "failed" ? <IconX size={14} /> : <IconCircleDashed size={14} />;
  return (
    <ol {...sx(p, a.tasks)}>
      {tasks.map((t) => (
        <li key={t.id} aria-label={`${typeof t.title === "string" ? t.title : "Task"}: ${t.status}`} {...px(a.task)}>
          <span {...px(a.taskIcon, a[t.status])}>{icon(t.status)}</span>
          <span {...px(a.taskText)}><span {...px(a.taskTitle, t.status === "done" && a.taskDone)}>{t.title}</span>{t.meta && <span {...px(a.taskMeta)}>{t.meta}</span>}</span>
        </li>
      ))}
    </ol>
  );
}
/** v1-style alias (beautifului calls these task rows). */
export const TaskRows = TaskList;

/* ============================================================== ParameterCard */

export type Parameter = { id: string; label: string; value: number; min: number; max: number; step?: number; format?: (n: number) => string };
/** Tunable model or job settings with live values — temperature, top-p, batch size. */
export function ParameterCard({ title = "Parameters", params, onChange, footer, ...p }: StyleProps & { title?: ReactNode; params: Parameter[]; onChange: (id: string, v: number) => void; footer?: ReactNode }) {
  return (
    <div {...sx(p, a.card)}>
      <span {...px(a.title)}>{title}</span>
      {params.map((pm) => (
        <div key={pm.id} {...px(a.param)}>
          <div {...px(a.paramHead)}><span>{pm.label}</span><span {...px(a.paramVal)}>{pm.format ? pm.format(pm.value) : pm.value}</span></div>
          <Slider aria-label={pm.label} min={pm.min} max={pm.max} step={pm.step ?? 1} value={[pm.value]} onValueChange={([v]) => onChange(pm.id, v)} />
        </div>
      ))}
      {footer && <div {...px(a.actions)}>{footer}</div>}
    </div>
  );
}
/** Alias. */
export const FineTuneCard = ParameterCard;

