/**
 * Form controls — choices.
 * Checkbox (CheckboxInput) · CheckboxList · Radio · RadioGroup · RadioList · Switch · Slider · RangeSlider
 */
import * as stylex from "@stylexjs/stylex";
import { Checkbox as CB, RadioGroup as RG, Slider as SL, Switch as SW } from "radix-ui";
import { forwardRef, useId, useState, type ComponentProps, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { useField } from "./inputs";
import { px, sx, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";

const ch = stylex.create({
  row: { display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 },
  rowEnd: { flexDirection: "row-reverse", justifyContent: "space-between" },
  ctlWrap: { display: "inline-flex", alignItems: "center", height: 20, flexShrink: 0 },
  text: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0, paddingTop: 1 },
  label: { fontSize: font.md, lineHeight: 1.4, color: color.fg, cursor: "pointer", userSelect: "none" },
  desc: { fontSize: font.sm, lineHeight: 1.45, color: color.fgMuted },
  off: { opacity: 0.5 },
  offLabel: { cursor: "not-allowed" },
  // checkbox
  box: {
    position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, flexShrink: 0,
    borderRadius: 4, color: color.onAccent, cursor: "pointer", outline: "none",
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`,
    boxShadow: {
      default: `inset 0 1px 0 ${color.highlight}, 0 0 0 1px ${color.borderStrong}, 0 1px 2px ${color.shadeXs}`,
      ":hover": `inset 0 1px 0 ${color.highlight}, 0 0 0 1px ${color.fgFaint}, 0 1px 2px ${color.shadeSm}`,
      ":focus-visible": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}`,
    },
    transitionProperty: "background-image, box-shadow, transform", transitionDuration: motion.fast,
    transform: { default: null, ":active": "scale(0.92)" },
    ":disabled": { cursor: "not-allowed" },
  },
  boxOn: {
    backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`,
    boxShadow: {
      default: `inset 0 1px 0 ${color.inkHighlight}, 0 0 0 1px ${color.inkRing}, 0 1px 2px ${color.shadeSm}`,
      ":hover": `inset 0 1px 0 ${color.inkHighlight}, 0 0 0 1px ${color.inkRing}, 0 1px 3px ${color.shadeMd}`,
      ":focus-visible": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}`,
    },
  },
  boxInvalid: { boxShadow: { default: `0 0 0 1px ${color.danger}`, ":hover": `0 0 0 1px ${color.danger}` } },
  sm: { width: 14, height: 14, borderRadius: 3.5 },
  check: { display: "flex" },
  // radio
  radio: { borderRadius: "50%" },
  dot: { width: 6, height: 6, borderRadius: "50%", backgroundColor: color.onAccent, boxShadow: "0 1px 1px rgba(0,0,0,0.2)" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  listH: { flexDirection: "row", flexWrap: "wrap", gap: 18 },
  listDivided: { gap: 0 },
  dividedItem: { paddingBlock: 10, borderBottomWidth: { default: 1, ":last-child": 0 }, borderBottomStyle: "solid", borderBottomColor: color.border },
  legend: { fontSize: font.md, fontWeight: font.medium, marginBottom: 8, color: color.fg },
  groupDesc: { fontSize: font.sm, color: color.fgMuted, marginTop: -4, marginBottom: 10 },
  fieldset: { minWidth: 0 },
  // cards
  cardItem: {
    flex: 1, minWidth: 180, padding: 12, borderRadius: radius.lg, cursor: "pointer", backgroundColor: color.surface,
    boxShadow: { default: depth.card, ":hover": depth.cardHover },
    transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  cardOn: { boxShadow: { default: `0 0 0 1.5px ${color.accent}, 0 0 0 5px ${color.focusRing}`, ":hover": `0 0 0 1.5px ${color.accent}, 0 0 0 5px ${color.focusRing}` } },
  // switch
  sw: {
    position: "relative", display: "inline-flex", alignItems: "center", flexShrink: 0, padding: 2, borderRadius: radius.full, cursor: "pointer", outline: "none",
    backgroundColor: color.muted,
    boxShadow: { default: `inset 0 1px 2px ${color.shadeSm}, inset 0 0 0 1px ${color.borderStrong}`, ":focus-visible": `inset 0 1px 2px ${color.shadeSm}, 0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
    transitionProperty: "background-color, background-image, box-shadow", transitionDuration: motion.base,
    ":disabled": { cursor: "not-allowed" },
  },
  swOn: {
    backgroundImage: `linear-gradient(180deg, ${color.accentBottom}, ${color.accentTop})`,
    boxShadow: { default: `inset 0 1px 2px rgba(0,0,0,0.25), inset 0 0 0 1px ${color.accentBottom}`, ":focus-visible": `inset 0 1px 2px rgba(0,0,0,0.25), 0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
  },
  swMd: { width: 34, height: 20 },
  swSm: { width: 28, height: 16 },
  knob: {
    display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: color.knob, boxShadow: depth.knob,
    transitionProperty: "transform, width", transitionDuration: motion.base, transitionTimingFunction: motion.spring, color: color.accent,
  },
  knobMd: { width: 16, height: 16, ":is([data-state=checked])": { transform: "translateX(14px)" } },
  knobSm: { width: 12, height: 12, ":is([data-state=checked])": { transform: "translateX(12px)" } },
  // slider
  slider: { display: "flex", alignItems: "center", gap: 12, width: "100%" },
  slRoot: { position: "relative", display: "flex", alignItems: "center", width: "100%", height: 20, touchAction: "none", userSelect: "none", ":is([data-disabled])": { opacity: 0.5 } },
  slTrack: { position: "relative", flexGrow: 1, height: 6, overflow: "hidden", borderRadius: radius.full, backgroundColor: color.muted, boxShadow: `inset 0 1px 2px ${color.shadeSm}` },
  slRange: { position: "absolute", height: "100%", borderRadius: radius.full, backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})` },
  slThumb: {
    display: "block", width: 18, height: 18, borderRadius: "50%", cursor: "grab", outline: "none",
    backgroundImage: `linear-gradient(180deg, ${color.knob}, ${color.buttonBottom})`,
    boxShadow: { default: `${depth.knob}, inset 0 0 0 1px ${color.border}`, ":focus-visible": `${depth.knob}, 0 0 0 4px ${color.focusRing}` },
    transitionProperty: "transform, box-shadow", transitionDuration: motion.fast,
    transform: { default: null, ":active": "scale(1.1)" },
  },
  slValue: { minWidth: 40, flexShrink: 0, textAlign: "right", fontSize: font.sm, color: color.fgSoft, fontVariantNumeric: "tabular-nums" },
  marks: { position: "relative", height: 16, marginTop: 4, marginInline: 9, fontSize: font.xs, color: color.fgFaint },
  mark: { position: "absolute", transform: "translateX(-50%)", whiteSpace: "nowrap" },
});

const CheckSvg = ({ indeterminate }: { indeterminate?: boolean }) => indeterminate
  ? <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  : <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M1.75 5.25l2.1 2.1L8.25 2.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function Labelled({ id, label, description, disabled, end, children, xstyle }: { id: string; label?: ReactNode; description?: ReactNode; disabled?: boolean; end?: boolean; children: ReactNode } & StyleProps) {
  if (!label) return <>{children}</>;
  return (
    <div {...sx({ xstyle }, ch.row, end && ch.rowEnd, disabled && ch.off)}>
      <span {...px(ch.ctlWrap)}>{children}</span>
      <div {...px(ch.text)}>
        <label htmlFor={id} {...px(ch.label, disabled && ch.offLabel)}>{label}</label>
        {description && <p {...px(ch.desc)}>{description}</p>}
      </div>
    </div>
  );
}

/* ============================================================== Checkbox */

export type CheckboxProps = Omit<ComponentProps<typeof CB.Root>, "className" | "style"> & StyleProps & {
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
  size?: "sm" | "md";
};

/** A yes/no choice. `checked="indeterminate"` for "some selected". Raised box that turns accent when on. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox({ label, description, invalid, size = "md", id: idP, xstyle, className, style, ...rest }, ref) {
  const f = useField({ id: idP, invalid });
  const auto = useId();
  const id = f.id ?? auto;
  const [inner, setInner] = useState(rest.defaultChecked ?? false);
  const state = rest.checked ?? inner;
  const on = state === true || state === "indeterminate";
  return (
    <Labelled id={id} label={label} description={description} disabled={rest.disabled} xstyle={label ? xstyle : undefined}>
      <CB.Root ref={ref} id={id} aria-invalid={f.invalid || undefined} aria-describedby={f["aria-describedby"]} {...rest}
        onCheckedChange={(v) => { setInner(v); rest.onCheckedChange?.(v); }}
        {...sx(label ? undefined : { xstyle, className, style }, ch.box, size === "sm" && ch.sm, on && ch.boxOn, f.invalid && !on && ch.boxInvalid)}>
        <CB.Indicator {...px(ch.check)}><CheckSvg indeterminate={state === "indeterminate"} /></CB.Indicator>
      </CB.Root>
    </Labelled>
  );
});
export const CheckboxInput = Checkbox;

export type ChoiceOption = { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean };

/** Several checkboxes under one label. `value` is the array of checked values. */
export function CheckboxList({ label, description, options, value, defaultValue = [], onValueChange, orientation = "vertical", dividers, disabled, ...p }: StyleProps & {
  label?: ReactNode; description?: ReactNode; options: ChoiceOption[]; value?: string[]; defaultValue?: string[];
  onValueChange?: (v: string[]) => void; orientation?: "vertical" | "horizontal"; dividers?: boolean; disabled?: boolean;
}) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const set = (val: string, on: boolean) => { const next = on ? [...v, val] : v.filter((x) => x !== val); setInner(next); onValueChange?.(next); };
  return (
    <fieldset {...sx(p, ch.fieldset)} disabled={disabled}>
      {label && <legend {...px(ch.legend)}>{label}</legend>}
      {description && <p {...px(ch.groupDesc)}>{description}</p>}
      <div {...px(ch.list, orientation === "horizontal" && ch.listH, dividers && ch.listDivided)}>
        {options.map((o) => <Checkbox key={o.value} label={o.label} description={o.description} disabled={disabled || o.disabled} checked={v.includes(o.value)} onCheckedChange={(c) => set(o.value, c === true)} xstyle={dividers && ch.dividedItem} />)}
      </div>
    </fieldset>
  );
}

/* ============================================================== Radio */

export function RadioGroup({ orientation = "vertical", xstyle, className, style, ...rest }: ComponentProps<typeof RG.Root> & StyleProps) {
  return <RG.Root orientation={orientation} {...rest} {...sx({ xstyle, className, style }, ch.list, orientation === "horizontal" && ch.listH)} />;
}

/** One option in a RadioGroup. */
export function Radio({ label, description, id: idP, xstyle, ...rest }: Omit<ComponentProps<typeof RG.Item>, "className" | "style"> & StyleProps & { label?: ReactNode; description?: ReactNode }) {
  const auto = useId();
  const id = idP ?? auto;
  return (
    <Labelled id={id} label={label} description={description} disabled={rest.disabled} xstyle={xstyle}>
      <RG.Item id={id} {...rest} {...px(ch.box, ch.radio)}>
        <RG.Indicator asChild><span {...px(ch.box, ch.radio, ch.boxOn)} style={{ position: "absolute", inset: 0 }}><span {...px(ch.dot)} /></span></RG.Indicator>
      </RG.Item>
    </Labelled>
  );
}

/** Pick exactly one from a short list (≤ 6). `variant="card"` for bigger, described choices (plans). */
export function RadioList({ label, description, options, value, defaultValue, onValueChange, orientation = "vertical", variant = "default", disabled, ...p }: StyleProps & {
  label?: ReactNode; description?: ReactNode; options: ChoiceOption[]; value?: string; defaultValue?: string;
  onValueChange?: (v: string) => void; orientation?: "vertical" | "horizontal"; variant?: "default" | "card"; disabled?: boolean;
}) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  return (
    <fieldset {...sx(p, ch.fieldset)}>
      {label && <legend {...px(ch.legend)}>{label}</legend>}
      {description && <p {...px(ch.groupDesc)}>{description}</p>}
      <RadioGroup value={v} onValueChange={(nv) => { setInner(nv); onValueChange?.(nv); }} orientation={variant === "card" ? "horizontal" : orientation} disabled={disabled}>
        {options.map((o) => variant === "card"
          ? (
            <label key={o.value} {...px(ch.cardItem, v === o.value && ch.cardOn, (disabled || o.disabled) && ch.off)}>
              <span {...px(ch.row)}>
                <span {...px(ch.ctlWrap)}><RG.Item value={o.value} disabled={o.disabled} {...px(ch.box, ch.radio)}>
                  <RG.Indicator asChild><span {...px(ch.box, ch.radio, ch.boxOn)} style={{ position: "absolute", inset: 0 }}><span {...px(ch.dot)} /></span></RG.Indicator>
                </RG.Item></span>
                <span {...px(ch.text)}><span {...px(ch.label)}>{o.label}</span>{o.description && <span {...px(ch.desc)}>{o.description}</span>}</span>
              </span>
            </label>
          )
          : <Radio key={o.value} value={o.value} label={o.label} description={o.description} disabled={o.disabled} />)}
      </RadioGroup>
    </fieldset>
  );
}

/* ============================================================== Switch */

export type SwitchProps = Omit<ComponentProps<typeof SW.Root>, "className" | "style"> & StyleProps & {
  label?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md";
  /** Label on the left, switch at the end of the row (settings lists). */
  labelPosition?: "left" | "right";
  /** Saving: a spinner in the knob, input disabled. */
  loading?: boolean;
};

/** On/off that takes effect immediately. Use Checkbox when a Save button applies it. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ label, description, size = "md", labelPosition = "right", loading, id: idP, xstyle, className, style, ...rest }, ref) {
  const auto = useId();
  const id = idP ?? auto;
  const [inner, setInner] = useState(rest.defaultChecked ?? false);
  const on = rest.checked ?? inner;
  return (
    <Labelled id={id} label={label} description={description} disabled={rest.disabled} end={labelPosition === "left"} xstyle={label ? xstyle : undefined}>
      <SW.Root ref={ref} id={id} {...rest} disabled={rest.disabled || loading} aria-busy={loading || undefined}
        onCheckedChange={(v) => { setInner(v); rest.onCheckedChange?.(v); }}
        {...sx(label ? undefined : { xstyle, className, style }, ch.sw, size === "md" ? ch.swMd : ch.swSm, on && ch.swOn)}>
        <SW.Thumb {...px(ch.knob, size === "md" ? ch.knobMd : ch.knobSm)}>{loading && <Spinner size={size === "md" ? 10 : 8} label="" />}</SW.Thumb>
      </SW.Root>
    </Labelled>
  );
});

/* ============================================================== Slider */

export type SliderProps = Omit<ComponentProps<typeof SL.Root>, "className" | "style"> & StyleProps & {
  /** Show the current value(s) at the end. */
  showValue?: boolean;
  format?: (v: number) => string;
  /** Labels under the track at these values. */
  marks?: { value: number; label: ReactNode }[];
};

/** Pick a value (or a range, with two values) on a continuous scale. */
export function Slider({ showValue, format = (v) => String(v), marks, xstyle, className, style, ...rest }: SliderProps) {
  const [inner, setInner] = useState(rest.defaultValue ?? [rest.min ?? 0]);
  const vals = rest.value ?? inner;
  const min = rest.min ?? 0; const max = rest.max ?? 100;
  return (
    <div {...sx({ xstyle, className, style })} style={{ width: "100%", ...style }}>
      <div {...px(ch.slider)}>
        <SL.Root {...rest} onValueChange={(v) => { setInner(v); rest.onValueChange?.(v); }} {...px(ch.slRoot)}>
          <SL.Track {...px(ch.slTrack)}><SL.Range {...px(ch.slRange)} /></SL.Track>
          {vals.map((_, i) => <SL.Thumb key={i} aria-label={rest["aria-label"] ?? (vals.length > 1 ? (i === 0 ? "Minimum" : "Maximum") : "Value")} {...px(ch.slThumb)} />)}
        </SL.Root>
        {showValue && <span {...px(ch.slValue)}>{vals.map(format).join(" – ")}</span>}
      </div>
      {marks && <div {...px(ch.marks)} style={showValue ? { marginInlineEnd: 61 } : undefined}>{marks.map((m) => <span key={m.value} {...px(ch.mark)} style={{ left: `${((m.value - min) / (max - min)) * 100}%` }}>{m.label}</span>)}</div>}
    </div>
  );
}
/** Two thumbs. Same as Slider with a two-value array. */
export const RangeSlider = (p: SliderProps) => <Slider defaultValue={p.defaultValue ?? [25, 75]} {...p} />;
