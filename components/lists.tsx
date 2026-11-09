/**
 * Lists — collections that aren't tables.
 * List · ListItem · MetadataList (DescriptionList) · OverflowList · TreeList (Tree) · Timeline
 */
import * as stylex from "@stylexjs/stylex";
import { Children, isValidElement, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Checkbox } from "./choice";
import { Avatar } from "./content";
import { IconChevronRight, IconFile, IconFolder, IconSizeContext } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Popover, PopoverContent, PopoverTrigger } from "./overlay";
import { Spinner } from "./spinner";

const l = stylex.create({
  list: { display: "flex", flexDirection: "column", minWidth: 0 },
  card: { borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, paddingInline: 4, paddingBlock: 4 },
  item: { display: "flex", alignItems: "center", gap: 12, minWidth: 0, paddingBlock: 10, paddingInline: 8, borderRadius: radius.md },
  divided: { borderBottomWidth: { default: 1, ":last-child": 0 }, borderBottomStyle: "solid", borderBottomColor: color.border, borderRadius: 0 },
  compact: { paddingBlock: 6 },
  btn: { width: "100%", textAlign: "start", cursor: "pointer", outline: "none", backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus } },
  sel: { backgroundColor: { default: color.selected, ":hover": color.selected } },
  lead: { display: "flex", flexShrink: 0, color: color.icon },
  text: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 },
  title: { fontWeight: font.medium, color: color.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  desc: { fontSize: font.sm, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { flexShrink: 0, fontSize: font.sm, color: color.fgMuted, fontVariantNumeric: "tabular-nums" },
  header: { paddingInline: 8, paddingTop: 10, paddingBottom: 4, fontSize: font.xs, fontWeight: font.medium, color: color.fgMuted, letterSpacing: "0.05em", textTransform: "uppercase" },
  // metadata
  dl: { display: "grid", columnGap: 32, rowGap: 0, minWidth: 0 },
  dl2: { gridTemplateColumns: { default: "1fr", "@media (min-width: 768px)": "1fr 1fr" } },
  dl3: { gridTemplateColumns: { default: "1fr", "@media (min-width: 768px)": "repeat(3, 1fr)" } },
  dlStacked: { rowGap: 16 },
  pair: { display: "grid", gridTemplateColumns: "136px minmax(0, 1fr)", gap: 12, alignItems: "baseline", paddingBlock: 8, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, minWidth: 0 },
  pairStacked: { display: "flex", flexDirection: "column", gap: 4, paddingBlock: 0, borderBottomWidth: 0 },
  full: { gridColumn: "1 / -1" },
  dt: { fontSize: font.md, color: color.fgMuted },
  dd: { fontSize: font.md, color: color.fg, minWidth: 0, overflowWrap: "anywhere" },
  dlTitle: { fontSize: font.xs, fontWeight: font.medium, letterSpacing: "0.05em", textTransform: "uppercase", color: color.fgMuted, marginBottom: 8 },
  // overflow
  of: { display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden", whiteSpace: "nowrap", padding: 3, margin: -3 },
  ofItem: { flexShrink: 0 },
  ofHidden: { visibility: "hidden", position: "absolute", pointerEvents: "none" },
  more: {
    flexShrink: 0, display: "inline-flex", alignItems: "center", height: 22, paddingInline: 8, borderRadius: radius.full, fontSize: font.sm, fontWeight: font.medium, cursor: "pointer",
    color: color.fgSoft, backgroundColor: { default: color.muted, ":hover": color.selected }, boxShadow: `inset 0 0 0 1px ${color.border}`, outline: "none", ":focus-visible": { boxShadow: depth.focus },
  },
  morePop: { display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 320 },
  // tree
  tree: { display: "flex", flexDirection: "column", gap: 1, fontSize: font.md, outline: "none" },
  node: {
    display: "flex", alignItems: "center", gap: 6, height: 30, paddingInlineEnd: 8, borderRadius: radius.sm, cursor: "pointer", outline: "none", userSelect: "none",
    color: color.fg, backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  nodeSel: { backgroundColor: { default: color.accentSoft, ":hover": color.accentSoft }, color: color.accentStrong, fontWeight: font.medium },
  nodeOff: { opacity: 0.45, cursor: "not-allowed" },
  twisty: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, flexShrink: 0, color: color.fgMuted, transitionProperty: "transform", transitionDuration: motion.fast },
  twistyOpen: { transform: "rotate(90deg)" },
  nodeIcon: { display: "inline-flex", color: color.icon, flexShrink: 0 },
  nodeLabel: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  // timeline
  tl: { display: "flex", flexDirection: "column", position: "relative" },
  ev: { position: "relative", display: "flex", gap: 12, paddingBottom: 18 },
  rail: { position: "absolute", left: 11, top: 26, bottom: 2, width: 1, backgroundColor: color.border },
  marker: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, flexShrink: 0 },
  dot: { width: 10, height: 10, borderRadius: "50%", boxShadow: `0 0 0 3px ${color.surface}` },
  // An Avatar marker already has its own ring — don't add a second one.
  bareMarker: { backgroundImage: "none", boxShadow: `0 0 0 3px ${color.surface}` },
  iconMarker: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", color: color.icon,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
  },
  evBody: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1, paddingTop: 2 },
  evHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 },
  evTitle: { fontSize: font.md, color: color.fg },
  evTime: { flexShrink: 0, fontSize: font.sm, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
  evText: { fontSize: font.md, color: color.fgSoft, lineHeight: 1.5 },
  default: { backgroundColor: color.fgFaint }, success: { backgroundColor: color.successSolid }, warning: { backgroundColor: color.warningSolid }, danger: { backgroundColor: color.danger }, info: { backgroundColor: color.accent },
});

/* ============================================================== List */

/** A vertical list of rows. `variant="card"` on a surface; `divided` adds hairlines. */
export function List({ children, header, variant = "plain", divided = true, density = "default", ...p }: StyleProps & {
  children: ReactNode; header?: ReactNode; variant?: "plain" | "card"; divided?: boolean; density?: "default" | "compact";
}) {
  return (
    <ul {...sx(p, l.list, variant === "card" && l.card)} data-divided={divided || undefined} data-density={density}>
      {header && <li aria-hidden {...px(l.header)}>{header}</li>}
      {Children.map(children, (ch) => ch)}
    </ul>
  );
}

export type ListItemProps = StyleProps & {
  leading?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  href?: string;
  selected?: boolean;
  divided?: boolean;
  compact?: boolean;
};

/** A row: leading avatar/icon, title + description, meta and trailing actions. Clickable when given onClick/href. */
export function ListItem({ leading, title, description, meta, trailing, onClick, href, selected, divided = true, compact, ...p }: ListItemProps) {
  const body = (
    <IconSizeContext.Provider value={16}>
      {leading && <span {...px(l.lead)}>{leading}</span>}
      <span {...px(l.text)}><span {...px(l.title)}>{title}</span>{description && <span {...px(l.desc)}>{description}</span>}</span>
      {meta && <span {...px(l.meta)}>{meta}</span>}
    </IconSizeContext.Provider>
  );
  const rowStyle = [l.item, divided && !onClick && !href && l.divided, compact && l.compact] as const;
  return (
    <li {...sx(p, ...(onClick || href ? [] : rowStyle))} style={onClick || href ? { listStyle: "none", ...p.style } : p.style}>
      {href ? <a href={href} {...px(...rowStyle, l.btn, selected && l.sel)}>{body}{trailing}</a>
        : onClick ? <div style={{ display: "flex", alignItems: "center" }}><button type="button" onClick={onClick} aria-current={selected || undefined} {...px(...rowStyle, l.btn, selected && l.sel)}>{body}</button>{trailing}</div>
        : <>{body}{trailing}</>}
    </li>
  );
}

/* ============================================================== MetadataList */

export type MetadataItem = { label: ReactNode; value: ReactNode; /** Span all columns. */ full?: boolean };
/** Key/value pairs for a record. Labels in a column (horizontal) or above values (stacked). */
export function MetadataList({ items, layout = "horizontal", columns = 1, title, ...p }: StyleProps & { items: MetadataItem[]; layout?: "horizontal" | "stacked"; columns?: 1 | 2 | 3; title?: ReactNode }) {
  return (
    <div {...sx(p)}>
      {title && <h3 {...px(l.dlTitle)}>{title}</h3>}
      <dl {...px(l.dl, columns === 2 && l.dl2, columns === 3 && l.dl3, layout === "stacked" && l.dlStacked)}>
        {items.map((it, i) => (
          <div key={i} {...px(l.pair, layout === "stacked" && l.pairStacked, it.full && l.full)}>
            <dt {...px(l.dt)}>{it.label}</dt><dd {...px(l.dd)}>{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
/** v1 names. */
export const DescriptionList = MetadataList;
export type DescriptionItem = MetadataItem;

/* ============================================================== OverflowList */

/** A single row of items (tags, avatars, links) that shows "+N" when they don't fit; the rest open in a popover. */
export function OverflowList({ children, gap = 6, minVisible = 1, moreLabel = (n: number) => `+${n}`, ...p }: StyleProps & { children: ReactNode; gap?: number; minVisible?: number; moreLabel?: (n: number) => ReactNode }) {
  const items = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(items.length);
  useLayoutEffect(() => {
    const el = ref.current; const m = measureRef.current; if (!el || !m) return;
    const measure = () => {
      const avail = el.clientWidth; const kids = Array.from(m.children) as HTMLElement[]; const moreW = 44;
      let used = 0; let n = 0;
      for (let i = 0; i < kids.length; i++) { const w = kids[i].offsetWidth + (i ? gap : 0); const needMore = i < kids.length - 1; if (used + w + (needMore ? moreW + gap : 0) > avail && i >= minVisible) break; used += w; n++; }
      setVisible(n);
    };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, [items.length, gap, minVisible]);
  const hidden = items.slice(visible);
  return (
    <div ref={ref} {...sx(p, l.of)} style={{ gap, position: "relative", ...p.style }}>
      <div ref={measureRef} aria-hidden {...px(l.of, l.ofHidden)} style={{ gap }}>{items.map((it, i) => <span key={i} {...px(l.ofItem)}>{it}</span>)}</div>
      {items.slice(0, visible).map((it, i) => <span key={i} {...px(l.ofItem)}>{it}</span>)}
      {hidden.length > 0 && (
        <Popover>
          <PopoverTrigger {...px(l.more)} aria-label={`${hidden.length} more`}>{moreLabel(hidden.length)}</PopoverTrigger>
          <PopoverContent><div {...px(l.morePop)}>{hidden}</div></PopoverContent>
        </Popover>
      )}
    </div>
  );
}

/* ============================================================== TreeList */

export type TreeNode = { id: string; label: ReactNode; text?: string; icon?: ReactNode; meta?: ReactNode; children?: TreeNode[]; disabled?: boolean; loading?: boolean };
type Flat = { node: TreeNode; depth: number; parent: string | null };
function flatten(nodes: TreeNode[], open: Set<string>, depth = 0, parent: string | null = null, out: Flat[] = []) {
  for (const n of nodes) { out.push({ node: n, depth, parent }); if (n.children && open.has(n.id)) flatten(n.children, open, depth + 1, n.id, out); }
  return out;
}
const descendants = (n: TreeNode): string[] => (n.children ?? []).flatMap((c) => [c.id, ...descendants(c)]);

export type TreeProps = StyleProps & {
  data: TreeNode[];
  selected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Checkboxes; parents go indeterminate when some children are checked. */
  checkable?: boolean;
  checked?: Set<string>;
  onCheckedChange?: (ids: Set<string>) => void;
  defaultExpanded?: string[];
  expanded?: Set<string>;
  onExpandedChange?: (ids: Set<string>) => void;
  /** Folder/file icons when a node has none. */
  showIcons?: boolean;
  "aria-label": string;
};

/** A hierarchy (folders, org chart, categories). Arrows move, → opens, ← closes, Space checks. */
export function TreeList({ data, selected, onSelect, checkable, checked: checkedP, onCheckedChange, defaultExpanded = [], expanded: expP, onExpandedChange, showIcons, "aria-label": ariaLabel, ...p }: TreeProps) {
  const [innerExp, setInnerExp] = useState(new Set(defaultExpanded));
  const [innerChk, setInnerChk] = useState(new Set<string>());
  const [focus, setFocus] = useState<string | null>(null);
  const exp = expP ?? innerExp; const chk = checkedP ?? innerChk;
  const setExp = (s: Set<string>) => (onExpandedChange ? onExpandedChange(s) : setInnerExp(s));
  const setChk = (s: Set<string>) => (onCheckedChange ? onCheckedChange(s) : setInnerChk(s));
  const flat = useMemo(() => flatten(data, exp), [data, exp]);
  const ref = useRef<HTMLDivElement>(null);
  const toggleOpen = (id: string, open?: boolean) => { const n = new Set(exp); if (open ?? !n.has(id)) n.add(id); else n.delete(id); setExp(n); };
  const checkState = (n: TreeNode): boolean | "indeterminate" => {
    if (!n.children?.length) return chk.has(n.id);
    const d = descendants(n).filter((id) => !flatAll.get(id)?.children?.length); const on = d.filter((id) => chk.has(id)).length;
    return on === 0 ? false : on === d.length ? true : "indeterminate";
  };
  const flatAll = useMemo(() => { const m = new Map<string, TreeNode>(); const walk = (ns: TreeNode[]) => ns.forEach((x) => { m.set(x.id, x); if (x.children) walk(x.children); }); walk(data); return m; }, [data]);
  const toggleCheck = (n: TreeNode) => { const s = new Set(chk); const ids = [n.id, ...descendants(n)]; const on = checkState(n) !== true; ids.forEach((id) => (on ? s.add(id) : s.delete(id))); setChk(s); };
  const move = (id: string) => { setFocus(id); requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus()); };
  const cur = focus ?? selected ?? flat[0]?.node.id;
  return (
    <IconSizeContext.Provider value={14}>
      <div ref={ref} role="tree" aria-label={ariaLabel} aria-multiselectable={checkable || undefined} {...sx(p, l.tree)}>
        {flat.map(({ node, depth, parent }, i) => {
          const hasKids = Boolean(node.children?.length) || node.loading; const open = exp.has(node.id); const sel = selected === node.id;
          return (
            <div key={node.id} role="treeitem" data-id={node.id} aria-level={depth + 1} aria-expanded={hasKids ? open : undefined} aria-selected={checkable ? undefined : sel}
              aria-checked={checkable ? (checkState(node) === "indeterminate" ? "mixed" : checkState(node) === true) : undefined} aria-disabled={node.disabled || undefined}
              tabIndex={cur === node.id ? 0 : -1} onFocus={() => setFocus(node.id)}
              onClick={() => { if (node.disabled) return; if (checkable) toggleCheck(node); else onSelect?.(node.id, node); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); if (flat[i + 1]) move(flat[i + 1].node.id); }
                else if (e.key === "ArrowUp") { e.preventDefault(); if (flat[i - 1]) move(flat[i - 1].node.id); }
                else if (e.key === "ArrowRight") { e.preventDefault(); if (hasKids && !open) toggleOpen(node.id, true); else if (open && flat[i + 1]) move(flat[i + 1].node.id); }
                else if (e.key === "ArrowLeft") { e.preventDefault(); if (hasKids && open) toggleOpen(node.id, false); else if (parent) move(parent); }
                else if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (node.disabled) return; if (checkable) toggleCheck(node); else onSelect?.(node.id, node); }
              }}
              {...px(l.node, sel && !checkable && l.nodeSel, node.disabled && l.nodeOff)} style={{ paddingInlineStart: 4 + depth * 18 }}>
              <span onClick={(e) => { if (hasKids) { e.stopPropagation(); toggleOpen(node.id); } }} {...px(l.twisty, open && l.twistyOpen)}>
                {hasKids ? (node.loading && open && !node.children?.length ? <Spinner size={10} label="" /> : <IconChevronRight size={12} />) : null}
              </span>
              {checkable && <span onClick={(e) => e.stopPropagation()} style={{ display: "flex" }}><Checkbox size="sm" tabIndex={-1} aria-hidden checked={checkState(node)} onCheckedChange={() => toggleCheck(node)} disabled={node.disabled} /></span>}
              {(node.icon || showIcons) && <span {...px(l.nodeIcon)}>{node.icon ?? (hasKids ? <IconFolder /> : <IconFile />)}</span>}
              <span {...px(l.nodeLabel)}>{node.label}</span>
              {node.meta && <span {...px(l.meta)}>{node.meta}</span>}
            </div>
          );
        })}
      </div>
    </IconSizeContext.Provider>
  );
}
/** v1 name. */
export const Tree = TreeList;

/* ============================================================== Timeline */

export type TimelineEvent = { id: string; marker?: ReactNode; title: ReactNode; body?: ReactNode; time: ReactNode; tone?: "default" | "success" | "warning" | "danger" | "info" };
/** Chronological events, newest first, on a single hairline rail. Markers can be dots, icons or avatars. */
export function Timeline({ events, ...p }: StyleProps & { events: TimelineEvent[] }) {
  return (
    <ol {...sx(p, l.tl)}>
      {events.map((e, i) => (
        <li key={e.id} {...px(l.ev)}>
          {i < events.length - 1 && <span aria-hidden {...px(l.rail)} />}
          <span {...px(l.marker)}>{e.marker ? <span {...px(l.iconMarker, isValidElement(e.marker) && e.marker.type === Avatar && l.bareMarker)}><IconSizeContext.Provider value={12}>{e.marker}</IconSizeContext.Provider></span> : <span {...px(l.dot, l[e.tone ?? "default"])} />}</span>
          <div {...px(l.evBody)}>
            <div {...px(l.evHead)}><span {...px(l.evTitle)}>{e.title}</span><span {...px(l.evTime)}>{e.time}</span></div>
            {e.body && <div {...px(l.evText)}>{e.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
