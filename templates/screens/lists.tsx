/* List screens — one table pattern, many records. Each config is a real screen: its own columns, filters, tabs and detail drawer. */
import { useMemo, useState, type ReactNode } from "react";
import {
  Avatar, Button, DataTable, Drawer, DrawerContent, DrawerSection, DropdownMenuItem, DropdownMenuSeparator, EmptyState, FilterMenu, IconArchive, IconCopy, IconDownload,
  IconEdit, IconFilter, IconMail, IconPlus, IconTrash, IconUpload, MetadataList, ProgressBar, SearchInput, SegmentBar, Sparkline, StatusPill, Tag, Text, Timeline,
  TabMenu, useToast, type Column, type Status, type Tone, IconBookmark, IconBuilding, IconGlobe, IconPhone, IconUser, IconChevronDown, Stat, StatGroup,
} from "@keel/components";
import { companies, deals, int, money, num, people, pick, ScreenShell, type Company, type Deal, type Person } from "./kit";

type Row = Record<string, unknown> & { id: string };
export type ListConfig<T extends Row> = {
  id: string; title: string; nav?: string; noun: string; plural?: string; data: T[]; columns: Column<T>[];
  search: (r: T) => string; tabs?: { value: string; label: string; filter?: (r: T) => boolean }[];
  filter?: { label: string; key: keyof T & string; icon?: ReactNode };
  detail?: (r: T) => { title: ReactNode; description?: ReactNode; eyebrow?: ReactNode; meta: { label: ReactNode; value: ReactNode }[]; extra?: ReactNode };
  primary?: string; stats?: ReactNode;
};

/** The shared list screen: count tabs, search, filters, saved views, a sortable table, bulk actions and a detail drawer. */
export function ListScreen<T extends Row>({ cfg }: { cfg: ListConfig<T> }) {
  const toast = useToast();
  const [tab, setTab] = useState(cfg.tabs?.[0]?.value ?? "all");
  const [q, setQ] = useState("");
  const [vals, setVals] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = useMemo(() => cfg.data.filter((r) => {
    const t = cfg.tabs?.find((x) => x.value === tab);
    if (t?.filter && !t.filter(r)) return false;
    if (q && !cfg.search(r).toLowerCase().includes(q.toLowerCase())) return false;
    if (cfg.filter && vals.length && !vals.includes(String(r[cfg.filter.key]))) return false;
    return true;
  }), [cfg, tab, q, vals]);
  const open = cfg.data.find((r) => r.id === openId);
  const det = open && cfg.detail?.(open);
  const filterOpts = cfg.filter ? [...new Set(cfg.data.map((r) => String(r[cfg.filter!.key])))].map((v) => ({ value: v, label: v, count: cfg.data.filter((r) => String(r[cfg.filter!.key]) === v).length })) : [];
  return (
    <ScreenShell active={cfg.nav ?? cfg.id} header={{
      title: cfg.title, status: <Tag size="sm">{num(cfg.data.length)}</Tag>,
      actions: <><Button size="sm" leading={<IconDownload />}>Export</Button><Button size="sm" variant="primary" leading={<IconPlus />}>{cfg.primary ?? `New ${cfg.noun}`}</Button></>,
    }}>
      {cfg.stats}
      {cfg.tabs && <TabMenu value={tab} onValueChange={setTab} items={cfg.tabs.map((t) => ({ value: t.value, label: t.label, count: t.filter ? cfg.data.filter(t.filter).length : cfg.data.length }))} />}
      <DataTable data={rows} columns={cfg.columns} getRowId={(r) => r.id} selectable pageSize={12} caption={cfg.title} stickyHeader
        activeRowId={openId} onRowClick={cfg.detail ? (r) => setOpenId(r.id) : undefined}
        empty={<EmptyState compact title={`No ${cfg.plural ?? cfg.noun + "s"} match`} description="Try a different search or clear the filters." actions={<Button size="sm" onClick={() => { setQ(""); setVals([]); }}>Clear filters</Button>} />}
        toolbar={<>
          <SearchInput size="sm" placeholder={`Search ${cfg.plural ?? cfg.noun + "s"}`} value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220, maxWidth: "100%" }} shortcut="/" />
          {cfg.filter && <FilterMenu label={cfg.filter.label} value={vals} onValueChange={setVals} options={filterOpts} />}
          <Button size="sm" variant="ghost" leading={<IconBookmark />} trailing={<IconChevronDown />}>Saved views</Button>
        </>}
        rowActions={(r) => <>
          {cfg.detail && <DropdownMenuItem icon={<IconEdit />} shortcut="↵" onSelect={() => setOpenId(r.id)}>Open</DropdownMenuItem>}
          <DropdownMenuItem icon={<IconCopy />} onSelect={() => toast({ title: "ID copied" })}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconTrash />} destructive onSelect={() => toast({ title: `${cfg.noun} deleted`, action: { label: "Undo", onClick: () => {} } })}>Delete</DropdownMenuItem>
        </>}
        bulkActions={(sel, clear) => <>
          <Button size="sm" leading={<IconArchive />} onClick={() => { clear(); toast({ title: `${sel.length} archived`, action: { label: "Undo", onClick: () => {} } }); }}>Archive</Button>
          <Button size="sm" variant="danger" leading={<IconTrash />} onClick={() => { clear(); toast({ title: `${sel.length} deleted` }); }}>Delete</Button>
        </>}
      />
      <Drawer open={Boolean(det)} onOpenChange={(o) => !o && setOpenId(null)}>
        {det && (
          <DrawerContent size="lg" title={det.title} description={det.description} eyebrow={det.eyebrow}
            footer={<><Button onClick={() => setOpenId(null)}>Close</Button><Button variant="primary" leading={<IconMail />}>Send email</Button></>}>
            <DrawerSection title="Details"><MetadataList items={det.meta} /></DrawerSection>
            {det.extra}
            <DrawerSection title="Activity"><Timeline events={[{ id: "1", title: "Opened the proposal", time: "2h ago", tone: "info" }, { id: "2", title: "Replied to sequence step 2", time: "Yesterday" }, { id: "3", title: "Added by Maya Okafor", time: "Oct 12", marker: <Avatar name="Maya Okafor" size="xs" /> }]} /></DrawerSection>
          </DrawerContent>
        )}
      </Drawer>
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ cell helpers */
const who = (name: string, sub?: string) => <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}><Avatar name={name} size="sm" /><span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}><Text weight="medium" truncate>{name}</Text>{sub && <Text variant="caption" truncate>{sub}</Text>}</span></span>;
const logo = (name: string) => <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}><Avatar name={name} size="xs" shape="square" /><Text truncate>{name}</Text></span>;
const stageTone: Record<string, Status> = { Lead: "neutral", Qualified: "info", Customer: "active", Churned: "danger", Discovery: "neutral", Proposal: "info", Negotiation: "pending", Won: "active", Lost: "danger" };
const tone = (v: string): Tone => (["CRM", "Fintech", "Tech"].includes(v) ? "blue" : ["Productivity", "Media"].includes(v) ? "green" : "gray");
const pill = (v: string) => <StatusPill status={stageTone[v] ?? "neutral"}>{v}</StatusPill>;

/* ------------------------------------------------------------------ data for the other lists */
const mk = <T,>(n: number, f: (i: number) => T) => Array.from({ length: n }, (_, i) => f(i));
const NAMES = people.map((p) => p.name);
const invoices = mk(36, (i) => ({ id: `INV-${2040 + i}`, customer: pick(companies).name, amount: int(4, 90) * 100, issued: `Oct ${int(1, 30)}`, due: `Nov ${int(1, 30)}`, status: pick(["Paid", "Due", "Overdue", "Draft"]), method: pick(["Card", "Bank transfer", "Invoice"]) }));
const orders = mk(40, (i) => ({ id: `#${48210 + i}`, customer: pick(NAMES), items: int(1, 6), total: int(18, 900), channel: pick(["Web", "iOS", "Android", "POS"]), status: pick(["Fulfilled", "Processing", "Refunded", "On hold"]), date: `Nov ${int(1, 18)}` }));
const products = mk(32, (i) => ({ id: `SKU-${700 + i}`, name: pick(["Linen shirt", "Field jacket", "Merino tee", "Canvas tote", "Trail runner", "Wool beanie", "Rain shell", "Chino"]) + ` ${["S", "M", "L", "XL"][i % 4]}`, price: int(18, 240), stock: int(0, 400), category: pick(["Apparel", "Footwear", "Bags", "Accessories"]), status: pick(["Active", "Draft", "Archived"]), sales: mk(8, () => int(2, 30)) }));
const tickets = mk(34, (i) => ({ id: `T-${8800 + i}`, subject: pick(["Can't export CSV", "SSO login loop", "Invoice shows wrong tax", "Webhook retries", "Add a seat", "API rate limit", "Change billing email", "Bug in filters"]), requester: pick(NAMES), priority: pick(["Urgent", "High", "Normal", "Low"]), status: pick(["Open", "Pending", "Solved"]), assignee: pick(["Maya Okafor", "Rafi Ahmed", "Unassigned"]), updated: `${int(1, 59)}m ago`, sla: int(5, 100) }));
const employees = mk(30, (i) => ({ id: `E-${100 + i}`, name: NAMES[i], role: pick(["Engineer", "Designer", "PM", "Support", "Sales", "Finance"]), team: pick(["Platform", "Growth", "Core", "Revenue"]), location: pick(["Remote", "Berlin", "Dhaka", "NYC"]), status: pick(["Active", "On leave", "Onboarding"]), start: `${pick(["Jan", "Mar", "Jun", "Sep"])} 20${int(19, 25)}` }));
const candidates = mk(26, (i) => ({ id: `CA-${i}`, name: NAMES[(i + 7) % NAMES.length], role: pick(["Senior Product Designer", "Staff Engineer", "Account Executive", "Data Analyst"]), stage: pick(["Applied", "Screen", "Interview", "Offer", "Hired"]), source: pick(["LinkedIn", "Referral", "Careers page", "Agency"]), rating: int(2, 5), applied: `${int(1, 20)}d ago` }));
const subs = mk(30, (i) => ({ id: `sub_${(9123 + i * 37).toString(36)}`, customer: pick(companies).name, plan: pick(["Starter", "Growth", "Scale", "Enterprise"]), mrr: int(29, 4800), seats: int(1, 120), status: pick(["Active", "Trialing", "Past due", "Canceled"]), renews: `${pick(["Dec", "Jan", "Feb"])} ${int(1, 28)}` }));
const txns = mk(40, (i) => ({ id: `txn_${(77123 + i * 91).toString(36)}`, desc: pick(["Stripe payout", "AWS", "Figma", "Payroll", "Google Workspace", "Customer payment", "Refund", "Office rent"]), amount: (rnd2() > 0.4 ? 1 : -1) * int(20, 9000), account: pick(["Operating", "Payroll", "Savings"]), category: pick(["Revenue", "Software", "People", "Facilities", "Refunds"]), date: `Nov ${int(1, 18)}`, status: pick(["Cleared", "Pending"]) }));
function rnd2() { return int(0, 100) / 100; }
const campaigns = mk(18, (i) => ({ id: `CM-${i}`, name: pick(["Black Friday", "Q4 webinar", "Re-engage trials", "Product launch", "Onboarding drip", "Churn save"]) + ` ${i + 1}`, channel: pick(["Email", "LinkedIn", "Google Ads", "In-app"]), status: pick(["Live", "Scheduled", "Draft", "Ended"]), sent: int(0, 42000), open: int(12, 64), ctr: int(1, 14), budget: int(0, 20) * 500 }));
const projects = mk(22, (i) => ({ id: `PR-${i}`, name: pick(["Billing v2", "Mobile app", "SOC 2", "Data warehouse", "Pricing page", "SSO", "Onboarding", "Search"]) + (i > 7 ? ` ${i}` : ""), lead: pick(NAMES), progress: int(4, 100), status: pick(["On track", "At risk", "Blocked", "Done"]), due: `${pick(["Dec", "Jan", "Feb"])} ${int(1, 28)}`, team: mk(int(2, 5), () => pick(NAMES)) }));
const files = mk(30, (i) => ({ id: `F-${i}`, name: pick(["Q3 board deck", "Pricing model", "Contract — Acme", "Brand guidelines", "Roadmap", "SOC2 evidence", "Invoice export"]) + `.${pick(["pdf", "xlsx", "docx", "fig", "csv"])}`, owner: pick(NAMES), size: int(12, 9800), modified: `${int(1, 30)}d ago`, shared: pick(["Private", "Team", "Public link"]) }));
const keys = mk(10, (i) => ({ id: `K-${i}`, name: pick(["Production", "Staging", "CI", "Zapier", "Data export"]) + ` ${i + 1}`, prefix: `nw_live_${(31337 + i * 7).toString(36)}…`, scope: pick(["Full access", "Read only", "Billing", "Webhooks"]), created: `${pick(["Aug", "Sep", "Oct"])} ${int(1, 28)}`, lastUsed: pick(["Just now", "2h ago", "3d ago", "Never"]), status: pick(["Active", "Active", "Revoked"]) }));
const hooks = mk(14, (i) => ({ id: `wh_${i}`, url: `https://${pick(["api.acme.com", "hooks.zapier.com", "n8n.foxglove.io", "erp.northwind.io"])}/keel/${i}`, events: int(1, 12), success: int(82, 100), status: pick(["Enabled", "Enabled", "Failing", "Disabled"]), last: `${int(1, 50)}m ago` }));
const assets = mk(26, (i) => ({ id: `AS-${300 + i}`, name: pick(["MacBook Pro 14", "Dell U2723", "iPhone 15", "YubiKey 5", "Herman Miller", "iPad Air"]), holder: pick([...NAMES.slice(0, 10), "Storage"]), serial: `C02${int(10000, 99999)}`, value: int(60, 3200), status: pick(["Assigned", "In stock", "Repair", "Retired"]), purchased: `20${int(21, 25)}` }));
const vendors = mk(18, (i) => ({ id: `V-${i}`, name: pick(["AWS", "Figma", "Notion", "Slack", "Gusto", "Brex", "Datadog", "Okta", "Cloudflare", "Linear"]) + (i > 9 ? " EU" : ""), category: pick(["Infrastructure", "Design", "HR", "Finance", "Security"]), spend: int(200, 40000), renewal: `${pick(["Dec", "Jan", "Mar", "Jun"])} ${int(1, 28)}`, owner: pick(NAMES), risk: pick(["Low", "Medium", "High"]) }));
const leads = people.filter((p) => p.stage === "Lead" || p.stage === "Qualified");
const audit = mk(40, (i) => ({ id: `ev_${i}`, actor: pick(NAMES), action: pick(["invoice.created", "member.invited", "api_key.revoked", "plan.changed", "export.downloaded", "sso.enabled", "customer.deleted"]), target: pick(["INV-2063", "lena@northwind.io", "nw_live_x9…", "Growth → Scale", "people.csv", "Okta", "Medium"]), ip: `10.${int(0, 255)}.${int(0, 255)}.${int(0, 255)}`, time: `Nov ${int(1, 18)}, ${int(8, 20)}:${String(int(0, 59)).padStart(2, "0")}` }));

/* ------------------------------------------------------------------ configs */
export const listScreens: { id: string; title: string; category: string; render: () => ReactNode }[] = [];
function add<T extends Row>(category: string, cfg: ListConfig<T>) { listScreens.push({ id: cfg.id, title: cfg.title, category, render: () => <ListScreen cfg={cfg as unknown as ListConfig<Row>} /> }); }

add<Person>("CRM", {
  id: "list-people", title: "People", noun: "person", plural: "people", primary: "Add people", data: people, search: (r) => `${r.name} ${r.email} ${r.company}`,
  tabs: [{ value: "all", label: "Total" }, { value: "new", label: "Net new", filter: (r) => r.stage === "Lead" }, { value: "saved", label: "Saved", filter: (r) => r.score > 70 }],
  filter: { label: "Industry", key: "industry" },
  columns: [
    { id: "name", header: "Full name", title: "Name", required: true, sortable: true, value: (r) => r.name, cell: (r) => who(r.name, r.email), width: 240 },
    { id: "company", header: "Company", sortable: true, value: (r) => r.company, cell: (r) => logo(r.company), showFrom: "md" },
    { id: "title", header: "Job title", value: (r) => r.title, cell: (r) => <Text truncate>{r.title}</Text>, showFrom: "lg" },
    { id: "channel", header: "Channel", cell: () => <span style={{ display: "flex", gap: 8, opacity: 0.55 }}><IconMail size={14} /><IconPhone size={14} /><IconGlobe size={14} /></span>, showFrom: "xl" },
    { id: "industry", header: "Industry", value: (r) => r.industry, cell: (r) => <Tag size="sm" tone={tone(r.industry)}>{r.industry}</Tag>, showFrom: "sm" },
    { id: "stage", header: "Stage", sortable: true, value: (r) => r.stage, cell: (r) => pill(r.stage) },
  ],
  detail: (r) => ({ title: r.name, description: `${r.title} · ${r.company}`, eyebrow: pill(r.stage), meta: [{ label: "Email", value: r.email }, { label: "Direct number", value: r.phone }, { label: "Company", value: r.company }, { label: "City", value: r.city }, { label: "Owner", value: r.owner }, { label: "Lead score", value: <ProgressBar value={r.score} showValue /> }] }),
});
add<Company>("CRM", {
  id: "list-companies", title: "Companies", noun: "company", plural: "companies", data: companies, search: (r) => `${r.name} ${r.domain}`, filter: { label: "Plan", key: "plan" },
  tabs: [{ value: "all", label: "All" }, { value: "ent", label: "Enterprise", filter: (r) => r.plan === "Enterprise" }, { value: "risk", label: "At risk", filter: (r) => r.health < 50 }],
  columns: [
    { id: "name", header: "Company", required: true, sortable: true, value: (r) => r.name, cell: (r) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name} size="sm" shape="square" /><span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">{r.name}</Text><Text variant="caption">{r.domain}</Text></span></span> },
    { id: "industry", header: "Industry", value: (r) => r.industry, cell: (r) => <Tag size="sm" tone={tone(r.industry)}>{r.industry}</Tag>, showFrom: "md" },
    { id: "emp", header: "Employees", align: "right", sortable: true, value: (r) => r.employees, cell: (r) => num(r.employees), showFrom: "lg" },
    { id: "plan", header: "Plan", value: (r) => r.plan, cell: (r) => <Tag size="sm" variant="outline">{r.plan}</Tag>, showFrom: "sm" },
    { id: "health", header: "Health", sortable: true, value: (r) => r.health, cell: (r) => <div style={{ width: 96 }}><SegmentBar value={r.health} segments={10} tone={r.health < 30 ? "danger" : "default"} /></div>, showFrom: "md" },
    { id: "arr", header: "ARR", align: "right", sortable: true, value: (r) => r.arr, cell: (r) => money(r.arr), footer: (rs) => <b>{money(rs.reduce((a, r) => a + r.arr, 0), true)}</b> },
  ],
  detail: (r) => ({ title: r.name, description: r.domain, eyebrow: <Tag size="sm" variant="outline">{r.plan}</Tag>, meta: [{ label: "Industry", value: r.industry }, { label: "Employees", value: num(r.employees) }, { label: "ARR", value: money(r.arr) }, { label: "HQ", value: r.city }, { label: "Owner", value: r.owner }, { label: "Health", value: `${r.health} / 100` }] }),
});
add<Deal>("CRM", {
  id: "list-deals", title: "Deals", noun: "deal", data: deals, search: (r) => `${r.name} ${r.company}`, filter: { label: "Owner", key: "owner" },
  tabs: [{ value: "open", label: "Open", filter: (r) => !["Won", "Lost"].includes(r.stage) }, { value: "won", label: "Won", filter: (r) => r.stage === "Won" }, { value: "lost", label: "Lost", filter: (r) => r.stage === "Lost" }, { value: "all", label: "All" }],
  stats: <StatGroup><Stat label="Pipeline" value={money(deals.filter((d) => !["Won", "Lost"].includes(d.stage)).reduce((a, d) => a + d.value, 0), true)} delta={8.4} baseline="vs last month" /><Stat label="Weighted" value={money(deals.reduce((a, d) => a + d.value * d.probability / 100, 0), true)} /><Stat label="Win rate" value="31%" delta={2.1} deltaUnit="pt" /><Stat label="Avg. cycle" value="38 days" delta={-4} deltaUnit="d" lowerIsBetter /></StatGroup>,
  columns: [
    { id: "name", header: "Deal", required: true, sortable: true, value: (r) => r.name, cell: (r) => <Text weight="medium" truncate>{r.name}</Text>, width: 260 },
    { id: "stage", header: "Stage", value: (r) => r.stage, cell: (r) => pill(r.stage) },
    { id: "owner", header: "Owner", value: (r) => r.owner, cell: (r) => who(r.owner), showFrom: "lg" },
    { id: "close", header: "Close date", value: (r) => r.close, cell: (r) => r.close, showFrom: "md" },
    { id: "prob", header: "Probability", align: "right", value: (r) => r.probability, cell: (r) => `${r.probability}%`, showFrom: "md" },
    { id: "value", header: "Value", align: "right", sortable: true, value: (r) => r.value, cell: (r) => money(r.value) },
  ],
  detail: (r) => ({ title: r.name, description: `Owned by ${r.owner}`, eyebrow: pill(r.stage), meta: [{ label: "Company", value: r.company }, { label: "Value", value: money(r.value) }, { label: "Probability", value: `${r.probability}%` }, { label: "Close date", value: r.close }] }),
});
add<Person>("CRM", {
  id: "list-leads", title: "Leads", nav: "list-people", noun: "lead", primary: "Import leads", data: leads, search: (r) => `${r.name} ${r.company}`, filter: { label: "Owner", key: "owner" },
  columns: [
    { id: "name", header: "Lead", required: true, sortable: true, value: (r) => r.name, cell: (r) => who(r.name, r.title) },
    { id: "company", header: "Company", value: (r) => r.company, cell: (r) => logo(r.company), showFrom: "md" },
    { id: "score", header: "Score", sortable: true, align: "right", value: (r) => r.score, cell: (r) => <Text tabular weight={r.score > 70 ? "semibold" : undefined}>{r.score}</Text> },
    { id: "trend", header: "Engagement", cell: (r) => <Sparkline values={r.trend} tone="accent" />, showFrom: "lg" },
    { id: "owner", header: "Owner", value: (r) => r.owner, cell: (r) => r.owner, showFrom: "xl" },
    { id: "seen", header: "Last seen", value: (r) => r.lastSeen, cell: (r) => <Text tone="muted">{r.lastSeen}</Text>, showFrom: "sm" },
  ],
  detail: (r) => ({ title: r.name, description: r.email, eyebrow: pill(r.stage), meta: [{ label: "Score", value: r.score }, { label: "Company", value: r.company }, { label: "Owner", value: r.owner }] }),
});
add("Finance", {
  id: "list-invoices", title: "Invoices", noun: "invoice", data: invoices, search: (r) => `${r.id} ${r.customer}`, filter: { label: "Status", key: "status" },
  tabs: [{ value: "all", label: "All" }, { value: "due", label: "Outstanding", filter: (r) => r.status === "Due" || r.status === "Overdue" }, { value: "paid", label: "Paid", filter: (r) => r.status === "Paid" }, { value: "draft", label: "Drafts", filter: (r) => r.status === "Draft" }],
  columns: [
    { id: "id", header: "Invoice", required: true, sortable: true, value: (r) => r.id, cell: (r) => <Text variant="mono">{r.id}</Text> },
    { id: "customer", header: "Customer", sortable: true, value: (r) => r.customer, cell: (r) => logo(r.customer) },
    { id: "issued", header: "Issued", value: (r) => r.issued, cell: (r) => r.issued, showFrom: "lg" },
    { id: "due", header: "Due", value: (r) => r.due, cell: (r) => r.due, showFrom: "md" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Paid" ? "active" : r.status === "Overdue" ? "danger" : r.status === "Due" ? "pending" : "neutral"}>{r.status}</StatusPill> },
    { id: "amount", header: "Amount", align: "right", sortable: true, value: (r) => r.amount, cell: (r) => money(r.amount), footer: (rs) => <b>{money(rs.reduce((a, r) => a + r.amount, 0))}</b> },
  ],
  detail: (r) => ({ title: r.id, description: r.customer, meta: [{ label: "Amount", value: money(r.amount) }, { label: "Issued", value: r.issued }, { label: "Due", value: r.due }, { label: "Method", value: r.method }, { label: "Status", value: r.status }] }),
});
add("Commerce", {
  id: "list-orders", title: "Orders", noun: "order", data: orders, search: (r) => `${r.id} ${r.customer}`, filter: { label: "Channel", key: "channel" },
  tabs: [{ value: "all", label: "All" }, { value: "open", label: "Unfulfilled", filter: (r) => r.status === "Processing" || r.status === "On hold" }, { value: "ref", label: "Refunds", filter: (r) => r.status === "Refunded" }],
  columns: [
    { id: "id", header: "Order", required: true, value: (r) => r.id, cell: (r) => <Text variant="mono" weight="medium">{r.id}</Text> },
    { id: "date", header: "Date", value: (r) => r.date, cell: (r) => r.date, showFrom: "md" },
    { id: "customer", header: "Customer", sortable: true, value: (r) => r.customer, cell: (r) => who(r.customer) },
    { id: "channel", header: "Channel", value: (r) => r.channel, cell: (r) => <Tag size="sm">{r.channel}</Tag>, showFrom: "lg" },
    { id: "status", header: "Fulfilment", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Fulfilled" ? "active" : r.status === "Refunded" ? "danger" : r.status === "On hold" ? "warning" : "pending"}>{r.status}</StatusPill>, showFrom: "sm" },
    { id: "items", header: "Items", align: "right", value: (r) => r.items, cell: (r) => r.items, showFrom: "xl" },
    { id: "total", header: "Total", align: "right", sortable: true, value: (r) => r.total, cell: (r) => money(r.total) },
  ],
  detail: (r) => ({ title: `Order ${r.id}`, description: `${r.customer} · ${r.date}`, meta: [{ label: "Items", value: r.items }, { label: "Total", value: money(r.total) }, { label: "Channel", value: r.channel }, { label: "Status", value: r.status }] }),
});
add("Commerce", {
  id: "list-products", title: "Products", noun: "product", data: products, search: (r) => `${r.name} ${r.id}`, filter: { label: "Category", key: "category" },
  tabs: [{ value: "all", label: "All" }, { value: "active", label: "Active", filter: (r) => r.status === "Active" }, { value: "low", label: "Low stock", filter: (r) => r.stock < 20 }, { value: "draft", label: "Drafts", filter: (r) => r.status === "Draft" }],
  columns: [
    { id: "name", header: "Product", required: true, sortable: true, value: (r) => r.name, cell: (r) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name} size="md" shape="square" /><span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">{r.name}</Text><Text variant="caption">{r.id}</Text></span></span> },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Active" ? "active" : "neutral"}>{r.status}</StatusPill>, showFrom: "sm" },
    { id: "stock", header: "Inventory", align: "right", sortable: true, value: (r) => r.stock, cell: (r) => r.stock === 0 ? <Text tone="danger">Out of stock</Text> : `${r.stock} in stock`, showFrom: "md" },
    { id: "sales", header: "Sales, 8w", cell: (r) => <Sparkline values={r.sales} type="bars" width={72} />, showFrom: "lg" },
    { id: "cat", header: "Category", value: (r) => r.category, cell: (r) => r.category, showFrom: "xl" },
    { id: "price", header: "Price", align: "right", sortable: true, value: (r) => r.price, cell: (r) => money(r.price) },
  ],
  detail: (r) => ({ title: r.name, description: r.id, meta: [{ label: "Price", value: money(r.price) }, { label: "Stock", value: r.stock }, { label: "Category", value: r.category }, { label: "Status", value: r.status }] }),
});
add("Support", {
  id: "list-tickets", title: "Tickets", nav: "inbox", noun: "ticket", data: tickets, search: (r) => `${r.id} ${r.subject} ${r.requester}`, filter: { label: "Priority", key: "priority" },
  tabs: [{ value: "open", label: "Open", filter: (r) => r.status === "Open" }, { value: "mine", label: "Assigned to me", filter: (r) => r.assignee === "Maya Okafor" }, { value: "pending", label: "Pending", filter: (r) => r.status === "Pending" }, { value: "all", label: "All" }],
  columns: [
    { id: "subject", header: "Subject", required: true, sortable: true, value: (r) => r.subject, cell: (r) => <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}><Text weight="medium" truncate>{r.subject}</Text><Text variant="caption">{r.id} · {r.requester}</Text></span>, width: 320 },
    { id: "priority", header: "Priority", value: (r) => r.priority, cell: (r) => <Tag size="sm" tone={r.priority === "Urgent" ? "red" : r.priority === "High" ? "pink" : "gray"} dot>{r.priority}</Tag> },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Open" ? "active" : r.status === "Pending" ? "pending" : "neutral"}>{r.status}</StatusPill>, showFrom: "sm" },
    { id: "assignee", header: "Assignee", value: (r) => r.assignee, cell: (r) => r.assignee === "Unassigned" ? <Text tone="muted">Unassigned</Text> : who(r.assignee), showFrom: "lg" },
    { id: "sla", header: "SLA", cell: (r) => <div style={{ width: 80 }}><ProgressBar value={r.sla} tone={r.sla > 85 ? "danger" : "default"} /></div>, showFrom: "md" },
    { id: "updated", header: "Updated", value: (r) => r.updated, cell: (r) => <Text tone="muted">{r.updated}</Text>, showFrom: "xl" },
  ],
  detail: (r) => ({ title: r.subject, description: `${r.id} · from ${r.requester}`, meta: [{ label: "Priority", value: r.priority }, { label: "Status", value: r.status }, { label: "Assignee", value: r.assignee }, { label: "SLA used", value: `${r.sla}%` }] }),
});
add("People ops", {
  id: "list-employees", title: "Team directory", nav: "set-members", noun: "employee", primary: "Add employee", data: employees, search: (r) => `${r.name} ${r.role}`, filter: { label: "Team", key: "team" },
  columns: [
    { id: "name", header: "Name", required: true, sortable: true, value: (r) => r.name, cell: (r) => who(r.name, r.role) },
    { id: "team", header: "Team", value: (r) => r.team, cell: (r) => <Tag size="sm">{r.team}</Tag>, showFrom: "sm" },
    { id: "loc", header: "Location", value: (r) => r.location, cell: (r) => r.location, showFrom: "md" },
    { id: "start", header: "Start date", value: (r) => r.start, cell: (r) => r.start, showFrom: "lg" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Active" ? "active" : r.status === "On leave" ? "pending" : "info"}>{r.status}</StatusPill> },
  ],
  detail: (r) => ({ title: r.name, description: `${r.role} · ${r.team}`, meta: [{ label: "Location", value: r.location }, { label: "Start date", value: r.start }, { label: "Status", value: r.status }] }),
});
add("People ops", {
  id: "list-candidates", title: "Candidates", nav: "set-members", noun: "candidate", data: candidates, search: (r) => `${r.name} ${r.role}`, filter: { label: "Stage", key: "stage" },
  tabs: [{ value: "all", label: "All" }, { value: "int", label: "Interviewing", filter: (r) => r.stage === "Interview" }, { value: "offer", label: "Offers", filter: (r) => r.stage === "Offer" }],
  columns: [
    { id: "name", header: "Candidate", required: true, sortable: true, value: (r) => r.name, cell: (r) => who(r.name, r.role) },
    { id: "stage", header: "Stage", value: (r) => r.stage, cell: (r) => <Tag size="sm" variant={r.stage === "Offer" || r.stage === "Hired" ? "solid" : "soft"} tone={r.stage === "Offer" ? "blue" : "gray"}>{r.stage}</Tag> },
    { id: "rating", header: "Rating", sortable: true, value: (r) => r.rating, cell: (r) => "★".repeat(r.rating) + "☆".repeat(5 - r.rating), showFrom: "md" },
    { id: "source", header: "Source", value: (r) => r.source, cell: (r) => r.source, showFrom: "lg" },
    { id: "applied", header: "Applied", value: (r) => r.applied, cell: (r) => <Text tone="muted">{r.applied}</Text>, showFrom: "sm" },
  ],
  detail: (r) => ({ title: r.name, description: r.role, meta: [{ label: "Stage", value: r.stage }, { label: "Source", value: r.source }, { label: "Applied", value: r.applied }] }),
});
add("Finance", {
  id: "list-subscriptions", title: "Subscriptions", nav: "list-invoices", noun: "subscription", data: subs, search: (r) => `${r.customer} ${r.id}`, filter: { label: "Plan", key: "plan" },
  tabs: [{ value: "all", label: "All" }, { value: "active", label: "Active", filter: (r) => r.status === "Active" }, { value: "trial", label: "Trialing", filter: (r) => r.status === "Trialing" }, { value: "pd", label: "Past due", filter: (r) => r.status === "Past due" }],
  columns: [
    { id: "customer", header: "Customer", required: true, sortable: true, value: (r) => r.customer, cell: (r) => logo(r.customer) },
    { id: "plan", header: "Plan", value: (r) => r.plan, cell: (r) => <Tag size="sm" variant="outline">{r.plan}</Tag> },
    { id: "seats", header: "Seats", align: "right", value: (r) => r.seats, cell: (r) => r.seats, showFrom: "md" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Active" ? "active" : r.status === "Past due" ? "danger" : r.status === "Trialing" ? "info" : "neutral"}>{r.status}</StatusPill>, showFrom: "sm" },
    { id: "renews", header: "Renews", value: (r) => r.renews, cell: (r) => r.renews, showFrom: "lg" },
    { id: "mrr", header: "MRR", align: "right", sortable: true, value: (r) => r.mrr, cell: (r) => money(r.mrr) },
  ],
});
add("Finance", {
  id: "list-transactions", title: "Transactions", nav: "list-invoices", noun: "transaction", primary: "Upload statement", data: txns, search: (r) => `${r.desc} ${r.id}`, filter: { label: "Category", key: "category" },
  columns: [
    { id: "desc", header: "Description", required: true, value: (r) => r.desc, cell: (r) => <span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">{r.desc}</Text><Text variant="caption" style={{ fontFamily: "var(--mono, monospace)" }}>{r.id}</Text></span> },
    { id: "date", header: "Date", value: (r) => r.date, cell: (r) => r.date, showFrom: "sm" },
    { id: "account", header: "Account", value: (r) => r.account, cell: (r) => r.account, showFrom: "lg" },
    { id: "cat", header: "Category", value: (r) => r.category, cell: (r) => <Tag size="sm">{r.category}</Tag>, showFrom: "md" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <Text tone={r.status === "Pending" ? "muted" : undefined}>{r.status}</Text>, showFrom: "xl" },
    { id: "amount", header: "Amount", align: "right", sortable: true, value: (r) => r.amount, cell: (r) => <Text tabular weight="medium" tone={r.amount < 0 ? undefined : "accent"}>{r.amount < 0 ? "−" : "+"}{money(Math.abs(r.amount))}</Text> },
  ],
});
add("Marketing", {
  id: "list-campaigns", title: "Campaigns", nav: "dash-marketing", noun: "campaign", data: campaigns, search: (r) => r.name, filter: { label: "Channel", key: "channel" },
  tabs: [{ value: "all", label: "All" }, { value: "live", label: "Live", filter: (r) => r.status === "Live" }, { value: "sch", label: "Scheduled", filter: (r) => r.status === "Scheduled" }, { value: "draft", label: "Drafts", filter: (r) => r.status === "Draft" }],
  columns: [
    { id: "name", header: "Campaign", required: true, sortable: true, value: (r) => r.name, cell: (r) => <Text weight="medium">{r.name}</Text> },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Live" ? "active" : r.status === "Scheduled" ? "info" : "neutral"} pulse={r.status === "Live"}>{r.status}</StatusPill> },
    { id: "channel", header: "Channel", value: (r) => r.channel, cell: (r) => r.channel, showFrom: "md" },
    { id: "sent", header: "Sent", align: "right", sortable: true, value: (r) => r.sent, cell: (r) => num(r.sent), showFrom: "lg" },
    { id: "open", header: "Open rate", align: "right", value: (r) => r.open, cell: (r) => `${r.open}%`, showFrom: "sm" },
    { id: "ctr", header: "CTR", align: "right", value: (r) => r.ctr, cell: (r) => `${r.ctr}%`, showFrom: "xl" },
  ],
});
add("Work", {
  id: "list-projects", title: "Projects", nav: "work-kanban", noun: "project", data: projects, search: (r) => r.name, filter: { label: "Status", key: "status" },
  columns: [
    { id: "name", header: "Project", required: true, sortable: true, value: (r) => r.name, cell: (r) => <Text weight="medium">{r.name}</Text> },
    { id: "lead", header: "Lead", value: (r) => r.lead, cell: (r) => who(r.lead), showFrom: "md" },
    { id: "progress", header: "Progress", sortable: true, value: (r) => r.progress, cell: (r) => <div style={{ width: 120 }}><ProgressBar value={r.progress} showValue /></div>, showFrom: "sm" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "On track" ? "active" : r.status === "Blocked" ? "danger" : r.status === "At risk" ? "warning" : "neutral"}>{r.status}</StatusPill> },
    { id: "due", header: "Due", value: (r) => r.due, cell: (r) => r.due, showFrom: "lg" },
  ],
});
add("Work", {
  id: "list-files", title: "Files", nav: "work-files", noun: "file", primary: "Upload", data: files, search: (r) => r.name, filter: { label: "Sharing", key: "shared" },
  columns: [
    { id: "name", header: "Name", required: true, sortable: true, value: (r) => r.name, cell: (r) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name.split(".").pop()!.toUpperCase()} size="sm" shape="square" colored={false} /><Text weight="medium" truncate>{r.name}</Text></span> },
    { id: "owner", header: "Owner", value: (r) => r.owner, cell: (r) => who(r.owner), showFrom: "md" },
    { id: "shared", header: "Sharing", value: (r) => r.shared, cell: (r) => <Tag size="sm" tone={r.shared === "Public link" ? "blue" : "gray"}>{r.shared}</Tag>, showFrom: "sm" },
    { id: "size", header: "Size", align: "right", sortable: true, value: (r) => r.size, cell: (r) => r.size > 1024 ? `${(r.size / 1024).toFixed(1)} MB` : `${r.size} KB`, showFrom: "lg" },
    { id: "mod", header: "Modified", value: (r) => r.modified, cell: (r) => <Text tone="muted">{r.modified}</Text> },
  ],
});
add("Developers", {
  id: "list-api-keys", title: "API keys", nav: "set-general", noun: "key", primary: "Create key", data: keys, search: (r) => r.name,
  columns: [
    { id: "name", header: "Name", required: true, value: (r) => r.name, cell: (r) => <Text weight="medium">{r.name}</Text> },
    { id: "prefix", header: "Key", value: (r) => r.prefix, cell: (r) => <Text variant="mono">{r.prefix}</Text>, showFrom: "sm" },
    { id: "scope", header: "Scope", value: (r) => r.scope, cell: (r) => <Tag size="sm">{r.scope}</Tag>, showFrom: "md" },
    { id: "used", header: "Last used", value: (r) => r.lastUsed, cell: (r) => r.lastUsed, showFrom: "lg" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Active" ? "active" : "neutral"}>{r.status}</StatusPill> },
  ],
});
add("Developers", {
  id: "list-webhooks", title: "Webhooks", nav: "set-general", noun: "endpoint", primary: "Add endpoint", data: hooks, search: (r) => r.url, filter: { label: "Status", key: "status" },
  columns: [
    { id: "url", header: "Endpoint", required: true, value: (r) => r.url, cell: (r) => <Text variant="mono" truncate>{r.url}</Text>, width: 340 },
    { id: "events", header: "Events", align: "right", value: (r) => r.events, cell: (r) => r.events, showFrom: "md" },
    { id: "success", header: "Success, 24h", sortable: true, value: (r) => r.success, cell: (r) => <div style={{ width: 96 }}><ProgressBar value={r.success} tone={r.success < 90 ? "danger" : "default"} showValue /></div>, showFrom: "sm" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <StatusPill status={r.status === "Enabled" ? "active" : r.status === "Failing" ? "danger" : "neutral"}>{r.status}</StatusPill> },
    { id: "last", header: "Last delivery", value: (r) => r.last, cell: (r) => <Text tone="muted">{r.last}</Text>, showFrom: "lg" },
  ],
});
add("Operations", {
  id: "list-assets", title: "Assets", nav: "set-general", noun: "asset", data: assets, search: (r) => `${r.name} ${r.holder} ${r.serial}`, filter: { label: "Status", key: "status" },
  columns: [
    { id: "name", header: "Asset", required: true, sortable: true, value: (r) => r.name, cell: (r) => <span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">{r.name}</Text><Text variant="caption">{r.id}</Text></span> },
    { id: "holder", header: "Assigned to", value: (r) => r.holder, cell: (r) => r.holder === "Storage" ? <Text tone="muted">In storage</Text> : who(r.holder), showFrom: "sm" },
    { id: "serial", header: "Serial", value: (r) => r.serial, cell: (r) => <Text variant="mono">{r.serial}</Text>, showFrom: "lg" },
    { id: "status", header: "Status", value: (r) => r.status, cell: (r) => <Tag size="sm" dot tone={r.status === "Repair" ? "red" : "gray"}>{r.status}</Tag> },
    { id: "value", header: "Value", align: "right", sortable: true, value: (r) => r.value, cell: (r) => money(r.value), showFrom: "md" },
  ],
});
add("Finance", {
  id: "list-vendors", title: "Vendors", nav: "list-invoices", noun: "vendor", data: vendors, search: (r) => r.name, filter: { label: "Risk", key: "risk" },
  columns: [
    { id: "name", header: "Vendor", required: true, sortable: true, value: (r) => r.name, cell: (r) => logo(r.name) },
    { id: "cat", header: "Category", value: (r) => r.category, cell: (r) => r.category, showFrom: "md" },
    { id: "owner", header: "Owner", value: (r) => r.owner, cell: (r) => who(r.owner), showFrom: "lg" },
    { id: "renewal", header: "Renewal", value: (r) => r.renewal, cell: (r) => r.renewal, showFrom: "sm" },
    { id: "risk", header: "Risk", value: (r) => r.risk, cell: (r) => <Tag size="sm" tone={r.risk === "High" ? "red" : "gray"} dot>{r.risk}</Tag> },
    { id: "spend", header: "Annual spend", align: "right", sortable: true, value: (r) => r.spend, cell: (r) => money(r.spend) },
  ],
});
add("Security", {
  id: "list-audit", title: "Audit log", nav: "set-security", noun: "event", primary: "Export log", data: audit, search: (r) => `${r.actor} ${r.action} ${r.target}`, filter: { label: "Action", key: "action" },
  columns: [
    { id: "time", header: "Time", value: (r) => r.time, cell: (r) => <Text tabular tone="muted">{r.time}</Text>, width: 150 },
    { id: "actor", header: "Actor", required: true, value: (r) => r.actor, cell: (r) => who(r.actor) },
    { id: "action", header: "Action", value: (r) => r.action, cell: (r) => <Text variant="mono">{r.action}</Text> },
    { id: "target", header: "Target", value: (r) => r.target, cell: (r) => r.target, showFrom: "md" },
    { id: "ip", header: "IP", value: (r) => r.ip, cell: (r) => <Text variant="mono" tone="muted">{r.ip}</Text>, showFrom: "lg" },
  ],
});
void IconFilter; void IconUpload; void IconUser; void IconBuilding;
