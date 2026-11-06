import { useMemo, useState } from "react";
import {
  Avatar, Button, DataTable, DescriptionList, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger, FilterMenu, IconArchive, IconButton, IconChevronDown, IconChevronUp, IconCopy, IconDownload,
  IconEdit, IconExternal, IconMail, IconMoreHorizontal, IconPlus, IconTrash, InlineEdit, Page, SearchInput, SegmentBar,
  Sheet, SheetContent, SheetSection, Sparkline, StatusPill, Tabs, TabsList, TabsTrigger, Tag, Timeline, Code, ConfirmDialog,
  useToast, type Column, Tooltip, Kbd,
} from "@keel/components";
import { customerLabel, customerTone, customers as seed, fmtDate, fmtMoney, invoiceLabel, invoiceTone, invoices, planTone, type Customer } from "./data";
import { AdminShell, type Nav } from "./shell";

/*
  Template: list page with filters + table, and the right-side detail sheet.
  Composition only — every element is a Keel component.
*/
export function CustomersTemplate({ go, initialOpenId = null }: { go?: (to: Nav) => void; initialOpenId?: string | null }) {
  const toast = useToast();
  const [data, setData] = useState(seed);
  const [view, setView] = useState("all");
  const [q, setQ] = useState("");
  const [plans, setPlans] = useState<string[]>([]);
  const [owner, setOwner] = useState("anyone");
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const [toDelete, setToDelete] = useState<Customer[] | null>(null);

  const rows = useMemo(
    () =>
      data.filter((c) =>
        (view === "all" || (view === "risk" ? c.status === "churn-risk" : c.status === view)) &&
        (!q || `${c.name} ${c.domain}`.toLowerCase().includes(q.toLowerCase())) &&
        (!plans.length || plans.includes(c.plan)) &&
        (owner === "anyone" || c.owner === owner),
      ),
    [data, view, q, plans, owner],
  );
  const open = data.find((c) => c.id === openId) ?? null;
  const idx = rows.findIndex((c) => c.id === openId);

  const columns: Column<Customer>[] = [
    {
      id: "name", header: "Customer", title: "Customer", required: true, sortable: true, value: (c) => c.name,
      cell: (c) => (
        <span className="flex min-w-0 items-center gap-2.5">
          <Avatar name={c.name} shape="square" />
          <span className="flex min-w-0 flex-col">
            <span className="max-w-56 truncate text-foreground">{c.name}</span>
            <span className="truncate text-caption text-subtle">{c.domain}</span>
          </span>
        </span>
      ),
    },
    { id: "status", header: "Status", sortable: true, value: (c) => c.status, cell: (c) => <StatusPill status={customerTone[c.status]}>{customerLabel[c.status]}</StatusPill> },
    { id: "plan", header: "Plan", sortable: true, value: (c) => c.plan, showFrom: "md", cell: (c) => <Tag tone={planTone[c.plan]}>{c.plan}</Tag> },
    { id: "health", header: "Health", sortable: true, value: (c) => c.health, showFrom: "lg", cell: (c) => <span className="flex items-center gap-2.5"><SegmentBar value={c.health} tone="auto" className="w-20" label={`Health ${c.health}`} /><span className="tabular w-6 text-caption text-subtle">{c.health}</span></span> },
    { id: "usage", header: "Active users", showFrom: "xl", cell: (c) => <Sparkline values={c.trend} tone={c.health < 40 ? "danger" : "data"} label="Weekly active users, 10 weeks" /> },
    { id: "owner", header: "Owner", sortable: true, value: (c) => c.owner, showFrom: "lg", cell: (c) => <span className="flex items-center gap-2 text-soft"><Avatar size="sm" name={c.owner} />{c.owner.split(" ")[0]}</span> },
    { id: "seats", header: "Seats", align: "right", sortable: true, value: (c) => c.seats, showFrom: "sm", cell: (c) => c.seats.toLocaleString(), footer: (r) => r.reduce((s, c) => s + c.seats, 0).toLocaleString() },
    { id: "mrr", header: "MRR", align: "right", sortable: true, value: (c) => c.mrr, cell: (c) => fmtMoney(c.mrr), footer: (r) => fmtMoney(r.reduce((s, c) => s + c.mrr, 0)) },
    { id: "region", header: "Region", defaultHidden: true, value: (c) => c.region, cell: (c) => c.region },
  ];
  const counts = { all: data.length, active: data.filter((c) => c.status === "active").length, trial: data.filter((c) => c.status === "trial").length, risk: data.filter((c) => c.status === "churn-risk").length };
  const owners = [...new Set(data.map((c) => c.owner))];

  return (
    <AdminShell
      active="customers"
      go={go}
      header={{
        title: "Customers",
        status: <span className="tabular text-caption text-subtle">{data.length}</span>,
        actions: (
          <>
            <Button size="sm" leading={<IconDownload />} className="hidden sm:inline-flex">Export</Button>
            <Button size="sm" variant="primary" leading={<IconPlus />}>New customer</Button>
          </>
        ),
        tabs: (
          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="all" count={counts.all}>All</TabsTrigger>
              <TabsTrigger value="active" count={counts.active}>Active</TabsTrigger>
              <TabsTrigger value="trial" count={counts.trial}>Trial</TabsTrigger>
              <TabsTrigger value="risk" count={counts.risk}>Churn risk</TabsTrigger>
            </TabsList>
          </Tabs>
        ),
      }}
    >
      <Page className="pt-1 sm:pt-2">
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(c) => c.id}
          selectable
          pageSize={10}
          defaultSort={{ id: "mrr", dir: "desc" }}
          onRowClick={(c) => setOpenId(c.id)}
          activeRowId={openId}
          caption="Customers"
          toolbar={
            <>
              <SearchInput size="sm" shortcut="/" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shellClassName="w-full sm:w-64" placeholder="Search name or domain" />
              <FilterMenu mode="multi" label="Plan" value={plans} onChange={setPlans} options={(["Starter", "Growth", "Scale", "Enterprise"] as const).map((p) => ({ value: p, label: p, count: data.filter((c) => c.plan === p).length }))} />
              <FilterMenu label="Owner" value={owner} onChange={setOwner} options={[{ value: "anyone", label: "Anyone" }, ...owners.map((o) => ({ value: o, label: o }))]} />
            </>
          }
          bulkActions={(sel, clear) => (
            <>
              <Button size="sm" leading={<IconMail />} onClick={() => { toast({ title: `Email drafted to ${sel.length} customers` }); clear(); }}>Email</Button>
              <Button size="sm" leading={<IconArchive />} onClick={() => {
                const ids = new Set(sel.map((s) => s.id));
                const before = data;
                setData(data.map((c) => (ids.has(c.id) ? { ...c, status: "paused" as const } : c)));
                clear();
                toast({ title: `${sel.length} customers paused`, action: { label: "Undo", onClick: () => setData(before) } });
              }}>Pause</Button>
              <Button size="sm" variant="danger-ghost" leading={<IconTrash />} onClick={() => setToDelete(sel)}>Delete</Button>
            </>
          )}
          rowActions={(c) => (
            <>
              <DropdownMenuItem icon={<IconEdit />} onSelect={() => setOpenId(c.id)} shortcut="↵">Open</DropdownMenuItem>
              <DropdownMenuItem icon={<IconCopy />} onSelect={() => { navigator.clipboard?.writeText(c.id); toast({ title: "Customer ID copied" }); }}>Copy ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<IconTrash />} destructive onSelect={() => setToDelete([c])}>Delete</DropdownMenuItem>
            </>
          )}
        />
      </Page>

      <Sheet open={Boolean(open)} onOpenChange={(o) => !o && setOpenId(null)}>
        {open && (
          <SheetContent
            size="lg"
            title={open.name}
            description={open.domain}
            eyebrow={<span className="flex items-center gap-2"><StatusPill size="sm" status={customerTone[open.status]}>{customerLabel[open.status]}</StatusPill><Tag size="sm" tone={planTone[open.plan]}>{open.plan}</Tag></span>}
            headerActions={
              <>
                <Tooltip content="Previous" shortcut="K"><IconButton label="Previous customer" size="sm" disabled={idx <= 0} onClick={() => setOpenId(rows[idx - 1]?.id)}><IconChevronUp /></IconButton></Tooltip>
                <Tooltip content="Next" shortcut="J"><IconButton label="Next customer" size="sm" disabled={idx < 0 || idx >= rows.length - 1} onClick={() => setOpenId(rows[idx + 1]?.id)}><IconChevronDown /></IconButton></Tooltip>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><IconButton label="More" size="sm"><IconMoreHorizontal /></IconButton></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem icon={<IconExternal />}>Open in Stripe</DropdownMenuItem>
                    <DropdownMenuItem icon={<IconCopy />}>Copy ID</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem icon={<IconTrash />} destructive onSelect={() => setToDelete([open])}>Delete customer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            }
          >
            <SheetSection title="Details">
              <DescriptionList items={[
                { label: "Name", value: <InlineEdit label="Name" value={open.name} onSave={(v) => setData(data.map((c) => (c.id === open.id ? { ...c, name: v } : c)))} validate={(v) => (v.trim() ? null : "Name can't be empty")} /> },
                { label: "Owner", value: <span className="flex items-center gap-2"><Avatar size="sm" name={open.owner} />{open.owner}</span> },
                { label: "Region", value: open.region },
                { label: "Seats", value: <span className="tabular">{open.seats}</span> },
                { label: "MRR", value: <span className="tabular">{fmtMoney(open.mrr)}</span> },
                { label: "Customer since", value: fmtDate(open.since) },
                { label: "Account ID", value: <Code>{open.id}</Code> },
                { label: "Tags", value: <span className="flex flex-wrap gap-1">{open.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}</span> },
              ]} />
            </SheetSection>
            <SheetSection title="Health">
              <div className="flex items-center gap-4">
                <span className="tabular text-display font-medium">{open.health}</span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <SegmentBar value={open.health} tone="auto" label="Health score" />
                  <span className="text-caption text-subtle">Weekly active users, last 10 weeks</span>
                </div>
                <Sparkline values={open.trend} width={88} height={24} tone={open.health < 40 ? "danger" : "data"} />
              </div>
            </SheetSection>
            <SheetSection title="Invoices" action={<Button size="xs" variant="ghost" onClick={() => go?.("invoices")}>View all</Button>}>
              {invoices.filter((i) => i.customer === open.name).length === 0 ? (
                <p className="text-small text-subtle">No invoices yet.</p>
              ) : (
                <ul className="flex flex-col">
                  {invoices.filter((i) => i.customer === open.name).map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-3 border-b border-border py-2 text-small last:border-b-0">
                      <span className="font-mono text-caption text-soft">{i.id}</span>
                      <StatusPill size="sm" status={invoiceTone[i.status]}>{invoiceLabel[i.status]}</StatusPill>
                      <span className="tabular ml-auto">{fmtMoney(i.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </SheetSection>
            <SheetSection title="Activity">
              <Timeline events={[
                { id: "a", title: <><b>{open.owner}</b> logged a call</>, body: "Discussed renewal and SSO rollout for Q1.", time: "2 h ago" },
                { id: "b", title: <><b>Invoice</b> paid</>, time: "Oct 31", tone: "success" },
                { id: "c", title: <><b>Seats</b> changed {open.seats - 10} → {open.seats}</>, time: "Oct 14" },
              ]} />
            </SheetSection>
            <p className="pt-2 text-caption text-faint"><Kbd>Esc</Kbd> to close</p>
          </SheetContent>
        )}
      </Sheet>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        tone="danger"
        title={toDelete?.length === 1 ? `Delete ${toDelete[0].name}?` : `Delete ${toDelete?.length} customers?`}
        description="Their invoices, notes and activity will be deleted. This can't be undone."
        confirmLabel={toDelete?.length === 1 ? "Delete customer" : `Delete ${toDelete?.length} customers`}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 600));
          const ids = new Set(toDelete!.map((c) => c.id));
          setData((d) => d.filter((c) => !ids.has(c.id)));
          if (openId && ids.has(openId)) setOpenId(null);
          toast({ title: `${ids.size} ${ids.size === 1 ? "customer" : "customers"} deleted` });
          setToDelete(null);
        }}
      />
    </AdminShell>
  );
}
