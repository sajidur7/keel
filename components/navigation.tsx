/**
 * Navigation — moving around.
 * SideNav (Sidebar + parts, SidebarProvider/useSidebar) · TopNav · TopNavItem · TopNavMenu · MegaMenu · MegaMenuFeaturedCard · MobileNav ·
 * Breadcrumbs · Tabs (TabList) · Pagination · Stepper (Steps) · Outline (Anchor) · FilterMenu · FilterButton
 */
import * as stylex from "@stylexjs/stylex";
import { NavigationMenu as NM, Tabs as TP } from "radix-ui";
import {
  createContext, Fragment, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState,
  type ComponentProps, type ReactNode,
} from "react";
import { color, depth, font, motion, radius, size as sz, z } from "../tokens/tokens.stylex";
import {
  Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, IconButton,
} from "./action";
import { CountBadge } from "./feedback";
import {
  IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconFilter, IconSearch, IconSidebar, IconSizeContext, IconX,
} from "./icons";
import { Input } from "./inputs";
import { px, sx, type StyleProps } from "./lib/sx";
import { Drawer, DrawerContent, Tooltip } from "./overlay";

const popIn = stylex.keyframes({ from: { opacity: 0, transform: "translateY(-4px) scale(0.98)" }, to: { opacity: 1, transform: "none" } });

/* ============================================================== Sidebar / SideNav */

type SidebarCtx = { collapsed: boolean; setCollapsed: (v: boolean | ((c: boolean) => boolean)) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void; width: number; setWidth: (w: number) => void; inDrawer: boolean };
const Ctx = createContext<SidebarCtx | null>(null);
const MIN = 200, MAX = 360, DEFAULT = 244, RAIL = 56;

export function useSidebar() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSidebar must be used inside <SidebarProvider> (AppShell adds one)");
  return c;
}

/** Holds collapsed/width/mobile state. AppShell renders one for you. ⌘B / Ctrl+B toggles. */
export function SidebarProvider({ children, defaultCollapsed = false }: { children: ReactNode; defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [width, setW] = useState(() => { try { return Number(localStorage.getItem("keel-sidebar-width")) || DEFAULT; } catch { return DEFAULT; } });
  const setWidth = useCallback((w: number) => { const v = Math.round(Math.min(MAX, Math.max(MIN, w))); setW(v); try { localStorage.setItem("keel-sidebar-width", String(v)); } catch { /* blocked */ } }, []);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); if (window.matchMedia("(min-width: 1024px)").matches) setCollapsed((c) => !c); else setMobileOpen((o) => !o); }
    };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, []);
  return <Ctx.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, width, setWidth, inDrawer: false }}>{children}</Ctx.Provider>;
}

const sb = stylex.create({
  aside: {
    position: "sticky", top: 0, display: { default: "none", "@media (min-width: 1024px)": "flex" }, flexDirection: "column", flexShrink: 0,
    height: "100dvh", color: color.fg, transitionProperty: "width", transitionDuration: motion.base, transitionTimingFunction: motion.ease,
  },
  insetAside: { height: "calc(100dvh - 16px)", top: 8 },
  drawerBody: { display: "flex", flexDirection: "column", height: "100%", marginInline: -20, marginBottom: -20 },
  resize: {
    position: "absolute", top: 0, right: -4, bottom: 0, width: 8, cursor: "col-resize", outline: "none", zIndex: 1,
    "::after": { content: '""', position: "absolute", top: 12, bottom: 12, left: 3, width: 2, borderRadius: 2, backgroundColor: "transparent", transitionProperty: "background-color", transitionDuration: motion.fast },
    ":hover::after": { backgroundColor: color.borderStrong }, ":focus-visible::after": { backgroundColor: color.accent },
  },
  brand: { display: "flex", alignItems: "center", gap: 10, height: sz.header, paddingInline: 12, flexShrink: 0 },
  brandRail: { justifyContent: "center", paddingInline: 0 },
  logo: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: radius.md, flexShrink: 0,
    color: color.onInk, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink, fontWeight: font.bold, fontSize: font.md,
  },
  brandText: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1, lineHeight: 1.2 },
  brandName: { fontWeight: font.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  brandMeta: { fontSize: font.sm, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  content: { display: "flex", flexDirection: "column", gap: 16, flex: 1, minHeight: 0, overflowY: "auto", paddingInline: 8, paddingBlock: 8 },
  section: { display: "flex", flexDirection: "column", gap: 1 },
  sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 24, paddingInline: 10, marginBottom: 2, fontSize: font.xs, fontWeight: font.medium, letterSpacing: "0.05em", textTransform: "uppercase", color: color.fgFaint },
  railDivider: { height: 1, marginInline: 12, marginBlock: 4, backgroundColor: color.border },
  item: {
    position: "relative", display: "flex", alignItems: "center", gap: 10, height: 32, paddingInline: 10, borderRadius: radius.md,
    fontSize: font.md, fontWeight: font.medium, color: { default: color.fgSoft, ":hover": color.fg }, textDecoration: "none", outline: "none", cursor: "pointer", width: "100%", textAlign: "start",
    backgroundColor: { default: "transparent", ":hover": color.hover },
    transitionProperty: "background-color, color, box-shadow", transitionDuration: motion.fast,
    ":focus-visible": { boxShadow: depth.focus },
  },
  itemOn: {
    color: { default: color.fg, ":hover": color.fg }, backgroundColor: { default: color.surface, ":hover": color.surface },
    boxShadow: { default: depth.raised, ":focus-visible": `${depth.raised}, ${depth.focus}` },
  },
  itemRail: { justifyContent: "center", paddingInline: 0, width: 40, marginInline: "auto" },
  itemIcon: { display: "inline-flex", color: color.icon, flexShrink: 0 },
  itemIconOn: { color: color.fg },
  itemLabel: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  railBadge: { position: "absolute", top: 4, right: 6, width: 6, height: 6, borderRadius: "50%", backgroundColor: color.accent },
  sub: { display: "flex", flexDirection: "column", gap: 1, marginInlineStart: 19, paddingInlineStart: 10, borderInlineStartWidth: 1, borderInlineStartStyle: "solid", borderInlineStartColor: color.border },
  footer: { display: "flex", flexDirection: "column", gap: 8, padding: 8, flexShrink: 0 },
});

/** The app's main navigation. Collapses to a 56px rail (⌘B), resizable by its edge, a drawer under 1024px. */
export function Sidebar({ children, label = "Main navigation", ...p }: StyleProps & { children: ReactNode; label?: string }) {
  const ctx = useSidebar();
  const drag = useRef(false);
  return (
    <>
      <aside aria-label={label} data-collapsed={ctx.collapsed || undefined} {...sx(p, sb.aside, sb.insetAside)} style={{ width: ctx.collapsed ? RAIL : ctx.width, ...p.style }}>
        {children}
        {!ctx.collapsed && (
          <div role="separator" aria-orientation="vertical" aria-label="Resize sidebar" aria-valuemin={MIN} aria-valuemax={MAX} aria-valuenow={ctx.width} tabIndex={0}
            onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
            onPointerMove={(e) => { if (drag.current) ctx.setWidth(e.clientX - 8); }} onPointerUp={() => (drag.current = false)}
            onDoubleClick={() => ctx.setWidth(DEFAULT)}
            onKeyDown={(e) => { if (e.key === "ArrowLeft") ctx.setWidth(ctx.width - 16); if (e.key === "ArrowRight") ctx.setWidth(ctx.width + 16); }}
            {...px(sb.resize)} />
        )}
      </aside>
      <Drawer open={ctx.mobileOpen} onOpenChange={ctx.setMobileOpen}>
        <DrawerContent side="left" size="sm" title={label} hideTitle>
          <Ctx.Provider value={{ ...ctx, collapsed: false, inDrawer: true }}><div {...px(sb.drawerBody)}>{children}</div></Ctx.Provider>
        </DrawerContent>
      </Drawer>
    </>
  );
}
/** Astryx-style name. */
export const SideNav = Sidebar;

export function SidebarBrand({ logo, name, meta, action }: { logo: ReactNode; name: ReactNode; meta?: ReactNode; action?: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div {...px(sb.brand, collapsed && sb.brandRail)}>
      <span {...px(sb.logo)}>{logo}</span>
      {!collapsed && <><span {...px(sb.brandText)}><span {...px(sb.brandName)}>{name}</span>{meta && <span {...px(sb.brandMeta)}>{meta}</span>}</span>{action}</>}
    </div>
  );
}
export function SidebarContent({ children }: { children: ReactNode }) { return <nav {...px(sb.content)}>{children}</nav>; }
export function SidebarSection({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div role="group" aria-label={title} {...px(sb.section)}>
      {title && (collapsed ? <span aria-hidden {...px(sb.railDivider)} /> : <div {...px(sb.sectionHead)}><span>{title}</span>{action}</div>)}
      {children}
    </div>
  );
}

export type SidebarItemProps = { icon?: ReactNode; label: string; count?: number; active?: boolean; href?: string; onClick?: () => void; trailing?: ReactNode; children?: ReactNode };
/** One destination. The active item is a raised tile. Children render as an indented sub-list. */
export function SidebarItem({ icon, label, count, active, href, onClick, trailing, children }: SidebarItemProps) {
  const { collapsed, inDrawer, setMobileOpen } = useSidebar();
  const click = () => { onClick?.(); if (inDrawer) setMobileOpen(false); };
  const inner = (
    <IconSizeContext.Provider value={16}>
      {icon && <span {...px(sb.itemIcon, active && sb.itemIconOn)}>{icon}</span>}
      {!collapsed && <span {...px(sb.itemLabel)}>{label}</span>}
      {!collapsed && count !== undefined && <CountBadge tone={active ? "accent" : "neutral"}>{count}</CountBadge>}
      {!collapsed && trailing}
      {collapsed && count ? <span aria-hidden {...px(sb.railBadge)} /> : null}
    </IconSizeContext.Provider>
  );
  const cls = px(sb.item, active && sb.itemOn, collapsed && sb.itemRail);
  const el = href
    ? <a href={href} onClick={click} aria-current={active ? "page" : undefined} aria-label={collapsed ? label : undefined} {...cls}>{inner}</a>
    : <button type="button" onClick={click} aria-current={active ? "page" : undefined} aria-label={collapsed ? label : undefined} {...cls}>{inner}</button>;
  return (
    <>
      {collapsed ? <Tooltip content={label} side="right">{el}</Tooltip> : el}
      {children && !collapsed && <div {...px(sb.sub)}>{children}</div>}
    </>
  );
}
export function SidebarFooter({ children }: { children: ReactNode }) { return <div {...px(sb.footer)}>{children}</div>; }
/** The header button that collapses the rail (desktop) or opens the drawer (mobile). */
export function SidebarTrigger() {
  const ctx = useSidebar();
  return (
    <IconButton label="Toggle sidebar" shortcut="⌘B" size="sm"
      onClick={() => { if (window.matchMedia("(min-width: 1024px)").matches) ctx.setCollapsed((c) => !c); else ctx.setMobileOpen(true); }}>
      <IconSidebar />
    </IconButton>
  );
}

/* ============================================================== TopNav, menus, MobileNav */

const tn = stylex.create({
  bar: {
    position: "sticky", top: 0, zIndex: z.header, display: "flex", alignItems: "center", gap: 16, height: 56, paddingInline: { default: 12, "@media (min-width: 768px)": 20 },
    backgroundColor: `color-mix(in srgb, ${color.surface} 88%, transparent)`, backdropFilter: "saturate(1.4) blur(10px)",
    borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border,
  },
  heading: { display: "flex", alignItems: "center", gap: 10, fontWeight: font.semibold, flexShrink: 0 },
  start: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  center: { flex: 1, display: { default: "none", "@media (min-width: 768px)": "flex" }, justifyContent: "center" },
  end: { display: "flex", alignItems: "center", gap: 8, marginInlineStart: "auto" },
  list: { display: "flex", alignItems: "center", gap: 2, listStyle: "none" },
  item: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 32, paddingInline: 10, borderRadius: radius.md, fontSize: font.md, fontWeight: font.medium,
    color: { default: color.fgSoft, ":hover": color.fg, ":is([data-state=open])": color.fg }, backgroundColor: { default: "transparent", ":hover": color.hover, ":is([data-state=open])": color.hover },
    outline: "none", cursor: "pointer", textDecoration: "none", ":focus-visible": { boxShadow: depth.focus },
  },
  itemOn: { color: color.fg, backgroundColor: color.selected },
  chev: { display: "inline-flex", color: color.icon, transitionProperty: "transform", transitionDuration: motion.base, transform: { default: null, [stylex.when.ancestor(":is([data-state=open])")]: "rotate(180deg)" } },
  viewportWrap: { position: "absolute", top: "100%", left: 0, right: 0, display: "flex", justifyContent: "center", perspective: 2000 },
  viewport: {
    position: "relative", marginTop: 8, overflow: "hidden", borderRadius: radius.xl, backgroundColor: color.surfaceRaised, boxShadow: depth.popover,
    width: "var(--radix-navigation-menu-viewport-width)", height: "var(--radix-navigation-menu-viewport-height)",
    transitionProperty: "width, height", transitionDuration: motion.base, transitionTimingFunction: motion.ease,
    animationName: popIn, animationDuration: motion.fast,
  },
  menu: { display: "grid", gap: 4, padding: 8, width: "max-content", maxWidth: "calc(100vw - 32px)" },
  mega: { display: "grid", gridTemplateColumns: { default: "1fr", "@media (min-width: 768px)": "repeat(var(--cols), minmax(200px, 1fr)) auto" }, gap: 16, padding: 16, width: "min(860px, calc(100vw - 32px))" },
  megaCol: { display: "flex", flexDirection: "column", gap: 2 },
  megaHead: { paddingInline: 10, paddingBottom: 6, fontSize: font.xs, fontWeight: font.medium, letterSpacing: "0.05em", textTransform: "uppercase", color: color.fgMuted },
  link: {
    display: "flex", gap: 10, padding: 10, borderRadius: radius.md, textDecoration: "none", outline: "none", color: color.fg,
    backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  linkIcon: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: radius.md, flexShrink: 0, color: color.icon,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
  },
  linkText: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  linkTitle: { fontWeight: font.medium },
  linkDesc: { fontSize: font.sm, color: color.fgMuted, lineHeight: 1.4 },
  featured: {
    display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 6, width: 240, minHeight: 200, padding: 16, borderRadius: radius.lg,
    textDecoration: "none", color: "#fff", outline: "none", position: "relative", overflow: "hidden",
    backgroundImage: `radial-gradient(120% 80% at 0% 0%, ${color.accentTop}, transparent 60%), linear-gradient(160deg, ${color.accentBottom}, #121433)`,
    boxShadow: { default: depth.solid, ":focus-visible": `${depth.solid}, ${depth.focus}` },
  },
  featTitle: { fontSize: font.xl, fontWeight: font.semibold, letterSpacing: "-0.01em" },
  featDesc: { fontSize: font.sm, opacity: 0.85, lineHeight: 1.45 },
  featEyebrow: { fontSize: font.xs, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.8 },
  // mobile nav
  mobile: {
    position: "fixed", left: 8, right: 8, bottom: 8, zIndex: z.header, display: { default: "flex", "@media (min-width: 1024px)": "none" }, justifyContent: "space-around",
    height: 60, padding: 6, borderRadius: radius.xxl, backgroundColor: `color-mix(in srgb, ${color.surfaceRaised} 92%, transparent)`, backdropFilter: "blur(12px)", boxShadow: depth.popover,
    paddingBottom: "max(6px, env(safe-area-inset-bottom))",
  },
  mItem: {
    position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, borderRadius: radius.lg,
    fontSize: "10px", fontWeight: font.medium, color: { default: color.fgMuted, ":hover": color.fg }, outline: "none", ":focus-visible": { boxShadow: depth.focus },
  },
  mOn: { color: color.fg, backgroundColor: color.selected },
  mBadge: { position: "absolute", top: 4, left: "calc(50% + 6px)" },
});

/** A product-level bar across the top: logo, primary links/menus, search and profile. */
export function TopNav({ heading, start, children, center, end, label = "Primary", ...p }: StyleProps & {
  heading?: ReactNode; start?: ReactNode; children?: ReactNode; center?: ReactNode; end?: ReactNode; label?: string;
}) {
  return (
    <header {...sx(p, tn.bar)}>
      <div {...px(tn.start)}>{start}{heading && <span {...px(tn.heading)}>{heading}</span>}</div>
      <NM.Root aria-label={label} style={{ position: "relative" }}>
        <NM.List {...px(tn.list)}>{children}</NM.List>
        <div {...px(tn.viewportWrap)}><NM.Viewport {...px(tn.viewport)} /></div>
      </NM.Root>
      {center && <div {...px(tn.center)}>{center}</div>}
      <div {...px(tn.end)}>{end}</div>
    </header>
  );
}
/** A plain link in the TopNav. */
export function TopNavItem({ href, active, children, onClick }: { href?: string; active?: boolean; children: ReactNode; onClick?: () => void }) {
  return <NM.Item><NM.Link href={href} active={active} onClick={onClick} {...px(tn.item, active && tn.itemOn)}>{children}</NM.Link></NM.Item>;
}
export type NavLinkSpec = { title: string; description?: string; href?: string; icon?: ReactNode; onClick?: () => void };
const NavLinkRow = ({ l }: { l: NavLinkSpec }) => (
  <NM.Link href={l.href} onClick={l.onClick} {...px(tn.link)}>
    {l.icon && <span {...px(tn.linkIcon)}><IconSizeContext.Provider value={16}>{l.icon}</IconSizeContext.Provider></span>}
    <span {...px(tn.linkText)}><span {...px(tn.linkTitle)}>{l.title}</span>{l.description && <span {...px(tn.linkDesc)}>{l.description}</span>}</span>
  </NM.Link>
);
/** A TopNav item that opens a simple list of links. */
export function TopNavMenu({ label, links }: { label: string; links: NavLinkSpec[] }) {
  return (
    <NM.Item>
      <NM.Trigger {...px(tn.item, stylex.defaultMarker())}>{label}<span {...px(tn.chev)}><IconChevronDown size={12} /></span></NM.Trigger>
      <NM.Content><div {...px(tn.menu)}>{links.map((l) => <NavLinkRow key={l.title} l={l} />)}</div></NM.Content>
    </NM.Item>
  );
}
/** A promo tile at the end of a MegaMenu: a new feature, a guide. */
export function MegaMenuFeaturedCard({ eyebrow, title, description, href }: { eyebrow?: string; title: string; description?: string; href?: string }) {
  return <NM.Link href={href} {...px(tn.featured)}>{eyebrow && <span {...px(tn.featEyebrow)}>{eyebrow}</span>}<span {...px(tn.featTitle)}>{title}</span>{description && <span {...px(tn.featDesc)}>{description}</span>}</NM.Link>;
}
/** A TopNav item that opens a wide panel of grouped links, with an optional featured card. */
export function MegaMenu({ label, columns, featured }: { label: string; columns: { title: string; links: NavLinkSpec[] }[]; featured?: ReactNode }) {
  return (
    <NM.Item>
      <NM.Trigger {...px(tn.item, stylex.defaultMarker())}>{label}<span {...px(tn.chev)}><IconChevronDown size={12} /></span></NM.Trigger>
      <NM.Content>
        <div {...px(tn.mega)} style={{ ["--cols" as string]: columns.length }}>
          {columns.map((c) => <div key={c.title} {...px(tn.megaCol)}><span {...px(tn.megaHead)}>{c.title}</span>{c.links.map((l) => <NavLinkRow key={l.title} l={l} />)}</div>)}
          {featured}
        </div>
      </NM.Content>
    </NM.Item>
  );
}
/** Astryx names. */
export const TopNavMegaMenu = MegaMenu;
export const TopNavMegaMenuFeaturedCard = MegaMenuFeaturedCard;

/** Bottom tab bar for phones (hidden from 1024px). 3–5 destinations. */
export function MobileNav({ items, value, onValueChange, label = "Main" }: {
  items: { value: string; label: string; icon: ReactNode; badge?: number }[]; value: string; onValueChange: (v: string) => void; label?: string;
}) {
  return (
    <nav aria-label={label} {...px(tn.mobile)}>
      {items.map((it) => (
        <button key={it.value} type="button" aria-current={value === it.value ? "page" : undefined} onClick={() => onValueChange(it.value)} {...px(tn.mItem, value === it.value && tn.mOn)}>
          <IconSizeContext.Provider value={20}>{it.icon}</IconSizeContext.Provider>
          {it.label}
          {it.badge ? <span {...px(tn.mBadge)}><CountBadge tone="accent">{it.badge}</CountBadge></span> : null}
        </button>
      ))}
    </nav>
  );
}

/* ============================================================== Breadcrumbs */

const bc = stylex.create({
  list: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, fontSize: font.sm, color: color.fgMuted, minWidth: 0 },
  item: { display: "inline-flex", alignItems: "center", gap: 2, minWidth: 0 },
  link: {
    paddingInline: 4, marginInline: -4, borderRadius: radius.xs, color: { default: color.fgMuted, ":hover": color.fg }, textDecoration: "none", outline: "none", cursor: "pointer",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200, ":focus-visible": { boxShadow: depth.focus },
  },
  current: { color: color.fg, fontWeight: font.medium, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 },
  sep: { display: "inline-flex", color: color.fgFaint, paddingInline: 2 },
  slash: { color: color.fgFaint, paddingInline: 4 },
});

export type Crumb = { label: ReactNode; href?: string; onClick?: () => void };
/** Where you are. The last item is the current page; long trails collapse into "…". */
export function Breadcrumbs({ items, separator = "chevron", max = 4, ...p }: StyleProps & { items: Crumb[]; separator?: "chevron" | "slash"; max?: number }) {
  const collapsed = items.length > max;
  const shown = collapsed ? [items[0], { label: "…" } as Crumb, ...items.slice(-(max - 2))] : items;
  const hidden = collapsed ? items.slice(1, items.length - (max - 2)) : [];
  return (
    <nav aria-label="Breadcrumb" {...sx(p)}>
      <ol {...px(bc.list)}>
        {shown.map((c, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={i} {...px(bc.item)}>
              {c.label === "…" && hidden.length ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><button type="button" aria-label="Show hidden pages" {...px(bc.link)}>…</button></DropdownMenuTrigger>
                  <DropdownMenuContent>{hidden.map((h, j) => <DropdownMenuItem key={j} onSelect={h.onClick}>{h.label}</DropdownMenuItem>)}</DropdownMenuContent>
                </DropdownMenu>
              ) : last ? <span aria-current="page" {...px(bc.current)}>{c.label}</span>
                : c.href ? <a href={c.href} {...px(bc.link)}>{c.label}</a>
                : <button type="button" onClick={c.onClick} {...px(bc.link)}>{c.label}</button>}
              {!last && (separator === "slash" ? <span aria-hidden {...px(bc.slash)}>/</span> : <span aria-hidden {...px(bc.sep)}><IconChevronRight size={12} /></span>)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
/** v1 name. */
export const Breadcrumb = Breadcrumbs;

/* ============================================================== Tabs */

const tb = stylex.create({
  list: { position: "relative", display: "flex", alignItems: "stretch", gap: 4, overflowX: "auto", scrollbarWidth: "none", minWidth: 0 },
  underline: { gap: 16 },
  pills: { gap: 2, padding: 3, borderRadius: radius.lg, backgroundColor: color.muted, boxShadow: `inset 0 1px 2px ${color.shadeXs}, inset 0 0 0 1px ${color.border}`, width: "fit-content" },
  divider: { boxShadow: `inset 0 -1px 0 ${color.border}` },
  trigger: {
    position: "relative", display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, whiteSpace: "nowrap", fontWeight: font.medium, fontSize: font.md,
    color: { default: color.fgMuted, ":hover": color.fg, ":is([data-state=active])": color.fg }, outline: "none", cursor: "pointer",
    ":disabled": { opacity: 0.45, cursor: "not-allowed" },
    ":focus-visible": { boxShadow: depth.focus },
  },
  tUnderline: { height: 40, borderRadius: radius.xs },
  tPills: {
    height: 28, paddingInline: 12, borderRadius: radius.md,
    ":is([data-state=active])": { backgroundColor: color.surfaceRaised, boxShadow: depth.raised },
  },
  ink: { position: "absolute", bottom: 0, height: 2, borderRadius: 2, backgroundColor: color.fg, transitionProperty: "transform, width", transitionDuration: motion.base, transitionTimingFunction: motion.spring, pointerEvents: "none" },
  content: { outline: "none", paddingTop: 16 },
  sm: { fontSize: font.sm },
  full: { width: "100%" },
});

export const Tabs = TP.Root;
export const TabsContent = ({ xstyle, className, style, ...rest }: ComponentProps<typeof TP.Content> & StyleProps) => <TP.Content {...rest} {...sx({ xstyle, className, style }, tb.content)} />;

const TabVariant = createContext<"underline" | "pills">("underline");
/** The row of tabs. `underline` (page sections; a sliding ink bar) or `pills` (in-card views). */
export function TabsList({ variant = "underline", divider = true, fullWidth, children, xstyle, className, style, ...rest }: ComponentProps<typeof TP.List> & StyleProps & { variant?: "underline" | "pills"; divider?: boolean; fullWidth?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    if (variant !== "underline") return;
    const el = ref.current; if (!el) return;
    const measure = () => { const a = el.querySelector<HTMLElement>('[data-state="active"]'); if (a) setInk({ x: a.offsetLeft, w: a.offsetWidth }); };
    measure();
    const mo = new MutationObserver(measure); mo.observe(el, { attributes: true, subtree: true, attributeFilter: ["data-state"] });
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => { mo.disconnect(); ro.disconnect(); };
  }, [variant]);
  return (
    <TabVariant.Provider value={variant}>
      <TP.List ref={ref} {...rest} {...sx({ xstyle, className, style }, tb.list, variant === "underline" ? [tb.underline, divider && tb.divider] : tb.pills, fullWidth && tb.full)}>
        {children}
        {variant === "underline" && ink && <span aria-hidden {...px(tb.ink)} style={{ transform: `translateX(${ink.x}px)`, width: ink.w }} />}
      </TP.List>
    </TabVariant.Provider>
  );
}
export function TabsTrigger({ count, icon, children, xstyle, className, style, ...rest }: ComponentProps<typeof TP.Trigger> & StyleProps & { count?: number; icon?: ReactNode }) {
  const v = useContext(TabVariant);
  return (
    <TP.Trigger {...rest} {...sx({ xstyle, className, style }, tb.trigger, v === "underline" ? tb.tUnderline : tb.tPills)}>
      <IconSizeContext.Provider value={14}>{icon}</IconSizeContext.Provider>{children}{count !== undefined && <CountBadge>{count}</CountBadge>}
    </TP.Trigger>
  );
}

/** Tabs from a list, with panels. The quick way: <TabList items={[{ value, label, content }]} />. */
export function TabList({ items, value, defaultValue, onValueChange, variant = "underline", ...p }: StyleProps & {
  items: { value: string; label: ReactNode; content?: ReactNode; count?: number; icon?: ReactNode; disabled?: boolean }[];
  value?: string; defaultValue?: string; onValueChange?: (v: string) => void; variant?: "underline" | "pills";
}) {
  return (
    <Tabs value={value} defaultValue={defaultValue ?? items[0]?.value} onValueChange={onValueChange} {...sx(p)}>
      <TabsList variant={variant}>{items.map((it) => <TabsTrigger key={it.value} value={it.value} count={it.count} icon={it.icon} disabled={it.disabled}>{it.label}</TabsTrigger>)}</TabsList>
      {items.map((it) => it.content !== undefined && <TabsContent key={it.value} value={it.value}>{it.content}</TabsContent>)}
    </Tabs>
  );
}

/* ============================================================== Pagination */

export function pageRange(page: number, pageCount: number, siblings = 1): (number | "…")[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 1); const right = Math.min(page + siblings, pageCount);
  const showL = left > 3; const showR = right < pageCount - 2;
  if (!showL) return [...Array.from({ length: 3 + siblings * 2 }, (_, i) => i + 1), "…", pageCount];
  if (!showR) return [1, "…", ...Array.from({ length: 3 + siblings * 2 }, (_, i) => pageCount - (2 + siblings * 2) + i)];
  return [1, "…", ...Array.from({ length: right - left + 1 }, (_, i) => left + i), "…", pageCount];
}

const pg = stylex.create({
  root: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: font.sm, color: color.fgMuted },
  pages: { display: "flex", alignItems: "center", gap: 2 },
  num: {
    minWidth: 28, height: 28, paddingInline: 6, borderRadius: radius.md, fontVariantNumeric: "tabular-nums", fontSize: font.sm, fontWeight: font.medium, outline: "none", cursor: "pointer",
    color: { default: color.fgSoft, ":hover": color.fg }, backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  on: { color: { default: color.fg, ":hover": color.fg }, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised },
  dots: { minWidth: 20, textAlign: "center", color: color.fgFaint },
  size: { display: "flex", alignItems: "center", gap: 8 },
  sel: { height: 28, paddingInline: 8, borderRadius: radius.md, boxShadow: depth.raised, backgroundColor: color.surface, color: color.fg, fontSize: font.sm },
});

export type PaginationProps = StyleProps & {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  /** Shows "1–25 of 340". */
  total?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (n: number) => void;
  /** full: numbers. simple: prev/next + "Page 2 of 9". */
  variant?: "full" | "simple";
  siblings?: number;
  firstLast?: boolean;
};

/** Move between pages of a list. Shows the range and, optionally, a rows-per-page picker. */
export function Pagination({ page, pageCount, onPageChange, total, pageSize, pageSizeOptions, onPageSizeChange, variant = "full", siblings = 1, firstLast, ...p }: PaginationProps) {
  const from = total && pageSize ? (page - 1) * pageSize + 1 : 0;
  const to = total && pageSize ? Math.min(total, page * pageSize) : 0;
  const go = (n: number) => onPageChange(Math.min(pageCount, Math.max(1, n)));
  return (
    <nav aria-label="Pagination" {...sx(p, pg.root)}>
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {total !== undefined && pageSize ? <span>{total ? `${from.toLocaleString()}–${to.toLocaleString()} of ${total.toLocaleString()}` : "No results"}</span> : <span />}
        {pageSizeOptions && onPageSizeChange && (
          <label {...px(pg.size)}>Rows<select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} {...px(pg.sel)}>{pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
        )}
      </span>
      <div {...px(pg.pages)}>
        {firstLast && <IconButton label="First page" size="sm" disabled={page <= 1} onClick={() => go(1)}><IconChevronsLeft /></IconButton>}
        <IconButton label="Previous page" size="sm" disabled={page <= 1} onClick={() => go(page - 1)}><IconChevronLeft /></IconButton>
        {variant === "simple" ? <span style={{ paddingInline: 8, fontVariantNumeric: "tabular-nums" }}>Page {page} of {pageCount}</span>
          : pageRange(page, pageCount, siblings).map((n, i) => n === "…" ? <span key={`d${i}`} {...px(pg.dots)}>…</span>
            : <button key={n} type="button" aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`} onClick={() => go(n)} {...px(pg.num, n === page && pg.on)}>{n}</button>)}
        <IconButton label="Next page" size="sm" disabled={page >= pageCount} onClick={() => go(page + 1)}><IconChevronRight /></IconButton>
        {firstLast && <IconButton label="Last page" size="sm" disabled={page >= pageCount} onClick={() => go(pageCount)}><IconChevronsRight /></IconButton>}
      </div>
    </nav>
  );
}

/* ============================================================== Stepper */

const st = stylex.create({
  row: { display: "flex", alignItems: "flex-start", gap: 0, width: "100%" },
  col: { display: "flex", flexDirection: "column", gap: 0 },
  step: { display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0, position: "relative" },
  stepV: { paddingBottom: 20 },
  btn: { display: "flex", alignItems: "flex-start", gap: 10, textAlign: "start", minWidth: 0, borderRadius: radius.md, outline: "none", ":focus-visible": { boxShadow: depth.focus } },
  dot: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", flexShrink: 0, fontSize: font.sm, fontWeight: font.semibold,
    color: color.fgMuted, backgroundColor: color.surface, boxShadow: `inset 0 0 0 1.5px ${color.borderStrong}`, transitionProperty: "background-color, box-shadow, color", transitionDuration: motion.base,
  },
  dotCurrent: { color: color.accent, boxShadow: `inset 0 0 0 1.5px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
  dotDone: { color: "#fff", backgroundImage: `linear-gradient(180deg, ${color.accentTop}, ${color.accentBottom})`, boxShadow: depth.solid },
  dotError: { color: "#fff", backgroundColor: color.danger, boxShadow: "none" },
  text: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0, paddingTop: 2 },
  title: { fontSize: font.md, fontWeight: font.medium, color: color.fg, whiteSpace: "nowrap" },
  titleMuted: { color: color.fgMuted },
  desc: { fontSize: font.sm, color: color.fgMuted, overflow: "hidden", textOverflow: { default: null, "@media (min-width: 640px)": "ellipsis" } },
  barH: { flex: 1, height: 2, marginTop: 11, marginInline: 10, borderRadius: 2, backgroundColor: color.border, minWidth: 16 },
  barV: { position: "absolute", left: 11, top: 28, bottom: 4, width: 2, borderRadius: 2, backgroundColor: color.border },
  barDone: { backgroundColor: color.accent },
  optional: { fontSize: font.xs, color: color.fgFaint },
});

export type Step = { title: ReactNode; description?: ReactNode; optional?: boolean; error?: boolean };
/** Progress through a multi-step flow. Completed steps can be clickable via `onStepClick`. */
export function Stepper({ steps, current, onStepClick, orientation = "horizontal", ...p }: StyleProps & { steps: Step[]; current: number; onStepClick?: (i: number) => void; orientation?: "horizontal" | "vertical" }) {
  const V = orientation === "vertical";
  return (
    <ol aria-label="Progress" {...sx(p, V ? st.col : st.row)}>
      {steps.map((s, i) => {
        const done = i < current; const cur = i === current;
        const dot = <span {...px(st.dot, cur && st.dotCurrent, done && st.dotDone, s.error && st.dotError)}>{done && !s.error ? <IconCheck size={12} /> : s.error ? <IconX size={12} /> : i + 1}</span>;
        const text = <span {...px(st.text)}><span {...px(st.title, !done && !cur && st.titleMuted)}>{s.title}{s.optional && <span {...px(st.optional)}> · Optional</span>}</span>{s.description && <span {...px(st.desc)}>{s.description}</span>}</span>;
        return (
          <Fragment key={i}>
            <li aria-current={cur ? "step" : undefined} {...px(st.step, V && st.stepV)} style={!V ? { flex: i === steps.length - 1 ? "0 0 auto" : 1 } : undefined}>
              {onStepClick && done ? <button type="button" onClick={() => onStepClick(i)} {...px(st.btn)}>{dot}{text}</button> : <>{dot}{text}</>}
              {V && i < steps.length - 1 && <span aria-hidden {...px(st.barV, done && st.barDone)} />}
              {!V && i < steps.length - 1 && <span aria-hidden {...px(st.barH, done && st.barDone)} />}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
/** v1 name. */
export const Steps = Stepper;

/* ============================================================== Outline (Anchor) */

const an = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 2, fontSize: font.sm, position: "relative", paddingInlineStart: 12 },
  rail: { position: "absolute", left: 0, top: 0, bottom: 0, width: 1, backgroundColor: color.border },
  ind: { position: "absolute", left: 0, width: 2, marginInlineStart: -0.5, borderRadius: 2, backgroundColor: color.fg, transitionProperty: "transform, height", transitionDuration: motion.base, transitionTimingFunction: motion.spring },
  title: { fontSize: font.xs, fontWeight: font.medium, color: color.fgMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 },
  link: { display: "block", paddingBlock: 4, color: { default: color.fgMuted, ":hover": color.fg }, textDecoration: "none", outline: "none", borderRadius: radius.xs, ":focus-visible": { boxShadow: depth.focus } },
  on: { color: color.fg, fontWeight: font.medium },
  l2: { paddingInlineStart: 12 },
});

export type OutlineItem = { id: string; label: string; level?: 1 | 2 };
/** "On this page" — tracks the section in view and scrolls to sections on click. */
export function Outline({ items, offset = 80, title = "On this page", ...p }: StyleProps & { items: OutlineItem[]; offset?: number; title?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const ref = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ y: number; h: number } | null>(null);
  useEffect(() => {
    const on = () => {
      let cur = items[0]?.id;
      for (const it of items) { const el = document.getElementById(it.id); if (el && el.getBoundingClientRect().top - offset <= 8) cur = it.id; }
      setActive(cur);
    };
    on(); window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on);
  }, [items, offset]);
  useLayoutEffect(() => { const a = ref.current?.querySelector<HTMLElement>(`[data-id="${active}"]`); if (a) setInd({ y: a.offsetTop, h: a.offsetHeight }); }, [active]);
  return (
    <nav aria-label={title} {...sx(p)}>
      {title && <p {...px(an.title)}>{title}</p>}
      <div ref={ref} {...px(an.root)}>
        <span aria-hidden {...px(an.rail)} />
        {ind && <span aria-hidden {...px(an.ind)} style={{ transform: `translateY(${ind.y}px)`, height: ind.h }} />}
        {items.map((it) => (
          <a key={it.id} data-id={it.id} href={`#${it.id}`} aria-current={active === it.id ? "location" : undefined}
            onClick={(e) => { const el = document.getElementById(it.id); if (!el) return; e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset + 1, behavior: "smooth" }); }}
            {...px(an.link, active === it.id && an.on, it.level === 2 && an.l2)}>{it.label}</a>
        ))}
      </div>
    </nav>
  );
}
/** v1 name. */
export const Anchor = Outline;

/* ============================================================== FilterMenu & FilterButton */

const fm = stylex.create({
  count: { minWidth: 16, height: 16, paddingInline: 4, borderRadius: radius.full, fontSize: "10px", fontWeight: font.semibold, color: "#fff", backgroundColor: color.accent, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  search: { padding: 4, paddingBottom: 6 },
  foot: { display: "flex", justifyContent: "space-between", padding: 4, paddingTop: 6 },
  meta: { marginInlineStart: "auto", fontSize: font.sm, color: color.fgFaint, fontVariantNumeric: "tabular-nums" },
});

/** A raised filter button with a count of active values. */
export function FilterButton({ children, count, ...rest }: ComponentProps<typeof Button> & { count?: number }) {
  return <Button size="sm" leading={<IconFilter />} trailing={count ? <span {...px(fm.count)}>{count}</span> : <IconChevronDown />} {...rest}>{children}</Button>;
}

export type FilterOption = { value: string; label: string; icon?: ReactNode; count?: number };
/** Multi-select filter in a menu, with search for long lists and a "Clear" action. */
export function FilterMenu({ label, options, value, onValueChange, searchable }: { label: string; options: FilterOption[]; value: string[]; onValueChange: (v: string[]) => void; searchable?: boolean }) {
  const [q, setQ] = useState("");
  const shown = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <DropdownMenu onOpenChange={(o) => !o && setQ("")}>
      <DropdownMenuTrigger asChild><FilterButton count={value.length}>{label}</FilterButton></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {(searchable ?? options.length > 8) && <div {...px(fm.search)} onKeyDown={(e) => e.stopPropagation()}><Input size="sm" leading={<IconSearch />} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>}
        {shown.map((o) => (
          <DropdownMenuCheckboxItem key={o.value} checked={value.includes(o.value)} onSelect={(e) => e.preventDefault()}
            onCheckedChange={(c) => onValueChange(c ? [...value, o.value] : value.filter((v) => v !== o.value))}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>{o.icon}{o.label}{o.count !== undefined && <span {...px(fm.meta)}>{o.count}</span>}</span>
          </DropdownMenuCheckboxItem>
        ))}
        {value.length > 0 && <><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => onValueChange([])}>Clear {label.toLowerCase()}</DropdownMenuItem></>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

