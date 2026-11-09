/**
 * Parts — the composable sub-components (Astryx-style names) for when the all-in-one components are not enough.
 *
 * Avatar:      AvatarStatusDot · AvatarGroupOverflow
 * Chat:        ChatMessageList · ChatMessageBubble · ChatComposerInput · ChatComposerDrawer · ChatSendButton · ChatLayoutScrollButton · ChatTokenizedText
 * Choice:      CheckboxListItem · RadioListItem · Indicator · CheckboxIndicator · RadioIndicator · CheckIndicator
 * Command:     CommandMenu · CommandPaletteInput · CommandPaletteList · CommandPaletteGroup · CommandPaletteItem · CommandPaletteEmpty · CommandPaletteFooter
 * Overlay:     DialogHeader · DrawerHeader · useImperativeDialog · useImperativeAlertDialog · Toast
 * Form:        FieldLabel · InputGroupText
 * Layout:      Item · GridSpan · StackItem · LayoutHeader · LayoutContent · LayoutFooter · LayoutPanel · Resizable · CollapsibleGroup
 * Lists:       MetadataListItem · BreadcrumbItem
 * Navigation:  NavIcon · NavHeadingMenu · TopNavHeading · MegaMenuItem · MobileNavToggle · TabMenu
 *              SideNav* aliases (SideNavItem, SideNavSection, SideNavHeading, SideNavCollapseButton)
 * Links:       LinkProvider · useLinkComponent
 */
import * as stylex from "@stylexjs/stylex";
import {
  createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps, type ComponentType, type ElementType,
  type KeyboardEvent, type ReactNode,
} from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, IconButton } from "./action";
import { Checkbox, Radio } from "./choice";
import { Accordion, AccordionItem } from "./container";
import { Token } from "./content";
import {
  IconArrowDown, IconArrowUp, IconCheck, IconChevronDown, IconChevronsUpDown, IconMenu, IconSearch, IconSizeContext, IconStop, IconX,
} from "./icons";
import { Label } from "./inputs";
import { KeyHint } from "./keys";
import { px, sx, type StyleProps } from "./lib/sx";
import { SidebarBrand, SidebarItem, SidebarSection, SidebarTrigger, useSidebar, useSidebarOptional } from "./navigation";
import { AlertDialog, Dialog, DialogContent } from "./overlay";

const s = stylex.create({
  // avatar
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: "50%", boxShadow: `0 0 0 2px ${color.surface}` },
  online: { backgroundColor: color.accent }, away: { backgroundColor: color.fgFaint }, busy: { backgroundColor: color.danger }, offline: { backgroundColor: "transparent", boxShadow: `inset 0 0 0 1.5px ${color.fgFaint}, 0 0 0 2px ${color.surface}` },
  more: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: font.xs, fontWeight: font.semibold, color: color.fgSoft,
    backgroundColor: color.muted, boxShadow: `0 0 0 2px ${color.surface}, inset 0 0 0 1px ${color.border}`, fontVariantNumeric: "tabular-nums", flexShrink: 0,
  },
  // chat
  list: { display: "flex", flexDirection: "column", gap: 20, minWidth: 0 },
  bubble: { maxWidth: "min(80%, 560px)", paddingInline: 12, paddingBlock: 8, borderRadius: 16, fontSize: font.lg, lineHeight: 1.55, overflowWrap: "anywhere" },
  bubbleUser: { alignSelf: "flex-end", color: color.onInk, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink, borderBottomRightRadius: 6 },
  bubbleAssistant: { alignSelf: "flex-start", backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`, borderBottomLeftRadius: 6 },
  textarea: {
    width: "100%", minHeight: 24, maxHeight: 220, resize: "none", outline: "none", fontSize: font.lg, lineHeight: 1.5, color: color.fg, backgroundColor: "transparent",
    "::placeholder": { color: color.fgFaint },
  },
  drawer: {
    display: "flex", flexWrap: "wrap", gap: 6, padding: 8, marginBottom: -6, paddingBottom: 14, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`,
  },
  scrollBtn: {
    position: "sticky", bottom: 12, alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 6, height: 30, paddingInline: 12, borderRadius: radius.full,
    fontSize: font.sm, fontWeight: font.medium, color: color.fg, cursor: "pointer", backgroundColor: color.surfaceRaised, boxShadow: depth.popover, outline: "none", zIndex: 2,
    ":focus-visible": { boxShadow: `${depth.popover}, ${depth.focus}` },
  },
  mention: { color: color.accentStrong, fontWeight: font.medium },
  // choice
  listItem: { display: "flex", alignItems: "flex-start", gap: 10, paddingBlock: 10, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  ind: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, flexShrink: 0, color: color.onAccent, transitionProperty: "background-color, box-shadow", transitionDuration: motion.fast },
  indBox: { borderRadius: 4, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.borderStrong}` },
  indRadio: { borderRadius: "50%", backgroundColor: color.surface, boxShadow: `inset 0 0 0 1px ${color.borderStrong}` },
  indOn: { backgroundColor: color.accent, boxShadow: `inset 0 0 0 1px ${color.accent}` },
  indDot: { width: 6, height: 6, borderRadius: "50%", backgroundColor: color.onAccent },
  check: { display: "inline-flex", color: color.accent },
  // command
  cmd: { display: "flex", flexDirection: "column", minWidth: 0, borderRadius: radius.xl, backgroundColor: color.surfaceRaised, boxShadow: depth.popover, overflow: "clip" },
  cmdInputRow: { display: "flex", alignItems: "center", gap: 10, height: 48, paddingInline: 14, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, color: color.icon },
  cmdInput: { flex: 1, minWidth: 0, height: "100%", outline: "none", fontSize: font.lg, color: color.fg, backgroundColor: "transparent", "::placeholder": { color: color.fgFaint } },
  cmdList: { maxHeight: 340, overflowY: "auto", padding: 6, display: "flex", flexDirection: "column", gap: 2 },
  cmdGroup: { display: "flex", flexDirection: "column", gap: 1, paddingBottom: 4 },
  cmdHead: { paddingInline: 8, paddingTop: 8, paddingBottom: 4, fontFamily: font.mono, fontSize: "10.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgFaint },
  cmdItem: {
    display: "flex", alignItems: "center", gap: 10, height: 36, paddingInline: 8, borderRadius: radius.md, fontSize: font.md, color: color.fgSoft, cursor: "pointer", outline: "none",
    ":is([data-active=true])": { backgroundColor: color.selected, color: color.fg },
  },
  cmdItemIcon: { display: "inline-flex", color: color.icon },
  cmdItemEnd: { marginInlineStart: "auto", display: "inline-flex", alignItems: "center", gap: 6, color: color.fgFaint, fontSize: font.sm },
  cmdEmpty: { paddingBlock: 28, textAlign: "center", fontSize: font.md, color: color.fgMuted },
  cmdFoot: { display: "flex", alignItems: "center", gap: 14, height: 38, paddingInline: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, fontSize: font.sm, color: color.fgMuted, backgroundColor: color.surfaceSunken },
  cmdHint: { display: "inline-flex", alignItems: "center", gap: 6 },
  // overlay
  head: { display: "flex", alignItems: "flex-start", gap: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, marginBottom: 4 },
  headIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: radius.lg, flexShrink: 0, color: color.fg, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised },
  headText: { display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 },
  headTitle: { fontSize: font.xl, fontWeight: font.semibold, letterSpacing: "-0.01em" },
  headDesc: { fontSize: font.md, color: color.fgMuted },
  headActions: { display: "flex", gap: 6, flexShrink: 0 },
  toast: {
    display: "flex", alignItems: "flex-start", gap: 10, width: "min(380px, 100%)", padding: 12, borderRadius: radius.xl, backgroundColor: color.surfaceRaised, boxShadow: depth.popover, fontSize: font.md,
  },
  toastIcon: { display: "inline-flex", paddingTop: 1, color: color.fg },
  toastDanger: { color: color.danger },
  toastBody: { display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 },
  toastTitle: { fontWeight: font.semibold },
  toastDesc: { color: color.fgMuted },
  // form
  addon: { display: "inline-flex", alignItems: "center", paddingInline: 10, fontSize: font.md, color: color.fgMuted, whiteSpace: "nowrap" },
  // layout
  item: { display: "flex", alignItems: "center", gap: 12, minWidth: 0, paddingBlock: 8, paddingInline: 10, borderRadius: radius.md, textAlign: "start", width: "100%", color: color.fg, textDecoration: "none", outline: "none" },
  itemClick: { cursor: "pointer", backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus } },
  itemText: { display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 },
  itemTitle: { fontWeight: font.medium, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemDesc: { fontSize: font.sm, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemSide: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0, color: color.fgMuted, fontSize: font.sm },
  layHead: { display: "flex", alignItems: "center", gap: 12, minHeight: 52, paddingInline: 16, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, flexShrink: 0 },
  layContent: { flex: 1, minWidth: 0, minHeight: 0, overflowY: "auto", padding: 16 },
  layFoot: { display: "flex", alignItems: "center", gap: 8, minHeight: 52, paddingInline: 16, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, flexShrink: 0 },
  layPanel: { display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto", backgroundColor: color.surface },
  panelBorderStart: { borderInlineEndWidth: 1, borderInlineEndStyle: "solid", borderInlineEndColor: color.border },
  panelBorderEnd: { borderInlineStartWidth: 1, borderInlineStartStyle: "solid", borderInlineStartColor: color.border },
  resizable: { display: "flex", width: "100%", height: "100%", minHeight: 0 },
  resizableY: { flexDirection: "column" },
  pane: { minWidth: 0, minHeight: 0, overflow: "auto" },
  handle: {
    position: "relative", flexShrink: 0, outline: "none", backgroundColor: { default: color.border, ":hover": color.accent, ":focus-visible": color.accent },
    transitionProperty: "background-color", transitionDuration: motion.fast,
  },
  handleX: { width: 1, cursor: "col-resize", "::after": { content: '""', position: "absolute", insetBlock: 0, insetInline: -4 } },
  handleY: { height: 1, cursor: "row-resize", "::after": { content: '""', position: "absolute", insetInline: 0, insetBlock: -4 } },
  // lists
  mdRow: { display: "grid", gridTemplateColumns: { default: "1fr", "@media (min-width: 640px)": "minmax(120px, 34%) 1fr" }, gap: 4, paddingBlock: 8, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  mdLabel: { fontSize: font.md, color: color.fgMuted },
  mdValue: { fontSize: font.md, color: color.fg, minWidth: 0, overflowWrap: "anywhere" },
  crumb: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: font.md, color: { default: color.fgMuted, ":hover": color.fg }, textDecoration: "none", borderRadius: radius.xs, outline: "none", ":focus-visible": { boxShadow: depth.focus } },
  crumbOn: { color: color.fg, fontWeight: font.medium },
  // nav
  navIcon: { position: "relative", display: "inline-flex", color: "inherit" },
  navBadge: { position: "absolute", top: -4, right: -6, minWidth: 14, height: 14, paddingInline: 3, borderRadius: radius.full, fontSize: "9.5px", fontWeight: font.semibold, lineHeight: "14px", textAlign: "center", color: color.onAccent, backgroundColor: color.accent, boxShadow: `0 0 0 2px ${color.surface}` },
  navDot: { position: "absolute", top: -1, right: -1, width: 7, height: 7, borderRadius: "50%", backgroundColor: color.accent, boxShadow: `0 0 0 2px ${color.surface}` },
  headingMenu: {
    display: "flex", alignItems: "center", gap: 10, width: "100%", minWidth: 0, padding: 6, borderRadius: radius.lg, cursor: "pointer", outline: "none", textAlign: "start",
    backgroundColor: { default: "transparent", ":hover": color.hover, ":is([data-state=open])": color.selected }, ":focus-visible": { boxShadow: depth.focus },
  },
  headingRail: { justifyContent: "center", width: "auto", padding: 4 },
  logo: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: radius.md, flexShrink: 0, fontWeight: font.bold, color: color.onInk, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink },
  hmText: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1, lineHeight: 1.2 },
  hmName: { fontWeight: font.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  hmMeta: { fontSize: font.sm, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  topHeading: { display: "inline-flex", alignItems: "center", gap: 10, fontWeight: font.semibold, color: color.fg, textDecoration: "none", flexShrink: 0 },
  megaItem: {
    display: "flex", alignItems: "flex-start", gap: 12, padding: 10, borderRadius: radius.lg, textDecoration: "none", color: color.fg, outline: "none",
    backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  megaIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, flexShrink: 0, borderRadius: radius.md, color: color.fg, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised },
  megaTitle: { fontWeight: font.medium, fontSize: font.md },
  megaDesc: { fontSize: font.sm, color: color.fgMuted, lineHeight: 1.4 },
  tabMenu: { display: "flex", alignItems: "center", gap: 2, minWidth: 0, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  tabMenuItem: {
    position: "relative", display: "inline-flex", alignItems: "center", gap: 6, height: 38, paddingInline: 10, fontSize: font.md, fontWeight: font.medium, whiteSpace: "nowrap",
    color: { default: color.fgMuted, ":hover": color.fg }, cursor: "pointer", outline: "none", borderRadius: radius.sm, ":focus-visible": { boxShadow: `inset ${depth.focus}` },
  },
  tabMenuOn: { color: color.fg, "::after": { content: '""', position: "absolute", left: 8, right: 8, bottom: -1, height: 2, borderRadius: 2, backgroundColor: color.fg } },
  tabCount: { fontSize: font.xs, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  measure: { position: "absolute", visibility: "hidden", pointerEvents: "none", display: "flex", gap: 2 },
});

/* ============================================================== Avatar parts */

export type PresenceStatus = "online" | "away" | "busy" | "offline";
/** The presence dot on its own — for custom avatar layouts and people lists. */
export function AvatarStatusDot({ status = "online", label, ...p }: StyleProps & { status?: PresenceStatus; label?: string }) {
  return <span role="img" aria-label={label ?? status} {...sx(p, s.dot, s[status])} />;
}
/** "+N" chip at the end of an avatar row. */
export function AvatarGroupOverflow({ count, size = 28, onClick, ...p }: StyleProps & { count: number; size?: number; onClick?: () => void }) {
  const Comp = onClick ? "button" : "span";
  return <Comp type={onClick ? "button" : undefined} onClick={onClick} aria-label={`${count} more`} {...sx(p, s.more)} style={{ width: size, height: size, ...p.style }}>+{count}</Comp>;
}

/* ============================================================== Chat parts */

/** A live log of messages; announces new ones politely. */
export function ChatMessageList({ children, ...p }: StyleProps & { children: ReactNode }) {
  return <div role="log" aria-live="polite" aria-relevant="additions" {...sx(p, s.list)}>{children}</div>;
}
/** A single bubble — user (ink, right) or assistant (sunken, left). For compact chat UIs. */
export function ChatMessageBubble({ role = "assistant", children, ...p }: StyleProps & { role?: "user" | "assistant"; children: ReactNode }) {
  return <div {...sx(p, s.bubble, role === "user" ? s.bubbleUser : s.bubbleAssistant)}>{children}</div>;
}
/** The auto-growing textarea of a composer. Enter submits, Shift+Enter adds a line. */
export function ChatComposerInput({ value, onValueChange, onSubmit, placeholder = "Message…", maxRows = 8, ...p }: StyleProps & {
  value: string; onValueChange: (v: string) => void; onSubmit?: () => void; placeholder?: string; maxRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, maxRows * 24)}px`; }, [value, maxRows]);
  return (
    <textarea ref={ref} rows={1} value={value} placeholder={placeholder} aria-label={placeholder} onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); onSubmit?.(); } }} {...sx(p, s.textarea)} />
  );
}
/** A tray that slides out above the composer — attachments, context, a slash-command menu. */
export function ChatComposerDrawer({ open = true, children, ...p }: StyleProps & { open?: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div {...sx(p, s.drawer)}>{children}</div>;
}
/** Send, or Stop while streaming. */
export function ChatSendButton({ onClick, onStop, streaming, disabled, ...p }: StyleProps & { onClick: () => void; onStop?: () => void; streaming?: boolean; disabled?: boolean }) {
  return streaming
    ? <IconButton label="Stop" variant="secondary" onClick={onStop} xstyle={p.xstyle}><IconStop size={12} fill="currentColor" /></IconButton>
    : <IconButton label="Send" shortcut="↵" variant="primary" disabled={disabled} onClick={onClick} xstyle={p.xstyle}><IconArrowUp /></IconButton>;
}
/** "Jump to latest" pill. Show it when the reader has scrolled up and new messages arrive. */
export function ChatLayoutScrollButton({ visible = true, onClick, label = "Jump to latest", ...p }: StyleProps & { visible?: boolean; onClick: () => void; label?: string }) {
  if (!visible) return null;
  return <button type="button" onClick={onClick} {...sx(p, s.scrollBtn)}><IconArrowDown size={14} />{label}</button>;
}
/** Plain text with @mentions, #channels and /commands drawn as tokens. Pass `tokens` to only match known names. */
export function ChatTokenizedText({ text, tokens, onTokenClick, ...p }: StyleProps & { text: string; tokens?: string[]; onTokenClick?: (t: string) => void }) {
  const re = tokens?.length ? new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g") : /([@#/][\w.-]+)/g;
  return <span {...sx(p)}>{text.split(re).map((part, i) => (i % 2 ? <Token key={i} label={part} size="sm" onClick={onTokenClick ? () => onTokenClick(part) : undefined} /> : part))}</span>;
}

/* ============================================================== Choice parts */

/** One checkbox row with label and description, divided — compose your own lists. */
export function CheckboxListItem({ divider = true, ...rest }: ComponentProps<typeof Checkbox> & { divider?: boolean }) {
  return <div {...px(divider && s.listItem)}><Checkbox {...rest} /></div>;
}
/** One radio row (use inside RadioGroup). */
export function RadioListItem({ divider = true, ...rest }: ComponentProps<typeof Radio> & { divider?: boolean }) {
  return <div {...px(divider && s.listItem)}><Radio {...rest} /></div>;
}
/** Visual-only selection marks for custom rows (selectable cards, table-like pickers). Not focusable. */
export function Indicator({ type = "checkbox", checked, ...p }: StyleProps & { type?: "checkbox" | "radio" | "check"; checked: boolean | "indeterminate" }) {
  if (type === "check") return <span aria-hidden {...sx(p, s.check)} style={{ visibility: checked ? "visible" : "hidden", ...p.style }}><IconCheck size={14} /></span>;
  const on = checked === true || checked === "indeterminate";
  return (
    <span aria-hidden {...sx(p, s.ind, type === "radio" ? s.indRadio : s.indBox, on && s.indOn)}>
      {type === "radio" ? on && <span {...px(s.indDot)} /> : checked === "indeterminate" ? <span style={{ width: 8, height: 2, borderRadius: 1, background: "currentColor" }} /> : on && <IconCheck size={12} strokeWidth={2.5} />}
    </span>
  );
}
export const CheckboxIndicator = (p: Omit<ComponentProps<typeof Indicator>, "type">) => <Indicator type="checkbox" {...p} />;
export const RadioIndicator = (p: Omit<ComponentProps<typeof Indicator>, "type">) => <Indicator type="radio" {...p} />;
export const CheckIndicator = (p: Omit<ComponentProps<typeof Indicator>, "type">) => <Indicator type="check" {...p} />;

/* ============================================================== Command menu (composable palette) */

type CmdCtx = { query: string; setQuery: (q: string) => void; active: string | null; setActive: (id: string | null) => void; listId: string; visible: number; register: (id: string, on: boolean) => void };
const CmdC = createContext<CmdCtx | null>(null);
const useCmd = () => { const c = useContext(CmdC); if (!c) throw new Error("CommandPalette parts must be inside <CommandMenu>"); return c; };

/** The composable command menu. Put it in a Dialog, a Popover or inline. Items filter by `value` (or their text) as you type. */
export function CommandMenu({ children, label = "Commands", ...p }: StyleProps & { children: ReactNode; label?: string }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [vis, setVis] = useState<Set<string>>(new Set());
  const listId = useId();
  const register = (id: string, on: boolean) => setVis((v) => { if (on === v.has(id)) return v; const n = new Set(v); if (on) n.add(id); else n.delete(id); return n; });
  const root = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-cmd-item]:not([hidden])") ?? []);
    const i = items.findIndex((el) => el.dataset.cmdItem === active);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
      if (next) { setActive(next.dataset.cmdItem!); next.scrollIntoView({ block: "nearest" }); }
    } else if (e.key === "Enter" && items[i]) { e.preventDefault(); items[i].click(); }
  };
  useEffect(() => {
    const first = root.current?.querySelector<HTMLElement>("[data-cmd-item]:not([hidden])");
    setActive(first?.dataset.cmdItem ?? null);
  }, [query]);
  return (
    <CmdC.Provider value={{ query, setQuery, active, setActive, listId, visible: vis.size, register }}>
      <div ref={root} role="application" aria-label={label} onKeyDown={onKeyDown} {...sx(p, s.cmd)}>{children}</div>
    </CmdC.Provider>
  );
}
export function CommandPaletteInput({ placeholder = "Search or jump to…", ...p }: StyleProps & { placeholder?: string }) {
  const c = useCmd();
  return (
    <div {...sx(p, s.cmdInputRow)}>
      <IconSearch size={16} />
      <input autoFocus role="combobox" aria-expanded aria-controls={c.listId} aria-activedescendant={c.active ?? undefined} value={c.query} onChange={(e) => c.setQuery(e.target.value)} placeholder={placeholder} aria-label={placeholder} {...px(s.cmdInput)} />
    </div>
  );
}
export function CommandPaletteList({ children, ...p }: StyleProps & { children: ReactNode }) {
  const c = useCmd();
  return <div id={c.listId} role="listbox" {...sx(p, s.cmdList)}>{children}</div>;
}
/** A titled group. Hides itself when none of its items match. */
export function CommandPaletteGroup({ heading, children, ...p }: StyleProps & { heading?: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { query } = useCmd();
  const [empty, setEmpty] = useState(false);
  useLayoutEffect(() => { setEmpty(!ref.current?.querySelector("[data-cmd-item]:not([hidden])")); }, [query, children]);
  return <div ref={ref} role="group" hidden={empty} {...sx(p, s.cmdGroup)}>{heading && <div {...px(s.cmdHead)}>{heading}</div>}{children}</div>;
}
export function CommandPaletteItem({ value, icon, shortcut, end, onSelect, children, ...p }: StyleProps & {
  /** Text to match. Defaults to the children when they are a string. */ value?: string; icon?: ReactNode; shortcut?: string; end?: ReactNode; onSelect: () => void; children: ReactNode;
}) {
  const c = useCmd();
  const id = useId();
  const text = (value ?? (typeof children === "string" ? children : "")).toLowerCase();
  const show = !c.query || text.includes(c.query.trim().toLowerCase());
  useEffect(() => { c.register(id, show); return () => c.register(id, false); }, [show]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div id={id} role="option" aria-selected={c.active === id} data-active={c.active === id} data-cmd-item={id} hidden={!show}
      onMouseMove={() => c.active !== id && c.setActive(id)} onClick={onSelect} {...sx(p, s.cmdItem)}>
      {icon && <span {...px(s.cmdItemIcon)}><IconSizeContext.Provider value={16}>{icon}</IconSizeContext.Provider></span>}
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{children}</span>
      {(shortcut || end) && <span {...px(s.cmdItemEnd)}>{end}{shortcut && <IconSizeContext.Provider value={12}><KeyHint keys={shortcut} /></IconSizeContext.Provider>}</span>}
    </div>
  );
}
/** Shown when nothing matches. */
export function CommandPaletteEmpty({ children = "No results", ...p }: StyleProps & { children?: ReactNode }) {
  const c = useCmd();
  return c.visible === 0 ? <div role="status" {...sx(p, s.cmdEmpty)}>{children}</div> : null;
}
/** Key hints along the bottom. */
export function CommandPaletteFooter({ children, ...p }: StyleProps & { children?: ReactNode }) {
  return (
    <div {...sx(p, s.cmdFoot)}>
      {children ?? <>
        <span {...px(s.cmdHint)}><IconSizeContext.Provider value={12}><KeyHint keys="↑↓" /></IconSizeContext.Provider>Move</span>
        <span {...px(s.cmdHint)}><IconSizeContext.Provider value={12}><KeyHint keys="↵" /></IconSizeContext.Provider>Open</span>
        <span {...px(s.cmdHint)} style={{ marginLeft: "auto" }}>esc Close</span>
      </>}
    </div>
  );
}

/* ============================================================== Overlay parts */

/** A rich header for dialog bodies: icon tile, title, description, actions. */
export function DialogHeader({ icon, title, description, actions, ...p }: StyleProps & { icon?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div {...sx(p, s.head)}>
      {icon && <span {...px(s.headIcon)}><IconSizeContext.Provider value={18}>{icon}</IconSizeContext.Provider></span>}
      <div {...px(s.headText)}><span {...px(s.headTitle)}>{title}</span>{description && <span {...px(s.headDesc)}>{description}</span>}</div>
      {actions && <div {...px(s.headActions)}>{actions}</div>}
    </div>
  );
}
export const DrawerHeader = DialogHeader;

type ImperativeOpts = { title: ReactNode; description?: ReactNode; body?: ReactNode; confirmLabel?: string; cancelLabel?: string; tone?: "default" | "danger" };
/** Open a confirm dialog from an event handler and await the answer: `if (await confirm({ title: "Publish?" })) …`. Render `element` once. */
export function useImperativeDialog() {
  const [state, setState] = useState<(ImperativeOpts & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = (opts: ImperativeOpts) => new Promise<boolean>((resolve) => setState({ ...opts, resolve }));
  const close = (v: boolean) => { state?.resolve(v); setState(null); };
  const element = (
    <Dialog open={!!state} onOpenChange={(o) => { if (!o) close(false); }}>
      {state && (
        <DialogContent title={state.title} description={state.description} size="sm"
          footer={<><Button variant="secondary" onClick={() => close(false)}>{state.cancelLabel ?? "Cancel"}</Button><Button variant={state.tone === "danger" ? "danger" : "primary"} onClick={() => close(true)}>{state.confirmLabel ?? "Confirm"}</Button></>}>
          {state.body}
        </DialogContent>
      )}
    </Dialog>
  );
  return [element, confirm] as const;
}
/** Same as useImperativeDialog, as a destructive AlertDialog. */
export function useImperativeAlertDialog() {
  const [state, setState] = useState<(ImperativeOpts & { resolve: (v: boolean) => void }) | null>(null);
  const confirm = (opts: ImperativeOpts) => new Promise<boolean>((resolve) => setState({ ...opts, resolve }));
  const element = (
    <AlertDialog open={!!state} onOpenChange={(o) => { if (!o) { state?.resolve(false); setState(null); } }} title={state?.title ?? ""} description={state?.description}
      actionLabel={state?.confirmLabel ?? "Delete"} cancelLabel={state?.cancelLabel} onAction={() => { state?.resolve(true); setState(null); }}>
      {state?.body}
    </AlertDialog>
  );
  return [element, confirm] as const;
}

/** A toast you place yourself (inline confirmations, docs). For real notifications use `useToast()`. */
export function Toast({ title, description, icon, tone = "default", action, onClose, ...p }: StyleProps & {
  title: ReactNode; description?: ReactNode; icon?: ReactNode; tone?: "default" | "danger"; action?: ReactNode; onClose?: () => void;
}) {
  return (
    <div role="status" {...sx(p, s.toast)}>
      {icon && <span {...px(s.toastIcon, tone === "danger" && s.toastDanger)}><IconSizeContext.Provider value={16}>{icon}</IconSizeContext.Provider></span>}
      <div {...px(s.toastBody)}><span {...px(s.toastTitle)}>{title}</span>{description && <span {...px(s.toastDesc)}>{description}</span>}</div>
      {action}
      {onClose && <IconButton label="Dismiss" size="xs" onClick={onClose}><IconX /></IconButton>}
    </div>
  );
}

/* ============================================================== Form parts */

export const FieldLabel = Label;
/** Text inside an InputGroup edge: "https://", "USD", "@acme.com". */
export function InputGroupText({ children, ...p }: StyleProps & { children: ReactNode }) {
  return <span {...sx(p, s.addon)}>{children}</span>;
}

/* ============================================================== Layout parts */

/** A generic row: leading visual, title + description, trailing meta/actions. Link, button or static. */
export function Item({ leading, title, description, trailing, href, onClick, as, ...p }: StyleProps & {
  leading?: ReactNode; title: ReactNode; description?: ReactNode; trailing?: ReactNode; href?: string; onClick?: () => void; as?: ElementType;
}) {
  const Link = useLinkComponent();
  // A clickable Item is a focusable div (not <button>) so its trailing slot can hold real buttons.
  const Comp: ElementType = as ?? (href ? Link : "div");
  const press = onClick && !href ? { role: "button", tabIndex: 0, onKeyDown: (e: KeyboardEvent) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } } } : {};
  return (
    <Comp href={href} onClick={onClick} {...press} {...sx(p, s.item, (href || onClick) ? s.itemClick : null)}>
      {leading}
      <span {...px(s.itemText)}><span {...px(s.itemTitle)}>{title}</span>{description && <span {...px(s.itemDesc)}>{description}</span>}</span>
      {trailing && <span {...px(s.itemSide)}>{trailing}</span>}
    </Comp>
  );
}
/** Make a Grid child span columns (or rows). `span="full"` spans the row. */
export function GridSpan({ span = 1, rowSpan, children, ...p }: StyleProps & { span?: number | "full"; rowSpan?: number; children: ReactNode }) {
  return <div {...sx(p)} style={{ gridColumn: span === "full" ? "1 / -1" : `span ${span} / span ${span}`, gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined, minWidth: 0, ...p.style }}>{children}</div>;
}
/** A Stack child that grows, shrinks or stays put. */
export function StackItem({ grow, shrink, basis, align, children, ...p }: StyleProps & { grow?: boolean | number; shrink?: boolean | number; basis?: string | number; align?: "start" | "center" | "end" | "stretch"; children: ReactNode }) {
  return <div {...sx(p)} style={{ flexGrow: grow === true ? 1 : grow || 0, flexShrink: shrink === false ? 0 : shrink === true ? 1 : shrink ?? 1, flexBasis: basis, alignSelf: align === "start" ? "flex-start" : align === "end" ? "flex-end" : align, minWidth: 0, ...p.style }}>{children}</div>;
}
export function LayoutHeader({ children, ...p }: StyleProps & { children: ReactNode }) { return <header {...sx(p, s.layHead)}>{children}</header>; }
export function LayoutContent({ children, ...p }: StyleProps & { children: ReactNode }) { return <main {...sx(p, s.layContent)}>{children}</main>; }
export function LayoutFooter({ children, ...p }: StyleProps & { children: ReactNode }) { return <footer {...sx(p, s.layFoot)}>{children}</footer>; }
/** A side pane. `side` draws the divider on the correct edge. */
export function LayoutPanel({ side = "start", width = 280, children, ...p }: StyleProps & { side?: "start" | "end"; width?: number | string; children: ReactNode }) {
  return <aside {...sx(p, s.layPanel, side === "start" ? s.panelBorderStart : s.panelBorderEnd)} style={{ width, flexShrink: 0, ...p.style }}>{children}</aside>;
}

/** Two panes with a draggable, keyboard-resizable divider. */
export function Resizable({ start, end, defaultSize = 50, min = 15, max = 85, axis = "x", label = "Resize panes", onSizeChange, ...p }: StyleProps & {
  start: ReactNode; end: ReactNode; defaultSize?: number; min?: number; max?: number; axis?: "x" | "y"; label?: string; onSizeChange?: (n: number) => void;
}) {
  const [size, setSize] = useState(defaultSize);
  const ref = useRef<HTMLDivElement>(null);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  useEffect(() => { onSizeChange?.(size); }, [size]); // eslint-disable-line react-hooks/exhaustive-deps
  const down = (e: React.PointerEvent) => {
    e.preventDefault(); const r = ref.current!.getBoundingClientRect();
    const move = (ev: PointerEvent) => setSize(clamp(axis === "x" ? ((ev.clientX - r.left) / r.width) * 100 : ((ev.clientY - r.top) / r.height) * 100));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };
  return (
    <div ref={ref} {...sx(p, s.resizable, axis === "y" && s.resizableY)}>
      <div {...px(s.pane)} style={{ flexBasis: `${size}%` }}>{start}</div>
      <div role="separator" tabIndex={0} aria-label={label} aria-orientation={axis === "x" ? "vertical" : "horizontal"} aria-valuenow={Math.round(size)} aria-valuemin={min} aria-valuemax={max}
        onPointerDown={down} onDoubleClick={() => setSize(defaultSize)}
        onKeyDown={(e) => { const d = e.key === (axis === "x" ? "ArrowLeft" : "ArrowUp") ? -2 : e.key === (axis === "x" ? "ArrowRight" : "ArrowDown") ? 2 : 0; if (d) { e.preventDefault(); setSize((v) => clamp(v + d)); } }}
        {...px(s.handle, axis === "x" ? s.handleX : s.handleY)} />
      <div {...px(s.pane)} style={{ flex: 1 }}>{end}</div>
    </div>
  );
}

/** Several collapsibles that behave as one: `type="single"` keeps one open. */
export function CollapsibleGroup({ items, type = "single", defaultValue, variant = "divided", ...p }: StyleProps & {
  items: { value: string; title: ReactNode; meta?: ReactNode; content: ReactNode; disabled?: boolean }[]; type?: "single" | "multiple"; defaultValue?: string | string[]; variant?: "divided" | "separated";
}) {
  const props = type === "multiple" ? { type: "multiple" as const, defaultValue: (defaultValue as string[]) ?? [] } : { type: "single" as const, defaultValue: defaultValue as string | undefined };
  return <Accordion {...props} variant={variant} xstyle={p.xstyle}>{items.map((it) => <AccordionItem key={it.value} value={it.value} title={it.title} meta={it.meta} disabled={it.disabled}>{it.content}</AccordionItem>)}</Accordion>;
}

/* ============================================================== List parts */

/** One label/value row, for building a MetadataList by hand. */
export function MetadataListItem({ label, children, ...p }: StyleProps & { label: ReactNode; children: ReactNode }) {
  return <div {...sx(p, s.mdRow)}><dt {...px(s.mdLabel)}>{label}</dt><dd {...px(s.mdValue)}>{children}</dd></div>;
}
/** One crumb, for building breadcrumbs by hand. The last one is `current`. */
export function BreadcrumbItem({ href, current, icon, children, ...p }: StyleProps & { href?: string; current?: boolean; icon?: ReactNode; children: ReactNode }) {
  const Link = useLinkComponent();
  const Comp: ElementType = href && !current ? Link : "span";
  return <Comp href={href && !current ? href : undefined} aria-current={current ? "page" : undefined} {...sx(p, s.crumb, current && s.crumbOn)}><IconSizeContext.Provider value={14}>{icon}</IconSizeContext.Provider>{children}</Comp>;
}

/* ============================================================== Navigation parts */

/** An icon with an optional count or dot — for nav items, toolbars, tab bars. */
export function NavIcon({ icon, count, dot, ...p }: StyleProps & { icon: ReactNode; count?: number; dot?: boolean }) {
  return (
    <span {...sx(p, s.navIcon)}>
      {icon}
      {count ? <span {...px(s.navBadge)}>{count > 99 ? "99+" : count}</span> : dot ? <span {...px(s.navDot)} /> : null}
    </span>
  );
}
/** Workspace/app switcher at the top of a side nav or top nav. */
export function NavHeadingMenu({ logo, name, meta, items, onSelect, footer }: {
  logo?: ReactNode; name: string; meta?: string; items: { id: string; name: string; meta?: string; logo?: ReactNode }[]; onSelect: (id: string) => void; footer?: ReactNode;
}) {
  // In a collapsed sidebar rail only the logo shows.
  const rail = useSidebarOptional()?.collapsed;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={rail ? `${name} — switch workspace` : undefined} {...px(s.headingMenu, rail && s.headingRail)}>
          <span {...px(s.logo)}>{logo ?? name.slice(0, 1)}</span>
          {!rail && <><span {...px(s.hmText)}><span {...px(s.hmName)}>{name}</span>{meta && <span {...px(s.hmMeta)}>{meta}</span>}</span>
          <IconChevronsUpDown size={14} /></>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ minWidth: 240 }}>
        <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
        {items.map((it) => <DropdownMenuItem key={it.id} icon={<span {...px(s.logo)} style={{ width: 20, height: 20, fontSize: 11 }}>{it.logo ?? it.name.slice(0, 1)}</span>} onSelect={() => onSelect(it.id)}>{it.name}</DropdownMenuItem>)}
        {footer && <><DropdownMenuSeparator />{footer}</>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
/** Logo + product name for a TopNav. */
export function TopNavHeading({ logo, name, href = "/", ...p }: StyleProps & { logo?: ReactNode; name: ReactNode; href?: string }) {
  const Link = useLinkComponent();
  return <Link href={href} {...sx(p, s.topHeading)}><span {...px(s.logo)}>{logo ?? (typeof name === "string" ? name.slice(0, 1) : "")}</span>{name}</Link>;
}
/** One rich link in a mega menu column. */
export function MegaMenuItem({ icon, title, description, href, ...p }: StyleProps & { icon?: ReactNode; title: ReactNode; description?: ReactNode; href: string }) {
  const Link = useLinkComponent();
  return (
    <Link href={href} {...sx(p, s.megaItem)}>
      {icon && <span {...px(s.megaIcon)}><IconSizeContext.Provider value={16}>{icon}</IconSizeContext.Provider></span>}
      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}><span {...px(s.megaTitle)}>{title}</span>{description && <span {...px(s.megaDesc)}>{description}</span>}</span>
    </Link>
  );
}
/** The hamburger that opens the side nav drawer on phones. */
export function MobileNavToggle({ label = "Open navigation" }: { label?: string }) {
  const { setMobileOpen } = useSidebar();
  return <IconButton label={label} size="sm" onClick={() => setMobileOpen(true)}><IconMenu /></IconButton>;
}

/** Tabs that never wrap: the ones that don't fit move into a "More" menu. */
export function TabMenu({ items, value, onValueChange, ...p }: StyleProps & {
  items: { value: string; label: ReactNode; count?: number; icon?: ReactNode }[]; value: string; onValueChange: (v: string) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(items.length);
  useLayoutEffect(() => {
    const calc = () => {
      const w = wrap.current?.clientWidth ?? 0; const kids = Array.from(measure.current?.children ?? []) as HTMLElement[];
      let used = 72; let n = 0; for (const k of kids) { used += k.offsetWidth + 2; if (used > w) break; n++; }
      setFit(n >= items.length ? items.length : Math.max(1, n));
    };
    calc(); const ro = new ResizeObserver(calc); if (wrap.current) ro.observe(wrap.current); return () => ro.disconnect();
  }, [items]);
  const shown = items.slice(0, fit); const rest = items.slice(fit);
  const hiddenActive = rest.find((i) => i.value === value);
  const tab = (it: (typeof items)[number], on: boolean) => (
    <button key={it.value} type="button" role="tab" aria-selected={on} onClick={() => onValueChange(it.value)} {...px(s.tabMenuItem, on && s.tabMenuOn)}>
      <IconSizeContext.Provider value={14}>{it.icon}</IconSizeContext.Provider>{it.label}{it.count !== undefined && <span {...px(s.tabCount)}>{it.count}</span>}
    </button>
  );
  return (
    <div ref={wrap} role="tablist" {...sx(p, s.tabMenu)} style={{ position: "relative", ...p.style }}>
      <div ref={measure} aria-hidden {...px(s.measure)}>{items.map((it) => <span key={it.value} {...px(s.tabMenuItem)}>{it.icon}{it.label}{it.count !== undefined && <span {...px(s.tabCount)}>{it.count}</span>}</span>)}</div>
      {shown.map((it) => tab(it, it.value === value))}
      {rest.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><button type="button" {...px(s.tabMenuItem, !!hiddenActive && s.tabMenuOn)}>{hiddenActive?.label ?? "More"}<IconChevronDown size={14} /></button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">{rest.map((it) => <DropdownMenuItem key={it.value} icon={it.icon} onSelect={() => onValueChange(it.value)}>{it.label}</DropdownMenuItem>)}</DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

/* Astryx names for the side nav pieces. */
export const SideNavItem = SidebarItem;
export const SideNavSection = SidebarSection;
export const SideNavHeading = SidebarBrand;
export const SideNavCollapseButton = SidebarTrigger;

/* ============================================================== Links */

type LinkComp = ComponentType<{ href?: string; children?: ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void; "aria-current"?: "page" }>;
const LinkCtx = createContext<LinkComp | "a">("a");
/** Route every Keel link through your router: <LinkProvider component={NextLink}>. */
export function LinkProvider({ component, children }: { component: LinkComp; children: ReactNode }) {
  return <LinkCtx.Provider value={component}>{children}</LinkCtx.Provider>;
}
export function useLinkComponent(): ElementType { return useContext(LinkCtx) as ElementType; }
