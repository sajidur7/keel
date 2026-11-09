/**
 * Form controls — dates and times. Plain Date objects, no date library.
 * Calendar · DateInput (DatePicker) · DateRangeInput (DateRangePicker) · DateTimeInput · TimeInput (TimePicker)
 */
import * as stylex from "@stylexjs/stylex";
import { Popover as P } from "radix-ui";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Button, IconButton } from "./action";
import { field, useField } from "./inputs";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconClock, IconSizeContext, IconX } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { lb } from "./select";

export const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(r.getFullYear(), r.getMonth(), Math.min(d.getDate(), new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()));
};
export type DateRange = { from: Date | null; to: Date | null };

const c = stylex.create({
  root: { display: "flex", flexDirection: { default: "column", "@media (min-width: 640px)": "row" }, gap: 20 },
  month: { width: 252 },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 28, marginBottom: 6 },
  title: { fontSize: font.md, fontWeight: font.semibold },
  spacer: { width: 28, height: 28 },
  grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 },
  wk: { display: "flex", alignItems: "center", justifyContent: "center", height: 28, fontSize: font.xs, color: color.fgFaint, fontWeight: font.medium },
  wkNum: { color: color.fgFaint, fontSize: "10px" },
  cell: { display: "flex", alignItems: "center", justifyContent: "center", height: 34 },
  mid: { backgroundColor: color.accentSoft },
  start: { backgroundImage: `linear-gradient(90deg, transparent 50%, ${color.accentSoft} 50%)` },
  end: { backgroundImage: `linear-gradient(90deg, ${color.accentSoft} 50%, transparent 50%)` },
  day: {
    position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: radius.md,
    fontSize: font.md, fontVariantNumeric: "tabular-nums", color: color.fg, outline: "none", cursor: "pointer",
    backgroundColor: { default: "transparent", ":hover": color.hover },
    transitionProperty: "background-color, box-shadow", transitionDuration: motion.fast,
    ":focus-visible": { boxShadow: depth.focus },
    ":disabled": { color: color.fgFaint, textDecorationLine: "line-through", cursor: "not-allowed", backgroundColor: "transparent" },
  },
  outside: { color: color.fgFaint },
  today: { fontWeight: font.bold, color: color.accent, "::after": { content: '""', position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: "50%", backgroundColor: "currentColor" } },
  sel: {
    color: color.onAccent, fontWeight: font.semibold,
    backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`, backgroundColor: { default: "transparent", ":hover": "transparent" },
    boxShadow: { default: depth.solid, ":focus-visible": `${depth.solid}, ${depth.focus}` },
  },
  pop: { display: "flex", gap: 12, padding: 12 },
  presets: { display: { default: "none", "@media (min-width: 640px)": "flex" }, flexDirection: "column", gap: 2, width: 132, paddingInlineEnd: 12, borderInlineEndWidth: 1, borderInlineEndStyle: "solid", borderInlineEndColor: color.border },
  preset: {
    height: 30, paddingInline: 8, borderRadius: radius.sm, textAlign: "start", fontSize: font.md, color: { default: color.fgSoft, ":hover": color.fg },
    backgroundColor: { default: "transparent", ":hover": color.hover }, outline: "none", ":focus-visible": { boxShadow: depth.focus },
  },
  presetOn: { backgroundColor: color.selected, color: color.fg, fontWeight: font.medium },
  col: { display: "flex", flexDirection: "column", gap: 8 },
  foot: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border },
  summary: { fontSize: font.sm, color: color.fgMuted },
  trigger: { cursor: "pointer", textAlign: "start", outline: "none" },
  val: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" },
  ph: { color: color.fgFaint },
  icon: { display: "inline-flex", color: color.icon },
  open: { boxShadow: `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
  times: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, padding: 6, maxHeight: 240, overflowY: "auto", width: 252 },
  time: {
    height: 30, borderRadius: radius.sm, fontSize: font.md, fontVariantNumeric: "tabular-nums", color: color.fgSoft, outline: "none",
    backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  timeOn: { color: color.onAccent, backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`, boxShadow: depth.solid },
  pair: { display: "flex", gap: 8, width: "100%" },
  inlineTime: { width: 116, flexShrink: 0 },
});

/* ============================================================== Calendar */

export type CalendarProps = StyleProps & {
  selected?: Date | null;
  onSelect?: (d: Date) => void;
  range?: DateRange;
  onRangeSelect?: (r: DateRange) => void;
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
  weekStartsOn?: 0 | 1;
  months?: 1 | 2;
  /** Show days of the previous/next month (dimmed). */
  outsideDays?: boolean;
  weekNumbers?: boolean;
  locale?: string;
};

/** A month grid. Arrows move by day/week, PageUp/PageDown by month, Home/End to the week's edges. */
export function Calendar({ selected, onSelect, range, onRangeSelect, min, max, isDisabled, weekStartsOn = 1, months = 1, outsideDays, weekNumbers, locale, ...p }: CalendarProps) {
  const initial = selected ?? range?.from ?? new Date();
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focus, setFocus] = useState<Date>(startOfDay(initial));
  const [hover, setHover] = useState<Date | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());
  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const dayFmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const fullFmt = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);
  const off = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || isDisabled?.(d) || false;
  const keyNav = useRef(false);
  useEffect(() => { if (!keyNav.current) return; keyNav.current = false; ref.current?.querySelector<HTMLButtonElement>(`[data-day="${focus.toDateString()}"]`)?.focus({ preventScroll: true }); }, [focus]);
  const moveFocus = (d: Date) => {
    setFocus(d);
    const last = addMonths(view, months - 1);
    if (d < view || d > new Date(last.getFullYear(), last.getMonth() + 1, 0)) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const pick = (d: Date) => {
    if (off(d)) return;
    if (onRangeSelect) {
      if (!range?.from || range.to) onRangeSelect({ from: d, to: null });
      else if (d < range.from) onRangeSelect({ from: d, to: range.from });
      else onRangeSelect({ from: range.from, to: d });
    } else onSelect?.(d);
  };
  const span = (() => { const a = range?.from; const b = range?.to ?? (range?.from && hover ? hover : null); if (!a || !b) return null; return a <= b ? [a, b] : [b, a]; })();
  const weekdays = Array.from({ length: 7 }, (_, i) => dayFmt.format(new Date(2024, 0, 1 + ((i + weekStartsOn + 6) % 7))).slice(0, 2));
  const weekNo = (d: Date) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7)); return Math.ceil(((t.getTime() - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7); };
  return (
    <IconSizeContext.Provider value={16}>
      <div ref={ref} {...sx(p, c.root)}>
        {Array.from({ length: months }, (_, m) => {
          const month = addMonths(view, m);
          const first = new Date(month.getFullYear(), month.getMonth(), 1);
          const offset = (first.getDay() - weekStartsOn + 7) % 7;
          const start = addDays(first, -offset);
          const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
          const cols = weekNumbers ? 8 : 7;
          return (
            <div key={m} {...px(c.month)} style={weekNumbers ? { width: 284 } : undefined}>
              <div {...px(c.head)}>
                {m === 0 ? <IconButton label="Previous month" size="sm" tooltip={false} onClick={() => setView(addMonths(view, -1))}><IconChevronLeft /></IconButton> : <span {...px(c.spacer)} />}
                <span aria-live="polite" {...px(c.title)}>{monthFmt.format(month)}</span>
                {m === months - 1 ? <IconButton label="Next month" size="sm" tooltip={false} onClick={() => setView(addMonths(view, 1))}><IconChevronRight /></IconButton> : <span {...px(c.spacer)} />}
              </div>
              <div role="grid" aria-label={monthFmt.format(month)} {...px(c.grid)} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }} onMouseLeave={() => setHover(null)}>
                {weekNumbers && <div {...px(c.wk)}>#</div>}
                {weekdays.map((w, i) => <div key={i} role="columnheader" {...px(c.wk)}>{w}</div>)}
                {days.map((d, i) => {
                  const outside = d.getMonth() !== month.getMonth();
                  const isSel = sameDay(d, selected) || sameDay(d, range?.from) || sameDay(d, range?.to);
                  const inSpan = span && d >= span[0] && d <= span[1];
                  const isStart = span && sameDay(d, span[0]) && !sameDay(span[0], span[1]);
                  const isEnd = span && sameDay(d, span[1]) && !sameDay(span[0], span[1]);
                  return [
                    weekNumbers && i % 7 === 0 ? <div key={`w${i}`} {...px(c.wk, c.wkNum)}>{weekNo(d)}</div> : null,
                    <div key={d.toISOString()} role="gridcell" aria-selected={isSel || undefined} {...px(c.cell, !outside && inSpan && !isStart && !isEnd && !isSel && c.mid, !outside && isStart && c.start, !outside && isEnd && c.end)}>
                      {outside && !outsideDays ? null : (
                        <button type="button" data-day={outside ? undefined : d.toDateString()} tabIndex={!outside && sameDay(d, focus) ? 0 : -1} disabled={off(d)}
                          aria-label={fullFmt.format(d)} aria-current={sameDay(d, today) ? "date" : undefined}
                          onMouseEnter={() => setHover(d)} onClick={() => { setFocus(d); pick(d); }}
                          onKeyDown={(e) => {
                            const map: Record<string, Date> = {
                              ArrowLeft: addDays(d, -1), ArrowRight: addDays(d, 1), ArrowUp: addDays(d, -7), ArrowDown: addDays(d, 7), PageUp: addMonths(d, -1), PageDown: addMonths(d, 1),
                              Home: addDays(d, -((d.getDay() - weekStartsOn + 7) % 7)), End: addDays(d, 6 - ((d.getDay() - weekStartsOn + 7) % 7)),
                            };
                            if (map[e.key]) { e.preventDefault(); keyNav.current = true; moveFocus(map[e.key]); }
                          }}
                          {...px(c.day, outside && c.outside, sameDay(d, today) && !isSel && c.today, isSel && c.sel)}>
                          {d.getDate()}
                        </button>
                      )}
                    </div>,
                  ];
                })}
              </div>
            </div>
          );
        })}
      </div>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== Triggers */

function Trigger({ id, invalid, describedBy, size = "md", open, icon, text, placeholder, onClear, disabled, xstyle, className, style }: StyleProps & {
  id?: string; invalid: boolean; describedBy?: string; size?: "sm" | "md" | "lg"; open: boolean; icon: ReactNode; text?: string; placeholder: string; onClear?: () => void; disabled?: boolean;
}) {
  return (
    <P.Trigger asChild disabled={disabled}>
      <button type="button" id={id} aria-invalid={invalid || undefined} aria-describedby={describedBy} aria-haspopup="dialog"
        {...sx({ xstyle, className, style }, field.shell, size !== "md" && field[size], c.trigger, open && c.open, invalid && field.invalid, disabled && field.disabled)}>
        <span {...px(c.icon)}>{icon}</span>
        <span {...px(c.val, !text && c.ph)}>{text ?? placeholder}</span>
        {onClear && text && <span role="button" tabIndex={-1} aria-label="Clear" onClick={(e) => { e.stopPropagation(); onClear(); }} {...px(field.clear)}><IconX size={12} /></span>}
      </button>
    </P.Trigger>
  );
}

const useFmt = (locale?: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) => useMemo(() => new Intl.DateTimeFormat(locale, opts), [locale]); // eslint-disable-line react-hooks/exhaustive-deps

/* ============================================================== DateInput */

export type DateInputProps = StyleProps & {
  value: Date | null;
  onValueChange: (d: Date | null) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  min?: Date;
  max?: Date;
  isDisabled?: (d: Date) => boolean;
  /** Shortcuts on the left of the calendar. */
  presets?: { label: string; date: Date }[];
  clearable?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  weekStartsOn?: 0 | 1;
  id?: string;
  locale?: string;
};

/** One date in a field that opens a calendar. */
export function DateInput({ value, onValueChange, placeholder = "Pick a date", size = "md", min, max, isDisabled, presets, clearable = true, invalid, disabled, weekStartsOn, id, locale, ...p }: DateInputProps) {
  const f = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const fmt = useFmt(locale);
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open} onOpenChange={setOpen}>
        <Trigger id={f.id} invalid={f.invalid} describedBy={f["aria-describedby"]} size={size} open={open} icon={<IconCalendar />} text={value ? fmt.format(value) : undefined} placeholder={placeholder} onClear={clearable ? () => onValueChange(null) : undefined} disabled={f.disabled} {...p} />
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} {...px(lb.pop, c.pop)}>
            {presets && <div {...px(c.presets)}>{presets.map((pr) => <button key={pr.label} type="button" onClick={() => { onValueChange(pr.date); setOpen(false); }} {...px(c.preset, sameDay(pr.date, value) && c.presetOn)}>{pr.label}</button>)}</div>}
            <div {...px(c.col)}>
              <Calendar selected={value} onSelect={(d) => { onValueChange(d); setOpen(false); }} min={min} max={max} isDisabled={isDisabled} weekStartsOn={weekStartsOn} locale={locale} />
              <div {...px(c.foot)}>
                <Button size="sm" variant="ghost" onClick={() => { onValueChange(null); setOpen(false); }}>Clear</Button>
                <Button size="sm" onClick={() => { onValueChange(startOfDay(new Date())); setOpen(false); }}>Today</Button>
              </div>
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}
/** v1 name (value/onChange). */
export const DatePicker = ({ onChange, ...p }: Omit<DateInputProps, "onValueChange"> & { onChange: (d: Date | null) => void }) => <DateInput onValueChange={onChange} {...p} />;

/* ============================================================== DateRangeInput */

export type DateRangeInputProps = StyleProps & {
  value: DateRange;
  onValueChange: (r: DateRange) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  min?: Date;
  max?: Date;
  presets?: { label: string; range: DateRange }[];
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  locale?: string;
};

const DEFAULT_PRESETS = (): { label: string; range: DateRange }[] => {
  const t = startOfDay(new Date());
  return [
    { label: "Today", range: { from: t, to: t } },
    { label: "Last 7 days", range: { from: addDays(t, -6), to: t } },
    { label: "Last 30 days", range: { from: addDays(t, -29), to: t } },
    { label: "This month", range: { from: new Date(t.getFullYear(), t.getMonth(), 1), to: t } },
    { label: "Last month", range: { from: new Date(t.getFullYear(), t.getMonth() - 1, 1), to: new Date(t.getFullYear(), t.getMonth(), 0) } },
    { label: "This year", range: { from: new Date(t.getFullYear(), 0, 1), to: t } },
  ];
};

/** A start and end date: two months side by side, with presets. Apply commits. */
export function DateRangeInput({ value, onValueChange, placeholder = "Pick dates", size = "md", min, max, presets = DEFAULT_PRESETS(), invalid, disabled, id, locale, ...p }: DateRangeInputProps) {
  const f = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);
  useEffect(() => { if (open) setDraft(value); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const fmt = useFmt(locale);
  const text = value.from ? `${fmt.format(value.from)} – ${value.to ? fmt.format(value.to) : "…"}` : undefined;
  const days = draft.from && draft.to ? Math.round((startOfDay(draft.to).getTime() - startOfDay(draft.from).getTime()) / 86400000) + 1 : 0;
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open} onOpenChange={setOpen}>
        <Trigger id={f.id} invalid={f.invalid} describedBy={f["aria-describedby"]} size={size} open={open} icon={<IconCalendar />} text={text} placeholder={placeholder} onClear={() => onValueChange({ from: null, to: null })} disabled={f.disabled} {...p} />
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} {...px(lb.pop, c.pop)}>
            <div {...px(c.presets)}>{presets.map((pr) => <button key={pr.label} type="button" onClick={() => setDraft(pr.range)} {...px(c.preset, sameDay(pr.range.from, draft.from) && sameDay(pr.range.to, draft.to) && c.presetOn)}>{pr.label}</button>)}</div>
            <div {...px(c.col)}>
              <Calendar range={draft} onRangeSelect={setDraft} months={2} min={min} max={max} locale={locale} />
              <div {...px(c.foot)}>
                <span {...px(c.summary)}>{days ? `${days} day${days > 1 ? "s" : ""}` : "Pick a start and end date"}</span>
                <span style={{ display: "flex", gap: 8 }}>
                  <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button size="sm" variant="primary" disabled={!draft.from || !draft.to} onClick={() => { onValueChange(draft); setOpen(false); }}>Apply</Button>
                </span>
              </div>
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}
/** v1 name. */
export const DateRangePicker = ({ onChange, ...p }: Omit<DateRangeInputProps, "onValueChange"> & { onChange: (r: DateRange) => void }) => <DateRangeInput onValueChange={onChange} {...p} />;

/* ============================================================== TimeInput */

const pad = (n: number) => String(n).padStart(2, "0");
export type TimeValue = { h: number; m: number } | null;

export type TimeInputProps = StyleProps & {
  value: TimeValue;
  onValueChange: (t: TimeValue) => void;
  /** Minutes between options. */
  step?: 5 | 10 | 15 | 30 | 60;
  hourFormat?: 12 | 24;
  min?: string;
  max?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
};

/** A time of day from a grid of slots. */
export function TimeInput({ value, onValueChange, step = 30, hourFormat = 24, min = "00:00", max = "23:59", placeholder = "Pick a time", size = "md", invalid, disabled, id, ...p }: TimeInputProps) {
  const f = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const fmt = (t: { h: number; m: number }) => hourFormat === 24 ? `${pad(t.h)}:${pad(t.m)}` : `${((t.h + 11) % 12) + 1}:${pad(t.m)} ${t.h < 12 ? "AM" : "PM"}`;
  const toMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const slots = Array.from({ length: Math.floor(1440 / step) }, (_, i) => i * step).filter((x) => x >= toMin(min) && x <= toMin(max)).map((x) => ({ h: Math.floor(x / 60), m: x % 60 }));
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) setTimeout(() => listRef.current?.querySelector("[data-on=true]")?.scrollIntoView({ block: "center" }), 0); }, [open]);
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open} onOpenChange={setOpen}>
        <Trigger id={f.id} invalid={f.invalid} describedBy={f["aria-describedby"]} size={size} open={open} icon={<IconClock />} text={value ? fmt(value) : undefined} placeholder={placeholder} disabled={f.disabled} {...p} />
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} {...px(lb.pop)}>
            <div ref={listRef} role="listbox" aria-label="Times" {...px(c.times)}>
              {slots.map((t) => { const on = value?.h === t.h && value?.m === t.m; return <button key={`${t.h}:${t.m}`} type="button" role="option" aria-selected={on} data-on={on} onClick={() => { onValueChange(t); setOpen(false); }} {...px(c.time, on && c.timeOn)}>{fmt(t)}</button>; })}
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}
/** v1 name. */
export const TimePicker = TimeInput;

/* ============================================================== DateTimeInput */

/** A date and a time side by side; `value` is one Date. */
export function DateTimeInput({ value, onValueChange, step = 15, hourFormat = 24, size = "md", min, max, invalid, disabled, id, ...p }: StyleProps & {
  value: Date | null; onValueChange: (d: Date | null) => void; step?: TimeInputProps["step"]; hourFormat?: 12 | 24; size?: "sm" | "md" | "lg"; min?: Date; max?: Date; invalid?: boolean; disabled?: boolean; id?: string;
}) {
  const time: TimeValue = value ? { h: value.getHours(), m: value.getMinutes() } : null;
  const setDate = (d: Date | null) => { if (!d) return onValueChange(null); const n = new Date(d); n.setHours(time?.h ?? 9, time?.m ?? 0, 0, 0); onValueChange(n); };
  const setTime = (t: TimeValue) => { if (!t) return; const n = new Date(value ?? startOfDay(new Date())); n.setHours(t.h, t.m, 0, 0); onValueChange(n); };
  return (
    <div {...sx(p, c.pair)}>
      <DateInput value={value} onValueChange={setDate} size={size} min={min} max={max} invalid={invalid} disabled={disabled} id={id} clearable={false} />
      <TimeInput value={time} onValueChange={setTime} step={step} hourFormat={hourFormat} size={size} invalid={invalid} disabled={disabled} xstyle={c.inlineTime} placeholder="Time" />
    </div>
  );
}
