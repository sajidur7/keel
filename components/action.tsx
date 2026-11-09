/**
 * Action — things you press.
 * Button · IconButton · ButtonGroup · Link · ToggleButton · ToggleButtonGroup · SegmentedControl ·
 * Toolbar · DropdownMenu (+ items) · ContextMenu · MoreMenu · CopyButton
 */
import * as stylex from "@stylexjs/stylex";
import { ContextMenu as CM, DropdownMenu as DM, Slot, Toggle, ToggleGroup, Toolbar as TB } from "radix-ui";
import {
  createContext, forwardRef, useContext, useLayoutEffect, useRef, useState,
  type ComponentProps, type ReactNode,
} from "react";
import { color, depth, font, motion, radius, size as sz } from "../tokens/tokens.stylex";
import { IconCheck, IconChevronRight, IconCopy, IconExternal, IconMoreHorizontal, IconSizeContext } from "./icons";
import { sx, px, type StyleProps } from "./lib/sx";
import { Spinner } from "./spinner";
import { Tooltip } from "./overlay";

/* ============================================================== Button */

const fx = stylex.create({
  focus: { outline: "none", ":focus-visible": { boxShadow: depth.focus } },
});

const b = stylex.create({
  base: {
    position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    gap: 6, borderRadius: radius.md, fontFamily: font.sans, fontWeight: font.medium, lineHeight: 1,
    whiteSpace: "nowrap", userSelect: "none", cursor: "pointer", textDecoration: "none", isolation: "isolate",
    transitionProperty: "background-color, background-image, box-shadow, color, transform, opacity",
    transitionDuration: motion.fast, transitionTimingFunction: motion.ease,
    transform: { default: null, ":active": "translateY(1px)" },
    ":disabled": { opacity: 0.45, cursor: "not-allowed", transform: "none" },
    ":is([aria-disabled=true])": { opacity: 0.45, pointerEvents: "none" },
    outline: "none",
  },
  // ---- variants (3D: highlight + ring + drop; pressed: inner shade)
  primary: {
    color: color.onInk,
    backgroundImage: {
      default: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`,
      ":hover": `linear-gradient(${color.inkWash}, ${color.inkWash}), linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`,
    },
    boxShadow: { default: depth.ink, ":active": depth.inkPressed, ":focus-visible": `${depth.ink}, ${depth.focus}` },
  },
  secondary: {
    color: color.fg,
    backgroundImage: {
      default: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`,
      ":hover": `linear-gradient(${color.buttonWash}, ${color.buttonWash}), linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`,
      ":active": `linear-gradient(${color.buttonBottom}, ${color.buttonBottom})`,
      ":is([data-state=open])": `linear-gradient(${color.buttonBottom}, ${color.buttonBottom})`,
    },
    boxShadow: { default: depth.raised, ":hover": depth.raisedHover, ":active": depth.pressed, ":is([data-state=open])": depth.pressed, ":focus-visible": `${depth.raised}, ${depth.focus}` },
  },
  accent: {
    color: color.onAccent,
    backgroundImage: {
      default: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`,
      ":hover": `linear-gradient(${color.solidWash}, ${color.solidWash}), linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`,
    },
    boxShadow: { default: depth.solid, ":active": depth.solidPressed, ":focus-visible": `${depth.solid}, ${depth.focus}` },
  },
  danger: {
    color: "#fff",
    backgroundImage: {
      default: `linear-gradient(180deg, ${color.dangerTop}, ${color.dangerBottom})`,
      ":hover": `linear-gradient(${color.solidWash}, ${color.solidWash}), linear-gradient(180deg, ${color.dangerTop}, ${color.dangerBottom})`,
    },
    boxShadow: { default: depth.solid, ":active": depth.solidPressed, ":focus-visible": `${depth.solid}, ${depth.focusDanger}` },
  },
  soft: {
    color: color.fg,
    backgroundColor: { default: color.muted, ":hover": color.selected, ":is([data-state=open])": color.selected },
    boxShadow: { default: null, ":focus-visible": depth.focus },
  },
  outline: {
    color: color.fg, backgroundColor: { default: "transparent", ":hover": color.hover, ":is([data-state=open])": color.hover },
    boxShadow: { default: `inset 0 0 0 1px ${color.borderStrong}`, ":focus-visible": depth.focus },
  },
  ghost: {
    color: { default: color.fgSoft, ":hover": color.fg, ":is([data-state=open])": color.fg },
    backgroundColor: { default: "transparent", ":hover": color.hover, ":active": color.selected, ":is([data-state=open])": color.hover },
    boxShadow: { default: null, ":focus-visible": depth.focus },
  },
  dangerGhost: {
    color: color.danger,
    backgroundColor: { default: "transparent", ":hover": color.dangerSoft },
    boxShadow: { default: null, ":focus-visible": depth.focusDanger },
  },
  link: {
    height: "auto", paddingInline: 0, borderRadius: radius.xs, color: color.accent,
    textDecorationLine: "underline", textDecorationColor: color.accentBorder, textUnderlineOffset: "3px",
    ":hover": { textDecorationColor: "currentColor" },
    transform: "none",
    boxShadow: { default: null, ":focus-visible": depth.focus },
  },
  // ---- sizes
  xs: { height: sz.xs, paddingInline: 8, fontSize: font.sm, gap: 4, borderRadius: radius.sm },
  sm: { height: sz.sm, paddingInline: 10, fontSize: font.sm, gap: 5, borderRadius: radius.sm },
  md: { height: sz.md, paddingInline: 12, fontSize: font.md },
  lg: { height: sz.lg, paddingInline: 16, fontSize: font.lg, gap: 8, borderRadius: radius.lg },
  full: { width: "100%" },
  loading: { cursor: "progress" },
  hidden: { visibility: "hidden", display: "inline-flex", alignItems: "center", gap: "inherit" },
  spinner: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  iconSlot: { display: "inline-flex", color: "inherit", marginInline: -1 },
  iconMuted: { color: color.icon },
  // grouped (inside ButtonGroup): flat, the group draws the depth
  grouped: {
    borderRadius: 0, boxShadow: { default: "none", ":focus-visible": `inset 0 0 0 2px ${color.accent}` },
    borderInlineStartWidth: 1, borderInlineStartStyle: "solid", borderInlineStartColor: color.border,
    ":first-child": { borderInlineStartWidth: 0 },
    transform: "none",
  },
});

export type ButtonVariant = "primary" | "secondary" | "accent" | "danger" | "soft" | "outline" | "ghost" | "danger-ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
const ICON: Record<ButtonSize, number> = { xs: 12, sm: 14, md: 14, lg: 16 };
const variantStyle = (v: ButtonVariant) => (v === "danger-ghost" ? b.dangerGhost : b[v]);
const quietIcon = (v: ButtonVariant) => v === "secondary" || v === "ghost" || v === "soft" || v === "outline";

const GroupCtx = createContext(false);

export type ButtonProps = Omit<ComponentProps<"button">, "className" | "style"> & StyleProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon before the label. */
  leading?: ReactNode;
  /** Icon or Kbd after the label. */
  trailing?: ReactNode;
  /** Spinner in place of the content; keeps the width, sets aria-busy, blocks clicks. */
  loading?: boolean;
  /** Stretch to the container's width. */
  fullWidth?: boolean;
  /** Render your own element (a router link) with button styles. */
  asChild?: boolean;
};

/**
 * The main way to act. Tactile by design: a top highlight, a hairline ring and a soft drop;
 * it sinks 1px when pressed. One `primary` per view; `secondary` for everything else.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", leading, trailing, loading, fullWidth, asChild, children, disabled, type = "button", onClick, xstyle, className, style, ...rest },
  ref,
) {
  const grouped = useContext(GroupCtx);
  const cls = sx({ xstyle, className, style }, fx.focus, b.base, variantStyle(variant), b[size], fullWidth && b.full, loading && b.loading, grouped && b.grouped);
  const icon = (n: ReactNode) => n && <span {...px(b.iconSlot, quietIcon(variant) && b.iconMuted)}>{n}</span>;
  const body = (
    <>
      {icon(leading)}
      {children}
      {icon(trailing)}
    </>
  );
  if (asChild) return <IconSizeContext.Provider value={ICON[size]}><Slot.Root ref={ref} {...cls} {...rest}>{children}</Slot.Root></IconSizeContext.Provider>;
  return (
    <IconSizeContext.Provider value={ICON[size]}>
      <button
        ref={ref} type={type} disabled={disabled} aria-busy={loading || undefined} data-variant={variant}
        onClick={loading ? (e) => e.preventDefault() : onClick}
        {...cls} {...rest}
      >
        {loading ? (
          <>
            <span {...px(b.hidden)}>{body}</span>
            <span {...px(b.spinner)}><Spinner size={ICON[size]} label="" /></span>
          </>
        ) : body}
      </button>
    </IconSizeContext.Provider>
  );
});

/* ============================================================== IconButton */

const ib = stylex.create({
  xs: { width: sz.xs, paddingInline: 0 },
  sm: { width: sz.sm, paddingInline: 0 },
  md: { width: sz.md, paddingInline: 0 },
  lg: { width: sz.lg, paddingInline: 0 },
  quiet: { color: { default: color.icon, ":hover": color.fg, ":is([data-state=open])": color.fg } },
});

export type IconButtonProps = Omit<ButtonProps, "leading" | "trailing" | "fullWidth"> & {
  /** Accessible name — required. Also the tooltip text. */
  label: string;
  /** Show the label as a tooltip on hover/focus. Default true; pass a string to show different text. */
  tooltip?: boolean | string;
  /** Keyboard hint shown in the tooltip. */
  shortcut?: string;
};

/** A square button with one icon. Always labelled; shows its label as a tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tooltip = true, shortcut, variant = "ghost", size = "md", children, xstyle, ...rest },
  ref,
) {
  const btn = (
    <Button ref={ref} aria-label={label} variant={variant} size={size}
      xstyle={[ib[size], variant === "ghost" && ib.quiet, ...([] as unknown[]).concat(xstyle ?? []) as never[]]} {...rest}>
      <IconSizeContext.Provider value={size === "lg" ? 18 : size === "xs" ? 13 : 16}>{children}</IconSizeContext.Provider>
    </Button>
  );
  if (!tooltip) return btn;
  return <Tooltip content={typeof tooltip === "string" ? tooltip : label} shortcut={shortcut}>{btn}</Tooltip>;
});

/* ============================================================== ButtonGroup */

const bg = stylex.create({
  root: {
    display: "inline-flex", alignItems: "stretch", borderRadius: radius.md, overflow: "hidden", isolation: "isolate",
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
  },
  sm: { borderRadius: radius.sm },
});

export type ButtonGroupProps = ComponentProps<"div"> & StyleProps & { size?: ButtonSize; label?: string };

/** Related actions joined into one tactile bar (Undo | Redo, Prev | Next). Children are Buttons/IconButtons with variant="ghost". */
export function ButtonGroup({ size, label, children, xstyle, className, style, ...rest }: ButtonGroupProps) {
  return (
    <GroupCtx.Provider value>
      <div role="group" aria-label={label} {...sx({ xstyle, className, style }, bg.root, (size === "sm" || size === "xs") && bg.sm)} {...rest}>{children}</div>
    </GroupCtx.Provider>
  );
}

/* ============================================================== Link */

const lk = stylex.create({
  root: {
    display: "inline-flex", alignItems: "center", gap: 3, borderRadius: radius.xs, outline: "none", cursor: "pointer",
    textDecorationLine: "underline", textUnderlineOffset: "3px", textDecorationThickness: "1px",
    transitionProperty: "color, text-decoration-color", transitionDuration: motion.fast,
    ":focus-visible": { boxShadow: depth.focus },
  },
  accent: { color: { default: color.accent, ":hover": color.accentStrong }, textDecorationColor: { default: color.accentBorder, ":hover": "currentColor" } },
  neutral: { color: color.fg, textDecorationColor: { default: color.borderStrong, ":hover": "currentColor" } },
  quiet: { color: { default: color.fgSoft, ":hover": color.fg }, textDecorationLine: { default: "none", ":hover": "underline" } },
});

export type LinkProps = ComponentProps<"a"> & StyleProps & { tone?: "accent" | "neutral" | "quiet"; external?: boolean };

/** Text that navigates. Use Button for actions. `external` opens a new tab and shows ↗. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ tone = "accent", external, children, xstyle, className, style, ...rest }, ref) {
  return (
    <a ref={ref} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...sx({ xstyle, className, style }, lk.root, lk[tone])} {...rest}>
      {children}
      {external && <IconExternal size={12} />}
    </a>
  );
});

/* ============================================================== ToggleButton(+Group) */

const tg = stylex.create({
  on: {
    color: color.fg,
    backgroundImage: { default: `linear-gradient(${color.selected}, ${color.selected})`, ":hover": `linear-gradient(${color.selected}, ${color.selected})` },
    boxShadow: { default: `inset 0 1px 2px ${color.shadeSm}, inset 0 0 0 1px ${color.borderStrong}`, ":focus-visible": depth.focus },
    transform: "none",
  },
  group: { display: "inline-flex", gap: 2, padding: 2, borderRadius: radius.lg, backgroundColor: color.muted, boxShadow: `inset 0 1px 2px ${color.shadeXs}` },
  groupItem: {
    backgroundColor: { default: "transparent", ":hover": color.hover },
    color: { default: color.fgMuted, ":hover": color.fg },
    ":is([data-state=on])": { backgroundColor: color.surfaceRaised, color: color.fg, boxShadow: depth.raised },
    boxShadow: { default: null, ":focus-visible": depth.focus },
  },
});

export type ToggleButtonProps = Omit<ComponentProps<typeof Toggle.Root>, "className" | "style"> & StyleProps & {
  size?: ButtonSize;
  leading?: ReactNode;
  /** Icon-only: pass `label` for the accessible name. */
  label?: string;
};

/** A button that stays pressed (Bold, Pin, Follow). Sinks in when on. */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { size = "md", leading, label, children, xstyle, className, style, pressed, defaultPressed, onPressedChange, ...rest }, ref,
) {
  const [on, setOn] = useState(defaultPressed ?? false);
  const isOn = pressed ?? on;
  const iconOnly = !children;
  return (
    <IconSizeContext.Provider value={ICON[size]}>
      <Toggle.Root ref={ref} aria-label={label} pressed={isOn} onPressedChange={(v) => { setOn(v); onPressedChange?.(v); }}
        {...sx({ xstyle, className, style }, fx.focus, b.base, b.ghost, b[size], iconOnly && ib[size], isOn && tg.on)} {...rest}>
        {leading}{children}
      </Toggle.Root>
    </IconSizeContext.Provider>
  );
});

type TGProps = { size?: ButtonSize; items: { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean; ariaLabel?: string }[] } & StyleProps;
export type ToggleButtonGroupProps =
  | (TGProps & { type: "single"; value?: string; defaultValue?: string; onValueChange?: (v: string) => void })
  | (TGProps & { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void });

/** A set of toggles in a sunken tray — formatting (B I U), view options. Single or multiple. */
export function ToggleButtonGroup({ size = "sm", items, xstyle, className, style, ...rest }: ToggleButtonGroupProps) {
  return (
    <IconSizeContext.Provider value={ICON[size]}>
      <ToggleGroup.Root {...(rest as ComponentProps<typeof ToggleGroup.Root>)} {...sx({ xstyle, className, style }, tg.group)}>
        {items.map((it) => (
          <ToggleGroup.Item key={it.value} value={it.value} disabled={it.disabled} aria-label={it.ariaLabel}
            {...px(fx.focus, b.base, b[size], !it.label && ib[size], tg.groupItem)}>
            {it.icon}{it.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== SegmentedControl */

const sg = stylex.create({
  root: {
    position: "relative", display: "inline-flex", alignItems: "stretch", padding: 2, gap: 0, borderRadius: radius.md,
    backgroundColor: color.muted, boxShadow: `inset 0 1px 2px ${color.shadeXs}, inset 0 0 0 1px ${color.border}`, isolation: "isolate",
  },
  full: { display: "flex", width: "100%" },
  thumb: {
    position: "absolute", top: 2, bottom: 2, left: 0, zIndex: -1, borderRadius: radius.sm,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
    transitionProperty: "transform, width", transitionDuration: motion.base, transitionTimingFunction: motion.spring,
  },
  item: {
    flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, paddingInline: 10,
    borderRadius: radius.sm, fontWeight: font.medium, whiteSpace: "nowrap", cursor: "pointer", outline: "none",
    color: { default: color.fgMuted, ":hover": color.fg, ":is([data-state=on])": color.fg },
    transitionProperty: "color", transitionDuration: motion.fast,
    ":focus-visible": { boxShadow: depth.focus },
    ":disabled": { opacity: 0.45, cursor: "not-allowed" },
  },
  sm: { height: 24, fontSize: font.sm },
  md: { height: 28, fontSize: font.md },
  lg: { height: 36, fontSize: font.lg },
});

export type SegmentedControlProps = StyleProps & {
  items: { value: string; label?: ReactNode; icon?: ReactNode; disabled?: boolean; ariaLabel?: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  /** Accessible name for the group. */
  label?: string;
};

/** Pick one of 2–5 views. The selection is a raised knob that slides between options. */
export function SegmentedControl({ items, value, defaultValue, onValueChange, size = "md", fullWidth, label, ...p }: SegmentedControlProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const v = value ?? inner;
  const root = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = root.current?.querySelector<HTMLElement>('[data-state="on"]');
      if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [v, items.length]);
  return (
    <IconSizeContext.Provider value={14}>
      <ToggleGroup.Root ref={root} type="single" value={v} aria-label={label}
        onValueChange={(nv) => { if (!nv) return; setInner(nv); onValueChange?.(nv); }}
        {...sx(p, sg.root, fullWidth && sg.full)}>
        {box && <span aria-hidden {...px(sg.thumb)} style={{ transform: `translateX(${box.x}px)`, width: box.w }} />}
        {items.map((it) => (
          <ToggleGroup.Item key={it.value} value={it.value} disabled={it.disabled} aria-label={it.ariaLabel} {...px(sg.item, sg[size])}>
            {it.icon}{it.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== Toolbar */

const tb = stylex.create({
  root: {
    display: "inline-flex", alignItems: "center", gap: 2, padding: 4, borderRadius: radius.lg,
    backgroundColor: color.surfaceRaised, boxShadow: depth.popover, maxWidth: "100%", overflowX: "auto",
  },
  flat: { boxShadow: `inset 0 0 0 1px ${color.border}`, backgroundColor: color.surface },
  sep: { width: 1, alignSelf: "stretch", marginBlock: 4, marginInline: 4, backgroundColor: color.border },
});

export type ToolbarProps = ComponentProps<typeof TB.Root> & StyleProps & { variant?: "floating" | "flat" };

/** A row of tools (editor formatting, canvas tools, bulk actions). Arrow keys move between items. */
export function Toolbar({ variant = "floating", xstyle, className, style, ...rest }: ToolbarProps) {
  return <TB.Root {...rest} {...sx({ xstyle, className, style }, tb.root, variant === "flat" && tb.flat)} />;
}
/** A tool. Pass `label` for icon-only tools (it becomes the tooltip); omit it for text tools. */
export const ToolbarButton = forwardRef<HTMLButtonElement, Omit<IconButtonProps, "label"> & { label?: string; active?: boolean }>(
  function ToolbarButton({ label, active, children, size = "sm", variant = "ghost", ...rest }, ref) {
    const inner = label
      ? <IconButton ref={ref} label={label} size={size} variant={variant} xstyle={active && tg.on} aria-pressed={active} {...rest}>{children}</IconButton>
      : <Button ref={ref} size={size} variant={variant} xstyle={active && tg.on} aria-pressed={active} {...rest}>{children}</Button>;
    return <TB.Button asChild>{inner}</TB.Button>;
  },
);
export function ToolbarSeparator() { return <TB.Separator {...px(tb.sep)} />; }
export const ToolbarToggleGroup = ToggleButtonGroup;

/* ============================================================== Menus (Dropdown + Context share styles) */

const pop = stylex.keyframes({ from: { opacity: 0, transform: "scale(0.96) translateY(-3px)" }, to: { opacity: 1, transform: "none" } });

export const menu = stylex.create({
  content: {
    zIndex: 60, minWidth: 184, maxHeight: "var(--radix-dropdown-menu-content-available-height, 70vh)", overflowY: "auto",
    padding: 4, borderRadius: radius.lg, backgroundColor: color.surfaceRaised, color: color.fg, boxShadow: depth.popover,
    fontSize: font.md, outline: "none",
    transformOrigin: "var(--radix-dropdown-menu-content-transform-origin, var(--radix-context-menu-content-transform-origin))",
    animationName: pop, animationDuration: motion.fast, animationTimingFunction: motion.ease,
  },
  item: {
    position: "relative", display: "flex", alignItems: "center", gap: 8, height: 30, paddingInline: 8,
    borderRadius: radius.sm, cursor: "pointer", userSelect: "none", outline: "none", color: color.fg,
    ":is([data-highlighted])": { backgroundColor: color.hover },
    ":is([data-disabled])": { opacity: 0.45, cursor: "not-allowed" },
    ":is([data-state=open])": { backgroundColor: color.hover },
  },
  danger: { color: color.danger, ":is([data-highlighted])": { backgroundColor: color.dangerSoft } },
  icon: { display: "inline-flex", color: color.icon, width: 16, justifyContent: "center" },
  iconDanger: { color: "inherit" },
  label: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  shortcut: { marginInlineStart: "auto", paddingInlineStart: 16, fontSize: font.sm, color: color.fgFaint, fontFamily: font.sans, letterSpacing: "0.02em" },
  heading: { paddingInline: 8, paddingTop: 6, paddingBottom: 4, fontSize: font.xs, fontWeight: font.medium, color: color.fgMuted, letterSpacing: "0.04em", textTransform: "uppercase" },
  sep: { height: 1, marginBlock: 4, marginInline: -4, backgroundColor: color.border },
  check: { display: "inline-flex", width: 16, justifyContent: "center", color: color.fg },
  dot: { width: 6, height: 6, borderRadius: "50%", backgroundColor: "currentColor" },
});

type ItemExtra = { icon?: ReactNode; shortcut?: string; destructive?: boolean };
const itemBody = (icon: ReactNode, children: ReactNode, shortcut?: string, destructive?: boolean, trailing?: ReactNode) => (
  <IconSizeContext.Provider value={14}>
    <span {...px(menu.icon, destructive && menu.iconDanger)} aria-hidden>{icon}</span>
    <span {...px(menu.label)}>{children}</span>
    {shortcut && <span {...px(menu.shortcut)}>{shortcut}</span>}
    {trailing}
  </IconSizeContext.Provider>
);

export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export const DropdownMenuGroup = DM.Group;
export const DropdownMenuRadioGroup = DM.RadioGroup;
export const DropdownMenuSub = DM.Sub;
export const DropdownMenuPortal = DM.Portal;

export function DropdownMenuContent({ sideOffset = 6, align = "start", xstyle, className, style, ...rest }: ComponentProps<typeof DM.Content> & StyleProps) {
  return <DM.Portal><DM.Content sideOffset={sideOffset} align={align} collisionPadding={8} {...rest} {...sx({ xstyle, className, style }, menu.content)} /></DM.Portal>;
}
/** One action. `destructive` turns it red; `shortcut` shows the key on the right. */
export function DropdownMenuItem({ icon, shortcut, destructive, children, xstyle, className, style, ...rest }: ComponentProps<typeof DM.Item> & StyleProps & ItemExtra) {
  return <DM.Item {...rest} {...sx({ xstyle, className, style }, menu.item, destructive && menu.danger)}>{itemBody(icon, children, shortcut, destructive)}</DM.Item>;
}
export function DropdownMenuCheckboxItem({ children, shortcut, ...rest }: ComponentProps<typeof DM.CheckboxItem> & { shortcut?: string }) {
  return (
    <DM.CheckboxItem {...rest} {...px(menu.item)}>
      {itemBody(<DM.ItemIndicator {...px(menu.check)}><IconCheck size={14} /></DM.ItemIndicator>, children, shortcut)}
    </DM.CheckboxItem>
  );
}
export function DropdownMenuRadioItem({ children, ...rest }: ComponentProps<typeof DM.RadioItem>) {
  return <DM.RadioItem {...rest} {...px(menu.item)}>{itemBody(<DM.ItemIndicator {...px(menu.check)}><span {...px(menu.dot)} /></DM.ItemIndicator>, children)}</DM.RadioItem>;
}
export function DropdownMenuLabel(props: ComponentProps<typeof DM.Label>) { return <DM.Label {...props} {...px(menu.heading)} />; }
export function DropdownMenuSeparator() { return <DM.Separator {...px(menu.sep)} />; }
export function DropdownMenuSubTrigger({ icon, children, ...rest }: ComponentProps<typeof DM.SubTrigger> & { icon?: ReactNode }) {
  return <DM.SubTrigger {...rest} {...px(menu.item)}>{itemBody(icon, children, undefined, false, <IconChevronRight size={14} />)}</DM.SubTrigger>;
}
export function DropdownMenuSubContent(props: ComponentProps<typeof DM.SubContent>) {
  return <DM.Portal><DM.SubContent sideOffset={6} collisionPadding={8} {...props} {...px(menu.content)} /></DM.Portal>;
}

/* Context menu — same look, opens on right-click. */
export const ContextMenu = CM.Root;
export const ContextMenuTrigger = CM.Trigger;
export const ContextMenuGroup = CM.Group;
export const ContextMenuSub = CM.Sub;
export function ContextMenuContent({ xstyle, className, style, ...rest }: ComponentProps<typeof CM.Content> & StyleProps) {
  return <CM.Portal><CM.Content collisionPadding={8} {...rest} {...sx({ xstyle, className, style }, menu.content)} /></CM.Portal>;
}
export function ContextMenuItem({ icon, shortcut, destructive, children, ...rest }: ComponentProps<typeof CM.Item> & ItemExtra) {
  return <CM.Item {...rest} {...px(menu.item, destructive && menu.danger)}>{itemBody(icon, children, shortcut, destructive)}</CM.Item>;
}
export function ContextMenuCheckboxItem({ children, ...rest }: ComponentProps<typeof CM.CheckboxItem>) {
  return <CM.CheckboxItem {...rest} {...px(menu.item)}>{itemBody(<CM.ItemIndicator {...px(menu.check)}><IconCheck size={14} /></CM.ItemIndicator>, children)}</CM.CheckboxItem>;
}
export function ContextMenuLabel(props: ComponentProps<typeof CM.Label>) { return <CM.Label {...props} {...px(menu.heading)} />; }
export function ContextMenuSeparator() { return <CM.Separator {...px(menu.sep)} />; }
export function ContextMenuSubTrigger({ icon, children, ...rest }: ComponentProps<typeof CM.SubTrigger> & { icon?: ReactNode }) {
  return <CM.SubTrigger {...rest} {...px(menu.item)}>{itemBody(icon, children, undefined, false, <IconChevronRight size={14} />)}</CM.SubTrigger>;
}
export function ContextMenuSubContent(props: ComponentProps<typeof CM.SubContent>) {
  return <CM.Portal><CM.SubContent collisionPadding={8} {...props} {...px(menu.content)} /></CM.Portal>;
}

/* ============================================================== MoreMenu */

export type MenuItemSpec = "separator" | { label: string; icon?: ReactNode; shortcut?: string; destructive?: boolean; disabled?: boolean; onSelect?: () => void; heading?: false } | { heading: string };

/** "…" button with a menu, from a list. The quickest way to add row or card actions. */
export function MoreMenu({ items, label = "More actions", size = "sm", align = "end", variant = "ghost" }: {
  items: MenuItemSpec[]; label?: string; size?: ButtonSize; align?: "start" | "end"; variant?: ButtonVariant;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={label} size={size} variant={variant} tooltip={false}><IconMoreHorizontal /></IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((it, i) =>
          it === "separator" ? <DropdownMenuSeparator key={i} />
          : "heading" in it && typeof it.heading === "string" ? <DropdownMenuLabel key={i}>{it.heading}</DropdownMenuLabel>
          : (() => { const m = it as Exclude<MenuItemSpec, "separator" | { heading: string }>; return (
            <DropdownMenuItem key={i} icon={m.icon} shortcut={m.shortcut} destructive={m.destructive} disabled={m.disabled} onSelect={m.onSelect}>{m.label}</DropdownMenuItem>
          ); })(),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ============================================================== CopyButton */

const cp = stylex.create({ ok: { color: color.success } });

/** Copies `value`, swaps to a check for 1.5s. Icon-only by default; pass children for a labelled button. */
export function CopyButton({ value, label = "Copy", size = "sm", variant = "ghost", children, onCopied }: {
  value: string; label?: string; size?: ButtonSize; variant?: ButtonVariant; children?: ReactNode; onCopied?: () => void;
}) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard?.writeText(value); } catch { /* clipboard blocked */ }
    setDone(true); onCopied?.(); setTimeout(() => setDone(false), 1500);
  };
  const icon = done ? <IconCheck /> : <IconCopy />;
  if (children) return <Button size={size} variant={variant} leading={<span {...px(done && cp.ok)}>{icon}</span>} onClick={copy}>{done ? "Copied" : children}</Button>;
  return <IconButton label={done ? "Copied" : label} size={size} variant={variant} onClick={copy} xstyle={done && cp.ok}>{icon}</IconButton>;
}
