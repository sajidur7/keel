import { Checkbox as CB, RadioGroup as RG, Switch as SW } from "radix-ui";
import { forwardRef, useId, type ComponentProps, type ReactNode } from "react";
import { useField } from "./field";
import { cn } from "../lib/cn";

const box =
  "peer inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-card shadow-[0_0_0_1px_var(--line-strong)] outline-none " +
  "transition-[background-color,box-shadow] duration-fast ease-out hover:shadow-[0_0_0_1px_var(--faint)] " +
  "focus-visible:shadow-focus! disabled:cursor-not-allowed disabled:opacity-45 " +
  "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-none " +
  "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:shadow-none " +
  "aria-invalid:shadow-[0_0_0_1px_var(--danger)]";

export type CheckboxProps = ComponentProps<typeof CB.Root> & {
  label?: ReactNode;
  description?: ReactNode;
  invalid?: boolean;
};

/** Checkbox with optional label. `checked="indeterminate"` shows a dash (e.g. "select all" when some rows are selected). */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, description, invalid, className, id: idProp, ...props },
  ref,
) {
  const field = useField({ id: idProp, invalid });
  const auto = useId();
  const id = field.id ?? auto;
  const control = (
    <CB.Root
      ref={ref}
      id={id}
      aria-invalid={field.invalid || undefined}
      aria-describedby={field["aria-describedby"]}
      className={cn(box, !label && className)}
      {...props}
    >
      <CB.Indicator className="flex items-center justify-center">
        {props.checked === "indeterminate" ? (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 5h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M1.75 5.25l2.1 2.1L8.25 2.9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </CB.Indicator>
    </CB.Root>
  );
  if (!label) return control;
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <span className="flex h-[18px] items-center">{control}</span>
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-small leading-[18px] text-foreground select-none peer-disabled:opacity-50">
          {label}
        </label>
        {description && <span className="text-caption text-subtle">{description}</span>}
      </div>
    </div>
  );
});

/* ---------------- Radio ---------------- */

export function RadioGroup({ className, orientation = "vertical", ...props }: ComponentProps<typeof RG.Root>) {
  return (
    <RG.Root
      orientation={orientation}
      className={cn(orientation === "vertical" ? "flex flex-col gap-2.5" : "flex flex-wrap gap-x-5 gap-y-2", className)}
      {...props}
    />
  );
}

export function Radio({
  label,
  description,
  className,
  id: idProp,
  ...props
}: ComponentProps<typeof RG.Item> & { label?: ReactNode; description?: ReactNode }) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <span className="flex h-[18px] items-center">
        <RG.Item
          id={id}
          className={cn(
            "peer inline-flex size-4 items-center justify-center rounded-full bg-card shadow-[0_0_0_1px_var(--line-strong)] outline-none",
            "transition-[box-shadow] duration-fast hover:shadow-[0_0_0_1px_var(--faint)] focus-visible:shadow-focus!",
            "disabled:cursor-not-allowed disabled:opacity-45",
            "data-[state=checked]:bg-primary data-[state=checked]:shadow-none",
          )}
          {...props}
        >
          <RG.Indicator className="size-1.5 rounded-full bg-primary-foreground" />
        </RG.Item>
      </span>
      {label && (
        <div className="flex flex-col gap-0.5">
          <label htmlFor={id} className="text-small leading-[18px] select-none peer-disabled:opacity-50">
            {label}
          </label>
          {description && <span className="text-caption text-subtle">{description}</span>}
        </div>
      )}
    </div>
  );
}

/* ---------------- Switch ---------------- */

export type SwitchProps = ComponentProps<typeof SW.Root> & {
  label?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md";
  /** Put the label on the left (settings rows) instead of the right. */
  labelPosition?: "left" | "right";
};

export function Switch({ label, description, size = "md", labelPosition = "right", className, id: idProp, ...props }: SwitchProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const sw = (
    <SW.Root
      id={id}
      className={cn(
        "peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full bg-line-strong outline-none",
        "transition-[background-color,box-shadow] duration-base ease-out focus-visible:shadow-focus",
        "disabled:cursor-not-allowed disabled:opacity-45 data-[state=checked]:bg-primary",
        size === "md" ? "h-[18px] w-[30px]" : "h-[14px] w-6",
        !label && className,
      )}
      {...props}
    >
      <SW.Thumb
        className={cn(
          "block rounded-full bg-foreground shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-base ease-out",
          "data-[state=checked]:bg-primary-foreground",
          size === "md"
            ? "size-3.5 translate-x-0.5 data-[state=checked]:translate-x-[14px]"
            : "size-2.5 translate-x-0.5 data-[state=checked]:translate-x-3",
        )}
      />
    </SW.Root>
  );
  if (!label) return sw;
  return (
    <div className={cn("flex items-start gap-2.5", labelPosition === "left" && "flex-row-reverse justify-between", className)}>
      <span className="flex h-[18px] items-center">{sw}</span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <label htmlFor={id} className="text-small leading-[18px] select-none peer-disabled:opacity-50">
          {label}
        </label>
        {description && <span className="text-caption text-subtle">{description}</span>}
      </div>
    </div>
  );
}
