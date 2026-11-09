/* Settings — 12 screens sharing one settings sub-nav. Forms use Field everywhere; instant toggles vs. batched saves are explicit. */
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import {
  Alert, AlertDialog, Avatar, Banner, Bezel, Button, Card, Checkbox, Code, ColorPicker, CopyButton, DataTable, Field, FileInput, FormSection, IconButton, IconCheck, IconCopy,
  IconDownload, IconKey, IconPlus, IconTrash, Input, InputGroup, InputGroupText, List, ListItem, MetadataList, MoreMenu, ProgressBar, RadioList, Select,
  SegmentedControl, SelectableCard, Stat, StatusPill, Switch, Tag, Text, TextArea, TreeList, useToast, Kbd, OtpInput, BreakdownBar, IconGlobe, IconMail, IconLock,
  IconUser, IconUsers, IconShield, IconBell, IconCard, IconPlug, IconCode, IconPalette, IconDatabase, IconSettings, Item, Indicator, Tokenizer,
} from "@keel/components";
import { color, font, radius } from "@keel/tokens/tokens.stylex";
import { money, people, ScreenShell, useGo } from "./kit";

const s = stylex.create({
  wrap: { display: "grid", gap: 24, alignItems: "start", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1000px)": "200px minmax(0, 1fr)" }, maxWidth: 1080, width: "100%", marginInline: "auto" },
  nav: { display: "flex", flexDirection: { default: "row", "@media (min-width: 1000px)": "column" }, gap: 2, overflowX: "auto", scrollbarWidth: "none", position: { default: "static", "@media (min-width: 1000px)": "sticky" }, top: 76, marginInline: { default: -4, "@media (min-width: 1000px)": 0 } },
  navItem: {
    display: "flex", alignItems: "center", gap: 8, height: 32, paddingInline: 10, borderRadius: radius.md, fontSize: font.md, whiteSpace: "nowrap", cursor: "pointer", outline: "none",
    color: { default: color.fgSoft, ":hover": color.fg }, backgroundColor: { default: "transparent", ":hover": color.hover }, textAlign: "start",
  },
  navOn: { color: color.fg, fontWeight: font.medium, backgroundColor: { default: color.selected, ":hover": color.selected } },
  body: { display: "flex", flexDirection: "column", gap: 24, minWidth: 0 },
  head: { display: "flex", flexDirection: "column", gap: 4 },
  h1: { fontSize: font.h2, fontWeight: font.semibold, letterSpacing: "-0.02em" },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8 },
  plans: { display: "grid", gap: 12, gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 700px)": "repeat(3, minmax(0, 1fr))" } },
  integrations: { display: "grid", gap: 12, gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 700px)": "repeat(2, minmax(0, 1fr))" } },
  logo: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: radius.md, fontWeight: font.bold, flexShrink: 0, backgroundColor: color.muted, color: color.fg },
});

const SECTIONS = [
  { id: "set-general", label: "General", icon: <IconSettings /> }, { id: "set-profile", label: "Profile", icon: <IconUser /> }, { id: "set-members", label: "Members", icon: <IconUsers /> },
  { id: "set-roles", label: "Roles", icon: <IconKey /> }, { id: "set-security", label: "Security", icon: <IconShield /> }, { id: "set-notifications", label: "Notifications", icon: <IconBell /> },
  { id: "set-billing", label: "Billing", icon: <IconCard /> }, { id: "set-integrations", label: "Integrations", icon: <IconPlug /> }, { id: "set-developers", label: "Developers", icon: <IconCode /> },
  { id: "set-appearance", label: "Appearance", icon: <IconPalette /> }, { id: "set-data", label: "Data & privacy", icon: <IconDatabase /> }, { id: "set-domains", label: "Domains & email", icon: <IconGlobe /> },
];

function Settings({ id, title, description, children, save }: { id: string; title: string; description: string; children: ReactNode; save?: boolean }) {
  const go = useGo();
  const toast = useToast();
  return (
    <ScreenShell active="set-general" header={{ title: "Settings", actions: save ? <Button size="sm" variant="primary" onClick={() => toast({ title: "Settings saved" })}>Save changes</Button> : undefined }}>
      <div {...stylex.props(s.wrap)}>
        <nav aria-label="Settings" {...stylex.props(s.nav)}>
          {SECTIONS.map((x) => <button key={x.id} type="button" aria-current={x.id === id ? "page" : undefined} onClick={() => go(x.id)} {...stylex.props(s.navItem, x.id === id && s.navOn)}>{x.icon}{x.label}</button>)}
        </nav>
        <div {...stylex.props(s.body)}>
          <header {...stylex.props(s.head)}><h1 {...stylex.props(s.h1)}>{title}</h1><Text tone="muted">{description}</Text></header>
          {children}
        </div>
      </div>
    </ScreenShell>
  );
}

function General() {
  const [dirty, setDirty] = useState(false);
  return (
    <Settings id="set-general" title="General" description="Your workspace's name, address and regional formats.">
      {dirty && <Banner tone="warning" title="Unsaved changes" action={<><Button size="sm" variant="ghost" onClick={() => setDirty(false)}>Discard</Button><Button size="sm" variant="primary" onClick={() => setDirty(false)}>Save</Button></>} />}
      <Card><FormSection title="Workspace" description="Shown on invoices and emails.">
        <Field label="Workspace name" required><Input defaultValue="Northwind" onChange={() => setDirty(true)} /></Field>
        <Field label="Workspace URL"><InputGroup start={<InputGroupText>app.keel.dev/</InputGroupText>}><Input defaultValue="northwind" onChange={() => setDirty(true)} /></InputGroup></Field>
        <Field label="Logo" description="SVG or PNG, at least 256px."><FileInput compact accept="image/*" onFiles={() => setDirty(true)} /></Field>
      </FormSection></Card>
      <Card><FormSection title="Regional" description="Formats for dates, money and time.">
        <Field label="Default currency"><Select defaultValue="usd" options={[{ value: "usd", label: "USD — US dollar" }, { value: "eur", label: "EUR — Euro" }, { value: "bdt", label: "BDT — Bangladeshi taka" }]} onValueChange={() => setDirty(true)} /></Field>
        <Field label="Time zone"><Select defaultValue="cet" options={[{ value: "cet", label: "Berlin (UTC+1)" }, { value: "dhaka", label: "Dhaka (UTC+6)" }, { value: "ny", label: "New York (UTC−5)" }]} /></Field>
        <Field label="Week starts on"><RadioList orientation="horizontal" defaultValue="mon" options={[{ value: "mon", label: "Monday" }, { value: "sun", label: "Sunday" }]} /></Field>
      </FormSection></Card>
    </Settings>
  );
}

function Profile() {
  return (
    <Settings id="set-profile" title="Profile" description="How you appear to your team." save>
      <Card><div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}><Avatar name="Maya Okafor" size="xl" /><div style={{ display: "flex", gap: 8 }}><Button size="sm">Upload photo</Button><Button size="sm" variant="ghost">Remove</Button></div></div></Card>
      <Card><FormSection title="Personal" description="Your name and contact details.">
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))" }}><Field label="First name"><Input defaultValue="Maya" /></Field><Field label="Last name"><Input defaultValue="Okafor" /></Field></div>
        <Field label="Email" description="We'll send a link to confirm a new address."><Input type="email" defaultValue="maya@northwind.io" /></Field>
        <Field label="Title" optional><Input defaultValue="Head of Revenue" /></Field>
        <Field label="Bio" count={{ value: 64, max: 160 }}><TextArea defaultValue="Runs revenue at Northwind. Ask me about pricing, forecasting and pipeline." /></Field>
      </FormSection></Card>
    </Settings>
  );
}

function Members() {
  const rows = people.slice(0, 9).map((p, i) => ({ ...p, role: ["Owner", "Admin", "Member", "Member", "Billing", "Member", "Viewer", "Member", "Admin"][i] }));
  return (
    <Settings id="set-members" title="Members" description="72 of 100 seats used. Invite teammates and set what they can do.">
      <Bezel label="Invite" padded>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Input placeholder="name@company.com, …" aria-label="Emails" style={{ flex: 1, minWidth: 220 }} /><Select defaultValue="member" options={[{ value: "member", label: "Member" }, { value: "admin", label: "Admin" }, { value: "viewer", label: "Viewer" }]} aria-label="Role" /><Button variant="primary" leading={<IconMail />}>Send invites</Button></div>
      </Bezel>
      <DataTable data={rows} getRowId={(r) => r.id} caption="Members" hideViewMenu columns={[
        { id: "name", header: "Member", required: true, cell: (r) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name} size="sm" status={r.score > 50 ? "online" : "offline"} /><span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}><Text weight="medium" truncate>{r.name}</Text><Text variant="caption" truncate>{r.email}</Text></span></span> },
        { id: "role", header: "Role", cell: (r) => <Select size="sm" variant="button" defaultValue={r.role} options={["Owner", "Admin", "Member", "Billing", "Viewer"].map((x) => ({ value: x, label: x }))} aria-label="Role" /> },
        { id: "seen", header: "Last active", showFrom: "md", cell: (r) => <Text tone="muted">{r.lastSeen}</Text> },
      ]} rowActions={() => <MoreMenu items={[{ label: "Resend invite" }, { label: "Remove", destructive: true }]} />} />
    </Settings>
  );
}

function Roles() {
  const [checked, setChecked] = useState<Set<string>>(new Set(["crm.read", "crm.write", "billing.read"]));
  return (
    <Settings id="set-roles" title="Roles & permissions" description="Built-in roles, plus custom roles on Scale." save>
      <div {...stylex.props(s.plans)}>{[["Admin", "Everything except billing ownership", 3], ["Member", "Work with records, no settings", 61], ["Viewer", "Read-only access", 8]].map(([n, d, c]) => <Card key={n as string}><Text weight="semibold">{n}</Text><Text variant="caption">{d}</Text><Text variant="caption">{c} people</Text></Card>)}</div>
      <Card><FormSection title="Custom role: Finance" description="Pick what this role can see and do.">
        <TreeList aria-label="Permissions" checkable checked={checked} onCheckedChange={setChecked} defaultExpanded={["crm", "billing"]} data={[
          { id: "crm", label: "Customers", children: [{ id: "crm.read", label: "View records" }, { id: "crm.write", label: "Edit records" }, { id: "crm.delete", label: "Delete records" }] },
          { id: "billing", label: "Billing", children: [{ id: "billing.read", label: "View invoices" }, { id: "billing.write", label: "Issue refunds" }] },
          { id: "settings", label: "Workspace settings", children: [{ id: "settings.members", label: "Manage members" }, { id: "settings.sso", label: "Configure SSO" }] },
        ]} />
      </FormSection></Card>
    </Settings>
  );
}

function Security() {
  const [confirm, setConfirm] = useState(false);
  const [code, setCode] = useState("");
  return (
    <Settings id="set-security" title="Security" description="Sign-in methods, sessions and policies for everyone in Northwind.">
      <Card><FormSection title="Single sign-on" description="Members sign in with your identity provider.">
        <Switch label="Require SSO for all members" description="Owners can still sign in with a password and 2FA." labelPosition="left" defaultChecked />
        <MetadataList items={[{ label: "Provider", value: "Okta" }, { label: "SAML ACS URL", value: <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Code>https://app.keel.dev/sso/acs</Code><CopyButton value="https://app.keel.dev/sso/acs" size="xs" /></span> }, { label: "Status", value: <StatusPill status="active">Connected</StatusPill> }]} />
      </FormSection></Card>
      <Card><FormSection title="Two-factor authentication" description="Add a second step to your own sign-in.">
        <Field label="Enter the 6-digit code from your authenticator app"><OtpInput groupSize={3} value={code} onChange={setCode} /></Field>
        <Switch label="Require 2FA for admins" labelPosition="left" defaultChecked />
      </FormSection></Card>
      <Card padding="none"><div style={{ padding: "14px 16px 4px" }}><Text weight="semibold">Active sessions</Text></div><List>{[["MacBook Pro · Chrome", "Berlin · this device", true], ["iPhone 15 · Safari", "Berlin · 2h ago", false], ["Windows · Edge", "Lisbon · 3d ago", false]].map(([d, w, cur]) => <ListItem key={d as string} title={d} description={w} trailing={cur ? <Tag size="sm">Current</Tag> : <Button size="xs" variant="ghost" onClick={() => setConfirm(true)}>Sign out</Button>} />)}</List></Card>
      <AlertDialog open={confirm} onOpenChange={setConfirm} title="Sign out this session?" description="The device will need to sign in again." actionLabel="Sign out" onAction={() => setConfirm(false)} />
    </Settings>
  );
}

function Notifications() {
  const rows = [["New lead assigned to me", true, true], ["Deal stage changes", true, false], ["Mentions & replies", true, true], ["Weekly summary", false, true], ["Payment failed", true, true]] as const;
  return (
    <Settings id="set-notifications" title="Notifications" description="Changes save as you toggle.">
      <Card padding="none">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 64px", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--b, rgba(127,127,127,.18))" }}><Text variant="eyebrow">Event</Text><Text variant="eyebrow" style={{ textAlign: "center" }}>In-app</Text><Text variant="eyebrow" style={{ textAlign: "center" }}>Email</Text></div>
        {rows.map(([n, a, e]) => <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 64px 64px", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(127,127,127,.12)" }}><Text>{n}</Text><span style={{ display: "flex", justifyContent: "center" }}><Switch aria-label={`${n} in-app`} defaultChecked={a} size="sm" /></span><span style={{ display: "flex", justifyContent: "center" }}><Switch aria-label={`${n} email`} defaultChecked={e} size="sm" /></span></div>)}
      </Card>
      <Card><FormSection title="Quiet hours" description="Pause push notifications at night.">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Field label="From"><Input type="time" defaultValue="20:00" /></Field><Field label="Until"><Input type="time" defaultValue="08:00" /></Field></div>
      </FormSection></Card>
    </Settings>
  );
}

function Billing() {
  const go = useGo();
  return (
    <Settings id="set-billing" title="Billing" description="Your plan, payment method and invoices.">
      <div {...stylex.props(s.plans)}>
        <Stat variant="ink" label="Current plan" value="Growth" meta="$39 / seat / month" footer={undefined} />
        <Stat variant="card" label="Seats" value="72 / 100" progress={{ value: 72 }} />
        <Stat variant="card" label="Next invoice" value={money(2808)} compare={{ label: "Due", value: "Dec 1" }} />
      </div>
      <Card><FormSection title="Payment method" description="Charged on the 1st of each month.">
        <Item leading={<span {...stylex.props(s.logo)}>VISA</span>} title="Visa ending 4242" description="Expires 08/28 · billing@northwind.io" trailing={<Button size="sm">Update</Button>} />
      </FormSection></Card>
      <Card padding="none"><div style={{ padding: "14px 16px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><Text weight="semibold">Invoices</Text><Button size="sm" variant="ghost" onClick={() => go("list-invoices")}>View all</Button></div>
        <List>{["Nov 1, 2026", "Oct 1, 2026", "Sep 1, 2026"].map((d, i) => <ListItem key={d} title={d} description={`INV-20${61 - i}`} meta={money(2808 - i * 117)} trailing={<IconButton label="Download" size="sm"><IconDownload /></IconButton>} />)}</List></Card>
      <Alert tone="info" title="Annual billing saves 2 months" action={<Button size="sm" onClick={() => go("com-pricing")}>Compare plans</Button>}>Switch to yearly and pay for 10 months instead of 12.</Alert>
    </Settings>
  );
}

function Integrations() {
  const apps = [["Slack", "Post deal updates and mentions to channels.", true], ["Google Calendar", "Sync meetings to records.", true], ["HubSpot", "Two-way contact sync.", false], ["Stripe", "Invoices, payments and MRR.", true], ["Zapier", "5,000+ apps, no code.", false], ["Linear", "Turn tickets into issues.", false]] as const;
  return (
    <Settings id="set-integrations" title="Integrations" description="Connect the tools Northwind already uses.">
      <div {...stylex.props(s.integrations)}>{apps.map(([n, d, on]) => <Card key={n}><div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span {...stylex.props(s.logo)}>{n[0]}</span><div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}><Text weight="semibold">{n}</Text><Text variant="caption">{d}</Text></div>{on ? <StatusPill status="active">Connected</StatusPill> : <Button size="sm">Connect</Button>}</div></Card>)}</div>
    </Settings>
  );
}

function Developers() {
  return (
    <Settings id="set-developers" title="Developers" description="API keys, webhooks and the event log.">
      <Card><FormSection title="API keys" description="Keys can do everything your role can. Keep them secret.">
        <List>{[["Production", "nw_live_k3x9…f2"], ["Staging", "nw_test_9aq1…7c"]].map(([n, k]) => <ListItem key={n} leading={<IconKey />} title={n} description={<Code>{k}</Code>} trailing={<><CopyButton value={k} size="sm" /><MoreMenu items={[{ label: "Roll key" }, { label: "Revoke", destructive: true }]} /></>} />)}</List>
        <div><Button size="sm" leading={<IconPlus />}>Create key</Button></div>
      </FormSection></Card>
      <Card><FormSection title="Webhooks" description="We POST JSON and retry with backoff for 3 days.">
        <Field label="Endpoint URL"><Input defaultValue="https://erp.northwind.io/keel" /></Field>
        <Field label="Events"><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{["invoice.paid", "deal.won", "customer.created", "ticket.solved"].map((e) => <Tag key={e} size="sm" variant="outline">{e}</Tag>)}</div></Field>
        <Field label="Signing secret"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Code>whsec_••••••••••••a91</Code><CopyButton value="whsec_x" size="xs" /></span></Field>
      </FormSection></Card>
    </Settings>
  );
}

function Appearance() {
  const [mode, setMode] = useState("system");
  const [accent, setAccent] = useState("#2b5cff");
  return (
    <Settings id="set-appearance" title="Appearance" description="Only affects you on this device.">
      <Card><FormSection title="Theme" description="Follow your OS, or pick one.">
        <div {...stylex.props(s.plans)}>{[["light", "Light"], ["dark", "Dark"], ["system", "System"]].map(([v, l]) => <SelectableCard key={v} type="radio" selected={mode === v} onSelectedChange={() => setMode(v)} label={l}><Text weight="medium">{l}</Text><Text variant="caption">{v === "system" ? "Match your OS" : `Always ${l.toLowerCase()}`}</Text></SelectableCard>)}</div>
      </FormSection></Card>
      <Card><FormSection title="Density" description="How much fits on screen.">
        <SegmentedControl defaultValue="comfortable" items={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "spacious", label: "Spacious" }]} />
      </FormSection></Card>
      <Card><FormSection title="Highlight color" description="Used for selection and links.">
        <div style={{ maxWidth: 260 }}><ColorPicker value={accent} onChange={setAccent} /></div>
      </FormSection></Card>
    </Settings>
  );
}

function DataPrivacy() {
  const [del, setDel] = useState(false);
  const [name, setName] = useState("");
  return (
    <Settings id="set-data" title="Data & privacy" description="Exports, retention and deleting the workspace.">
      <Card><FormSection title="Storage" description="12.4 GB of 50 GB used.">
        <BreakdownBar items={[{ name: "Files", value: 7.1 }, { name: "Email history", value: 3.4 }, { name: "Records", value: 1.2 }, { name: "Other", value: 0.7 }]} format={(n) => `${n} GB`} />
      </FormSection></Card>
      <Card><FormSection title="Export" description="A ZIP of CSVs for every object, emailed when ready.">
        <div><Button leading={<IconDownload />}>Export all data</Button></div>
      </FormSection></Card>
      <Card><FormSection title="Retention" description="Automatically delete old activity.">
        <Field label="Keep activity for"><Select defaultValue="24" options={[{ value: "12", label: "12 months" }, { value: "24", label: "24 months" }, { value: "forever", label: "Forever" }]} /></Field>
        <Checkbox label="Also delete call recordings" description="Transcripts stay attached to records." />
      </FormSection></Card>
      <Alert tone="danger" title="Delete workspace" action={<Button variant="danger" size="sm" leading={<IconTrash />} onClick={() => setDel(true)}>Delete</Button>}>Removes every record, file and member. Exports stay in your email for 30 days.</Alert>
      <AlertDialog open={del} onOpenChange={setDel} title="Delete Northwind?" description="This can't be undone. Type the workspace name to confirm." actionLabel="Delete workspace" onAction={() => setDel(false)}>
        <Field label="Workspace name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Northwind" /></Field>
      </AlertDialog>
    </Settings>
  );
}

function Domains() {
  return (
    <Settings id="set-domains" title="Domains & email" description="Send from your own domain and verify it with DNS.">
      <Card><FormSection title="Sending domain" description="Add these records at your DNS provider.">
        <MetadataList items={[{ label: "Domain", value: "mail.northwind.io" }, { label: "Status", value: <StatusPill status="pending">Waiting for DNS</StatusPill> }]} />
        <DataTable variant="plain" hideViewMenu data={[{ id: "1", type: "TXT", host: "@", value: "v=spf1 include:keel.dev ~all", ok: true }, { id: "2", type: "CNAME", host: "k1._domainkey", value: "dkim.keel.dev", ok: false }, { id: "3", type: "TXT", host: "_dmarc", value: "v=DMARC1; p=none", ok: true }]} getRowId={(r) => r.id} caption="DNS records" columns={[
          { id: "type", header: "Type", cell: (r) => <Code>{r.type}</Code> }, { id: "host", header: "Host", cell: (r) => <Code>{r.host}</Code> },
          { id: "value", header: "Value", showFrom: "md", cell: (r) => <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minWidth: 0 }}><Text variant="mono" truncate>{r.value}</Text><CopyButton value={r.value} size="xs" /></span> },
          { id: "ok", header: "Status", cell: (r) => r.ok ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><IconCheck size={14} />Verified</span> : <Text tone="muted">Pending</Text> },
        ]} />
        <div><Button size="sm" variant="primary">Check again</Button></div>
      </FormSection></Card>
    </Settings>
  );
}

export const settingsScreens = [
  { id: "set-general", title: "General settings", category: "Settings", render: () => <General /> },
  { id: "set-profile", title: "Profile", category: "Settings", render: () => <Profile /> },
  { id: "set-members", title: "Members", category: "Settings", render: () => <Members /> },
  { id: "set-roles", title: "Roles & permissions", category: "Settings", render: () => <Roles /> },
  { id: "set-security", title: "Security", category: "Settings", render: () => <Security /> },
  { id: "set-notifications", title: "Notifications", category: "Settings", render: () => <Notifications /> },
  { id: "set-billing", title: "Billing", category: "Settings", render: () => <Billing /> },
  { id: "set-integrations", title: "Integrations", category: "Settings", render: () => <Integrations /> },
  { id: "set-developers", title: "Developers", category: "Settings", render: () => <Developers /> },
  { id: "set-appearance", title: "Appearance", category: "Settings", render: () => <Appearance /> },
  { id: "set-data", title: "Data & privacy", category: "Settings", render: () => <DataPrivacy /> },
  { id: "set-domains", title: "Domains & email", category: "Settings", render: () => <Domains /> },
];
void [IconCopy, IconLock, ProgressBar, Kbd, Indicator, Tokenizer];
