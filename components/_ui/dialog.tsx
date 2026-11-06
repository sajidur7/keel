import { AlertDialog as AD, Dialog as D } from "radix-ui";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { Input } from "./input";
import { IconAlertTriangle, IconX } from "./icons";
import { cn } from "../lib/cn";

const overlay =
  "fixed inset-0 z-(--z-modal) bg-overlay data-[state=open]:animate-[keel-fade-in_var(--duration-base)_var(--ease-out)] data-[state=closed]:animate-[keel-fade-out_var(--duration-fast)_var(--ease-in)]";
const panel =
  "fixed top-1/2 left-1/2 z-(--z-modal) flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-card text-foreground shadow-overlay outline-none " +
  "data-[state=open]:animate-[keel-dialog-in_var(--duration-base)_var(--ease-out)] data-[state=closed]:animate-[keel-dialog-out_var(--duration-fast)_var(--ease-in)]";
const widths = { sm: "max-w-[400px]", md: "max-w-[520px]", lg: "max-w-[680px]", xl: "max-w-[880px]" } as const;

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export type DialogContentProps = ComponentProps<typeof D.Content> & {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof widths;
  hideClose?: boolean;
};

/** Modal dialog for focused tasks (create, edit a small record). Long forms belong in a Sheet or a page. */
export function DialogContent({ title, description, footer, size = "md", hideClose, className, children, ...props }: DialogContentProps) {
  return (
    <D.Portal>
      <D.Overlay className={overlay} />
      <D.Content className={cn(panel, widths[size], className)} {...props}>
        <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-1">
          <div className="flex min-w-0 flex-col gap-1">
            <D.Title className="text-title font-medium">{title}</D.Title>
            {description ? (
              <D.Description className="text-small text-subtle">{description}</D.Description>
            ) : (
              <D.Description className="sr-only">{typeof title === "string" ? title : "Dialog"}</D.Description>
            )}
          </div>
          {!hideClose && (
            <D.Close asChild>
              <IconButton label="Close" size="sm" className="-mr-1.5">
                <IconX />
              </IconButton>
            </D.Close>
          )}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">{children}</div>
        {footer && <footer className="flex flex-wrap items-center justify-end gap-2 px-5 pt-2 pb-4">{footer}</footer>}
      </D.Content>
    </D.Portal>
  );
}

/* ---------------- Confirm dialog ---------------- */

export type ConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** Destructive confirms use the danger button and a warning icon. */
  tone?: "default" | "danger";
  /** Typing this text is required before confirming (for irreversible actions). */
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

/**
 * Confirms an action. The safe choice (Cancel) gets initial focus; Esc cancels.
 * Name the action in the button ("Delete 3 invoices"), never "OK" or "Yes".
 */
export function ConfirmDialog({
  open, onOpenChange, trigger, title, description, confirmLabel, cancelLabel = "Cancel", tone = "default",
  confirmText, loading, onConfirm,
}: ConfirmDialogProps) {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  const isOpen = open ?? innerOpen;
  const setOpen = (o: boolean) => { if (!o) setTyped(""); if (open === undefined) setInnerOpen(o); onOpenChange?.(o); };
  const blocked = Boolean(confirmText) && typed !== confirmText;
  return (
    <AD.Root open={isOpen} onOpenChange={setOpen}>
      {trigger && <AD.Trigger asChild>{trigger}</AD.Trigger>}
      <AD.Portal>
        <AD.Overlay className={overlay} />
        <AD.Content className={cn(panel, widths.sm, "gap-4 p-5")}>
          <div className="flex gap-3">
            {tone === "danger" && (
              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-danger-bg text-danger">
                <IconAlertTriangle />
              </span>
            )}
            <div className="flex min-w-0 flex-col gap-1.5">
              <AD.Title className="text-title font-medium">{title}</AD.Title>
              <AD.Description className="text-small text-soft">{description}</AD.Description>
            </div>
          </div>
          {confirmText && (
            <div className="flex flex-col gap-1.5">
              <label className="text-caption text-subtle" htmlFor="keel-confirm-text">
                Type <span className="font-mono text-foreground">{confirmText}</span> to confirm
              </label>
              <Input id="keel-confirm-text" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <AD.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </AD.Cancel>
            <Button
              variant={tone === "danger" ? "danger" : "primary"}
              disabled={blocked}
              loading={loading || busy}
              onClick={async () => {
                setBusy(true);
                try { await onConfirm(); setOpen(false); } finally { setBusy(false); }
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  );
}
