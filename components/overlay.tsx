/**
 * Overlay — things that float above the page.
 * Tooltip · Popover · HoverCard · Dialog · AlertDialog · Drawer (Sheet) · BottomSheet · BottomSheetSwitcher ·
 * CommandPalette · Lightbox · Overlay · Popconfirm · Coachmark
 */
import * as stylex from "@stylexjs/stylex";
import { AlertDialog as AD, Dialog as D, HoverCard as HC, Popover as P, Tooltip as T } from "radix-ui";
import {
  useEffect, useId, useMemo, useRef, useState,
  type ComponentProps, type ReactNode,
} from "react";
import { color, depth, font, motion, radius, z } from "../tokens/tokens.stylex";
import { Button, IconButton } from "./action";
import { Kbd } from "./content";
import { ProgressDots } from "./feedback";
import { IconAlertTriangle, IconChevronLeft, IconChevronRight, IconCorner, IconSearch, IconSizeContext, IconX, IconZoomIn } from "./icons";
import { KeyHint } from "./keys";
import { px, sx, type StyleProps } from "./lib/sx";

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const popIn = stylex.keyframes({ from: { opacity: 0, transform: "scale(0.96)" }, to: { opacity: 1, transform: "none" } });
const dialogIn = stylex.keyframes({ from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.97)" }, to: { opacity: 1, transform: "translate(-50%, -50%)" } });
const fromRight = stylex.keyframes({ from: { transform: "translateX(calc(100% + 24px))" }, to: { transform: "none" } });
const fromLeft = stylex.keyframes({ from: { transform: "translateX(calc(-100% - 24px))" }, to: { transform: "none" } });
const fromBottom = stylex.keyframes({ from: { transform: "translateY(100%)" }, to: { transform: "none" } });

const o = stylex.create({
  scrim: {
    position: "fixed", inset: 0, zIndex: z.modal, backgroundColor: color.scrim,
    backdropFilter: "blur(2px)", animationName: fadeIn, animationDuration: motion.base,
  },
  srOnly: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 },
  // tooltip: inverse, small, fast
  tip: {
    zIndex: z.tooltip, display: "inline-flex", alignItems: "center", gap: 8, maxWidth: 280,
    paddingBlock: 5, paddingInline: 8, borderRadius: radius.sm, fontSize: font.sm, lineHeight: 1.35,
    backgroundColor: color.surfaceInverse, color: color.fgInverse,
    boxShadow: `0 4px 12px -2px ${color.shadeLg}`,
    transformOrigin: "var(--radix-tooltip-content-transform-origin)",
    animationName: popIn, animationDuration: motion.fast, animationTimingFunction: motion.ease,
  },
  tipKey: { fontSize: font.xs, opacity: 0.6, letterSpacing: "0.04em" },
  tipArrow: { fill: color.surfaceInverse },
  // popover / hover card
  pop: {
    zIndex: z.popover, minWidth: 220, maxWidth: "calc(100vw - 16px)", padding: 12, borderRadius: radius.xl,
    backgroundColor: color.surfaceRaised, color: color.fg, boxShadow: depth.popover, outline: "none",
    transformOrigin: "var(--radix-popover-content-transform-origin, var(--radix-hover-card-content-transform-origin))",
    animationName: popIn, animationDuration: motion.fast, animationTimingFunction: motion.ease,
  },
  flush: { padding: 0 },
  arrow: { fill: color.surfaceRaised },
  // dialog
  dialog: {
    position: "fixed", top: "50%", left: "50%", zIndex: z.modal, display: "flex", flexDirection: "column",
    width: "calc(100vw - 24px)", maxHeight: "min(88dvh, 860px)", borderRadius: radius.xxl, overflow: "hidden",
    backgroundColor: color.surfaceRaised, color: color.fg, boxShadow: depth.dialog, outline: "none",
    transform: "translate(-50%, -50%)", animationName: dialogIn, animationDuration: motion.base, animationTimingFunction: motion.spring,
  },
  sm: { maxWidth: 400 }, md: { maxWidth: 520 }, lg: { maxWidth: 720 }, xl: { maxWidth: 960 },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingInline: 20, paddingTop: 18, paddingBottom: 12, flexShrink: 0 },
  headText: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0 },
  title: { fontSize: font.xl, fontWeight: font.semibold, letterSpacing: "-0.01em", lineHeight: 1.3 },
  desc: { fontSize: font.md, color: color.fgMuted, lineHeight: 1.5 },
  body: { flex: 1, minHeight: 0, overflowY: "auto", paddingInline: 20, paddingBottom: 20 },
  foot: {
    display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 8, flexShrink: 0,
    paddingInline: 20, paddingBlock: 12, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border,
    backgroundColor: color.surfaceSunken,
  },
  close: { marginTop: -4, marginInlineEnd: -8, display: "flex", gap: 4, alignItems: "center", flexShrink: 0 },
  // alert dialog
  alertIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: radius.lg, flexShrink: 0, marginBottom: 4 },
  alertDanger: { backgroundColor: color.dangerSoft, color: color.danger },
  alertWarn: { backgroundColor: color.warningSoft, color: color.warning },
  // drawer
  drawer: {
    position: "fixed", zIndex: z.modal, display: "flex", flexDirection: "column", backgroundColor: color.surfaceRaised,
    color: color.fg, boxShadow: depth.dialog, outline: "none", animationDuration: motion.slow, animationTimingFunction: motion.ease,
  },
  right: { top: 8, right: 8, bottom: 8, width: "calc(100vw - 16px)", borderRadius: radius.xl, animationName: fromRight },
  left: { top: 8, left: 8, bottom: 8, width: "calc(100vw - 16px)", borderRadius: radius.xl, animationName: fromLeft },
  dsm: { maxWidth: 380 }, dmd: { maxWidth: 480 }, dlg: { maxWidth: 640 }, dxl: { maxWidth: 880 },
  section: {
    display: "flex", flexDirection: "column", gap: 12, paddingBlock: 16,
    borderTopWidth: { default: 1, ":first-child": 0 }, borderTopStyle: "solid", borderTopColor: color.border,
    paddingTop: { default: 16, ":first-child": 4 },
  },
  sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  eyebrow: { fontSize: font.xs, fontWeight: font.medium, color: color.fgMuted, letterSpacing: "0.05em", textTransform: "uppercase" },
  // bottom sheet
  sheet: {
    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: z.modal, display: "flex", flexDirection: "column",
    maxHeight: "92dvh", borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: color.surfaceRaised,
    boxShadow: depth.dialog, outline: "none", animationName: fromBottom, animationDuration: motion.slow, animationTimingFunction: motion.ease,
    paddingBottom: "env(safe-area-inset-bottom)", touchAction: "none",
  },
  sheetDocked: { left: "50%", right: "auto", width: "min(560px, 100vw)", transform: "translateX(-50%)" },
  grab: { alignSelf: "center", width: 36, height: 4, borderRadius: 4, marginTop: 8, marginBottom: 4, backgroundColor: color.borderStrong, cursor: "grab" },
  // command palette
  cmd: {
    position: "fixed", top: "12dvh", left: "50%", zIndex: z.modal, display: "flex", flexDirection: "column",
    width: "calc(100vw - 24px)", maxWidth: 620, maxHeight: "min(540px, 76dvh)", overflow: "hidden", borderRadius: radius.xxl,
    backgroundColor: color.surfaceRaised, boxShadow: depth.dialog, outline: "none", transform: "translateX(-50%)",
    animationName: popIn, animationDuration: motion.base, animationTimingFunction: motion.spring,
  },
  cmdIn: {
    display: "flex", alignItems: "center", gap: 10, height: 52, paddingInline: 16, flexShrink: 0,
    borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, color: color.icon,
  },
  cmdInput: { flex: 1, minWidth: 0, height: "100%", fontSize: font.lg, color: color.fg, outline: "none" },
  cmdList: { flex: 1, minHeight: 0, overflowY: "auto", padding: 6 },
  cmdGroup: { paddingInline: 10, paddingTop: 10, paddingBottom: 6 },
  cmdItem: {
    display: "flex", alignItems: "center", gap: 10, height: 38, paddingInline: 10, borderRadius: radius.md,
    cursor: "pointer", fontSize: font.md, color: color.fg,
  },
  cmdOn: { backgroundColor: color.hover, boxShadow: `inset 0 0 0 1px ${color.border}` },
  cmdIcon: { display: "inline-flex", color: color.icon },
  cmdHint: { flexShrink: 0, fontSize: font.sm, color: color.fgFaint },
  cmdEmpty: { paddingBlock: 40, textAlign: "center", color: color.fgMuted },
  cmdFoot: {
    display: { default: "none", "@media (min-width: 640px)": "flex" }, alignItems: "center", gap: 16, flexShrink: 0,
    paddingInline: 16, paddingBlock: 8, borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border,
    fontSize: font.sm, color: color.fgMuted, backgroundColor: color.surfaceSunken,
  },
  hint: { display: "flex", alignItems: "center", gap: 6 },
  label: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  // lightbox
  lb: { position: "fixed", inset: 0, zIndex: z.modal, display: "flex", alignItems: "center", justifyContent: "center", outline: "none", padding: 48 },
  lbImg: { maxWidth: "100%", maxHeight: "100%", borderRadius: radius.lg, boxShadow: depth.dialog, objectFit: "contain", transitionProperty: "transform", transitionDuration: motion.base },
  lbZoom: { transform: "scale(1.8)", cursor: "zoom-out" },
  lbBtn: { position: "absolute", display: "flex", gap: 6 },
  lbTop: { top: 12, right: 12 },
  lbPrev: { left: 12, top: "50%", transform: "translateY(-50%)" },
  lbNext: { right: 12, top: "50%", transform: "translateY(-50%)" },
  lbCap: { position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", paddingBlock: 6, paddingInline: 12, borderRadius: radius.full, backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", fontSize: font.sm, whiteSpace: "nowrap" },
  // generic overlay
  ovRoot: { position: "relative", display: "inline-block", isolation: "isolate" },
  ovLayer: {
    position: "absolute", inset: 0, display: "flex", padding: 8, borderRadius: "inherit",
    opacity: { default: 0, ":focus-within": 1 }, transitionProperty: "opacity", transitionDuration: motion.base,
  },
  ovShow: { opacity: 1 },
  ovScrim: { backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55))", color: "#fff" },
  // popconfirm / coachmark
  pc: { width: 280, display: "flex", flexDirection: "column", gap: 12 },
  pcRow: { display: "flex", gap: 10 },
  pcText: { display: "flex", flexDirection: "column", gap: 2, fontSize: font.md },
  strong: { fontWeight: font.medium },
  soft: { color: color.fgMuted, fontSize: font.sm },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8 },
  coach: {
    width: 300, display: "flex", flexDirection: "column", gap: 10, padding: 16, borderRadius: radius.xl,
    backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`, color: color.onAccent,
    boxShadow: `${depth.solid}, 0 16px 32px -12px ${color.shadeLg}`,
  },
  coachArrow: { fill: color.accentBottom },
  coachRing: { position: "relative", display: "inline-flex", borderRadius: radius.md, zIndex: z.popover, boxShadow: `0 0 0 4px ${color.focusRing}` },
  coachClose: { color: color.onAccent, opacity: 0.75 },
  between: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
});

/* ============================================================== Tooltip */

export function TooltipProvider({ delayDuration = 350, skipDelayDuration = 250, ...props }: ComponentProps<typeof T.Provider>) {
  return <T.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />;
}

export type TooltipProps = {
  content: ReactNode;
  /** Keyboard hint, shown dimmed after the text. */
  shortcut?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  children: ReactNode;
};

/** A short label on hover/focus. Never put actions or essential info in it. */
export function Tooltip({ content, shortcut, side = "top", align = "center", open, children }: TooltipProps) {
  if (!content) return <>{children}</>;
  return (
    <T.Root open={open}>
      <T.Trigger asChild>{children}</T.Trigger>
      <T.Portal>
        <T.Content side={side} align={align} sideOffset={6} collisionPadding={8} {...px(o.tip)}>
          {content}
          {shortcut && <span {...px(o.tipKey)}><IconSizeContext.Provider value={11}><KeyHint keys={shortcut} /></IconSizeContext.Provider></span>}
          <T.Arrow width={9} height={4} {...px(o.tipArrow)} />
        </T.Content>
      </T.Portal>
    </T.Root>
  );
}

/* ============================================================== Popover / HoverCard */

export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export const PopoverClose = P.Close;
export const PopoverAnchor = P.Anchor;
export function PopoverContent({ sideOffset = 8, align = "start", flush, arrow, children, xstyle, className, style, ...rest }:
  ComponentProps<typeof P.Content> & StyleProps & { flush?: boolean; arrow?: boolean }) {
  return (
    <P.Portal>
      <P.Content sideOffset={sideOffset} align={align} collisionPadding={8} {...rest} {...sx({ xstyle, className, style }, o.pop, flush && o.flush)}>
        {children}
        {arrow && <P.Arrow width={12} height={6} {...px(o.arrow)} />}
      </P.Content>
    </P.Portal>
  );
}

/** Rich preview on hover (a person, a record). Not for actions — use Popover. */
export function HoverCard({ trigger, children, side = "bottom", align = "start", openDelay = 400, xstyle }: {
  trigger: ReactNode; children: ReactNode; side?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end"; openDelay?: number; xstyle?: StyleProps["xstyle"];
}) {
  return (
    <HC.Root openDelay={openDelay} closeDelay={120}>
      <HC.Trigger asChild>{trigger}</HC.Trigger>
      <HC.Portal>
        <HC.Content side={side} align={align} sideOffset={8} collisionPadding={8} {...sx({ xstyle }, o.pop)}>{children}</HC.Content>
      </HC.Portal>
    </HC.Root>
  );
}

/* ============================================================== Dialog */

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export type DialogContentProps = Omit<ComponentProps<typeof D.Content>, "title"> & StyleProps & {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons, right-aligned on a sunken bar. Cancel first, then the primary action. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideClose?: boolean;
  /** Keep the title for screen readers only. */
  hideTitle?: boolean;
};

/** A focused task that blocks the page: confirm, short form, details. Esc and the scrim close it. */
export function DialogContent({ title, description, footer, size = "md", hideClose, hideTitle, children, xstyle, className, style, ...rest }: DialogContentProps) {
  return (
    <D.Portal>
      <D.Overlay {...px(o.scrim)} />
      <D.Content {...rest} {...sx({ xstyle, className, style }, o.dialog, o[size])}>
        <header {...px(o.head)}>
          <div {...px(o.headText)}>
            <D.Title {...px(o.title, hideTitle && o.srOnly)}>{title}</D.Title>
            {description ? <D.Description {...px(o.desc)}>{description}</D.Description> : <D.Description {...px(o.srOnly)}>{typeof title === "string" ? title : "Dialog"}</D.Description>}
          </div>
          {!hideClose && <div {...px(o.close)}><D.Close asChild><IconButton label="Close" size="sm" tooltip={false}><IconX /></IconButton></D.Close></div>}
        </header>
        <div {...px(o.body)}>{children}</div>
        {footer && <footer {...px(o.foot)}>{footer}</footer>}
      </D.Content>
    </D.Portal>
  );
}

/* ============================================================== AlertDialog */

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Verb that names the action: "Delete 3 customers". */
  actionLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "default";
  onAction: () => void | Promise<void>;
  children?: ReactNode;
};

/** Confirms a consequential action. Focus starts on Cancel; the action button names what happens. */
export function AlertDialog({ open, onOpenChange, title, description, actionLabel, cancelLabel = "Cancel", tone = "danger", onAction, children }: AlertDialogProps) {
  const [busy, setBusy] = useState(false);
  return (
    <AD.Root open={open} onOpenChange={onOpenChange}>
      <AD.Portal>
        <AD.Overlay {...px(o.scrim)} />
        <AD.Content {...px(o.dialog, o.sm)}>
          <div {...px(o.head)}>
            <div {...px(o.headText)}>
              {tone !== "default" && <span {...px(o.alertIcon, tone === "danger" ? o.alertDanger : o.alertWarn)}><IconAlertTriangle size={20} /></span>}
              <AD.Title {...px(o.title)}>{title}</AD.Title>
              {description && <AD.Description {...px(o.desc)}>{description}</AD.Description>}
            </div>
          </div>
          {children && <div {...px(o.body)}>{children}</div>}
          <footer {...px(o.foot)}>
            <AD.Cancel asChild><Button variant="secondary">{cancelLabel}</Button></AD.Cancel>
            <Button variant={tone === "danger" ? "danger" : "primary"} loading={busy}
              onClick={async () => { setBusy(true); try { await onAction(); onOpenChange(false); } finally { setBusy(false); } }}>
              {actionLabel}
            </Button>
          </footer>
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  );
}
/** v1 name. */
export const ConfirmDialog = AlertDialog;

/* ============================================================== Drawer (Sheet) */

export const Drawer = D.Root;
export const DrawerTrigger = D.Trigger;
export const DrawerClose = D.Close;

export type DrawerContentProps = Omit<ComponentProps<typeof D.Content>, "title"> & StyleProps & {
  title: ReactNode;
  description?: ReactNode;
  side?: "right" | "left";
  size?: "sm" | "md" | "lg" | "xl";
  /** Buttons next to Close: prev/next record, a MoreMenu. */
  headerActions?: ReactNode;
  /** Above the title: breadcrumbs, an eyebrow, a status. */
  eyebrow?: ReactNode;
  footer?: ReactNode;
  hideTitle?: boolean;
  /** Dim the page behind (default). false keeps the list usable. */
  scrim?: boolean;
};

/** A panel from the edge for record details and long forms. Floats 8px in, with rounded corners. */
export function DrawerContent({ title, description, side = "right", size = "md", headerActions, eyebrow, footer, hideTitle, scrim = true, children, xstyle, className, style, ...rest }: DrawerContentProps) {
  const sizes = { sm: o.dsm, md: o.dmd, lg: o.dlg, xl: o.dxl };
  return (
    <D.Portal>
      {scrim && <D.Overlay {...px(o.scrim)} />}
      <D.Content
        onOpenAutoFocus={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).focus(); }}
        {...rest} {...sx({ xstyle, className, style }, o.drawer, o[side], sizes[size])}>
        <header {...px(o.head)}>
          <div {...px(o.headText)}>
            {eyebrow}
            <D.Title {...px(o.title, hideTitle && o.srOnly)}>{title}</D.Title>
            {description ? <D.Description {...px(o.desc)}>{description}</D.Description> : <D.Description {...px(o.srOnly)}>{typeof title === "string" ? title : "Details"}</D.Description>}
          </div>
          <div {...px(o.close)}>
            {headerActions}
            <D.Close asChild><IconButton label="Close" size="sm" tooltip={false}><IconX /></IconButton></D.Close>
          </div>
        </header>
        <div {...px(o.body)}>{children}</div>
        {footer && <footer {...px(o.foot)}>{footer}</footer>}
      </D.Content>
    </D.Portal>
  );
}

/** A titled block in a drawer, separated by a hairline — not a card. */
export function DrawerSection({ title, action, children, xstyle }: { title?: ReactNode; action?: ReactNode; children: ReactNode; xstyle?: StyleProps["xstyle"] }) {
  return (
    <section {...sx({ xstyle }, o.section)}>
      {(title || action) && <div {...px(o.sectionHead)}>{title && <h3 {...px(o.eyebrow)}>{title}</h3>}{action}</div>}
      {children}
    </section>
  );
}
// v1 names
export const Sheet = Drawer;
export const SheetTrigger = DrawerTrigger;
export const SheetClose = DrawerClose;
export const SheetContent = DrawerContent;
export const SheetSection = DrawerSection;

/* ============================================================== BottomSheet */

export type BottomSheetProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: ReactNode;
  /** Visible heading in the sheet. Off: title is for screen readers only. */
  showTitle?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  /** Centered, max 560px wide on larger screens instead of full width. */
  docked?: boolean;
};

/** Mobile-first sheet from the bottom. Drag the handle down (or press Esc) to dismiss. */
export function BottomSheet({ open, onOpenChange, title, showTitle = true, children, footer, docked = true }: BottomSheetProps) {
  const [dy, setDy] = useState(0);
  const start = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => { start.current = e.clientY; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (start.current !== null) setDy(Math.max(0, e.clientY - start.current)); };
  const onUp = () => { if (dy > 90) onOpenChange(false); setDy(0); start.current = null; };
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay {...px(o.scrim)} />
        <D.Content {...px(o.sheet, docked && o.sheetDocked)} style={dy ? { transform: `${docked ? "translateX(-50%) " : ""}translateY(${dy}px)`, transition: "none" } : undefined}>
          <div aria-hidden onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} {...px(o.grab)} />
          <header {...px(o.head)}>
            <div {...px(o.headText)}>
              <D.Title {...px(o.title, !showTitle && o.srOnly)}>{title}</D.Title>
              <D.Description {...px(o.srOnly)}>Drag down or press Escape to close.</D.Description>
            </div>
          </header>
          <div {...px(o.body)}>{children}</div>
          {footer && <footer {...px(o.foot)}>{footer}</footer>}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

/** Several bottom sheets where only one is open at a time (filters → sort → share). Pass the active id. */
export function BottomSheetSwitcher({ active, onActiveChange, sheets }: {
  active: string | null; onActiveChange: (id: string | null) => void;
  sheets: { id: string; title: string; content: ReactNode; footer?: ReactNode }[];
}) {
  return <>{sheets.map((s) => <BottomSheet key={s.id} open={active === s.id} onOpenChange={(v) => onActiveChange(v ? s.id : null)} title={s.title} footer={s.footer}>{s.content}</BottomSheet>)}</>;
}

/* ============================================================== CommandPalette */

export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  keywords?: string[];
  shortcut?: string;
  hint?: ReactNode;
  onSelect: () => void;
};

function score(item: CommandItem, q: string) {
  if (!q) return 1;
  const hay = `${item.label} ${item.keywords?.join(" ") ?? ""} ${item.group ?? ""}`.toLowerCase();
  const query = q.toLowerCase().trim();
  if (hay.startsWith(query)) return 3;
  if (hay.includes(query)) return 2;
  let i = 0;
  for (const ch of hay) if (ch === query[i]) i++;
  return i === query.length ? 1 : 0;
}

/** ⌘K / Ctrl+K toggles the palette. */
export function useCommandShortcut(setOpen: (fn: (o: boolean) => boolean) => void, key = "k") {
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) { e.preventDefault(); setOpen((v) => !v); } };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [setOpen, key]);
}

/** Search every action and destination. ↑/↓ move, ↵ runs, Esc closes. */
export function CommandPalette({ open, onOpenChange, items, placeholder = "Search or jump to…", emptyLabel = "No results", footer = true }: {
  open: boolean; onOpenChange: (o: boolean) => void; items: CommandItem[]; placeholder?: string; emptyLabel?: string; footer?: boolean;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => items.map((it, idx) => ({ it, s: score(it, q), idx })).filter((r) => r.s > 0)
    .sort((a, b) => (q ? b.s - a.s : 0) || a.idx - b.idx).map((r) => r.it), [items, q]);
  const groups = useMemo(() => {
    const m = new Map<string, CommandItem[]>();
    for (const r of results) { const g = r.group ?? ""; if (!m.has(g)) m.set(g, []); m.get(g)!.push(r); }
    return [...m.entries()];
  }, [results]);
  const flat = groups.flatMap(([, l]) => l);
  useEffect(() => setActive(0), [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);
  useEffect(() => { listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active]);
  const run = (it?: CommandItem) => { if (!it) return; onOpenChange(false); setTimeout(it.onSelect, 0); };
  let index = -1;
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay {...px(o.scrim)} />
        <D.Content aria-label="Command palette" {...px(o.cmd)}>
          <D.Title {...px(o.srOnly)}>Command palette</D.Title>
          <D.Description {...px(o.srOnly)}>Type to search. Arrow keys move, Enter runs.</D.Description>
          <div {...px(o.cmdIn)}>
            <IconSearch />
            <input autoFocus role="combobox" aria-expanded aria-controls={listId} aria-autocomplete="list"
              aria-activedescendant={flat[active] ? `${listId}-${flat[active].id}` : undefined}
              value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} {...px(o.cmdInput)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
                if (e.key === "Enter") { e.preventDefault(); run(flat[active]); }
              }} />
            <Kbd>Esc</Kbd>
          </div>
          <div ref={listRef} id={listId} role="listbox" aria-label="Results" {...px(o.cmdList)}>
            {flat.length === 0 && <p {...px(o.cmdEmpty)}>{emptyLabel}</p>}
            <IconSizeContext.Provider value={16}>
              {groups.map(([g, list]) => (
                <div key={g || "_"} role="group" aria-label={g || undefined}>
                  {g && <div {...px(o.eyebrow, o.cmdGroup)}>{g}</div>}
                  {list.map((it) => {
                    index++; const i = index; const on = i === active;
                    return (
                      <div key={it.id} id={`${listId}-${it.id}`} role="option" aria-selected={on} data-index={i}
                        onMouseMove={() => setActive(i)} onClick={() => run(it)} {...px(o.cmdItem, on && o.cmdOn)}>
                        <span {...px(o.cmdIcon)}>{it.icon}</span>
                        <span {...px(o.label)}>{it.label}</span>
                        {it.hint && <span {...px(o.cmdHint)}>{it.hint}</span>}
                        {it.shortcut ? <Kbd>{it.shortcut}</Kbd> : on && <span {...px(o.cmdIcon)}><IconCorner size={14} /></span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </IconSizeContext.Provider>
          </div>
          {footer && (
            <div {...px(o.cmdFoot)}>
              <span {...px(o.hint)}><Kbd>↑</Kbd><Kbd>↓</Kbd> Move</span>
              <span {...px(o.hint)}><Kbd>↵</Kbd> Open</span>
              <span {...px(o.hint)} style={{ marginLeft: "auto" }}><Kbd>⌘</Kbd><Kbd>K</Kbd> Toggle</span>
            </div>
          )}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

/* ============================================================== Lightbox */

export type LightboxItem = { src: string; alt: string; caption?: string };

/** Full-screen media viewer. ←/→ move, click zooms, Esc closes. */
export function Lightbox({ open, onOpenChange, items, index = 0, onIndexChange }: {
  open: boolean; onOpenChange: (o: boolean) => void; items: LightboxItem[]; index?: number; onIndexChange?: (i: number) => void;
}) {
  const [i, setI] = useState(index);
  const [zoom, setZoom] = useState(false);
  useEffect(() => { setI(index); setZoom(false); }, [index, open]);
  const go = (d: number) => { const n = (i + d + items.length) % items.length; setI(n); setZoom(false); onIndexChange?.(n); };
  const it = items[i];
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay {...px(o.scrim)} style={{ backgroundColor: "rgba(0,0,0,0.82)" }} />
        <D.Content {...px(o.lb)} onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
          <D.Title {...px(o.srOnly)}>{it?.alt ?? "Image"}</D.Title>
          <D.Description {...px(o.srOnly)}>Use arrow keys to move between images.</D.Description>
          {it && <img src={it.src} alt={it.alt} onClick={() => setZoom((z0) => !z0)} {...px(o.lbImg, zoom && o.lbZoom)} style={{ cursor: zoom ? "zoom-out" : "zoom-in" }} />}
          <div {...px(o.lbBtn, o.lbTop)}>
            <IconButton label={zoom ? "Zoom out" : "Zoom in"} variant="secondary" size="sm" onClick={() => setZoom((z0) => !z0)}><IconZoomIn /></IconButton>
            <D.Close asChild><IconButton label="Close" variant="secondary" size="sm"><IconX /></IconButton></D.Close>
          </div>
          {items.length > 1 && <>
            <div {...px(o.lbBtn, o.lbPrev)}><IconButton label="Previous" variant="secondary" onClick={() => go(-1)}><IconChevronLeft /></IconButton></div>
            <div {...px(o.lbBtn, o.lbNext)}><IconButton label="Next" variant="secondary" onClick={() => go(1)}><IconChevronRight /></IconButton></div>
          </>}
          {(it?.caption || items.length > 1) && <div {...px(o.lbCap)}>{it?.caption ?? it?.alt}{items.length > 1 && ` · ${i + 1} / ${items.length}`}</div>}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

/* ============================================================== Overlay */

export type OverlayProps = StyleProps & {
  /** The thing being covered: an image, a card, a thumbnail. */
  children: ReactNode;
  /** What appears on top: actions, a caption, a play button. */
  content: ReactNode;
  showOn?: "hover" | "always";
  /** Darken toward the bottom so white text stays readable. */
  scrim?: boolean;
  align?: "top-start" | "top-end" | "bottom-start" | "bottom-end" | "center";
};

/** Puts content over media — on hover (and keyboard focus) or always. */
export function Overlay({ children, content, showOn = "hover", scrim = true, align = "bottom-start", ...p }: OverlayProps) {
  const [hover, setHover] = useState(false);
  const pos = {
    "top-start": { alignItems: "flex-start", justifyContent: "flex-start" }, "top-end": { alignItems: "flex-start", justifyContent: "flex-end" },
    "bottom-start": { alignItems: "flex-end", justifyContent: "flex-start" }, "bottom-end": { alignItems: "flex-end", justifyContent: "flex-end" },
    center: { alignItems: "center", justifyContent: "center" },
  }[align];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...sx(p, o.ovRoot)}>
      {children}
      <div {...px(o.ovLayer, (showOn === "always" || hover) && o.ovShow, scrim && o.ovScrim)} style={pos}>{content}</div>
    </div>
  );
}

/* ============================================================== Popconfirm */

/** A light, inline confirmation anchored to its trigger — for reversible-but-annoying actions. */
export function Popconfirm({ children, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "default", onConfirm, side = "top" }: {
  children: ReactNode; title: ReactNode; description?: ReactNode; confirmLabel?: string; cancelLabel?: string;
  tone?: "default" | "danger"; onConfirm: () => void | Promise<void>; side?: "top" | "bottom" | "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger asChild>{children}</P.Trigger>
      <P.Portal>
        <P.Content side={side} sideOffset={8} collisionPadding={8} role="alertdialog" aria-label={typeof title === "string" ? title : "Confirm"} {...px(o.pop, o.pc)}>
          <div {...px(o.pcRow)}>
            <span style={{ color: "inherit" }} {...px(tone === "danger" ? o.alertDanger : o.alertWarn)}>
              <span style={{ display: "flex", padding: 3, borderRadius: 6 }}><IconAlertTriangle size={14} /></span>
            </span>
            <div {...px(o.pcText)}>
              <p {...px(o.strong)}>{title}</p>
              {description && <p {...px(o.soft)}>{description}</p>}
            </div>
          </div>
          <div {...px(o.actions)}>
            <P.Close asChild><Button size="sm" variant="ghost" autoFocus>{cancelLabel}</Button></P.Close>
            <Button size="sm" variant={tone === "danger" ? "danger" : "primary"} loading={busy}
              onClick={async () => { setBusy(true); try { await onConfirm(); setOpen(false); } finally { setBusy(false); } }}>
              {confirmLabel}
            </Button>
          </div>
          <P.Arrow width={12} height={6} {...px(o.arrow)} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ============================================================== Coachmark */

/** An onboarding hint anchored to one element. Chain steps with `step`/`total`. Show once per person. */
export function Coachmark({ children, open, onOpenChange, title, body, step, total, onNext, onBack, side = "bottom" }: {
  children: ReactNode; open: boolean; onOpenChange: (o: boolean) => void; title: ReactNode; body: ReactNode;
  step?: number; total?: number; onNext?: () => void; onBack?: () => void; side?: "top" | "bottom" | "left" | "right";
}) {
  const last = step !== undefined && total !== undefined && step >= total;
  return (
    <P.Root open={open} onOpenChange={onOpenChange}>
      <P.Anchor asChild><span {...px(open && o.coachRing)}>{children}</span></P.Anchor>
      <P.Portal>
        <P.Content side={side} sideOffset={12} collisionPadding={12} onInteractOutside={(e) => e.preventDefault()} {...px(o.pop, o.coach)}>
          <div {...px(o.between)}>
            <p {...px(o.strong)}>{title}</p>
            <P.Close asChild><IconButton label="Close tour" size="xs" tooltip={false} xstyle={o.coachClose}><IconX /></IconButton></P.Close>
          </div>
          <div style={{ opacity: 0.88, fontSize: 13 }}>{body}</div>
          <div {...px(o.between)}>
            {step !== undefined && total !== undefined ? <ProgressDots count={total} current={step - 1} tone="inverse" /> : <span />}
            <div style={{ display: "flex", gap: 6 }}>
              {onBack && step && step > 1 && <Button size="sm" variant="ghost" onClick={onBack} xstyle={o.coachClose}>Back</Button>}
              <Button size="sm" variant="secondary" onClick={last || !onNext ? () => onOpenChange(false) : onNext}>{last || !onNext ? "Done" : "Next"}</Button>
            </div>
          </div>
          <P.Arrow width={12} height={6} {...px(o.coachArrow)} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
