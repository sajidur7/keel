import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useImperativeHandle, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useField } from "./field";
import { IconEye, IconEyeOff, IconMinus, IconPlus, IconSearch, IconX } from "./icons";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/*
  Every text-like control shares one "field shell": a 1px ring (shadow-field) on the card
  surface. Hover strengthens the ring, focus shows the focus ring, invalid turns it red,
  read-only drops the ring to the quieter surface. Nothing else changes between states,
  so a form full of fields stays calm.
*/
export const fieldShell = cva(
  [
    "group/field relative flex w-full min-w-0 items-center gap-2 rounded-md bg-card text-foreground shadow-field",
    "transition-[box-shadow,background-color] duration-fast ease-out",
    "hover:shadow-[0_0_0_1px_var(--line-strong)]",
    "focus-within:shadow-focus! has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
    "[&_svg]:shrink-0 [&_svg]:text-icon",
  ],
  {
    variants: {
      size: {
        sm: "h-[26px] px-2 text-caption [&_svg]:size-3.5",
        md: "h-[30px] px-2.5 text-small [&_svg]:size-3.5",
        lg: "h-9 px-3 text-body [&_svg]:size-4",
      },
      invalid: { true: "shadow-[0_0_0_1px_var(--danger)]! focus-within:shadow-[0_0_0_2px_var(--background),0_0_0_4px_color-mix(in_srgb,var(--danger)_55%,transparent)]!" },
      readOnly: { true: "bg-surface shadow-none! hover:shadow-none!" },
    },
    defaultVariants: { size: "md" },
  },
);

const bareInput =
  "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-faint disabled:cursor-not-allowed read-only:cursor-default [font:inherit]";

export type InputProps = Omit<ComponentProps<"input">, "size" | "prefix"> &
  VariantProps<typeof fieldShell> & {
    /** Icon shown inside the field on the left. */
    leading?: ReactNode;
    /** Text add-on before the value, e.g. "https://". */
    prefix?: ReactNode;
    /** Text add-on after the value, e.g. "USD" or a kbd hint. */
    suffix?: ReactNode;
    /** Icon or control on the right. */
    trailing?: ReactNode;
    /** Shows a clear button when there's a value. */
    clearable?: boolean;
    onClear?: () => void;
    invalid?: boolean;
    shellClassName?: string;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, leading, prefix, suffix, trailing, clearable, onClear, invalid: invalidProp, readOnly: roProp, disabled: disProp, required: reqProp, id: idProp, className, shellClassName, ...props },
  ref,
) {
  const field = useField({ id: idProp, invalid: invalidProp, readOnly: roProp, disabled: disProp, required: reqProp });
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);

  const controlled = props.value !== undefined;
  const [hasValue, setHasValue] = useState(Boolean(props.defaultValue));
  const showClear = clearable && !field.readOnly && !field.disabled && (controlled ? String(props.value ?? "") !== "" : hasValue);

  return (
    <div
      className={cn(fieldShell({ size, invalid: field.invalid, readOnly: field.readOnly }), shellClassName)}
      onMouseDown={(e) => {
        // Clicking padding/icons focuses the input, like a native field.
        if (e.target === e.currentTarget) {
          e.preventDefault();
          inner.current?.focus();
        }
      }}
    >
      {leading}
      {prefix && <span className="shrink-0 text-subtle">{prefix}</span>}
      <input
        ref={inner}
        id={field.id}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field.invalid || undefined}
        readOnly={field.readOnly}
        disabled={field.disabled}
        required={field.required}
        className={cn(bareInput, className)}
        {...props}
        onChange={(e) => {
          setHasValue(e.target.value !== "");
          props.onChange?.(e);
        }}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Clear"
          className="-mr-1 inline-flex size-5 items-center justify-center rounded-sm text-subtle outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus"
          onClick={() => {
            const el = inner.current;
            if (el && !controlled) {
              el.value = "";
              setHasValue(false);
            }
            onClear?.();
            el?.focus();
          }}
        >
          <IconX size={12} />
        </button>
      )}
      {suffix && <span className="shrink-0 text-subtle">{suffix}</span>}
      {trailing}
    </div>
  );
});

/** Search field with a leading icon, clear button and optional ⌘K hint. */
export const SearchInput = forwardRef<HTMLInputElement, InputProps & { shortcut?: string }>(function SearchInput(
  { shortcut, placeholder = "Search", ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="search"
      role="searchbox"
      placeholder={placeholder}
      leading={<IconSearch />}
      clearable
      suffix={shortcut ? <Kbd>{shortcut}</Kbd> : undefined}
      className="[&::-webkit-search-cancel-button]:hidden"
      {...props}
    />
  );
});

/** Password field with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      trailing={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="-mr-1 inline-flex size-6 items-center justify-center rounded-sm outline-none hover:bg-hover focus-visible:shadow-focus"
        >
          {visible ? <IconEyeOff /> : <IconEye />}
        </button>
      }
      {...props}
    />
  );
});

export type NumberInputProps = Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
};

/** Number field with stepper buttons. Arrow keys step, Shift+Arrow steps ×10. Value is clamped on blur. */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue, onValueChange, min = -Infinity, max = Infinity, step = 1, ...props },
  ref,
) {
  const [inner, setInner] = useState<number | null>(defaultValue ?? null);
  const current = value !== undefined ? value : inner;
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = (n: number | null) => {
    const next = n === null || Number.isNaN(n) ? null : clamp(Number(n.toFixed(6)));
    if (value === undefined) setInner(next);
    onValueChange?.(next);
    setDraft(null);
  };
  const bump = (dir: 1 | -1, mult = 1) => commit((current ?? 0) + dir * step * mult);
  const disabled = props.disabled || props.readOnly;

  const stepBtn = (dir: 1 | -1) => (
    <button
      type="button"
      tabIndex={-1}
      aria-label={dir > 0 ? "Increase" : "Decrease"}
      disabled={disabled || (dir > 0 ? (current ?? 0) >= max : (current ?? 0) <= min)}
      onClick={() => bump(dir)}
      className="inline-flex size-5 items-center justify-center rounded-sm text-subtle hover:bg-hover hover:text-foreground disabled:opacity-40"
    >
      {dir > 0 ? <IconPlus size={12} /> : <IconMinus size={12} />}
    </button>
  );

  return (
    <Input
      ref={ref}
      inputMode="decimal"
      role="spinbutton"
      aria-valuemin={Number.isFinite(min) ? min : undefined}
      aria-valuemax={Number.isFinite(max) ? max : undefined}
      aria-valuenow={current ?? undefined}
      className="tabular"
      value={draft ?? (current === null ? "" : String(current))}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => draft !== null && commit(draft.trim() === "" ? null : Number(draft))}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") { e.preventDefault(); bump(1, e.shiftKey ? 10 : 1); }
        if (e.key === "ArrowDown") { e.preventDefault(); bump(-1, e.shiftKey ? 10 : 1); }
        if (e.key === "Enter" && draft !== null) commit(Number(draft));
      }}
      trailing={
        <span className="-mr-1 flex items-center gap-0.5">
          {stepBtn(-1)}
          {stepBtn(1)}
        </span>
      }
      {...props}
    />
  );
});

export type TextareaProps = ComponentProps<"textarea"> & { invalid?: boolean; autoGrow?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid: invalidProp, readOnly: roProp, disabled: disProp, required: reqProp, id: idProp, className, autoGrow, rows = 3, ...props },
  ref,
) {
  const field = useField({ id: idProp, invalid: invalidProp, readOnly: roProp, disabled: disProp, required: reqProp });
  return (
    <textarea
      ref={ref}
      rows={rows}
      id={field.id}
      aria-describedby={field["aria-describedby"]}
      aria-invalid={field.invalid || undefined}
      readOnly={field.readOnly}
      disabled={field.disabled}
      required={field.required}
      className={cn(
        "block w-full min-w-0 resize-y rounded-md bg-card px-2.5 py-2 text-small text-foreground shadow-field outline-none",
        "transition-[box-shadow] duration-fast ease-out placeholder:text-faint",
        "hover:shadow-[0_0_0_1px_var(--line-strong)] focus-visible:shadow-focus!",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "read-only:bg-surface read-only:shadow-none",
        field.invalid && "shadow-[0_0_0_1px_var(--danger)]!",
        autoGrow && "field-sizing-content resize-none",
        className,
      )}
      {...props}
    />
  );
});
