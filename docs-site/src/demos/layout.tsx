import { useState } from "react";
import {
  AppShell, AspectRatio, Avatar, Breadcrumbs, Button, Card, Center, Divider, Grid, Header, HStack, IconBell, IconChartBar, IconHome, IconInbox, IconPlus, IconSettings,
  IconUsers, Inline, Layout, List, ListItem, Page, PageHeading, PageToolbar, ResizeHandle, ScrollableArea, SearchInput, Section, Sidebar, SidebarBrand, SidebarContent,
  SidebarFooter, SidebarItem, SidebarSection, SidebarTrigger, SplitPane, Stack, Stat, StatGroup, StatusPill, Tag, Text, VStack, IconButton, Sticky,
} from "@keel/components";

const box = (label: string) => <div style={{ padding: "10px 14px", borderRadius: 10, background: "color-mix(in srgb, currentColor 8%, transparent)", fontSize: 12 }}>{label}</div>;

/* ---------------- AppShell ---------------- */
export function AppShellDemo() {
  const [active, setActive] = useState("overview");
  const nav = [{ id: "overview", label: "Overview", icon: <IconHome /> }, { id: "customers", label: "Customers", icon: <IconUsers />, count: 128 }, { id: "inbox", label: "Inbox", icon: <IconInbox />, count: 3 }, { id: "reports", label: "Reports", icon: <IconChartBar /> }];
  return (
    <div style={{ height: 560, width: "100%", overflow: "hidden", isolation: "isolate", transform: "translateZ(0)" }}>
      <AppShell sideNav={
        <Sidebar style={{ height: 544, top: 8 }}>
          <SidebarBrand logo="K" name="Keel" meta="Acme workspace" />
          <SidebarContent>
            <SidebarSection>{nav.map((n) => <SidebarItem key={n.id} icon={n.icon} label={n.label} count={n.count} active={active === n.id} onClick={() => setActive(n.id)} />)}</SidebarSection>
            <SidebarSection title="Workspace"><SidebarItem icon={<IconSettings />} label="Settings" active={active === "settings"} onClick={() => setActive("settings")} /></SidebarSection>
          </SidebarContent>
          <SidebarFooter><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name="Ana Lima" size="md" /><Text truncate weight="medium">Ana Lima</Text></div></SidebarFooter>
        </Sidebar>
      }>
        <Header title={nav.find((n) => n.id === active)?.label ?? "Settings"} start={<SidebarTrigger />} status={<StatusPill status="active">Live</StatusPill>} actions={<Button size="sm" variant="primary" leading={<IconPlus />}>New</Button>} end={<IconButton label="Notifications" size="sm"><IconBell /></IconButton>} />
        <Page><StatGroup><Stat label="MRR" value="$84.3k" delta={6.2} baseline="vs Oct" /><Stat label="Customers" value="1,284" delta={2.1} /><Stat label="Churn" value="1.8%" delta={-0.4} deltaUnit="pt" lowerIsBetter /></StatGroup></Page>
      </AppShell>
    </div>
  );
}

/* ---------------- Layout ---------------- */
export function LayoutDemo() {
  return (
    <div style={{ height: 360, width: "100%", borderRadius: 16, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
      <Layout
        header={<div style={{ padding: "10px 16px" }}><Text weight="semibold">Inbox</Text></div>}
        start={<List>{["Ana Lima", "Bo Chen", "Cy Diaz", "Dee Eko"].map((n) => <ListItem key={n} leading={<Avatar name={n} size="md" />} title={n} description="Re: invoice INV-1042" onClick={() => {}} compact />)}</List>}
        end={<div style={{ padding: 16 }}><Text variant="eyebrow">Details</Text><Text tone="muted">Inspector pane</Text></div>}
        footer={<div style={{ padding: "8px 16px" }}><Text variant="caption">4 conversations</Text></div>}
      >
        <div style={{ padding: 20 }}><Text variant="title">Re: invoice INV-1042</Text><Text tone="muted">Content pane scrolls on its own.</Text></div>
      </Layout>
    </div>
  );
}

/* ---------------- Header & page ---------------- */
export function PageHeaderDemo() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
        <Header title="Acme Inc." breadcrumb={<Breadcrumbs items={[{ label: "Customers", href: "#" }, { label: "Acme Inc." }]} />} status={<Tag tone="blue">Enterprise</Tag>} actions={<><Button size="sm">Export</Button><Button size="sm" variant="primary">Edit</Button></>} />
      </div>
      <PageHeading eyebrow="Billing" title="Invoices" description="Every invoice you've sent, with payment status." actions={<Button variant="primary" leading={<IconPlus />}>New invoice</Button>} />
      <PageToolbar end={<Button size="sm">Export</Button>}><SearchInput size="sm" placeholder="Search invoices" style={{ width: 240 }} /><Button size="sm" variant="ghost">Status</Button></PageToolbar>
    </div>
  );
}

/* ---------------- Stack ---------------- */
export function StackDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 24, width: "100%" }}>
      <VStack gap={8}>{box("VStack gap 8")}{box("Item")}{box("Item")}</VStack>
      <HStack gap={8}>{box("HStack")}{box("gap 8")}{box("center")}</HStack>
      <Stack direction="row" justify="between" align="center">{box("justify")}{box("between")}</Stack>
      <Inline gap={6}>{["Billing", "EU", "Enterprise", "VIP", "Annual", "SSO"].map((t) => <Tag key={t}>{t}</Tag>)}</Inline>
      <Center minHeight={100}><Text tone="muted">Centered</Text></Center>
    </div>
  );
}

/* ---------------- Grid ---------------- */
export function GridDemo() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
      <Grid columns={3} gap={12}>{["One", "Two", "Three"].map((t) => <Card key={t}>{t} — 3 equal columns, stack on phones</Card>)}</Grid>
      <Grid minItemWidth={160} gap={12}>{Array.from({ length: 7 }, (_, i) => <Card key={i} variant="sunken">Auto-fill {i + 1}</Card>)}</Grid>
    </div>
  );
}

/* ---------------- Section ---------------- */
export function SectionDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 24 }}>
      <Section title="Payment methods" description="Cards used for your subscription." action={<Button size="sm">Add card</Button>}><Text tone="muted">Visa ••4242 · expires 08/28</Text></Section>
      <Section variant="card" title="On a surface"><Text tone="muted">Use the card variant when the section sits among other content.</Text></Section>
      <Section variant="divided" title="Divided"><Text tone="muted">A hairline separates it from what's above.</Text></Section>
    </div>
  );
}

/* ---------------- Divider ---------------- */
export function DividerDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 20 }}>
      <Divider />
      <Divider variant="strong" />
      <Divider variant="dashed" />
      <Divider label="or continue with" />
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}><Text>Left</Text><Divider orientation="vertical" /><Text>Right</Text></div>
    </div>
  );
}

/* ---------------- AspectRatio ---------------- */
export function AspectRatioDemo() {
  const fill = { width: "100%", height: "100%", background: "linear-gradient(135deg,#5675ff,#0ea5a4)" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <AspectRatio ratio={16 / 9}><div style={fill} /></AspectRatio>
      <AspectRatio ratio={4 / 3}><div style={fill} /></AspectRatio>
      <AspectRatio ratio={1}><div style={fill} /></AspectRatio>
    </div>
  );
}

/* ---------------- ScrollableArea ---------------- */
export function ScrollableAreaDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Card padding="none"><ScrollableArea height={220} label="Activity">
        <List>{Array.from({ length: 20 }, (_, i) => <ListItem key={i} title={`Invoice INV-${1040 + i} paid`} meta={`${i + 1}m`} />)}</List>
      </ScrollableArea></Card>
    </div>
  );
}

/* ---------------- ResizeHandle & SplitPane ---------------- */
export function SplitPaneDemo() {
  const [w, setW] = useState(220);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ height: 220, borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
        <SplitPane start={<div style={{ padding: 16 }}><Text weight="semibold">List</Text><Text tone="muted">Drag the divider · double-click resets</Text></div>} end={<div style={{ padding: 16 }}><Text weight="semibold">Detail</Text></div>} />
      </div>
      <div style={{ display: "flex", height: 120, borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
        <div style={{ width: w, padding: 12 }}><Text variant="caption">{w}px — arrow keys work too</Text></div>
        <ResizeHandle value={w} min={120} max={420} onReset={() => setW(220)} onResize={(next, e) => setW(e && "clientX" in e ? Math.min(420, Math.max(120, Math.round(e.clientX - (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect().left))) : next)} />
        <div style={{ flex: 1, padding: 12 }}><Text variant="caption">Content</Text></div>
      </div>
    </div>
  );
}

/* ---------------- Sticky ---------------- */
export function StickyDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 420, height: 220, overflowY: "auto", borderRadius: 14, boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
      <Sticky><div style={{ padding: "8px 12px", backdropFilter: "blur(8px)", background: "color-mix(in srgb, Canvas 80%, transparent)" }}><Text weight="semibold">Sticky toolbar</Text></div></Sticky>
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ padding: "8px 12px" }}><Text tone="muted">Row {i + 1}</Text></div>)}
    </div>
  );
}
