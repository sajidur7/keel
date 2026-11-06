import { Tabs as TabsPrimitive, ToggleGroup } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { CountBadge } from "./tag";

/*
  Two tab styles:
  - Underline: switches the page's main view (header tabs, sheet sections).
  - Segmented: switches a small local option (time range, chart mode). Shrinks, never scrolls.
*/
export const Tabs = TabsPrimitive.Root;
export const TabsContent = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn("outline-none focus-visible:shadow-focus", className)} {...props} />
);

export function TabsList({ className, variant = "underline", ...props }: ComponentProps<typeof TabsPrimitive.List> & { variant?: "underline" | "segmented" }) {
  return (
    <TabsPrimitive.List
      data-variant={variant}
      className={cn(
        "group/tabs flex min-w-0 items-center",
        variant === "underline" && "-mb-px gap-4 overflow-x-auto [scrollbar-width:none]",
        variant === "segmented" && "inline-flex h-[30px] gap-0.5 rounded-md bg-muted p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  count,
  icon,
  children,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger> & { count?: number; icon?: ReactNode }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-small outline-none select-none",
        "transition-colors duration-fast ease-out disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-3.5 [&_svg]:text-icon",
        // underline
        "group-data-[variant=underline]/tabs:h-10 group-data-[variant=underline]/tabs:text-subtle group-data-[variant=underline]/tabs:hover:text-foreground",
        "group-data-[variant=underline]/tabs:after:absolute group-data-[variant=underline]/tabs:after:inset-x-0 group-data-[variant=underline]/tabs:after:bottom-0 group-data-[variant=underline]/tabs:after:h-[1.5px] group-data-[variant=underline]/tabs:after:rounded-full",
        "group-data-[variant=underline]/tabs:data-[state=active]:text-foreground group-data-[variant=underline]/tabs:data-[state=active]:after:bg-foreground",
        "group-data-[variant=underline]/tabs:focus-visible:after:bg-ring",
        // segmented
        "group-data-[variant=segmented]/tabs:h-full group-data-[variant=segmented]/tabs:min-w-0 group-data-[variant=segmented]/tabs:flex-1 group-data-[variant=segmented]/tabs:rounded-[6px] group-data-[variant=segmented]/tabs:px-2.5 group-data-[variant=segmented]/tabs:text-caption group-data-[variant=segmented]/tabs:text-subtle",
        "group-data-[variant=segmented]/tabs:hover:text-foreground group-data-[variant=segmented]/tabs:focus-visible:shadow-focus",
        "group-data-[variant=segmented]/tabs:data-[state=active]:bg-card group-data-[variant=segmented]/tabs:data-[state=active]:text-foreground group-data-[variant=segmented]/tabs:data-[state=active]:shadow-raised",
        className,
      )}
      {...props}
    >
      {icon}
      {/* Bold-width reservation: the label doesn't shift when it becomes active. */}
      <span className="grid">
        <span className="invisible col-start-1 row-start-1 font-medium" aria-hidden>{children}</span>
        <span className="col-start-1 row-start-1 truncate group-data-[variant=underline]/tabs:[[data-state=active]_&]:font-medium">{children}</span>
      </span>
      {count !== undefined && <CountBadge count={count} />}
    </TabsPrimitive.Trigger>
  );
}

/** Segmented control that isn't tied to tab panels (e.g. "7d | 30d | 90d"). */
export function SegmentedControl({
  value,
  onValueChange,
  options,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: ReactNode; disabled?: boolean }[];
  size?: "sm" | "md";
  className?: string;
  "aria-label": string;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      aria-label={ariaLabel}
      onValueChange={(v) => v && onValueChange(v)}
      className={cn("inline-flex min-w-0 gap-0.5 rounded-md bg-muted p-0.5", size === "md" ? "h-[30px]" : "h-[26px]", className)}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cn(
            "inline-flex h-full min-w-0 flex-1 cursor-pointer items-center justify-center truncate rounded-[6px] px-2.5 text-caption whitespace-nowrap text-subtle outline-none",
            "transition-colors duration-fast hover:text-foreground focus-visible:shadow-focus disabled:opacity-45",
            "data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-raised",
          )}
        >
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
