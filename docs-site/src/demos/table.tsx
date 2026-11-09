import { useState } from "react";
import {
  Avatar, Button, Card, DataTable, DropdownMenuItem, DropdownMenuSeparator, IconArchive, IconCopy, IconDownload, IconEdit, IconFile, IconMail, IconTrash, IconUser,
  List, ListItem, MetadataList, OverflowList, SearchInput, Sparkline, StatusPill, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow,
  TableSelectionToolbar, Tag, Text, Timeline, TreeList, CopyButton, type Column, type TreeNode,
} from "@keel/components";

type Customer = { id: string; name: string; email: string; plan: string; status: "active" | "warning" | "danger"; mrr: number; seats: number; trend: number[] };
const NAMES = ["Acme Inc.", "Globex", "Initech", "Umbrella", "Hooli", "Stark Labs", "Wayne Corp", "Wonka", "Soylent", "Tyrell", "Cyberdyne", "Aperture"];
const DATA: Customer[] = NAMES.map((n, i) => ({
  id: `cus_${1000 + i}`, name: n, email: `billing@${n.split(" ")[0].toLowerCase()}.com`, plan: ["Starter", "Pro", "Scale", "Enterprise"][i % 4],
  status: (["active", "active", "warning", "active", "danger"] as const)[i % 5], mrr: 400 + ((i * 937) % 4200), seats: 5 + ((i * 13) % 60),
  trend: Array.from({ length: 8 }, (_, j) => 10 + ((i + j * 3) % 9) + j),
}));
const STATUS = { active: "Active", warning: "Past due", danger: "Churned" } as const;

const columns: Column<Customer>[] = [
  { id: "name", header: "Customer", required: true, sortable: true, value: (r) => r.name, cell: (r) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.name} shape="square" size="md" /><span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">{r.name}</Text><Text variant="caption">{r.email}</Text></span></span> },
  { id: "status", header: "Status", value: (r) => r.status, filterOptions: [{ label: "Active", value: "active" }, { label: "Past due", value: "warning" }, { label: "Churned", value: "danger" }], cell: (r) => <StatusPill status={r.status === "active" ? "active" : r.status}>{STATUS[r.status]}</StatusPill> },
  { id: "plan", header: "Plan", sortable: true, value: (r) => r.plan, showFrom: "md", cell: (r) => <Tag tone={r.plan === "Enterprise" ? "blue" : r.plan === "Scale" ? "violet" : "gray"}>{r.plan}</Tag> },
  { id: "trend", header: "Trend", showFrom: "lg", cell: (r) => <Sparkline values={r.trend} tone="auto" /> },
  { id: "seats", header: "Seats", align: "right", sortable: true, value: (r) => r.seats, showFrom: "sm", cell: (r) => r.seats, footer: (rows) => rows.reduce((a, r) => a + r.seats, 0) },
  { id: "mrr", header: "MRR", align: "right", sortable: true, value: (r) => r.mrr, cell: (r) => `$${r.mrr.toLocaleString()}`, footer: (rows) => <b>${rows.reduce((a, r) => a + r.mrr, 0).toLocaleString()}</b> },
];

/* ---------------- DataTable ---------------- */
export function DataTableDemo() {
  const [q, setQ] = useState("");
  const rows = DATA.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ width: "100%" }}>
      <DataTable data={rows} columns={columns} getRowId={(r) => r.id} selectable pageSize={8} defaultSort={{ id: "mrr", dir: "desc" }} caption="Customers"
        toolbar={<SearchInput size="sm" placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />}
        rowActions={(r) => <><DropdownMenuItem icon={<IconEdit />} shortcut="↵">Open</DropdownMenuItem><DropdownMenuItem icon={<IconCopy />} onSelect={() => navigator.clipboard?.writeText(r.id)}>Copy ID</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem></>}
        bulkActions={(sel, clear) => <><Button size="sm" leading={<IconMail />}>Email {sel.length}</Button><Button size="sm" leading={<IconArchive />} onClick={clear}>Archive</Button></>}
        renderExpanded={(r) => <MetadataList columns={3} items={[{ label: "ID", value: <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{r.id}<CopyButton value={r.id} size="xs" /></span> }, { label: "Seats", value: r.seats }, { label: "Plan", value: r.plan }]} />}
      />
    </div>
  );
}
export function DataTableStates() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
      <DataTable data={[]} columns={columns.slice(0, 3)} getRowId={(r) => r.id} loading loadingRows={3} hideViewMenu />
      <DataTable data={[]} columns={columns.slice(0, 3)} getRowId={(r) => r.id} hideViewMenu />
      <DataTable data={DATA.slice(0, 4)} columns={columns.slice(0, 3)} getRowId={(r) => r.id} density="compact" striped activeRowId="cus_1001" onRowClick={() => {}} hideViewMenu />
    </div>
  );
}

/* ---------------- Table primitives ---------------- */
export function TablePrimitivesDemo() {
  return (
    <div style={{ width: "100%" }}>
      <TableContainer>
        <Table>
          <TableHeader><tr><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead align="right">Amount</TableHead></tr></TableHeader>
          <TableBody>
            {DATA.slice(0, 4).map((r, i) => <TableRow key={r.id} selected={i === 1}><TableCell><Text variant="mono">INV-{1040 + i}</Text></TableCell><TableCell>{r.name}</TableCell><TableCell align="right">${r.mrr.toLocaleString()}</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

/* ---------------- TableSelectionToolbar ---------------- */
export function TableSelectionToolbarDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <TableSelectionToolbar placement="inline" count={3} onClear={() => {}}><Button size="sm" leading={<IconDownload />}>Export</Button><Button size="sm" variant="danger-ghost" leading={<IconTrash />}>Delete</Button></TableSelectionToolbar>
      <Text tone="muted">The floating version appears at the bottom of the screen when you select rows in the DataTable above.</Text>
    </div>
  );
}

/* ---------------- List ---------------- */
export function ListDemo() {
  const [sel, setSel] = useState("Globex");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <List variant="card" header="Recent customers">
        {DATA.slice(0, 4).map((r) => <ListItem key={r.id} leading={<Avatar name={r.name} shape="square" size="lg" />} title={r.name} description={r.email} meta={`$${r.mrr}`} onClick={() => setSel(r.name)} selected={sel === r.name} />)}
      </List>
      <List variant="card">
        <ListItem leading={<IconFile />} title="Q3 report.pdf" description="2.4 MB" trailing={<Button size="xs" variant="ghost">Open</Button>} />
        <ListItem leading={<IconFile />} title="Contracts.zip" description="41 MB" trailing={<Button size="xs" variant="ghost">Open</Button>} />
        <ListItem leading={<IconUser />} title="Static row" meta="—" />
      </List>
    </div>
  );
}

/* ---------------- MetadataList ---------------- */
export function MetadataListDemo() {
  const items = [{ label: "Customer ID", value: "cus_1000" }, { label: "Plan", value: <Tag tone="blue">Enterprise</Tag> }, { label: "MRR", value: "$2,400" }, { label: "Seats", value: "31 of 40" }, { label: "Billing email", value: "billing@acme.com" }, { label: "Notes", value: "Renewal call booked for Nov 28.", full: true }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
      <Card><MetadataList title="Account" items={items} columns={2} /></Card>
      <MetadataList layout="stacked" columns={3} items={items.slice(0, 3)} />
    </div>
  );
}

/* ---------------- OverflowList ---------------- */
export function OverflowListDemo() {
  const [w, setW] = useState(360);
  const tags = ["Enterprise", "EU", "Annual", "SSO", "VIP", "Net 30", "Partner", "Beta"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <input type="range" min={140} max={680} value={w} onChange={(e) => setW(Number(e.target.value))} aria-label="Width" />
      <div style={{ width: w, padding: 8, borderRadius: 10, boxShadow: "0 0 0 1px rgba(127,127,127,.25)" }}><OverflowList>{tags.map((t) => <Tag key={t}>{t}</Tag>)}</OverflowList></div>
    </div>
  );
}

/* ---------------- TreeList ---------------- */
const TREE: TreeNode[] = [
  { id: "billing", label: "Billing", children: [{ id: "invoices", label: "Invoices", meta: "124" }, { id: "refunds", label: "Refunds", meta: "3" }, { id: "tax", label: "Tax", children: [{ id: "eu", label: "EU VAT" }, { id: "us", label: "US sales tax", disabled: true }] }] },
  { id: "customers", label: "Customers", children: [{ id: "active", label: "Active" }, { id: "churned", label: "Churned" }] },
  { id: "archive", label: "Archive", loading: true },
];
export function TreeListDemo() {
  const [sel, setSel] = useState<string | null>("invoices");
  const [checked, setChecked] = useState(new Set(["eu", "active"]));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 24, width: "100%" }}>
      <Card padding="sm"><TreeList aria-label="Folders" data={TREE} selected={sel} onSelect={setSel} defaultExpanded={["billing", "tax"]} showIcons /></Card>
      <Card padding="sm"><TreeList aria-label="Permissions" data={TREE.slice(0, 2)} checkable checked={checked} onCheckedChange={setChecked} defaultExpanded={["billing", "tax", "customers"]} /></Card>
    </div>
  );
}

/* ---------------- Timeline ---------------- */
export function TimelineDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Timeline events={[
        { id: "1", title: <span><b>Invoice paid</b> · INV-1042</span>, time: "2m ago", tone: "success" },
        { id: "2", title: "Ana Lima changed the plan to Pro", body: "Seats 40 → 15, prorated $120 credit.", time: "1h ago", marker: <IconEdit /> },
        { id: "3", title: "Payment failed", body: "Card ending 4242 was declined.", time: "Yesterday", tone: "danger" },
        { id: "4", title: "Customer created", time: "Mar 12", tone: "info" },
      ]} />
    </div>
  );
}
