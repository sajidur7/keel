import { Fragment, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { Checkbox } from "./checkbox";
import {
  IconArrowDown, IconArrowUp, IconChevronRight, IconChevronsUpDown, IconColumns, IconFilter, IconMoreHorizontal, IconSearch,
} from "./icons";
import { cn } from "../lib/cn";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./menu";
import { Pagination } from "./pagination";
import { EmptyState, Skeleton } from "./skeleton";

/* =====================================================================
   Primitives — plain semantic table parts with Keel's rhythm.
   Header 36px, rows 40px (32 compact / 48 comfortable), 12px side padding,
   hairline row dividers, no zebra striping, no vertical lines.
   ===================================================================== */

export type Density = "compact" | "default" | "comfortable";
const rowHeight: Record<Density, string> = { compact: "h-8", default: "h-10", comfortable: "h-12" };

/** Scroll container. Tables scroll inside it, never the page. */
export function TableContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("relative w-full min-w-0 overflow-x-auto overscroll-x-contain", className)} {...props} />;
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return <table className={cn("w-full border-separate border-spacing-0 text-small", className)} {...props} />;
}
export function TableHeader({ className, sticky, ...props }: ComponentProps<"thead"> & { sticky?: boolean }) {
  return <thead className={cn(sticky && "sticky top-0 z-(--z-sticky)", className)} {...props} />;
}
export function TableBody(props: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}
export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return <tfoot className={cn("bg-surface font-medium", className)} {...props} />;
}
export function TableRow({ className, selected, interactive, ...props }: ComponentProps<"tr"> & { selected?: boolean; interactive?: boolean }) {
  return (
    <tr
      data-state={selected ? "selected" : undefined}
      className={cn(
        "group/row transition-colors duration-fast ease-out [&>td]:border-b [&>td]:border-border",
        interactive && "cursor-pointer hover:bg-hover",
        "data-[state=selected]:bg-selected",
        className,
      )}
      {...props}
    />
  );
}
export function TableHead({ className, align = "left", ...props }: ComponentProps<"th"> & { align?: "left" | "right" | "center" }) {
  return (
    <th
      scope="col"
      className={cn(
        "h-9 border-b border-border bg-background px-3 text-caption font-normal whitespace-nowrap text-subtle",
        align === "right" && "text-right", align === "center" && "text-center", align === "left" && "text-left",
        className,
      )}
      {...props}
    />
  );
}
export function TableCell({ className, align = "left", ...props }: ComponentProps<"td"> & { align?: "left" | "right" | "center" }) {
  return (
    <td
      className={cn(
        "px-3 align-middle whitespace-nowrap",
        align === "right" && "text-right tabular", align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================================
   DataTable — sorting, selection, column filters, visibility, density,
   expandable rows, row actions, loading, empty, footer, pagination.
   ===================================================================== */

export type Column<T> = {
  id: string;
  header: ReactNode;
  /** Plain-text name for menus (column visibility); falls back to header if it's a string. */
  title?: string;
  cell: (row: T) => ReactNode;
  /** Value used for sorting and filtering. Enables sorting when `sortable`. */
  value?: (row: T) => string | number | Date | null | undefined;
  sortable?: boolean;
  /** Adds a filter menu to the header with these options (matched against `value`). */
  filterOptions?: { label: string; value: string }[];
  align?: "left" | "right" | "center";
  width?: number | string;
  /** Hide on small screens — the column reappears at this breakpoint. Secondary columns only. */
  showFrom?: "sm" | "md" | "lg" | "xl";
  /** Hidden by default; the user can switch it on from the View menu. */
  defaultHidden?: boolean;
  /** Can't be turned off (the name column). */
  required?: boolean;
  footer?: (rows: T[]) => ReactNode;
  className?: string;
};

const showFromClass = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell", xl: "hidden xl:table-cell" } as const;

export type SortState = { id: string; dir: "asc" | "desc" } | null;

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  /** Show checkboxes. Controlled with `selected` / `onSelectedChange`, or internal. */
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (ids: Set<string>) => void;
  /** Menu content for the "…" row button (DropdownMenuItem elements). */
  rowActions?: (row: T) => ReactNode;
  renderExpanded?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  /** Highlights a row (e.g. the one open in a detail sheet). */
  activeRowId?: string | null;
  loading?: boolean;
  /** Rows shown while loading. */
  loadingRows?: number;
  empty?: ReactNode;
  defaultSort?: SortState;
  density?: Density;
  onDensityChange?: (d: Density) => void;
  pageSize?: number;
  /** Left side of the table's toolbar (search, filters). The View menu sits on the right. */
  toolbar?: ReactNode;
  /** Shown in the toolbar instead of `toolbar` while rows are selected. */
  bulkActions?: (selected: T[], clear: () => void) => ReactNode;
  stickyHeader?: boolean;
  /** Max height of the scroll area; needed for a sticky header to stick. */
  maxHeight?: number | string;
  caption?: string;
  className?: string;
};

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function DataTable<T>({
  data, columns, getRowId, selectable, selected: selectedProp, onSelectedChange, rowActions, renderExpanded,
  onRowClick, activeRowId, loading, loadingRows = 8, empty, defaultSort = null, density: densityProp, onDensityChange,
  pageSize, toolbar, bulkActions, stickyHeader = true, maxHeight, caption, className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(defaultSort);
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id)));
  const [innerSel, setInnerSel] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [innerDensity, setInnerDensity] = useState<Density>("default");
  const [page, setPage] = useState(1);

  const density = densityProp ?? innerDensity;
  const setDensity = (d: Density) => (onDensityChange ? onDensityChange(d) : setInnerDensity(d));
  const selected = selectedProp ?? innerSel;
  const setSelected = (s: Set<string>) => (onSelectedChange ? onSelectedChange(s) : setInnerSel(s));

  const visible = columns.filter((c) => !hidden.has(c.id));

  const rows = useMemo(() => {
    let out = data;
    for (const [id, set] of Object.entries(filters)) {
      if (!set.size) continue;
      const col = columns.find((c) => c.id === id);
      if (col?.value) out = out.filter((r) => set.has(String(col.value!(r))));
    }
    if (sort) {
      const col = columns.find((c) => c.id === sort.id);
      if (col?.value) {
        out = [...out].sort((a, b) => compare(col.value!(a), col.value!(b)) * (sort.dir === "asc" ? 1 : -1));
      }
    }
    return out;
  }, [data, columns, filters, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount);
  const pageRows = pageSize ? rows.slice((safePage - 1) * pageSize, safePage * pageSize) : rows;

  const pageIds = pageRows.map(getRowId);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const allState: boolean | "indeterminate" =
    selectedOnPage === 0 ? false : selectedOnPage === pageIds.length ? true : "indeterminate";

  const toggleSort = (id: string) =>
    setSort((s) => (s?.id !== id ? { id, dir: "asc" } : s.dir === "asc" ? { id, dir: "desc" } : null));

  const colSpan = visible.length + (selectable ? 1 : 0) + (renderExpanded ? 1 : 0) + (rowActions ? 1 : 0);
  const selectedRows = data.filter((r) => selected.has(getRowId(r)));
  const hasFooter = visible.some((c) => c.footer);
  const cellPad = density === "compact" ? "py-0" : "";

  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      {/* Toolbar */}
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-2 py-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {bulkActions && selectedRows.length > 0 ? (
            <>
              <span className="tabular text-small text-soft">{selectedRows.length} selected</span>
              <span className="h-4 w-px bg-border" aria-hidden />
              {bulkActions(selectedRows, () => setSelected(new Set()))}
            </>
          ) : (
            toolbar
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" leading={<IconColumns />}>
              <span className="hidden sm:inline">View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as Density)}>
              <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {columns.map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                disabled={c.required}
                checked={!hidden.has(c.id)}
                onCheckedChange={(on) => {
                  const next = new Set(hidden);
                  if (on) next.delete(c.id); else next.add(c.id);
                  setHidden(next);
                }}
              >
                {c.title ?? (typeof c.header === "string" ? c.header : c.id)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TableContainer className="border-t border-border" style={{ maxHeight }} tabIndex={maxHeight ? 0 : undefined} aria-label={caption}>
        <Table aria-busy={loading || undefined}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader sticky={stickyHeader}>
            <tr>
              {renderExpanded && <TableHead className="w-8 pr-0" aria-label="Expand" />}
              {selectable && (
                <TableHead className="w-9 pr-0">
                  <span className="flex items-center"><Checkbox
                    aria-label="Select all rows on this page"
                    checked={allState}
                    disabled={loading || pageIds.length === 0}
                    onCheckedChange={() => {
                      const next = new Set(selected);
                      if (allState === true) pageIds.forEach((id) => next.delete(id));
                      else pageIds.forEach((id) => next.add(id));
                      setSelected(next);
                    }}
                  /></span>
                </TableHead>
              )}
              {visible.map((c) => {
                const active = sort?.id === c.id;
                const f = filters[c.id];
                return (
                  <TableHead
                    key={c.id}
                    align={c.align}
                    style={{ width: c.width }}
                    className={cn(c.showFrom && showFromClass[c.showFrom], c.className)}
                    aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : c.sortable ? "none" : undefined}
                  >
                    <span className={cn("inline-flex items-center gap-1", c.align === "right" && "flex-row-reverse")}>
                      {c.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.id)}
                          className={cn(
                            "-mx-1 inline-flex h-6 items-center gap-1 rounded-sm px-1 outline-none hover:text-foreground focus-visible:shadow-focus",
                            active && "text-foreground",
                          )}
                        >
                          {c.header}
                          {active ? (
                            sort!.dir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />
                          ) : (
                            <IconChevronsUpDown size={12} className="opacity-0 transition-opacity [th:hover_&]:opacity-60" />
                          )}
                        </button>
                      ) : (
                        c.header
                      )}
                      {c.filterOptions && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label={`Filter ${c.title ?? c.id}`}
                              className={cn(
                                "relative inline-flex size-5 items-center justify-center rounded-sm outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus",
                                f?.size && "text-foreground",
                              )}
                            >
                              <IconFilter size={12} />
                              {f?.size ? <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-data" /> : null}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>Show</DropdownMenuLabel>
                            {c.filterOptions.map((o) => (
                              <DropdownMenuCheckboxItem
                                key={o.value}
                                checked={f?.has(o.value) ?? false}
                                onCheckedChange={(on) => {
                                  const next = new Set(f ?? []);
                                  if (on) next.add(o.value); else next.delete(o.value);
                                  setFilters({ ...filters, [c.id]: next });
                                  setPage(1);
                                }}
                              >
                                {o.label}
                              </DropdownMenuCheckboxItem>
                            ))}
                            {f?.size ? (
                              <>
                                <DropdownMenuSeparator />
                                <button
                                  type="button"
                                  className="h-7 w-full rounded-sm px-2 text-left text-small text-soft outline-none hover:bg-hover focus-visible:bg-hover"
                                  onClick={() => setFilters({ ...filters, [c.id]: new Set() })}
                                >
                                  Clear filter
                                </button>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </span>
                  </TableHead>
                );
              })}
              {rowActions && <TableHead className="w-10" aria-label="Actions" />}
            </tr>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: loadingRows }, (_, i) => (
                  <TableRow key={`sk${i}`}>
                    {renderExpanded && <TableCell className={rowHeight[density]} />}
                    {selectable && <TableCell className={cn(rowHeight[density], "pr-0")}><Skeleton className="size-4 rounded-[4px]" /></TableCell>}
                    {visible.map((c, ci) => (
                      <TableCell key={c.id} className={cn(rowHeight[density], c.showFrom && showFromClass[c.showFrom])} align={c.align}>
                        <Skeleton className={cn("h-3", c.align === "right" && "ml-auto")} style={{ width: `${[64, 48, 72, 40, 56][(ci + i) % 5]}%` }} />
                      </TableCell>
                    ))}
                    {rowActions && <TableCell className={rowHeight[density]} />}
                  </TableRow>
                ))
              : pageRows.map((row) => {
                  const id = getRowId(row);
                  const isSel = selected.has(id);
                  const isOpen = expanded.has(id);
                  return (
                    <Fragment key={id}>
                      <TableRow
                        selected={isSel || activeRowId === id}
                        interactive={Boolean(onRowClick)}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        onKeyDown={onRowClick ? (e) => { if (e.key === "Enter" && e.target === e.currentTarget) onRowClick(row); } : undefined}
                        tabIndex={onRowClick ? 0 : undefined}
                        className={onRowClick ? "outline-none focus-visible:bg-hover focus-visible:shadow-[inset_2px_0_0_var(--foreground)]" : undefined}
                      >
                        {renderExpanded && (
                          <TableCell className={cn(rowHeight[density], cellPad, "w-8 pr-0")} onClick={(e) => e.stopPropagation()}>
                            <IconButton
                              label={isOpen ? "Collapse row" : "Expand row"}
                              size="xs"
                              aria-expanded={isOpen}
                              onClick={() => {
                                const next = new Set(expanded);
                                if (isOpen) next.delete(id); else next.add(id);
                                setExpanded(next);
                              }}
                            >
                              <IconChevronRight className={cn("transition-transform duration-fast", isOpen && "rotate-90")} />
                            </IconButton>
                          </TableCell>
                        )}
                        {selectable && (
                          <TableCell className={cn(rowHeight[density], cellPad, "w-9 pr-0")} onClick={(e) => e.stopPropagation()}>
                            <span className="flex items-center"><Checkbox
                              aria-label="Select row"
                              checked={isSel}
                              onCheckedChange={() => {
                                const next = new Set(selected);
                                if (isSel) next.delete(id); else next.add(id);
                                setSelected(next);
                              }}
                            /></span>
                          </TableCell>
                        )}
                        {visible.map((c) => (
                          <TableCell key={c.id} align={c.align} className={cn(rowHeight[density], cellPad, c.showFrom && showFromClass[c.showFrom], c.className)}>
                            {c.cell(row)}
                          </TableCell>
                        ))}
                        {rowActions && (
                          <TableCell className={cn(rowHeight[density], cellPad, "w-10 pr-2 text-right")} onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <IconButton label="Row actions" size="sm" className="opacity-60 group-hover/row:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100">
                                  <IconMoreHorizontal />
                                </IconButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">{rowActions(row)}</DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                      {renderExpanded && isOpen && (
                        <tr>
                          <td colSpan={colSpan} className="border-b border-border bg-surface px-3 py-3 pl-11">
                            {renderExpanded(row)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="border-b border-border">
                  {empty ?? (
                    <EmptyState
                      size="sm"
                      icon={<IconSearch />}
                      title={Object.values(filters).some((s) => s.size) ? "No rows match these filters" : "Nothing here yet"}
                      action={Object.values(filters).some((s) => s.size) ? (
                        <Button size="sm" onClick={() => setFilters({})}>Clear filters</Button>
                      ) : undefined}
                    />
                  )}
                </td>
              </tr>
            )}
          </TableBody>
          {hasFooter && !loading && rows.length > 0 && (
            <TableFooter>
              <tr>
                {renderExpanded && <td />}
                {selectable && <td />}
                {visible.map((c) => (
                  <TableCell key={c.id} align={c.align} className={cn("h-9 text-caption text-soft", c.showFrom && showFromClass[c.showFrom])}>
                    {c.footer?.(rows)}
                  </TableCell>
                ))}
                {rowActions && <td />}
              </tr>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      {pageSize && rows.length > 0 && (
        <Pagination className="pt-3" page={safePage} pageCount={pageCount} onPageChange={setPage} total={rows.length} pageSize={pageSize} />
      )}
    </div>
  );
}
