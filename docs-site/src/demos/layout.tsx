import { useState } from "react";
import {
  AppShell, Avatar, Button, Card, DescriptionList, FilterMenu, Grid, Header, IconBell, IconBuilding, IconChartBar,
  IconChevronsUpDown, IconDownload, IconHome, IconInbox, IconPlus, IconReceipt, IconSettings, IconShield, IconUsers,
  Page, PageHeading, PageToolbar, ProgressRing, SearchInput, Sheet, SheetContent, SheetSection, Sidebar, SidebarBrand,
  SidebarContent, SidebarFooter, SidebarItem, SidebarSection, SidebarTrigger, SplitPane, StatusPill, Tabs, TabsList,
  TabsTrigger, Tag, Timeline, Button as B, IconButton, IconMoreHorizontal, List, ListItem,
} from "@keel/components";
import { customers } from "@keel/templates/data";
import type { DocPage } from "../docs/types";

/* ===== App shell ===== */

export function ShellDemo() {
  const [active, setActive] = useState("customers");
  const nav = (id: string, label: string, icon: React.ReactNode, count?: number) => (
    <SidebarItem icon={icon} label={label} count={count} active={active === id} onClick={() => setActive(id)} />
  );
  return (
    <div className="h-[460px] w-full overflow-hidden rounded-lg shadow-card">
      <AppShell
        className="h-full min-h-0"
        sidebar={
          <Sidebar className="h-full">
            <SidebarBrand logo={<span className="text-caption font-semibold">F</span>} name="Fernhill" meta="Operations" action={<IconChevronsUpDown size={14} className="text-icon" />} />
            <SidebarContent>
              <SidebarSection title="Workspace">
                {nav("overview", "Overview", <IconHome />)}
                {nav("inbox", "Inbox", <IconInbox />, 4)}
                {nav("customers", "Customers", <IconBuilding />, 12)}
                {nav("invoices", "Invoices", <IconReceipt />, 128)}
                {nav("reports", "Reports", <IconChartBar />)}
              </SidebarSection>
              <SidebarSection title="Admin">
                {nav("members", "Members", <IconUsers />, 8)}
                {nav("security", "Security", <IconShield />)}
                {nav("settings", "Settings", <IconSettings />)}
              </SidebarSection>
            </SidebarContent>
            <SidebarFooter>
              <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:px-0">
                <ProgressRing value={70} size={22} stroke={2.5} showValue={false} label="Seats used" />
                <div className="flex min-w-0 flex-col group-data-[collapsed]/sidebar:hidden">
                  <span className="text-caption">140 of 200 seats</span>
                  <span className="text-[11px] text-subtle">Scale plan</span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        }
      >
        <Header
          start={<SidebarTrigger />}
          title="Customers"
          status={<StatusPill status="active" pulse size="sm">Synced</StatusPill>}
          actions={<><Button size="sm" leading={<IconDownload />} className="hidden sm:inline-flex">Export</Button><Button size="sm" variant="primary" leading={<IconPlus />}>New</Button></>}
          end={<><IconButton label="Notifications" size="sm"><IconBell /></IconButton><Avatar name="Nadia Karim" size="md" /></>}
        />
        <Page className="overflow-auto">
          <p className="text-small text-subtle">Collapse the sidebar with the button or ⌘B, and drag its edge to resize. Below 1024px it becomes a drawer.</p>
        </Page>
      </AppShell>
    </div>
  );
}

export function HeaderDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-card">
      <Header
        title="Northwind Logistics"
        breadcrumb={<span className="text-caption text-subtle">Customers</span>}
        status={<StatusPill status="active" size="sm">Active</StatusPill>}
        actions={<><Button size="sm">Edit</Button><IconButton label="More" size="sm"><IconMoreHorizontal /></IconButton></>}
        tabs={
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices" count={12}>Invoices</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
    </div>
  );
}

export function ToolbarDemo() {
  const [status, setStatus] = useState("all");
  return (
    <div className="flex w-full flex-col">
      <PageHeading title="Invoices" description="128 invoices · $214,600 outstanding" actions={<><Button leading={<IconDownload />}>Export</Button><Button variant="primary" leading={<IconPlus />}>New invoice</Button></>} />
      <PageToolbar end={<FilterMenu label="Sort" value="due" onChange={() => {}} align="end" options={[{ value: "due", label: "Due date" }, { value: "amount", label: "Amount" }]} />}>
        <SearchInput size="sm" shellClassName="w-full sm:w-64" placeholder="Search invoices" />
        <FilterMenu label="Status" value={status} onChange={setStatus} options={[{ value: "all", label: "All" }, { value: "due", label: "Due" }, { value: "overdue", label: "Overdue" }]} />
      </PageToolbar>
    </div>
  );
}

export function GridDemo() {
  return (
    <Grid cols={3} className="w-full">
      {customers.slice(0, 3).map((c) => (
        <Card key={c.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5"><Avatar name={c.name} shape="square" /><span className="truncate text-small font-medium">{c.name}</span></div>
          <DescriptionList items={[{ label: "Plan", value: <Tag>{c.plan}</Tag> }, { label: "Seats", value: c.seats }]} />
        </Card>
      ))}
    </Grid>
  );
}

export function SplitDemo() {
  const [sel, setSel] = useState(customers[0].id);
  const c = customers.find((x) => x.id === sel)!;
  return (
    <div className="h-80 w-full overflow-hidden rounded-lg shadow-card">
      <SplitPane
        defaultSize={38}
        start={<List className="px-3">{customers.slice(0, 7).map((x) => <ListItem key={x.id} title={x.name} description={x.domain} selected={x.id === sel} onClick={() => setSel(x.id)} />)}</List>}
        end={<div className="flex flex-col gap-3 p-4"><span className="text-title font-medium">{c.name}</span><DescriptionList items={[{ label: "Owner", value: c.owner }, { label: "Region", value: c.region }, { label: "Plan", value: c.plan }]} /></div>}
      />
    </div>
  );
}

/* ===== Sheet ===== */

export function SheetDemo() {
  const [open, setOpen] = useState(false);
  const c = customers[1];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <B variant="primary" onClick={() => setOpen(true)}>Open detail sheet</B>
      <SheetContent
        title={c.name}
        description={c.domain}
        eyebrow={<span className="flex items-center gap-2"><StatusPill status="active" size="sm">Active</StatusPill><Tag size="sm" tone="violet">{c.plan}</Tag></span>}
        footer={<><B variant="ghost" onClick={() => setOpen(false)}>Close</B><B variant="primary">Save changes</B></>}
      >
        <SheetSection title="Details">
          <DescriptionList items={[{ label: "Owner", value: c.owner }, { label: "Region", value: c.region }, { label: "Seats", value: c.seats }, { label: "Since", value: "Sep 3, 2022" }]} />
        </SheetSection>
        <SheetSection title="Activity">
          <Timeline events={[{ id: "1", title: <><b>Tanvir</b> updated seats to 420</>, time: "Yesterday" }, { id: "2", title: <><b>Invoice</b> INV-2062 paid</>, time: "Oct 31", tone: "success" }]} />
        </SheetSection>
      </SheetContent>
    </Sheet>
  );
}

export const docs: DocPage[] = [
  {
    slug: "app-shell", title: "App shell & sidebar", group: "Layout", section: "Components", source: "layout", keywords: ["sidebar", "navigation", "drawer", "layout"],
    summary: "The frame of every Keel admin: a 248px sidebar with eyebrow sections and count badges, a 52px header, and a scrolling page. The sidebar collapses to a 56px rail (⌘B), resizes by dragging (200–360px, double-click resets), and becomes a left drawer below 1024px.",
    demos: [{ id: "ShellDemo", title: "App shell", description: "Shown at desktop width. Resize the window below 1024px to see the drawer.", render: ShellDemo, full: true }],
    api: [
      { title: "AppShell", props: [{ name: "sidebar", type: "ReactNode", description: "A <Sidebar>." }, { name: "children", type: "ReactNode", description: "Header + Page." }] },
      { title: "SidebarItem", props: [{ name: "icon / label", type: "ReactNode / string", description: "" }, { name: "count", type: "number", description: "Count badge." }, { name: "active", type: "boolean", description: "Sets aria-current=page." }, { name: "href / onClick", type: "string / () => void", description: "Link or button." }, { name: "trailing", type: "ReactNode", description: "Instead of a count." }] },
      { title: "SidebarSection", props: [{ name: "title", type: "string", description: "Eyebrow label; becomes a short rule when collapsed." }, { name: "action", type: "ReactNode", description: "e.g. a + button." }] },
      { title: "useSidebar()", props: [{ name: "collapsed / setCollapsed", type: "boolean", description: "" }, { name: "width / setWidth", type: "number", description: "Persisted to localStorage." }, { name: "mobileOpen / setMobileOpen", type: "boolean", description: "" }] },
    ],
    a11y: ["The sidebar is a labelled <aside>; the resize handle is a focusable separator (←/→).", "Collapsed items show their label in a tooltip.", "On mobile, the drawer traps focus and closes on Esc or after choosing an item."],
  },
  {
    slug: "header", title: "Header", group: "Layout", section: "Components", source: "layout",
    summary: "Page title with a status pill, actions and profile. Tabs attach to its bottom edge so the header and the page's main switch read as one unit.",
    demos: [
      { id: "HeaderDemo", title: "Header with breadcrumb and tabs", render: HeaderDemo, full: true },
      { id: "ToolbarDemo", title: "Page heading and toolbar", render: ToolbarDemo, full: true },
    ],
    api: [{ title: "Header", props: [
      { name: "title / status / breadcrumb", type: "ReactNode", description: "" }, { name: "start", type: "ReactNode", description: "Usually <SidebarTrigger/>." },
      { name: "actions / end", type: "ReactNode", description: "Actions, then profile/notifications." }, { name: "tabs", type: "ReactNode", description: "Underline tabs below the bar." },
    ] }, { title: "PageToolbar", props: [{ name: "children / end", type: "ReactNode", description: "Filters left (wrap on mobile), sort/view right." }] }],
  },
  {
    slug: "grid", title: "Grid & card", group: "Layout", section: "Components", source: "layout",
    summary: "Grid steps its column count down by breakpoint. Card is a hairline container — reach for it only when grouping truly needs a boundary.",
    demos: [{ id: "GridDemo", title: "Three-column grid of cards", render: GridDemo, full: true }],
    api: [{ title: "Grid", props: [{ name: "cols", type: "1 | 2 | 3 | 4 | 6", default: "3", description: "Count at the widest breakpoint." }, { name: "gap", type: '"sm" | "md" | "lg"', default: '"md"', description: "8 / 16 / 24px." }] }],
    dos: [{ do: "Separate sections with whitespace and a hairline.", dont: "Wrap every section of a page in its own card." }],
  },
  {
    slug: "split-pane", title: "Split pane", group: "Layout", section: "Components", source: "layout",
    summary: "List and detail side by side with a draggable divider. Stacks below 768px.",
    demos: [{ id: "SplitDemo", title: "List | detail", render: SplitDemo, full: true }],
    api: [{ props: [{ name: "start / end", type: "ReactNode", description: "" }, { name: "defaultSize / min / max", type: "number (%)", default: "40 / 25 / 75", description: "" }] }],
  },
  {
    slug: "sheet", title: "Sheet", group: "Layout", section: "Components", source: "layout", keywords: ["drawer", "side panel", "detail"],
    summary: "A panel that slides from the right to show or edit one record without leaving the list. Esc closes it and the list keeps its scroll position. Full-width on phones.",
    whenToUse: ["Viewing or editing a record from a table.", "Filters with many fields (side=\"right\", size sm)."],
    whenNot: ["A two-field task — use a Dialog.", "A long, multi-section form — give it a page."],
    demos: [{ id: "SheetDemo", title: "Detail sheet", render: SheetDemo }],
    api: [{ title: "SheetContent", props: [
      { name: "title", type: "ReactNode", description: "Required (use hideTitle to make it screen-reader only)." },
      { name: "description / eyebrow / headerActions / footer", type: "ReactNode", description: "" },
      { name: "side", type: '"right" | "left" | "bottom"', default: '"right"', description: "" },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "360 / 440 / 560 / 720px." },
    ] }, { title: "SheetSection", props: [{ name: "title / action", type: "ReactNode", description: "Eyebrow title, hairline between sections." }] }],
    a11y: ["Radix Dialog: focus trap, Esc to close, focus returns to the row or button that opened it."],
  },
];
