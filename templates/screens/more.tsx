/* Commerce (8) · AI (8) · System (10). */
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  Accordion, AccordionItem, ApprovalCard, Avatar, BarList, Bezel, Breadcrumbs, Button, Card, CardBody, CardHeader, ChatComposer, ChatLayout, ChatMessage, ChatToolCalls,
  Checkbox, Citation, CodeBlock, ConfidenceMeter, ContextChips, DataTable, DiffTable, Divider, EmptyState, Field, ForbiddenPage, IconAgent, IconArrowLeft, IconArrowRight,
  IconBook, IconCheck, IconCheckCircle, IconDatabase, IconFile, IconGlobe, IconLock, IconMail, IconPlus, IconSearch, IconUsers, IconZap, Input, LineChart, List, ListItem,
  Markdown, MetadataList, NotFoundPage, OfflineState, ParameterCard, PromptBar, PromptSuggestions, RadioList, SearchInput, SegmentedControl, Select, ServerErrorPage, Stat,
  StatGroup, StatusPill, Switch, TabMenu, Tag, TaskList, Text, Thinking, Timeline, ToolChips, BreakdownBar, BulletChart, Heatmap, InsightCard, RecommendationCard,
  ProgressBar, Kbd, AiBadge, Item, IconSettings, IconShield,
} from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";
import { Cols, companies, deals, int, money, people, ScreenShell, series, useGo, weeks } from "./kit";

const s = stylex.create({
  plans: { display: "grid", gap: 14, alignItems: "stretch", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 900px)": "repeat(3, minmax(0, 1fr))" } },
  plan: { display: "flex", flexDirection: "column", gap: 16, padding: 20, borderRadius: radius.xxl, backgroundColor: color.surface, boxShadow: depth.card },
  planHot: { boxShadow: `0 0 0 1.5px ${color.fg}, ${depth.cardHover}` },
  price: { fontSize: "36px", fontWeight: font.semibold, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" },
  feat: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: font.md, color: color.fgSoft },
  center: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, maxWidth: 640, marginInline: "auto" },
  h1: { fontSize: { default: "30px", "@media (min-width: 768px)": "40px" }, fontWeight: font.semibold, letterSpacing: "-0.035em", lineHeight: 1.1 },
  checkout: { display: "grid", gap: 24, alignItems: "start", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 960px)": "minmax(0, 1fr) 360px" }, maxWidth: 1040, width: "100%", marginInline: "auto" },
  aiGrid: { display: "grid", gap: 16, gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 760px)": "repeat(2, minmax(0, 1fr))", "@media (min-width: 1200px)": "repeat(3, minmax(0, 1fr))" } },
  narrow: { maxWidth: 760, width: "100%", marginInline: "auto", display: "flex", flexDirection: "column", gap: 20 },
  sysPage: { minHeight: "100dvh", display: "grid", placeItems: "center", padding: 16, backgroundColor: color.canvas, backgroundImage: `radial-gradient(${color.border} 1px, transparent 1px)`, backgroundSize: "18px 18px" },
  release: { display: "grid", gap: 8, gridTemplateColumns: { default: "1fr", "@media (min-width: 760px)": "140px 1fr" }, paddingBlock: 24, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  up: { flex: 1, height: 18, borderRadius: 2, backgroundColor: color.borderStrong },
  upWarn: { backgroundColor: color.fgMuted }, upBad: { backgroundColor: color.danger },
  mono: { fontFamily: font.mono, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgMuted },
});

/* ------------------------------------------------------------------ commerce */
const PLANS = [
  { n: "Starter", m: 12, y: 10, d: "For small teams getting organized.", f: ["Up to 5 seats", "Contacts, companies, deals", "Email sync", "Basic reports"] },
  { n: "Growth", m: 39, y: 32, d: "For teams that sell every day.", f: ["Unlimited seats", "Workflows & sequences", "Assistant included", "Custom reports", "Priority support"], hot: true },
  { n: "Scale", m: 79, y: 66, d: "For revenue orgs with security needs.", f: ["Everything in Growth", "SSO & SCIM", "Audit log & custom roles", "EU data residency", "99.99% SLA"] },
];
function Pricing() {
  const go = useGo(); const [cycle, setCycle] = useState("y");
  return (
    <ScreenShell active="set-billing" header={{ title: "Plans" }}>
      <div {...stylex.props(s.center)}><span {...stylex.props(s.mono)}>Pricing</span><h1 {...stylex.props(s.h1)}>Simple pricing that grows with you</h1><Text tone="muted">Every plan includes unlimited records and a 14-day trial.</Text>
        <SegmentedControl value={cycle} onValueChange={setCycle} items={[{ value: "m", label: "Monthly" }, { value: "y", label: "Yearly · save 17%" }]} /></div>
      <div {...stylex.props(s.plans)}>{PLANS.map((p) => (
        <div key={p.n} {...stylex.props(s.plan, p.hot && s.planHot)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Text variant="h3">{p.n}</Text>{p.hot && <Tag size="sm" tone="blue">Most popular</Tag>}</div>
          <Text tone="muted">{p.d}</Text>
          <div><span {...stylex.props(s.price)}>${cycle === "y" ? p.y : p.m}</span><Text variant="caption"> / seat / month{cycle === "y" ? ", billed yearly" : ""}</Text></div>
          <Button variant={p.hot ? "primary" : "secondary"} fullWidth onClick={() => go("com-checkout")}>{p.n === "Growth" ? "Current plan" : `Choose ${p.n}`}</Button>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{p.f.map((f) => <span key={f} {...stylex.props(s.feat)}><IconCheck size={16} />{f}</span>)}</div>
        </div>
      ))}</div>
      <Card><Accordion type="single">{[["Can I change plans later?", "Yes — upgrades are prorated today, downgrades apply at renewal."], ["What counts as a seat?", "Anyone who can sign in. Viewers are free on Growth and Scale."], ["Do you offer discounts?", "Nonprofits and early-stage startups get 50% off the first year."]].map(([q, a]) => <AccordionItem key={q} value={q} title={q}>{a}</AccordionItem>)}</Accordion></Card>
    </ScreenShell>
  );
}
function Compare() {
  const rows: [string, (string | boolean)[]][] = [["Seats", ["5", "Unlimited", "Unlimited"]], ["Workflows", [false, true, true]], ["Assistant", [false, true, true]], ["Custom reports", [false, true, true]], ["SSO / SCIM", [false, false, true]], ["Audit log", [false, false, true]], ["Data residency", ["US", "US", "US / EU"]], ["Support", ["Email", "Priority", "Dedicated CSM"]]];
  return (
    <ScreenShell active="set-billing" header={{ title: "Compare plans" }}>
      <DataTable data={rows.map(([n, v], i) => ({ id: String(i), n, v }))} getRowId={(r) => r.id} hideViewMenu caption="Plan comparison" columns={[
        { id: "n", header: "Feature", required: true, cell: (r) => <Text weight="medium">{r.n}</Text> },
        ...PLANS.map((p, pi) => ({ id: p.n, header: <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>{p.n}{p.hot && <Tag size="sm" tone="blue">Popular</Tag>}</span>, align: "center" as const, cell: (r: { v: (string | boolean)[] }) => typeof r.v[pi] === "boolean" ? (r.v[pi] ? <span style={{ display: "inline-flex", verticalAlign: "middle" }}><IconCheck size={16} /></span> : <Text tone="muted">—</Text>) : r.v[pi] })),
      ]} />
    </ScreenShell>
  );
}
function Checkout() {
  const go = useGo(); const [seats, setSeats] = useState(24);
  const sub = seats * 32 * 12;
  return (
    <ScreenShell active="set-billing" header={{ title: "Checkout", breadcrumb: <Breadcrumbs items={[{ label: "Plans", href: "#" }, { label: "Growth" }]} /> }}>
      <div {...stylex.props(s.checkout)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card><Text variant="h3">Billing details</Text><div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
            <Field label="Company"><Input defaultValue="Northwind Inc." /></Field>
            <Field label="Billing email"><Input type="email" defaultValue="billing@northwind.io" /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 12 }}><Field label="Country"><Select defaultValue="de" options={[{ value: "de", label: "Germany" }, { value: "us", label: "United States" }, { value: "bd", label: "Bangladesh" }]} /></Field><Field label="VAT ID" optional><Input placeholder="DE123456789" /></Field></div>
          </div></Card>
          <Card><Text variant="h3">Payment</Text><div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
            <RadioList defaultValue="card" options={[{ value: "card", label: "Card", description: "Visa, Mastercard, Amex" }, { value: "sepa", label: "SEPA direct debit" }, { value: "invoice", label: "Invoice", description: "Net 30, Scale only", disabled: true }]} />
            <Field label="Card number"><Input inputMode="numeric" placeholder="1234 1234 1234 1234" /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}><Field label="Expiry"><Input placeholder="MM / YY" /></Field><Field label="CVC"><Input placeholder="123" /></Field></div>
          </div></Card>
        </div>
        <Bezel label="Order summary" footer={<Button variant="primary" fullWidth onClick={() => go("com-success")}>Pay {money(sub * 1.19)}</Button>}>
          <Item title="Growth · yearly" description={`$32 × ${seats} seats × 12 months`} trailing={money(sub)} />
          <Field label="Seats"><Input type="number" min={1} value={seats} onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))} /></Field>
          <MetadataList items={[{ label: "Subtotal", value: money(sub) }, { label: "VAT 19%", value: money(sub * 0.19) }, { label: <b>Total today</b>, value: <b>{money(sub * 1.19)}</b> }]} />
          <Checkbox label="Email me the invoice as PDF" defaultChecked />
        </Bezel>
      </div>
    </ScreenShell>
  );
}
function Success() { const go = useGo(); return <main {...stylex.props(s.sysPage)}><EmptyState icon={<IconCheckCircle />} title="You're on Growth" description="Receipt sent to billing@northwind.io. Workflows and the assistant are unlocked." actions={<><Button onClick={() => go("set-billing")}>View billing</Button><Button variant="primary" onClick={() => go("dash-home")}>Go to Home</Button></>} /></main>; }
function Usage() {
  return (
    <ScreenShell active="set-billing" header={{ title: "Usage", actions: <Select size="sm" variant="button" defaultValue="nov" options={[{ value: "nov", label: "November" }, { value: "oct", label: "October" }]} aria-label="Month" /> }}>
      <StatGroup><Stat label="API calls" value="4.1M" progress={{ value: 82, target: 100, label: "82% of 5M included" }} /><Stat label="Assistant credits" value="9,420" progress={{ value: 63, label: "of 15,000" }} /><Stat label="Storage" value="12.4 GB" progress={{ value: 25, label: "of 50 GB" }} /><Stat label="Overage" value="$0" compare={{ label: "Projected", value: "$0" }} /></StatGroup>
      <Card padding="none"><CardHeader title="API calls per day" /><CardBody><LineChart label="API calls per day" labels={weeks} format={(n) => `${Math.round(n / 1000)}k`} series={[{ name: "Calls", values: series(90000, 0.02) }]} /></CardBody></Card>
      <Card padding="none"><CardHeader title="By key" /><CardBody><BarList items={[{ name: "Production", value: 3200000 }, { name: "Zapier", value: 520000 }, { name: "Data export", value: 290000 }, { name: "Staging", value: 90000 }]} /></CardBody></Card>
    </ScreenShell>
  );
}
function Upgrade() {
  const go = useGo();
  return <main {...stylex.props(s.sysPage)}><Bezel label="Scale feature" icon={<IconLock size={12} />} footer={<><Button variant="ghost" onClick={() => go("dash-home")}>Not now</Button><span style={{ marginLeft: "auto" }}><Button variant="primary" onClick={() => go("com-pricing")}>Upgrade to Scale</Button></span></>} xstyle={undefined} style={{ maxWidth: 440, width: "100%" }}>
    <Text variant="h3">Audit log is on Scale</Text><Text tone="muted">See who changed what, export events and keep them for 7 years.</Text>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{["Every create, update and delete", "Filter by person, object and IP", "Stream to your SIEM"].map((f) => <span key={f} {...stylex.props(s.feat)}><IconCheck size={16} />{f}</span>)}</div>
  </Bezel></main>;
}
function PayInvoice() {
  return <main {...stylex.props(s.sysPage)}><Card style={{ maxWidth: 420, width: "100%" }}><div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <span {...stylex.props(s.mono)}>Invoice INV-2063 · Northwind Inc.</span><span {...stylex.props(s.price)}>{money(6744)}</span><Text tone="muted">Due Nov 30, 2026 · Tidewater Energy</Text>
    <Divider /><Field label="Email"><Input defaultValue="ap@tidewater.energy" /></Field><Field label="Card"><Input placeholder="1234 1234 1234 1234" /></Field>
    <Button variant="primary" fullWidth>Pay {money(6744)}</Button><Text variant="caption" style={{ textAlign: "center" }}>Secured by Stripe · <a href="#">Download PDF</a></Text>
  </div></Card></main>;
}

/* ------------------------------------------------------------------ AI */
function Assistant() {
  const [v, setV] = useState("");
  const [rows, setRows] = useState([{ id: "1", label: "Lyft", field: "Owner", from: "Unassigned", to: "Rafi Ahmed" }, { id: "2", label: "Medium", field: "Stage", from: "Proposal", to: "Negotiation" }, { id: "3", label: "Zoom", field: "Close date", from: "Dec 4", to: "Dec 18" }] as { id: string; label: string; field: string; from: string; to: string; status?: "accepted" | "rejected" }[]);
  const set = (id: string, st: "accepted" | "rejected") => setRows((r) => r.map((x) => (x.id === id ? { ...x, status: st } : x)));
  return (
    <ScreenShell active="ai-assistant" flush header={{ title: "Assistant", status: <AiBadge label="Beta" icon={false} />, actions: <Select size="sm" variant="button" defaultValue="fast" options={[{ value: "fast", label: "Fast" }, { value: "deep", label: "Deep research" }]} aria-label="Mode" /> }}>
      <ChatLayout composer={<ChatComposer value={v} onValueChange={setV} onSubmit={() => setV("")} placeholder="Ask about your pipeline…" tools={<ToolChips tools={[{ id: "crm", label: "CRM", icon: <IconDatabase />, state: "on" }, { id: "web", label: "Web", icon: <IconGlobe /> }, { id: "mail", label: "Email", icon: <IconMail /> }]} />} />} footer="The assistant proposes; you approve every change.">
        <ChatMessage role="user" content="Which deals slipped this week, and fix the obvious data issues?" />
        <ChatMessage role="assistant" before={<><Thinking done reasoning="Compared close dates against last Monday's snapshot. 3 moved out; Lyft has no owner." /><ChatToolCalls calls={[{ id: "1", name: "crm.search_deals", status: "done", input: "{ changed_since: \"2026-11-10\" }", output: "28 deals", durationMs: 820 }]} /></>}
          content={"Three deals slipped, worth **$214k** together.[^1] Medium moved to negotiation without a stage update, and Lyft has no owner. I can fix both:"} sources={[{ title: "Deals changed since Nov 10", url: "#" }]}
          after={<DiffTable rows={rows} onAccept={(id) => set(id, "accepted")} onReject={(id) => set(id, "rejected")} onAcceptAll={() => setRows((r) => r.map((x) => ({ ...x, status: "accepted" })))} />} />
      </ChatLayout>
    </ScreenShell>
  );
}
function AgentRuns() {
  const go = useGo();
  const runs = Array.from({ length: 14 }, (_, i) => ({ id: `run_${8120 - i}`, agent: ["Lead router", "Renewal watcher", "Churn analyst", "Email drafter"][i % 4], status: ["Succeeded", "Running", "Needs approval", "Failed", "Succeeded"][i % 5], steps: int(3, 14), tokens: int(4, 90) * 1000, started: `${int(1, 59)}m ago` }));
  return (
    <ScreenShell active="ai-assistant" header={{ title: "Agent runs", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>New agent</Button> }}>
      <StatGroup><Stat label="Runs today" value="1,284" trend={series(800, 0.03)} trendType="bars" /><Stat label="Success rate" value="96.4%" progress={{ value: 96.4, style: "ring" }} /><Stat label="Awaiting approval" value="7" badge={<StatusPill status="pending">Action</StatusPill>} /><Stat label="Cost" value="$41.20" compare={{ label: "Budget", value: "$60 / day" }} /></StatGroup>
      <DataTable data={runs} getRowId={(r) => r.id} caption="Agent runs" onRowClick={() => go("ai-run")} columns={[
        { id: "id", header: "Run", required: true, cell: (r) => <Text variant="mono">{r.id}</Text> },
        { id: "agent", header: "Agent", cell: (r) => <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><IconAgent size={14} />{r.agent}</span> },
        { id: "status", header: "Status", cell: (r) => <StatusPill status={r.status === "Succeeded" ? "neutral" : r.status === "Running" ? "active" : r.status === "Failed" ? "danger" : "pending"} pulse={r.status === "Running"}>{r.status}</StatusPill> },
        { id: "steps", header: "Steps", align: "right", showFrom: "md", cell: (r) => r.steps },
        { id: "tokens", header: "Tokens", align: "right", showFrom: "lg", cell: (r) => `${Math.round(r.tokens / 1000)}k` },
        { id: "started", header: "Started", showFrom: "sm", cell: (r) => <Text tone="muted">{r.started}</Text> },
      ]} />
    </ScreenShell>
  );
}
function AgentRun() {
  const [st, setSt] = useState<"pending" | "approved" | "rejected">("pending");
  return (
    <ScreenShell active="ai-assistant" header={{ title: "run_8118", status: <StatusPill status="pending">Needs approval</StatusPill>, breadcrumb: <Breadcrumbs items={[{ label: "Agent runs", href: "#" }, { label: "run_8118" }]} /> }}>
      <Cols cols="2:1">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Bezel label="Plan" padded={false}><TaskList plain tasks={[{ id: "1", title: "Find renewals in the next 30 days", status: "done", meta: "12 found · 0.8s" }, { id: "2", title: "Score churn risk", status: "done", meta: "4 at risk" }, { id: "3", title: "Draft save emails", status: "done", meta: "4 drafts" }, { id: "4", title: "Send emails", status: "running", meta: "Waiting for approval" }]} /></Bezel>
          <ApprovalCard state={st} title="Send 4 save emails?" description="To the owners of Lyft, Medium, Zoom and Loom, from maya@northwind.io." details={"Subject: A quick check-in before your renewal\n\nHi {first_name}, I noticed your team's usage dipped in October…"} onApprove={() => setSt("approved")} onReject={() => setSt("rejected")} onAlwaysAllow={() => setSt("approved")} />
        </div>
        <Card><MetadataList layout="stacked" items={[{ label: "Agent", value: "Renewal watcher" }, { label: "Trigger", value: "Every Monday 08:00" }, { label: "Model", value: "Fast" }, { label: "Tokens", value: "18,204" }, { label: "Confidence", value: <ConfidenceMeter value={0.82} /> }]} /></Card>
      </Cols>
    </ScreenShell>
  );
}
function Prompts() {
  const items = [["Weekly pipeline summary", "Summarize changes, slips and risks for my team", "Sales"], ["Renewal prep", "Usage, tickets and stakeholders before a QBR", "Success"], ["Lost-deal analysis", "Patterns across deals lost this quarter", "RevOps"], ["Follow-up email", "Write a follow-up from my last call notes", "Sales"], ["Account plan", "Whitespace, champions and next steps", "Success"], ["Forecast check", "Compare commit vs. weighted pipeline", "RevOps"]];
  return (
    <ScreenShell active="ai-assistant" header={{ title: "Prompt library", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>New prompt</Button> }}>
      <SearchInput placeholder="Search prompts" style={{ maxWidth: 360 }} />
      <div {...stylex.props(s.aiGrid)}>{items.map(([t, d, c]) => <Bezel key={t} label={c} footer={<><Text variant="caption">Used 42×</Text><span style={{ marginLeft: "auto" }}><Button size="sm" trailing={<IconArrowRight />}>Run</Button></span></>}><Text weight="semibold">{t}</Text><Text tone="muted">{d}</Text></Bezel>)}</div>
    </ScreenShell>
  );
}
function Knowledge() {
  return (
    <ScreenShell active="ai-assistant" header={{ title: "Knowledge", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>Add source</Button> }}>
      <Bezel label="Indexed" meta="2,418 documents · synced 4m ago"><BreakdownBar items={[{ name: "Help center", value: 812 }, { name: "Google Drive", value: 744 }, { name: "Call transcripts", value: 532 }, { name: "Notion", value: 330 }]} /></Bezel>
      <Card padding="none"><List>{[["Help center", "help.northwind.io · 812 articles", "Synced"], ["Google Drive", "Sales & CS folders · 744 files", "Synced"], ["Gong", "Call transcripts · 532 calls", "Syncing"], ["Notion", "Playbooks · 330 pages", "Error"]].map(([n, d, st]) => <ListItem key={n} leading={<Avatar name={n} size="md" shape="square" />} title={n} description={d} trailing={<StatusPill status={st === "Synced" ? "neutral" : st === "Syncing" ? "active" : "danger"} pulse={st === "Syncing"}>{st}</StatusPill>} />)}</List></Card>
    </ScreenShell>
  );
}
function Approvals() {
  const [done, setDone] = useState<Record<string, "approved" | "rejected">>({});
  const items = [["Send 4 save emails?", "Renewal watcher · to Lyft, Medium, Zoom, Loom"], ["Reassign 12 leads to Rafi?", "Lead router · Lena is out until Monday"], ["Apply 15% discount to Zoom?", "Deal desk · above your 10% limit"]];
  return (
    <ScreenShell active="ai-assistant" header={{ title: "Approvals", status: <Tag size="sm">{items.length - Object.keys(done).length} waiting</Tag> }} pageWidth="narrow">
      {items.map(([t, d], i) => <ApprovalCard key={t} tone={i === 2 ? "warning" : "default"} state={done[t] ?? "pending"} title={t} description={d} onApprove={() => setDone((x) => ({ ...x, [t]: "approved" }))} onReject={() => setDone((x) => ({ ...x, [t]: "rejected" }))} />)}
    </ScreenShell>
  );
}
function AiSearch() {
  const [q, setQ] = useState("why did churn go up in october");
  return (
    <ScreenShell active="ai-assistant" header={{ title: "Ask" }} pageWidth="narrow">
      <PromptBar value={q} onValueChange={setQ} onSubmit={() => {}} />
      <PromptSuggestions items={[{ label: "Top deals at risk" }, { label: "Usage by plan" }, { label: "Tickets about SSO" }]} onPick={setQ} />
      <Bezel label="Answer" icon={<IconAgent size={12} />} meta={<ConfidenceMeter value={0.74} />}>
        <Markdown>{"Net churn rose to **2.4%** in October, up from 1.8%.[^1] Most of it came from **4 Starter accounts** that never connected their calendar.[^2]"}</Markdown>
        <ContextChips items={[{ id: "1", title: "Churn report · Oct", meta: "Report", kind: "record" }, { id: "2", title: "Onboarding funnel", meta: "Dashboard", kind: "record" }]} />
      </Bezel>
      <InsightCard title="Accounts without calendar sync" value="38%" trend={[22, 25, 27, 30, 34, 36, 38]} explanation="Accounts that skip calendar sync churn 3× more often in their first 90 days." />
    </ScreenShell>
  );
}
function ModelSettings() {
  const [p, setP] = useState({ temp: 0.3, top: 0.9, max: 1200 });
  return (
    <ScreenShell active="ai-assistant" header={{ title: "Assistant settings", actions: <Button size="sm" variant="primary">Save</Button> }} pageWidth="narrow">
      <Card><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Default model"><Select defaultValue="fast" options={[{ value: "fast", label: "Fast — quick answers" }, { value: "deep", label: "Deep — multi-step research" }]} /></Field>
        <Switch label="Let agents send email" description="Every send still needs approval unless you choose “Always allow”." defaultChecked />
        <Switch label="Use call transcripts" description="Only for accounts you can access." />
      </div></Card>
      <ParameterCard params={[{ id: "temp", label: "Temperature", value: p.temp, min: 0, max: 1, step: 0.1 }, { id: "top", label: "Top-p", value: p.top, min: 0, max: 1, step: 0.05 }, { id: "max", label: "Max tokens", value: p.max, min: 200, max: 4000, step: 100 }]} onChange={(id, v) => setP((x) => ({ ...x, [id === "temp" ? "temp" : id === "top" ? "top" : "max"]: v }))} />
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ system */
function NotFound() { const go = useGo(); return <NotFoundPage actions={<Button variant="primary" onClick={() => go("dash-home")}>Go home</Button>} />; }
function ServerError() { return <ServerErrorPage requestId="req_8f3a91c2" actions={<Button variant="primary" onClick={() => location.reload()}>Try again</Button>} />; }
function Forbidden() { const go = useGo(); return <ForbiddenPage role="Viewer" actions={<><Button onClick={() => go("dash-home")}>Go home</Button><Button variant="primary">Request access</Button></>} />; }
function Maintenance() { return <main {...stylex.props(s.sysPage)}><EmptyState icon={<IconSettings />} title="Back in a few minutes" description="We're upgrading the database. Nothing is lost — this usually takes under 10 minutes." actions={<Button onClick={() => location.reload()}>Check again</Button>} /></main>; }
function Offline() { return <main {...stylex.props(s.sysPage)}><OfflineState onRetry={() => location.reload()} /></main>; }
function EmptyHome() {
  const go = useGo();
  return <ScreenShell active="list-deals" header={{ title: "Deals" }}><EmptyState icon={<IconZap />} title="No deals yet" description="Create your first deal, or import your pipeline from a spreadsheet or another CRM." actions={<><Button onClick={() => go("onb-import")}>Import</Button><Button variant="primary" leading={<IconPlus />}>New deal</Button></>} /></ScreenShell>;
}
function Status() {
  const comps: [string, "ok" | "degraded"][] = [["Web app", "ok"], ["API", "degraded"], ["Email sync", "ok"], ["Assistant", "ok"], ["Webhooks", "ok"]];
  return (
    <main style={{ minHeight: "100dvh", padding: 16 }}><div {...stylex.props(s.narrow)} style={{ paddingTop: 24 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name="N" size="md" shape="square" colored={false} /><Text variant="h3">Northwind status</Text></span>
      <Bezel label="Current status" meta={<StatusPill status="pending">Degraded performance</StatusPill>}><Text weight="medium">Elevated API latency in EU</Text><Text tone="muted">A fix is deployed; latency is back to normal for most requests. Monitoring · 10:42 UTC</Text></Bezel>
      <Card padding="none"><List>{comps.map(([n, st]) => <ListItem key={n} title={n} description={<span style={{ display: "flex", gap: 2, marginTop: 6 }}>{Array.from({ length: 45 }, (_, i) => <span key={i} {...stylex.props(s.up, st === "degraded" && i > 41 && s.upWarn, i === 17 && n === "API" && s.upBad)} />)}</span>} trailing={<StatusPill status={st === "ok" ? "active" : "pending"}>{st === "ok" ? "Operational" : "Degraded"}</StatusPill>} />)}</List></Card>
      <Text variant="caption">99.98% uptime over the last 90 days · <a href="#">Subscribe to updates</a></Text>
    </div></main>
  );
}
function Changelog() {
  const rel = [["Nov 18", "Workflow builder", "Build lead routing and follow-ups on a canvas. Triggers, filters and actions, with a live preview of matching records.", "New"], ["Nov 4", "Assistant approvals", "Agents now ask before sending email, changing owners or applying discounts.", "New"], ["Oct 21", "Faster tables", "Tables with 50k rows scroll at 60fps and sort in under 100ms.", "Improved"]];
  return <ScreenShell active="sys-changelog" header={{ title: "What's new" }} pageWidth="narrow">{rel.map(([d, t, b, k]) => <article key={t} {...stylex.props(s.release)}><span {...stylex.props(s.mono)}>{d}</span><div style={{ display: "flex", flexDirection: "column", gap: 8 }}><span style={{ display: "flex", gap: 8, alignItems: "center" }}><Text variant="h3">{t}</Text><Tag size="sm" tone={k === "New" ? "blue" : "gray"}>{k}</Tag></span><Text tone="muted">{b}</Text></div></article>)}</ScreenShell>;
}
function Help() {
  return (
    <ScreenShell active="sys-help" header={{ title: "Help center" }}>
      <div {...stylex.props(s.center)}><h1 {...stylex.props(s.h1)}>How can we help?</h1><SearchInput placeholder="Search articles" style={{ width: "100%", maxWidth: 480 }} /></div>
      <div {...stylex.props(s.aiGrid)}>{[["Getting started", "Set up your workspace and import data", <IconBook />], ["Workflows", "Automate routing and follow-ups", <IconZap />], ["Billing", "Plans, invoices and seats", <IconFile />], ["Security", "SSO, roles and the audit log", <IconShield />], ["Integrations", "Slack, Gmail, Stripe and more", <IconGlobe />], ["Team", "Invite people and set permissions", <IconUsers />]].map(([t, d, ic]) => <Card key={t as string}><div style={{ display: "flex", gap: 12 }}>{ic}<span style={{ display: "flex", flexDirection: "column", gap: 2 }}><Text weight="semibold">{t}</Text><Text variant="caption">{d}</Text></span></div></Card>)}</div>
    </ScreenShell>
  );
}
function GlobalSearch() {
  const [q, setQ] = useState("figma");
  return (
    <ScreenShell active="dash-home" header={{ title: "Search" }} pageWidth="narrow">
      <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search everything" />
      <TabMenu value="all" onValueChange={() => {}} items={[{ value: "all", label: "All", count: 9 }, { value: "people", label: "People", count: 4 }, { value: "companies", label: "Companies", count: 1 }, { value: "deals", label: "Deals", count: 3 }, { value: "files", label: "Files", count: 1 }]} />
      {[["Companies", companies.filter((c) => c.name === "Figma").map((c) => [c.name, c.domain])], ["Deals", deals.slice(0, 3).map((d) => [d.name, money(d.value)])], ["People", people.slice(0, 4).map((p) => [p.name, p.title])]].map(([g, list]) => <section key={g as string} style={{ display: "flex", flexDirection: "column", gap: 8 }}><Text variant="eyebrow">{g as string}</Text><Card padding="none"><List>{(list as string[][]).map(([t, d]) => <ListItem key={t} leading={<Avatar name={t} size="sm" shape={g === "People" ? "circle" : "square"} />} title={t} description={d} onClick={() => {}} />)}</List></Card></section>)}
    </ScreenShell>
  );
}

export const moreScreens = [
  { id: "com-pricing", title: "Pricing", category: "Billing", render: () => <Pricing /> },
  { id: "com-compare", title: "Compare plans", category: "Billing", render: () => <Compare /> },
  { id: "com-checkout", title: "Checkout", category: "Billing", render: () => <Checkout /> },
  { id: "com-success", title: "Payment success", category: "Billing", render: () => <Success /> },
  { id: "com-usage", title: "Usage", category: "Billing", render: () => <Usage /> },
  { id: "com-upgrade", title: "Upgrade prompt", category: "Billing", render: () => <Upgrade /> },
  { id: "com-pay", title: "Pay invoice", category: "Billing", render: () => <PayInvoice /> },
  { id: "ai-assistant", title: "Assistant", category: "AI", render: () => <Assistant /> },
  { id: "ai-runs", title: "Agent runs", category: "AI", render: () => <AgentRuns /> },
  { id: "ai-run", title: "Agent run", category: "AI", render: () => <AgentRun /> },
  { id: "ai-prompts", title: "Prompt library", category: "AI", render: () => <Prompts /> },
  { id: "ai-knowledge", title: "Knowledge sources", category: "AI", render: () => <Knowledge /> },
  { id: "ai-approvals", title: "Approvals", category: "AI", render: () => <Approvals /> },
  { id: "ai-search", title: "Ask (AI search)", category: "AI", render: () => <AiSearch /> },
  { id: "ai-settings", title: "Assistant settings", category: "AI", render: () => <ModelSettings /> },
  { id: "sys-404", title: "Not found", category: "System", render: () => <NotFound /> },
  { id: "sys-500", title: "Server error", category: "System", render: () => <ServerError /> },
  { id: "sys-403", title: "No access", category: "System", render: () => <Forbidden /> },
  { id: "sys-maintenance", title: "Maintenance", category: "System", render: () => <Maintenance /> },
  { id: "sys-offline", title: "Offline", category: "System", render: () => <Offline /> },
  { id: "sys-empty", title: "Empty state", category: "System", render: () => <EmptyHome /> },
  { id: "sys-status", title: "Status page", category: "System", render: () => <Status /> },
  { id: "sys-changelog", title: "Changelog", category: "System", render: () => <Changelog /> },
  { id: "sys-help", title: "Help center", category: "System", render: () => <Help /> },
  { id: "sys-search", title: "Global search", category: "System", render: () => <GlobalSearch /> },
];
void [Citation, CodeBlock, Heatmap, BulletChart, RecommendationCard, ProgressBar, Kbd, IconArrowLeft, IconSearch, Timeline, Input, CardBody, Card];
