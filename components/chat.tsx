/**
 * Chat — conversational UI.
 * ChatLayout · ChatMessage · ChatMessageMetadata · ChatSystemMessage · ChatToolCalls · ChatComposer · ChatDictationButton
 */
import * as stylex from "@stylexjs/stylex";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Button, CopyButton, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, IconButton } from "./action";
import { Avatar, KbdGroup, Markdown, Thumbnail, Token, type CitationSource } from "./content";
import {
  IconAlertCircle, IconArrowDown, IconArrowUp, IconCheck, IconChevronDown, IconMic, IconPaperclip, IconPlus, IconRefresh, IconSizeContext, IconStop,
  IconThumbsDown, IconThumbsUp, IconWrench, IconX,
} from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";

const pulse = stylex.keyframes({ "0%": { boxShadow: "0 0 0 0 rgba(220,38,38,0.45)" }, "100%": { boxShadow: "0 0 0 10px rgba(220,38,38,0)" } });
const rise = stylex.keyframes({ from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "none" } });

const c = stylex.create({
  layout: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0, backgroundColor: color.surface, position: "relative" },
  header: { flexShrink: 0, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  scroll: { flex: 1, minHeight: 0, overflowY: "auto", scrollBehavior: "smooth" },
  thread: { display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 760, marginInline: "auto", paddingInline: 16, paddingBlock: 24 },
  bottom: { flexShrink: 0, width: "100%", maxWidth: 792, marginInline: "auto", paddingInline: 16, paddingBottom: 16 },
  jump: { position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 112, zIndex: 2 },
  // messages
  msg: { display: "flex", gap: 12, minWidth: 0, animationName: rise, animationDuration: motion.base, animationTimingFunction: motion.ease },
  msgUser: { flexDirection: "row-reverse" },
  body: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0, maxWidth: "100%" },
  bodyUser: { alignItems: "flex-end", maxWidth: "min(80%, 560px)" },
  bubble: {
    paddingInline: 14, paddingBlock: 10, borderRadius: radius.xxl, borderBottomRightRadius: 6, fontSize: font.lg, lineHeight: 1.55, color: color.fg,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised, whiteSpace: "pre-wrap", overflowWrap: "anywhere",
  },
  name: { fontSize: font.sm, fontWeight: font.semibold, color: color.fg },
  actions: { display: "flex", alignItems: "center", gap: 2, marginInlineStart: -6, opacity: { default: 0, [stylex.when.ancestor(":hover")]: 1, [stylex.when.ancestor(":focus-within")]: 1 }, transitionProperty: "opacity", transitionDuration: motion.fast },
  actionsShow: { opacity: 1 },
  voted: { color: color.accent },
  atts: { display: "flex", flexWrap: "wrap", gap: 6 },
  error: { display: "flex", alignItems: "center", gap: 8, fontSize: font.sm, color: color.danger },
  // metadata
  meta: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: font.xs, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  dot: { width: 2, height: 2, borderRadius: "50%", backgroundColor: "currentColor" },
  // system
  system: { display: "flex", alignItems: "center", gap: 12, fontSize: font.sm, color: color.fgMuted, textAlign: "center" },
  sysLine: { flex: 1, height: 1, backgroundColor: color.border },
  sysInner: { display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "80%" },
  // tool calls
  tools: { display: "flex", flexDirection: "column", borderRadius: radius.lg, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`, overflow: "hidden", fontSize: font.md },
  toolsHead: {
    display: "flex", alignItems: "center", gap: 8, width: "100%", height: 36, paddingInline: 10, textAlign: "start", color: color.fgSoft, cursor: "pointer", outline: "none",
    ":hover": { color: color.fg }, ":focus-visible": { boxShadow: `inset ${depth.focus}` },
  },
  chev: { display: "inline-flex", marginInlineStart: "auto", color: color.icon, transitionProperty: "transform", transitionDuration: motion.fast },
  chevOpen: { transform: "rotate(180deg)" },
  toolList: { display: "flex", flexDirection: "column", borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border },
  tool: { display: "flex", flexDirection: "column", gap: 6, paddingInline: 10, paddingBlock: 8, borderBottomWidth: { default: 1, ":last-child": 0 }, borderBottomStyle: "solid", borderBottomColor: color.border },
  toolRow: { display: "flex", alignItems: "center", gap: 8 },
  toolName: { fontFamily: font.mono, fontSize: font.sm, color: color.fg },
  toolDur: { marginInlineStart: "auto", fontSize: font.xs, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  toolPre: { margin: 0, padding: 8, borderRadius: radius.sm, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.border}`, fontFamily: font.mono, fontSize: "11.5px", lineHeight: 1.55, color: color.fgSoft, whiteSpace: "pre-wrap", overflowWrap: "anywhere", maxHeight: 160, overflowY: "auto" },
  stOk: { display: "inline-flex", color: color.success }, stErr: { display: "inline-flex", color: color.danger }, stRun: { display: "inline-flex", color: color.accent },
  // composer
  composer: {
    display: "flex", flexDirection: "column", minWidth: 0, padding: 4, borderRadius: radius.xxl, backgroundColor: color.surfaceSunken,
    boxShadow: `inset 0 0 0 1px ${color.border}, inset 0 1px 2px ${color.shadeXs}`,
  },
  chead: { display: "flex", alignItems: "center", gap: 8, minHeight: 30, paddingInline: 10, paddingBottom: 2, minWidth: 0 },
  clabel: {
    display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, fontFamily: font.mono, fontSize: "10.5px", fontWeight: font.medium,
    letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  cmeta: { marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, fontSize: font.sm, color: color.fgMuted },
  sugg: { display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingInline: 6, paddingTop: 2, paddingBottom: 6 },
  suggChip: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 26, paddingInline: 10, flexShrink: 0, borderRadius: radius.full, cursor: "pointer", outline: "none",
    fontSize: font.sm, fontWeight: font.medium, color: color.fgSoft, whiteSpace: "nowrap", backgroundColor: color.surface,
    boxShadow: { default: `inset 0 0 0 1px ${color.border}`, ":hover": `inset 0 0 0 1px ${color.borderStrong}`, ":focus-visible": depth.focus },
  },
  field: {
    display: "flex", flexDirection: "column", gap: 8, minWidth: 0, padding: 12, borderRadius: radius.xl, backgroundColor: color.surface, cursor: "text",
    boxShadow: { default: depth.card, ":focus-within": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
    transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  input: { width: "100%", minHeight: 24, maxHeight: 220, resize: "none", outline: "none", fontSize: font.lg, lineHeight: 1.55, color: color.fg, paddingInline: 2, "::placeholder": { color: color.fgFaint } },
  pill: { borderRadius: radius.full, maxWidth: 360, transitionProperty: "border-radius, max-width", transitionDuration: motion.base },
  pillField: { flexDirection: "row", alignItems: "center", borderRadius: radius.full, paddingBlock: 8, paddingInlineStart: 16, paddingInlineEnd: 8 },
  pillMic: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: radius.full, flexShrink: 0, color: color.fgMuted, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}` },
  srcDesc: { marginInlineStart: 8, color: color.fgFaint, fontSize: font.sm },
  cbar: { display: "flex", alignItems: "center", gap: 4, minHeight: 40, paddingInline: 4, paddingTop: 4 },
  cend: { display: "flex", alignItems: "center", gap: 6, marginInlineStart: "auto" },
  hint: { alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0, fontSize: font.xs, color: color.fgFaint, display: { default: "none", "@media (min-width: 640px)": "inline-flex" } },
  send: { width: 32, height: 32, paddingInline: 0, borderRadius: radius.full },
  mic: { borderRadius: radius.full },
  micOn: { color: "#fff", backgroundColor: { default: color.danger, ":hover": color.danger }, animationName: pulse, animationDuration: "1.2s", animationIterationCount: "infinite" },
  foot: { marginTop: 8, textAlign: "center", fontSize: font.xs, color: color.fgFaint },
});

/* ============================================================== ChatLayout */

/** A full-height conversation: optional header, a thread that sticks to the newest message, the composer pinned below. */
export function ChatLayout({ header, children, composer, footer, ...p }: StyleProps & { header?: ReactNode; children: ReactNode; composer?: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const stick = useRef(true);
  const check = () => { const el = ref.current; if (!el) return; const b = el.scrollHeight - el.scrollTop - el.clientHeight < 48; stick.current = b; setAtBottom(b); };
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const mo = new MutationObserver(() => { if (stick.current) el.scrollTop = el.scrollHeight; });
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    el.scrollTop = el.scrollHeight;
    return () => mo.disconnect();
  }, []);
  return (
    <div {...sx(p, c.layout)}>
      {header && <div {...px(c.header)}>{header}</div>}
      <div ref={ref} onScroll={check} {...px(c.scroll)} role="log" aria-live="polite" aria-relevant="additions">
        <div {...px(c.thread)}>{children}</div>
      </div>
      {!atBottom && <span {...px(c.jump)}><Button size="sm" leading={<IconArrowDown />} onClick={() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; }}>Latest</Button></span>}
      {(composer || footer) && <div {...px(c.bottom)}>{composer}{footer && <p {...px(c.foot)}>{footer}</p>}</div>}
    </div>
  );
}

/* ============================================================== ChatMessage */

export type ChatAttachment = { name: string; src?: string; type?: "image" | "file" };

export type ChatMessageProps = StyleProps & {
  role: "user" | "assistant";
  /** Markdown for assistant messages; plain text for user. Or pass children. */
  content?: string;
  children?: ReactNode;
  author?: { name: string; src?: string };
  /** Show a blinking caret while the reply streams in. */
  streaming?: boolean;
  /** Sources for [^n] citations in the content. */
  sources?: CitationSource[];
  attachments?: ChatAttachment[];
  /** Above the text: tool calls, a thinking block. */
  before?: ReactNode;
  /** Under the text: a card, a chart, suggestions. */
  after?: ReactNode;
  metadata?: ReactNode;
  /** Copy / vote / retry under assistant messages. */
  onRetry?: () => void;
  onFeedback?: (v: "up" | "down") => void;
  error?: string;
  /** Always show actions (not only on hover). */
  showActions?: boolean;
};

/** One turn. User messages are raised bubbles on the right; assistant replies are open text on the left. */
export function ChatMessage({ role, content, children, author, streaming, sources, attachments, before, after, metadata, onRetry, onFeedback, error, showActions, ...p }: ChatMessageProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const user = role === "user";
  return (
    <div {...sx(p, c.msg, user && c.msgUser, stylex.defaultMarker())}>
      {!user && <Avatar name={author?.name ?? "Assistant"} src={author?.src} size="lg" colored={false} />}
      <div {...px(c.body, user && c.bodyUser)}>
        {!user && author && <span {...px(c.name)}>{author.name}</span>}
        {attachments && attachments.length > 0 && (
          <div {...px(c.atts)}>{attachments.map((a) => a.type === "image" && a.src ? <Thumbnail key={a.name} src={a.src} alt={a.name} width={88} height={66} /> : <Token key={a.name} label={a.name} icon={<IconPaperclip />} />)}</div>
        )}
        {before}
        {user ? (content || children) && <div {...px(c.bubble)}>{content ?? children}</div>
          : children ?? (content !== undefined && <Markdown streaming={streaming} sources={sources}>{content}</Markdown>)}
        {after}
        {error && <div {...px(c.error)}><IconAlertCircle size={14} />{error}{onRetry && <Button size="xs" variant="soft" leading={<IconRefresh />} onClick={onRetry}>Retry</Button>}</div>}
        {metadata}
        {!user && !streaming && !error && content && (
          <div {...px(c.actions, showActions && c.actionsShow)}>
            <CopyButton value={content} label="Copy reply" size="xs" />
            {onFeedback && <>
              <IconButton label="Good reply" size="xs" aria-pressed={vote === "up"} xstyle={vote === "up" && c.voted} onClick={() => { setVote("up"); onFeedback("up"); }}><IconThumbsUp /></IconButton>
              <IconButton label="Bad reply" size="xs" aria-pressed={vote === "down"} xstyle={vote === "down" && c.voted} onClick={() => { setVote("down"); onFeedback("down"); }}><IconThumbsDown /></IconButton>
            </>}
            {onRetry && <IconButton label="Regenerate" size="xs" onClick={onRetry}><IconRefresh /></IconButton>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Small facts under a message: time, model, tokens, sent/failed. */
export function ChatMessageMetadata({ items, ...p }: StyleProps & { items: ReactNode[] }) {
  return <div {...sx(p, c.meta)}>{items.filter(Boolean).map((it, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{i > 0 && <span aria-hidden {...px(c.dot)} />}{it}</span>)}</div>;
}

/** A neutral notice in the thread: "Ana joined", "Context was reset", a date divider. */
export function ChatSystemMessage({ children, icon, ...p }: StyleProps & { children: ReactNode; icon?: ReactNode }) {
  return <div role="note" {...sx(p, c.system)}><span {...px(c.sysLine)} /><span {...px(c.sysInner)}><IconSizeContext.Provider value={12}>{icon}</IconSizeContext.Provider>{children}</span><span {...px(c.sysLine)} /></div>;
}

/* ============================================================== ChatToolCalls */

export type ToolCall = { id: string; name: string; status: "running" | "done" | "error"; input?: string; output?: string; durationMs?: number };

/** What the assistant did: each tool call with status, input and output. Collapsed to one line by default. */
export function ChatToolCalls({ calls, label, defaultOpen = false, ...p }: StyleProps & { calls: ToolCall[]; label?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const running = calls.filter((x) => x.status === "running").length;
  const failed = calls.filter((x) => x.status === "error").length;
  const summary = label ?? (running ? `Running ${calls.find((x) => x.status === "running")?.name}…` : `Used ${calls.length} tool${calls.length === 1 ? "" : "s"}${failed ? ` · ${failed} failed` : ""}`);
  const icon = (s: ToolCall["status"]) => s === "running" ? <span {...px(c.stRun)}><Spinner size={12} label="" /></span> : s === "done" ? <span {...px(c.stOk)}><IconCheck size={14} /></span> : <span {...px(c.stErr)}><IconX size={14} /></span>;
  return (
    <div {...sx(p, c.tools)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} {...px(c.toolsHead)}>
        {running ? <span {...px(c.stRun)}><Spinner size={12} label="" /></span> : <IconWrench size={14} />}
        <span>{summary}</span>
        <span {...px(c.chev, open && c.chevOpen)}><IconChevronDown size={14} /></span>
      </button>
      {open && (
        <div {...px(c.toolList)}>
          {calls.map((t) => (
            <div key={t.id} {...px(c.tool)}>
              <div {...px(c.toolRow)}>{icon(t.status)}<span {...px(c.toolName)}>{t.name}</span>{t.durationMs !== undefined && <span {...px(c.toolDur)}>{(t.durationMs / 1000).toFixed(1)}s</span>}</div>
              {t.input && <pre {...px(c.toolPre)}>{t.input}</pre>}
              {t.output && <pre {...px(c.toolPre)}>{t.output}</pre>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================== ChatDictationButton */

type SpeechRec = { start: () => void; stop: () => void; interimResults: boolean; continuous: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void };

/** Mic button that dictates into the composer (Web Speech API). Hidden when the browser can't. */
export function ChatDictationButton({ onTranscript, hideWhenUnsupported = true, size = "sm" }: { onTranscript: (text: string, final: boolean) => void; hideWhenUnsupported?: boolean; size?: "xs" | "sm" | "md" }) {
  const [on, setOn] = useState(false);
  const rec = useRef<SpeechRec | null>(null);
  const Ctor = typeof window !== "undefined" ? ((window as unknown as Record<string, unknown>).SpeechRecognition ?? (window as unknown as Record<string, unknown>).webkitSpeechRecognition) as (new () => SpeechRec) | undefined : undefined;
  if (!Ctor && hideWhenUnsupported) return null;
  const toggle = () => {
    if (!Ctor) return;
    if (on) { rec.current?.stop(); return; }
    const r = new Ctor(); r.interimResults = true; r.continuous = true;
    r.onresult = (e) => { const last = e.results[e.results.length - 1] as ArrayLike<{ transcript: string }> & { isFinal?: boolean }; onTranscript(last[0].transcript, Boolean(last.isFinal)); };
    r.onend = () => setOn(false); rec.current = r; r.start(); setOn(true);
  };
  return <IconButton label={on ? "Stop dictation" : "Dictate"} size={size} variant="ghost" aria-pressed={on} disabled={!Ctor} onClick={toggle} xstyle={[c.mic, on && c.micOn]}><IconMic /></IconButton>;
}

/* ============================================================== ChatComposer */

export type ChatComposerProps = StyleProps & {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
  /** While a reply streams: the send button becomes Stop. */
  streaming?: boolean;
  onStop?: () => void;
  attachments?: ChatAttachment[];
  onAttach?: (files: File[]) => void;
  onRemoveAttachment?: (name: string) => void;
  /** Mono label on the top strip of the shell ("Reply to Emma", "Ask Northwind"). */
  label?: ReactNode;
  icon?: ReactNode;
  /** Right side of the top strip: a model picker, a token count, a status. */
  meta?: ReactNode;
  /** One-tap starters shown above the field. Picking one fills the field (or calls `onSuggestion`). */
  suggestions?: string[];
  onSuggestion?: (text: string) => void;
  /** A "+" menu of things to add: files, data sources, web search, connected apps. */
  sources?: { id: string; label: string; description?: string; icon?: ReactNode; onSelect?: () => void }[];
  /** `pill`: a single-line capsule that opens into the full box when focused or filled. */
  variant?: "box" | "pill";
  /** Text for the send button ("Send", "Reply"). Without it the button is a round arrow. */
  sendLabel?: string;
  /** Lines the field starts with. */
  minRows?: number;
  /** Small hint beside the send button; `false` hides it. */
  hint?: ReactNode | false;
  /** Extra controls on the left of the bar: a model Select, tool toggles. */
  tools?: ReactNode;
  dictation?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
};

/** Where the person writes. Grows with the text; ↵ sends, ⇧↵ adds a line; attach, dictate, stop. */
export function ChatComposer({ value, onValueChange, onSubmit, placeholder = "Ask anything…", streaming, onStop, attachments, onAttach, onRemoveAttachment, tools, dictation = true, disabled, autoFocus, label, icon, meta, suggestions, onSuggestion, sendLabel, minRows = 1, hint, sources, variant = "box", ...p }: ChatComposerProps) {
  const [focused, setFocused] = useState(false);
  const pill = variant === "pill" && !focused && !value && !streaming;
  const ta = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const base = useRef("");
  useEffect(() => { const el = ta.current; if (!el) return; el.style.height = "auto"; el.style.height = `${Math.min(220, el.scrollHeight)}px`; }, [value]);
  const send = () => { const v = value.trim(); if (!v || streaming || disabled) return; onSubmit(v); };
  return (
    <div {...sx(p, c.composer, pill && c.pill)} onFocus={() => setFocused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}>
      {!pill && (label || meta) && <div {...px(c.chead)}><span {...px(c.clabel)}>{icon}{label}</span>{meta && <span {...px(c.cmeta)}>{meta}</span>}</div>}
      {!pill && suggestions && suggestions.length > 0 && !value && (
        <div {...px(c.sugg)}>{suggestions.map((t) => <button key={t} type="button" disabled={disabled} onClick={() => { (onSuggestion ?? onValueChange)(t); ta.current?.focus(); }} {...px(c.suggChip)}>{t}</button>)}</div>
      )}
      <div {...px(c.field, pill && c.pillField)} onClick={(e) => { if (e.target === e.currentTarget) ta.current?.focus(); }}>
        {attachments && attachments.length > 0 && (
          <div {...px(c.atts)}>{attachments.map((a) => a.type === "image" && a.src ? <Thumbnail key={a.name} src={a.src} alt={a.name} width={56} height={56} onRemove={onRemoveAttachment && (() => onRemoveAttachment(a.name))} /> : <Token key={a.name} label={a.name} icon={<IconPaperclip />} onRemove={onRemoveAttachment && (() => onRemoveAttachment(a.name))} />)}</div>
        )}
        <textarea ref={ta} rows={minRows} value={value} placeholder={placeholder} disabled={disabled} autoFocus={autoFocus} aria-label={typeof label === "string" ? label : "Message"}
          onChange={(e) => onValueChange(e.target.value)} style={{ minHeight: minRows * 24 }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} {...px(c.input)} />
        {pill && <span {...px(c.pillMic)} aria-hidden><IconMic size={16} /></span>}
      </div>
      {!pill && <div {...px(c.cbar)}>
        {sources && sources.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><IconButton label="Add" size="sm"><IconPlus /></IconButton></DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" style={{ minWidth: 260 }}>
              {sources.map((x) => <DropdownMenuItem key={x.id} icon={x.icon} onSelect={x.onSelect}><span>{x.label}</span>{x.description && <span {...px(c.srcDesc)}>{x.description}</span>}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {onAttach && <>
          <IconButton label="Attach files" size="sm" onClick={() => file.current?.click()}><IconPaperclip /></IconButton>
          <input ref={file} type="file" multiple hidden onChange={(e) => { if (e.target.files) onAttach(Array.from(e.target.files)); e.target.value = ""; }} />
        </>}
        {tools}
        <div {...px(c.cend)}>
          {hint !== false && <span {...px(c.hint)}>{hint ?? <><KbdGroup keys={["⇧", "↵"]} /> new line</>}</span>}
          {dictation && <ChatDictationButton onTranscript={(t, fin) => { if (!base.current) base.current = value ? `${value} ` : ""; onValueChange(base.current + t); if (fin) base.current = ""; }} />}
          {streaming
            ? <IconButton label="Stop" variant="secondary" onClick={onStop} xstyle={c.send}><IconStop size={12} fill="currentColor" /></IconButton>
            : sendLabel
              ? <Button size="sm" variant="primary" disabled={!value.trim() || disabled} onClick={send} trailing={<IconArrowUp />}>{sendLabel}</Button>
              : <IconButton label="Send" shortcut="↵" variant="primary" disabled={!value.trim() || disabled} onClick={send} xstyle={c.send}><IconArrowUp /></IconButton>}
        </div>
      </div>}
    </div>
  );
}
