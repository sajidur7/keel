import { Dialog as D, Popover as P } from "radix-ui";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { IconAlertTriangle, IconCheck, IconCopy, IconInfo, IconX, IconCheckCircle, IconAlertCircle } from "./icons";
import { cn } from "../lib/cn";
import { Tooltip } from "./tooltip";

/* ===================== Popconfirm ===================== */

/**
 * A small confirm anchored to the button that triggered it — lighter than a dialog for
 * low-risk, single-object actions ("Remove this tag?"). Irreversible bulk actions use ConfirmDialog.
 */
export function Popconfirm({
  children,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  side = "top",
}: {
  children: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  onConfirm: () => void | Promise<void>;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger asChild>{children}</P.Trigger>
      <P.Portal>
        <P.Content side={side} sideOffset={8} collisionPadding={8} role="alertdialog" aria-label={typeof title === "string" ? title : "Confirm"}
          className="z-(--z-popover) flex w-64 flex-col gap-3 rounded-lg bg-popover p-3 text-small shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)]">
          <div className="flex gap-2.5">
            <IconAlertTriangle size={16} className={cn("mt-px shrink-0", tone === "danger" ? "text-danger" : "text-warning")} />
            <div className="flex flex-col gap-0.5">
              <p className="font-medium">{title}</p>
              {description && <p className="text-caption text-soft">{description}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <P.Close asChild><Button size="xs" variant="ghost" autoFocus>{cancelLabel}</Button></P.Close>
            <Button size="xs" variant={tone === "danger" ? "danger" : "primary"} loading={busy}
              onClick={async () => { setBusy(true); try { await onConfirm(); setOpen(false); } finally { setBusy(false); } }}>
              {confirmLabel}
            </Button>
          </div>
          <P.Arrow className="fill-popover" width={10} height={5} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ===================== Coachmark / Tour ===================== */

export type TourStep = { title: ReactNode; body: ReactNode };

/**
 * Onboarding hint anchored to one element. Chain steps by rendering it around different
 * anchors and passing `step`/`total`. Show once per user; never block a task with it.
 */
export function Coachmark({
  children,
  open,
  onOpenChange,
  title,
  body,
  step,
  total,
  onNext,
  onBack,
  side = "bottom",
}: {
  children: ReactNode;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: ReactNode;
  body: ReactNode;
  step?: number;
  total?: number;
  onNext?: () => void;
  onBack?: () => void;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const last = step !== undefined && total !== undefined && step >= total;
  return (
    <P.Root open={open} onOpenChange={onOpenChange}>
      <P.Anchor asChild>
        <span className={cn("relative inline-flex rounded-md", open && "z-(--z-popover) shadow-[0_0_0_4px_color-mix(in_srgb,var(--data)_35%,transparent)]")}>{children}</span>
      </P.Anchor>
      <P.Portal>
        <P.Content side={side} sideOffset={12} collisionPadding={12} onInteractOutside={(e) => e.preventDefault()}
          className="z-(--z-popover) flex w-72 flex-col gap-3 rounded-lg bg-primary p-4 text-primary-foreground shadow-overlay data-[state=open]:animate-[keel-pop-in_var(--duration-base)_var(--ease-out)]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-small font-medium">{title}</p>
            <P.Close aria-label="Close tour" className="-mt-1 -mr-1 inline-flex size-6 items-center justify-center rounded-sm opacity-60 outline-none hover:opacity-100 focus-visible:shadow-focus">
              <IconX size={14} />
            </P.Close>
          </div>
          <div className="text-small opacity-80">{body}</div>
          <div className="flex items-center justify-between gap-2">
            {step !== undefined && total !== undefined ? <ProgressDots count={total} current={step - 1} tone="inverse" /> : <span />}
            <div className="flex gap-1.5">
              {onBack && step && step > 1 && <button type="button" onClick={onBack} className="h-[26px] rounded-md px-2.5 text-caption font-medium opacity-70 outline-none hover:opacity-100 focus-visible:shadow-focus">Back</button>}
              <button type="button" onClick={last || !onNext ? () => onOpenChange(false) : onNext}
                className="h-[26px] rounded-md bg-primary-foreground px-2.5 text-caption font-medium text-primary outline-none hover:opacity-90 focus-visible:shadow-focus">
                {last || !onNext ? "Done" : "Next"}
              </button>
            </div>
          </div>
          <P.Arrow className="fill-primary" width={12} height={6} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ===================== Progress dots ===================== */

/** Position in a short sequence (tour steps, carousel pages). Not for completion — use Progress. */
export function ProgressDots({ count, current, tone = "default", className }: { count: number; current: number; tone?: "default" | "inverse"; className?: string }) {
  return (
    <span role="img" aria-label={`Step ${current + 1} of ${count}`} className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={cn("h-1.5 rounded-full transition-all duration-base ease-out", i === current ? "w-4" : "w-1.5",
          tone === "inverse" ? (i === current ? "bg-primary-foreground" : "bg-primary-foreground/30") : (i === current ? "bg-foreground" : "bg-line-strong"))} />
      ))}
    </span>
  );
}

/* ===================== Inline message ===================== */

/** Icon + one line next to a field or section header. Lighter than an Alert; expands on hover/focus if `detail` is given. */
export function InlineMessage({ tone = "info", children, detail, className }: { tone?: "info" | "success" | "warning" | "danger"; children: ReactNode; detail?: ReactNode; className?: string }) {
  const icon = { info: <IconInfo size={14} />, success: <IconCheckCircle size={14} />, warning: <IconAlertTriangle size={14} />, danger: <IconAlertCircle size={14} /> }[tone];
  const color = { info: "text-info", success: "text-success", warning: "text-warning", danger: "text-danger" }[tone];
  const el = (
    <span role={tone === "danger" ? "alert" : "status"} tabIndex={detail ? 0 : undefined}
      className={cn("inline-flex items-center gap-1.5 rounded-xs text-caption text-soft outline-none focus-visible:shadow-focus", className)}>
      <span className={color}>{icon}</span>{children}
    </span>
  );
  return detail ? <Tooltip content={detail}>{el}</Tooltip> : el;
}

/* ===================== Copy button ===================== */

/** Copies a value and confirms with a check for 1.4s. Pair with ids, keys, URLs. */
export function CopyButton({ value, label = "Copy", size = "sm", className }: { value: string; label?: string; size?: "xs" | "sm" | "md"; className?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 1400); return () => clearTimeout(t); }, [done]);
  return (
    <Tooltip content={done ? "Copied" : label}>
      <IconButton label={done ? "Copied" : label} size={size} className={className}
        onClick={async () => { try { await navigator.clipboard.writeText(value); } catch { /* blocked */ } setDone(true); }}>
        {done ? <IconCheck className="text-success!" /> : <IconCopy />}
      </IconButton>
    </Tooltip>
  );
}

/* ===================== Badge (indicator) ===================== */

/**
 * Puts a dot or a count on the corner of another element (an icon button, an avatar).
 * For counts next to text use CountBadge.
 */
export function Badge({ children, count, dot, max = 99, tone = "danger", className }: {
  children: ReactNode; count?: number; dot?: boolean; max?: number; tone?: "danger" | "data" | "neutral"; className?: string;
}) {
  const show = dot || (count !== undefined && count > 0);
  const bg = { danger: "bg-danger-solid text-danger-foreground", data: "bg-data text-primary-foreground", neutral: "bg-foreground text-background" }[tone];
  return (
    <span className={cn("relative inline-flex", className)}>
      {children}
      {show && (
        <span aria-label={dot ? "New" : `${count} new`} className={cn(
          "pointer-events-none absolute ring-2 ring-background", bg,
          dot ? "top-0.5 right-0.5 size-2 rounded-full" : "tabular -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium",
        )}>
          {!dot && (count! > max ? `${max}+` : count)}
        </span>
      )}
    </span>
  );
}

/* ===================== Image with preview ===================== */

/** Thumbnail that opens a full-size preview dialog (receipts, uploaded documents, avatars). */
export function ImagePreview({ src, alt, width = 96, height = 72, className }: { src: string; alt: string; width?: number; height?: number; className?: string }) {
  return (
    <D.Root>
      <D.Trigger className={cn("group/img relative overflow-hidden rounded-md bg-muted outline-none shadow-card focus-visible:shadow-focus", className)} style={{ width, height }} aria-label={`Preview ${alt}`}>
        <img src={src} alt={alt} className="size-full object-cover transition-transform duration-slow ease-out group-hover/img:scale-[1.03]" loading="lazy" />
      </D.Trigger>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-(--z-modal) bg-overlay data-[state=open]:animate-[keel-fade-in_var(--duration-base)_var(--ease-out)]" />
        <D.Content className="fixed top-1/2 left-1/2 z-(--z-modal) flex max-h-[90dvh] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 outline-none data-[state=open]:animate-[keel-dialog-in_var(--duration-base)_var(--ease-out)]">
          <D.Title className="sr-only">{alt}</D.Title>
          <img src={src} alt={alt} className="max-h-[82dvh] max-w-full rounded-lg object-contain shadow-overlay" />
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-small text-soft">{alt}</span>
            <D.Close asChild><Button size="sm">Close</Button></D.Close>
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

/* ===================== Layout helpers ===================== */

type Gap = 0 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10;
const gapCls: Record<Gap, string> = { 0: "gap-0", 1: "gap-1", 1.5: "gap-1.5", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5", 6: "gap-6", 8: "gap-8", 10: "gap-10" };

/** Vertical stack on the spacing scale. */
export function Stack({ gap = 4, className, ...props }: ComponentProps<"div"> & { gap?: Gap }) {
  return <div className={cn("flex min-w-0 flex-col", gapCls[gap], className)} {...props} />;
}
/** Horizontal row that wraps (Ant "Space" / Atlassian "Inline"). */
export function Inline({ gap = 2, align = "center", justify = "start", wrap = true, className, ...props }: ComponentProps<"div"> & {
  gap?: Gap; align?: "start" | "center" | "end" | "baseline" | "stretch"; justify?: "start" | "center" | "end" | "between"; wrap?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0", gapCls[gap], wrap && "flex-wrap",
      { start: "items-start", center: "items-center", end: "items-end", baseline: "items-baseline", stretch: "items-stretch" }[align],
      { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" }[justify], className)} {...props} />
  );
}
/** Sticks to the top (or bottom) of its scroll container once reached (Ant "Affix"). */
export function Sticky({ edge = "top", offset = 0, className, style, ...props }: ComponentProps<"div"> & { edge?: "top" | "bottom"; offset?: number }) {
  return <div className={cn("sticky z-(--z-sticky)", className)} style={{ [edge]: offset, ...style }} {...props} />;
}

/* ===================== Anchor (on-this-page) ===================== */

/** Table of contents that highlights the section in view. Pass ids of headings on the page. */
export function Anchor({ items, offset = 80, className }: { items: { id: string; label: string; level?: 1 | 2 }[]; offset?: number; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: `-${offset}px 0px -60% 0px` });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items, offset]);
  return (
    <nav aria-label="On this page" className={cn("flex flex-col border-l border-border", className)}>
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined}
          onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth" }); setActive(i.id); }}
          className={cn("-ml-px border-l py-1 text-caption outline-none transition-colors duration-fast focus-visible:shadow-focus",
            i.level === 2 ? "pl-5" : "pl-3",
            active === i.id ? "border-foreground text-foreground" : "border-transparent text-subtle hover:text-foreground")}>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
