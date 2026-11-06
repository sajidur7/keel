import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { IconButton } from "../_ui/button";
import { IconSidebar } from "../_ui/icons";
import { cn } from "../lib/cn";
import { Sheet, SheetContent } from "../_ui/sheet";
import { CountBadge } from "../_ui/tag";
import { Tooltip } from "../_ui/tooltip";

/*
  Sidebar
  - Desktop (≥1024px): fixed column, 248px default, resizable 200–360px by dragging the edge
    (double-click resets), collapsible to a 56px icon rail (⌘B / Ctrl+B).
  - Below 1024px: hidden; opens as a left drawer from the header's menu button.
  The same <Sidebar> children render in both places, so you write the nav once.
*/

type SidebarCtx = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  width: number;
  setWidth: (w: number) => void;
  /** True while rendering inside the mobile drawer. */
  inDrawer: boolean;
};
const Ctx = createContext<SidebarCtx | null>(null);
export function useSidebar() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return c;
}

const MIN = 200;
const MAX = 360;
const DEFAULT = 248;

export function SidebarProvider({ children, defaultCollapsed = false }: { children: ReactNode; defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [width, setWidthState] = useState(() => {
    try { return Number(localStorage.getItem("keel-sidebar-width")) || DEFAULT; } catch { return DEFAULT; }
  });
  const setWidth = useCallback((w: number) => {
    const v = Math.round(Math.min(MAX, Math.max(MIN, w)));
    setWidthState(v);
    try { localStorage.setItem("keel-sidebar-width", String(v)); } catch { /* storage may be blocked */ }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        if (window.matchMedia("(min-width: 1024px)").matches) setCollapsed((c) => !c);
        else setMobileOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, width, setWidth, inDrawer: false }}>
      {children}
    </Ctx.Provider>
  );
}

/** The sidebar column + its mobile drawer. */
export function Sidebar({ children, className, label = "Main navigation" }: { children: ReactNode; className?: string; label?: string }) {
  const ctx = useSidebar();
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.documentElement.dataset.resizing = "";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) ctx.setWidth(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
    delete document.documentElement.dataset.resizing;
  };

  return (
    <>
      <aside
        aria-label={label}
        data-collapsed={ctx.collapsed || undefined}
        style={{ width: ctx.collapsed ? 56 : ctx.width }}
        className={cn(
          "group/sidebar sticky top-0 hidden h-dvh shrink-0 flex-col bg-surface lg:flex",
          "border-r border-border transition-[width] duration-base ease-out [html[data-resizing]_&]:transition-none",
          className,
        )}
      >
        {children}
        {!ctx.collapsed && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={ctx.width}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onDoubleClick={() => ctx.setWidth(DEFAULT)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") ctx.setWidth(ctx.width - 16);
              if (e.key === "ArrowRight") ctx.setWidth(ctx.width + 16);
            }}
            className="absolute top-0 -right-1 z-10 h-full w-2 cursor-col-resize outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent after:transition-colors hover:after:bg-line-strong focus-visible:after:bg-foreground"
          />
        )}
      </aside>
      <Sheet open={ctx.mobileOpen} onOpenChange={ctx.setMobileOpen}>
        <SheetContent
          side="left"
          title="Navigation"
          hideTitle
          className="bg-surface p-0 [&>header]:absolute [&>header]:top-2 [&>header]:right-2 [&>header]:p-0 [&>div]:p-0"
        >
          <Ctx.Provider value={{ ...ctx, collapsed: false, inDrawer: true }}>
            <div className="flex h-full flex-col" onClick={(e) => { if ((e.target as HTMLElement).closest("a,[data-nav-item]")) ctx.setMobileOpen(false); }}>
              {children}
            </div>
          </Ctx.Provider>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Top block: workspace logo + name, optional switcher. */
export function SidebarBrand({ logo, name, meta, action }: { logo: ReactNode; name: ReactNode; meta?: ReactNode; action?: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className={cn("flex h-[52px] shrink-0 items-center gap-2.5 px-3", collapsed && "justify-center px-0")}>
      <span className="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-card shadow-raised">{logo}</span>
      {!collapsed && (
        <>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-small font-medium">{name}</span>
            {meta && <span className="truncate text-[11px] text-subtle">{meta}</span>}
          </div>
          {action}
        </>
      )}
    </div>
  );
}

export function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden py-2", className)} {...props} />;
}

/** A group of nav items with an eyebrow title. */
export function SidebarSection({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const { collapsed } = useSidebar();
  return (
    <div className={cn("flex flex-col gap-px px-2 py-1.5", className)}>
      {title && !collapsed && (
        <div className="flex h-6 items-center justify-between px-2">
          <span className="eyebrow">{title}</span>
          {action}
        </div>
      )}
      {title && collapsed && <span aria-hidden className="mx-auto my-2 h-px w-5 bg-border" />}
      <ul className="flex flex-col gap-px">{children}</ul>
    </div>
  );
}

export type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  /** Right side element instead of a count (e.g. a kbd, a status dot). */
  trailing?: ReactNode;
};

/** Nav item: 30px row, icon + label + optional count. Active item gets the raised surface. */
export function SidebarItem({ icon, label, count, active, href, onClick, trailing }: SidebarItemProps) {
  const { collapsed } = useSidebar();
  const cls = cn(
    "group/item flex h-[30px] w-full items-center gap-2.5 rounded-md px-2 text-small text-soft outline-none",
    "transition-colors duration-fast ease-out hover:bg-hover hover:text-foreground focus-visible:shadow-focus",
    "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-icon",
    active && "bg-card text-foreground shadow-raised hover:bg-card [&_svg]:text-foreground",
    collapsed && "justify-center px-0",
  );
  const inner = (
    <>
      {icon}
      {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{label}</span>}
      {!collapsed && (trailing ?? (count !== undefined && <CountBadge count={count} />))}
    </>
  );
  const el = href ? (
    <a href={href} data-nav-item aria-current={active ? "page" : undefined} className={cls} onClick={onClick}>{inner}</a>
  ) : (
    <button type="button" data-nav-item aria-current={active ? "page" : undefined} className={cls} onClick={onClick}>{inner}</button>
  );
  return <li>{collapsed ? <Tooltip content={label} side="right">{el}</Tooltip> : el}</li>;
}

export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-auto flex shrink-0 flex-col gap-1 border-t border-border p-2", className)} {...props} />;
}

/** Collapses the desktop sidebar; opens the drawer on mobile. Put it in the Header. */
export function SidebarTrigger({ className }: { className?: string }) {
  const { collapsed, setCollapsed, setMobileOpen } = useSidebar();
  return (
    <Tooltip content={collapsed ? "Expand sidebar" : "Collapse sidebar"} shortcut="⌘B">
      <IconButton
        label="Toggle sidebar"
        size="sm"
        className={className}
        onClick={() => {
          if (window.matchMedia("(min-width: 1024px)").matches) setCollapsed(!collapsed);
          else setMobileOpen(true);
        }}
      >
        <IconSidebar />
      </IconButton>
    </Tooltip>
  );
}
