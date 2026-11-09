import { useState } from "react";
import {
  Avatar, Breadcrumbs, Button, FilterMenu, IconBell, IconBook, IconChartBar, IconCode, IconCompass, IconHome, IconInbox, IconSearch, IconUser, IconUsers,
  IconWebhook, IconWorkflow, IconZap, MegaMenu, MegaMenuFeaturedCard, MobileNav, Outline, Pagination, SearchInput, Stepper, TabList, Tabs, TabsContent, TabsList, TabsTrigger,
  Text, TopNav, TopNavItem, TopNavMenu, IconButton,
} from "@keel/components";
import { State, StateGrid } from "../docs/kit";


/* ---------------- TopNav ---------------- */
export function TopNavDemo() {
  return (
    <div style={{ width: "100%", minHeight: 320, borderRadius: 14, boxShadow: "0 0 0 1px rgba(127,127,127,.2)", overflow: "visible" }}>
      <TopNav heading={<><span style={{ display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: 8, background: "#17171b", color: "#fff", fontSize: 12 }}>K</span>Keel</>}
        end={<><SearchInput size="sm" placeholder="Search" style={{ width: 180 }} /><IconButton label="Notifications" size="sm"><IconBell /></IconButton><Avatar name="Ana Lima" size="md" /></>}>
        <TopNavItem href="#" active>Dashboard</TopNavItem>
        <MegaMenu label="Product" columns={[
          { title: "Billing", links: [{ title: "Invoices", description: "Send and track invoices", icon: <IconInbox /> }, { title: "Subscriptions", description: "Plans, trials and seats", icon: <IconZap /> }] },
          { title: "Developers", links: [{ title: "API", description: "REST and webhooks", icon: <IconCode /> }, { title: "Integrations", description: "Stripe, HubSpot, Slack", icon: <IconWorkflow /> }] },
        ]} featured={<MegaMenuFeaturedCard eyebrow="New" title="Keel v2" description="Tactile components built on StyleX." href="#" />} />
        <TopNavMenu label="Resources" links={[{ title: "Docs", icon: <IconBook /> }, { title: "Guides", icon: <IconCompass /> }, { title: "Webhooks", icon: <IconWebhook /> }]} />
        <TopNavItem href="#">Pricing</TopNavItem>
      </TopNav>
      <div style={{ padding: 20 }}><Text tone="muted">Hover Product or Resources.</Text></div>
    </div>
  );
}

/* ---------------- MobileNav ---------------- */
export function MobileNavDemo() {
  const [v, setV] = useState("home");
  return (
    <div style={{ position: "relative", width: 360, height: 260, borderRadius: 28, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.25)", transform: "translateZ(0)" }}>
      <div style={{ padding: 20 }}><Text variant="title">{v[0].toUpperCase() + v.slice(1)}</Text><Text tone="muted">Bottom tab bar for phones (hidden from 1024px).</Text></div>
      <MobileNav value={v} onValueChange={setV} items={[{ value: "home", label: "Home", icon: <IconHome /> }, { value: "search", label: "Search", icon: <IconSearch /> }, { value: "inbox", label: "Inbox", icon: <IconInbox />, badge: 3 }, { value: "me", label: "Me", icon: <IconUser /> }]} />
    </div>
  );
}

/* ---------------- Breadcrumbs ---------------- */
export function BreadcrumbsDemo() {
  return (
    <StateGrid min={320}>
      <State label="Default" wide><Breadcrumbs items={[{ label: "Customers", href: "#" }, { label: "Acme Inc.", href: "#" }, { label: "Invoices" }]} /></State>
      <State label="Collapsed (max 4)" wide><Breadcrumbs max={4} items={[{ label: "Home", href: "#" }, { label: "Workspace", onClick: () => {} }, { label: "Billing", onClick: () => {} }, { label: "Invoices", href: "#" }, { label: "2026", href: "#" }, { label: "INV-1042" }]} /></State>
      <State label="Slash" wide><Breadcrumbs separator="slash" items={[{ label: "acme", href: "#" }, { label: "billing-api", href: "#" }, { label: "main" }]} /></State>
    </StateGrid>
  );
}

/* ---------------- Tabs ---------------- */
export function TabsDemo() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <TabList items={[
        { value: "overview", label: "Overview", content: <Text tone="muted">Overview content</Text> },
        { value: "invoices", label: "Invoices", count: 24, content: <Text tone="muted">24 invoices</Text> },
        { value: "people", label: "People", icon: <IconUsers />, content: <Text tone="muted">Team members</Text> },
        { value: "audit", label: "Audit log", disabled: true },
      ]} />
      <Tabs defaultValue="month">
        <TabsList variant="pills">
          <TabsTrigger value="week">Week</TabsTrigger><TabsTrigger value="month">Month</TabsTrigger><TabsTrigger value="year" icon={<IconChartBar />}>Year</TabsTrigger>
        </TabsList>
        <TabsContent value="week"><Text tone="muted">Weekly view</Text></TabsContent>
        <TabsContent value="month"><Text tone="muted">Monthly view</Text></TabsContent>
        <TabsContent value="year"><Text tone="muted">Yearly view</Text></TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Pagination ---------------- */
export function PaginationDemo() {
  const [p, setP] = useState(4);
  const [size, setSize] = useState(25);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <Pagination page={p} pageCount={Math.ceil(340 / size)} onPageChange={setP} total={340} pageSize={size} pageSizeOptions={[10, 25, 50]} onPageSizeChange={(n) => { setSize(n); setP(1); }} />
      <Pagination page={p} pageCount={14} onPageChange={setP} variant="simple" />
      <Pagination page={p} pageCount={40} onPageChange={setP} firstLast siblings={2} />
    </div>
  );
}

/* ---------------- Stepper ---------------- */
export function StepperDemo() {
  const [cur, setCur] = useState(1);
  const steps = [{ title: "Account", description: "Name and email" }, { title: "Company", description: "Billing details" }, { title: "Team", description: "Invite people", optional: true }, { title: "Done" }];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28 }}>
      <Stepper steps={steps} current={cur} onStepClick={setCur} />
      <div style={{ display: "flex", gap: 8 }}><Button size="sm" onClick={() => setCur((c) => Math.max(0, c - 1))}>Back</Button><Button size="sm" variant="primary" onClick={() => setCur((c) => Math.min(steps.length, c + 1))}>Next</Button></div>
      <div style={{ maxWidth: 320 }}><Stepper orientation="vertical" steps={[{ title: "Upload CSV", description: "customers.csv" }, { title: "Map columns", error: true, description: "2 columns don't match" }, { title: "Import" }]} current={1} /></div>
    </div>
  );
}

/* ---------------- Outline ---------------- */
export function OutlineDemo() {
  return (
    <div style={{ width: 220 }}>
      <Outline items={[{ id: "button-variants", label: "Variants" }, { id: "button-sizes", label: "Sizes", level: 2 }, { id: "button-states", label: "States", level: 2 }, { id: "api", label: "API" }, { id: "code", label: "Code" }]} />
    </div>
  );
}

/* ---------------- FilterMenu ---------------- */
export function FilterMenuDemo() {
  const [status, setStatus] = useState<string[]>(["overdue"]);
  const [plan, setPlan] = useState<string[]>([]);
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <FilterMenu label="Status" value={status} onValueChange={setStatus} options={[{ value: "paid", label: "Paid", count: 210 }, { value: "overdue", label: "Overdue", count: 12 }, { value: "draft", label: "Draft", count: 4 }]} />
      <FilterMenu label="Plan" value={plan} onValueChange={setPlan} searchable options={["Starter", "Pro", "Scale", "Enterprise", "Legacy"].map((p) => ({ value: p.toLowerCase(), label: p }))} />
    </div>
  );
}
