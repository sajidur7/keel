import { Fragment, type ReactNode } from "react";
import { Button } from "./button";
import { IconCheck, IconChevronDown, IconChevronRight, IconX } from "./icons";
import { cn } from "../lib/cn";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./menu";

/* ---------------- Breadcrumb ---------------- */

export type Crumb = { label: ReactNode; href?: string; onClick?: () => void };

/** Location trail. The last item is the current page. Middle items collapse to "…" under 640px. */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 items-center gap-1 text-caption text-subtle">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const middle = i > 0 && !last && items.length > 2;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <li aria-hidden className={cn("text-faint", middle && "hidden sm:block")}>
                  <IconChevronRight size={12} />
                </li>
              )}
              {i === 1 && items.length > 2 && (
                <li aria-hidden className="text-faint sm:hidden">… <IconChevronRight size={12} className="inline" /></li>
              )}
              <li className={cn("min-w-0", middle && "hidden sm:block", last && "truncate")}>
                {last ? (
                  <span aria-current="page" className="truncate text-soft">{it.label}</span>
                ) : it.href || it.onClick ? (
                  <a
                    href={it.href}
                    onClick={it.onClick ? (e) => { e.preventDefault(); it.onClick!(); } : undefined}
                    className="truncate rounded-xs outline-none hover:text-foreground focus-visible:shadow-focus"
                  >
                    {it.label}
                  </a>
                ) : (
                  <span className="truncate">{it.label}</span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------- Filter menu ("Label | Value") ---------------- */

export type FilterOption = { value: string; label: string; icon?: ReactNode; count?: number };

type FilterMenuBase = {
  label: string;
  options: FilterOption[];
  align?: "start" | "end";
  className?: string;
  /** Shown when nothing is selected (multi) — defaults to "All". */
  allLabel?: string;
};

/**
 * The split trigger: a quiet label on the left, the current value on the right.
 * `single` picks one value; `multi` toggles several and shows "Paid, Due" or "3 selected".
 */
export function FilterMenu(
  props:
    | (FilterMenuBase & { mode?: "single"; value: string; onChange: (v: string) => void })
    | (FilterMenuBase & { mode: "multi"; value: string[]; onChange: (v: string[]) => void }),
) {
  const { label, options, align = "start", className, allLabel = "All" } = props;
  const isMulti = props.mode === "multi";
  const selected = isMulti ? (props.value as string[]) : [props.value as string];
  const display = isMulti
    ? selected.length === 0
      ? allLabel
      : selected.length <= 2
        ? selected.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ")
        : `${selected.length} selected`
    : options.find((o) => o.value === props.value)?.label ?? props.value;
  const active = isMulti && selected.length > 0;

  return (
    <DropdownMenu>
      <div className={cn("inline-flex h-[26px] items-stretch overflow-hidden rounded-md bg-card shadow-raised", className)}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group inline-flex items-center text-caption outline-none hover:bg-hover focus-visible:shadow-focus data-[state=open]:bg-hover"
          >
            <span className="px-2 text-subtle">{label}</span>
            <span aria-hidden className="h-full w-px bg-border" />
            <span className={cn("flex max-w-44 items-center gap-1 px-2", active ? "text-foreground" : "text-soft")}>
              <span className="truncate">{display}</span>
              <IconChevronDown size={12} className="shrink-0 text-icon transition-transform duration-base ease-out group-data-[state=open]:rotate-180" />
            </span>
          </button>
        </DropdownMenuTrigger>
        {active && (
          <button
            type="button"
            aria-label={`Clear ${label} filter`}
            onClick={() => (props.onChange as (v: string[]) => void)([])}
            className="inline-flex w-6 items-center justify-center border-l border-border text-subtle outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus"
          >
            <IconX size={12} />
          </button>
        )}
      </div>
      <DropdownMenuContent align={align} className="min-w-48">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {isMulti ? (
          options.map((o) => (
            <DropdownMenuCheckboxItem
              key={o.value}
              checked={selected.includes(o.value)}
              onCheckedChange={(on) => {
                const next = on ? [...selected, o.value] : selected.filter((v) => v !== o.value);
                (props.onChange as (v: string[]) => void)(next);
              }}
            >
              <span className="flex flex-1 items-center gap-2">{o.icon}{o.label}</span>
              {o.count !== undefined && <span className="tabular text-caption text-faint">{o.count}</span>}
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuRadioGroup value={props.value as string} onValueChange={props.onChange as (v: string) => void}>
            {options.map((o) => (
              <DropdownMenuRadioItem key={o.value} value={o.value}>
                <span className="flex flex-1 items-center gap-2">{o.icon}{o.label}</span>
                {o.count !== undefined && <span className="tabular text-caption text-faint">{o.count}</span>}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
        {isMulti && selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <button
              type="button"
              onClick={() => (props.onChange as (v: string[]) => void)([])}
              className="flex h-7 w-full items-center rounded-sm px-2 text-small text-soft outline-none hover:bg-hover focus-visible:bg-hover"
            >
              Clear selection
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------- Steps ---------------- */

export type Step = { title: ReactNode; description?: ReactNode };

/** Progress through a multi-step flow. Horizontal from 640px, vertical below (or force `orientation`). */
export function Steps({
  steps,
  current,
  orientation,
  onStepClick,
  className,
}: {
  steps: Step[];
  /** Zero-based index of the active step. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /** Makes completed steps clickable. */
  onStepClick?: (index: number) => void;
  className?: string;
}) {
  const vertical = orientation === "vertical";
  return (
    <ol
      className={cn(
        "flex gap-3",
        vertical ? "flex-col" : "flex-col sm:flex-row sm:items-start sm:gap-0",
        className,
      )}
    >
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        const clickable = onStepClick && state === "done";
        const Marker = (
          <span
            className={cn(
              "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium tabular",
              state === "done" && "bg-primary text-primary-foreground",
              state === "current" && "bg-card text-foreground shadow-[0_0_0_1.5px_var(--foreground)]",
              state === "upcoming" && "bg-transparent text-subtle shadow-[inset_0_0_0_1px_var(--line-strong)]",
            )}
          >
            {state === "done" ? <IconCheck size={12} /> : i + 1}
          </span>
        );
        return (
          <li
            key={i}
            aria-current={state === "current" ? "step" : undefined}
            className={cn("flex min-w-0 gap-2.5", !vertical && "sm:flex-1 sm:items-start")}
          >
            <div className={cn("flex min-w-0 flex-1 gap-2.5", !vertical && "sm:items-center")}>
              {clickable ? (
                <button type="button" onClick={() => onStepClick!(i)} className="rounded-full outline-none focus-visible:shadow-focus" aria-label={`Go to step ${i + 1}`}>
                  {Marker}
                </button>
              ) : (
                Marker
              )}
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className={cn("truncate text-small", state === "upcoming" ? "text-subtle" : "text-foreground", state === "current" && "font-medium")}>{s.title}</span>
                {s.description && <span className={cn("text-caption text-subtle", !vertical && "sm:truncate")}>{s.description}</span>}
              </div>
              {!vertical && i < steps.length - 1 && (
                <span aria-hidden className={cn("mx-3 hidden h-px min-w-6 flex-1 sm:block", i < current ? "bg-foreground" : "bg-line-strong")} />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Button that looks like a filter but opens arbitrary content (e.g. "More filters"). */
export function FilterButton({ children, count, ...props }: React.ComponentProps<typeof Button> & { count?: number }) {
  return (
    <Button size="sm" variant="secondary" {...props}>
      {children}
      {count ? <span className="tabular -mr-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{count}</span> : null}
    </Button>
  );
}
