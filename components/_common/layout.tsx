import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { SidebarProvider } from "./sidebar";

/*
  App shell: [Sidebar] [Header / Page]. The page scrolls; the sidebar and header stay put.
    <AppShell sidebar={<Sidebar>…</Sidebar>}>
      <Header title="Invoices" … />
      <Page>…</Page>
    </AppShell>
*/
export function AppShell({ sidebar, children, className }: { sidebar: ReactNode; children: ReactNode; className?: string }) {
  return (
    <SidebarProvider>
      <div className={cn("flex min-h-dvh w-full bg-background", className)}>
        {sidebar}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}

export type HeaderProps = {
  title: ReactNode;
  /** Status pill or count next to the title. */
  /** Secondary meta beside the title (count, live pill). Hidden below 640px so the title keeps its room. */
  status?: ReactNode;
  /** Breadcrumb above the title, or replacing it on detail pages. */
  breadcrumb?: ReactNode;
  /** Left of title — normally <SidebarTrigger/>. */
  start?: ReactNode;
  actions?: ReactNode;
  /** Avatar menu, notifications. */
  end?: ReactNode;
  /** Tabs rendered as the header's bottom edge. */
  tabs?: ReactNode;
  className?: string;
};

/** Page header: 52px bar with title, status, actions and profile. Tabs attach to its bottom border. */
export function Header({ title, status, breadcrumb, start, actions, end, tabs, className }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-(--z-header) shrink-0 bg-background", !tabs && "border-b border-border", className)}>
      <div className="flex h-[52px] items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {start}
          <div className="flex min-w-0 flex-col justify-center">
            {breadcrumb}
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-title font-medium">{title}</h1>
              {status && <span className="hidden shrink-0 items-center sm:inline-flex">{status}</span>}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {end && <span className="ml-1 flex items-center gap-1.5">{end}</span>}
        </div>
      </div>
      {tabs && <div className="border-b border-border px-3 sm:px-4 lg:px-6">{tabs}</div>}
    </header>
  );
}

/** Page body with Keel's horizontal padding. `width="narrow"` for forms and settings. */
export function Page({ width = "full", className, ...props }: ComponentProps<"main"> & { width?: "full" | "wide" | "narrow" }) {
  return (
    <main
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col px-3 py-4 sm:px-4 sm:py-5 lg:px-6",
        width === "wide" && "mx-auto max-w-[1280px]",
        width === "narrow" && "mx-auto max-w-[760px]",
        className,
      )}
      {...props}
    />
  );
}

/** Title + description + actions at the top of a page section (when the Header title isn't enough). */
export function PageHeading({ title, description, actions, className }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3 pb-4", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-page font-semibold">{title}</h2>
        {description && <p className="text-small text-subtle">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Filter/search row above a list. Wraps on narrow screens; `end` stays right-aligned. */
export function PageToolbar({ children, end, className }: { children?: ReactNode; end?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 py-2", className)}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
      {end && <div className="flex shrink-0 items-center gap-2">{end}</div>}
    </div>
  );
}

/** Responsive grid. `cols` is the count at the widest breakpoint; it steps down automatically. */
export function Grid({ cols = 3, gap = "md", className, ...props }: ComponentProps<"div"> & { cols?: 1 | 2 | 3 | 4 | 6; gap?: "sm" | "md" | "lg" }) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6",
  }[cols];
  return <div className={cn("grid", colClass, gap === "sm" ? "gap-2" : gap === "md" ? "gap-4" : "gap-6", className)} {...props} />;
}

/** Bordered container for grouping that truly needs it. Prefer whitespace and dividers first. */
export function Card({ className, padding = "md", ...props }: ComponentProps<"div"> & { padding?: "none" | "sm" | "md" }) {
  return (
    <div
      className={cn("min-w-0 rounded-lg bg-card shadow-card", padding === "sm" && "p-3", padding === "md" && "p-4", className)}
      {...props}
    />
  );
}

/**
 * Two panes with a draggable divider (list | detail). Below `stackBelow` they stack.
 * Keyboard: focus the divider and use ←/→.
 */
export function SplitPane({
  start,
  end,
  defaultSize = 40,
  min = 25,
  max = 75,
  className,
}: {
  start: ReactNode;
  end: ReactNode;
  /** Start pane width in %. */
  defaultSize?: number;
  min?: number;
  max?: number;
  className?: string;
}) {
  const [size, setSize] = useState(defaultSize);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const set = (v: number) => setSize(Math.min(max, Math.max(min, v)));
  return (
    <div ref={ref} className={cn("flex min-h-0 w-full flex-col md:flex-row", className)} style={{ ["--split" as string]: `${size}%` }}>
      <div className="min-h-0 min-w-0 overflow-auto md:w-(--split) md:shrink-0">{start}</div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(size)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label="Resize panes"
        tabIndex={0}
        className="relative hidden w-px shrink-0 cursor-col-resize bg-border outline-none after:absolute after:inset-y-0 after:-left-1 after:w-2 hover:bg-line-strong focus-visible:bg-foreground md:block"
        onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => {
          if (!drag.current || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          set(((e.clientX - r.left) / r.width) * 100);
        }}
        onPointerUp={() => (drag.current = false)}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") set(size - 2); if (e.key === "ArrowRight") set(size + 2); }}
        onDoubleClick={() => setSize(defaultSize)}
      />
      <div className="min-h-0 min-w-0 flex-1 overflow-auto border-t border-border md:border-t-0">{end}</div>
    </div>
  );
}
