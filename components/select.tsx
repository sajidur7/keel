/**
 * Form controls — choosing from lists.
 * Select (Selector) · Combobox · MultiSelector · ComplexSelector · Typeahead · TypeaheadItem · Tokenizer · PowerSearch
 */
import * as stylex from "@stylexjs/stylex";
import { Popover as P, Select as S } from "radix-ui";
import { isValidElement, Children, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Avatar, Token } from "./content";
import { field, useField } from "./inputs";
import { IconCheck, IconChevronDown, IconFilter, IconPlus, IconSearch, IconSizeContext, IconX } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";

const popIn = stylex.keyframes({ from: { opacity: 0, transform: "scale(0.97) translateY(-3px)" }, to: { opacity: 1, transform: "none" } });

/** Shared listbox look (also used by date pickers and menus). */
export const lb = stylex.create({
  // 32px control, 18px avatar → 7px inset on the left, same as top and bottom.
  avatarInset: { paddingInlineStart: 7 },
  pop: {
    zIndex: 60, overflow: "hidden", borderRadius: radius.lg, backgroundColor: color.surfaceRaised, color: color.fg, fontSize: font.md,
    boxShadow: depth.popover, outline: "none", animationName: popIn, animationDuration: motion.fast, animationTimingFunction: motion.ease,
    transformOrigin: "var(--radix-select-content-transform-origin, var(--radix-popover-content-transform-origin))",
  },
  selectPop: { minWidth: "var(--radix-select-trigger-width)", maxHeight: "var(--radix-select-content-available-height)" },
  triggerW: { width: "var(--radix-popover-trigger-width)", minWidth: 240 },
  list: { maxHeight: 288, overflowY: "auto", padding: 4 },
  viewport: { padding: 4 },
  search: {
    display: "flex", alignItems: "center", gap: 8, height: 38, paddingInline: 10, color: color.icon,
    borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border,
  },
  searchInput: { flex: 1, minWidth: 0, height: "100%", outline: "none", color: color.fg, "::placeholder": { color: color.fgFaint } },
  item: {
    position: "relative", display: "flex", alignItems: "center", gap: 8, minHeight: 30, paddingBlock: 4, paddingInlineStart: 8, paddingInlineEnd: 28,
    borderRadius: radius.sm, cursor: "pointer", userSelect: "none", outline: "none",
    ":is([data-highlighted])": { backgroundColor: color.hover },
    ":is([data-disabled])": { opacity: 0.45, cursor: "not-allowed" },
  },
  itemPlain: { paddingInlineEnd: 8 },
  active: { backgroundColor: color.hover },
  off: { opacity: 0.45, cursor: "not-allowed" },
  icon: { display: "inline-flex", color: color.icon },
  text: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1 },
  label: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  desc: { fontSize: font.sm, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { flexShrink: 0, fontSize: font.sm, color: color.fgFaint },
  check: { position: "absolute", right: 8, display: "inline-flex", color: color.accent },
  heading: { paddingInline: 8, paddingTop: 8, paddingBottom: 4, fontSize: font.xs, fontWeight: font.medium, color: color.fgMuted, letterSpacing: "0.05em", textTransform: "uppercase" },
  sep: { height: 1, marginBlock: 4, marginInline: -4, backgroundColor: color.border },
  empty: { paddingBlock: 24, paddingInline: 8, textAlign: "center", color: color.fgMuted },
  box: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, flexShrink: 0, borderRadius: 4,
    boxShadow: `inset 0 0 0 1px ${color.borderStrong}`, backgroundColor: color.surface, color: color.onAccent,
  },
  boxOn: { backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`, boxShadow: `0 0 0 1px ${color.accentBottom}` },
  create: { color: color.fgSoft },
  strong: { color: color.fg, fontWeight: font.medium },
  // triggers
  trigger: { cursor: "pointer", justifyContent: "space-between", textAlign: "start", outline: "none", ":is([data-placeholder])": { color: color.fgFaint } },
  triggerOpen: { boxShadow: `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
  value: { display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
  chev: { display: "inline-flex", color: color.icon, flexShrink: 0 },
  multi: { height: "auto", minHeight: 32, paddingBlock: 3, flexWrap: "wrap" },
  tokens: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, flex: 1, minWidth: 0 },
  placeholder: { color: color.fgFaint },
  tokInput: { flex: 1, minWidth: 80, height: 24, outline: "none", "::placeholder": { color: color.fgFaint } },
  ghost: {
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`,
    boxShadow: { default: depth.raised, ":hover": depth.raisedHover, ":focus-visible": `${depth.raised}, ${depth.focus}` },
  },
  // power search
  ps: { flexWrap: "wrap", height: "auto", minHeight: 36, paddingBlock: 4, gap: 6 },
  chip: {
    display: "inline-flex", alignItems: "center", height: 24, borderRadius: radius.sm, overflow: "hidden", fontSize: font.sm,
    boxShadow: `inset 0 0 0 1px ${color.accentBorder}`, backgroundColor: color.accentSoft, color: color.fg, whiteSpace: "nowrap",
  },
  chipPart: { paddingInline: 7, display: "inline-flex", alignItems: "center", height: "100%" },
  chipField: { color: color.accentStrong, fontWeight: font.medium },
  chipOp: { color: color.fgMuted, borderInlineWidth: 1, borderInlineStyle: "solid", borderInlineColor: color.accentBorder },
  chipX: { display: "inline-flex", alignItems: "center", paddingInline: 5, height: "100%", color: color.fgMuted, ":hover": { color: color.fg, backgroundColor: color.accentBorder } },
  pending: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: font.sm, color: color.accentStrong, fontWeight: font.medium },
  hintRow: { display: "flex", alignItems: "center", gap: 6, paddingInline: 10, paddingBlock: 6, fontSize: font.xs, color: color.fgMuted, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, backgroundColor: color.surfaceSunken },
});

export type SelectOption = { value: string; label: string; description?: string; icon?: ReactNode; disabled?: boolean };

/* ============================================================== Select */

/** Declarative option for <Select> (alternative to `options`). Renders nothing on its own. */
export function SelectorOption(_props: SelectOption): null { return null; }

export type SelectProps = StyleProps & {
  options?: SelectOption[];
  /** <SelectorOption value label /> children instead of `options`. */
  children?: ReactNode;
  groups?: { label: string; options: SelectOption[] }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** "field" = recessed like an input (forms). "button" = raised (toolbars, filters). */
  variant?: "field" | "button";
  id?: string;
  "aria-label"?: string;
};

/** Pick one from a short known list (≤ ~12). Longer or searchable lists → Combobox. */
export function Select({ options: optionsProp, children, groups, value, defaultValue, onValueChange, placeholder = "Select", size = "md", invalid, disabled, readOnly, variant = "field", id, xstyle, className, style, ...rest }: SelectProps) {
  const f = useField({ id, invalid, disabled, readOnly });
  const options = optionsProp ?? Children.toArray(children).flatMap((c) => (isValidElement(c) ? [c.props as SelectOption] : []));
  const item = (o: SelectOption) => (
    <S.Item key={o.value} value={o.value} disabled={o.disabled} {...px(lb.item)}>
      {o.icon && <span {...px(lb.icon)}>{o.icon}</span>}
      <span {...px(lb.text)}><S.ItemText>{o.label}</S.ItemText>{o.description && <span {...px(lb.desc)}>{o.description}</span>}</span>
      <S.ItemIndicator {...px(lb.check)}><IconCheck size={14} /></S.ItemIndicator>
    </S.Item>
  );
  return (
    <IconSizeContext.Provider value={14}>
      <S.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={f.disabled || f.readOnly}>
        <S.Trigger id={f.id} aria-invalid={f.invalid || undefined} aria-describedby={f["aria-describedby"]} aria-label={rest["aria-label"]}
          {...sx({ xstyle, className, style }, field.shell, size !== "md" && field[size], lb.trigger, variant === "button" && lb.ghost, f.invalid && field.invalid, f.readOnly && field.readOnly, f.disabled && field.disabled)}>
          <span {...px(lb.value)}><S.Value placeholder={placeholder} /></span>
          {!f.readOnly && <S.Icon {...px(lb.chev)}><IconChevronDown /></S.Icon>}
        </S.Trigger>
        <S.Portal>
          <S.Content position="popper" sideOffset={6} collisionPadding={8} {...px(lb.pop, lb.selectPop)}>
            <S.Viewport {...px(lb.viewport)}>
              {groups ? groups.map((g, i) => (
                <S.Group key={g.label}>
                  {i > 0 && <S.Separator {...px(lb.sep)} />}
                  <S.Label {...px(lb.heading)}>{g.label}</S.Label>
                  {g.options.map(item)}
                </S.Group>
              )) : options.map(item)}
            </S.Viewport>
          </S.Content>
        </S.Portal>
      </S.Root>
    </IconSizeContext.Provider>
  );
}
/** Astryx-style name. */
export const Selector = Select;

/* ============================================================== listbox hook (Combobox, Typeahead, Tokenizer…) */

function useListNav(count: number, onPick: (i: number) => void) {
  const [active, setActive] = useState(0);
  useEffect(() => { if (active > count - 1) setActive(Math.max(0, count - 1)); }, [count, active]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(count - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && count) { e.preventDefault(); onPick(active); }
  };
  return { active, setActive, onKeyDown };
}

/* ============================================================== Combobox / MultiSelector */

type ComboBase = StyleProps & {
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
  "aria-label"?: string;
};
export type ComboboxProps =
  | (ComboBase & { multiple?: false; value: string | null; onValueChange: (v: string | null) => void })
  | (ComboBase & { multiple: true; value: string[]; onValueChange: (v: string[]) => void; maxTokens?: number });

/** Searchable select. With `multiple`, choices show as removable tokens in the field. */
export function Combobox(props: ComboboxProps) {
  const { options, placeholder = "Select", searchPlaceholder = "Search", emptyLabel = "No matches", size = "md", invalid, disabled, loading, onCreate, id, xstyle, className, style } = props;
  const f = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = props.multiple ? props.value : props.value ? [props.value] : [];
  const filtered = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase().trim())), [options, q]);
  const canCreate = Boolean(onCreate && q.trim() && !options.some((o) => o.label.toLowerCase() === q.trim().toLowerCase()));
  const count = filtered.length + (canCreate ? 1 : 0);
  const toggle = (v: string) => {
    if (props.multiple) { props.onValueChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]); setQ(""); inputRef.current?.focus(); }
    else { props.onValueChange(v === props.value ? null : v); setOpen(false); setQ(""); }
  };
  const nav = useListNav(count, (i) => { if (i < filtered.length) { if (!filtered[i].disabled) toggle(filtered[i].value); } else if (canCreate) { onCreate!(q.trim()); setQ(""); } });
  const lab = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const max = props.multiple ? (props.maxTokens ?? 3) : 0;
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
        <P.Trigger asChild disabled={f.disabled}>
          <div id={f.id} role="combobox" tabIndex={f.disabled ? -1 : 0} aria-expanded={open} aria-controls={listId} aria-haspopup="listbox"
            aria-invalid={f.invalid || undefined} aria-describedby={f["aria-describedby"]} aria-label={props["aria-label"]}
            onKeyDown={(e) => { if (["Enter", " ", "ArrowDown"].includes(e.key)) { e.preventDefault(); setOpen(true); } }}
            {...sx({ xstyle, className, style }, field.shell, size !== "md" && field[size], lb.trigger, props.multiple && selected.length > 0 && lb.multi, open && lb.triggerOpen, f.invalid && field.invalid, f.disabled && field.disabled)}>
            <span {...px(lb.tokens)}>
              {selected.length === 0 && <span {...px(lb.placeholder)}>{placeholder}</span>}
              {!props.multiple && selected[0] && <span {...px(lb.label)}>{lab(selected[0])}</span>}
              {props.multiple && selected.slice(0, max).map((v) => <span key={v} onPointerDown={(e) => e.stopPropagation()}><Token size="sm" label={lab(v)} onRemove={() => toggle(v)} /></span>)}
              {props.multiple && selected.length > max && <Token size="sm" label={`+${selected.length - max}`} />}
            </span>
            {loading ? <Spinner size={14} tone="muted" label="" /> : <span {...px(lb.chev)}><IconChevronDown /></span>}
          </div>
        </P.Trigger>
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} onOpenAutoFocus={(e) => { e.preventDefault(); inputRef.current?.focus(); }} {...px(lb.pop, lb.triggerW)}>
            <div {...px(lb.search)}>
              <IconSearch />
              <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); nav.setActive(0); }} placeholder={searchPlaceholder} aria-controls={listId}
                aria-activedescendant={count ? `${listId}-${nav.active}` : undefined} {...px(lb.searchInput)}
                onKeyDown={(e) => { nav.onKeyDown(e); if (e.key === "Backspace" && !q && props.multiple && selected.length) props.onValueChange(selected.slice(0, -1)); }} />
            </div>
            <div id={listId} role="listbox" aria-multiselectable={props.multiple || undefined} {...px(lb.list)}>
              {count === 0 && <p {...px(lb.empty)}>{loading ? "Loading…" : emptyLabel}</p>}
              {filtered.map((o, i) => {
                const on = selected.includes(o.value);
                return (
                  <div key={o.value} id={`${listId}-${i}`} role="option" aria-selected={on} aria-disabled={o.disabled || undefined}
                    onMouseMove={() => nav.setActive(i)} onClick={() => !o.disabled && toggle(o.value)}
                    {...px(lb.item, props.multiple && lb.itemPlain, i === nav.active && lb.active, o.disabled && lb.off)}>
                    {props.multiple && <span {...px(lb.box, on && lb.boxOn)}>{on && <IconCheck size={12} />}</span>}
                    {o.icon && <span {...px(lb.icon)}>{o.icon}</span>}
                    <span {...px(lb.text)}><span {...px(lb.label)}>{o.label}</span>{o.description && <span {...px(lb.desc)}>{o.description}</span>}</span>
                    {!props.multiple && on && <span {...px(lb.check)}><IconCheck /></span>}
                  </div>
                );
              })}
              {canCreate && (
                <div id={`${listId}-${filtered.length}`} role="option" aria-selected={false} onMouseMove={() => nav.setActive(filtered.length)}
                  onClick={() => { onCreate!(q.trim()); setQ(""); }} {...px(lb.item, lb.create, nav.active === filtered.length && lb.active)}>
                  <span {...px(lb.icon)}><IconPlus /></span>Create “<span {...px(lb.strong)}>{q.trim()}</span>”
                </div>
              )}
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}
/** Combobox with `multiple`. */
export const MultiSelector = (p: Omit<Extract<ComboboxProps, { multiple: true }>, "multiple">) => <Combobox {...p} multiple />;

/* ============================================================== ComplexSelector */

export type ComplexOption = {
  value: string;
  label: string;
  description?: string;
  /** Right-aligned detail: a role, a count, a price. */
  meta?: ReactNode;
  avatar?: { name: string; src?: string };
  icon?: ReactNode;
  group?: string;
  disabled?: boolean;
};

/** Rich, grouped, searchable picker — people with roles, projects with owners. Single or multiple. Raised trigger. */
export function ComplexSelector({ options, value, onValueChange, multiple, placeholder = "Choose…", searchPlaceholder = "Search", emptyLabel = "Nothing found", footer, width = 320, ...p }: StyleProps & {
  options: ComplexOption[]; value: string[]; onValueChange: (v: string[]) => void; multiple?: boolean; placeholder?: string;
  searchPlaceholder?: string; emptyLabel?: string; footer?: ReactNode; width?: number;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const listId = useId();
  const filtered = options.filter((o) => `${o.label} ${o.description ?? ""} ${o.group ?? ""}`.toLowerCase().includes(q.toLowerCase().trim()));
  const groups = useMemo(() => { const m = new Map<string, ComplexOption[]>(); filtered.forEach((o) => { const g = o.group ?? ""; m.set(g, [...(m.get(g) ?? []), o]); }); return [...m]; }, [filtered]);
  const flat = groups.flatMap(([, l]) => l);
  const pick = (v: string) => { if (multiple) onValueChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]); else { onValueChange([v]); setOpen(false); } };
  const nav = useListNav(flat.length, (i) => !flat[i].disabled && pick(flat[i].value));
  const chosen = options.filter((o) => value.includes(o.value));
  let idx = -1;
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
        <P.Trigger {...sx(p, field.shell, lb.trigger, lb.ghost, chosen.length === 1 && chosen[0].avatar ? lb.avatarInset : null)} style={{ width: "auto", maxWidth: "100%", ...p.style }}>
          <span {...px(lb.value)}>
            {chosen.length === 0 ? <span {...px(lb.placeholder)}>{placeholder}</span>
              : chosen.length === 1 ? <>{chosen[0].avatar && <Avatar size="xs" name={chosen[0].avatar.name} src={chosen[0].avatar.src} />}{chosen[0].icon}<span {...px(lb.label)}>{chosen[0].label}</span></>
              : <span>{chosen.length} selected</span>}
          </span>
          <span {...px(lb.chev)}><IconChevronDown /></span>
        </P.Trigger>
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} {...px(lb.pop)} style={{ width }}>
            <div {...px(lb.search)}>
              <IconSearch />
              <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); nav.setActive(0); }} placeholder={searchPlaceholder} onKeyDown={nav.onKeyDown} {...px(lb.searchInput)} />
            </div>
            <div id={listId} role="listbox" aria-multiselectable={multiple || undefined} {...px(lb.list)}>
              {flat.length === 0 && <p {...px(lb.empty)}>{emptyLabel}</p>}
              {groups.map(([g, list]) => (
                <div key={g || "_"} role="group" aria-label={g || undefined}>
                  {g && <div {...px(lb.heading)}>{g}</div>}
                  {list.map((o) => {
                    idx++; const i = idx; const on = value.includes(o.value);
                    return (
                      <div key={o.value} role="option" aria-selected={on} onMouseMove={() => nav.setActive(i)} onClick={() => !o.disabled && pick(o.value)}
                        {...px(lb.item, lb.itemPlain, i === nav.active && lb.active, o.disabled && lb.off)} style={{ minHeight: 40 }}>
                        {multiple && <span {...px(lb.box, on && lb.boxOn)}>{on && <IconCheck size={12} />}</span>}
                        {o.avatar ? <Avatar size="md" name={o.avatar.name} src={o.avatar.src} /> : o.icon && <span {...px(lb.icon)}>{o.icon}</span>}
                        <span {...px(lb.text)}><span {...px(lb.label)}>{o.label}</span>{o.description && <span {...px(lb.desc)}>{o.description}</span>}</span>
                        {o.meta && <span {...px(lb.meta)}>{o.meta}</span>}
                        {!multiple && on && <span style={{ display: "inline-flex", color: "inherit" }} {...px(lb.icon)}><IconCheck /></span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {footer && <div {...px(lb.hintRow)}>{footer}</div>}
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== Typeahead */

export type TypeaheadOption = { value: string; label: string; description?: string; icon?: ReactNode; avatar?: { name: string; src?: string }; meta?: ReactNode };
type Source = TypeaheadOption[] | ((query: string) => Promise<TypeaheadOption[]>);

function useSearch(source: Source, q: string, minQuery: number, debounceMs: number) {
  const [results, setResults] = useState<TypeaheadOption[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (q.trim().length < minQuery) { setResults([]); return; }
    if (Array.isArray(source)) { setResults(source.filter((o) => `${o.label} ${o.description ?? ""}`.toLowerCase().includes(q.toLowerCase().trim()))); return; }
    let live = true; setLoading(true);
    const t = setTimeout(() => { source(q).then((r) => { if (live) { setResults(r); setLoading(false); } }).catch(() => live && setLoading(false)); }, debounceMs);
    return () => { live = false; clearTimeout(t); };
  }, [q, source, minQuery, debounceMs]);
  return { results, loading };
}

/** One suggestion row — use in `renderItem` or your own lists. */
export function TypeaheadItem({ option, active, selected }: { option: TypeaheadOption; active?: boolean; selected?: boolean }) {
  return (
    <span {...px(lb.item, lb.itemPlain, active && lb.active)} style={{ minHeight: option.description ? 40 : 30 }}>
      {option.avatar ? <Avatar size={option.description ? "md" : "sm"} name={option.avatar.name} src={option.avatar.src} /> : option.icon && <span {...px(lb.icon)}>{option.icon}</span>}
      <span {...px(lb.text)}><span {...px(lb.label)}>{option.label}</span>{option.description && <span {...px(lb.desc)}>{option.description}</span>}</span>
      {option.meta && <span {...px(lb.meta)}>{option.meta}</span>}
      {selected && <span {...px(lb.icon)}><IconCheck /></span>}
    </span>
  );
}

export type TypeaheadProps = StyleProps & {
  /** A list to filter, or an async search. */
  source: Source;
  value?: TypeaheadOption | null;
  onValueChange?: (v: TypeaheadOption | null) => void;
  placeholder?: string;
  minQuery?: number;
  debounceMs?: number;
  emptyLabel?: string;
  size?: "sm" | "md" | "lg";
  leading?: ReactNode;
  id?: string;
};

/** Type to search, pick one suggestion. The field shows the chosen label. */
export function Typeahead({ source, value, onValueChange, placeholder = "Search…", minQuery = 1, debounceMs = 200, emptyLabel = "No results", size = "md", leading = <IconSearch />, id, ...p }: TypeaheadProps) {
  const f = useField({ id });
  const [q, setQ] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const listId = useId();
  const { results, loading } = useSearch(source, q, minQuery, debounceMs);
  useEffect(() => { setQ(value?.label ?? ""); }, [value]);
  const pick = (o: TypeaheadOption) => { onValueChange?.(o); setQ(o.label); setOpen(false); };
  const nav = useListNav(results.length, (i) => pick(results[i]));
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open && q.trim().length >= minQuery} onOpenChange={setOpen}>
        <P.Anchor asChild>
          <div {...sx(p, field.shell, size !== "md" && field[size], f.invalid && field.invalid)}>
            <span {...px(field.addon)}>{leading}</span>
            <input id={f.id} role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-describedby={f["aria-describedby"]}
              aria-activedescendant={results.length ? `${listId}-${nav.active}` : undefined}
              value={q} placeholder={placeholder} onFocus={() => setOpen(true)}
              onChange={(e) => { setQ(e.target.value); setOpen(true); nav.setActive(0); if (value) onValueChange?.(null); }}
              onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); else nav.onKeyDown(e); }} {...px(field.input)} />
            {loading && <Spinner size={14} tone="muted" label="" />}
            {q && !loading && <button type="button" aria-label="Clear" onClick={() => { setQ(""); onValueChange?.(null); }} {...px(field.clear)}><IconX size={12} /></button>}
          </div>
        </P.Anchor>
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={() => setOpen(false)}
            {...px(lb.pop)} style={{ width: "var(--radix-popper-anchor-width)", minWidth: 240 }}>
            <div id={listId} role="listbox" {...px(lb.list)}>
              {!loading && results.length === 0 && <p {...px(lb.empty)}>{emptyLabel}</p>}
              {results.map((o, i) => (
                <div key={o.value} id={`${listId}-${i}`} role="option" aria-selected={value?.value === o.value} onMouseMove={() => nav.setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)}>
                  <TypeaheadItem option={o} active={i === nav.active} selected={value?.value === o.value} />
                </div>
              ))}
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== Tokenizer */

export type TokenizerProps = StyleProps & {
  source: Source;
  value: TypeaheadOption[];
  onValueChange: (v: TypeaheadOption[]) => void;
  placeholder?: string;
  /** Allow free text tokens on Enter / comma. */
  allowCreate?: boolean;
  max?: number;
  debounceMs?: number;
  id?: string;
};

/** Several entities as tokens in one field — recipients, assignees, tags. Backspace removes the last. */
export function Tokenizer({ source, value, onValueChange, placeholder = "Add…", allowCreate, max, debounceMs = 150, id, ...p }: TokenizerProps) {
  const f = useField({ id });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const { results, loading } = useSearch(source, q, 0, debounceMs);
  const avail = results.filter((r) => !value.some((v) => v.value === r.value));
  const full = max !== undefined && value.length >= max;
  const add = (o: TypeaheadOption) => { if (full) return; onValueChange([...value, o]); setQ(""); inputRef.current?.focus(); };
  const nav = useListNav(avail.length, (i) => add(avail[i]));
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open && !full && (avail.length > 0 || loading)} onOpenChange={setOpen}>
        <P.Anchor asChild>
          <div onMouseDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); inputRef.current?.focus(); } }} {...sx(p, field.shell, lb.multi, f.invalid && field.invalid)}>
            <span {...px(lb.tokens)}>
              {value.map((v) => <Token key={v.value} size="sm" label={v.label} avatar={v.avatar} icon={v.icon} onRemove={() => onValueChange(value.filter((x) => x.value !== v.value))} />)}
              {!full && (
                <input ref={inputRef} id={f.id} role="combobox" aria-expanded={open} aria-controls={listId} aria-describedby={f["aria-describedby"]}
                  value={q} placeholder={value.length ? "" : placeholder} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); nav.setActive(0); }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !q && value.length) onValueChange(value.slice(0, -1));
                    else if ((e.key === "Enter" || e.key === ",") && allowCreate && q.trim() && !avail.length) { e.preventDefault(); add({ value: q.trim(), label: q.trim() }); }
                    else if (e.key === "Escape") setOpen(false);
                    else nav.onKeyDown(e);
                  }} {...px(lb.tokInput)} />
              )}
            </span>
            {loading && <Spinner size={14} tone="muted" label="" />}
          </div>
        </P.Anchor>
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={() => setOpen(false)}
            {...px(lb.pop)} style={{ width: "var(--radix-popper-anchor-width)", minWidth: 240 }}>
            <div id={listId} role="listbox" {...px(lb.list)}>
              {avail.map((o, i) => <div key={o.value} role="option" aria-selected={false} onMouseMove={() => nav.setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => add(o)}><TypeaheadItem option={o} active={i === nav.active} /></div>)}
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== PowerSearch */

export type PowerField = {
  key: string;
  label: string;
  icon?: ReactNode;
  /** Operators offered after picking this field. Default: is / is not. */
  operators?: string[];
  /** Known values to suggest. Free text otherwise. */
  values?: string[];
};
export type PowerFilter = { field: string; operator: string; value: string };

/**
 * Structured search: pick a field → an operator → a value, as chips. Free text becomes a "contains" filter.
 * Good for tables with many columns (Status is Paid · Plan is not Free · "acme").
 */
export function PowerSearch({ fields, filters, onFiltersChange, placeholder = "Filter or search…", ...p }: StyleProps & {
  fields: PowerField[]; filters: PowerFilter[]; onFiltersChange: (f: PowerFilter[]) => void; placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<{ field?: PowerField; operator?: string }>({});
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ops = stage.field?.operators ?? ["is", "is not"];
  const ql = q.toLowerCase().trim();
  const suggestions: { label: string; hint?: string; icon?: ReactNode; run: () => void }[] =
    !stage.field ? [
      ...fields.filter((fl) => fl.label.toLowerCase().includes(ql)).map((fl) => ({ label: fl.label, hint: "field", icon: fl.icon, run: () => { setStage({ field: fl }); setQ(""); } })),
      ...(ql ? [{ label: `Search “${q.trim()}”`, hint: "text", icon: <IconSearch />, run: () => { onFiltersChange([...filters, { field: "text", operator: "contains", value: q.trim() }]); setQ(""); } }] : []),
    ]
    : !stage.operator ? ops.filter((o) => o.includes(ql)).map((o) => ({ label: o, hint: "operator", run: () => { setStage({ ...stage, operator: o }); setQ(""); } }))
    : [
      ...(stage.field.values ?? []).filter((v) => v.toLowerCase().includes(ql)).map((v) => ({ label: v, run: () => commit(v) })),
      ...(ql && !(stage.field.values ?? []).some((v) => v.toLowerCase() === ql) ? [{ label: `“${q.trim()}”`, hint: "value", run: () => commit(q.trim()) }] : []),
    ];
  function commit(v: string) { onFiltersChange([...filters, { field: stage.field!.key, operator: stage.operator!, value: v }]); setStage({}); setQ(""); inputRef.current?.focus(); }
  const nav = useListNav(suggestions.length, (i) => suggestions[i].run());
  const lab = (k: string) => (k === "text" ? "Text" : fields.find((fl) => fl.key === k)?.label ?? k);
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <P.Anchor asChild>
          <div onMouseDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); inputRef.current?.focus(); } }} {...sx(p, field.shell, lb.ps)}>
            <span {...px(field.addon)}><IconFilter /></span>
            {filters.map((fl, i) => (
              <span key={i} {...px(lb.chip)}>
                <span {...px(lb.chipPart, lb.chipField)}>{lab(fl.field)}</span>
                <span {...px(lb.chipPart, lb.chipOp)}>{fl.operator}</span>
                <span {...px(lb.chipPart)}>{fl.value}</span>
                <button type="button" aria-label={`Remove ${lab(fl.field)} filter`} onClick={() => onFiltersChange(filters.filter((_, j) => j !== i))} {...px(lb.chipX)}><IconX size={12} /></button>
              </span>
            ))}
            {stage.field && <span {...px(lb.pending)}>{stage.field.label}{stage.operator && <span style={{ opacity: 0.7, fontWeight: 400 }}> {stage.operator}</span>}</span>}
            <input ref={inputRef} value={q} placeholder={filters.length || stage.field ? "" : placeholder} aria-label="Filter or search"
              onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); nav.setActive(0); }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !q) { if (stage.operator) setStage({ field: stage.field }); else if (stage.field) setStage({}); else if (filters.length) onFiltersChange(filters.slice(0, -1)); }
                else if (e.key === "Escape") { setOpen(false); setStage({}); }
                else nav.onKeyDown(e);
              }} {...px(lb.tokInput)} />
            {(filters.length > 0 || q) && <button type="button" aria-label="Clear all" onClick={() => { onFiltersChange([]); setQ(""); setStage({}); }} {...px(field.clear)}><IconX size={12} /></button>}
          </div>
        </P.Anchor>
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={() => setOpen(false)} {...px(lb.pop)} style={{ minWidth: 260 }}>
            <div role="listbox" {...px(lb.list)}>
              {suggestions.map((sg, i) => (
                <div key={sg.label + i} role="option" aria-selected={i === nav.active} onMouseMove={() => nav.setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={sg.run} {...px(lb.item, lb.itemPlain, i === nav.active && lb.active)}>
                  {sg.icon && <span {...px(lb.icon)}>{sg.icon}</span>}
                  <span {...px(lb.text)}><span {...px(lb.label)}>{sg.label}</span></span>
                  {sg.hint && <span {...px(lb.meta)}>{sg.hint}</span>}
                </div>
              ))}
            </div>
            <div {...px(lb.hintRow)}>{!stage.field ? "Pick a field, or type to search text" : !stage.operator ? `How should ${stage.field.label} match?` : `Value for ${stage.field.label} ${stage.operator}`} · ⌫ steps back</div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}
