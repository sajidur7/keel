/**
 * Hooks — headless behavior you can use with Keel components or your own markup.
 *
 * Disclosure:  useDisclosure · useCollapsible · useOverlay · usePopover · useHoverCard · useTooltip · useLightbox
 * Tables:      useTableSelection · useTableSort · useTablePagination · useTableFiltering
 * Pickers:     useCombobox · useMultiCombobox · useCalendarDays
 * Layout:      useResizable · useSnapPaging · useOverflow · useMediaQuery · useIsMobile
 * Utilities:   useClipboard · useHotkeys · useScrollLock · useFocusTrap · useLongPress · useStreamingText · useAnnounce ·
 *              useMergedRefs · useLocale · useCollator · useOutlineFromMarkdown · useDebouncedValue
 */
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type Ref, type RefObject } from "react";

/* ------------------------------------------------------------------ disclosure */

export type Disclosure = { open: boolean; setOpen: (v: boolean) => void; onOpenChange: (v: boolean) => void; show: () => void; hide: () => void; toggle: () => void };
/** Open/closed state for any overlay. Spread `{ open, onOpenChange }` onto Dialog, Drawer, Popover, Tooltip… */
export function useDisclosure(defaultOpen = false): Disclosure {
  const [open, setOpen] = useState(defaultOpen);
  return useMemo(() => ({ open, setOpen, onOpenChange: setOpen, show: () => setOpen(true), hide: () => setOpen(false), toggle: () => setOpen((o) => !o) }), [open]);
}
export const useOverlay = useDisclosure;
export const usePopover = useDisclosure;
export const useHoverCard = useDisclosure;
export const useTooltip = useDisclosure;

/** Collapsible state plus the ARIA wiring for a custom trigger and region. */
export function useCollapsible(defaultOpen = false, id?: string) {
  const d = useDisclosure(defaultOpen);
  const rid = useMemo(() => id ?? `col-${Math.random().toString(36).slice(2, 8)}`, [id]);
  return {
    ...d,
    triggerProps: { "aria-expanded": d.open, "aria-controls": rid, onClick: d.toggle },
    contentProps: { id: rid, hidden: !d.open },
  };
}

/** Lightbox state: `show(i)` opens at an index; spread `props` onto <Lightbox items=…>. */
export function useLightbox(count: number) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return {
    open, index, show: (i = 0) => { setIndex(Math.max(0, Math.min(count - 1, i))); setOpen(true); }, hide: () => setOpen(false),
    props: { open, onOpenChange: setOpen, index, onIndexChange: setIndex },
  };
}

/* ------------------------------------------------------------------ tables */

/** Row selection by id: toggle one, toggle all (on the visible rows), clear. `allState` drives a header checkbox. */
export function useTableSelection<T>(rows: T[], getId: (row: T) => string, initial: string[] = []) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));
  const ids = rows.map(getId);
  const count = ids.filter((id) => selected.has(id)).length;
  const allState: boolean | "indeterminate" = count === 0 ? false : count === ids.length ? true : "indeterminate";
  return {
    selected, count, allState,
    isSelected: (id: string) => selected.has(id),
    toggle: (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }),
    toggleAll: () => setSelected((s) => { const n = new Set(s); if (count === ids.length) ids.forEach((id) => n.delete(id)); else ids.forEach((id) => n.add(id)); return n; }),
    clear: () => setSelected(new Set()),
    set: (v: string[]) => setSelected(new Set(v)),
  };
}

export type TableSortState<K extends string = string> = { key: K; dir: "asc" | "desc" } | null;
/** Sorts rows by a column. Click cycles asc → desc → none. Numbers, dates and strings (locale-aware) all sort correctly. */
export function useTableSort<T, K extends string = string>(rows: T[], accessor: (row: T, key: K) => unknown, initial: TableSortState<K> = null) {
  const [sort, setSort] = useState<TableSortState<K>>(initial);
  const collator = useCollator({ numeric: true, sensitivity: "base" });
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const out = [...rows].sort((a, b) => {
      const x = accessor(a, sort.key), y = accessor(b, sort.key);
      if (x == null) return 1; if (y == null) return -1;
      if (typeof x === "number" && typeof y === "number") return x - y;
      if (x instanceof Date && y instanceof Date) return x.getTime() - y.getTime();
      return collator.compare(String(x), String(y));
    });
    return sort.dir === "desc" ? out.reverse() : out;
  }, [rows, sort, accessor, collator]);
  const toggle = (key: K) => setSort((s) => (!s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  const dirOf = (key: K): "ascending" | "descending" | "none" => (sort?.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none");
  return { sorted, sort, setSort, toggle, dirOf };
}

/** Client-side paging. Resets to page 1 when the row count changes. */
export function useTablePagination<T>(rows: T[], pageSize = 25) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  useEffect(() => { setPage(1); }, [rows.length, size]);
  const items = useMemo(() => rows.slice((page - 1) * size, page * size), [rows, page, size]);
  return { items, page, pages, setPage, pageSize: size, setPageSize: setSize, from: rows.length ? (page - 1) * size + 1 : 0, to: Math.min(rows.length, page * size), total: rows.length };
}

/** Text query across chosen fields plus per-column value filters. */
export function useTableFiltering<T>(rows: T[], fields: (row: T) => (string | number | null | undefined)[]) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const q = useDebouncedValue(query, 120).trim().toLowerCase();
  const filtered = useMemo(() => rows.filter((r) => {
    if (q && !fields(r).some((f) => String(f ?? "").toLowerCase().includes(q))) return false;
    return Object.entries(filters).every(([k, vals]) => !vals.length || vals.includes(String((r as Record<string, unknown>)[k])));
  }), [rows, q, filters, fields]);
  return {
    filtered, query, setQuery, filters,
    setFilter: (key: string, values: string[]) => setFilters((f) => ({ ...f, [key]: values })),
    clear: () => { setQuery(""); setFilters({}); },
    active: Boolean(q) || Object.values(filters).some((v) => v.length),
  };
}

/* ------------------------------------------------------------------ pickers */

/** Headless combobox: query, filtered options, active index and the keyboard handler for your input. */
export function useCombobox<T>(options: T[], toText: (o: T) => string, onSelect: (o: T) => void) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return q ? options.filter((o) => toText(o).toLowerCase().includes(q)) : options; }, [options, query, toText]);
  useEffect(() => setActive(0), [query]);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter" && open && filtered[active]) { e.preventDefault(); onSelect(filtered[active]); setOpen(false); }
    else if (e.key === "Escape") setOpen(false);
  };
  return { query, setQuery, open, setOpen, active, setActive, filtered, onKeyDown };
}

/** Like useCombobox but keeps a set of picked values; Backspace on an empty query removes the last one. */
export function useMultiCombobox<T>(options: T[], toText: (o: T) => string, getId: (o: T) => string, initial: string[] = []) {
  const [picked, setPicked] = useState<string[]>(initial);
  const toggle = (o: T) => setPicked((p) => (p.includes(getId(o)) ? p.filter((x) => x !== getId(o)) : [...p, getId(o)]));
  const cb = useCombobox(options, toText, toggle);
  const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Backspace" && !cb.query && picked.length) setPicked((p) => p.slice(0, -1)); else cb.onKeyDown(e); };
  return { ...cb, onKeyDown, picked, setPicked, toggle, isPicked: (o: T) => picked.includes(getId(o)) };
}

/** The 6×7 (or fewer) day grid for a month, starting on `weekStartsOn` (0 = Sunday). */
export function useCalendarDays(month: Date, weekStartsOn = 1) {
  return useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() - weekStartsOn + 7) % 7;
    const start = new Date(first); start.setDate(1 - offset);
    const weeks: { date: Date; inMonth: boolean; isToday: boolean }[][] = [];
    const today = new Date(); const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    for (let w = 0; w < 6; w++) {
      const row = [];
      for (let d = 0; d < 7; d++) { const date = new Date(start); date.setDate(start.getDate() + w * 7 + d); row.push({ date, inMonth: date.getMonth() === month.getMonth(), isToday: same(date, today) }); }
      if (w > 3 && !row.some((x) => x.inMonth)) break;
      weeks.push(row);
    }
    return weeks;
  }, [month, weekStartsOn]);
}

/* ------------------------------------------------------------------ layout */

/** A size you can drag or nudge with arrow keys, clamped. Spread `handleProps` onto a separator. */
export function useResizable({ defaultSize = 50, min = 10, max = 90, axis = "x", step = 2 }: { defaultSize?: number; min?: number; max?: number; axis?: "x" | "y"; step?: number } = {}) {
  const [size, setSize] = useState(defaultSize);
  const containerRef = useRef<HTMLDivElement>(null);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const el = containerRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const move = (ev: PointerEvent) => setSize(clamp(axis === "x" ? ((ev.clientX - rect.left) / rect.width) * 100 : ((ev.clientY - rect.top) / rect.height) * 100));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const dec = axis === "x" ? "ArrowLeft" : "ArrowUp", inc = axis === "x" ? "ArrowRight" : "ArrowDown";
    if (e.key === dec) { e.preventDefault(); setSize((s) => clamp(s - step)); }
    if (e.key === inc) { e.preventDefault(); setSize((s) => clamp(s + step)); }
    if (e.key === "Home") setSize(min); if (e.key === "End") setSize(max);
  };
  return {
    size, setSize, containerRef,
    handleProps: { role: "separator", tabIndex: 0, "aria-orientation": (axis === "x" ? "vertical" : "horizontal") as "vertical" | "horizontal", "aria-valuenow": Math.round(size), "aria-valuemin": min, "aria-valuemax": max, onPointerDown, onKeyDown, onDoubleClick: () => setSize(defaultSize) },
  };
}

/** Page through a scroll-snap row (carousels, card rails). */
export function useSnapPaging(ref: RefObject<HTMLElement | null>) {
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const update = () => { const w = el.clientWidth || 1; setPages(Math.max(1, Math.ceil(el.scrollWidth / w))); setPage(Math.round(el.scrollLeft / w)); };
    update(); el.addEventListener("scroll", update, { passive: true }); const ro = new ResizeObserver(update); ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [ref]);
  const goTo = (i: number) => { const el = ref.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" }); };
  return { page, pages, goTo, next: () => goTo(Math.min(pages - 1, page + 1)), prev: () => goTo(Math.max(0, page - 1)), canPrev: page > 0, canNext: page < pages - 1 };
}

/** Whether an element's content overflows it (to show fades, "more" buttons, tooltips on truncated text). */
export function useOverflow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState({ x: false, y: false, start: false, end: false });
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const update = () => setState({ x: el.scrollWidth > el.clientWidth + 1, y: el.scrollHeight > el.clientHeight + 1, start: el.scrollLeft > 1, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
    update(); const ro = new ResizeObserver(update); ro.observe(el); el.addEventListener("scroll", update, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener("scroll", update); };
  }, []);
  return [ref, state] as const;
}

/** Matches a media query, live. SSR-safe (false on the server). */
export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => { const m = window.matchMedia(query); const on = () => setMatch(m.matches); on(); m.addEventListener("change", on); return () => m.removeEventListener("change", on); }, [query]);
  return match;
}
/** Under 768px — Keel's phone breakpoint. */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/* ------------------------------------------------------------------ utilities */

/** Copy text; `copied` is true for `timeout` ms afterwards. */
export function useClipboard(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copy = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    setCopied(true); clearTimeout(t.current); t.current = setTimeout(() => setCopied(false), timeout);
  }, [timeout]);
  return { copy, copied };
}

/** Global shortcuts: { "mod+k": open, "shift+?": help, "g i": goInbox }. `mod` is ⌘ on Mac, Ctrl elsewhere. Ignored while typing unless `inInputs`. */
export function useHotkeys(map: Record<string, (e: globalThis.KeyboardEvent) => void>, { inInputs = false, enabled = true } = {}) {
  const ref = useRef(map); ref.current = map;
  useEffect(() => {
    if (!enabled) return;
    let seq = ""; let timer: ReturnType<typeof setTimeout> | undefined;
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
    const on = (e: globalThis.KeyboardEvent) => {
      const tgt = e.target as HTMLElement;
      if (!inInputs && (tgt.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tgt.tagName))) return;
      const key = e.key.toLowerCase();
      const combo = [(isMac ? e.metaKey : e.ctrlKey) && "mod", e.altKey && "alt", e.shiftKey && "shift", key].filter(Boolean).join("+");
      seq = seq ? `${seq} ${key}` : key; clearTimeout(timer); timer = setTimeout(() => (seq = ""), 800);
      for (const [k, fn] of Object.entries(ref.current)) {
        const norm = k.toLowerCase().replace(/\s*\+\s*/g, "+");
        if (norm === combo || (norm.includes(" ") && norm === seq)) { e.preventDefault(); fn(e); seq = ""; return; }
      }
    };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [inInputs, enabled]);
}

/** Stops the page scrolling behind a custom overlay. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const bar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden"; if (bar) document.body.style.paddingRight = `${bar}px`;
    return () => { document.body.style.overflow = overflow; document.body.style.paddingRight = paddingRight; };
  }, [locked]);
}

/** Keeps Tab inside a container while active; restores focus when it ends. */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current; if (!active || !el) return;
    const prev = document.activeElement as HTMLElement | null;
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
    (el.querySelector<HTMLElement>(sel) ?? el).focus();
    const on = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(sel)); if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener("keydown", on);
    return () => { el.removeEventListener("keydown", on); prev?.focus?.(); };
  }, [active]);
  return ref;
}

/** Press-and-hold (touch context menus, "hold to confirm"). Spread the returned handlers. */
export function useLongPress(onLongPress: () => void, ms = 500) {
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const start = () => { t.current = setTimeout(onLongPress, ms); };
  const cancel = () => clearTimeout(t.current);
  return { onPointerDown: start, onPointerUp: cancel, onPointerLeave: cancel, onPointerCancel: cancel };
}

/** Reveals `text` progressively (for bursty model streams). Returns the visible slice and whether it's done. */
export function useStreamingText(text: string, charsPerTick = 3, tickMs = 24) {
  const [n, setN] = useState(0);
  useEffect(() => { if (n > text.length) setN(text.length); }, [text, n]);
  useEffect(() => { if (n >= text.length) return; const id = setTimeout(() => setN((x) => Math.min(text.length, x + charsPerTick)), tickMs); return () => clearTimeout(id); }, [n, text, charsPerTick, tickMs]);
  return { visible: text.slice(0, n), done: n >= text.length, reset: () => setN(0) };
}

/** Say something to screen readers without moving focus ("3 results", "Saved"). */
export function useAnnounce() {
  return useCallback((message: string, politeness: "polite" | "assertive" = "polite") => {
    let el = document.getElementById(`keel-announce-${politeness}`);
    if (!el) { el = document.createElement("div"); el.id = `keel-announce-${politeness}`; el.setAttribute("aria-live", politeness); el.setAttribute("role", "status"); Object.assign(el.style, { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }); document.body.appendChild(el); }
    el.textContent = ""; setTimeout(() => { el!.textContent = message; }, 30);
  }, []);
}

/** Combine refs (yours + a library's) onto one element. */
export function useMergedRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useCallback((node: T | null) => { refs.forEach((r) => { if (typeof r === "function") r(node); else if (r) (r as { current: T | null }).current = node; }); }, refs); // eslint-disable-line react-hooks/exhaustive-deps
}

/** The user's locale (from <html lang> or the browser). */
export function useLocale() {
  return useMemo(() => (typeof document !== "undefined" && document.documentElement.lang) || (typeof navigator !== "undefined" ? navigator.language : "en-US"), []);
}
/** A memoized Intl.Collator for sorting and searching names correctly. */
export function useCollator(options?: Intl.CollatorOptions) {
  const locale = useLocale();
  return useMemo(() => new Intl.Collator(locale, options), [locale, JSON.stringify(options)]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** A value that settles `ms` after it stops changing (search boxes). */
export function useDebouncedValue<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => { const id = setTimeout(() => setV(value), ms); return () => clearTimeout(id); }, [value, ms]);
  return v;
}

/** Headings from a Markdown string, for an <Outline>: [{ id, title, level }]. */
export function useOutlineFromMarkdown(markdown: string, levels: number[] = [2, 3]) {
  return useMemo(() => markdown.split("\n").flatMap((line) => {
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line); if (!m || !levels.includes(m[1].length)) return [];
    const title = m[2].replace(/[*_`]/g, "");
    return [{ id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), title, level: m[1].length }];
  }), [markdown, levels.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
}
