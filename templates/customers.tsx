import { useMemo, useState } from "react";
import {
  AlertDialog, Avatar, Button, CopyButton, DataTable, Drawer, DrawerContent, DrawerSection, DropdownMenuItem, DropdownMenuSeparator, FilterMenu, IconArchive, IconButton,
  IconChevronDown, IconChevronUp, IconCopy, IconDownload, IconEdit, IconMail, IconPlus, IconTrash, InlineEdit, MetadataList, MoreMenu, Page, PageHeading, SearchInput,
  SegmentBar, Sparkline, StatusPill, Tag, Text, Timeline, useToast, type Column,
} from "@keel/components";
import { customerLabel, customers as seed, customerTone, fmtMoney, planTone, type Customer } from "./data";
import { AdminShell, type Nav } from "./shell";

export function CustomersTemplate({ go }: { go?: (to: Nav) => void }) {
  const toast = useToast();
  const [data, setData] = useState(seed);
  const [q, setQ] = useState("");
  const [plans, setPlans] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Customer[] | null>(null);
  const rows = useMemo(() => data.filter((c) => (!q || `${c.name} ${c.domain} ${c.owner}`.toLowerCase().includes(q.toLowerCase())) && (!plans.length || plans.includes(c.plan))), [data, q, plans]);
  const idx = rows.findIndex((r) => r.id === openId);
  const open = data.find((c) => c.id === openId);

  const columns: Column<Customer>[] = [
    { id: "name", header: "Customer", required: true, sortable: true, value: (c) => c.name, cell: (c) => (
      <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}><Avatar name={c.name} shape="square" /><span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}><Text weight="medium" truncate>{c.name}</Text><Text variant="caption" truncate>{c.domain}</Text></span></span>
    ) },
    { id: "status", header: "Status", value: (c) => c.status, filterOptions: Object.entries(customerLabel).map(([value, label]) => ({ value, label })), cell: (c) => <StatusPill status={customerTone[c.status]}>{customerLabel[c.status]}</StatusPill> },
    { id: "plan", header: "Plan", sortable: true, value: (c) => c.plan, showFrom: "md", cell: (c) => <Tag tone={planTone[c.plan]}>{c.plan}</Tag> },
    { id: "health", header: "Health", sortable: true, value: (c) => c.health, showFrom: "lg", width: 140, cell: (c) => <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 70 }}><SegmentBar value={c.health} tone="auto" segments={10} height={6} /></span><Text variant="caption" tabular>{c.health}</Text></span> },
    { id: "trend", header: "Weekly actives", showFrom: "xl", cell: (c) => <Sparkline values={c.trend} tone="auto" /> },
    { id: "owner", header: "Owner", sortable: true, value: (c) => c.owner, showFrom: "lg", defaultHidden: false, cell: (c) => <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={c.owner} size="sm" /><Text truncate>{c.owner}</Text></span> },
    { id: "mrr", header: "MRR", align: "right", sortable: true, value: (c) => c.mrr, cell: (c) => fmtMoney(c.mrr), footer: (r) => <b>{fmtMoney(r.reduce((a, c) => a + c.mrr, 0))}</b> },
  ];

  return (
    <AdminShell active="customers" go={go} header={{ title: "Customers", status: <Tag size="sm">{data.length}</Tag>, actions: <><Button size="sm" leading={<IconDownload />}>Export</Button><Button size="sm" variant="primary" leading={<IconPlus />}>Add customer</Button></> }}>
      <Page>
        <PageHeading title="Customers" description="Every account, its plan, health and revenue." size="sm" />
        <DataTable data={rows} columns={columns} getRowId={(c) => c.id} selectable pageSize={10} defaultSort={{ id: "mrr", dir: "desc" }} caption="Customers"
          activeRowId={openId} onRowClick={(c) => setOpenId(c.id)}
          toolbar={<><SearchInput size="sm" placeholder="Search customers" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} shortcut="/" />
            <FilterMenu label="Plan" value={plans} onValueChange={setPlans} options={["Starter", "Growth", "Scale", "Enterprise"].map((p) => ({ value: p, label: p, count: data.filter((c) => c.plan === p).length }))} /></>}
          rowActions={(c) => <>
            <DropdownMenuItem icon={<IconEdit />} shortcut="↵" onSelect={() => setOpenId(c.id)}>Open</DropdownMenuItem>
            <DropdownMenuItem icon={<IconCopy />} onSelect={() => { navigator.clipboard?.writeText(c.id); toast({ title: "Customer ID copied" }); }}>Copy ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<IconTrash />} destructive onSelect={() => setToDelete([c])}>Delete</DropdownMenuItem>
          </>}
          bulkActions={(sel, clear) => <>
            <Button size="sm" leading={<IconMail />} onClick={() => toast({ title: `Emailing ${sel.length} customers` })}>Email</Button>
            <Button size="sm" leading={<IconArchive />} onClick={() => { const before = data; setData((d) => d.map((c) => (sel.includes(c) ? { ...c, status: "paused" } : c))); clear(); toast({ title: `${sel.length} paused`, action: { label: "Undo", onClick: () => setData(before) } }); }}>Pause</Button>
            <Button size="sm" variant="danger" leading={<IconTrash />} onClick={() => setToDelete(sel)}>Delete</Button>
          </>}
        />
      </Page>

      <Drawer open={Boolean(open)} onOpenChange={(o) => !o && setOpenId(null)}>
        {open && (
          <DrawerContent size="lg" title={open.name} description={`${open.domain} · customer since ${open.since}`} eyebrow={<StatusPill status={customerTone[open.status]}>{customerLabel[open.status]}</StatusPill>}
            headerActions={<>
              <IconButton label="Previous" shortcut="K" size="sm" disabled={idx <= 0} onClick={() => setOpenId(rows[idx - 1]?.id)}><IconChevronUp /></IconButton>
              <IconButton label="Next" shortcut="J" size="sm" disabled={idx < 0 || idx >= rows.length - 1} onClick={() => setOpenId(rows[idx + 1]?.id)}><IconChevronDown /></IconButton>
              <MoreMenu items={[{ label: "Copy ID", icon: <IconCopy /> }, "separator", { label: "Delete customer", icon: <IconTrash />, destructive: true, onSelect: () => setToDelete([open]) }]} />
            </>}
            footer={<><Button onClick={() => setOpenId(null)}>Close</Button><Button variant="primary" leading={<IconMail />}>Email owner</Button></>}>
            <DrawerSection title="Account">
              <MetadataList items={[
                { label: "Name", value: <InlineEdit label="Customer name" value={open.name} onSave={(v) => setData((d) => d.map((c) => (c.id === open.id ? { ...c, name: v } : c)))} /> },
                { label: "ID", value: <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Text variant="mono">{open.id}</Text><CopyButton value={open.id} size="xs" /></span> },
                { label: "Plan", value: <Tag tone={planTone[open.plan]}>{open.plan}</Tag> },
                { label: "Seats", value: open.seats }, { label: "MRR", value: fmtMoney(open.mrr) }, { label: "Region", value: open.region },
                { label: "Owner", value: <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Avatar name={open.owner} size="sm" />{open.owner}</span> },
                { label: "Tags", value: <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{open.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}</span> },
              ]} />
            </DrawerSection>
            <DrawerSection title="Health"><div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ flex: 1 }}><SegmentBar value={open.health} tone="auto" segments={20} /></div><Text variant="title" tabular>{open.health}</Text></div><Sparkline values={open.trend} width={420} height={48} tone="auto" /></DrawerSection>
            <DrawerSection title="Activity"><Timeline events={[{ id: "a", title: "Invoice paid", time: "Oct 31", tone: "success" }, { id: "b", title: `${open.owner} added a note`, body: "Renewal call booked.", time: "Oct 22", marker: <Avatar name={open.owner} size="xs" /> }, { id: "c", title: "Plan changed", time: "Sep 3", tone: "info" }]} /></DrawerSection>
          </DrawerContent>
        )}
      </Drawer>

      <AlertDialog open={Boolean(toDelete)} onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.length === 1 ? toDelete[0].name : `${toDelete?.length} customers`}?`} description="Their invoices stay. You can't undo this."
        actionLabel={toDelete?.length === 1 ? "Delete customer" : `Delete ${toDelete?.length} customers`}
        onAction={() => { const ids = new Set(toDelete?.map((c) => c.id)); setData((d) => d.filter((c) => !ids.has(c.id))); if (openId && ids.has(openId)) setOpenId(null); toast({ title: "Deleted", tone: "success" }); }} />
    </AdminShell>
  );
}
