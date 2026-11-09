/**
 * Form controls — text entry.
 * Field (FormField) · Label · FieldStatus · FormLayout · FormSection · Input (TextInput) · SearchInput · PasswordInput ·
 * NumberInput · TextArea (Textarea) · InputGroup · fieldShell (shared look for Select, pickers…)
 */
import * as stylex from "@stylexjs/stylex";
import { Label as LP } from "radix-ui";
import {
  createContext, forwardRef, useContext, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState,
  type ComponentProps, type ReactNode,
} from "react";
import { color, depth, font, motion, radius, size as sz } from "../tokens/tokens.stylex";
import { Kbd } from "./content";
import { IconAlertCircle, IconCheckCircle, IconChevronDown, IconChevronUp, IconEye, IconEyeOff, IconInfo, IconMinus, IconPlus, IconSearch, IconSizeContext, IconX } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";
import { InfoTip } from "./feedback";

/* ============================================================== Field context */

type FieldCtx = { id: string; describedBy?: string; invalid: boolean; required: boolean; disabled: boolean; readOnly: boolean };
const FieldContext = createContext<FieldCtx | null>(null);

/** Inside a control: picks up id, aria-describedby and state from the surrounding Field. */
export function useField(own: { id?: string; invalid?: boolean; disabled?: boolean; readOnly?: boolean; required?: boolean } = {}) {
  const ctx = useContext(FieldContext);
  return {
    id: own.id ?? ctx?.id,
    "aria-describedby": ctx?.describedBy,
    invalid: own.invalid ?? ctx?.invalid ?? false,
    disabled: own.disabled ?? ctx?.disabled ?? false,
    readOnly: own.readOnly ?? ctx?.readOnly ?? false,
    required: own.required ?? ctx?.required ?? false,
  };
}

/* ============================================================== shared shell */

/** The look every text-like control shares: a recessed well that lifts its ring on focus. */
export const field = stylex.create({
  shell: {
    position: "relative", display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0,
    height: sz.md, paddingInline: 10, borderRadius: radius.md, fontSize: font.md, color: color.fg,
    backgroundColor: color.surface, cursor: "text",
    boxShadow: {
      default: depth.recessed,
      ":hover": `inset 0 1px 1.5px ${color.shadeXs}, 0 0 0 1px ${color.borderStrong}`,
      ":focus-within": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}`,
    },
    transitionProperty: "box-shadow, background-color", transitionDuration: motion.fast, transitionTimingFunction: motion.ease,
  },
  sm: { height: sz.sm, paddingInline: 8, fontSize: font.sm, gap: 6, borderRadius: radius.sm },
  lg: { height: sz.lg, paddingInline: 12, fontSize: font.lg, borderRadius: radius.lg },
  invalid: {
    boxShadow: {
      default: `inset 0 1px 1.5px ${color.shadeXs}, 0 0 0 1px ${color.danger}`,
      ":focus-within": `0 0 0 1px ${color.danger}, 0 0 0 4px ${color.dangerBorder}`,
    },
  },
  disabled: { opacity: 0.55, cursor: "not-allowed", backgroundColor: color.surfaceSunken },
  readOnly: { backgroundColor: color.surfaceSunken, boxShadow: { default: `0 0 0 1px ${color.border}`, ":hover": `0 0 0 1px ${color.border}` } },
  flat: { backgroundColor: "transparent", boxShadow: { default: "none", ":hover": `0 0 0 1px ${color.border}`, ":focus-within": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` } },
  input: {
    flex: 1, minWidth: 0, height: "100%", outline: "none", backgroundColor: "transparent", color: "inherit", fontSize: "inherit",
    "::placeholder": { color: color.fgFaint },
    ":disabled": { cursor: "not-allowed" },
  },
  addon: { display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, color: color.icon, fontSize: font.sm },
  addonText: { color: color.fgMuted },
  clear: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: radius.full, flexShrink: 0,
    color: color.fgMuted, backgroundColor: { default: color.muted, ":hover": color.selected }, outline: "none",
    ":focus-visible": { boxShadow: depth.focus },
  },
  full: { width: "100%" },
  grouped: { borderRadius: 0, backgroundColor: "transparent", boxShadow: { default: "none", ":hover": "none", ":focus-within": "none" } },
});
const InGroup = createContext(false);

/* ============================================================== Label & Field */

const fl = stylex.create({
  label: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: font.md, fontWeight: font.medium, lineHeight: 1.2, color: color.fg, userSelect: "none" },
  req: { color: color.danger, marginInlineStart: -2 },
  opt: { fontWeight: font.regular, color: color.fgMuted, fontSize: font.sm },
  root: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
  horiz: {
    display: { default: "flex", "@media (min-width: 768px)": "grid" },
    gridTemplateColumns: "200px minmax(0, 1fr)", columnGap: 24, alignItems: "start",
  },
  head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 16 },
  headHoriz: { minHeight: { default: 16, "@media (min-width: 768px)": 32 } },
  body: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
  desc: { fontSize: font.sm, color: color.fgMuted, lineHeight: 1.45 },
  foot: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, fontSize: font.sm },
  status: { display: "flex", alignItems: "flex-start", gap: 5, lineHeight: 1.4 },
  error: { color: color.danger }, success: { color: color.success }, warning: { color: color.warning }, info: { color: color.fgMuted },
  icon: { display: "inline-flex", marginTop: 1 },
  count: { flexShrink: 0, fontVariantNumeric: "tabular-nums", color: color.fgFaint },
  countOver: { color: color.danger },
  dim: { opacity: 0.6 },
  layout: { display: "flex", flexDirection: "column", gap: 20 },
  layoutH: { gap: 24 },
  inline: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end", gap: 12 },
  section: {
    display: { default: "flex", "@media (min-width: 900px)": "grid" }, flexDirection: "column", gridTemplateColumns: "260px minmax(0, 1fr)",
    gap: 24, paddingBlock: 24, borderTopWidth: { default: 1, ":first-child": 0 }, borderTopStyle: "solid", borderTopColor: color.border,
  },
  sectionHead: { display: "flex", flexDirection: "column", gap: 4 },
  sectionTitle: { fontSize: font.lg, fontWeight: font.semibold },
});

export function Label({ xstyle, className, style, ...rest }: ComponentProps<typeof LP.Root> & StyleProps) {
  return <LP.Root {...rest} {...sx({ xstyle, className, style }, fl.label)} />;
}

export type FieldStatusType = "error" | "success" | "warning" | "info";
/** One line under a control: an error, a confirmation, a warning. */
export function FieldStatus({ type = "error", children, id }: { type?: FieldStatusType; children: ReactNode; id?: string }) {
  const Icon = type === "error" ? IconAlertCircle : type === "success" ? IconCheckCircle : type === "warning" ? IconAlertCircle : IconInfo;
  return <p id={id} role={type === "error" ? "alert" : undefined} {...px(fl.status, fl[type])}><span {...px(fl.icon)}><Icon size={14} /></span>{children}</p>;
}

export type FieldProps = StyleProps & {
  label?: ReactNode;
  /** Required mark + `required` on the control. */
  required?: boolean;
  /** "Optional" next to the label (use one convention per form). */
  optional?: boolean;
  /** Help under the label. */
  description?: ReactNode;
  /** v1 name for help text under the control. */
  help?: ReactNode;
  error?: ReactNode;
  /** A positive or cautionary status instead of an error. */
  status?: { type: Exclude<FieldStatusType, "error">; message: ReactNode };
  /** "count / max" at the end of the help row. */
  count?: { value: number; max: number };
  /** An InfoTip next to the label. */
  labelTooltip?: ReactNode;
  /** Element at the end of the label row ("Forgot password?"). */
  labelAside?: ReactNode;
  layout?: "vertical" | "horizontal";
  disabled?: boolean;
  readOnly?: boolean;
  hideLabel?: boolean;
  id?: string;
  children: ReactNode;
};

/**
 * Wires a label, description, error and count to one control — no ids by hand.
 *   <Field label="Company" required error={errors.company}><Input /></Field>
 */
export function Field({ label, required = false, optional, description, help, error, status, count, labelTooltip, labelAside, layout = "vertical", disabled = false, readOnly = false, hideLabel, id: idProp, children, ...p }: FieldProps) {
  const auto = useId();
  const id = idProp ?? `f${auto.replace(/:/g, "")}`;
  const descId = description ? `${id}-d` : undefined;
  const helpId = help ? `${id}-h` : undefined;
  const errId = error || status ? `${id}-e` : undefined;
  const invalid = Boolean(error) || (count ? count.value > count.max : false);
  const describedBy = [errId, descId, helpId].filter(Boolean).join(" ") || undefined;
  const H = layout === "horizontal";
  return (
    <FieldContext.Provider value={{ id, describedBy, invalid, required, disabled, readOnly }}>
      <div data-invalid={invalid || undefined} {...sx(p, fl.root, H && fl.horiz, disabled && fl.dim)}>
        {label && (
          <div {...px(fl.head, H && fl.headHoriz)} style={hideLabel ? { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" } : undefined}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Label htmlFor={id}>
                {label}
                {required && <span aria-hidden {...px(fl.req)}>*</span>}
                {optional && <span {...px(fl.opt)}>Optional</span>}
                {labelTooltip && <InfoTip size={12}>{labelTooltip}</InfoTip>}
              </Label>
              {description && H && <p id={descId} {...px(fl.desc)}>{description}</p>}
            </div>
            {labelAside}
          </div>
        )}
        <div {...px(fl.body)}>
          {description && !H && <p id={descId} {...px(fl.desc)} style={{ marginTop: -2 }}>{description}</p>}
          {children}
          {(help || error || status || count) && (
            <div {...px(fl.foot)}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                {error ? <FieldStatus id={errId} type="error">{error}</FieldStatus> : status && <FieldStatus id={errId} type={status.type}>{status.message}</FieldStatus>}
                {help && <p id={helpId} {...px(fl.desc)}>{help}</p>}
              </div>
              {count && <span aria-live="polite" {...px(fl.count, count.value > count.max && fl.countOver)}>{count.value} / {count.max}</span>}
            </div>
          )}
        </div>
      </div>
    </FieldContext.Provider>
  );
}
/** v1 name. */
export const FormField = Field;

/** Stacks Fields with consistent spacing. `inline` puts them on one wrapping row (filters, quick add). */
export function FormLayout({ layout = "vertical", children, ...p }: { layout?: "vertical" | "horizontal" | "inline"; children: ReactNode } & StyleProps) {
  return <div {...sx(p, fl.layout, layout === "horizontal" && fl.layoutH, layout === "inline" && fl.inline)}>{children}</div>;
}

/** A titled group of fields in a long form: title + description on the left, fields on the right. */
export function FormSection({ title, description, children, ...p }: { title: ReactNode; description?: ReactNode; children: ReactNode } & StyleProps) {
  return (
    <section {...sx(p, fl.section)}>
      <div {...px(fl.sectionHead)}><h3 {...px(fl.sectionTitle)}>{title}</h3>{description && <p {...px(fl.desc)}>{description}</p>}</div>
      <div {...px(fl.layout)}>{children}</div>
    </section>
  );
}

/* ============================================================== Input */

export type InputSize = "sm" | "md" | "lg";
export type InputProps = Omit<ComponentProps<"input">, "size" | "prefix" | "className" | "style"> & StyleProps & {
  size?: InputSize;
  invalid?: boolean;
  /** Icon at the start. */
  leading?: ReactNode;
  /** Icon/kbd at the end. */
  trailing?: ReactNode;
  /** Text inside the well before the value: "https://", "$". */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** A clear (×) button when there's a value. */
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  /** No well until hover/focus — for inline table edits and toolbars. */
  variant?: "default" | "flat";
};

/** Single-line text. Picks up label/error wiring from a surrounding Field. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid: inv, leading, trailing, prefix, suffix, clearable, onClear, loading, variant = "default", disabled: dis, readOnly: ro, required: req, id: idP, xstyle, className, style, ...rest },
  ref,
) {
  const f = useField({ id: idP, invalid: inv, disabled: dis, readOnly: ro, required: req });
  const grouped = useContext(InGroup);
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  const [has, setHas] = useState(Boolean(rest.value ?? rest.defaultValue));
  useEffect(() => { if (rest.value !== undefined) setHas(Boolean(rest.value)); }, [rest.value]);
  return (
    <IconSizeContext.Provider value={size === "lg" ? 16 : 14}>
      <div onMouseDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); inner.current?.focus(); } }}
        {...sx({ xstyle, className, style }, field.shell, size !== "md" && field[size], variant === "flat" && field.flat, f.invalid && field.invalid, f.readOnly && field.readOnly, f.disabled && field.disabled, grouped && field.grouped)}>
        {leading && <span {...px(field.addon)}>{leading}</span>}
        {prefix && <span {...px(field.addon, field.addonText)}>{prefix}</span>}
        <input ref={inner} id={f.id} aria-describedby={f["aria-describedby"]} aria-invalid={f.invalid || undefined}
          disabled={f.disabled} readOnly={f.readOnly} required={f.required}
          {...rest}
          onChange={(e) => { setHas(Boolean(e.target.value)); rest.onChange?.(e); }}
          {...px(field.input)} />
        {loading && <Spinner size={14} tone="muted" label="" />}
        {clearable && has && !f.disabled && !f.readOnly && (
          <button type="button" aria-label="Clear" {...px(field.clear)} onClick={() => {
            const el = inner.current; if (!el) return;
            const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
            set?.call(el, ""); el.dispatchEvent(new Event("input", { bubbles: true })); setHas(false); onClear?.(); el.focus();
          }}><IconX size={12} /></button>
        )}
        {suffix && <span {...px(field.addon, field.addonText)}>{suffix}</span>}
        {trailing && <span {...px(field.addon)}>{trailing}</span>}
      </div>
    </IconSizeContext.Provider>
  );
});
/** Astryx-style name. */
export const TextInput = Input;

/** Search: magnifier, clear button, optional shortcut hint ("/"). */
export const SearchInput = forwardRef<HTMLInputElement, InputProps & { shortcut?: string }>(function SearchInput({ shortcut, placeholder = "Search…", ...rest }, ref) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  useEffect(() => {
    if (!shortcut) return;
    const on = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement;
      if (e.key === shortcut && !/input|textarea|select/i.test(tgt.tagName) && !tgt.isContentEditable) { e.preventDefault(); inner.current?.focus(); }
    };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [shortcut]);
  return <Input ref={inner} type="search" leading={<IconSearch />} placeholder={placeholder} clearable trailing={shortcut ? <Kbd>{shortcut}</Kbd> : undefined} {...rest} />;
});

const pw = stylex.create({ eye: { display: "inline-flex", color: { default: color.icon, ":hover": color.fg }, borderRadius: radius.xs, outline: "none", ":focus-visible": { boxShadow: depth.focus } } });
/** Password with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false);
  return <Input ref={ref} type={show ? "text" : "password"} autoComplete="current-password" trailing={
    <button type="button" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} onClick={() => setShow((v) => !v)} {...px(pw.eye)}>{show ? <IconEyeOff /> : <IconEye />}</button>
  } {...props} />;
});

/* ============================================================== NumberInput */

const nm = stylex.create({
  steppers: { display: "flex", flexDirection: "column", alignSelf: "stretch", marginInlineEnd: -6, marginBlock: 3, gap: 1 },
  step: {
    display: "flex", alignItems: "center", justifyContent: "center", flex: 1, width: 18, borderRadius: 4, color: color.icon,
    backgroundColor: { default: "transparent", ":hover": color.hover }, ":disabled": { opacity: 0.35 },
  },
  side: {
    display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: radius.sm, flexShrink: 0,
    color: color.fgSoft, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: { default: depth.raised, ":active": depth.pressed },
    ":disabled": { opacity: 0.4 },
  },
  center: { textAlign: "center", fontVariantNumeric: "tabular-nums" },
  tab: { fontVariantNumeric: "tabular-nums" },
});

export type NumberInputProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (v: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Units after the number: "kg", "%". */
  units?: string;
  /** "inline" ▲▼ in the well (default), "sides" −/+ buttons around the value. */
  steppers?: "inline" | "sides" | "none";
  integer?: boolean;
  format?: (n: number) => string;
};

/** A number with steppers, ↑/↓ keys, clamping and optional units. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = null, onValueChange, min, max, step = 1, units, steppers = "inline", integer, format, disabled, ...rest }, ref,
) {
  const [inner, setInner] = useState<number | null>(defaultValue);
  const v = value === undefined ? inner : value;
  const [text, setText] = useState(v == null ? "" : String(v));
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (!focused) setText(v == null ? "" : format ? format(v) : String(v)); }, [v, focused, format]);
  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, integer ? Math.round(n) : n));
  const commit = (n: number | null) => { const nv = n == null || Number.isNaN(n) ? null : clamp(n); setInner(nv); onValueChange?.(nv); setText(nv == null ? "" : String(nv)); };
  const bump = (d: number) => commit(Number(((v ?? min ?? 0) + d * step).toFixed(6)));
  const dec = <button type="button" tabIndex={-1} aria-label="Decrease" disabled={disabled || (min !== undefined && (v ?? 0) <= min)} onClick={() => bump(-1)} {...px(steppers === "sides" ? nm.side : nm.step)}>{steppers === "sides" ? <IconMinus size={12} /> : <IconChevronDown size={12} />}</button>;
  const inc = <button type="button" tabIndex={-1} aria-label="Increase" disabled={disabled || (max !== undefined && (v ?? 0) >= max)} onClick={() => bump(1)} {...px(steppers === "sides" ? nm.side : nm.step)}>{steppers === "sides" ? <IconPlus size={12} /> : <IconChevronUp size={12} />}</button>;
  return (
    <Input ref={ref} inputMode={integer ? "numeric" : "decimal"} role="spinbutton" aria-valuemin={min} aria-valuemax={max} aria-valuenow={v ?? undefined}
      value={text} disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); commit(text.trim() === "" ? null : Number(text.replace(/[^\d.-]/g, ""))); }}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => { if (e.key === "ArrowUp") { e.preventDefault(); bump(e.shiftKey ? 10 : 1); } if (e.key === "ArrowDown") { e.preventDefault(); bump(e.shiftKey ? -10 : -1); } if (e.key === "Enter") commit(Number(text)); }}
      leading={steppers === "sides" ? dec : rest.leading}
      suffix={units}
      trailing={steppers === "inline" ? <span {...px(nm.steppers)}>{inc}{dec}</span> : steppers === "sides" ? inc : rest.trailing}
      xstyle={steppers === "sides" ? nm.center : nm.tab}
      {...rest} />
  );
});

/* ============================================================== TextArea */

const ta = stylex.create({
  shell: { height: "auto", alignItems: "stretch", paddingBlock: 8, cursor: "text", flexDirection: "column", gap: 6 },
  area: { width: "100%", minHeight: 64, resize: "vertical", outline: "none", backgroundColor: "transparent", color: "inherit", fontSize: "inherit", lineHeight: 1.55, "::placeholder": { color: color.fgFaint } },
  noResize: { resize: "none", overflow: "hidden" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
});

export type TextAreaProps = Omit<ComponentProps<"textarea">, "className" | "style"> & StyleProps & {
  invalid?: boolean;
  /** Grow with the content instead of scrolling. */
  autoGrow?: boolean;
  /** Toolbar or hints under the text, inside the well. */
  footer?: ReactNode;
};

/** Multi-line text. `autoGrow` to fit content. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ invalid: inv, autoGrow, footer, disabled: dis, readOnly: ro, required: req, id: idP, rows = 3, xstyle, className, style, ...rest }, ref) {
  const f = useField({ id: idP, invalid: inv, disabled: dis, readOnly: ro, required: req });
  const inner = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => inner.current!);
  const fit = () => { const el = inner.current; if (!el || !autoGrow) return; el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; };
  useLayoutEffect(fit, [rest.value, autoGrow]);
  return (
    <div {...sx({ xstyle, className, style }, field.shell, ta.shell, f.invalid && field.invalid, f.readOnly && field.readOnly, f.disabled && field.disabled)}>
      <textarea ref={inner} rows={rows} id={f.id} aria-describedby={f["aria-describedby"]} aria-invalid={f.invalid || undefined}
        disabled={f.disabled} readOnly={f.readOnly} required={f.required} {...rest}
        onChange={(e) => { fit(); rest.onChange?.(e); }} {...px(ta.area, autoGrow && ta.noResize)} />
      {footer && <div {...px(ta.footer)}>{footer}</div>}
    </div>
  );
});
/** v1 name. */
export const Textarea = TextArea;

/* ============================================================== InputGroup */

const ig = stylex.create({
  root: {
    display: "flex", alignItems: "stretch", width: "100%", borderRadius: radius.md, boxShadow: depth.recessed, backgroundColor: color.surface,
    ":focus-within": { boxShadow: `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
  },
  part: { display: "flex", alignItems: "center", paddingInline: 10, fontSize: font.md, color: color.fgMuted, backgroundColor: color.surfaceSunken, flexShrink: 0 },
  start: { borderStartStartRadius: radius.md, borderEndStartRadius: radius.md, borderInlineEndWidth: 1, borderInlineEndStyle: "solid", borderInlineEndColor: color.border },
  end: { borderStartEndRadius: radius.md, borderEndEndRadius: radius.md, borderInlineStartWidth: 1, borderInlineStartStyle: "solid", borderInlineStartColor: color.border },
  mid: { flex: 1, minWidth: 0, display: "flex" },
});

/** A control with attached add-ons on either side: "https://" [ domain ] ".com", or [ amount ][ Select currency ]. */
export function InputGroup({ start, end, children, ...p }: { start?: ReactNode; end?: ReactNode; children: ReactNode } & StyleProps) {
  return (
    <div {...sx(p, ig.root)}>
      {start && <div {...px(ig.part, ig.start)}>{start}</div>}
      <div {...px(ig.mid)}><InGroup.Provider value>{children}</InGroup.Provider></div>
      {end && <div {...px(ig.part, ig.end)}>{end}</div>}
    </div>
  );
}
