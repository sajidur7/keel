import { useEffect, useRef, useState } from "react";
import {
  Accordion, AccordionItem, Alert, DateRangePicker, Anchor, Avatar, AvatarGroup, Badge, Banner, BarChart, Breadcrumb, Button, Calendar, Card,
  Cascader, Checkbox, Code, CodeBlock, Collapsible, ColorPicker, Combobox, CommandPalette, ConfirmDialog, CopyButton, CountBadge,
  DataTable, DatePicker, DescriptionList, Dialog, DialogContent, DialogTrigger, Divider, DonutChart, DropdownMenu,
  DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  EmptyState, FileUpload, FilterButton, FilterMenu, FormField, Grid, Header, IconBell, IconBuilding, IconButton, IconChevronDown,
  IconCopy, IconDownload, IconEdit, IconHome, IconInbox, IconList, IconMoreHorizontal, IconPlus, IconReceipt, IconRefresh,
  IconSettings, IconTrash, IconUsers, ImagePreview, Inline, InlineEdit, InlineMessage, Input, Kbd, KbdGroup, Label, LineChart,
  List, ListItem, NumberInput, OtpInput, Pagination, PasswordInput, Popconfirm, Popover, PopoverContent, PopoverTrigger, Progress,
  ProgressDots, ProgressRing, Radio, RadioGroup, Rating, SearchInput, SegmentBar, SegmentedControl, Select, Sheet, SheetContent,
  SheetSection, Sidebar, SidebarContent, SidebarItem, SidebarProvider, SidebarSection, Skeleton, SkeletonText, Slider, Sparkline,
  SplitPane, Spinner, Stack, Stat, StatusPage, StatusPill, Steps, Switch, Table, TableBody, TableCell, TableContainer, TableFooter,
  TableHead, TableHeader, TableRow, Tabs, TabsList, TabsTrigger, Tag, TAG_TONES, Text, Textarea, TimePicker, Timeline, Toggle,
  ToggleGroup, ToggleGroupItem, Tooltip, Transfer, Tree, type TreeNode, useToast,
} from "@keel/components";
import { customers, people } from "@keel/templates/data";
import { State, StateGrid } from "../docs/doc-ui";
import type { DemoSpec } from "../docs/types";

/*
 * Every state of every component, rendered by the component itself.
 * `data-force="hover" | "focus" | "active"` is a docs-only switch that shows an interaction state without a pointer —
 * drop it in your app; the real :hover / :focus-visible / :active styles are the same classes.
 */

const regions = [{ value: "dhaka", label: "Dhaka" }, { value: "singapore", label: "Singapore" }, { value: "berlin", label: "Berlin" }];
const owners = [{ value: "nadia", label: "Nadia Karim" }, { value: "rafi", label: "Rafi Ahmed" }, { value: "mira", label: "Mira Okafor" }];

/* ===== General ===== */

export function ButtonAllStates() {
  const row = (force?: string, extra: { loading?: boolean; disabled?: boolean } = {}) => (
    <>
      <Button variant="primary" data-force={force} {...extra}>Save</Button>
      <Button variant="secondary" data-force={force} {...extra}>Export</Button>
      <Button variant="ghost" data-force={force} {...extra}>Cancel</Button>
      <Button variant="danger" data-force={force} {...extra}>Delete</Button>
    </>
  );
  return (
    <StateGrid min={300}>
      <State label="Default">{row()}</State>
      <State label="Hover">{row("hover")}</State>
      <State label="Focus">{row("focus")}</State>
      <State label="Pressed">{row("active")}</State>
      <State label="Loading">{row(undefined, { loading: true })}</State>
      <State label="Disabled">{row(undefined, { disabled: true })}</State>
    </StateGrid>
  );
}

export function IconButtonAllStates() {
  const row = (force?: string, extra: { loading?: boolean; disabled?: boolean } = {}) => (
    <>
      <IconButton label="Add" variant="primary" data-force={force} {...extra}><IconPlus /></IconButton>
      <IconButton label="More" variant="secondary" data-force={force} {...extra}><IconMoreHorizontal /></IconButton>
      <IconButton label="Refresh" data-force={force} {...extra}><IconRefresh /></IconButton>
      <IconButton label="Delete" variant="danger-ghost" data-force={force} {...extra}><IconTrash /></IconButton>
    </>
  );
  return (
    <StateGrid min={200}>
      <State label="Default">{row()}</State>
      <State label="Hover">{row("hover")}</State>
      <State label="Focus">{row("focus")}</State>
      <State label="Pressed">{row("active")}</State>
      <State label="Loading">{row(undefined, { loading: true })}</State>
      <State label="Disabled">{row(undefined, { disabled: true })}</State>
    </StateGrid>
  );
}

export function TextAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Foreground"><Text>Northwind Logistics</Text></State>
      <State label="Soft"><Text tone="soft">Renews on Dec 1</Text></State>
      <State label="Subtle"><Text tone="subtle">Created by Rafi Ahmed</Text></State>
      <State label="Faint"><Text tone="faint">No tax ID</Text></State>
      <State label="Truncated"><Text className="block w-40 truncate">Northwind Logistics Incorporated (Canada)</Text></State>
      <State label="Mono"><Text variant="mono" tone="soft">cus_01HZ8K2M4N</Text></State>
    </StateGrid>
  );
}

export function KbdAllStates() {
  return (
    <StateGrid>
      <State label="Single key"><Kbd>⌘K</Kbd><Kbd>Esc</Kbd></State>
      <State label="Combination"><KbdGroup keys={["⌘", "Shift", "P"]} /></State>
      <State label="In text"><span className="text-small text-subtle">Press <Kbd>/</Kbd> to search</span></State>
      <State label="In a button"><Button size="sm" trailing={<Kbd>E</Kbd>}>Edit</Button></State>
    </StateGrid>
  );
}

export function DividerAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Horizontal"><Divider /></State>
      <State label="With label"><Divider label="Or continue with" /></State>
      <State label="Vertical">
        <span className="flex h-5 items-center gap-3 text-small text-soft">Edit<Divider orientation="vertical" />Duplicate<Divider orientation="vertical" />Archive</span>
      </State>
    </StateGrid>
  );
}

/* ===== Layout ===== */

export function AppShellAllStates() {
  const items = (force?: string) => (
    <SidebarProvider>
      <Sidebar className="relative! h-auto w-56 overflow-hidden rounded-lg">
        <SidebarContent>
          <SidebarSection title="Workspace">
            <SidebarItem icon={<IconHome />} label="Overview" />
            <div data-force={force}><SidebarItem icon={<IconBuilding />} label="Customers" count={12} /></div>
            <SidebarItem icon={<IconReceipt />} label="Invoices" count={3} active />
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
  return (
    <StateGrid min={240}>
      <State label="Item · default and active">{items()}</State>
      <State label="Item · hover (Customers)">{items("hover")}</State>
      <State label="Item · focus (Customers)">{items("focus")}</State>
      <State label="Collapsed rail">
        <SidebarProvider defaultCollapsed>
          <Sidebar className="relative! h-auto overflow-hidden rounded-lg">
            <SidebarContent>
              <SidebarItem icon={<IconHome />} label="Overview" />
              <SidebarItem icon={<IconBuilding />} label="Customers" active />
              <SidebarItem icon={<IconUsers />} label="Members" />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </State>
    </StateGrid>
  );
}

export function HeaderAllStates() {
  return (
    <StateGrid min={520}>
      <State label="Title only"><div className="w-full overflow-hidden rounded-lg shadow-card"><Header title="Customers" /></div></State>
      <State label="With status and actions">
        <div className="w-full overflow-hidden rounded-lg shadow-card">
          <Header title="Overview" status={<StatusPill status="active" pulse size="sm">Live</StatusPill>} actions={<Button size="sm" leading={<IconDownload />}>Export</Button>} />
        </div>
      </State>
      <State label="Record with breadcrumb and tabs">
        <div className="w-full overflow-hidden rounded-lg shadow-card">
          <Header title="Northwind Logistics" breadcrumb={<span className="text-caption text-subtle">Customers</span>}
            actions={<IconButton label="More" size="sm"><IconMoreHorizontal /></IconButton>}
            tabs={<Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="invoices" count={12}>Invoices</TabsTrigger></TabsList></Tabs>} />
        </div>
      </State>
    </StateGrid>
  );
}

export function GridAllStates() {
  return (
    <StateGrid min={240}>
      <State label="Card · padding md"><Card className="w-full"><Text variant="small">Northwind Logistics</Text></Card></State>
      <State label="Card · padding sm"><Card padding="sm" className="w-full"><Text variant="small">Compact card</Text></Card></State>
      <State label="Card · no padding"><Card padding="none" className="w-full overflow-hidden"><div className="border-b border-border px-4 py-2.5 text-small">Header</div><div className="px-4 py-2.5 text-small text-soft">Body</div></Card></State>
      <State label="Grid · 3 columns" wide>
        <Grid cols={3} className="w-full">{["Starter", "Growth", "Scale"].map((p) => <Card key={p} padding="sm"><Text variant="small">{p}</Text></Card>)}</Grid>
      </State>
    </StateGrid>
  );
}

export function SplitPaneAllStates() {
  const pane = (size: number) => (
    <div className="h-40 w-full overflow-hidden rounded-lg shadow-card">
      <SplitPane defaultSize={size}
        start={<List className="px-3">{customers.slice(0, 3).map((c, i) => <ListItem key={c.id} title={c.name} selected={i === 0} onClick={() => {}} />)}</List>}
        end={<div className="p-4 text-small text-soft">{customers[0].name}</div>} />
    </div>
  );
  return (
    <StateGrid min={320}>
      <State label="Default (38%)">{pane(38)}</State>
      <State label="Narrow list (25%)">{pane(25)}</State>
    </StateGrid>
  );
}

export function SheetAllStates() {
  const [open, setOpen] = useState<null | "sm" | "md" | "lg" | "footer">(null);
  const c = customers[1];
  return (
    <StateGrid>
      {(["sm", "md", "lg"] as const).map((s) => (
        <State key={s} label={`Size ${s}`}><Button size="sm" onClick={() => setOpen(s)}>Open {s}</Button></State>
      ))}
      <State label="With footer (unsaved edits)"><Button size="sm" variant="primary" onClick={() => setOpen("footer")}>Open with footer</Button></State>
      <Sheet open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent size={open === "footer" ? "md" : (open ?? "md")} title={c.name} description={c.domain}
          footer={open === "footer" ? <><Button variant="ghost" onClick={() => setOpen(null)}>Discard</Button><Button variant="primary">Save changes</Button></> : undefined}>
          <SheetSection title="Details"><DescriptionList items={[{ label: "Owner", value: c.owner }, { label: "Seats", value: c.seats }]} /></SheetSection>
        </SheetContent>
      </Sheet>
    </StateGrid>
  );
}

/* ===== Navigation ===== */

export function TabsAllStates() {
  return (
    <StateGrid min={260}>
      <State label="Default · selected · disabled">
        <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">Overview</TabsTrigger><TabsTrigger value="b" count={12}>Invoices</TabsTrigger><TabsTrigger value="c" disabled>Settings</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Hover (Invoices)">
        <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">Overview</TabsTrigger><TabsTrigger value="b" count={12} data-force="hover">Invoices</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Focus (Invoices)">
        <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">Overview</TabsTrigger><TabsTrigger value="b" count={12} data-force="focus">Invoices</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Segmented">
        <Tabs defaultValue="list"><TabsList variant="segmented"><TabsTrigger value="list">List</TabsTrigger><TabsTrigger value="board">Board</TabsTrigger><TabsTrigger value="cal" disabled>Calendar</TabsTrigger></TabsList></Tabs>
      </State>
      <State label="Segmented control">
        <SegmentedControl aria-label="Range" value="30d" onValueChange={() => {}} options={[{ value: "7d", label: "7d" }, { value: "30d", label: "30d" }, { value: "90d", label: "90d" }]} />
      </State>
    </StateGrid>
  );
}

export function BreadcrumbAllStates() {
  const items = [{ label: "Customers", href: "#" }, { label: "Northwind Logistics", href: "#" }, { label: "INV-2065" }];
  return (
    <StateGrid min={300}>
      <State label="Default"><Breadcrumb items={items} /></State>
      <State label="Hover (link)"><div data-force="hover"><Breadcrumb items={items.slice(0, 1).concat({ label: "Billing" })} /></div></State>
      <State label="Focus (link)"><div data-force="focus"><Breadcrumb items={items.slice(0, 1).concat({ label: "Billing" })} /></div></State>
      <State label="Two levels"><Breadcrumb items={[{ label: "Settings", href: "#" }, { label: "Billing" }]} /></State>
    </StateGrid>
  );
}

export function DropdownMenuAllStates() {
  const first = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => first.current?.focus({ preventScroll: true }), 50); return () => clearTimeout(t); }, []);
  return (
    <StateGrid min={240}>
      <State label="Trigger · default"><Button trailing={<IconChevronDown />}>Actions</Button></State>
      <State label="Trigger · hover"><Button trailing={<IconChevronDown />} data-force="hover">Actions</Button></State>
      <State label="Trigger · open"><Button trailing={<IconChevronDown />} data-state="open" aria-expanded>Actions</Button></State>
      <State label="Open menu · hover, disabled, checked, destructive" wide>
        <div className="h-64 w-full">
          <DropdownMenu open modal={false}>
            <DropdownMenuTrigger asChild><Button size="sm">Row actions</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
              <DropdownMenuLabel>INV-2065</DropdownMenuLabel>
              <DropdownMenuItem ref={first} icon={<IconEdit />} shortcut="E">Edit (hover)</DropdownMenuItem>
              <DropdownMenuItem icon={<IconCopy />}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem icon={<IconDownload />} disabled>Export (disabled)</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked>Show archived</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </State>
    </StateGrid>
  );
}

export function FilterMenuAllStates() {
  const opts = [{ value: "all", label: "All", count: 12 }, { value: "active", label: "Active", count: 7 }, { value: "trial", label: "Trial", count: 2 }];
  return (
    <StateGrid min={200}>
      <State label="Default (All)"><FilterMenu label="Status" value="all" onChange={() => {}} options={opts} /></State>
      <State label="Hover"><div data-force="hover"><FilterMenu label="Status" value="all" onChange={() => {}} options={opts} /></div></State>
      <State label="Focus"><div data-force="focus"><FilterMenu label="Status" value="all" onChange={() => {}} options={opts} /></div></State>
      <State label="Filtered"><FilterMenu label="Status" value="active" onChange={() => {}} options={opts} /></State>
      <State label="Multi · 2 selected"><FilterMenu mode="multi" label="Owner" value={["nadia", "rafi"]} onChange={() => {}} allLabel="Anyone" options={owners} /></State>
      <State label="Filter button"><FilterButton count={2}>Filters</FilterButton></State>
    </StateGrid>
  );
}

export function CommandPaletteAllStates() {
  const [open, setOpen] = useState<null | "results" | "empty">(null);
  return (
    <StateGrid>
      <State label="With results"><Button size="sm" onClick={() => setOpen("results")} trailing={<Kbd>⌘K</Kbd>}>Open</Button></State>
      <State label="Empty"><Button size="sm" onClick={() => setOpen("empty")}>Open with no items</Button></State>
      <CommandPalette open={open !== null} onOpenChange={(o) => !o && setOpen(null)} emptyLabel="No pages or actions match"
        items={open === "empty" ? [] : [
          { id: "new", group: "Actions", label: "Create invoice", icon: <IconPlus />, shortcut: "C", onSelect: () => setOpen(null) },
          { id: "home", group: "Go to", label: "Overview", icon: <IconHome />, onSelect: () => setOpen(null) },
          { id: "cust", group: "Go to", label: "Customers", icon: <IconBuilding />, hint: "12", onSelect: () => setOpen(null) },
        ]} />
    </StateGrid>
  );
}

export function PaginationAllStates() {
  return (
    <StateGrid min={420}>
      <State label="First page (Previous disabled)"><Pagination page={1} pageCount={24} onPageChange={() => {}} total={1284} pageSize={54} /></State>
      <State label="Middle page"><Pagination page={8} pageCount={24} onPageChange={() => {}} total={1284} pageSize={54} /></State>
      <State label="Last page (Next disabled)"><Pagination page={24} pageCount={24} onPageChange={() => {}} total={1284} pageSize={54} /></State>
      <State label="Single page"><Pagination page={1} pageCount={1} onPageChange={() => {}} total={12} pageSize={54} /></State>
      <State label="Compact"><Pagination page={4} pageCount={24} onPageChange={() => {}} variant="compact" /></State>
    </StateGrid>
  );
}

export function StepsAllStates() {
  const steps = [{ title: "Company", description: "Name and domain" }, { title: "Plan" }, { title: "Invite team" }];
  return (
    <StateGrid min={420}>
      <State label="First step"><Steps steps={steps} current={0} orientation="horizontal" /></State>
      <State label="Middle (done · current · upcoming)"><Steps steps={steps} current={1} orientation="horizontal" /></State>
      <State label="All done"><Steps steps={steps} current={3} orientation="horizontal" /></State>
      <State label="Vertical"><Steps steps={steps} current={1} orientation="vertical" /></State>
    </StateGrid>
  );
}

/* ===== Data entry ===== */

export function InputAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Placeholder"><Input placeholder="Company name" /></State>
      <State label="Hover"><Input placeholder="Company name" data-force="hover" /></State>
      <State label="Focus"><Input defaultValue="Northwind" data-force="focus" /></State>
      <State label="Filled · clearable"><Input defaultValue="Northwind Logistics" clearable /></State>
      <State label="Error"><Input defaultValue="northwind" invalid aria-invalid /></State>
      <State label="Read-only"><Input defaultValue="nadia@fernhill.io" readOnly /></State>
      <State label="Disabled"><Input defaultValue="Locked while syncing" disabled /></State>
      <State label="Search"><SearchInput placeholder="Search customers" shortcut="/" /></State>
      <State label="Password"><PasswordInput defaultValue="correct-horse" /></State>
      <State label="Number"><NumberInput value={25} onValueChange={() => {}} min={1} max={100} /></State>
      <State label="Textarea"><Textarea placeholder="Visible to your team only" rows={2} /></State>
      <State label="Textarea · error"><Textarea defaultValue="Too long" invalid rows={2} /></State>
    </StateGrid>
  );
}

export function FormFieldAllStates() {
  return (
    <StateGrid min={240}>
      <State label="Default"><FormField label="Workspace name" className="w-full"><Input placeholder="Fernhill" /></FormField></State>
      <State label="Required + help"><FormField label="Workspace name" required help="Shown on invoices" className="w-full"><Input /></FormField></State>
      <State label="Optional"><FormField label="Tax ID" optional className="w-full"><Input /></FormField></State>
      <State label="Error"><FormField label="Subdomain" error="This subdomain is taken. Try another." className="w-full"><Input defaultValue="northwind" /></FormField></State>
      <State label="Read-only"><FormField label="Email" readOnly help="Set by your identity provider" className="w-full"><Input defaultValue="nadia@fernhill.io" /></FormField></State>
      <State label="Disabled"><FormField label="Region" disabled className="w-full"><Input defaultValue="Dhaka" /></FormField></State>
      <State label="Character count"><FormField label="Description" count={{ value: 42, max: 80 }} className="w-full"><Textarea rows={2} defaultValue="Operations team for the APAC region." /></FormField></State>
      <State label="Over the limit"><FormField label="Description" count={{ value: 92, max: 80 }} className="w-full"><Textarea rows={2} invalid defaultValue="Operations team for the APAC region, covering Dhaka, Singapore and Jakarta." /></FormField></State>
      <State label="Label on its own"><Label htmlFor="lbl-demo">Billing email</Label></State>
    </StateGrid>
  );
}

export function SelectAllStates() {
  return (
    <StateGrid min={200}>
      <State label="Placeholder"><Select placeholder="Choose region" options={regions} /></State>
      <State label="Hover"><div data-force="hover" className="w-full"><Select placeholder="Choose region" options={regions} /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><Select placeholder="Choose region" options={regions} /></div></State>
      <State label="Selected"><Select defaultValue="berlin" options={regions} /></State>
      <State label="Error"><Select placeholder="Choose region" options={regions} invalid /></State>
      <State label="Read-only"><Select defaultValue="berlin" options={regions} readOnly /></State>
      <State label="Disabled"><Select defaultValue="berlin" options={regions} disabled /></State>
      <State label="Small"><Select size="sm" defaultValue="dhaka" options={regions} /></State>
    </StateGrid>
  );
}

export function ComboboxAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Placeholder"><Combobox value={null} onValueChange={() => {}} placeholder="Assign owner" options={owners} /></State>
      <State label="Hover"><div data-force="hover" className="w-full"><Combobox value={null} onValueChange={() => {}} placeholder="Assign owner" options={owners} /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><Combobox value={null} onValueChange={() => {}} placeholder="Assign owner" options={owners} /></div></State>
      <State label="Selected"><Combobox value="nadia" onValueChange={() => {}} options={owners} /></State>
      <State label="Multiple"><Combobox multiple value={["nadia", "rafi"]} onValueChange={() => {}} options={owners} /></State>
      <State label="Loading"><Combobox value={null} onValueChange={() => {}} placeholder="Searching people" options={[]} loading /></State>
      <State label="Error"><Combobox value={null} onValueChange={() => {}} placeholder="Assign owner" options={owners} invalid /></State>
      <State label="Disabled"><Combobox value="mira" onValueChange={() => {}} options={owners} disabled /></State>
    </StateGrid>
  );
}

export function CheckboxAllStates() {
  return (
    <StateGrid min={180}>
      <State label="Unchecked"><Checkbox label="Send receipt" /></State>
      <State label="Hover"><div data-force="hover"><Checkbox label="Send receipt" /></div></State>
      <State label="Focus"><div data-force="focus"><Checkbox label="Send receipt" /></div></State>
      <State label="Checked"><Checkbox label="Send receipt" defaultChecked /></State>
      <State label="Indeterminate"><Checkbox label="All notifications" checked="indeterminate" /></State>
      <State label="Error"><Checkbox label="Accept the terms" invalid /></State>
      <State label="Disabled"><Checkbox label="Send receipt" disabled /></State>
      <State label="Disabled checked"><Checkbox label="Send receipt" disabled defaultChecked /></State>
      <State label="With description"><Checkbox label="Payments failed" description="Includes retries" defaultChecked /></State>
    </StateGrid>
  );
}

export function RadioAllStates() {
  const one = (label: string, value: string, props: { disabled?: boolean } = {}, force?: string) => (
    <div data-force={force}><RadioGroup defaultValue={value === "on" ? "on" : undefined} aria-label={label}><Radio value="on" label="Monthly" {...props} /></RadioGroup></div>
  );
  return (
    <StateGrid min={160}>
      <State label="Unselected">{one("Unselected", "off")}</State>
      <State label="Hover">{one("Hover", "off", {}, "hover")}</State>
      <State label="Focus">{one("Focus", "off", {}, "focus")}</State>
      <State label="Selected">{one("Selected", "on")}</State>
      <State label="Disabled">{one("Disabled", "off", { disabled: true })}</State>
      <State label="Disabled selected">{one("Disabled selected", "on", { disabled: true })}</State>
      <State label="Group with description">
        <RadioGroup defaultValue="annual" aria-label="Billing cycle"><Radio value="monthly" label="Monthly" /><Radio value="annual" label="Annual" description="Two months free" /></RadioGroup>
      </State>
    </StateGrid>
  );
}

export function SwitchAllStates() {
  return (
    <StateGrid min={170}>
      <State label="Off"><Switch label="Public page" /></State>
      <State label="Hover"><div data-force="hover"><Switch label="Public page" /></div></State>
      <State label="Focus"><div data-force="focus"><Switch label="Public page" /></div></State>
      <State label="On"><Switch label="Public page" defaultChecked /></State>
      <State label="Disabled off"><Switch label="Public page" disabled /></State>
      <State label="Disabled on"><Switch label="Public page" disabled defaultChecked /></State>
      <State label="Small"><Switch label="Compact" size="sm" defaultChecked /></State>
      <State label="With description"><Switch label="Two-factor" description="Required for admins" defaultChecked /></State>
    </StateGrid>
  );
}

export function SliderAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Default"><div className="w-full"><Slider defaultValue={[60]} max={100} showValue format={(v) => `${v}%`} aria-label="Threshold" /></div></State>
      <State label="Hover"><div data-force="hover" className="w-full"><Slider defaultValue={[60]} max={100} showValue aria-label="Threshold" /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><Slider defaultValue={[60]} max={100} showValue aria-label="Threshold" /></div></State>
      <State label="Range"><div className="w-full"><Slider defaultValue={[20, 80]} max={100} showValue format={(v) => `$${v}k`} aria-label="MRR range" /></div></State>
      <State label="Disabled"><div className="w-full"><Slider defaultValue={[40]} disabled showValue aria-label="Disabled" /></div></State>
    </StateGrid>
  );
}

export function DatePickerAllStates() {
  const d = new Date(2026, 10, 14);
  return (
    <StateGrid min={220}>
      <State label="Empty"><DatePicker value={null} onChange={() => {}} /></State>
      <State label="Hover"><div data-force="hover" className="w-full"><DatePicker value={null} onChange={() => {}} /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><DatePicker value={d} onChange={() => {}} /></div></State>
      <State label="Selected"><DatePicker value={d} onChange={() => {}} /></State>
      <State label="Error"><DatePicker value={null} onChange={() => {}} invalid /></State>
      <State label="Disabled"><DatePicker value={d} onChange={() => {}} disabled /></State>
      <State label="Range"><DateRangePicker value={{ from: new Date(2026, 10, 3), to: d }} onChange={() => {}} /></State>
      <State label="Time"><TimePicker value="09:30" onChange={() => {}} /></State>
      <State label="Calendar · today, selected, out-of-range days disabled" wide>
        <div className="flex flex-wrap gap-6">
          <Calendar selected={d} onSelect={() => {}} min={new Date(2026, 10, 5)} />
          <Calendar range={{ from: new Date(2026, 10, 3), to: new Date(2026, 10, 12) }} onRangeSelect={() => {}} />
        </div>
      </State>
    </StateGrid>
  );
}

export function FileUploadAllStates() {
  return (
    <StateGrid min={300}>
      <State label="Idle"><div className="w-full"><FileUpload accept=".csv" onFiles={() => {}} /></div></State>
      <State label="Hover / drag over"><div data-force="hover" className="w-full"><FileUpload accept=".csv" onFiles={() => {}} /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><FileUpload accept=".csv" onFiles={() => {}} /></div></State>
      <State label="Disabled"><div className="w-full"><FileUpload accept=".csv" onFiles={() => {}} disabled /></div></State>
      <State label="Uploading · done · error" wide>
        <div className="w-full max-w-lg">
          <FileUpload compact accept=".csv,.pdf" onFiles={() => {}} onRemove={() => {}} onRetry={() => {}} items={[
            { id: "u", name: "customers-q4.csv", size: 820_000, status: "uploading", progress: 64 },
            { id: "d", name: "customers-q3.csv", size: 182_000, status: "done" },
            { id: "e", name: "contract-orbital.pdf", size: 2_400_000, status: "error", error: "Connection lost at 64%" },
          ]} />
        </div>
      </State>
    </StateGrid>
  );
}

export function InlineEditAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Default"><InlineEdit label="Company name" value="Northwind Logistics" onSave={() => {}} /></State>
      <State label="Hover"><div data-force="hover" className="w-full"><InlineEdit label="Company name" value="Northwind Logistics" onSave={() => {}} /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><InlineEdit label="Company name" value="Northwind Logistics" onSave={() => {}} /></div></State>
      <State label="Empty"><InlineEdit label="Tax ID" value="" placeholder="Add tax ID" onSave={() => {}} /></State>
      <State label="Read-only"><InlineEdit label="Account ID" value="cus_01HZ8K2M4N" onSave={() => {}} readOnly /></State>
    </StateGrid>
  );
}

/* ===== Data display ===== */

export function AvatarAllStates() {
  return (
    <StateGrid min={180}>
      <State label="Sizes"><Avatar name="Nadia Karim" size="xs" /><Avatar name="Nadia Karim" size="sm" /><Avatar name="Nadia Karim" size="md" /><Avatar name="Nadia Karim" size="lg" /><Avatar name="Nadia Karim" size="xl" /></State>
      <State label="Status"><Avatar name="Nadia Karim" size="lg" status="online" /><Avatar name="Rafi Ahmed" size="lg" status="away" /><Avatar name="Leah Tran" size="lg" status="busy" /><Avatar name="Jonas Weber" size="lg" status="offline" /></State>
      <State label="Square (organisation)"><Avatar name="Orbital Labs" size="lg" shape="square" /><Avatar name="Lumen Health" size="md" shape="square" /></State>
      <State label="Neutral"><Avatar name="Jonas Weber" size="lg" colored={false} /></State>
      <State label="No name"><Avatar size="lg" /></State>
      <State label="Group with overflow"><AvatarGroup people={people} max={4} size="md" /></State>
    </StateGrid>
  );
}

export function TagAllStates() {
  return (
    <StateGrid min={200}>
      <State label="Tones" wide>{TAG_TONES.map((t) => <Tag key={t} tone={t}>{t[0].toUpperCase() + t.slice(1)}</Tag>)}</State>
      <State label="Sizes"><Tag size="sm" tone="blue">Small</Tag><Tag size="md" tone="blue">Medium</Tag><Tag size="lg" tone="blue">Large</Tag></State>
      <State label="With dot"><Tag tone="teal" dot>Growth</Tag><Tag tone="violet" dot>Enterprise</Tag></State>
      <State label="Removable"><Tag onRemove={() => {}}>Logistics</Tag></State>
      <State label="Remove · hover"><div data-force="hover"><Tag onRemove={() => {}}>Logistics</Tag></div></State>
      <State label="Remove · focus"><div data-force="focus"><Tag onRemove={() => {}}>Logistics</Tag></div></State>
      <State label="Truncated"><Tag className="max-w-28">Healthcare and life sciences</Tag></State>
    </StateGrid>
  );
}

export function StatusPillAllStates() {
  return (
    <StateGrid min={150}>
      <State label="Active (live)"><StatusPill status="active" pulse>Live</StatusPill></State>
      <State label="Success"><StatusPill status="success">Paid</StatusPill></State>
      <State label="Warning"><StatusPill status="warning">Due</StatusPill></State>
      <State label="Danger"><StatusPill status="danger">Overdue</StatusPill></State>
      <State label="Info"><StatusPill status="info">Trial</StatusPill></State>
      <State label="Neutral"><StatusPill status="neutral">Paused</StatusPill></State>
      <State label="Pending"><StatusPill status="pending">Draft</StatusPill></State>
      <State label="Small"><StatusPill status="success" size="sm">Paid</StatusPill></State>
    </StateGrid>
  );
}

export function CountBadgeAllStates() {
  return (
    <StateGrid min={140}>
      <State label="Neutral"><CountBadge count={4} /></State>
      <State label="Strong"><CountBadge count={7} tone="strong" /></State>
      <State label="Danger"><CountBadge count={3} tone="danger" /></State>
      <State label="Zero"><CountBadge count={0} /></State>
      <State label="Over max"><CountBadge count={1284} max={999} /></State>
    </StateGrid>
  );
}

export function DescriptionListAllStates() {
  const c = customers[0];
  return (
    <StateGrid min={280}>
      <State label="Inline"><DescriptionList items={[{ label: "Owner", value: c.owner }, { label: "Plan", value: <Tag tone="blue">{c.plan}</Tag> }]} /></State>
      <State label="Empty value"><DescriptionList items={[{ label: "Tax ID", value: null }, { label: "Notes", value: undefined }]} /></State>
      <State label="Stacked · 2 columns"><DescriptionList layout="stacked" columns={2} items={[{ label: "Seats", value: c.seats }, { label: "Region", value: c.region }]} /></State>
      <State label="Loading"><div className="flex w-full flex-col gap-3"><Skeleton className="h-3 w-3/5" /><Skeleton className="h-3 w-2/5" /></div></State>
    </StateGrid>
  );
}

export function StatAllStates() {
  return (
    <StateGrid min={200}>
      <State label="Up"><Stat label="MRR" value="$102,750" delta={6.2} baseline="vs Oct" help="Recurring revenue." /></State>
      <State label="Down"><Stat label="Active users" value="1,184" delta={-3.1} baseline="vs Oct" /></State>
      <State label="Lower is better"><Stat label="Churn" value="1.8%" delta={-0.4} deltaUnit="pt" baseline="vs Oct" lowerIsBetter /></State>
      <State label="Neutral"><Stat label="Seats" value="140" delta={0} baseline="vs Oct" /></State>
      <State label="No data"><Stat label="NPS" value={null} meta="Survey opens Dec 1" /></State>
      <State label="Loading"><Stat label="MRR" value="$102,750" loading /></State>
      <State label="Card"><Stat variant="card" label="Seats used" value="148" meta="of 200" progress={{ value: 148, max: 200, label: "52 seats left" }} className="w-full" /></State>
      <State label="Inline delta · small"><Stat label="Open tickets" value="23" delta={-4} deltaUnit="" baseline="today" lowerIsBetter layout="inline" size="sm" /></State>
    </StateGrid>
  );
}

export function ProgressAllStates() {
  return (
    <StateGrid min={200}>
      <State label="Empty"><Progress value={0} aria-label="Import" className="w-full" /></State>
      <State label="In progress"><Progress value={62} aria-label="Import" className="w-full" /></State>
      <State label="Complete"><Progress value={100} tone="success" aria-label="Import" className="w-full" /></State>
      <State label="Warning"><Progress value={86} tone="warning" aria-label="Storage" className="w-full" /></State>
      <State label="Danger"><Progress value={97} tone="danger" aria-label="Storage" className="w-full" /></State>
      <State label="Indeterminate"><Progress aria-label="Syncing" className="w-full" /></State>
      <State label="Ring"><ProgressRing value={72} label="Profile" /><ProgressRing value={40} size={44} tone="data" label="Quota" /></State>
      <State label="Segment bar"><SegmentBar value={74} tone="auto" label="Health" className="w-full" /></State>
    </StateGrid>
  );
}

export function SparklineAllStates() {
  const v = customers[0].trend;
  return (
    <StateGrid min={160}>
      <State label="Bars"><Sparkline values={v} label="Weekly active users" /></State>
      <State label="Line"><Sparkline values={v} variant="line" label="Weekly active users" /></State>
      <State label="Danger"><Sparkline values={[...v].reverse()} tone="danger" label="Falling usage" /></State>
      <State label="Neutral"><Sparkline values={v} variant="line" tone="neutral" /></State>
      <State label="Flat"><Sparkline values={[5, 5, 5, 5, 5, 5, 5, 5]} label="No change" /></State>
    </StateGrid>
  );
}

export function ListAllStates() {
  const p = people[0];
  return (
    <StateGrid min={240}>
      <State label="Static"><List className="w-full"><ListItem leading={<Avatar name={p.name} />} title={p.name} description={p.email} meta={p.role} /></List></State>
      <State label="Interactive · hover"><List className="w-full"><div data-force="hover"><ListItem title={p.team} description={p.name} onClick={() => {}} /></div></List></State>
      <State label="Interactive · focus"><List className="w-full"><div data-force="focus"><ListItem title={p.team} description={p.name} onClick={() => {}} /></div></List></State>
      <State label="Selected"><List className="w-full"><ListItem title={p.team} description={p.name} onClick={() => {}} selected /></List></State>
      <State label="Empty"><EmptyState size="sm" icon={<IconInbox />} title="No members yet" /></State>
    </StateGrid>
  );
}

export function TimelineAllStates() {
  return (
    <StateGrid min={280}>
      <State label="Tones"><Timeline className="w-full" events={[
        { id: "1", title: "Invoice sent", time: "14:22", tone: "info" },
        { id: "2", title: "Payment failed", time: "09:00", tone: "danger" },
        { id: "3", title: "Contract renewed", time: "Nov 1", tone: "success" },
      ]} /></State>
      <State label="With body and avatar"><Timeline className="w-full" events={[
        { id: "1", marker: <Avatar name="Tanvir Hasan" size="sm" />, title: <><b>Tanvir</b> changed plan</>, body: "Scale → Enterprise, effective Dec 1.", time: "Yesterday" },
      ]} /></State>
      <State label="Empty"><EmptyState size="sm" icon={<IconList />} title="No activity yet" /></State>
    </StateGrid>
  );
}

export function TooltipAllStates() {
  return (
    <StateGrid min={200}>
      <State label="Trigger · default"><IconButton label="Copy" variant="secondary"><IconCopy /></IconButton></State>
      <State label="Open"><div className="pt-10"><Tooltip content="Copy account ID" shortcut="⌘C" open><IconButton label="Copy" variant="secondary"><IconCopy /></IconButton></Tooltip></div></State>
      <State label="Open · bottom"><div className="pb-10"><Tooltip content="Below" side="bottom" open><Button size="sm">Bottom</Button></Tooltip></div></State>
      <State label="Popover · open" wide>
        <div className="h-44 w-full">
          <Popover open>
            <PopoverTrigger asChild><Button size="sm" leading={<IconPlus />}>Add seats</Button></PopoverTrigger>
            <PopoverContent align="start" className="w-64" onOpenAutoFocus={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2"><span className="font-medium">Add seats</span><span className="text-caption text-subtle">Prorated on the next invoice.</span></div>
            </PopoverContent>
          </Popover>
        </div>
      </State>
    </StateGrid>
  );
}

export function CodeBlockAllStates() {
  return (
    <StateGrid min={300}>
      <State label="Inline code"><span className="text-small text-soft">Use <Code>sk_live_…8f2k</Code> on the server.</span></State>
      <State label="Block"><CodeBlock className="w-full" code={`{ "type": "payment.failed" }`} /></State>
      <State label="With title"><CodeBlock className="w-full" title="Webhook" code={`curl -X POST /v1/hooks`} /></State>
      <State label="Copy button · hover"><div data-force="hover" className="w-full"><CodeBlock className="w-full" code="npm i @fernhill/sdk" /></div></State>
    </StateGrid>
  );
}

export function EmptyStateAllStates() {
  return (
    <StateGrid min={280}>
      <State label="First use (with action)"><div className="w-full rounded-lg shadow-card"><EmptyState icon={<IconUsers />} title="Invite your team" description="Members can view customers and send invoices." action={<Button size="sm" variant="primary">Invite members</Button>} /></div></State>
      <State label="Filtered (no results)"><div className="w-full rounded-lg shadow-card"><EmptyState icon={<IconList />} size="sm" title="No customers match" description="Try a different search or clear filters." action={<Button size="sm">Clear filters</Button>} /></div></State>
      <State label="All done"><div className="w-full rounded-lg shadow-card"><EmptyState icon={<IconInbox />} size="sm" title="No overdue invoices" description="Everything is paid or within terms." /></div></State>
    </StateGrid>
  );
}

export function SkeletonAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Text"><SkeletonText lines={3} className="w-full" /></State>
      <State label="Avatar row"><div className="flex w-full items-center gap-3"><Skeleton className="size-8 rounded-full" /><div className="flex flex-1 flex-col gap-2"><Skeleton className="h-3 w-2/5" /><Skeleton className="h-3 w-3/5" /></div></div></State>
      <State label="Stat"><div className="flex flex-col gap-2"><Skeleton className="h-2.5 w-20" /><Skeleton className="h-7 w-32" /></div></State>
    </StateGrid>
  );
}

export function TableAllStates() {
  const rows = customers.slice(0, 2);
  return (
    <StateGrid min={420}>
      <State label="Rows · default, hover, selected, focus" wide>
        <TableContainer className="w-full">
          <Table>
            <TableHeader><tr><TableHead>Customer</TableHead><TableHead>Status</TableHead><TableHead align="right">MRR</TableHead></tr></TableHeader>
            <TableBody>
              <TableRow interactive className="[&>td]:h-10"><TableCell>Default</TableCell><TableCell><StatusPill status="success">Paid</StatusPill></TableCell><TableCell align="right">$29,890</TableCell></TableRow>
              <TableRow interactive className="[&>td]:h-10" data-force="hover"><TableCell>Hover</TableCell><TableCell><StatusPill status="warning">Due</StatusPill></TableCell><TableCell align="right">$21,600</TableCell></TableRow>
              <TableRow interactive className="[&>td]:h-10" selected><TableCell>Selected</TableCell><TableCell><StatusPill status="info">Trial</StatusPill></TableCell><TableCell align="right">$18,240</TableCell></TableRow>
              <TableRow interactive className="[&>td]:h-10" data-force="focus" tabIndex={-1}><TableCell>Focus</TableCell><TableCell><StatusPill status="danger">Overdue</StatusPill></TableCell><TableCell align="right">$11,340</TableCell></TableRow>
            </TableBody>
            <TableFooter><tr><TableCell>Total</TableCell><TableCell /><TableCell align="right">$81,070</TableCell></tr></TableFooter>
          </Table>
        </TableContainer>
      </State>
      <State label="Loading"><DataTable className="w-full" data={rows} getRowId={(c) => c.id} loading loadingRows={2} columns={[{ id: "name", header: "Customer", cell: (c) => c.name }, { id: "mrr", header: "MRR", align: "right", cell: (c) => c.mrr }]} /></State>
      <State label="Empty"><DataTable className="w-full" data={[]} getRowId={(c: (typeof rows)[number]) => c.id} columns={[{ id: "name", header: "Customer", cell: (c) => c.name }, { id: "mrr", header: "MRR", align: "right", cell: (c) => c.mrr }]} /></State>
    </StateGrid>
  );
}

/* ===== Feedback ===== */

export function AlertAllStates() {
  return (
    <StateGrid min={320}>
      <State label="Info"><Alert tone="info" title="SSO is available">Connect Okta or Google Workspace.</Alert></State>
      <State label="Success"><Alert tone="success">Payment method updated.</Alert></State>
      <State label="Warning with action"><Alert tone="warning" title="3 invoices are overdue" action={<Button size="sm">Review</Button>}>Reminders went out on Nov 1.</Alert></State>
      <State label="Danger, dismissible"><Alert tone="danger" title="Webhook failing" onDismiss={() => {}}>The last 12 deliveries returned 503.</Alert></State>
      <State label="Neutral"><Alert tone="neutral">Exports include only visible columns.</Alert></State>
    </StateGrid>
  );
}

export function BannerAllStates() {
  return (
    <StateGrid min={420}>
      <State label="Info"><div className="w-full overflow-hidden rounded-lg shadow-card"><Banner>Maintenance Sunday 02:00–02:30 UTC.</Banner></div></State>
      <State label="Warning with action"><div className="w-full overflow-hidden rounded-lg shadow-card"><Banner tone="warning" action={<Button size="xs">Update card</Button>}>Your card expires this month.</Banner></div></State>
      <State label="Danger, dismissible"><div className="w-full overflow-hidden rounded-lg shadow-card"><Banner tone="danger" onDismiss={() => {}}>Workspace is read-only while we restore data.</Banner></div></State>
      <State label="Success"><div className="w-full overflow-hidden rounded-lg shadow-card"><Banner tone="success">Data restored. Editing is back on.</Banner></div></State>
    </StateGrid>
  );
}

export function ToastAllStates() {
  const toast = useToast();
  return (
    <StateGrid>
      <State label="Default"><Button size="sm" onClick={() => toast({ title: "Invoice sent", description: "INV-2063 to Tidewater Energy" })}>Show</Button></State>
      <State label="Success with undo"><Button size="sm" onClick={() => toast({ title: "Customer archived", tone: "success", action: { label: "Undo", onClick: () => {} } })}>Show</Button></State>
      <State label="Warning"><Button size="sm" onClick={() => toast({ title: "Export is large", description: "It may take a few minutes.", tone: "warning" })}>Show</Button></State>
      <State label="Danger"><Button size="sm" onClick={() => toast({ title: "Couldn't sync with Stripe", description: "We'll retry in 5 minutes.", tone: "danger" })}>Show</Button></State>
    </StateGrid>
  );
}

export function DialogAllStates() {
  return (
    <StateGrid>
      <State label="Form dialog">
        <Dialog>
          <DialogTrigger asChild><Button size="sm" variant="primary">Invite member</Button></DialogTrigger>
          <DialogContent title="Invite member" description="They'll get an email to join." footer={<Button variant="primary">Send invite</Button>}>
            <FormField label="Email" required><Input type="email" placeholder="name@company.com" /></FormField>
          </DialogContent>
        </Dialog>
      </State>
      <State label="Confirm"><ConfirmDialog trigger={<Button size="sm">Send reminders</Button>} title="Send 12 reminders?" description="Each overdue customer gets one email." confirmLabel="Send reminders" onConfirm={() => {}} /></State>
      <State label="Destructive"><ConfirmDialog trigger={<Button size="sm" variant="danger">Delete 3</Button>} tone="danger" title="Delete 3 customers?" description="This can't be undone." confirmLabel="Delete customers" onConfirm={() => new Promise((r) => setTimeout(r, 900))} /></State>
      <State label="Type to confirm"><ConfirmDialog trigger={<Button size="sm">Delete workspace</Button>} tone="danger" title="Delete workspace?" description="Everything is removed permanently." confirmText="fernhill" confirmLabel="Delete workspace" onConfirm={() => {}} /></State>
    </StateGrid>
  );
}

export function SpinnerAllStates() {
  return (
    <StateGrid min={150}>
      <State label="Sizes"><Spinner size={12} /><Spinner size={16} /><Spinner size={20} /><Spinner size={24} /></State>
      <State label="With text"><span className="flex items-center gap-2 text-small text-subtle"><Spinner label="" /> Syncing…</span></State>
      <State label="In a button"><Button size="sm" loading>Saving</Button></State>
    </StateGrid>
  );
}

export function StatusPagesAllStates() {
  return (
    <StateGrid min={280}>
      <State label="Custom status page"><div className="w-full rounded-lg shadow-card"><StatusPage className="min-h-0 py-8" code="410" title="Invoice link expired" description="Ask the sender for a new link." actions={<Button size="sm">Go to overview</Button>} /></div></State>
      <State label="Loading"><div className="flex w-full items-center justify-center gap-2 rounded-lg py-10 text-small text-subtle shadow-card"><Spinner label="" /> Loading workspace…</div></State>
    </StateGrid>
  );
}

/* ===== Charts ===== */

export function ChartsAllStates() {
  return (
    <StateGrid min={300}>
      <State label="Line · one series"><div className="w-full"><LineChart label="Weekly revenue" labels={["W1", "W2", "W3", "W4", "W5", "W6"]} series={[{ name: "Revenue", values: [82, 85, 84, 90, 93, 97] }]} height={140} /></div></State>
      <State label="Bar · with comparison"><div className="w-full"><BarChart label="Invoices per day" labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} values={[18, 24, 21, 30, 27]} compare={[15, 20, 22, 25, 24]} height={140} /></div></State>
      <State label="Donut"><DonutChart label="MRR by plan" data={[{ name: "Enterprise", value: 51 }, { name: "Scale", value: 26 }, { name: "Growth", value: 17 }, { name: "Starter", value: 6 }]} centerLabel="MRR" centerValue="$102k" size={120} /></State>
      <State label="No data"><div className="w-full rounded-lg shadow-card"><EmptyState size="sm" icon={<IconList />} title="No revenue yet" description="The chart fills in after the first paid invoice." /></div></State>
    </StateGrid>
  );
}

/* ===== More ===== */

export function AccordionAllStates() {
  const item = (v: string, extra: { disabled?: boolean } = {}) => (
    <AccordionItem value={v} title="Billing" description="Plan, seats and invoices" {...extra}>Invoices are sent on the first business day of each month.</AccordionItem>
  );
  return (
    <StateGrid min={300}>
      <State label="Collapsed"><Accordion type="single" collapsible className="w-full">{item("a")}</Accordion></State>
      <State label="Hover"><div data-force="hover" className="w-full"><Accordion type="single" collapsible className="w-full">{item("a")}</Accordion></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><Accordion type="single" collapsible className="w-full">{item("a")}</Accordion></div></State>
      <State label="Expanded"><Accordion type="single" collapsible defaultValue="a" className="w-full">{item("a")}</Accordion></State>
      <State label="Disabled"><Accordion type="single" collapsible className="w-full">{item("a", { disabled: true })}</Accordion></State>
      <State label="Collapsible"><Collapsible trigger="Advanced options" defaultOpen className="w-full"><span className="text-small text-soft">Webhook URL, retry attempts…</span></Collapsible></State>
    </StateGrid>
  );
}

export function ToggleAllStates() {
  return (
    <StateGrid min={170}>
      <State label="Off"><Toggle aria-label="Show archived">Show archived</Toggle></State>
      <State label="Hover"><Toggle aria-label="Show archived" data-force="hover">Show archived</Toggle></State>
      <State label="Focus"><Toggle aria-label="Show archived" data-force="focus">Show archived</Toggle></State>
      <State label="On"><Toggle aria-label="Pinned" defaultPressed>Pinned</Toggle></State>
      <State label="Disabled"><Toggle disabled>Disabled</Toggle></State>
      <State label="Group · single"><ToggleGroup type="single" defaultValue="list" aria-label="View"><ToggleGroupItem value="list" aria-label="List"><IconList /></ToggleGroupItem><ToggleGroupItem value="grid" aria-label="Grid"><IconSettings /></ToggleGroupItem></ToggleGroup></State>
      <State label="Group · multiple"><ToggleGroup type="multiple" defaultValue={["paid", "due"]} aria-label="Show"><ToggleGroupItem value="paid" className="px-2.5 text-caption">Paid</ToggleGroupItem><ToggleGroupItem value="due" className="px-2.5 text-caption">Due</ToggleGroupItem><ToggleGroupItem value="void" className="px-2.5 text-caption">Void</ToggleGroupItem></ToggleGroup></State>
    </StateGrid>
  );
}

const treeData: TreeNode[] = [
  { id: "ops", label: "Operations", meta: "24", children: [{ id: "bd", label: "Dhaka", meta: "14" }, { id: "sg", label: "Singapore", meta: "10" }] },
  { id: "fin", label: "Finance", meta: "6", children: [{ id: "ap", label: "Payables", meta: "2", disabled: true }] },
  { id: "eng", label: "Engineering", meta: "18", loading: true },
];

export function TreeAllStates() {
  return (
    <StateGrid min={240}>
      <State label="Expanded · selected · disabled · loading"><Tree aria-label="Teams" data={treeData} selected="bd" onSelect={() => {}} defaultExpanded={["ops", "fin", "eng"]} className="w-full" /></State>
      <State label="Hover"><div data-force="hover" className="w-full"><Tree aria-label="Teams" data={treeData.slice(1, 2)} onSelect={() => {}} /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><Tree aria-label="Teams" data={treeData.slice(1, 2)} onSelect={() => {}} /></div></State>
      <State label="Checkable"><Tree aria-label="Scopes" checkable showIcons={false} data={treeData.slice(0, 1)} defaultExpanded={["ops"]} checked={new Set(["bd"])} onCheckedChange={() => {}} className="w-full" /></State>
    </StateGrid>
  );
}

const perms = [{ key: "view", label: "View customers" }, { key: "edit", label: "Edit customers" }, { key: "refund", label: "Refund payments" }, { key: "keys", label: "Manage API keys", disabled: true }];

export function TransferAllStates() {
  return (
    <StateGrid min={520}>
      <State label="Default"><Transfer className="w-full" items={perms} value={["view"]} onChange={() => {}} titles={["Available", "Editor role"]} height={150} /></State>
      <State label="Empty target"><Transfer className="w-full" items={perms} value={[]} onChange={() => {}} titles={["Available", "Viewer role"]} height={150} /></State>
    </StateGrid>
  );
}

const places = [{ value: "apac", label: "Asia Pacific", children: [{ value: "bd", label: "Bangladesh", children: [{ value: "dhaka", label: "Dhaka" }] }] }];

export function CascaderAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Empty"><Cascader value={[]} onChange={() => {}} options={places} placeholder="Choose warehouse" /></State>
      <State label="Hover"><div data-force="hover" className="w-full"><Cascader value={[]} onChange={() => {}} options={places} placeholder="Choose warehouse" /></div></State>
      <State label="Focus"><div data-force="focus" className="w-full"><Cascader value={[]} onChange={() => {}} options={places} placeholder="Choose warehouse" /></div></State>
      <State label="Selected"><Cascader value={["apac", "bd", "dhaka"]} onChange={() => {}} options={places} /></State>
      <State label="Error"><Cascader value={[]} onChange={() => {}} options={places} placeholder="Choose warehouse" invalid /></State>
      <State label="Disabled"><Cascader value={["apac", "bd", "dhaka"]} onChange={() => {}} options={places} disabled /></State>
    </StateGrid>
  );
}

export function ColorPickerAllStates() {
  return (
    <StateGrid min={160}>
      <State label="Default"><ColorPicker value="#3ec8b4" onChange={() => {}} /></State>
      <State label="Hover"><div data-force="hover"><ColorPicker value="#3ec8b4" onChange={() => {}} /></div></State>
      <State label="Focus"><div data-force="focus"><ColorPicker value="#3ec8b4" onChange={() => {}} /></div></State>
      <State label="Disabled"><ColorPicker value="#6f727b" onChange={() => {}} disabled /></State>
    </StateGrid>
  );
}

export function RatingAllStates() {
  return (
    <StateGrid min={160}>
      <State label="Empty"><Rating value={0} onChange={() => {}} label="Support quality" /></State>
      <State label="Hover"><div data-force="hover"><Rating value={2} onChange={() => {}} label="Support quality" /></div></State>
      <State label="Rated"><Rating value={4} onChange={() => {}} label="Support quality" /></State>
      <State label="Read-only"><Rating value={3} readOnly size={14} label="Average rating" /></State>
    </StateGrid>
  );
}

export function OtpInputAllStates() {
  return (
    <StateGrid min={280}>
      <State label="Empty"><OtpInput value="" onChange={() => {}} /></State>
      <State label="Focus"><div data-force="focus"><OtpInput value="24" onChange={() => {}} /></div></State>
      <State label="Complete"><OtpInput value="246810" onChange={() => {}} /></State>
      <State label="Error"><OtpInput value="246811" onChange={() => {}} invalid /></State>
      <State label="Disabled"><OtpInput value="1234" onChange={() => {}} length={4} disabled aria-label="Disabled code" /></State>
    </StateGrid>
  );
}

export function PopconfirmAllStates() {
  return (
    <StateGrid>
      <State label="Default"><Popconfirm title="Remove this tag?" description="It stays on past invoices." confirmLabel="Remove" onConfirm={() => {}}><Button size="sm">Remove tag</Button></Popconfirm></State>
      <State label="Danger"><Popconfirm tone="danger" title="Revoke this key?" description="Requests using it fail immediately." confirmLabel="Revoke" onConfirm={() => new Promise((r) => setTimeout(r, 800))}><Button size="sm" variant="danger-ghost">Revoke key</Button></Popconfirm></State>
    </StateGrid>
  );
}

export function CoachmarkAllStates() {
  return (
    <StateGrid min={160}>
      <State label="Step 1 of 4"><ProgressDots count={4} current={0} /></State>
      <State label="Step 3 of 4"><ProgressDots count={4} current={2} /></State>
      <State label="Last step"><ProgressDots count={4} current={3} /></State>
    </StateGrid>
  );
}

export function BadgeAllStates() {
  const bell = <IconButton label="Notifications" variant="secondary"><IconBell /></IconButton>;
  return (
    <StateGrid min={140}>
      <State label="Count"><Badge count={3}>{bell}</Badge></State>
      <State label="Dot"><Badge dot>{bell}</Badge></State>
      <State label="Over max"><Badge count={120}>{bell}</Badge></State>
      <State label="Neutral"><Badge count={8} tone="neutral">{bell}</Badge></State>
      <State label="Data"><Badge dot tone="data"><Avatar name="Nadia Karim" size="lg" /></Badge></State>
      <State label="Zero (hidden)"><Badge count={0}>{bell}</Badge></State>
    </StateGrid>
  );
}

export function InlineMessageAllStates() {
  return (
    <StateGrid min={220}>
      <State label="Info"><InlineMessage tone="info" detail="Synced every 15 minutes.">Last synced 4 min ago</InlineMessage></State>
      <State label="Success"><InlineMessage tone="success">Domain verified</InlineMessage></State>
      <State label="Warning"><InlineMessage tone="warning">Card expires this month</InlineMessage></State>
      <State label="Danger"><InlineMessage tone="danger">Webhook failing</InlineMessage></State>
    </StateGrid>
  );
}

export function CopyButtonAllStates() {
  return (
    <StateGrid min={150}>
      <State label="Default"><CopyButton value="cus_01HZ8K2M4N" label="Copy ID" /></State>
      <State label="Hover"><div data-force="hover"><CopyButton value="cus_01HZ8K2M4N" label="Copy ID" /></div></State>
      <State label="Focus"><div data-force="focus"><CopyButton value="cus_01HZ8K2M4N" label="Copy ID" /></div></State>
      <State label="Extra small"><Inline gap={2}><Code>whsec_3f9a</Code><CopyButton value="whsec_3f9a" label="Copy secret" size="xs" /></Inline></State>
    </StateGrid>
  );
}

const img = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="#1e2023"/><rect x="24" y="28" width="140" height="10" rx="3" fill="#373a40"/><rect x="24" y="52" width="220" height="8" rx="3" fill="#2c2e33"/></svg>')}`;

export function ImageAllStates() {
  return (
    <StateGrid min={140}>
      <State label="Default"><ImagePreview src={img} alt="Receipt for INV-2064" /></State>
      <State label="Hover"><div data-force="hover"><ImagePreview src={img} alt="Receipt for INV-2064" /></div></State>
      <State label="Focus"><div data-force="focus"><ImagePreview src={img} alt="Receipt for INV-2064" /></div></State>
      <State label="Loading"><Skeleton className="h-[72px] w-24 rounded-md" /></State>
    </StateGrid>
  );
}

export function StackAllStates() {
  return (
    <StateGrid min={200}>
      <State label="Stack · gap 2"><Stack gap={2}>{["One", "Two", "Three"].map((t) => <Tag key={t}>{t}</Tag>)}</Stack></State>
      <State label="Inline · gap 1.5 (wraps)"><Inline gap={1.5}>{["Logistics", "Annual", "SSO", "Healthcare"].map((t) => <Tag key={t}>{t}</Tag>)}</Inline></State>
    </StateGrid>
  );
}

export function AnchorAllStates() {
  return (
    <StateGrid min={180}>
      <State label="Default"><Anchor className="w-40" items={[{ id: "s-overview", label: "Overview" }, { id: "s-billing", label: "Billing" }, { id: "s-members", label: "Members", level: 2 }]} /></State>
      <State label="Hover"><div data-force="hover"><Anchor className="w-40" items={[{ id: "h-billing", label: "Billing" }]} /></div></State>
      <State label="Focus"><div data-force="focus"><Anchor className="w-40" items={[{ id: "f-billing", label: "Billing" }]} /></div></State>
    </StateGrid>
  );
}

/* ===== Registry ===== */

const S = (id: string, render: DemoSpec["render"], description?: string): DemoSpec => ({
  id, title: "All states", description: description ?? "Every state this component has. Show code to copy each one.", render, full: true, file: "states",
});

/** Slug → its "All states" demo. Every component page gets one. */
export const statesBySlug: Record<string, DemoSpec> = {
  button: S("ButtonAllStates", ButtonAllStates), "icon-button": S("IconButtonAllStates", IconButtonAllStates), text: S("TextAllStates", TextAllStates),
  kbd: S("KbdAllStates", KbdAllStates), divider: S("DividerAllStates", DividerAllStates),
  "app-shell": S("AppShellAllStates", AppShellAllStates), header: S("HeaderAllStates", HeaderAllStates), grid: S("GridAllStates", GridAllStates),
  "split-pane": S("SplitPaneAllStates", SplitPaneAllStates), sheet: S("SheetAllStates", SheetAllStates, "Open each to see it. Sheets are overlays, so they open on demand."),
  tabs: S("TabsAllStates", TabsAllStates), breadcrumb: S("BreadcrumbAllStates", BreadcrumbAllStates), "dropdown-menu": S("DropdownMenuAllStates", DropdownMenuAllStates),
  "filter-menu": S("FilterMenuAllStates", FilterMenuAllStates), "command-palette": S("CommandPaletteAllStates", CommandPaletteAllStates),
  pagination: S("PaginationAllStates", PaginationAllStates), steps: S("StepsAllStates", StepsAllStates),
  input: S("InputAllStates", InputAllStates), "form-field": S("FormFieldAllStates", FormFieldAllStates), select: S("SelectAllStates", SelectAllStates),
  combobox: S("ComboboxAllStates", ComboboxAllStates), checkbox: S("CheckboxAllStates", CheckboxAllStates), radio: S("RadioAllStates", RadioAllStates),
  switch: S("SwitchAllStates", SwitchAllStates), slider: S("SliderAllStates", SliderAllStates), "date-picker": S("DatePickerAllStates", DatePickerAllStates),
  "file-upload": S("FileUploadAllStates", FileUploadAllStates), "inline-edit": S("InlineEditAllStates", InlineEditAllStates),
  avatar: S("AvatarAllStates", AvatarAllStates), tag: S("TagAllStates", TagAllStates), "status-pill": S("StatusPillAllStates", StatusPillAllStates),
  "count-badge": S("CountBadgeAllStates", CountBadgeAllStates), "description-list": S("DescriptionListAllStates", DescriptionListAllStates),
  stat: S("StatAllStates", StatAllStates), progress: S("ProgressAllStates", ProgressAllStates), sparkline: S("SparklineAllStates", SparklineAllStates),
  list: S("ListAllStates", ListAllStates), timeline: S("TimelineAllStates", TimelineAllStates), tooltip: S("TooltipAllStates", TooltipAllStates),
  "code-block": S("CodeBlockAllStates", CodeBlockAllStates), "empty-state": S("EmptyStateAllStates", EmptyStateAllStates), skeleton: S("SkeletonAllStates", SkeletonAllStates),
  table: S("TableAllStates", TableAllStates),
  alert: S("AlertAllStates", AlertAllStates), banner: S("BannerAllStates", BannerAllStates), toast: S("ToastAllStates", ToastAllStates, "Toasts are transient, so each one opens on demand."),
  dialog: S("DialogAllStates", DialogAllStates, "Dialogs are overlays, so each one opens on demand."), spinner: S("SpinnerAllStates", SpinnerAllStates),
  "status-pages": S("StatusPagesAllStates", StatusPagesAllStates), charts: S("ChartsAllStates", ChartsAllStates),
  accordion: S("AccordionAllStates", AccordionAllStates), toggle: S("ToggleAllStates", ToggleAllStates), tree: S("TreeAllStates", TreeAllStates),
  transfer: S("TransferAllStates", TransferAllStates), cascader: S("CascaderAllStates", CascaderAllStates), "color-picker": S("ColorPickerAllStates", ColorPickerAllStates),
  rating: S("RatingAllStates", RatingAllStates), "otp-input": S("OtpInputAllStates", OtpInputAllStates), popconfirm: S("PopconfirmAllStates", PopconfirmAllStates),
  coachmark: S("CoachmarkAllStates", CoachmarkAllStates), badge: S("BadgeAllStates", BadgeAllStates), "inline-message": S("InlineMessageAllStates", InlineMessageAllStates),
  "copy-button": S("CopyButtonAllStates", CopyButtonAllStates), image: S("ImageAllStates", ImageAllStates), stack: S("StackAllStates", StackAllStates),
  anchor: S("AnchorAllStates", AnchorAllStates),
};
