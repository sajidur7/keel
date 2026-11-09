/**
 * Container — surfaces that hold content.
 * Card (+ CardHeader, CardBody, CardFooter) · ClickableCard · SelectableCard · Collapsible · Accordion · AccordionItem · Carousel
 */
import * as stylex from "@stylexjs/stylex";
import { Accordion as A, Collapsible as C } from "radix-ui";
import { Children, createContext, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { IconButton } from "./action";
import { IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight } from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";

const expand = stylex.keyframes({ from: { height: 0, opacity: 0 }, to: { height: "var(--radix-accordion-content-height, var(--radix-collapsible-content-height))", opacity: 1 } });
const collapse = stylex.keyframes({ from: { height: "var(--radix-accordion-content-height, var(--radix-collapsible-content-height))", opacity: 1 }, to: { height: 0, opacity: 0 } });

const k = stylex.create({
  card: { position: "relative", display: "flex", flexDirection: "column", minWidth: 0, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, color: color.fg },
  outline: { boxShadow: `inset 0 0 0 1px ${color.border}`, backgroundColor: "transparent" },
  sunken: { boxShadow: `inset 0 1px 2px ${color.shadeXs}, inset 0 0 0 1px ${color.border}`, backgroundColor: color.surfaceSunken },
  raised: { boxShadow: depth.raised, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})` },
  plain: { boxShadow: "none", backgroundColor: "transparent", borderRadius: 0 },
  pNone: { padding: 0 }, pSm: { padding: 12 }, pMd: { padding: 16 }, pLg: { padding: 24 },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, paddingInline: 16, paddingTop: 14, paddingBottom: 10 },
  headText: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  title: { fontSize: font.lg, fontWeight: font.semibold, letterSpacing: "-0.005em" },
  desc: { fontSize: font.sm, color: color.fgMuted },
  body: { paddingInline: 16, paddingBottom: 16, flex: 1, minWidth: 0 },
  foot: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingInline: 16, paddingBlock: 10, marginTop: "auto",
    borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border, fontSize: font.sm, color: color.fgMuted,
  },
  // interactive
  click: {
    textAlign: "start", width: "100%", cursor: "pointer", outline: "none",
    boxShadow: { default: depth.card, ":hover": depth.cardHover, ":focus-visible": `${depth.card}, ${depth.focus}` },
    transform: { default: null, ":hover": "translateY(-1px)", ":active": "translateY(0)" },
    transitionProperty: "box-shadow, transform", transitionDuration: motion.base, transitionTimingFunction: motion.ease,
    ":disabled": { opacity: 0.5, cursor: "not-allowed", transform: "none" },
  },
  selected: {
    boxShadow: { default: `0 0 0 1.5px ${color.accent}, 0 0 0 5px ${color.focusRing}`, ":hover": `0 0 0 1.5px ${color.accent}, 0 0 0 5px ${color.focusRing}`, ":focus-visible": `0 0 0 1.5px ${color.accent}, 0 0 0 5px ${color.focusRing}` },
    transform: "none",
  },
  tick: {
    position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%",
    color: "#fff", backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`, boxShadow: depth.solid,
    transform: "scale(0.6)", opacity: 0, transitionProperty: "transform, opacity", transitionDuration: motion.base, transitionTimingFunction: motion.spring,
  },
  tickOn: { transform: "scale(1)", opacity: 1 },
  tickOff: { backgroundImage: "none", backgroundColor: color.surface, boxShadow: `inset 0 0 0 1.5px ${color.borderStrong}`, transform: "scale(1)", opacity: 1 },
  // collapsible / accordion
  trigger: {
    display: "flex", alignItems: "center", gap: 8, width: "100%", minHeight: 36, paddingInline: 4, textAlign: "start", fontWeight: font.medium,
    borderRadius: radius.md, outline: "none", cursor: "pointer", color: color.fg, ":focus-visible": { boxShadow: depth.focus },
    ":disabled": { opacity: 0.5, cursor: "not-allowed" },
  },
  chev: {
    display: "inline-flex", color: color.icon, flexShrink: 0, transitionProperty: "transform", transitionDuration: motion.base, transitionTimingFunction: motion.ease,
    transform: { default: null, [stylex.when.ancestor(":is([data-state=open])")]: "rotate(180deg)" },
  },
  chevStart: { transform: { default: "rotate(-90deg)", [stylex.when.ancestor(":is([data-state=open])")]: "rotate(0deg)" } },
  grow: { flex: 1, minWidth: 0 },
  content: {
    overflow: "hidden",
    ":is([data-state=open])": { animationName: expand, animationDuration: motion.base, animationTimingFunction: motion.ease },
    ":is([data-state=closed])": { animationName: collapse, animationDuration: motion.fast, animationTimingFunction: motion.ease },
  },
  inner: { paddingBottom: 12, paddingInline: 4, color: color.fgSoft, fontSize: font.md, lineHeight: 1.55 },
  accItem: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  accSep: { display: "flex", flexDirection: "column", gap: 8 },
  accCard: { borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: depth.card, paddingInline: 8 },
  accTrig: { minHeight: 44 },
  accMeta: { fontSize: font.sm, color: color.fgMuted, fontWeight: font.regular },
  // carousel
  car: { position: "relative", minWidth: 0 },
  track: {
    display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", scrollbarWidth: "none",
    "::-webkit-scrollbar": { display: "none" },
  },
  slide: { flexShrink: 0, scrollSnapAlign: "start" },
  fadeL: { position: "absolute", top: 0, bottom: 0, left: 0, width: 40, pointerEvents: "none", backgroundImage: `linear-gradient(90deg, ${color.canvas}, transparent)` },
  fadeR: { position: "absolute", top: 0, bottom: 0, right: 0, width: 40, pointerEvents: "none", backgroundImage: `linear-gradient(270deg, ${color.canvas}, transparent)` },
  nav: { position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 1 },
  navL: { left: 6 }, navR: { right: 6 },
  head2: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 },
});

/* ============================================================== Card */

export type CardProps = Omit<ComponentProps<"div">, "className" | "style"> & StyleProps & {
  /** card: raised surface (default). outline: hairline only. sunken: a well. raised: tactile tile. plain: no chrome. */
  variant?: "card" | "outline" | "sunken" | "raised" | "plain";
  padding?: "none" | "sm" | "md" | "lg";
};

/** A surface that groups related content. Use only when grouping needs a boundary — most layouts don't. */
export function Card({ variant = "card", padding = "md", children, xstyle, className, style, ...rest }: CardProps) {
  const pad = { none: k.pNone, sm: k.pSm, md: k.pMd, lg: k.pLg }[padding];
  return <div {...rest} {...sx({ xstyle, className, style }, k.card, variant !== "card" && k[variant], pad)}>{children}</div>;
}
/** Title row for a Card with padding="none". */
export function CardHeader({ title, description, action, xstyle }: { title: ReactNode; description?: ReactNode; action?: ReactNode } & StyleProps) {
  return <div {...sx({ xstyle }, k.head)}><div {...px(k.headText)}><h3 {...px(k.title)}>{title}</h3>{description && <p {...px(k.desc)}>{description}</p>}</div>{action}</div>;
}
export function CardBody({ children, xstyle }: { children: ReactNode } & StyleProps) { return <div {...sx({ xstyle }, k.body)}>{children}</div>; }
export function CardFooter({ children, xstyle }: { children: ReactNode } & StyleProps) { return <div {...sx({ xstyle }, k.foot)}>{children}</div>; }

/** A whole card that is one action (open a record, start a template). Lifts on hover. */
export function ClickableCard({ href, onClick, disabled, padding = "md", label, children, xstyle, className, style }: StyleProps & {
  href?: string; onClick?: () => void; disabled?: boolean; padding?: CardProps["padding"]; label?: string; children: ReactNode;
}) {
  const pad = { none: k.pNone, sm: k.pSm, md: k.pMd, lg: k.pLg }[padding];
  const cls = sx({ xstyle, className, style }, k.card, pad, k.click);
  return href
    ? <a href={href} aria-label={label} aria-disabled={disabled || undefined} {...cls}>{children}</a>
    : <button type="button" onClick={onClick} disabled={disabled} aria-label={label} {...cls}>{children}</button>;
}

/** A card you select (plans, templates, integrations). Ring + check when on. Use `type="radio"` inside a group for single choice. */
export function SelectableCard({ selected, onSelectedChange, disabled, padding = "md", type = "checkbox", label, children, xstyle, className, style }: StyleProps & {
  selected: boolean; onSelectedChange: (v: boolean) => void; disabled?: boolean; padding?: CardProps["padding"]; type?: "checkbox" | "radio"; label?: string; children: ReactNode;
}) {
  const pad = { none: k.pNone, sm: k.pSm, md: k.pMd, lg: k.pLg }[padding];
  return (
    <button type="button" role={type} aria-checked={selected} aria-label={label} disabled={disabled} onClick={() => onSelectedChange(type === "radio" ? true : !selected)}
      {...sx({ xstyle, className, style }, k.card, pad, k.click, selected && k.selected)}>
      <span aria-hidden {...px(k.tick, selected ? k.tickOn : k.tickOff)}>{selected && <IconCheck size={12} />}</span>
      {children}
    </button>
  );
}

/* ============================================================== Collapsible */

export type CollapsibleProps = StyleProps & {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  disabled?: boolean;
  /** Chevron before the label (tree-like) or after (default). */
  chevron?: "start" | "end";
};

/** Show/hide one section ("Advanced settings"). For several, use Accordion. */
export function Collapsible({ trigger, children, open, defaultOpen, onOpenChange, disabled, chevron = "end", ...p }: CollapsibleProps) {
  const chev = <span {...px(k.chev, chevron === "start" && k.chevStart)}><IconChevronDown size={14} /></span>;
  return (
    <C.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} disabled={disabled} {...sx(p)}>
      <C.Trigger {...px(k.trigger, stylex.defaultMarker())}>
        {chevron === "start" && chev}<span {...px(k.grow)}>{trigger}</span>{chevron === "end" && chev}
      </C.Trigger>
      <C.Content {...px(k.content)}><div {...px(k.inner)}>{children}</div></C.Content>
    </C.Root>
  );
}

/* ============================================================== Accordion */

type AccordionRootProps = StyleProps & { children: ReactNode; variant?: "divided" | "separated" } & (
  | { type?: "single"; value?: string; defaultValue?: string; onValueChange?: (v: string) => void; collapsible?: boolean }
  | { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (v: string[]) => void }
);

const AccCtx = createContext<"divided" | "separated">("divided");

/** Several collapsible sections (FAQ, settings groups). `variant="separated"` gives each item its own card. */
export function Accordion({ children, variant = "divided", xstyle, className, style, ...rest }: AccordionRootProps) {
  const props = rest.type === "multiple" ? rest : { collapsible: true, ...rest, type: "single" as const };
  return <AccCtx.Provider value={variant}><A.Root {...(props as ComponentProps<typeof A.Root>)} {...sx({ xstyle, className, style }, variant === "separated" && k.accSep)}>{children}</A.Root></AccCtx.Provider>;
}
/** One section. `meta` shows at the right of the trigger (a count, a status). */
export function AccordionItem({ value, title, meta, disabled, children }: { value: string; title: ReactNode; meta?: ReactNode; disabled?: boolean; children: ReactNode }) {
  const sep = useContext(AccCtx) === "separated";
  return (
    <A.Item value={value} disabled={disabled} {...px(sep ? k.accCard : k.accItem)}>
      <A.Header style={{ margin: 0 }}>
        <A.Trigger {...px(k.trigger, k.accTrig, stylex.defaultMarker())}>
          <span {...px(k.grow)}>{title}</span>{meta && <span {...px(k.accMeta)}>{meta}</span>}
          <span {...px(k.chev)}><IconChevronDown size={14} /></span>
        </A.Trigger>
      </A.Header>
      <A.Content {...px(k.content)}><div {...px(k.inner)}>{children}</div></A.Content>
    </A.Item>
  );
}

/* ============================================================== Carousel */

export type CarouselProps = StyleProps & {
  children: ReactNode;
  /** Width of each slide: px, %, or "auto". */
  slideWidth?: number | string;
  gap?: number;
  /** Prev/next buttons over the edges. */
  buttons?: boolean;
  /** Fade the edges when there's more to scroll. */
  edgeFade?: boolean;
  label?: string;
  /** A title row with the buttons instead of floating ones. */
  title?: ReactNode;
};

/** A row of cards that scrolls sideways with snap. Swipe, shift+wheel, or the buttons. */
export function Carousel({ children, slideWidth = 280, gap = 12, buttons = true, edgeFade = true, label = "Carousel", title, ...p }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = () => { const el = ref.current; if (!el) return; setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 }); };
  useEffect(() => { update(); const ro = new ResizeObserver(update); if (ref.current) ro.observe(ref.current); return () => ro.disconnect(); }, []);
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.85, behavior: "smooth" });
  const prev = <IconButton label="Previous" size="sm" variant="secondary" disabled={edges.start} onClick={() => go(-1)}><IconChevronLeft /></IconButton>;
  const next = <IconButton label="Next" size="sm" variant="secondary" disabled={edges.end} onClick={() => go(1)}><IconChevronRight /></IconButton>;
  return (
    <section aria-roledescription="carousel" aria-label={label} {...sx(p, k.car)}>
      {title && <div {...px(k.head2)}><div>{title}</div>{buttons && <div style={{ display: "flex", gap: 6 }}>{prev}{next}</div>}</div>}
      <div ref={ref} onScroll={update} {...px(k.track)} style={{ gap }}>
        {Children.map(children, (ch, i) => <div role="group" aria-roledescription="slide" aria-label={`${i + 1}`} {...px(k.slide)} style={{ width: slideWidth }}>{ch}</div>)}
      </div>
      {edgeFade && !edges.start && <span aria-hidden {...px(k.fadeL)} />}
      {edgeFade && !edges.end && <span aria-hidden {...px(k.fadeR)} />}
      {buttons && !title && <>
        {!edges.start && <span {...px(k.nav, k.navL)}>{prev}</span>}
        {!edges.end && <span {...px(k.nav, k.navR)}>{next}</span>}
      </>}
    </section>
  );
}
