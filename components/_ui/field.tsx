import { Label as LabelPrimitive } from "radix-ui";
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn";

/*
  FormField wires a label, help text, error and character count to one control.
  Controls (Input, Textarea, Select...) read this context, so you never pass ids by hand:

    <FormField label="Company name" required help="Shown on invoices" error={errors.name}>
      <Input />
    </FormField>
*/
type FieldContextValue = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
};
const FieldContext = createContext<FieldContextValue | null>(null);

/** Used inside controls to pick up id, aria-describedby and invalid state from a FormField. */
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

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn("text-small font-medium leading-none text-foreground select-none peer-disabled:opacity-50", className)}
      {...props}
    />
  );
}

export type FormFieldProps = {
  label?: ReactNode;
  /** Adds a required mark next to the label and `required` on the control. */
  required?: boolean;
  /** Marks the field optional instead (use one convention per form). */
  optional?: boolean;
  help?: ReactNode;
  error?: ReactNode;
  /** Shows "count / max" on the right of the help row. */
  count?: { value: number; max: number };
  /** vertical (default): label above. horizontal: label in a left column from md up. */
  layout?: "vertical" | "horizontal";
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  className?: string;
  /** Extra element on the label row, e.g. a "Forgot password?" link. */
  labelAside?: ReactNode;
  children: ReactNode;
};

export function FormField({
  label,
  required = false,
  optional,
  help,
  error,
  count,
  layout = "vertical",
  disabled = false,
  readOnly = false,
  id: idProp,
  className,
  labelAside,
  children,
}: FormFieldProps) {
  const auto = useId();
  const id = idProp ?? `f${auto}`;
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = Boolean(error) || (count ? count.value > count.max : false);
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid, required, disabled, readOnly }}>
      <div
        data-invalid={invalid || undefined}
        className={cn(
          "flex min-w-0 flex-col gap-1.5",
          layout === "horizontal" && "md:grid md:grid-cols-[200px_minmax(0,1fr)] md:items-start md:gap-x-6",
          disabled && "opacity-60",
          className,
        )}
      >
        {label && (
          <div className={cn("flex min-h-4 items-center justify-between gap-2", layout === "horizontal" && "md:min-h-[30px]")}>
            <Label htmlFor={id}>
              {label}
              {required && (
                <span aria-hidden className="ml-0.5 text-danger">
                  *
                </span>
              )}
              {optional && <span className="ml-1.5 font-normal text-subtle">Optional</span>}
            </Label>
            {labelAside}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1.5">
          {children}
          {(help || error || count) && (
            <div className="flex items-start justify-between gap-3 text-caption">
              <div className="flex min-w-0 flex-col gap-1">
                {error && (
                  <p id={errorId} className="text-danger" role="alert">
                    {error}
                  </p>
                )}
                {help && (
                  <p id={helpId} className="text-subtle">
                    {help}
                  </p>
                )}
              </div>
              {count && (
                <span className={cn("tabular shrink-0", count.value > count.max ? "text-danger" : "text-faint")} aria-live="polite">
                  {count.value} / {count.max}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </FieldContext.Provider>
  );
}

/** Lays out several FormFields. `inline` puts them on one wrapping row (filters, quick add). */
export function FormLayout({
  layout = "vertical",
  className,
  ...props
}: ComponentProps<"div"> & { layout?: "vertical" | "horizontal" | "inline" }) {
  return (
    <div
      className={cn(
        layout === "inline" ? "flex flex-wrap items-end gap-3" : "flex flex-col",
        layout === "vertical" && "gap-5",
        layout === "horizontal" && "gap-6",
        className,
      )}
      {...props}
    />
  );
}

/** A titled group of fields, separated by a hairline rather than boxed in a card. */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-5 border-t border-border pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10", className)}>
      <div className="flex flex-col gap-1">
        <h3 className="text-body font-medium">{title}</h3>
        {description && <p className="text-caption text-subtle">{description}</p>}
      </div>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  );
}
