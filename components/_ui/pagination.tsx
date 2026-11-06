import { IconChevronLeft, IconChevronRight } from "./icons";
import { Button } from "./button";
import { cn } from "../lib/cn";

/** Returns page numbers with "…" gaps, e.g. [1, "…", 4, 5, 6, "…", 20]. */
export function pageRange(page: number, pageCount: number, siblings = 1): (number | "…")[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, pageCount - 1);
  const out: (number | "…")[] = [1];
  if (left > 2) out.push("…");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < pageCount - 1) out.push("…");
  out.push(pageCount);
  return out;
}

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Total rows, shown as "21–40 of 1,284". */
  total?: number;
  pageSize?: number;
  /** "full": numbers + arrows. "compact": "Page 2 of 12" + arrows (used under 640px automatically). */
  variant?: "full" | "compact";
  className?: string;
};

export function Pagination({ page, pageCount, onPageChange, total, pageSize, variant = "full", className }: PaginationProps) {
  const fmt = new Intl.NumberFormat();
  const from = total !== undefined && pageSize ? Math.min(total, (page - 1) * pageSize + 1) : undefined;
  const to = total !== undefined && pageSize ? Math.min(total, page * pageSize) : undefined;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-between gap-3 text-caption text-subtle", className)}>
      <span className="tabular truncate">
        {total !== undefined && from !== undefined ? (
          total === 0 ? "No results" : <>{fmt.format(from)}–{fmt.format(to!)} of {fmt.format(total)}</>
        ) : (
          <>Page {page} of {pageCount}</>
        )}
      </span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <IconChevronLeft />
        </Button>
        <ul className={cn("items-center gap-0.5", variant === "full" ? "hidden sm:flex" : "hidden")}>
          {pageRange(page, pageCount).map((p, i) =>
            p === "…" ? (
              <li key={`gap${i}`} className="px-1 text-faint" aria-hidden>…</li>
            ) : (
              <li key={p}>
                <Button
                  variant={p === page ? "secondary" : "ghost"}
                  size="sm"
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`Page ${p}`}
                  className={cn("tabular min-w-[26px] px-1.5", p !== page && "text-subtle")}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              </li>
            ),
          )}
        </ul>
        <span className={cn("tabular px-1", variant === "full" && "sm:hidden")}>
          {page} / {pageCount}
        </span>
        <Button variant="ghost" size="icon-sm" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          <IconChevronRight />
        </Button>
      </div>
    </nav>
  );
}
