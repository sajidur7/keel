import { cva, type VariantProps } from "class-variance-authority";
import { Dialog as D } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { IconButton } from "./button";
import { IconX } from "./icons";
import { cn } from "../lib/cn";

/*
  Sheet — a panel that slides in from an edge. The right-side sheet is the standard
  detail view in Keel: open a row, read and edit it, close with Esc, and the list behind
  keeps its scroll position. Left-side sheets are used for the mobile navigation drawer.
*/
export const Sheet = D.Root;
export const SheetTrigger = D.Trigger;
export const SheetClose = D.Close;

const sheetVariants = cva(
  "fixed z-(--z-sheet) flex flex-col bg-card text-foreground shadow-overlay outline-none " +
    "data-[state=open]:duration-slow data-[state=closed]:duration-base",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-dvh w-full sm:inset-y-2 sm:right-2 sm:h-[calc(100dvh-16px)] sm:rounded-xl " +
          "data-[state=open]:animate-[keel-sheet-in-right_var(--duration-slow)_var(--ease-out)] data-[state=closed]:animate-[keel-sheet-out-right_var(--duration-base)_var(--ease-in)]",
        left:
          "inset-y-0 left-0 h-dvh " +
          "data-[state=open]:animate-[keel-sheet-in-left_var(--duration-slow)_var(--ease-out)] data-[state=closed]:animate-[keel-sheet-out-left_var(--duration-base)_var(--ease-in)]",
        bottom:
          "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-xl " +
          "data-[state=open]:animate-[keel-sheet-in-bottom_var(--duration-slow)_var(--ease-out)] data-[state=closed]:animate-[keel-sheet-out-bottom_var(--duration-base)_var(--ease-in)]",
      },
      size: { sm: "", md: "", lg: "", xl: "" },
    },
    compoundVariants: [
      { side: "right", size: "sm", className: "sm:max-w-[360px]" },
      { side: "right", size: "md", className: "sm:max-w-[440px]" },
      { side: "right", size: "lg", className: "sm:max-w-[560px]" },
      { side: "right", size: "xl", className: "sm:max-w-[720px]" },
      { side: "left", className: "w-[280px] max-w-[85vw]" },
    ],
    defaultVariants: { side: "right", size: "md" },
  },
);

export function SheetOverlay({ className, ...props }: ComponentProps<typeof D.Overlay>) {
  return (
    <D.Overlay
      className={cn(
        "fixed inset-0 z-(--z-sheet) bg-overlay",
        "data-[state=open]:animate-[keel-fade-in_var(--duration-base)_var(--ease-out)] data-[state=closed]:animate-[keel-fade-out_var(--duration-fast)_var(--ease-in)]",
        className,
      )}
      {...props}
    />
  );
}

export type SheetContentProps = ComponentProps<typeof D.Content> &
  VariantProps<typeof sheetVariants> & {
    /** Visible title (required for accessibility; use `hideTitle` to keep it screen-reader only). */
    title: ReactNode;
    description?: ReactNode;
    hideTitle?: boolean;
    /** Elements next to the close button (e.g. prev/next record, more menu). */
    headerActions?: ReactNode;
    /** Sticky footer, typically Cancel + Save. */
    footer?: ReactNode;
    /** Content above the title, e.g. breadcrumbs or an eyebrow. */
    eyebrow?: ReactNode;
    /** Keep the list behind usable (no dim overlay). The sheet still closes on Esc. */
    modal?: boolean;
  };

export function SheetContent({
  side, size, title, description, hideTitle, headerActions, footer, eyebrow, className, children, ...props
}: SheetContentProps) {
  return (
    <D.Portal>
      <SheetOverlay />
      <D.Content
        className={cn(sheetVariants({ side, size }), className)}
        // Focus the panel itself on open, so a tooltip on the first header button doesn't pop up.
        onOpenAutoFocus={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).focus(); }}
        {...props}
      >
        <header className={cn("flex shrink-0 items-start justify-between gap-3 px-5 pt-4 pb-3", hideTitle && "pb-0")}>
          <div className="flex min-w-0 flex-col gap-1.5">
            {eyebrow}
            <D.Title className={cn("text-title font-medium", hideTitle && "sr-only")}>{title}</D.Title>
            {description ? (
              <D.Description className="text-small text-subtle">{description}</D.Description>
            ) : (
              <D.Description className="sr-only">{typeof title === "string" ? title : "Details"}</D.Description>
            )}
          </div>
          <div className="-mr-1.5 flex shrink-0 items-center gap-1">
            {headerActions}
            <D.Close asChild>
              <IconButton label="Close" size="sm">
                <IconX />
              </IconButton>
            </D.Close>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        {footer && (
          <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">{footer}</footer>
        )}
      </D.Content>
    </D.Portal>
  );
}

/** A titled block inside a sheet. Separated by a hairline, not a card. */
export function SheetSection({ title, action, className, children }: { title?: ReactNode; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("flex flex-col gap-3 border-t border-border py-4 first:border-t-0 first:pt-1", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2">
          {title && <h3 className="eyebrow">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
