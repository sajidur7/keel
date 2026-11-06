import { Popover as P, RadioGroup as RG } from "radix-ui";
import { useMemo, useRef, useState } from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { useField } from "./field";
import { IconArrowLeft, IconArrowRight, IconCheck, IconChevronDown, IconChevronRight, IconSearch, IconStar } from "./icons";
import { fieldShell } from "./input";
import { cn } from "../lib/cn";

/* ===================== Transfer ===================== */

export type TransferItem = { key: string; label: string; description?: string; disabled?: boolean };

/**
 * Two lists — available and chosen — with search and move buttons. Use for assigning
 * permissions, columns, members to a group. For < 10 items a multi-select Combobox is lighter.
 */
export function Transfer({
  items,
  value,
  onChange,
  titles = ["Available", "Selected"],
  searchable = true,
  height = 260,
  className,
}: {
  items: TransferItem[];
  /** Keys on the right side. */
  value: string[];
  onChange: (keys: string[]) => void;
  titles?: [string, string];
  searchable?: boolean;
  height?: number;
  className?: string;
}) {
  const [checkedL, setCheckedL] = useState<Set<string>>(new Set());
  const [checkedR, setCheckedR] = useState<Set<string>>(new Set());
  const [qL, setQL] = useState("");
  const [qR, setQR] = useState("");
  const right = new Set(value);
  const left = items.filter((i) => !right.has(i.key));
  const chosen = items.filter((i) => right.has(i.key));

  const Pane = ({ title, list, checked, setChecked, q, setQ }: {
    title: string; list: TransferItem[]; checked: Set<string>; setChecked: (s: Set<string>) => void; q: string; setQ: (v: string) => void;
  }) => {
    const shown = list.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
    const enabled = shown.filter((i) => !i.disabled);
    const all = enabled.length > 0 && enabled.every((i) => checked.has(i.key));
    const some = enabled.some((i) => checked.has(i.key));
    return (
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg shadow-card">
        <div className="flex h-9 items-center gap-2 border-b border-border px-3">
          <Checkbox aria-label={`Select all ${title}`} checked={all ? true : some ? "indeterminate" : false} disabled={!enabled.length}
            onCheckedChange={() => { const n = new Set(checked); enabled.forEach((i) => (all ? n.delete(i.key) : n.add(i.key))); setChecked(n); }} />
          <span className="flex-1 truncate text-small font-medium">{title}</span>
          <span className="tabular text-caption text-subtle">{checked.size ? `${checked.size}/` : ""}{list.length}</span>
        </div>
        {searchable && (
          <div className="flex h-8 items-center gap-2 border-b border-border px-3">
            <IconSearch size={14} className="text-icon" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label={`Search ${title}`} className="h-full min-w-0 flex-1 bg-transparent text-small outline-none placeholder:text-faint" />
          </div>
        )}
        <ul className="shrink-0 overflow-y-auto p-1" style={{ height }} aria-label={title}>
          {shown.length === 0 && <li className="px-2 py-8 text-center text-caption text-subtle">{q ? "No matches" : "Nothing here"}</li>}
          {shown.map((i) => (
            <li key={i.key}>
              <label className={cn("flex min-h-7 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-hover", i.disabled && "cursor-not-allowed opacity-45")}>
                <Checkbox checked={checked.has(i.key)} disabled={i.disabled} onCheckedChange={() => { const n = new Set(checked); if (n.has(i.key)) n.delete(i.key); else n.add(i.key); setChecked(n); }} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-small">{i.label}</span>
                  {i.description && <span className="truncate text-caption text-subtle">{i.description}</span>}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col items-stretch gap-3 md:flex-row", className)}>
      {Pane({ title: titles[0], list: left, checked: checkedL, setChecked: setCheckedL, q: qL, setQ: setQL })}
      <div className="flex justify-center gap-2 md:flex-col md:self-center">
        <Button size="icon-sm" aria-label={`Move to ${titles[1]}`} disabled={!checkedL.size} onClick={() => { onChange([...value, ...checkedL]); setCheckedL(new Set()); }}>
          <IconArrowRight className="max-md:rotate-90" />
        </Button>
        <Button size="icon-sm" aria-label={`Move to ${titles[0]}`} disabled={!checkedR.size} onClick={() => { onChange(value.filter((k) => !checkedR.has(k))); setCheckedR(new Set()); }}>
          <IconArrowLeft className="max-md:rotate-90" />
        </Button>
      </div>
      {Pane({ title: titles[1], list: chosen, checked: checkedR, setChecked: setCheckedR, q: qR, setQ: setQR })}
    </div>
  );
}

/* ===================== Cascader ===================== */

export type CascaderOption = { value: string; label: string; children?: CascaderOption[]; disabled?: boolean };

/** Picks a path through nested options (Region → Country → City, Category → Sub-category). */
export function Cascader({
  options,
  value,
  onChange,
  placeholder = "Select",
  separator = " / ",
  size = "md",
  invalid,
  disabled,
  id,
  className,
}: {
  options: CascaderOption[];
  value: string[];
  onChange: (path: string[]) => void;
  placeholder?: string;
  separator?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}) {
  const field = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string[]>(value);
  const columns = useMemo(() => {
    const cols: CascaderOption[][] = [options];
    let level = options;
    for (const v of path) {
      const hit = level.find((o) => o.value === v);
      if (!hit?.children) break;
      cols.push(hit.children);
      level = hit.children;
    }
    return cols;
  }, [options, path]);
  const labels = (() => {
    const out: string[] = [];
    let level = options;
    for (const v of value) { const h = level.find((o) => o.value === v); if (!h) break; out.push(h.label); level = h.children ?? []; }
    return out;
  })();

  return (
    <P.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) setPath(value); }}>
      <P.Trigger asChild disabled={field.disabled}>
        <button type="button" id={field.id} aria-invalid={field.invalid || undefined} aria-haspopup="dialog"
          className={cn(fieldShell({ size, invalid: field.invalid }), "cursor-pointer justify-between text-left outline-none focus-visible:shadow-focus! disabled:opacity-50", className)}>
          <span className={cn("truncate", !labels.length && "text-faint")}>{labels.length ? labels.join(separator) : placeholder}</span>
          <IconChevronDown size={14} />
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={6} collisionPadding={8}
          className="z-(--z-popover) flex max-w-[calc(100vw-16px)] overflow-x-auto rounded-lg bg-popover text-small shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]">
          {columns.map((col, depth) => (
            <ul key={depth} role="listbox" className="max-h-64 w-44 shrink-0 overflow-y-auto border-r border-border p-1 last:border-r-0">
              {col.map((o) => {
                const on = path[depth] === o.value;
                return (
                  <li key={o.value}>
                    <button type="button" disabled={o.disabled} role="option" aria-selected={on}
                      onClick={() => {
                        const next = [...path.slice(0, depth), o.value];
                        setPath(next);
                        if (!o.children?.length) { onChange(next); setOpen(false); }
                      }}
                      className={cn("flex h-7 w-full items-center gap-2 rounded-sm px-2 text-left outline-none hover:bg-hover focus-visible:bg-hover disabled:opacity-45", on && "bg-selected font-medium")}>
                      <span className="min-w-0 flex-1 truncate">{o.label}</span>
                      {o.children?.length ? <IconChevronRight size={12} className="text-faint" /> : on ? <IconCheck size={14} /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ))}
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ===================== Color picker ===================== */

const PRESETS = ["#111214", "#6f727b", "#3ec8b4", "#5fcf98", "#6aa8f0", "#7c6cf0", "#f0b44c", "#f2706b", "#e06aa8", "#ffffff"];

/**
 * Hex color field with presets and the system picker. For brand color, label color and
 * chart settings. Validates #RRGGBB.
 */
export function ColorPicker({
  value,
  onChange,
  presets = PRESETS,
  size = "md",
  disabled,
  id,
  className,
}: {
  value: string;
  onChange: (hex: string) => void;
  presets?: string[];
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  id?: string;
  className?: string;
}) {
  const field = useField({ id, disabled });
  const [draft, setDraft] = useState(value);
  const nativeRef = useRef<HTMLInputElement>(null);
  const valid = /^#[0-9a-f]{6}$/i.test(draft);
  return (
    <P.Root onOpenChange={(o) => o && setDraft(value)}>
      <P.Trigger asChild disabled={field.disabled}>
        <button type="button" id={field.id} aria-describedby={field["aria-describedby"]} className={cn(fieldShell({ size }), "w-auto min-w-36 cursor-pointer text-left outline-none focus-visible:shadow-focus! disabled:opacity-50", className)}>
          <span className="size-4 shrink-0 rounded-xs shadow-[inset_0_0_0_1px_rgba(128,128,128,0.35)]" style={{ background: value }} />
          <span className="font-mono text-caption uppercase">{value}</span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={6} collisionPadding={8} className="z-(--z-popover) flex w-56 flex-col gap-3 rounded-lg bg-popover p-3 shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]">
          <div className="grid grid-cols-5 gap-1.5" role="listbox" aria-label="Preset colors">
            {presets.map((c) => (
              <button key={c} type="button" role="option" aria-selected={c.toLowerCase() === value.toLowerCase()} aria-label={c}
                onClick={() => { onChange(c); setDraft(c); }}
                className={cn("relative h-7 rounded-sm outline-none shadow-[inset_0_0_0_1px_rgba(128,128,128,0.35)] focus-visible:shadow-focus", c.toLowerCase() === value.toLowerCase() && "ring-2 ring-foreground ring-offset-2 ring-offset-popover")}
                style={{ background: c }} />
            ))}
          </div>
          <div className="flex gap-2">
            <div className={cn(fieldShell({ size: "sm", invalid: !valid }), "flex-1")}>
              <span className="text-faint">#</span>
              <input aria-label="Hex color" value={draft.replace("#", "")} maxLength={6}
                onChange={(e) => { const v = "#" + e.target.value.replace(/[^0-9a-f]/gi, ""); setDraft(v); if (/^#[0-9a-f]{6}$/i.test(v)) onChange(v.toLowerCase()); }}
                className="h-full min-w-0 flex-1 bg-transparent font-mono text-caption uppercase outline-none" />
            </div>
            <Button size="sm" variant="secondary" onClick={() => nativeRef.current?.click()}>Custom</Button>
            <input ref={nativeRef} type="color" className="sr-only" tabIndex={-1} value={valid ? draft : value} onChange={(e) => { setDraft(e.target.value); onChange(e.target.value); }} />
          </div>
          {!valid && <p className="text-caption text-danger">Enter 6 hex digits, like 3EC8B4</p>}
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ===================== Rating ===================== */

/** Star rating as a radio group (keyboard: arrows). `readOnly` for display. */
export function Rating({
  value,
  onChange,
  max = 5,
  readOnly,
  size = 16,
  label = "Rating",
  className,
}: {
  value: number;
  onChange?: (v: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: 14 | 16 | 20;
  label?: string;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  if (readOnly) {
    return (
      <span role="img" aria-label={`${label}: ${value} of ${max}`} className={cn("inline-flex items-center gap-0.5", className)}>
        {stars.map((s) => <IconStar key={s} size={size} className={s <= value ? "fill-warning text-warning" : "text-line-strong"} />)}
      </span>
    );
  }
  return (
    <RG.Root aria-label={label} value={String(value)} onValueChange={(v) => onChange?.(Number(v))} orientation="horizontal"
      className={cn("inline-flex items-center gap-0.5", className)} onMouseLeave={() => setHover(null)}>
      {stars.map((s) => (
        <RG.Item key={s} value={String(s)} aria-label={`${s} of ${max}`} onMouseEnter={() => setHover(s)}
          className="rounded-xs outline-none transition-transform duration-fast hover:scale-110 focus-visible:shadow-focus">
          <IconStar size={size} className={cn("transition-colors duration-fast", s <= shown ? "fill-warning text-warning" : "text-line-strong")} />
        </RG.Item>
      ))}
    </RG.Root>
  );
}

/* ===================== OTP input ===================== */

/** One-time code input (2FA, email verification). Paste fills all boxes; Backspace moves back. */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  invalid,
  disabled,
  autoFocus,
  className,
  "aria-label": ariaLabel = "Verification code",
}: {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (next: string) => {
    const v = next.replace(/\D/g, "").slice(0, length);
    onChange(v);
    if (v.length === length) onComplete?.(v);
    return v;
  };
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex w-full items-center gap-1.5 sm:gap-2", className)}
      style={{ maxWidth: length * 40 + (length - 1) * 8 + (length === 6 ? 8 : 0) }}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            if (!d) return;
            const v = set(value.slice(0, i) + d + value.slice(i + 1));
            refs.current[Math.min(v.length, length - 1)]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") { e.preventDefault(); set(value.slice(0, i) + value.slice(i + 1)); refs.current[Math.max(0, i - 1)]?.focus(); }
            if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => { e.preventDefault(); const v = set(e.clipboardData.getData("text")); refs.current[Math.min(v.length, length - 1)]?.focus(); }}
          onFocus={(e) => e.target.select()}
          className={cn(
            "tabular h-10 min-w-0 flex-1 rounded-md bg-card text-center font-mono text-title text-foreground shadow-field outline-none",
            "transition-[box-shadow] duration-fast hover:shadow-[0_0_0_1px_var(--line-strong)] focus:shadow-focus! disabled:opacity-50",
            invalid && "shadow-[0_0_0_1px_var(--danger)]!",
            i === Math.floor(length / 2) - 1 && length === 6 && "mr-1 sm:mr-2",
          )}
        />
      ))}
    </div>
  );
}

