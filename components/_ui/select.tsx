import { Popover as P, Select as S, Slider as SL } from "radix-ui";
import { useId, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useField } from "./field";
import { IconCheck, IconChevronDown, IconSearch } from "./icons";
import { fieldShell } from "./input";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";
import { Tag } from "./tag";

/* ===================== Select ===================== */

export type SelectOption = { value: string; label: string; description?: string; icon?: ReactNode; disabled?: boolean };

export type SelectProps = {
  options?: SelectOption[];
  /** Grouped options; use instead of `options`. */
  groups?: { label: string; options: SelectOption[] }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

/** Pick one value from a short, known list (≤ ~12). For longer or searchable lists use Combobox. */
export function Select({
  options = [], groups, value, defaultValue, onValueChange, placeholder = "Select", size = "md",
  invalid, disabled, readOnly, id, className, ...rest
}: SelectProps) {
  const field = useField({ id, invalid, disabled, readOnly });
  const all = groups ? groups.flatMap((g) => g.options) : options;
  return (
    <S.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={field.disabled || field.readOnly}>
      <S.Trigger
        id={field.id}
        aria-invalid={field.invalid || undefined}
        aria-describedby={field["aria-describedby"]}
        aria-label={rest["aria-label"]}
        className={cn(
          fieldShell({ size, invalid: field.invalid, readOnly: field.readOnly }),
          "cursor-pointer justify-between text-left outline-none focus-visible:shadow-focus! data-placeholder:text-faint data-[state=open]:shadow-[0_0_0_1px_var(--line-strong)]",
          field.readOnly && "cursor-default disabled:opacity-100",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <S.Value placeholder={placeholder} />
        </span>
        {!field.readOnly && (
          <S.Icon asChild>
            <IconChevronDown size={14} />
          </S.Icon>
        )}
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            "z-(--z-dropdown) max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg bg-popover text-small shadow-overlay",
            "data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]",
          )}
        >
          <S.Viewport className="p-1">
            {groups
              ? groups.map((g, i) => (
                  <S.Group key={g.label}>
                    {i > 0 && <S.Separator className="-mx-1 my-1 h-px bg-border" />}
                    <S.Label className="eyebrow px-2 pt-2 pb-1.5">{g.label}</S.Label>
                    {g.options.map((o) => <SelectItem key={o.value} option={o} />)}
                  </S.Group>
                ))
              : all.map((o) => <SelectItem key={o.value} option={o} />)}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}

function SelectItem({ option }: { option: SelectOption }) {
  return (
    <S.Item
      value={option.value}
      disabled={option.disabled}
      className={cn(
        "relative flex min-h-7 cursor-default items-center gap-2 rounded-sm py-1 pr-7 pl-2 outline-none select-none",
        "data-highlighted:bg-hover data-disabled:opacity-45 [&_svg]:size-3.5 [&_svg]:text-icon",
      )}
    >
      {option.icon}
      <div className="flex min-w-0 flex-col">
        <S.ItemText>{option.label}</S.ItemText>
        {option.description && <span className="text-caption text-subtle">{option.description}</span>}
      </div>
      <S.ItemIndicator className="absolute right-2 inline-flex">
        <IconCheck />
      </S.ItemIndicator>
    </S.Item>
  );
}

/* ===================== Combobox (single + multi) ===================== */

type ComboBase = {
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Offer "Create '…'" when nothing matches. */
  onCreate?: (label: string) => void;
  id?: string;
  className?: string;
  "aria-label"?: string;
};
export type ComboboxProps =
  | (ComboBase & { multiple?: false; value: string | null; onValueChange: (v: string | null) => void })
  | (ComboBase & { multiple: true; value: string[]; onValueChange: (v: string[]) => void; maxTags?: number });

/**
 * Searchable select. With `multiple`, selected values show as removable tags inside the field.
 * Keyboard: type to filter, ↑/↓ to move, Enter to toggle, Backspace on empty search removes the last tag.
 */
export function Combobox(props: ComboboxProps) {
  const {
    options, placeholder = "Select", searchPlaceholder = "Search", emptyLabel = "No matches", size = "md",
    invalid, disabled, loading, onCreate, id, className,
  } = props;
  const field = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = props.multiple ? props.value : props.value ? [props.value] : [];
  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase().trim())),
    [options, q],
  );
  const canCreate = onCreate && q.trim() && !options.some((o) => o.label.toLowerCase() === q.trim().toLowerCase());
  const count = filtered.length + (canCreate ? 1 : 0);

  const toggle = (v: string) => {
    if (props.multiple) {
      const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
      props.onValueChange(next);
      setQ("");
      inputRef.current?.focus();
    } else {
      props.onValueChange(v === props.value ? null : v);
      setOpen(false);
      setQ("");
    }
  };
  const label = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const maxTags = props.multiple ? (props.maxTags ?? 3) : 0;

  return (
    <P.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
      {/* A div (not a button) so the tags' remove buttons inside it are valid HTML. */}
      <P.Trigger asChild disabled={field.disabled}>
        <div
          id={field.id}
          role="combobox"
          tabIndex={field.disabled ? -1 : 0}
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-disabled={field.disabled || undefined}
          aria-invalid={field.invalid || undefined}
          aria-describedby={field["aria-describedby"]}
          aria-label={props["aria-label"]}
          onKeyDown={(e) => {
            if (["Enter", " ", "ArrowDown"].includes(e.key)) { e.preventDefault(); setOpen(true); }
          }}
          className={cn(
            fieldShell({ size, invalid: field.invalid }),
            "cursor-pointer justify-between text-left outline-none focus-visible:shadow-focus!",
            field.disabled && "pointer-events-none opacity-50",
            props.multiple && selected.length > 0 && "h-auto min-h-[30px] py-1",
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {selected.length === 0 && <span className="truncate text-faint">{placeholder}</span>}
            {!props.multiple && selected[0] && <span className="truncate">{label(selected[0])}</span>}
            {props.multiple &&
              selected.slice(0, maxTags).map((v) => (
                <Tag key={v} size="sm" onRemove={() => toggle(v)} onPointerDown={(e) => e.stopPropagation()}>
                  {label(v)}
                </Tag>
              ))}
            {props.multiple && selected.length > maxTags && (
              <Tag size="sm" tone="neutral">+{selected.length - maxTags}</Tag>
            )}
          </span>
          {loading ? <Spinner size={14} label="" /> : <IconChevronDown size={14} />}
        </div>
      </P.Trigger>
      <P.Portal>
        <P.Content
          align="start"
          sideOffset={6}
          collisionPadding={8}
          onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus(); }}
          className="z-(--z-dropdown) w-(--radix-popover-trigger-width) min-w-56 overflow-hidden rounded-lg bg-popover text-small shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]"
        >
          <div className="flex h-9 items-center gap-2 border-b border-border px-2.5">
            <IconSearch size={14} className="text-icon" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => { setQ(e.target.value); setActive(0); }}
              placeholder={searchPlaceholder}
              aria-controls={listId}
              aria-activedescendant={count ? `${listId}-${active}` : undefined}
              className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(count - 1, a + 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (active < filtered.length) toggle(filtered[active].value);
                  else if (canCreate) { onCreate!(q.trim()); setQ(""); }
                }
                if (e.key === "Backspace" && q === "" && props.multiple && selected.length) {
                  props.onValueChange(selected.slice(0, -1));
                }
              }}
            />
          </div>
          <div id={listId} role="listbox" aria-multiselectable={props.multiple || undefined} className="max-h-64 overflow-y-auto p-1">
            {count === 0 && <p className="px-2 py-6 text-center text-small text-subtle">{loading ? "Loading…" : emptyLabel}</p>}
            {filtered.map((o, i) => {
              const on = selected.includes(o.value);
              return (
                <div
                  key={o.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={on}
                  aria-disabled={o.disabled || undefined}
                  onMouseMove={() => setActive(i)}
                  onClick={() => !o.disabled && toggle(o.value)}
                  className={cn(
                    "flex min-h-7 cursor-default items-center gap-2 rounded-sm px-2 py-1 [&_svg]:size-3.5 [&_svg]:text-icon",
                    i === active && "bg-hover",
                    o.disabled && "opacity-45",
                  )}
                >
                  {props.multiple && (
                    <span className={cn("inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] shadow-[0_0_0_1px_var(--line-strong)]", on && "bg-primary text-primary-foreground shadow-none [&_svg]:text-primary-foreground!")}>
                      {on && <IconCheck size={12} />}
                    </span>
                  )}
                  {o.icon}
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {!props.multiple && on && <IconCheck />}
                </div>
              );
            })}
            {canCreate && (
              <div
                id={`${listId}-${filtered.length}`}
                role="option"
                aria-selected={false}
                onMouseMove={() => setActive(filtered.length)}
                onClick={() => { onCreate!(q.trim()); setQ(""); }}
                className={cn("flex h-7 cursor-default items-center gap-2 rounded-sm px-2 text-soft", active === filtered.length && "bg-hover")}
              >
                Create “<span className="text-foreground">{q.trim()}</span>”
              </div>
            )}
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ===================== Slider ===================== */

export function Slider({
  className,
  showValue,
  format = (v: number) => String(v),
  ...props
}: ComponentProps<typeof SL.Root> & { showValue?: boolean; format?: (v: number) => string }) {
  const vals = props.value ?? props.defaultValue ?? [0];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SL.Root className="relative flex h-5 w-full touch-none items-center select-none data-disabled:opacity-45" {...props}>
        <SL.Track className="relative h-1 grow overflow-hidden rounded-full bg-track">
          <SL.Range className="absolute h-full bg-foreground" />
        </SL.Track>
        {vals.map((_, i) => (
          <SL.Thumb
            key={i}
            aria-label={props["aria-label"] ?? (vals.length > 1 ? (i === 0 ? "Minimum" : "Maximum") : "Value")}
            className="block size-3.5 cursor-grab rounded-full bg-foreground shadow-[0_0_0_3px_var(--background),0_1px_3px_rgba(0,0,0,0.3)] outline-none transition-shadow duration-fast focus-visible:shadow-[0_0_0_3px_var(--background),0_0_0_5px_var(--ring)] active:cursor-grabbing"
          />
        ))}
      </SL.Root>
      {showValue && (
        <span className="tabular min-w-10 shrink-0 text-right text-caption text-soft">{vals.map(format).join("–")}</span>
      )}
    </div>
  );
}
