import { HoverCard as HC, Popover as P, Tooltip as T } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/* ---------------- Tooltip ---------------- */

/** Wrap the app once. Tooltips open after 400ms and then instantly while moving between triggers. */
export function TooltipProvider({ delayDuration = 400, skipDelayDuration = 250, ...props }: ComponentProps<typeof T.Provider>) {
  return <T.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />;
}

export type TooltipProps = {
  content: ReactNode;
  /** Shows a kbd chip after the text, e.g. "E". */
  shortcut?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  children: ReactNode;
  /** Explicit open state; usually leave it uncontrolled. */
  open?: boolean;
};

/**
 * Short label for an icon button or a truncated value. One line, no interactive content.
 * Don't put information only in a tooltip that the user needs to complete a task.
 */
export function Tooltip({ content, shortcut, side = "top", align = "center", children, open }: TooltipProps) {
  return (
    <T.Root open={open}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          className={cn(
            "z-(--z-tooltip) flex max-w-64 items-center gap-2 rounded-md bg-popover px-2 py-1.5 text-caption text-foreground shadow-overlay",
            "data-[state=delayed-open]:animate-[keel-fade-in_var(--duration-fast)_var(--ease-out)]",
          )}
        >
          {content}
          {shortcut && <Kbd className="h-4 bg-transparent shadow-none text-faint px-0">{shortcut}</Kbd>}
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}

/* ---------------- Popover ---------------- */

export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export const PopoverClose = P.Close;
export const PopoverAnchor = P.Anchor;

/** Floating panel for small interactive content: a filter form, a date picker, a quick edit. */
export function PopoverContent({ className, sideOffset = 6, align = "start", ...props }: ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={8}
        className={cn(
          "z-(--z-popover) rounded-lg bg-popover p-3 text-small text-foreground shadow-overlay outline-none",
          "origin-(--radix-popover-content-transform-origin)",
          "data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)] data-[state=closed]:animate-[keel-pop-out_var(--duration-instant)_var(--ease-in)]",
          className,
        )}
        {...props}
      />
    </P.Portal>
  );
}

/* ---------------- Hover card ---------------- */

/** Preview on hover (a person, a linked record). Always duplicate the info somewhere clickable for touch. */
export function HoverCard({ trigger, children, className }: { trigger: ReactNode; children: ReactNode; className?: string }) {
  return (
    <HC.Root openDelay={350} closeDelay={120}>
      <HC.Trigger asChild>{trigger}</HC.Trigger>
      <HC.Portal>
        <HC.Content
          sideOffset={6}
          collisionPadding={8}
          className={cn("z-(--z-popover) w-72 rounded-lg bg-popover p-3 text-small shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]", className)}
        >
          {children}
        </HC.Content>
      </HC.Portal>
    </HC.Root>
  );
}
