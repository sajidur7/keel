import { Popover as P } from "radix-ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./button";
import { useField } from "./field";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconClock } from "./icons";
import { fieldShell } from "./input";
import { cn } from "../lib/cn";

/*
  Calendar + DatePicker + DateRangePicker + TimePicker, written from scratch on plain Date
  objects (no date library). Weeks start on Monday by default; pass weekStartsOn={0} for Sunday.
  The grid is an ARIA grid: arrows move by day/week, PageUp/PageDown by month, Home/End to week edges.
*/

const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(r.getFullYear(), r.getMonth(), Math.min(d.getDate(), new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()));
};

export type DateRange = { from: Date | null; to: Date | null };

type CalendarProps = {
  /** Single date mode */
  selected?: Date | null;
  onSelect?: (d: Date) => void;
  /** Range mode */
  range?: DateRange;
  onRangeSelect?: (r: DateRange) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
  weekStartsOn?: 0 | 1;
  /** Months shown side by side (2 for ranges on desktop). */
  months?: 1 | 2;
  locale?: string;
  className?: string;
};

export function Calendar({
  selected, onSelect, range, onRangeSelect, min, max, isDisabled, weekStartsOn = 1, months = 1, locale, className,
}: CalendarProps) {
  const initial = selected ?? range?.from ?? new Date();
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focus, setFocus] = useState<Date>(startOfDay(initial));
  const [hover, setHover] = useState<Date | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());

  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const dayFmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "narrow" }), [locale]);
  const fullFmt = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);

  const disabled = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || isDisabled?.(d) || false;

  const moveFocus = (d: Date) => {
    setFocus(d);
    const last = addMonths(view, months - 1);
    if (d < view || d > new Date(last.getFullYear(), last.getMonth() + 1, 0)) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const keyNav = useRef(false);
  useEffect(() => {
    // Only move DOM focus after keyboard navigation, never on render.
    if (!keyNav.current) return;
    keyNav.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focus.toDateString()}"]`)?.focus({ preventScroll: true });
  }, [focus]);

  const pick = (d: Date) => {
    if (disabled(d)) return;
    if (onRangeSelect) {
      if (!range?.from || (range.from && range.to)) onRangeSelect({ from: d, to: null });
      else if (d < range.from) onRangeSelect({ from: d, to: range.from });
      else onRangeSelect({ from: range.from, to: d });
    } else onSelect?.(d);
  };

  const inRange = (d: Date) => {
    const from = range?.from;
    const to = range?.to ?? (range?.from && hover ? hover : null);
    if (!from || !to) return false;
    const [a, b] = from <= to ? [from, to] : [to, from];
    return d >= a && d <= b;
  };

  const weekdays = Array.from({ length: 7 }, (_, i) => dayFmt.format(new Date(2024, 0, 1 + ((i + weekStartsOn + 6) % 7))));

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:gap-5", className)} ref={gridRef}>
      {Array.from({ length: months }, (_, m) => {
        const month = addMonths(view, m);
        const first = new Date(month.getFullYear(), month.getMonth(), 1);
        const offset = (first.getDay() - weekStartsOn + 7) % 7;
        const start = addDays(first, -offset);
        const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
        return (
          <div key={m} className="w-[252px]">
            <div className="mb-2 flex h-7 items-center justify-between">
              {m === 0 ? (
                <Button variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => setView(addMonths(view, -1))}>
                  <IconChevronLeft />
                </Button>
              ) : <span className="size-[26px]" />}
              <span className="text-small font-medium" aria-live="polite">{monthFmt.format(month)}</span>
              {m === months - 1 ? (
                <Button variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => setView(addMonths(view, 1))}>
                  <IconChevronRight />
                </Button>
              ) : <span className="size-[26px]" />}
            </div>
            <div role="grid" aria-label={monthFmt.format(month)} className="grid grid-cols-7 gap-y-0.5" onMouseLeave={() => setHover(null)}>
              {weekdays.map((w, i) => (
                <div key={i} role="columnheader" className="flex h-7 items-center justify-center text-[11px] text-faint">{w}</div>
              ))}
              {days.map((d) => {
                const outside = d.getMonth() !== month.getMonth();
                const isSel = sameDay(d, selected) || sameDay(d, range?.from) || sameDay(d, range?.to);
                const mid = inRange(d) && !isSel;
                const off = disabled(d);
                return (
                  <div key={d.toISOString()} role="gridcell" aria-selected={isSel || undefined} className={cn("flex h-8 items-center justify-center", mid && "bg-selected", sameDay(d, range?.from) && range?.to && "rounded-l-md bg-selected", sameDay(d, range?.to) && "rounded-r-md bg-selected")}>
                    {outside ? null : (
                      <button
                        type="button"
                        data-day={d.toDateString()}
                        tabIndex={sameDay(d, focus) ? 0 : -1}
                        disabled={off}
                        aria-label={fullFmt.format(d)}
                        aria-current={sameDay(d, today) ? "date" : undefined}
                        onMouseEnter={() => setHover(d)}
                        onClick={() => { setFocus(d); pick(d); }}
                        onKeyDown={(e) => {
                          const map: Record<string, Date> = {
                            ArrowLeft: addDays(d, -1), ArrowRight: addDays(d, 1), ArrowUp: addDays(d, -7), ArrowDown: addDays(d, 7),
                            PageUp: addMonths(d, -1), PageDown: addMonths(d, 1),
                            Home: addDays(d, -((d.getDay() - weekStartsOn + 7) % 7)), End: addDays(d, 6 - ((d.getDay() - weekStartsOn + 7) % 7)),
                          };
                          if (map[e.key]) { e.preventDefault(); keyNav.current = true; moveFocus(map[e.key]); }
                        }}
                        className={cn(
                          "tabular relative inline-flex size-8 items-center justify-center rounded-md text-small outline-none",
                          "transition-colors duration-fast hover:bg-hover focus-visible:shadow-focus disabled:pointer-events-none disabled:text-faint disabled:line-through",
                          sameDay(d, today) && !isSel && "font-semibold after:absolute after:bottom-1 after:h-0.5 after:w-0.5 after:rounded-full after:bg-current",
                          isSel && "bg-primary text-primary-foreground hover:bg-primary-hover",
                        )}
                      >
                        {d.getDate()}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- DatePicker ---------------- */

function useFormat(locale?: string) {
  return useMemo(() => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }), [locale]);
}

const triggerCls = (size: "sm" | "md" | "lg", invalid: boolean, extra?: string) =>
  cn(fieldShell({ size, invalid }), "cursor-pointer text-left outline-none focus-visible:shadow-focus! disabled:opacity-50", extra);

export function DatePicker({
  value, onChange, placeholder = "Pick a date", size = "md", min, max, isDisabled, presets, invalid, disabled, id, locale, className,
}: {
  value: Date | null;
  onChange: (d: Date | null) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
  presets?: { label: string; date: Date }[];
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  locale?: string;
  className?: string;
}) {
  const field = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const fmt = useFormat(locale);
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger asChild disabled={field.disabled}>
        <button type="button" id={field.id} aria-invalid={field.invalid || undefined} aria-describedby={field["aria-describedby"]} className={triggerCls(size, field.invalid, className)} aria-haspopup="dialog">
          <IconCalendar />
          <span className={cn("flex-1 truncate tabular", !value && "text-faint")}>{value ? fmt.format(value) : placeholder}</span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={6} collisionPadding={8} className="z-(--z-popover) flex gap-3 rounded-lg bg-popover p-3 shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]" aria-label="Choose date">
          {presets && (
            <div className="hidden w-28 flex-col gap-0.5 border-r border-border pr-3 sm:flex">
              {presets.map((p) => (
                <button key={p.label} type="button" onClick={() => { onChange(p.date); setOpen(false); }} className="h-7 rounded-sm px-2 text-left text-small text-soft outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus">
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Calendar selected={value} onSelect={(d) => { onChange(d); setOpen(false); }} min={min} max={max} isDisabled={isDisabled} locale={locale} />
            <div className="flex justify-between border-t border-border pt-2">
              <Button size="sm" variant="ghost" onClick={() => { onChange(null); setOpen(false); }}>Clear</Button>
              <Button size="sm" variant="ghost" onClick={() => { onChange(startOfDay(new Date())); setOpen(false); }}>Today</Button>
            </div>
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

export function DateRangePicker({
  value, onChange, placeholder = "Pick a range", size = "md", presets, invalid, disabled, id, locale, className,
}: {
  value: DateRange;
  onChange: (r: DateRange) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  presets?: { label: string; range: DateRange }[];
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  locale?: string;
  className?: string;
}) {
  const field = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);
  const fmt = useFormat(locale);
  const label = value.from ? `${fmt.format(value.from)} – ${value.to ? fmt.format(value.to) : "…"}` : placeholder;
  return (
    <P.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) setDraft(value); }}>
      <P.Trigger asChild disabled={field.disabled}>
        <button type="button" id={field.id} aria-invalid={field.invalid || undefined} className={triggerCls(size, field.invalid, className)} aria-haspopup="dialog">
          <IconCalendar />
          <span className={cn("flex-1 truncate tabular", !value.from && "text-faint")}>{label}</span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={6} collisionPadding={8} className="z-(--z-popover) flex max-w-[calc(100vw-16px)] gap-3 rounded-lg bg-popover p-3 shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]" aria-label="Choose date range">
          {presets && (
            <div className="hidden w-32 flex-col gap-0.5 border-r border-border pr-3 md:flex">
              {presets.map((p) => (
                <button key={p.label} type="button" onClick={() => { onChange(p.range); setOpen(false); }} className="h-7 rounded-sm px-2 text-left text-small text-soft outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus">
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Calendar range={draft} onRangeSelect={setDraft} months={2} locale={locale} className="[&>div:nth-child(2)]:hidden md:[&>div:nth-child(2)]:block" />
            <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
              <span className="tabular truncate text-caption text-subtle">
                {draft.from ? `${fmt.format(draft.from)} – ${draft.to ? fmt.format(draft.to) : "pick end"}` : "Pick a start date"}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button size="sm" variant="primary" disabled={!draft.from || !draft.to} onClick={() => { onChange(draft); setOpen(false); }}>Apply</Button>
              </div>
            </div>
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ---------------- TimePicker ---------------- */

/** Time of day as "HH:mm" (24h). Shows a scrollable list in `step`-minute increments; typing works too. */
export function TimePicker({
  value, onChange, step = 15, size = "md", hour12 = false, placeholder = "Select time", invalid, disabled, id, className,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  step?: 5 | 10 | 15 | 30 | 60;
  size?: "sm" | "md" | "lg";
  hour12?: boolean;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}) {
  const field = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const times = useMemo(() => {
    const out: string[] = [];
    for (let m = 0; m < 24 * 60; m += step) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    return out;
  }, [step]);
  const show = (t: string) => {
    if (!hour12) return t;
    const [h, m] = t.split(":").map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  };
  useEffect(() => {
    if (open) requestAnimationFrame(() => listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "center" }));
  }, [open]);
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger asChild disabled={field.disabled}>
        <button type="button" id={field.id} aria-invalid={field.invalid || undefined} className={triggerCls(size, field.invalid, className)} aria-haspopup="listbox">
          <IconClock />
          <span className={cn("flex-1 truncate tabular", !value && "text-faint")}>{value ? show(value) : placeholder}</span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={6} collisionPadding={8} className="z-(--z-popover) w-(--radix-popover-trigger-width) min-w-36 rounded-lg bg-popover p-1 shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]">
          <div ref={listRef} role="listbox" aria-label="Time" className="max-h-60 overflow-y-auto">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                role="option"
                aria-selected={t === value}
                onClick={() => { onChange(t); setOpen(false); }}
                className={cn("tabular flex h-7 w-full items-center rounded-sm px-2 text-left text-small outline-none hover:bg-hover focus-visible:bg-hover", t === value && "bg-selected font-medium")}
              >
                {show(t)}
              </button>
            ))}
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
