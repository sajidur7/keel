/**
 * Content — text and media.
 * Text · Heading · Kbd · KbdGroup · Code · CodeBlock · Blockquote · Citation · Markdown · Icon ·
 * Avatar · AvatarGroup · Thumbnail · ImagePreview · Timer · Timestamp · Token · Tag
 */
import * as stylex from "@stylexjs/stylex";
import { Avatar as AP } from "radix-ui";
import {
  createElement, useEffect, useMemo, useState,
  type ComponentProps, type ElementType, type ReactNode,
} from "react";
import { color, depth, font, motion, radius, tone as tn } from "../tokens/tokens.stylex";
import { IconButton, CopyButton } from "./action";
import { IconSizeContext, IconX, type IconProps } from "./icons";
import { keyParts } from "./keys";
export { keyParts } from "./keys";
import { px, sx, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";
import { Lightbox, Tooltip } from "./overlay";

/* ============================================================== Text & Heading */

const t = stylex.create({
  base: { margin: 0, fontFamily: font.sans },
  display: { fontSize: font.display, lineHeight: 1.1, fontWeight: font.semibold, letterSpacing: "-0.025em" },
  h1: { fontSize: font.h1, lineHeight: 1.18, fontWeight: font.semibold, letterSpacing: "-0.02em" },
  h2: { fontSize: font.h2, lineHeight: 1.25, fontWeight: font.semibold, letterSpacing: "-0.015em" },
  h3: { fontSize: font.h3, lineHeight: 1.3, fontWeight: font.semibold, letterSpacing: "-0.01em" },
  title: { fontSize: font.xl, lineHeight: 1.35, fontWeight: font.semibold, letterSpacing: "-0.005em" },
  body: { fontSize: font.lg, lineHeight: 1.55 },
  small: { fontSize: font.md, lineHeight: 1.5 },
  caption: { fontSize: font.sm, lineHeight: 1.45 },
  eyebrow: { fontSize: font.xs, lineHeight: 1.4, fontWeight: font.medium, letterSpacing: "0.06em", textTransform: "uppercase" },
  mono: { fontFamily: font.mono, fontSize: font.sm, letterSpacing: "-0.01em" },
  stat: { fontSize: "26px", lineHeight: 1.1, fontWeight: font.semibold, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  // tones
  default: { color: color.fg }, soft: { color: color.fgSoft }, muted: { color: color.fgMuted }, faint: { color: color.fgFaint },
  accent: { color: color.blue }, success: { color: color.success }, warning: { color: color.warning }, danger: { color: color.danger },
  inherit: { color: "inherit" },
  // modifiers
  regular: { fontWeight: font.regular }, medium: { fontWeight: font.medium }, semibold: { fontWeight: font.semibold }, bold: { fontWeight: font.bold },
  truncate: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 },
  clamp: (n: number) => ({ display: "-webkit-box", WebkitLineClamp: n, WebkitBoxOrient: "vertical", overflow: "hidden" }),
  tabular: { fontVariantNumeric: "tabular-nums" },
  strike: { textDecorationLine: "line-through" },
  balance: { textWrap: "balance" },
  pretty: { textWrap: "pretty" },
});

export type TextVariant = "display" | "h1" | "h2" | "h3" | "title" | "body" | "small" | "caption" | "eyebrow" | "mono" | "stat";
export type TextTone = "default" | "soft" | "muted" | "faint" | "accent" | "success" | "warning" | "danger" | "inherit";

export type TextProps = Omit<ComponentProps<"p">, "className" | "style"> & StyleProps & {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  weight?: "regular" | "medium" | "semibold" | "bold";
  /** One line with an ellipsis. */
  truncate?: boolean;
  /** Clamp to N lines with an ellipsis. */
  maxLines?: number;
  tabular?: boolean;
  strike?: boolean;
  wrap?: "balance" | "pretty";
  dateTime?: string;
  htmlFor?: string;
};

/** Every piece of text. Pick a variant for size, a tone for emphasis — never raw font sizes. */
export function Text({ as = "p", variant = "small", tone, weight, truncate, maxLines, tabular, strike, wrap, xstyle, className, style, ...rest }: TextProps) {
  const defaultTone: TextTone = variant === "eyebrow" ? "muted" : variant === "caption" ? "muted" : "default";
  return createElement(as, {
    ...rest,
    ...sx({ xstyle, className, style }, t.base, t[variant], t[tone ?? defaultTone], weight && t[weight],
      truncate && t.truncate, !!maxLines && t.clamp(maxLines), tabular && t.tabular, strike && t.strike, wrap && t[wrap]),
  });
}

/** A heading with the right element for its level. `level` sets semantics; `variant` can change the look. */
export function Heading({ level = 2, variant, ...rest }: Omit<TextProps, "as"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const v: TextVariant = variant ?? (level === 1 ? "h1" : level === 2 ? "h2" : level === 3 ? "h3" : "title");
  return <Text as={`h${level}`} variant={v} {...rest} />;
}

/* ============================================================== Kbd */

const k = stylex.create({
  kbd: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18, height: 18, paddingInline: 5,
    gap: 2, borderRadius: radius.xs, fontFamily: font.sans, fontSize: font.xs, fontWeight: font.medium, lineHeight: 1,
    color: color.fgSoft, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`,
    boxShadow: `inset 0 -1px 0 ${color.borderStrong}, 0 0 0 1px ${color.border}`, whiteSpace: "nowrap",
    marginInline: "0.3em", // breathing room when a key sits inside a sentence
  },
  group: { display: "inline-flex", alignItems: "center", gap: 3, marginInline: "0.3em" },
  flush: { marginInline: 0 },
});

/** A key, drawn like a key. Symbols (⌘ ⇧ ⌥ ⌃ ↵ ↑ ↓ ← → ⌫ ⇥) and names ("shift", "enter", "mod") render as icons. */
export function Kbd({ xstyle, className, style, children, ...rest }: ComponentProps<"kbd"> & StyleProps) {
  const content = typeof children === "string" ? keyParts(children) : children;
  return <kbd {...rest} {...sx({ xstyle, className, style }, k.kbd)}><IconSizeContext.Provider value={11}>{content}</IconSizeContext.Provider></kbd>;
}
/** Several keys, one cap each: ["mod", "K"] or "⌘K". */
export function KbdGroup({ keys, xstyle }: { keys: string[] | string } & StyleProps) {
  const list = typeof keys === "string" ? (keys.includes("+") && keys.length > 1 ? keys.split("+") : Array.from(keys.match(/[A-Za-z]{2,}|./gu) ?? [])) : keys;
  return <span {...sx({ xstyle }, k.group)}>{list.map((key, i) => <Kbd key={i} xstyle={k.flush}>{key}</Kbd>)}</span>;
}

/* ============================================================== Code & CodeBlock */

const c = stylex.create({
  inline: {
    fontFamily: font.mono, fontSize: "0.9em", paddingInline: 5, paddingBlock: 1, borderRadius: radius.xs,
    backgroundColor: color.muted, color: color.fgSoft, boxShadow: `inset 0 0 0 1px ${color.border}`, overflowWrap: "anywhere", boxDecorationBreak: "clone",
  },
  accent: { backgroundColor: color.accentSoft, color: color.accentStrong, boxShadow: `inset 0 0 0 1px ${color.accentBorder}` },
  block: {
    position: "relative", minWidth: 0, borderRadius: radius.lg, overflow: "hidden",
    backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`,
  },
  bar: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, height: 36, paddingInlineStart: 12, paddingInlineEnd: 6,
    borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, backgroundColor: color.surface,
  },
  barTitle: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, fontSize: font.sm, color: color.fgMuted, fontWeight: font.medium },
  lang: { fontFamily: font.mono, fontSize: font.xs, color: color.fgFaint, textTransform: "lowercase" },
  pre: { margin: 0, overflow: "auto", paddingBlock: 12, fontFamily: font.mono, fontSize: "12.5px", lineHeight: 1.65, color: color.fg },
  wrap: { whiteSpace: "pre-wrap", wordBreak: "break-word" },
  nowrap: { whiteSpace: "pre" },
  line: { display: "flex", paddingInlineEnd: 16, minHeight: "1.65em" },
  num: { flexShrink: 0, width: 44, paddingInlineEnd: 14, textAlign: "right", color: color.fgFaint, userSelect: "none" },
  pad: { paddingInlineStart: 14 },
  hl: { backgroundColor: color.accentSoft, boxShadow: `inset 2px 0 0 ${color.accent}` },
  add: { backgroundColor: color.successSoft, boxShadow: `inset 2px 0 0 ${color.successSolid}` },
  del: { backgroundColor: color.dangerSoft, boxShadow: `inset 2px 0 0 ${color.danger}` },
  mark: { width: 14, flexShrink: 0, userSelect: "none", color: color.fgFaint },
  copy: { position: "absolute", top: 6, right: 6 },
  more: { display: "flex", justifyContent: "center", paddingBlock: 6, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, backgroundColor: color.surface },
  // syntax tokens
  kw: { color: color.chart5 }, str: { color: color.chart2 }, num_: { color: color.chart3 }, com: { color: color.fgFaint, fontStyle: "italic" }, fn: { color: color.chart1 }, tag: { color: color.chart4 },
});

/** Inline monospace value — ids, keys, file names. */
export function Code({ tone = "default", xstyle, className, style, ...rest }: ComponentProps<"code"> & StyleProps & { tone?: "default" | "accent" }) {
  return <code {...rest} {...sx({ xstyle, className, style }, c.inline, tone === "accent" && c.accent)} />;
}

const KW = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|type|interface|async|await|new|class|extends|true|false|null|undefined|in|of|as|try|catch|throw|switch|case|break|def|print|echo|npm|npx|cd)\b/g;
function highlight(line: string): ReactNode[] {
  // tiny tokenizer: comments, strings, numbers, keywords, function calls, JSX tags
  const out: ReactNode[] = [];
  const re = /(\/\/.*$|#.*$|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(<\/?[A-Za-z][\w.]*)|(\b[A-Za-z_$][\w$]*(?=\())|(\b[A-Za-z_]+\b)/gm;
  let last = 0; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const [tok, com, str, num, tag, fn, word] = m;
    const st = com ? c.com : str ? c.str : num ? c.num_ : tag ? c.tag : fn ? c.fn : word && KW.test(word) ? c.kw : null;
    KW.lastIndex = 0;
    out.push(st ? <span key={i++} {...px(st)}>{tok}</span> : tok);
    last = m.index + tok.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export type CodeBlockProps = StyleProps & {
  code: string;
  language?: string;
  title?: ReactNode;
  /** Line numbers in the gutter. */
  lineNumbers?: boolean;
  startLine?: number;
  /** 1-based line numbers to highlight. */
  highlightLines?: number[];
  /** Treat lines starting with + / - as a diff. */
  diff?: boolean;
  wrap?: boolean;
  copy?: boolean;
  /** Collapse long code behind "Show all". */
  collapseAfter?: number;
  maxHeight?: number;
  /** Plain text, no syntax colors. */
  plain?: boolean;
};

/** Multi-line code with optional title, line numbers, highlights, diff marks and copy. */
export function CodeBlock({ code, language, title, lineNumbers, startLine = 1, highlightLines, diff, wrap, copy = true, collapseAfter, maxHeight, plain, ...p }: CodeBlockProps) {
  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const [open, setOpen] = useState(false);
  const collapsed = collapseAfter && !open && lines.length > collapseAfter;
  const shown = collapsed ? lines.slice(0, collapseAfter) : lines;
  const hasBar = title || language;
  return (
    <div {...sx(p, c.block)}>
      {hasBar && (
        <div {...px(c.bar)}>
          <span {...px(c.barTitle)}>{title}{language && <span {...px(c.lang)}>{language}</span>}</span>
          {copy && <CopyButton value={code} label="Copy code" size="xs" />}
        </div>
      )}
      <pre {...px(c.pre, wrap ? c.wrap : c.nowrap)} style={maxHeight ? { maxHeight } : undefined}>
        <code>
          {shown.map((ln, i) => {
            const n = startLine + i;
            const kind = diff ? (ln.startsWith("+") ? "add" : ln.startsWith("-") ? "del" : null) : null;
            const text = diff && kind ? ln.slice(1) : ln;
            return (
              <span key={i} {...px(c.line, !lineNumbers && c.pad, highlightLines?.includes(n) && c.hl, kind === "add" && c.add, kind === "del" && c.del)}>
                {lineNumbers && <span {...px(c.num)}>{n}</span>}
                {diff && <span {...px(c.mark)}>{kind === "add" ? "+" : kind === "del" ? "−" : " "}</span>}
                <span>{plain ? text : highlight(text)}{"\n"}</span>
              </span>
            );
          })}
        </code>
      </pre>
      {!hasBar && copy && <span {...px(c.copy)}><CopyButton value={code} label="Copy code" size="xs" /></span>}
      {collapseAfter && lines.length > collapseAfter && (
        <div {...px(c.more)}>
          <button type="button" onClick={() => setOpen((v) => !v)} style={{ fontSize: 12, color: "inherit", opacity: 0.75 }}>
            {open ? "Show less" : `Show all ${lines.length} lines`}
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================== Blockquote & Citation */

const q = stylex.create({
  quote: {
    margin: 0, paddingInlineStart: 14, paddingBlock: 2, color: color.fgSoft, fontSize: font.lg, lineHeight: 1.6,
    borderInlineStartWidth: 3, borderInlineStartStyle: "solid", borderInlineStartColor: color.borderStrong,
  },
  cite: { display: "block", marginTop: 6, fontSize: font.sm, fontStyle: "normal", color: color.fgMuted },
  cit: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 16, height: 16, paddingInline: 4,
    marginInline: 2, verticalAlign: "0.15em", borderRadius: radius.xs, fontSize: "10px", fontWeight: font.semibold, lineHeight: 1,
    color: color.blueStrong, backgroundColor: color.blueSoft, cursor: "pointer", textDecoration: "none",
    transitionProperty: "background-color", transitionDuration: motion.fast,
    ":hover": { backgroundColor: color.blueBorder },
  },
  chip: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 22, paddingInline: 8, borderRadius: radius.full, fontSize: font.sm,
    color: color.fgSoft, backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}`, maxWidth: 220,
    ":hover": { color: color.fg, backgroundColor: color.selected },
  },
  fav: { width: 12, height: 12, borderRadius: 3, backgroundColor: color.borderStrong, flexShrink: 0 },
});

/** A quotation, optionally attributed. */
export function Blockquote({ children, cite, xstyle }: { children: ReactNode; cite?: ReactNode } & StyleProps) {
  return <blockquote {...sx({ xstyle }, q.quote)}>{children}{cite && <cite {...px(q.cite)}>— {cite}</cite>}</blockquote>;
}

export type CitationSource = { title: string; url?: string; domain?: string };
/** Hostname of an absolute URL; undefined for relative or invalid ones. */
const hostOf = (url?: string) => { if (!url) return undefined; try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return undefined; } };

/** A source reference in generated text: a numbered marker or a source chip, with the source on hover. */
export function Citation({ source, number, variant = "number" }: { source: CitationSource; number?: number; variant?: "number" | "chip" }) {
  const domain = source.domain ?? hostOf(source.url);
  const el = variant === "chip"
    ? <a href={source.url} target="_blank" rel="noreferrer" {...px(q.chip)}><span {...px(q.fav)} /><span {...px(t.truncate)}>{domain ?? source.title}</span></a>
    : <a href={source.url} target="_blank" rel="noreferrer" aria-label={`Source ${number}: ${source.title}`} {...px(q.cit)}>{number}</a>;
  return <Tooltip content={<span>{source.title}{domain && <span style={{ opacity: 0.6 }}> · {domain}</span>}</span>}>{el}</Tooltip>;
}

/* ============================================================== Markdown */

const blink = stylex.keyframes({ "0%, 100%": { opacity: 1 }, "50%": { opacity: 0 } });
const md = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 10, fontSize: font.lg, lineHeight: 1.65, color: color.fg, minWidth: 0 },
  compact: { gap: 6, fontSize: font.md },
  h: { fontWeight: font.semibold, letterSpacing: "-0.01em", lineHeight: 1.3, marginTop: 6 },
  h1: { fontSize: font.h2 }, h2: { fontSize: font.h3 }, h3: { fontSize: font.xl },
  list: { display: "flex", flexDirection: "column", gap: 4, paddingInlineStart: 20 },
  ul: { listStyleType: "disc" }, ol: { listStyleType: "decimal" },
  li: { paddingInlineStart: 2 },
  hr: { height: 1, backgroundColor: color.border, marginBlock: 6 },
  caret: { display: "inline-block", width: 7, height: "1.05em", marginInlineStart: 2, verticalAlign: "text-bottom", backgroundColor: color.fg, borderRadius: 1, animationName: blink, animationDuration: "1s", animationIterationCount: "infinite" },
});

function inline(text: string, sources?: CitationSource[], key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))|(\[\^(\d+)\])/g;
  let last = 0; let m: RegExpExecArray | null; let i = key;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={i++} style={{ fontWeight: 600 }}>{m[2]}</strong>);
    else if (m[3]) out.push(<em key={i++}>{m[4]}</em>);
    else if (m[5]) out.push(<Code key={i++}>{m[6]}</Code>);
    else if (m[7]) out.push(<a key={i++} href={m[9]} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>{m[8]}</a>);
    else if (m[10]) { const n = Number(m[11]); const s = sources?.[n - 1]; out.push(s ? <Citation key={i++} number={n} source={s} /> : `[${n}]`); }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export type MarkdownProps = StyleProps & {
  children: string;
  /** Show a blinking caret at the end while text is still arriving. */
  streaming?: boolean;
  /** Sources for [^1] citations. */
  sources?: CitationSource[];
  density?: "default" | "compact";
};

/** Renders a safe subset of Markdown: headings, lists, code fences, quotes, rules, bold/italic/code/links, [^n] citations. */
export function Markdown({ children, streaming, sources, density = "default", ...p }: MarkdownProps) {
  const blocks = useMemo(() => {
    const lines = children.split("\n");
    const out: ReactNode[] = [];
    let i = 0; let key = 0;
    while (i < lines.length) {
      const ln = lines[i];
      if (/^```/.test(ln)) {
        const lang = ln.slice(3).trim(); const buf: string[] = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++; out.push(<CodeBlock key={key++} code={buf.join("\n")} language={lang || undefined} />); continue;
      }
      const h = /^(#{1,3})\s+(.*)/.exec(ln);
      if (h) { const lvl = h[1].length as 1 | 2 | 3; out.push(createElement(`h${lvl + 1}`, { key: key++, ...px(md.h, md[`h${lvl}`]) }, inline(h[2], sources))); i++; continue; }
      if (/^(-{3,}|\*{3,})$/.test(ln.trim())) { out.push(<div key={key++} role="separator" {...px(md.hr)} />); i++; continue; }
      if (/^>\s?/.test(ln)) { const buf: string[] = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, "")); out.push(<Blockquote key={key++}>{inline(buf.join(" "), sources)}</Blockquote>); continue; }
      if (/^\s*([-*]|\d+\.)\s+/.test(ln)) {
        const ordered = /^\s*\d+\./.test(ln); const items: string[] = [];
        while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        out.push(createElement(ordered ? "ol" : "ul", { key: key++, ...px(md.list, ordered ? md.ol : md.ul) }, items.map((it, j) => <li key={j} {...px(md.li)}>{inline(it, sources)}</li>)));
        continue;
      }
      if (!ln.trim()) { i++; continue; }
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>|\s*([-*]|\d+\.)\s)/.test(lines[i])) buf.push(lines[i++]);
      out.push(<p key={key++}>{inline(buf.join(" "), sources)}</p>);
    }
    return out;
  }, [children, sources]);
  return (
    <div {...sx(p, md.root, density === "compact" && md.compact)}>
      {blocks}
      {streaming && <span aria-hidden {...px(md.caret)} />}
    </div>
  );
}

/* ============================================================== Icon */

const ic = stylex.create({
  root: { display: "inline-flex", flexShrink: 0 },
  default: { color: color.icon }, fg: { color: color.fg }, muted: { color: color.fgMuted }, accent: { color: color.accent },
  success: { color: color.success }, warning: { color: color.warning }, danger: { color: color.danger }, inherit: { color: "inherit" },
  tile: { alignItems: "center", justifyContent: "center", borderRadius: radius.md, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised },
  tileSize: (n: number) => ({ width: n, height: n }),
});

export type IconTone = "default" | "fg" | "muted" | "accent" | "success" | "warning" | "danger" | "inherit";

/** Renders any Keel icon with a tone and size. `tile` puts it on a small raised square (feature lists, empty states). */
export function Icon({ icon: I, size = 16, tone = "default", label, tile, xstyle }: {
  icon: React.ComponentType<IconProps>; size?: IconProps["size"]; tone?: IconTone; label?: string; tile?: boolean;
} & StyleProps) {
  return <span {...sx({ xstyle }, ic.root, ic[tone], tile && ic.tile, tile && ic.tileSize((size ?? 16) + 16))}><I size={size} label={label} /></span>;
}

/* ============================================================== Avatar */

const AV = { xs: 18, sm: 24, md: 28, lg: 36, xl: 44, "2xl": 64 } as const;
type AvatarSize = keyof typeof AV;
const TONES = ["blue", "teal", "green", "amber", "orange", "red", "pink", "violet", "lime", "gray"] as const;
export type Tone = (typeof TONES)[number];
/* Avatars only use the neutral weights (and one blue) — never red, which reads as an error. */
const AVATAR_TONES: Tone[] = ["gray", "green", "violet", "amber", "pink", "blue", "gray", "teal"];
function toneFor(name = ""): Tone { let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return AVATAR_TONES[h % AVATAR_TONES.length]; }
export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

const toneStyles = stylex.create({
  gray: { color: tn.grayFg, backgroundColor: tn.grayBg, boxShadow: `inset 0 0 0 1px ${tn.grayBd}` },
  red: { color: tn.redFg, backgroundColor: tn.redBg, boxShadow: `inset 0 0 0 1px ${tn.redBd}` },
  orange: { color: tn.orangeFg, backgroundColor: tn.orangeBg, boxShadow: `inset 0 0 0 1px ${tn.orangeBd}` },
  amber: { color: tn.amberFg, backgroundColor: tn.amberBg, boxShadow: `inset 0 0 0 1px ${tn.amberBd}` },
  green: { color: tn.greenFg, backgroundColor: tn.greenBg, boxShadow: `inset 0 0 0 1px ${tn.greenBd}` },
  teal: { color: tn.tealFg, backgroundColor: tn.tealBg, boxShadow: `inset 0 0 0 1px ${tn.tealBd}` },
  blue: { color: tn.blueFg, backgroundColor: tn.blueBg, boxShadow: `inset 0 0 0 1px ${tn.blueBd}` },
  violet: { color: tn.violetFg, backgroundColor: tn.violetBg, boxShadow: `inset 0 0 0 1px ${tn.violetBd}` },
  pink: { color: tn.pinkFg, backgroundColor: tn.pinkBg, boxShadow: `inset 0 0 0 1px ${tn.pinkBd}` },
  lime: { color: tn.limeFg, backgroundColor: tn.limeBg, boxShadow: `inset 0 0 0 1px ${tn.limeBd}` },
});
/** Shared tone styles (fg, soft bg, hairline) — reuse for your own tinted chips. */
export const toneStyle = toneStyles;
export const TAG_TONES = TONES;
const ALIAS: Record<string, Tone> = { neutral: "gray", yellow: "amber", cyan: "teal", indigo: "blue", purple: "violet" };
export const resolveTone = (x?: string): Tone => {
  if (!x) return "gray";
  const y = ALIAS[x] ?? x;
  return (TONES as readonly string[]).includes(y) ? (y as Tone) : "gray";
};

const a = stylex.create({
  root: {
    position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    borderRadius: "50%", fontWeight: font.medium, letterSpacing: "0.02em", userSelect: "none", lineHeight: 1, verticalAlign: "middle",
  },
  square: { borderRadius: "28%" },
  img: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" },
  ring: { boxShadow: `0 0 0 2px ${color.surface}` },
  dot: { position: "absolute", right: -1, bottom: -1, width: "30%", height: "30%", minWidth: 6, minHeight: 6, borderRadius: "50%", boxShadow: `0 0 0 2px ${color.surface}` },
  online: { backgroundColor: color.successSolid }, away: { backgroundColor: color.warningSolid }, busy: { backgroundColor: color.danger }, offline: { backgroundColor: color.fgFaint },
  dim: (n: number) => ({ width: n, height: n, fontSize: Math.max(8, Math.round(n * 0.34)) }),
  group: { display: "inline-flex", alignItems: "center" },
  overlap: (n: number) => ({ marginInlineStart: -Math.round(n * 0.28) }),
  more: { color: color.fgSoft, backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}` },
});

export type AvatarStatus = "online" | "away" | "busy" | "offline";
export type AvatarProps = StyleProps & {
  name?: string;
  src?: string;
  size?: AvatarSize;
  shape?: "circle" | "square";
  status?: AvatarStatus;
  /** Tint initials by name (default). false = neutral. */
  colored?: boolean;
  /** Show the name in a tooltip. */
  tooltip?: boolean;
};

/** A person or organization. Falls back to tinted initials; the tint is stable per name. */
export function Avatar({ name = "", src, size = "md", shape = "circle", status, colored = true, tooltip, ...p }: AvatarProps) {
  const el = (
    <AP.Root {...sx(p, a.root, a.dim(AV[size]), toneStyles[colored ? toneFor(name) : "gray"], shape === "square" && a.square)} aria-label={name || undefined}>
      {src && <AP.Image src={src} alt={name} {...px(a.img)} />}
      <AP.Fallback delayMs={src ? 300 : 0}>{AV[size] <= 18 ? initials(name).slice(0, 1) : initials(name)}</AP.Fallback>
      {status && <span aria-label={status} {...px(a.dot, a[status])} />}
    </AP.Root>
  );
  return tooltip && name ? <Tooltip content={name}>{el}</Tooltip> : el;
}

/** Overlapping avatars with a "+N" for the rest. */
export function AvatarGroup({ people, max = 4, size = "md", ...p }: { people: { name: string; src?: string }[]; max?: number; size?: AvatarSize } & StyleProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div {...sx(p, a.group)} aria-label={`${people.length} people`}>
      {shown.map((x, i) => <span key={i} {...px(i > 0 && a.overlap(AV[size]))}><Avatar name={x.name} src={x.src} size={size} tooltip xstyle={a.ring} /></span>)}
      {rest > 0 && (
        <Tooltip content={people.slice(max).map((x) => x.name).join(", ")}>
          <span {...px(a.root, a.dim(AV[size]), a.more, a.ring, a.overlap(AV[size]))}>+{rest}</span>
        </Tooltip>
      )}
    </div>
  );
}

/* ============================================================== Thumbnail & ImagePreview */

const th = stylex.create({
  root: {
    position: "relative", display: "inline-flex", flexShrink: 0, borderRadius: radius.md, overflow: "hidden",
    backgroundColor: color.muted, boxShadow: `inset 0 0 0 1px ${color.border}`, isolation: "isolate",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  btn: { cursor: "zoom-in", outline: "none", ":focus-visible": { boxShadow: depth.focus } },
  dis: { opacity: 0.5 },
  center: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: color.scrim, color: "#fff" },
  remove: { position: "absolute", top: 3, right: 3, zIndex: 1 },
  label: { position: "absolute", left: 0, right: 0, bottom: 0, paddingInline: 6, paddingBlock: 3, fontSize: font.xs, color: "#fff", backgroundImage: "linear-gradient(180deg, transparent, rgba(0,0,0,0.6))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  dim: (w: number, h: number) => ({ width: w, height: h }),
});

/** A small image tile — attachments, uploads, galleries. Optional remove button, loading veil and caption. */
export function Thumbnail({ src, alt, label, width = 64, height = 64, loading, disabled, onRemove, onClick, ...p }: StyleProps & {
  src: string; alt: string; label?: string; width?: number; height?: number; loading?: boolean; disabled?: boolean; onRemove?: () => void; onClick?: () => void;
}) {
  const img = <img src={src} alt={alt} {...px(th.img)} />;
  return (
    <span {...sx(p, th.root, th.dim(width, height), disabled && th.dis)}>
      {onClick ? <button type="button" aria-label={`Open ${alt}`} onClick={onClick} disabled={disabled} {...px(th.btn)} style={{ width: "100%", height: "100%" }}>{img}</button> : img}
      {label && <span {...px(th.label)}>{label}</span>}
      {loading && <span {...px(th.center)}><Spinner size={16} /></span>}
      {onRemove && !loading && <span {...px(th.remove)}><IconButton label={`Remove ${alt}`} size="xs" variant="secondary" tooltip={false} onClick={onRemove}><IconX /></IconButton></span>}
    </span>
  );
}

/** A thumbnail that opens full size in a Lightbox. */
export function ImagePreview({ src, alt, width = 96, height = 72, ...p }: StyleProps & { src: string; alt: string; width?: number; height?: number }) {
  const [open, setOpen] = useState(false);
  return <><Thumbnail src={src} alt={alt} width={width} height={height} onClick={() => setOpen(true)} {...p} /><Lightbox open={open} onOpenChange={setOpen} items={[{ src, alt }]} /></>;
}

/* ============================================================== Timer & Timestamp */

function useNow(every: number, on = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { if (!on) return; const id = setInterval(() => setNow(Date.now()), every); return () => clearInterval(id); }, [every, on]);
  return now;
}
const pad = (n: number) => String(n).padStart(2, "0");
export function formatDuration(ms: number, withHours?: boolean) {
  const s = Math.max(0, Math.floor(ms / 1000)); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
  return h || withHours ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/** Live elapsed (or remaining, with `endTime`) time: a call, a running job, a countdown. */
export function Timer({ startTime, endTime, running = true, variant = "small", tone, xstyle }: {
  startTime?: number; endTime?: number; running?: boolean; variant?: TextVariant; tone?: TextTone;
} & StyleProps) {
  const now = useNow(1000, running);
  const ms = endTime ? endTime - now : now - (startTime ?? now);
  return <Text as="span" variant={variant} tone={tone} tabular xstyle={xstyle} role="timer">{formatDuration(ms)}</Text>;
}

const RTF = typeof Intl !== "undefined" ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }) : null;
export function relativeTime(d: Date, now = Date.now()) {
  const diff = (d.getTime() - now) / 1000; const abs = Math.abs(diff);
  const [v, u]: [number, Intl.RelativeTimeFormatUnit] = abs < 45 ? [Math.round(diff), "second"] : abs < 2700 ? [Math.round(diff / 60), "minute"] : abs < 79200 ? [Math.round(diff / 3600), "hour"] : abs < 2592000 ? [Math.round(diff / 86400), "day"] : abs < 31536000 ? [Math.round(diff / 2592000), "month"] : [Math.round(diff / 31536000), "year"];
  if (u === "second" && abs < 10) return "just now";
  return RTF ? RTF.format(v, u) : d.toLocaleString();
}

/** A date or time, relative when recent ("3 min ago"), absolute after `autoAfterDays`. Full date in a tooltip. */
export function Timestamp({ value, format = "auto", autoAfterDays = 7, live = true, variant = "small", tone = "muted", xstyle }: {
  value: Date | string | number; format?: "auto" | "relative" | "date" | "datetime" | "time"; autoAfterDays?: number; live?: boolean; variant?: TextVariant; tone?: TextTone;
} & StyleProps) {
  const d = new Date(value);
  const now = useNow(30000, live && format !== "date");
  const full = d.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
  const rel = format === "relative" || (format === "auto" && Math.abs(now - d.getTime()) < autoAfterDays * 86400000);
  const text = rel ? relativeTime(d, now)
    : format === "time" ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : format === "datetime" ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : d.toLocaleDateString(undefined, { dateStyle: "medium" });
  return <Tooltip content={full}><Text as="time" dateTime={d.toISOString()} variant={variant} tone={tone} tabular xstyle={xstyle}>{text}</Text></Tooltip>;
}

/* ============================================================== Tag & Token */

const tg = stylex.create({
  tag: {
    display: "inline-flex", alignItems: "center", gap: 5, height: 22, paddingInline: 8, borderRadius: radius.sm,
    fontSize: font.sm, fontWeight: font.medium, lineHeight: 1, whiteSpace: "nowrap", maxWidth: "100%", verticalAlign: "middle",
  },
  sm: { height: 18, paddingInline: 6, fontSize: font.xs, gap: 4 },
  lg: { height: 26, paddingInline: 10, fontSize: font.md },
  pill: { borderRadius: radius.full },
  solid: { color: "#fff", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(0,0,0,0.12)" },
  outline: { color: color.fg, backgroundColor: "transparent", boxShadow: `inset 0 0 0 1px ${color.borderStrong}` },
  dot: { width: 6, height: 6, borderRadius: "50%", backgroundColor: "currentColor", flexShrink: 0 },
  x: {
    display: "inline-flex", marginInlineEnd: -4, padding: 2, borderRadius: radius.xs, color: "inherit", opacity: { default: 0.6, ":hover": 1 },
    backgroundColor: { default: "transparent", ":hover": color.hover }, outline: "none", ":focus-visible": { boxShadow: depth.focus },
  },
  label: { display: "inline-flex", alignItems: "center", gap: 4, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" },
  // token
  token: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 28, paddingInlineStart: 8, paddingInlineEnd: 10, borderRadius: radius.full,
    fontSize: font.sm, fontWeight: font.medium, color: color.fg, maxWidth: "100%", whiteSpace: "nowrap", verticalAlign: "middle",
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
  },
  tokenPlain: { paddingInlineStart: 10 },
  // Avatar inset = (height − 18px avatar) / 2 on top, bottom AND left.
  tokenAvatar: { paddingInlineStart: 5 },
  tokenAvatarSm: { paddingInlineStart: 2 },
  tokenClick: { cursor: "pointer", outline: "none", ":hover": { boxShadow: depth.raisedHover }, ":focus-visible": { boxShadow: `${depth.raised}, ${depth.focus}` } },
  tokenSm: { height: 22, fontSize: font.xs, gap: 5, paddingInlineStart: 6, paddingInlineEnd: 8 },
  tokenOff: { opacity: 0.5 },
  tokenIcon: { display: "inline-flex", color: color.icon },
  desc: { color: color.fgMuted, fontWeight: font.regular },
});

export type TagProps = Omit<ComponentProps<"span">, "className" | "style"> & StyleProps & {
  tone?: Tone | "neutral" | "yellow" | "cyan" | "indigo" | "purple";
  size?: "sm" | "md" | "lg";
  /** soft (tinted) · solid (filled) · outline (hairline, transparent). */
  variant?: "soft" | "solid" | "outline";
  shape?: "rounded" | "pill";
  dot?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
};

const SOLID = stylex.create({
  gray: { backgroundColor: "#71717a" }, red: { backgroundColor: "#d42020" }, orange: { backgroundColor: "#8a8a94" }, amber: { backgroundColor: "#8a8a94" },
  green: { backgroundColor: "#26262c" }, teal: { backgroundColor: "#3f3f46" }, blue: { backgroundColor: "#17171b" }, violet: { backgroundColor: "#52525b" },
  pink: { backgroundColor: "#52525b" }, lime: { backgroundColor: "#3f3f46" },
});

/** A short label for a category or attribute. Ten tones; `dot` for status-like tags. */
export function Tag({ tone = "gray", size = "md", variant = "soft", shape = "rounded", dot, icon, onRemove, removeLabel, children, xstyle, className, style, ...rest }: TagProps) {
  const tt = resolveTone(tone);
  return (
    <IconSizeContext.Provider value={12}>
      <span {...rest} {...sx({ xstyle, className, style }, tg.tag, size !== "md" && tg[size], shape === "pill" && tg.pill, variant === "solid" ? [SOLID[tt], tg.solid] : variant === "outline" ? tg.outline : toneStyles[tt])}>
        {dot && <span aria-hidden {...px(tg.dot)} />}
        {icon}
        <span {...px(tg.label)}>{children}</span>
        {onRemove && <button type="button" aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : ""}`} onClick={onRemove} {...px(tg.x)}><IconX size={12} /></button>}
      </span>
    </IconSizeContext.Provider>
  );
}

export type TokenProps = StyleProps & {
  label: string;
  /** Leading avatar or icon. */
  avatar?: { name: string; src?: string };
  icon?: ReactNode;
  description?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

/** An entity chip — a person, a team, a file — usually inside a Tokenizer or a sentence. Raised and removable. */
export function Token({ label, avatar, icon, description, size = "md", disabled, onClick, onRemove, ...p }: TokenProps) {
  const El = onClick ? "button" : "span";
  return (
    <El type={onClick ? "button" : undefined} onClick={onClick} disabled={onClick ? disabled : undefined}
      {...sx(p, tg.token, !avatar && !icon && tg.tokenPlain, size === "sm" && tg.tokenSm, avatar && (size === "sm" ? tg.tokenAvatarSm : tg.tokenAvatar), onClick && tg.tokenClick, disabled && tg.tokenOff)}>
      {avatar && <Avatar name={avatar.name} src={avatar.src} size="xs" />}
      {icon && <span {...px(tg.tokenIcon)}><IconSizeContext.Provider value={14}>{icon}</IconSizeContext.Provider></span>}
      <span {...px(tg.label)}>{label}</span>
      {description && <span {...px(tg.desc)}>{description}</span>}
      {onRemove && !disabled && (
        <span role="button" tabIndex={0} aria-label={`Remove ${label}`} onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " " || e.key === "Backspace") { e.preventDefault(); onRemove(); } }} {...px(tg.x)}>
          <IconX size={12} />
        </span>
      )}
    </El>
  );
}

