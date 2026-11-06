import { Accordion as A, Collapsible as C, Toggle as T, ToggleGroup as TG } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { IconChevronDown } from "./icons";
import { cn } from "../lib/cn";

/* ===================== Accordion ===================== */

/**
 * Stacked sections that expand in place. Use for settings groups, FAQs, long detail
 * panels. Hairlines between items — no boxes around each one.
 *   <Accordion type="single" collapsible defaultValue="billing">…</Accordion>
 */
export function Accordion({ className, ...props }: ComponentProps<typeof A.Root>) {
  return <A.Root className={cn("flex flex-col", className)} {...props} />;
}

export function AccordionItem({
  value,
  title,
  description,
  meta,
  icon,
  disabled,
  children,
  className,
}: {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned info before the chevron (a count, a status pill). */
  meta?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <A.Item value={value} disabled={disabled} className={cn("border-b border-border last:border-b-0", className)}>
      <A.Header asChild>
        <h3>
          <A.Trigger
            className={cn(
              "group/acc flex min-h-11 w-full items-center gap-3 py-2.5 text-left outline-none",
              "rounded-xs focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-45",
              "[&_svg]:shrink-0",
            )}
          >
            {icon && <span className="inline-flex text-icon [&_svg]:size-4">{icon}</span>}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-small font-medium text-foreground">{title}</span>
              {description && <span className="truncate text-caption text-subtle">{description}</span>}
            </span>
            {meta && <span className="shrink-0 text-caption text-subtle">{meta}</span>}
            <IconChevronDown size={14} className="text-icon transition-transform duration-base ease-out group-data-[state=open]/acc:rotate-180" />
          </A.Trigger>
        </h3>
      </A.Header>
      <A.Content className="overflow-hidden data-[state=closed]:animate-[keel-collapse_var(--duration-base)_var(--ease-in-out)] data-[state=open]:animate-[keel-expand_var(--duration-base)_var(--ease-out)]">
        <div className={cn("pb-4 text-small text-soft", icon && "pl-7")}>{children}</div>
      </A.Content>
    </A.Item>
  );
}

/* ===================== Collapsible ===================== */

/** A single show/hide region ("Advanced options", "Show 12 more"). */
export function Collapsible({
  trigger,
  children,
  defaultOpen,
  open,
  onOpenChange,
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  className?: string;
}) {
  return (
    <C.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} className={cn("flex flex-col", className)}>
      <C.Trigger className="group/col inline-flex w-fit items-center gap-1.5 rounded-xs text-small text-soft outline-none hover:text-foreground focus-visible:shadow-focus">
        <IconChevronDown size={14} className="-rotate-90 text-icon transition-transform duration-base ease-out group-data-[state=open]/col:rotate-0" />
        {trigger}
      </C.Trigger>
      <C.Content className="overflow-hidden data-[state=closed]:animate-[keel-collapse_var(--duration-base)_var(--ease-in-out)] data-[state=open]:animate-[keel-expand_var(--duration-base)_var(--ease-out)]">
        <div className="pt-3">{children}</div>
      </C.Content>
    </C.Root>
  );
}

/* ===================== Toggle / ToggleGroup ===================== */

const toggleCls =
  "inline-flex h-[30px] min-w-[30px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 text-small text-soft outline-none " +
  "transition-colors duration-fast hover:bg-hover hover:text-foreground focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-45 " +
  "data-[state=on]:bg-selected data-[state=on]:text-foreground [&_svg]:size-4 [&_svg]:text-icon data-[state=on]:[&_svg]:text-foreground";

/** A button that stays pressed (bold, pin, "show archived"). */
export function Toggle({ className, ...props }: ComponentProps<typeof T.Root>) {
  return <T.Root className={cn(toggleCls, className)} {...props} />;
}

/**
 * A set of toggles. `type="single"` picks one (view mode); `type="multiple"` turns several on.
 * For "7d | 30d | 90d" style choices prefer SegmentedControl.
 */
export function ToggleGroup({ className, ...props }: ComponentProps<typeof TG.Root>) {
  return <TG.Root className={cn("inline-flex items-center gap-0.5 rounded-md p-0.5 shadow-raised", className)} {...props} />;
}
export function ToggleGroupItem({ className, ...props }: ComponentProps<typeof TG.Item>) {
  return <TG.Item className={cn(toggleCls, "h-[26px] min-w-[26px] rounded-[6px]", className)} {...props} />;
}
