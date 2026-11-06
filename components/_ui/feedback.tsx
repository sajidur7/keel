import { cva, type VariantProps } from "class-variance-authority";
import { Toast as T } from "radix-ui";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { IconAlertCircle, IconAlertTriangle, IconCheckCircle, IconInfo, IconLock, IconWifiOff, IconX } from "./icons";
import { cn } from "../lib/cn";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";
const toneIcon: Record<Tone, ReactNode> = {
  info: <IconInfo />,
  success: <IconCheckCircle />,
  warning: <IconAlertTriangle />,
  danger: <IconAlertCircle />,
  neutral: <IconInfo />,
};

/* ---------------- Alert / Callout ---------------- */

const alertVariants = cva("relative flex w-full min-w-0 gap-2.5 rounded-lg border px-3 py-2.5 text-small [&>svg]:mt-px [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    tone: {
      info: "border-info-border bg-info-bg [&>svg]:text-info",
      success: "border-success-border bg-success-bg [&>svg]:text-success",
      warning: "border-warning-border bg-warning-bg [&>svg]:text-warning",
      danger: "border-danger-border bg-danger-bg [&>svg]:text-danger",
      neutral: "border-border bg-surface [&>svg]:text-icon",
    },
  },
  defaultVariants: { tone: "info" },
});

/**
 * Inline message tied to the content around it (a form, a section). Title is optional;
 * the body is one or two sentences: what happened, then what to do.
 */
export function Alert({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  icon,
  className,
}: VariantProps<typeof alertVariants> & {
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  icon?: ReactNode;
  className?: string;
}) {
  const t = tone ?? "info";
  return (
    <div role={t === "danger" || t === "warning" ? "alert" : "status"} className={cn(alertVariants({ tone }), className)}>
      {icon ?? toneIcon[t]}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <p className="font-medium text-foreground">{title}</p>}
        {children && <div className={title ? "text-soft" : "text-foreground"}>{children}</div>}
        {action && <div className="mt-2 flex flex-wrap gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <IconButton label="Dismiss" size="xs" className="-mt-0.5 -mr-1" onClick={onDismiss}>
          <IconX />
        </IconButton>
      )}
    </div>
  );
}

/* ---------------- Banner ---------------- */

/**
 * Full-width, app-level message above the header (maintenance window, billing issue, read-only mode).
 * One at a time. Neutral by default; use warning/danger only when action is needed.
 */
export function Banner({
  tone = "neutral",
  children,
  action,
  onDismiss,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(
        "flex min-h-9 w-full items-center gap-2.5 border-b px-3 py-1.5 text-small sm:px-4 [&>svg]:size-3.5 [&>svg]:shrink-0",
        tone === "neutral" && "border-border bg-surface [&>svg]:text-icon",
        tone === "info" && "border-info-border bg-info-bg [&>svg]:text-info",
        tone === "success" && "border-success-border bg-success-bg [&>svg]:text-success",
        tone === "warning" && "border-warning-border bg-warning-bg [&>svg]:text-warning",
        tone === "danger" && "border-danger-border bg-danger-bg [&>svg]:text-danger",
        className,
      )}
    >
      {toneIcon[tone]}
      <p className="min-w-0 flex-1">{children}</p>
      {action}
      {onDismiss && (
        <IconButton label="Dismiss" size="xs" onClick={onDismiss}>
          <IconX />
        </IconButton>
      )}
    </div>
  );
}

/* ---------------- Toast ---------------- */

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** e.g. { label: "Undo", onClick } — shown as a button; also announced to screen readers. */
  action?: { label: string; onClick: () => void };
  duration?: number;
};
type ToastEntry = ToastOptions & { id: number; open: boolean };
const ToastCtx = createContext<((t: ToastOptions) => void) | null>(null);

/** `const toast = useToast(); toast({ title: "Invoice sent", action: { label: "Undo", onClick } })` */
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <Toaster>");
  return ctx;
}

/** Wrap the app once. Toasts stack bottom-right (bottom-center on phones), max 3 visible. */
export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const push = useCallback((t: ToastOptions) => {
    setToasts((list) => [...list.slice(-2), { ...t, id: Date.now() + Math.random(), open: true }]);
  }, []);
  const close = (id: number) => {
    setToasts((l) => l.map((t) => (t.id === id ? { ...t, open: false } : t)));
    setTimeout(() => setToasts((l) => l.filter((t) => t.id !== id)), 300);
  };
  return (
    <ToastCtx.Provider value={push}>
      <T.Provider swipeDirection="right" duration={5000}>
        {children}
        {toasts.map((t) => (
          <T.Root
            key={t.id}
            open={t.open}
            onOpenChange={(o) => !o && close(t.id)}
            duration={t.duration}
            type={t.tone === "danger" ? "foreground" : "background"}
            className={cn(
              "group/toast pointer-events-auto relative flex w-full items-start gap-2.5 rounded-lg bg-popover p-3 pr-9 text-small shadow-overlay",
              "data-[state=open]:animate-[keel-toast-in_var(--duration-base)_var(--ease-out)] data-[state=closed]:animate-[keel-toast-out_var(--duration-fast)_var(--ease-in)]",
              "data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=end]:animate-[keel-toast-out_var(--duration-fast)_var(--ease-in)]",
              "[&>svg]:mt-px [&>svg]:size-4 [&>svg]:shrink-0",
              t.tone === "success" && "[&>svg]:text-success",
              t.tone === "warning" && "[&>svg]:text-warning",
              t.tone === "danger" && "[&>svg]:text-danger",
              t.tone === "info" && "[&>svg]:text-info",
            )}
          >
            {t.tone && t.tone !== "neutral" && toneIcon[t.tone]}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <T.Title className="font-medium">{t.title}</T.Title>
              {t.description && <T.Description className="text-soft">{t.description}</T.Description>}
            </div>
            {t.action && (
              <T.Action altText={t.action.label} asChild>
                <Button size="xs" variant="secondary" onClick={t.action.onClick} className="mt-px">
                  {t.action.label}
                </Button>
              </T.Action>
            )}
            <T.Close asChild>
              <IconButton label="Close" size="xs" className="absolute top-2 right-2">
                <IconX />
              </IconButton>
            </T.Close>
          </T.Root>
        ))}
        <T.Viewport className="fixed right-0 bottom-0 z-(--z-toast) m-0 flex w-full max-w-[400px] list-none flex-col gap-2 p-3 outline-none sm:p-4 max-sm:left-1/2 max-sm:-translate-x-1/2" />
      </T.Provider>
    </ToastCtx.Provider>
  );
}

/* ---------------- Full-page states ---------------- */

/**
 * Error pages and blocking states. Plain and specific: what happened, what to do.
 * The code (404) is quiet; the sentence is what users read.
 */
export function StatusPage({
  code,
  title,
  description,
  icon,
  actions,
  detail,
  className,
}: {
  code?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  /** Request id, timestamp — monospace, for support. */
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[60dvh] w-full flex-col items-center justify-center px-4 py-16 text-center", className)}>
      {icon && (
        <span className="mb-5 inline-flex size-10 items-center justify-center rounded-lg bg-card text-icon shadow-raised [&_svg]:size-4.5">{icon}</span>
      )}
      {code && <span className="tabular mb-3 font-mono text-caption text-faint">{code}</span>}
      <h1 className="max-w-md text-page font-semibold">{title}</h1>
      {description && <p className="mt-2 max-w-md text-small text-subtle">{description}</p>}
      {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
      {detail && <p className="mt-8 font-mono text-[11px] text-faint">{detail}</p>}
    </div>
  );
}

export const NotFoundPage = (p: { actions?: ReactNode; className?: string }) => (
  <StatusPage code="404" title="This page doesn't exist" description="The link may be outdated, or the record was moved or deleted." {...p} />
);
export const ForbiddenPage = (p: { actions?: ReactNode; className?: string; role?: string }) => (
  <StatusPage
    code="403"
    icon={<IconLock />}
    title="You don't have access to this page"
    description={p.role ? `Your role (${p.role}) can't view this. Ask a workspace admin to change your permissions.` : "Ask a workspace admin to give you access."}
    {...p}
  />
);
export const ServerErrorPage = (p: { actions?: ReactNode; className?: string; requestId?: string }) => (
  <StatusPage
    code="500"
    icon={<IconAlertTriangle />}
    title="Something went wrong on our side"
    description="Your data is safe. Try again in a moment — if it keeps happening, share the request ID with support."
    detail={p.requestId ? `Request ${p.requestId}` : undefined}
    {...p}
  />
);

/** Inline offline notice for a panel that couldn't load. */
export function OfflineState({ onRetry, className }: { onRetry?: () => void; className?: string }) {
  return (
    <StatusPage
      className={cn("min-h-0 py-12", className)}
      icon={<IconWifiOff />}
      title="You're offline"
      description="Changes you make now won't be saved. We'll reconnect automatically."
      actions={onRetry && <Button size="sm" onClick={onRetry}>Try again</Button>}
    />
  );
}

/** Shown in place of a section the user can't see (keeps layout, explains why). */
export function PermissionState({ what = "this section", requestAccess, className }: { what?: string; requestAccess?: () => void; className?: string }) {
  return (
    <StatusPage
      className={cn("min-h-0 py-12", className)}
      icon={<IconLock />}
      title={`You can't view ${what}`}
      description="Your role doesn't include this permission."
      actions={requestAccess && <Button size="sm" onClick={requestAccess}>Request access</Button>}
    />
  );
}
