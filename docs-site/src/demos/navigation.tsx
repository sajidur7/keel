import { useState } from "react";
import {
  Breadcrumb, Button, CommandPalette, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator,
  ContextMenuTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, FilterMenu,
  IconArchive, IconBuilding, IconChevronDown, IconCopy, IconEdit, IconHome, IconMail, IconPlus, IconReceipt, IconSettings,
  IconTag, IconTrash, IconUsers, Kbd, Pagination, SegmentedControl, Steps, Tabs, TabsContent, TabsList, TabsTrigger,
} from "@keel/components";
import type { DocPage } from "../docs/types";

/* ===== Tabs ===== */

export function UnderlineTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="border-b border-border">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="invoices" count={12}>Invoices</TabsTrigger>
        <TabsTrigger value="members" count={8}>Members</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4 text-small text-soft">Overview content</TabsContent>
      <TabsContent value="invoices" className="pt-4 text-small text-soft">12 invoices</TabsContent>
      <TabsContent value="members" className="pt-4 text-small text-soft">8 members</TabsContent>
      <TabsContent value="activity" className="pt-4 text-small text-soft">Activity feed</TabsContent>
    </Tabs>
  );
}

export function SegmentedTabs() {
  const [range, setRange] = useState("30d");
  return (
    <>
      <Tabs defaultValue="list">
        <TabsList variant="segmented">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
      </Tabs>
      <SegmentedControl aria-label="Range" value={range} onValueChange={setRange} options={[
        { value: "7d", label: "7d" }, { value: "30d", label: "30d" }, { value: "90d", label: "90d" }, { value: "12m", label: "12m" },
      ]} />
      <SegmentedControl size="sm" aria-label="Unit" value="usd" onValueChange={() => {}} options={[{ value: "usd", label: "USD" }, { value: "bdt", label: "BDT" }]} />
    </>
  );
}

/* ===== Breadcrumb ===== */

export function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb items={[{ label: "Customers", href: "#" }, { label: "Northwind Logistics", href: "#" }, { label: "Invoices", href: "#" }, { label: "INV-2065" }]} />
      <Breadcrumb items={[{ label: "Settings", href: "#" }, { label: "Billing" }]} />
    </div>
  );
}

/* ===== Menus ===== */

export function DropdownDemo() {
  const [cols, setCols] = useState({ owner: true, region: false });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button trailing={<IconChevronDown />}>Actions</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<IconEdit />} shortcut="E">Edit</DropdownMenuItem>
          <DropdownMenuItem icon={<IconCopy />} shortcut="⌘D">Duplicate</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<IconTag />}>Add tag</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Logistics</DropdownMenuItem><DropdownMenuItem>Annual</DropdownMenuItem><DropdownMenuItem>SSO</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem icon={<IconArchive />} disabled>Archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconTrash />} destructive shortcut="⌫">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button>Columns</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Show columns</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked disabled>Customer</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={cols.owner} onCheckedChange={(v) => setCols({ ...cols, owner: v })}>Owner</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={cols.region} onCheckedChange={(v) => setCols({ ...cols, region: v })}>Region</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function FilterMenus() {
  const [status, setStatus] = useState("all");
  const [owners, setOwners] = useState<string[]>(["nadia"]);
  const [sort, setSort] = useState("mrr");
  return (
    <>
      <FilterMenu label="Status" value={status} onChange={setStatus} options={[
        { value: "all", label: "All", count: 12 }, { value: "active", label: "Active", count: 7 }, { value: "trial", label: "Trial", count: 2 }, { value: "risk", label: "Churn risk", count: 2 },
      ]} />
      <FilterMenu mode="multi" label="Owner" value={owners} onChange={setOwners} allLabel="Anyone" options={[
        { value: "nadia", label: "Nadia" }, { value: "rafi", label: "Rafi" }, { value: "tanvir", label: "Tanvir" }, { value: "mira", label: "Mira" },
      ]} />
      <FilterMenu label="Sort" value={sort} onChange={setSort} align="end" options={[{ value: "mrr", label: "MRR" }, { value: "name", label: "Name" }, { value: "health", label: "Health" }]} />
    </>
  );
}

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-28 w-full max-w-md items-center justify-center rounded-lg text-small text-subtle shadow-[inset_0_0_0_1px_var(--line-strong)]" style={{ borderStyle: "dashed" }}>
        Right-click (or long-press) here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>INV-2065</ContextMenuLabel>
        <ContextMenuItem icon={<IconMail />}>Send reminder</ContextMenuItem>
        <ContextMenuItem icon={<IconCopy />} shortcut="⌘C">Copy ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconTrash />} destructive>Void invoice</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/* ===== Command palette ===== */

export function CommandDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const go = (l: string) => () => setLast(l);
  return (
    <>
      <Button onClick={() => setOpen(true)} trailing={<Kbd>⌘K</Kbd>}>Open command palette</Button>
      {last && <span className="text-small text-subtle">Ran: {last}</span>}
      <CommandPalette open={open} onOpenChange={setOpen} items={[
        { id: "new-inv", group: "Actions", label: "Create invoice", icon: <IconPlus />, shortcut: "C", onSelect: go("Create invoice") },
        { id: "invite", group: "Actions", label: "Invite member", icon: <IconUsers />, onSelect: go("Invite member") },
        { id: "home", group: "Go to", label: "Overview", icon: <IconHome />, keywords: ["dashboard"], onSelect: go("Overview") },
        { id: "cust", group: "Go to", label: "Customers", icon: <IconBuilding />, hint: "12", onSelect: go("Customers") },
        { id: "inv", group: "Go to", label: "Invoices", icon: <IconReceipt />, onSelect: go("Invoices") },
        { id: "settings", group: "Go to", label: "Settings", icon: <IconSettings />, shortcut: "G S", onSelect: go("Settings") },
        { id: "c1", group: "Customers", label: "Northwind Logistics", icon: <IconBuilding />, hint: "cus_01", onSelect: go("Northwind Logistics") },
        { id: "c2", group: "Customers", label: "Lumen Health", icon: <IconBuilding />, hint: "cus_02", onSelect: go("Lumen Health") },
      ]} />
    </>
  );
}

/* ===== Pagination / Steps ===== */

export function PaginationDemo() {
  const [page, setPage] = useState(4);
  return (
    <div className="flex w-full flex-col gap-6">
      <Pagination page={page} pageCount={24} onPageChange={setPage} total={1284} pageSize={54} />
      <Pagination page={page} pageCount={24} onPageChange={setPage} variant="compact" />
    </div>
  );
}

export function StepsDemo() {
  const [step, setStep] = useState(1);
  const steps = [{ title: "Company", description: "Name and domain" }, { title: "Plan", description: "Seats and billing" }, { title: "Invite team" }, { title: "Review" }];
  return (
    <div className="flex w-full flex-col gap-6">
      <Steps steps={steps} current={step} onStepClick={setStep} />
      <div className="flex gap-2">
        <Button size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button size="sm" variant="primary" disabled={step === steps.length} onClick={() => setStep(step + 1)}>{step >= steps.length - 1 ? "Finish" : "Continue"}</Button>
      </div>
      <Steps steps={steps} current={2} orientation="vertical" />
    </div>
  );
}

export const docs: DocPage[] = [
  {
    slug: "tabs", title: "Tabs", group: "Navigation", section: "Components", source: "navigation", keywords: ["segmented control", "toggle group"],
    summary: "Underline tabs switch the main view of a page or sheet; segmented tabs switch a small local option. Labels reserve their bold width, so nothing shifts when you switch.",
    demos: [
      { id: "UnderlineTabs", title: "Underline", render: UnderlineTabs, full: true },
      { id: "SegmentedTabs", title: "Segmented", description: "SegmentedControl is the same look without tab panels — for ranges and modes.", render: SegmentedTabs },
    ],
    api: [
      { title: "TabsList", props: [{ name: "variant", type: '"underline" | "segmented"', default: '"underline"', description: "" }] },
      { title: "TabsTrigger", props: [{ name: "value", type: "string", description: "" }, { name: "count", type: "number", description: "Count badge after the label." }, { name: "icon", type: "ReactNode", description: "" }] },
      { title: "SegmentedControl", props: [{ name: "value / onValueChange / options", type: "string / (v) => void / { value; label }[]", description: "" }, { name: "aria-label", type: "string", description: "Required." }] },
    ],
    a11y: ["Arrow keys move between tabs; panels are linked with aria-controls (Radix Tabs)."],
  },
  {
    slug: "breadcrumb", title: "Breadcrumb", group: "Navigation", section: "Components", source: "navigation",
    summary: "Shows where a record sits. Middle levels collapse to “…” under 640px.",
    demos: [{ id: "BreadcrumbDemo", title: "Breadcrumb", render: BreadcrumbDemo }],
    api: [{ props: [{ name: "items", type: "{ label; href?; onClick? }[]", description: "Last item is the current page (aria-current)." }] }],
  },
  {
    slug: "dropdown-menu", title: "Dropdown menu", group: "Navigation", section: "Components", source: "navigation", keywords: ["menu", "actions", "context menu"],
    summary: "A list of actions from a button. Items have an icon, label and shortcut; destructive items are red text, last, after a separator. ContextMenu shares the same items on right-click.",
    demos: [
      { id: "DropdownDemo", title: "Actions and checkbox items", render: DropdownDemo },
      { id: "ContextMenuDemo", title: "Context menu", render: ContextMenuDemo, full: true },
    ],
    api: [{ title: "DropdownMenuItem / ContextMenuItem", props: [{ name: "icon", type: "ReactNode", description: "" }, { name: "shortcut", type: "string", description: "Right-aligned hint." }, { name: "destructive", type: "boolean", description: "" }, { name: "onSelect", type: "(e) => void", description: "" }, { name: "disabled", type: "boolean", description: "" }] }],
    a11y: ["Full keyboard support: arrows, type-ahead, Esc, submenus with →/←."],
    dos: [{ do: "Keep menus under ~8 items and group with separators.", dont: "Hide the only way to do something important inside a menu." }],
  },
  {
    slug: "filter-menu", title: "Filter menu", group: "Navigation", section: "Components", source: "navigation", keywords: ["filter", "label value"],
    summary: "The “Label | Value” split trigger for toolbars. The quiet label says what's filtered, the value says how. Multi-select filters show a clear button when active.",
    demos: [{ id: "FilterMenus", title: "Single and multi", render: FilterMenus }],
    api: [{ props: [
      { name: "label", type: "string", description: "" }, { name: "mode", type: '"single" | "multi"', default: '"single"', description: "" },
      { name: "value / onChange", type: "string | string[]", description: "" }, { name: "options", type: "{ value; label; icon?; count? }[]", description: "Counts help users avoid empty results." },
      { name: "allLabel", type: "string", default: '"All"', description: "Shown when a multi filter is empty." },
    ] }],
  },
  {
    slug: "command-palette", title: "Command palette", group: "Navigation", section: "Components", source: "navigation", keywords: ["cmdk", "search", "⌘k", "spotlight"],
    summary: "⌘K / Ctrl+K opens a searchable list of actions, pages and records. Every admin app built with Keel should have one; it's the fastest route for repeat users.",
    demos: [{ id: "CommandDemo", title: "Command palette", render: CommandDemo }],
    api: [{ props: [
      { name: "open / onOpenChange", type: "boolean", description: "Pair with useCommandShortcut(setOpen) for ⌘K." },
      { name: "items", type: "CommandItem[]", description: "{ id, label, group?, icon?, keywords?, shortcut?, hint?, onSelect }" },
    ] }],
    a11y: ["The input is an ARIA combobox controlling a listbox; the active option is tracked with aria-activedescendant.", "↑/↓/Home/End move, Enter runs, Esc closes and returns focus."],
  },
  {
    slug: "pagination", title: "Pagination", group: "Navigation", section: "Components", source: "navigation",
    summary: "Moves through pages of a table. Shows the visible range of the total; collapses to “4 / 24” on phones.",
    demos: [{ id: "PaginationDemo", title: "Full and compact", render: PaginationDemo, full: true }],
    api: [{ props: [{ name: "page / pageCount / onPageChange", type: "number / number / (p) => void", description: "" }, { name: "total / pageSize", type: "number", description: "For “21–40 of 1,284”." }, { name: "variant", type: '"full" | "compact"', default: '"full"', description: "" }] }],
  },
  {
    slug: "steps", title: "Steps", group: "Navigation", section: "Components", source: "navigation", keywords: ["stepper", "wizard"],
    summary: "Progress through a multi-step flow. Horizontal from 640px, vertical below. Completed steps can be revisited.",
    demos: [{ id: "StepsDemo", title: "Steps", render: StepsDemo, full: true }],
    api: [{ props: [{ name: "steps", type: "{ title; description? }[]", description: "" }, { name: "current", type: "number", description: "Zero-based." }, { name: "orientation", type: '"horizontal" | "vertical"', description: "" }, { name: "onStepClick", type: "(i) => void", description: "Makes done steps clickable." }] }],
  },
];
