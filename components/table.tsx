/**
 * Table — rows of records.
 * TableContainer · Table · TableHeader · TableBody · TableFooter · TableRow · TableHead · TableCell · DataTable · TableSelectionToolbar
 */
import * as stylex from "@stylexjs/stylex";
import { Fragment, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { color, depth, font, motion, radius, z } from "../tokens/tokens.stylex";
import {
  Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, IconButton,
} from "./action";
import { Checkbox } from "./choice";
import { EmptyState, Skeleton } from "./feedback";
import { IconArrowDown, IconArrowUp, IconChevronRight, IconChevronsUpDown, IconColumns, IconFilter, IconMoreHorizontal, IconSearch, IconX } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Pagination } from "./navigation";

const slideUp = stylex.keyframes({ from: { opacity: 0, transform: "translate(-50%, 16px) scale(0.97)" }, to: { opacity: 1, transform: "translate(-50%, 0)" } });

const t = stylex.create({
  container: { position: "relative", width: "100%", overflow: "auto", minWidth: 0 },
  card: { borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: font.md, fontVariantNumeric: "tabular-nums" },
  thead: { backgroundColor: color.surfaceSunken },
  sticky: { position: "sticky", top: 0, zIndex: z.sticky },
  th: {
    height: 36, paddingInline: 12, textAlign: "start", verticalAlign: "middle", whiteSpace: "nowrap", fontSize: font.sm, fontWeight: font.medium, color: color.fgMuted,
    borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, backgroundColor: color.surfaceSunken,
    ":first-child": { paddingInlineStart: 16 }, ":last-child": { paddingInlineEnd: 16 },
  },
  td: {
    height: 44, paddingInline: 12, verticalAlign: "middle", color: color.fg, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border,
    ":first-child": { paddingInlineStart: 16 }, ":last-child": { paddingInlineEnd: 16 },
  },
  compact: { height: 34 }, comfortable: { height: 56 },
  right: { textAlign: "end" }, center: { textAlign: "center" },
  tr: { transitionProperty: "background-color", transitionDuration: motion.fast, backgroundColor: { default: "transparent", ":hover": color.hover } },
  interactive: { cursor: "pointer", outline: "none", ":focus-visible": { backgroundColor: color.hover, boxShadow: `inset 2px 0 0 ${color.accent}` } },
  selected: { backgroundColor: { default: color.accentSoft, ":hover": color.accentSoft } },
  striped: { backgroundColor: { default: color.surfaceSunken, ":hover": color.hover } },
  tfoot: { backgroundColor: color.surfaceSunken },
  tfootTd: { height: 38, fontSize: font.sm, color: color.fgSoft, fontWeight: font.medium, borderBottomWidth: 0 },
  // responsive columns
  fromSm: { display: { default: "none", "@media (min-width: 640px)": "table-cell" } },
  fromMd: { display: { default: "none", "@media (min-width: 768px)": "table-cell" } },
  fromLg: { display: { default: "none", "@media (min-width: 1024px)": "table-cell" } },
  fromXl: { display: { default: "none", "@media (min-width: 1280px)": "table-cell" } },
  // DataTable parts
  wrap: { display: "flex", flexDirection: "column", gap: 10, minWidth: 0 },
  bar: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 32 },
  barStart: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minWidth: 0, flex: 1 },
  selCount: { fontSize: font.md, color: color.fgSoft, fontVariantNumeric: "tabular-nums" },
  vline: { width: 1, height: 16, backgroundColor: color.border },
  hdr: { display: "inline-flex", alignItems: "center", gap: 4 },
  hdrRev: { flexDirection: "row-reverse" },
  sortBtn: {
    display: "inline-flex", alignItems: "center", gap: 4, height: 24, paddingInline: 4, marginInline: -4, borderRadius: radius.xs, outline: "none", cursor: "pointer",
    color: { default: "inherit", ":hover": color.fg }, ":focus-visible": { boxShadow: depth.focus },
  },
  sortOn: { color: color.fg },
  sortIdle: { opacity: { default: 0, [stylex.when.ancestor(":hover")]: 0.6 } },
  filterBtn: {
    position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: radius.xs, outline: "none",
    color: { default: "inherit", ":hover": color.fg }, backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  filterDot: { position: "absolute", top: 2, right: 2, width: 6, height: 6, borderRadius: "50%", backgroundColor: color.accent },
  narrow: { width: 36, paddingInlineEnd: 0 },
  mlAuto: { marginInlineStart: "auto" },
  actions: { width: 44, textAlign: "end", paddingInlineEnd: 10 },
  rowAct: { opacity: { default: 0.55, [stylex.when.ancestor(":hover")]: 1 } },
  chev: { display: "inline-flex", transitionProperty: "transform", transitionDuration: motion.fast },
  chevOpen: { transform: "rotate(90deg)" },
  expanded: { paddingBlock: 12, paddingInlineStart: 48, backgroundColor: color.surfaceSunken, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  // selection toolbar
  floating: {
    position: "fixed", left: "50%", bottom: 20, zIndex: z.popover, display: "flex", alignItems: "center", gap: 6, padding: 6, paddingInlineStart: 14,
    borderRadius: radius.xl, backgroundColor: color.surfaceInverse, color: color.fgInverse, boxShadow: `0 12px 32px -8px ${color.shadeLg}, 0 0 0 1px ${color.borderStrong}`,
    animationName: slideUp, animationDuration: motion.base, animationTimingFunction: motion.spring, transform: "translateX(-50%)", maxWidth: "calc(100vw - 24px)",
  },
  inline: {
    display: "flex", alignItems: "center", gap: 6, padding: 6, paddingInlineStart: 12, borderRadius: radius.lg, backgroundColor: color.accentSoft,
    boxShadow: `inset 0 0 0 1px ${color.accentBorder}`,
  },
  fCount: { fontSize: font.md, fontWeight: font.medium, whiteSpace: "nowrap", paddingInlineEnd: 6, fontVariantNumeric: "tabular-nums" },
  fSep: { width: 1, alignSelf: "stretch", marginBlock: 4, backgroundColor: "currentColor", opacity: 0.18 },
  fActions: { display: "flex", alignItems: "center", gap: 4, overflowX: "auto" },
  onInverse: { color: color.fgInverse, backgroundColor: { default: "transparent", ":hover": "rgba(127,127,127,0.18)" } },
});

export type Density = "compact" | "default" | "comfortable";
type Align = "left" | "right" | "center";
const alignStyle = (a?: Align) => (a === "right" ? t.right : a === "center" ? t.center : null);

/* ============================================================== primitives */

/** Scroll wrapper. `variant="card"` (default) puts the table on a raised surface. */
export function TableContainer({ variant = "card", children, xstyle, className, style, ...rest }: Omit<ComponentProps<"div">, "className" | "style"> & StyleProps & { variant?: "card" | "plain" }) {
  return <div {...rest} {...sx({ xstyle, className, style }, t.container, variant === "card" && t.card)}>{children}</div>;
}
export function Table({ xstyle, className, style, ...rest }: Omit<ComponentProps<"table">, "className" | "style"> & StyleProps) { return <table {...rest} {...sx({ xstyle, className, style }, t.table)} />; }
export function TableHeader({ sticky, xstyle, className, style, ...rest }: Omit<ComponentProps<"thead">, "className" | "style"> & StyleProps & { sticky?: boolean }) { return <thead {...rest} {...sx({ xstyle, className, style }, t.thead, sticky && t.sticky)} />; }
export function TableBody(props: ComponentProps<"tbody">) { return <tbody {...props} />; }
export function TableFooter({ xstyle, className, style, ...rest }: Omit<ComponentProps<"tfoot">, "className" | "style"> & StyleProps) { return <tfoot {...rest} {...sx({ xstyle, className, style }, t.tfoot)} />; }
export function TableRow({ selected, interactive, striped, xstyle, className, style, ...rest }: Omit<ComponentProps<"tr">, "className" | "style"> & StyleProps & { selected?: boolean; interactive?: boolean; striped?: boolean }) {
  return <tr aria-selected={selected || undefined} {...rest} {...sx({ xstyle, className, style }, t.tr, stylex.defaultMarker(), striped && t.striped, interactive && t.interactive, selected && t.selected)} />;
}
export function TableHead({ align, xstyle, className, style, ...rest }: Omit<ComponentProps<"th">, "className" | "style" | "align"> & StyleProps & { align?: Align }) {
  return <th scope="col" {...rest} {...sx({ xstyle, className, style }, t.th, alignStyle(align))} />;
}
export function TableCell({ align, density = "default", xstyle, className, style, ...rest }: Omit<ComponentProps<"td">, "className" | "style" | "align"> & StyleProps & { align?: Align; density?: Density }) {
  return <td {...rest} {...sx({ xstyle, className, style }, t.td, density !== "default" && t[density], alignStyle(align))} />;
}

/* ============================================================== DataTable */

export type Column<T> = {
  id: string;
  header: ReactNode;
  /** Plain-text name for the View menu. */
  title?: string;
  cell: (row: T) => ReactNode;
  /** Value for sorting and filtering. */
  value?: (row: T) => string | number | Date | null | undefined;
  sortable?: boolean;
  /** Header filter menu with these options (matched against `value`). */
  filterOptions?: { label: string; value: string }[];
  align?: Align;
  width?: number | string;
  /** Hidden on small screens; appears from this breakpoint. */
  showFrom?: "sm" | "md" | "lg" | "xl";
  defaultHidden?: boolean;
  /** Can't be hidden (the name column). */
  required?: boolean;
  footer?: (rows: T[]) => ReactNode;
  xstyle?: StyleProps["xstyle"];
};
export type SortState = { id: string; dir: "asc" | "desc" } | null;

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (ids: Set<string>) => void;
  /** Items for the "…" row menu (DropdownMenuItem elements). */
  rowActions?: (row: T) => ReactNode;
  renderExpanded?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  activeRowId?: string | null;
  loading?: boolean;
  loadingRows?: number;
  empty?: ReactNode;
  defaultSort?: SortState;
  density?: Density;
  onDensityChange?: (d: Density) => void;
  pageSize?: number;
  /** Left side of the toolbar: search, filters. The View menu sits on the right. */
  toolbar?: ReactNode;
  /** While rows are selected: a floating action bar (default) or inline in the toolbar. */
  bulkActions?: (selected: T[], clear: () => void) => ReactNode;
  bulkActionsPlacement?: "floating" | "inline";
  stickyHeader?: boolean;
  maxHeight?: number | string;
  caption?: string;
  striped?: boolean;
  variant?: "card" | "plain";
  /** Hide the View (density/columns) menu. */
  hideViewMenu?: boolean;
} & StyleProps;

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0; if (a == null) return 1; if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}
const fromStyle = (b?: Column<unknown>["showFrom"]) => (b === "sm" ? t.fromSm : b === "md" ? t.fromMd : b === "lg" ? t.fromLg : b === "xl" ? t.fromXl : null);

/** Sort, filter, select, expand, paginate, density and column visibility — the full records table. */
export function DataTable<T>({
  data, columns, getRowId, selectable, selected: selProp, onSelectedChange, rowActions, renderExpanded, onRowClick, activeRowId, loading, loadingRows = 8, empty,
  defaultSort = null, density: dProp, onDensityChange, pageSize, toolbar, bulkActions, bulkActionsPlacement = "floating", stickyHeader = true, maxHeight, caption, striped,
  variant = "card", hideViewMenu, ...p
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id)));
  const [innerSel, setInnerSel] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [innerDensity, setInnerDensity] = useState<Density>("default");
  const [page, setPage] = useState(1);
  const density = dProp ?? innerDensity;
  const setDensity = (d: Density) => (onDensityChange ? onDensityChange(d) : setInnerDensity(d));
  const selected = selProp ?? innerSel;
  const setSelected = (s: Set<string>) => (onSelectedChange ? onSelectedChange(s) : setInnerSel(s));
  const visible = columns.filter((c) => !hidden.has(c.id));
  const rows = useMemo(() => {
    let out = data;
    for (const [id, set] of Object.entries(filters)) { if (!set.size) continue; const col = columns.find((c) => c.id === id); if (col?.value) out = out.filter((r) => set.has(String(col.value!(r)))); }
    if (sort) { const col = columns.find((c) => c.id === sort.id); if (col?.value) out = [...out].sort((a, b) => compare(col.value!(a), col.value!(b)) * (sort.dir === "asc" ? 1 : -1)); }
    return out;
  }, [data, columns, filters, sort]);
  const pageCount = pageSize ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount);
  const pageRows = pageSize ? rows.slice((safePage - 1) * pageSize, safePage * pageSize) : rows;
  const pageIds = pageRows.map(getRowId);
  const onPage = pageIds.filter((id) => selected.has(id)).length;
  const allState: boolean | "indeterminate" = onPage === 0 ? false : onPage === pageIds.length ? true : "indeterminate";
  const toggleSort = (id: string) => setSort((s) => (s?.id !== id ? { id, dir: "asc" } : s.dir === "asc" ? { id, dir: "desc" } : null));
  const colSpan = visible.length + (selectable ? 1 : 0) + (renderExpanded ? 1 : 0) + (rowActions ? 1 : 0);
  const selRows = data.filter((r) => selected.has(getRowId(r)));
  const hasFooter = visible.some((c) => c.footer);
  const anyFilter = Object.values(filters).some((s) => s.size);
  const clearSel = () => setSelected(new Set());

  return (
    <div {...sx(p, t.wrap)}>
      {(toolbar || !hideViewMenu || (bulkActions && bulkActionsPlacement === "inline" && selRows.length > 0)) && (
        <div {...px(t.bar)}>
          <div {...px(t.barStart)}>
            {bulkActions && bulkActionsPlacement === "inline" && selRows.length > 0
              ? <TableSelectionToolbar count={selRows.length} onClear={clearSel} placement="inline">{bulkActions(selRows, clearSel)}</TableSelectionToolbar>
              : toolbar}
          </div>
          {!hideViewMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="sm" leading={<IconColumns />}>View</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Density</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as Density)}>
                  <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Columns</DropdownMenuLabel>
                {columns.map((c) => (
                  <DropdownMenuCheckboxItem key={c.id} disabled={c.required} checked={!hidden.has(c.id)} onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(on) => { const n = new Set(hidden); if (on) n.delete(c.id); else n.add(c.id); setHidden(n); }}>
                    {c.title ?? (typeof c.header === "string" ? c.header : c.id)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
      <TableContainer variant={variant} style={{ maxHeight }} tabIndex={maxHeight ? 0 : undefined} aria-label={caption}>
        <Table aria-busy={loading || undefined}>
          {caption && <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>{caption}</caption>}
          <TableHeader sticky={stickyHeader}>
            <tr>
              {renderExpanded && <TableHead xstyle={t.narrow} aria-label="Expand" />}
              {selectable && (
                <TableHead xstyle={t.narrow}>
                  <span style={{ display: "flex" }}><Checkbox aria-label="Select all rows on this page" checked={allState} disabled={loading || !pageIds.length}
                    onCheckedChange={() => { const n = new Set(selected); if (allState === true) pageIds.forEach((id) => n.delete(id)); else pageIds.forEach((id) => n.add(id)); setSelected(n); }} /></span>
                </TableHead>
              )}
              {visible.map((c) => {
                const on = sort?.id === c.id; const f = filters[c.id];
                return (
                  <TableHead key={c.id} align={c.align} style={{ width: c.width }} xstyle={[fromStyle(c.showFrom), c.xstyle as never, stylex.defaultMarker()]}
                    aria-sort={on ? (sort!.dir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined}>
                    <span {...px(t.hdr, c.align === "right" && t.hdrRev)}>
                      {c.sortable ? (
                        <button type="button" onClick={() => toggleSort(c.id)} {...px(t.sortBtn, on && t.sortOn)}>
                          {c.header}
                          {on ? (sort!.dir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />) : <span {...px(t.sortIdle)}><IconChevronsUpDown size={12} /></span>}
                        </button>
                      ) : c.header}
                      {c.filterOptions && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" aria-label={`Filter ${c.title ?? c.id}`} {...px(t.filterBtn)}><IconFilter size={12} />{f?.size ? <span {...px(t.filterDot)} /> : null}</button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Show</DropdownMenuLabel>
                            {c.filterOptions.map((o) => (
                              <DropdownMenuCheckboxItem key={o.value} checked={f?.has(o.value) ?? false} onSelect={(e) => e.preventDefault()}
                                onCheckedChange={(v) => { const n = new Set(f ?? []); if (v) n.add(o.value); else n.delete(o.value); setFilters({ ...filters, [c.id]: n }); setPage(1); }}>
                                {o.label}
                              </DropdownMenuCheckboxItem>
                            ))}
                            {f?.size ? <><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => setFilters({ ...filters, [c.id]: new Set() })}>Clear filter</DropdownMenuItem></> : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </span>
                  </TableHead>
                );
              })}
              {rowActions && <TableHead xstyle={t.actions} aria-label="Actions" />}
            </tr>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: loadingRows }, (_, i) => (
                <TableRow key={`sk${i}`}>
                  {renderExpanded && <TableCell density={density} />}
                  {selectable && <TableCell density={density} xstyle={t.narrow}><Skeleton width={16} height={16} radius={4} /></TableCell>}
                  {visible.map((c, ci) => <TableCell key={c.id} density={density} align={c.align} xstyle={fromStyle(c.showFrom)}><Skeleton height={10} width={`${[64, 48, 72, 40, 56][(ci + i) % 5]}%`} xstyle={c.align === "right" && t.mlAuto} /></TableCell>)}
                  {rowActions && <TableCell density={density} />}
                </TableRow>
              ))
              : pageRows.map((row, ri) => {
                const id = getRowId(row); const isSel = selected.has(id); const isOpen = expanded.has(id);
                return (
                  <Fragment key={id}>
                    <TableRow selected={isSel || activeRowId === id} interactive={Boolean(onRowClick)} striped={striped && ri % 2 === 1}
                      onClick={onRowClick ? () => onRowClick(row) : undefined} tabIndex={onRowClick ? 0 : undefined}
                      onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" && e.target === e.currentTarget) onRowClick(row); } : undefined}>
                      {renderExpanded && (
                        <TableCell density={density} xstyle={t.narrow} onClick={(e) => e.stopPropagation()}>
                          <IconButton label={isOpen ? "Collapse row" : "Expand row"} size="xs" tooltip={false} aria-expanded={isOpen}
                            onClick={() => { const n = new Set(expanded); if (isOpen) n.delete(id); else n.add(id); setExpanded(n); }}>
                            <span {...px(t.chev, isOpen && t.chevOpen)}><IconChevronRight /></span>
                          </IconButton>
                        </TableCell>
                      )}
                      {selectable && (
                        <TableCell density={density} xstyle={t.narrow} onClick={(e) => e.stopPropagation()}>
                          <span style={{ display: "flex" }}><Checkbox aria-label="Select row" checked={isSel} onCheckedChange={() => { const n = new Set(selected); if (isSel) n.delete(id); else n.add(id); setSelected(n); }} /></span>
                        </TableCell>
                      )}
                      {visible.map((c) => <TableCell key={c.id} density={density} align={c.align} xstyle={[fromStyle(c.showFrom), c.xstyle as never]}>{c.cell(row)}</TableCell>)}
                      {rowActions && (
                        <TableCell density={density} xstyle={t.actions} onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><IconButton label="Row actions" size="sm" tooltip={false} xstyle={t.rowAct}><IconMoreHorizontal /></IconButton></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">{rowActions(row)}</DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                    {renderExpanded && isOpen && <tr><td colSpan={colSpan} {...px(t.expanded)}>{renderExpanded(row)}</td></tr>}
                  </Fragment>
                );
              })}
            {!loading && pageRows.length === 0 && (
              <tr><td colSpan={colSpan}>
                {empty ?? <EmptyState compact icon={<IconSearch />} title={anyFilter ? "No rows match these filters" : "Nothing here yet"}
                  actions={anyFilter ? <Button size="sm" onClick={() => setFilters({})}>Clear filters</Button> : undefined} />}
              </td></tr>
            )}
          </TableBody>
          {hasFooter && !loading && rows.length > 0 && (
            <TableFooter>
              <tr>
                {renderExpanded && <td />}{selectable && <td />}
                {visible.map((c) => <TableCell key={c.id} align={c.align} xstyle={[t.tfootTd, fromStyle(c.showFrom)]}>{c.footer?.(rows)}</TableCell>)}
                {rowActions && <td />}
              </tr>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {pageSize && rows.length > 0 ? <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} total={rows.length} pageSize={pageSize} /> : null}
      {bulkActions && bulkActionsPlacement === "floating" && selRows.length > 0 && <TableSelectionToolbar count={selRows.length} onClear={clearSel}>{bulkActions(selRows, clearSel)}</TableSelectionToolbar>}
    </div>
  );
}

/* ============================================================== TableSelectionToolbar */

/** What to do with the selected rows. Floats at the bottom of the screen (default) or sits inline above the table. */
export function TableSelectionToolbar({ count, onClear, children, placement = "floating", noun = "selected" }: { count: number; onClear: () => void; children: ReactNode; placement?: "floating" | "inline"; noun?: string }) {
  const inv = placement === "floating";
  return (
    <div role="toolbar" aria-label="Selection actions" {...px(inv ? t.floating : t.inline)}>
      <span {...px(t.fCount)}>{count} {noun}</span>
      <span aria-hidden {...px(t.fSep)} />
      <div {...px(t.fActions)}>{children}</div>
      <IconButton label="Clear selection" size="sm" onClick={onClear} xstyle={inv && t.onInverse}><IconX /></IconButton>
    </div>
  );
}
