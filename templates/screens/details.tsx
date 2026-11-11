/* Record pages — 10 screens. One layout (identity header, tabs, main column, metadata rail), each with its own content. */
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import {
  Avatar, AvatarGroup, Bezel, Breadcrumbs, Button, Card, CardBody, CardHeader, ChatComposer, ChatMessage, CopyButton, DiffTable, DropdownMenuItem, IconCalendar, IconCheck,
  IconEdit, IconMail, IconMoreHorizontal, IconPhone, IconPlus, IconFile as IconPrinter, IconDownload, IconSend, InlineEdit, LineChart, List, ListItem, MetadataList, MoreMenu, ProgressBar,
  Rating, SegmentBar, Stat, StatGroup, StatusPill, Stepper, TabList, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tag, Text, TextArea,
  Timeline, Toolbar, ToolbarButton, ToolbarSeparator, IconBold, IconItalic, IconLink, IconGlobe, IconBuilding, RecommendationCard, Divider, Code, BulletChart, BarList,
  IconStar, Tokenizer, Kbd,
} from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";
import { companies, deals, money, num, people, ScreenShell, series, useGo, weeks } from "./kit";

const s = stylex.create({
  layout: { display: "grid", gap: 20, alignItems: "start", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1100px)": "minmax(0, 1fr) 320px" } },
  main: { display: "flex", flexDirection: "column", gap: 16, minWidth: 0 },
  rail: { display: "flex", flexDirection: "column", gap: 16, minWidth: 0, position: { default: "static", "@media (min-width: 1100px)": "sticky" }, top: 76 },
  id: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  idText: { display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flexGrow: 1, flexShrink: 1, flexBasis: 200 },
  h1: { fontSize: { default: "22px", "@media (min-width: 768px)": "26px" }, fontWeight: font.semibold, letterSpacing: "-0.02em", lineHeight: 1.15 },
  row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  doc: { maxWidth: 820, width: "100%", marginInline: "auto", padding: { default: 20, "@media (min-width: 768px)": 40 }, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.dialog, display: "flex", flexDirection: "column", gap: 28 },
  docHead: { display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  big: { fontSize: "32px", fontWeight: font.semibold, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" },
  mono: { fontFamily: font.mono, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgMuted },
  thread: { display: "flex", flexDirection: "column", gap: 20 },
});

function Identity({ avatar, title, sub, tags, actions }: { avatar: ReactNode; title: ReactNode; sub: ReactNode; tags?: ReactNode; actions?: ReactNode }) {
  return (
    <div {...stylex.props(s.id)}>
      {avatar}
      <div {...stylex.props(s.idText)}><h1 {...stylex.props(s.h1)}>{title}</h1><span {...stylex.props(s.row)}><Text tone="muted">{sub}</Text>{tags}</span></div>
      {actions && <div {...stylex.props(s.row)}>{actions}</div>}
    </div>
  );
}
const Layout = ({ main, rail }: { main: ReactNode; rail: ReactNode }) => <div {...stylex.props(s.layout)}><div {...stylex.props(s.main)}>{main}</div><aside {...stylex.props(s.rail)}>{rail}</aside></div>;
const activity = <Timeline events={[{ id: "1", title: "Email opened · “Q4 proposal”", time: "2h ago", tone: "info" }, { id: "2", title: "Call · 24 min", body: "Wants SSO + audit log before signing.", time: "Yesterday", marker: <Avatar name="Maya Okafor" size="xs" /> }, { id: "3", title: "Stage moved to Negotiation", time: "Nov 12" }, { id: "4", title: "Created from LinkedIn import", time: "Oct 2" }]} />;
const notes = <Card><TextArea placeholder="Add a note… (@ to mention)" autoGrow rows={2} aria-label="Note" /><div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}><Button size="sm" variant="primary">Save note</Button></div></Card>;

function PersonDetail() {
  const p = people[3];
  return (
    <ScreenShell active="list-people" header={{ title: p.name, breadcrumb: <Breadcrumbs items={[{ label: "People", href: "#" }, { label: p.name }]} /> }} pageWidth="wide">
      <Identity avatar={<Avatar name={p.name} size="xl" status="online" />} title={p.name} sub={`${p.title} · ${p.company}`} tags={<StatusPill status="active">{p.stage}</StatusPill>}
        actions={<><Button leading={<IconPhone />}>Call</Button><Button variant="primary" leading={<IconMail />}>Email</Button><MoreMenu items={[{ label: "Add to sequence" }, { label: "Merge duplicate" }, "separator", { label: "Delete", destructive: true }]} /></>} />
      <Layout
        main={<TabList items={[
          { value: "activity", label: "Activity", count: 14, content: <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 12 }}>{notes}<Card>{activity}</Card></div> },
          { value: "deals", label: "Deals", count: 2, content: <Card padding="none" style={{ marginTop: 12 }}><List>{deals.slice(0, 2).map((d) => <ListItem key={d.id} title={d.name} description={`${d.stage} · closes ${d.close}`} meta={money(d.value)} />)}</List></Card> },
          { value: "emails", label: "Emails", count: 31, content: <Card padding="none" style={{ marginTop: 12 }}><List>{["Re: Q4 proposal", "Security questionnaire", "Intro — Northwind × Zoom"].map((t, i) => <ListItem key={t} leading={<Avatar name={i ? p.name : "Maya Okafor"} size="sm" />} title={t} description="Thanks — looping in our security lead so we can…" meta={["2h", "Tue", "Oct 2"][i]} />)}</List></Card> },
        ]} />}
        rail={<>
          <Card><MetadataList layout="stacked" items={[{ label: "Email", value: <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>{p.email}<CopyButton value={p.email} size="xs" /></span> }, { label: "Direct number", value: p.phone }, { label: "Company", value: p.company }, { label: "City", value: p.city }, { label: "Owner", value: <InlineEdit label="Owner" value={p.owner} onSave={() => {}} /> }]} /></Card>
          <Stat variant="card" label="Lead score" value={p.score} progress={{ value: p.score, style: "segments", label: "Top 15% of leads" }} />
          <Card><Text variant="eyebrow">Tags</Text><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{["Decision maker", "SSO", "Q4"].map((t) => <Tag key={t} size="sm" variant="outline">{t}</Tag>)}</div></Card>
        </>} />
    </ScreenShell>
  );
}

function CompanyDetail() {
  const c = companies[2];
  return (
    <ScreenShell active="list-companies" header={{ title: c.name, breadcrumb: <Breadcrumbs items={[{ label: "Companies", href: "#" }, { label: c.name }]} /> }} pageWidth="wide">
      <Identity avatar={<Avatar name={c.name} size="xl" shape="square" />} title={c.name} sub={<span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><IconGlobe size={14} />{c.domain}</span>} tags={<Tag size="sm" variant="outline">{c.plan}</Tag>}
        actions={<><Button leading={<IconCalendar />}>Book QBR</Button><Button variant="primary" leading={<IconPlus />}>New deal</Button></>} />
      <StatGroup><Stat label="ARR" value={money(c.arr)} delta={12} baseline="YoY" /><Stat label="Seats" value="84 / 100" progress={{ value: 84 }} /><Stat label="Health" value={c.health} progress={{ value: c.health, style: "ring" }} /><Stat label="Open tickets" value="3" compare={{ label: "Median", value: "5" }} /></StatGroup>
      <Layout
        main={<>
          <Card padding="none"><CardHeader title="Usage" description="Weekly active seats" /><CardBody><LineChart label="Weekly active seats" labels={weeks} series={[{ name: "Active seats", values: series(60, 0.02) }]} height={200} /></CardBody></Card>
          <Card padding="none"><CardHeader title="People" description="5 contacts" action={<Button size="sm" leading={<IconPlus />}>Add</Button>} /><List>{people.slice(0, 5).map((p) => <ListItem key={p.id} leading={<Avatar name={p.name} size="sm" />} title={p.name} description={p.title} meta={p.lastSeen} />)}</List></Card>
        </>}
        rail={<>
          <Card><MetadataList layout="stacked" items={[{ label: "Industry", value: c.industry }, { label: "Employees", value: num(c.employees) }, { label: "HQ", value: c.city }, { label: "Owner", value: c.owner }, { label: "Customer since", value: "Mar 2023" }]} /></Card>
          <RecommendationCard title="Offer the Scale plan" rationale="Seat usage has been above 80% for 6 weeks and they asked about SSO twice." confidence={0.78} actions={<Button size="sm" variant="primary">Draft offer</Button>} />
        </>} />
    </ScreenShell>
  );
}

function DealDetail() {
  const d = deals[4];
  const stages = ["Discovery", "Proposal", "Negotiation", "Won"];
  return (
    <ScreenShell active="list-deals" header={{ title: d.name, breadcrumb: <Breadcrumbs items={[{ label: "Deals", href: "#" }, { label: d.name }]} /> }} pageWidth="wide">
      <Identity avatar={<Avatar name={d.company} size="xl" shape="square" />} title={d.name} sub={`${money(d.value)} · closes ${d.close}`} tags={<StatusPill status="pending">{d.stage}</StatusPill>}
        actions={<><Button>Mark lost</Button><Button variant="primary" leading={<IconCheck />}>Mark won</Button></>} />
      <Card><Stepper current={Math.max(0, stages.indexOf(d.stage))} steps={stages.map((t) => ({ title: t }))} /></Card>
      <Layout
        main={<>
          <Card padding="none"><CardHeader title="Line items" /><Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead align="right">Qty</TableHead><TableHead align="right">Price</TableHead><TableHead align="right">Total</TableHead></TableRow></TableHeader>
            <TableBody>{[["Scale plan · seats", 120, 39], ["Assistant add-on", 120, 12], ["Onboarding", 1, 4800]].map(([n, q, pr]) => <TableRow key={n as string}><TableCell>{n}</TableCell><TableCell align="right">{q}</TableCell><TableCell align="right">{money(pr as number)}</TableCell><TableCell align="right">{money((q as number) * (pr as number))}</TableCell></TableRow>)}</TableBody>
            <TableFooter><TableRow><TableCell colSpan={3}>Annual total</TableCell><TableCell align="right"><b>{money(120 * 39 * 12 + 120 * 12 * 12 + 4800)}</b></TableCell></TableRow></TableFooter></Table></Card>
          <Card>{activity}</Card>
        </>}
        rail={<>
          <Card><MetadataList layout="stacked" items={[{ label: "Value", value: money(d.value) }, { label: "Probability", value: <ProgressBar value={d.probability} showValue /> }, { label: "Owner", value: d.owner }, { label: "Stakeholders", value: <AvatarGroup people={people.slice(0, 4)} max={3} size="sm" /> }]} /></Card>
          <Bezel label="Next step"><Text weight="medium">Security review with IT</Text><Text tone="muted">Thu, Nov 20 · 14:00</Text><Button size="sm" leading={<IconCalendar />}>Reschedule</Button></Bezel>
        </>} />
    </ScreenShell>
  );
}

function InvoiceView() {
  const lines = [["Scale plan — 120 seats × 1 mo", 4680], ["Assistant add-on — 120 seats", 1440], ["Priority support", 600]] as const;
  const sub = lines.reduce((a, l) => a + l[1], 0);
  return (
    <ScreenShell active="list-invoices" header={{ title: "INV-2063", status: <StatusPill status="pending">Due Nov 30</StatusPill>, actions: <><Button size="sm" leading={<IconDownload />}>PDF</Button><Button size="sm" leading={<IconPrinter />}>Print</Button><Button size="sm" variant="primary" leading={<IconSend />}>Send</Button></> }}>
      <div {...stylex.props(s.doc)}>
        <div {...stylex.props(s.docHead)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span {...stylex.props(s.mono)}>Invoice</span><span {...stylex.props(s.big)}>{money(sub * 1.2)}</span><Text tone="muted">Due Nov 30, 2026 · INV-2063</Text></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "end" }}><Text weight="semibold">Northwind Inc.</Text><Text variant="caption">12 Harbour St, Berlin</Text><Text variant="caption">VAT DE 312 445 901</Text></div>
        </div>
        <MetadataList columns={3} layout="stacked" items={[{ label: "Billed to", value: "Tidewater Energy" }, { label: "Issued", value: "Oct 31, 2026" }, { label: "Terms", value: "Net 30" }]} />
        <Table><TableHeader><TableRow><TableHead>Description</TableHead><TableHead align="right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>{lines.map(([n, v]) => <TableRow key={n}><TableCell>{n}</TableCell><TableCell align="right">{money(v)}</TableCell></TableRow>)}</TableBody>
          <TableFooter><TableRow><TableCell>Subtotal</TableCell><TableCell align="right">{money(sub)}</TableCell></TableRow><TableRow><TableCell>VAT 20%</TableCell><TableCell align="right">{money(sub * 0.2)}</TableCell></TableRow><TableRow><TableCell><b>Total due</b></TableCell><TableCell align="right"><b>{money(sub * 1.2)}</b></TableCell></TableRow></TableFooter></Table>
        <Divider />
        <Text variant="caption">Pay by bank transfer to IBAN DE89 3704 0044 0532 0130 00 or online at pay.northwind.io/inv-2063.</Text>
      </div>
    </ScreenShell>
  );
}

function TicketDetail() {
  const [v, setV] = useState("");
  return (
    <ScreenShell active="inbox" header={{ title: "SSO login loop", status: <StatusPill status="active">Open</StatusPill>, breadcrumb: <Breadcrumbs items={[{ label: "Tickets", href: "#" }, { label: "T-8812" }]} />, actions: <><Button size="sm">Snooze</Button><Button size="sm" variant="primary" leading={<IconCheck />}>Solve</Button></> }} pageWidth="wide">
      <Layout
        main={<>
          <div {...stylex.props(s.thread)}>
            <ChatMessage role="user" author={{ name: "Ines Haddad" }} content={"Since this morning our team gets bounced back to the login page after Okta. Cleared cookies, same thing. 40 people blocked."} metadata={["Email · 09:12"]} />
            <ChatMessage role="assistant" author={{ name: "Rafi Ahmed" }} content={"Thanks Ines — we see a clock-skew error on your IdP's SAML responses. Could you check your Okta app's **Assertion validity**? We'll also widen the tolerance on our side."} metadata={["09:31 · seen"]} />
            <ChatMessage role="user" author={{ name: "Ines Haddad" }} content={"Fixed the validity window. Works now — thank you!"} metadata={["09:58"]} />
          </div>
          <ChatComposer value={v} onValueChange={setV} onSubmit={() => setV("")} placeholder="Reply to Ines…" dictation={false} />
        </>}
        rail={<>
          <Card><MetadataList layout="stacked" items={[{ label: "Requester", value: <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Avatar name="Ines Haddad" size="xs" />Ines Haddad</span> }, { label: "Company", value: "Snapchat · Enterprise" }, { label: "Priority", value: <Tag size="sm" tone="red" dot>Urgent</Tag> }, { label: "Assignee", value: "Rafi Ahmed" }, { label: "SLA", value: <ProgressBar value={62} showValue /> }]} /></Card>
          <Card><Text variant="eyebrow">Shortcuts</Text><div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>{[["Reply", "R"], ["Solve", "⌘↵"], ["Assign to me", "I"]].map(([l, k]) => <span key={l} style={{ display: "flex", justifyContent: "space-between" }}><Text>{l}</Text><Kbd>{k}</Kbd></span>)}</div></Card>
        </>} />
    </ScreenShell>
  );
}

function ProjectDetail() {
  return (
    <ScreenShell active="work-kanban" header={{ title: "Billing v2", status: <StatusPill status="warning">At risk</StatusPill>, actions: <Button size="sm" variant="primary" leading={<IconPlus />}>Add task</Button> }} pageWidth="wide">
      <StatGroup><Stat label="Progress" value="64%" progress={{ value: 64, target: 75, label: "Plan: 75% by today" }} /><Stat label="Open tasks" value="23" delta={-5} deltaUnit="" lowerIsBetter baseline="this week" /><Stat label="Due" value="Dec 12" compare={{ label: "Original", value: "Nov 28" }} /><Stat label="Team" value="6" chart={<AvatarGroup people={people.slice(0, 6)} max={5} size="sm" />} /></StatGroup>
      <Layout
        main={<>
          <Card padding="none"><CardHeader title="Milestones" /><CardBody><Stepper orientation="vertical" current={2} steps={[{ title: "Data model", description: "Done Oct 14" }, { title: "Proration engine", description: "Done Nov 3" }, { title: "Invoice templates", description: "In progress · Lena" }, { title: "Migration", description: "Dec 1" }, { title: "Launch", description: "Dec 12" }]} /></CardBody></Card>
          <Card padding="none"><CardHeader title="Burndown" /><CardBody><LineChart label="Open tasks over time" labels={weeks.slice(0, 8)} zero series={[{ name: "Actual", values: [62, 58, 55, 49, 44, 38, 31, 23] }, { name: "Ideal", values: [62, 54, 47, 39, 31, 23, 16, 8], color: "muted", dashed: true }]} legend height={200} /></CardBody></Card>
        </>}
        rail={<><Card><MetadataList layout="stacked" items={[{ label: "Lead", value: "Lena Novak" }, { label: "Started", value: "Sep 22" }, { label: "Budget", value: <BulletChart label="spent" value={78} target={100} ranges={[60, 90]} max={110} format={(n) => `${n}%`} /> }]} /></Card><Card>{activity}</Card></>} />
    </ScreenShell>
  );
}

function OrderDetail() {
  return (
    <ScreenShell active="list-orders" header={{ title: "Order #48231", status: <StatusPill status="pending">Processing</StatusPill>, actions: <><Button size="sm">Refund</Button><Button size="sm" variant="primary">Fulfil items</Button></> }} pageWidth="wide">
      <Layout
        main={<>
          <Card padding="none"><CardHeader title="Items" description="3 items · ships from Berlin" /><List>{[["Field jacket · M", 1, 189], ["Merino tee · L", 2, 48], ["Canvas tote", 1, 36]].map(([n, q, p]) => <ListItem key={n as string} leading={<Avatar name={n as string} size="lg" shape="square" />} title={n} description={`Qty ${q}`} meta={money((q as number) * (p as number))} />)}</List></Card>
          <Card><Stepper current={1} steps={[{ title: "Paid", description: "Nov 17, 14:02" }, { title: "Packed" }, { title: "Shipped" }, { title: "Delivered" }]} /></Card>
          <Card>{activity}</Card>
        </>}
        rail={<><Card><MetadataList layout="stacked" items={[{ label: "Customer", value: "Emma Rivers" }, { label: "Email", value: "emma@rivers.com" }, { label: "Ship to", value: "Torstraße 92, 10119 Berlin" }, { label: "Payment", value: "Visa ··4242" }]} /></Card>
          <Card><MetadataList items={[{ label: "Subtotal", value: money(321) }, { label: "Shipping", value: money(9) }, { label: "Tax", value: money(62.7) }, { label: <b>Total</b>, value: <b>{money(392.7)}</b> }]} /></Card></>} />
    </ScreenShell>
  );
}

function EmployeeProfile() {
  const p = people[8];
  return (
    <ScreenShell active="list-employees" header={{ title: p.name, breadcrumb: <Breadcrumbs items={[{ label: "Team", href: "#" }, { label: p.name }]} /> }} pageWidth="wide">
      <Identity avatar={<Avatar name={p.name} size="xl" status="online" />} title={p.name} sub="Senior Product Designer · Growth" tags={<Tag size="sm">Berlin</Tag>} actions={<Button leading={<IconEdit />}>Edit profile</Button>} />
      <Layout
        main={<TabList items={[
          { value: "about", label: "About", content: <Card style={{ marginTop: 12 }}><MetadataList columns={2} items={[{ label: "Manager", value: "Lena Novak" }, { label: "Start date", value: "Mar 4, 2024" }, { label: "Employment", value: "Full-time" }, { label: "Time zone", value: "CET (UTC+1)" }, { label: "Email", value: p.email }, { label: "Phone", value: p.phone }]} /></Card> },
          { value: "time", label: "Time off", content: <Card padding="none" style={{ marginTop: 12 }}><List>{[["Vacation", "Dec 22 – Jan 2", "Approved"], ["Sick leave", "Oct 3", "Logged"]].map(([t, d, st]) => <ListItem key={t} title={t} description={d} trailing={<StatusPill status={st === "Approved" ? "active" : "neutral"}>{st}</StatusPill>} />)}</List></Card> },
          { value: "reviews", label: "Reviews", content: <Card style={{ marginTop: 12 }}><Text weight="medium">H1 2026 · Exceeds</Text><Rating value={4} readOnly /><Text tone="muted">“Raised the bar for design reviews and shipped the new onboarding.”</Text></Card> },
        ]} />}
        rail={<><Stat variant="card" label="Vacation balance" value="14 days" progress={{ value: 14, max: 26, label: "of 26 this year" }} /><Card><Text variant="eyebrow">Skills</Text><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{["Figma", "Prototyping", "Research", "Design systems"].map((t) => <Tag key={t} size="sm">{t}</Tag>)}</div></Card></>} />
    </ScreenShell>
  );
}

function CandidateDetail() {
  return (
    <ScreenShell active="list-candidates" header={{ title: "Priya Raman", breadcrumb: <Breadcrumbs items={[{ label: "Candidates", href: "#" }, { label: "Priya Raman" }]} />, actions: <><Button size="sm">Reject</Button><Button size="sm" variant="primary">Move to offer</Button></> }} pageWidth="wide">
      <Identity avatar={<Avatar name="Priya Raman" size="xl" />} title="Priya Raman" sub="Staff Engineer · Referral from Kenji" tags={<Tag size="sm" variant="solid" tone="blue">Interview</Tag>} />
      <Card><Stepper current={2} steps={[{ title: "Applied" }, { title: "Screen" }, { title: "Interviews" }, { title: "Offer" }, { title: "Hired" }]} /></Card>
      <Layout
        main={<Card padding="none"><CardHeader title="Scorecards" description="3 of 4 submitted" /><List>{[["System design", "Kenji Sato", 5], ["Coding", "Omar Haddad", 4], ["Values", "Lena Novak", 4]].map(([t, w, r]) => <ListItem key={t as string} leading={<Avatar name={w as string} size="sm" />} title={t} description={`by ${w}`} trailing={<Rating value={r as number} readOnly size={14} />} />)}<ListItem title="Hiring manager" description="Waiting on Maya Okafor" trailing={<Button size="xs">Remind</Button>} /></List></Card>}
        rail={<Card><MetadataList layout="stacked" items={[{ label: "Email", value: "priya@raman.dev" }, { label: "Location", value: "Toronto · remote" }, { label: "Expected", value: "$210–230k" }, { label: "Notice", value: "4 weeks" }, { label: "Resume", value: <Button size="xs" leading={<IconDownload />}>priya-raman.pdf</Button> }]} /></Card>} />
    </ScreenShell>
  );
}

function ProductDetail() {
  const [tags, setTags] = useState([{ value: "outerwear", label: "Outerwear" }, { value: "best", label: "Bestseller" }]);
  return (
    <ScreenShell active="list-products" header={{ title: "Field jacket", status: <StatusPill status="active">Active</StatusPill>, actions: <><Button size="sm">Preview</Button><Button size="sm" variant="primary">Save</Button></> }} pageWidth="wide">
      <Layout
        main={<>
          <Card><div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Text variant="eyebrow">Description</Text>
            <Toolbar variant="flat"><ToolbarButton label="Bold"><IconBold /></ToolbarButton><ToolbarButton label="Italic"><IconItalic /></ToolbarButton><ToolbarSeparator /><ToolbarButton label="Link"><IconLink /></ToolbarButton></Toolbar>
            <TextArea defaultValue="Waxed cotton shell with a corduroy collar. Four pockets, two-way zip, and a lining that breathes on warm days." autoGrow aria-label="Description" /></div></Card>
          <Card padding="none"><CardHeader title="Variants" description="4 sizes · 2 colors" /><Table><TableHeader><TableRow><TableHead>Variant</TableHead><TableHead align="right">Price</TableHead><TableHead align="right">Stock</TableHead></TableRow></TableHeader><TableBody>{["S · Olive", "M · Olive", "L · Navy", "XL · Navy"].map((v, i) => <TableRow key={v}><TableCell>{v}</TableCell><TableCell align="right">{money(189)}</TableCell><TableCell align="right">{[12, 0, 44, 8][i] || <Text tone="danger">Out</Text>}</TableCell></TableRow>)}</TableBody></Table></Card>
        </>}
        rail={<><Card><MetadataList layout="stacked" items={[{ label: "SKU", value: <Code>FJ-OLV</Code> }, { label: "Category", value: "Apparel" }, { label: "Tags", value: <Tokenizer value={tags} onValueChange={setTags} placeholder="Add tag" allowCreate source={async (q) => ["Outerwear", "Bestseller", "Winter", "Sale"].filter((t) => t.toLowerCase().includes(q.toLowerCase())).map((t) => ({ value: t.toLowerCase(), label: t }))} /> }]} /></Card>
          <Card padding="none"><CardHeader title="Sales by size" /><CardBody><BarList items={[{ name: "M", value: 412 }, { name: "L", value: 388 }, { name: "S", value: 201 }, { name: "XL", value: 143 }]} /></CardBody></Card></>} />
    </ScreenShell>
  );
}

export const detailScreens = [
  { id: "detail-person", title: "Person", category: "Records", render: () => <PersonDetail /> },
  { id: "detail-company", title: "Company", category: "Records", render: () => <CompanyDetail /> },
  { id: "detail-deal", title: "Deal", category: "Records", render: () => <DealDetail /> },
  { id: "detail-invoice", title: "Invoice", category: "Records", render: () => <InvoiceView /> },
  { id: "detail-ticket", title: "Ticket", category: "Records", render: () => <TicketDetail /> },
  { id: "detail-project", title: "Project", category: "Records", render: () => <ProjectDetail /> },
  { id: "detail-order", title: "Order", category: "Records", render: () => <OrderDetail /> },
  { id: "detail-employee", title: "Employee profile", category: "Records", render: () => <EmployeeProfile /> },
  { id: "detail-candidate", title: "Candidate", category: "Records", render: () => <CandidateDetail /> },
  { id: "detail-product", title: "Product", category: "Records", render: () => <ProductDetail /> },
];
void [DiffTable, DropdownMenuItem, IconMoreHorizontal, IconBuilding, IconStar, SegmentBar, useGo, CardBody];
