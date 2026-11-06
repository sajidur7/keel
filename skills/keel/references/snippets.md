# Snippets

Copy, then adapt. Full working screens are in `templates/`.

## App root

```tsx
import { Toaster, TooltipProvider } from "@/keel/components";

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Toaster>{children}</Toaster>
    </TooltipProvider>
  );
}
```

## Shell + list page

```tsx
import {
  AppShell, Sidebar, SidebarBrand, SidebarContent, SidebarSection, SidebarItem, SidebarTrigger, Header, Page,
  Button, DataTable, SearchInput, FilterMenu, StatusPill, Avatar, DropdownMenuItem, DropdownMenuSeparator,
  IconHome, IconBuilding, IconPlus, IconTrash, IconEdit, type Column,
} from "@/keel/components";

type Customer = { id: string; name: string; domain: string; status: "active" | "trial"; mrr: number };

const columns: Column<Customer>[] = [
  { id: "name", header: "Customer", required: true, sortable: true, value: (c) => c.name,
    cell: (c) => (
      <span className="flex items-center gap-2.5">
        <Avatar name={c.name} shape="square" />
        <span className="flex flex-col"><span>{c.name}</span><span className="text-caption text-subtle">{c.domain}</span></span>
      </span>
    ) },
  { id: "status", header: "Status", value: (c) => c.status,
    cell: (c) => <StatusPill status={c.status === "active" ? "active" : "info"}>{c.status === "active" ? "Active" : "Trial"}</StatusPill> },
  { id: "mrr", header: "MRR", align: "right", sortable: true, value: (c) => c.mrr, cell: (c) => `$${c.mrr.toLocaleString()}` },
];

export function CustomersPage({ data }: { data: Customer[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const rows = data.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) && (!status.length || status.includes(c.status)));
  return (
    <AppShell sidebar={
      <Sidebar>
        <SidebarBrand logo={<span>F</span>} name="Fernhill" meta="Operations" />
        <SidebarContent>
          <SidebarSection title="Workspace">
            <SidebarItem icon={<IconHome />} label="Overview" href="/" />
            <SidebarItem icon={<IconBuilding />} label="Customers" count={data.length} active />
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    }>
      <Header start={<SidebarTrigger />} title="Customers"
        actions={<Button size="sm" variant="primary" leading={<IconPlus />}>New customer</Button>} />
      <Page>
        <DataTable
          data={rows} columns={columns} getRowId={(c) => c.id} selectable pageSize={25} caption="Customers"
          toolbar={<>
            <SearchInput size="sm" shortcut="/" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shellClassName="w-full sm:w-64" />
            <FilterMenu mode="multi" label="Status" value={status} onChange={setStatus}
              options={[{ value: "active", label: "Active" }, { value: "trial", label: "Trial" }]} />
          </>}
          rowActions={() => <>
            <DropdownMenuItem icon={<IconEdit />}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem>
          </>}
        />
      </Page>
    </AppShell>
  );
}
```

## Detail sheet

```tsx
<Sheet open={Boolean(open)} onOpenChange={(o) => !o && setOpenId(null)}>
  {open && (
    <SheetContent size="lg" title={open.name} description={open.domain}
      eyebrow={<StatusPill size="sm" status="active">Active</StatusPill>}>
      <SheetSection title="Details">
        <DescriptionList items={[
          { label: "Owner", value: open.owner },
          { label: "Account ID", value: <Code>{open.id}</Code> },
        ]} />
      </SheetSection>
      <SheetSection title="Activity"><Timeline events={events} /></SheetSection>
    </SheetContent>
  )}
</Sheet>
```

## Form with validation

```tsx
<form noValidate onSubmit={submit} className="flex flex-col gap-5">
  {errorCount > 0 && <Alert tone="danger" title={`Fix ${errorCount} fields`}>Fields with problems are marked below.</Alert>}
  <FormField label="Billing email" required error={errors.email} help="Receipts are sent here">
    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
  </FormField>
  <FormField label="Due date" required error={errors.due}>
    <DatePicker value={due} onChange={setDue} min={today} />
  </FormField>
  <div className="flex gap-2">
    <Button type="submit" variant="primary" loading={saving}>Create invoice</Button>
    <Button variant="ghost">Cancel</Button>
  </div>
</form>
```

## Destructive confirm

```tsx
<ConfirmDialog
  trigger={<Button variant="danger">Delete 3 customers</Button>}
  tone="danger"
  title="Delete 3 customers?"
  description="Their invoices and activity will be deleted. This can't be undone."
  confirmLabel="Delete customers"
  onConfirm={async () => { await api.delete(ids); toast({ title: "3 customers deleted" }); }}
/>
```

## Stats with a baseline

Every part except label and value is optional. The label gets a dashed underline when it has `help`.

```tsx
<StatGroup>
  <Stat label="MRR" value="$102,750" delta={6.2} baseline="vs Oct" help="Recurring revenue from active subscriptions." />
  <Stat label="Churn" value="1.8%" delta={0.4} deltaUnit="pt" baseline="vs Oct" lowerIsBetter help="MRR lost to cancellations." />
  <Stat label="Collected" value="$61.4k" help="Payments received this month."
    progress={{ value: 61.4, max: 102.8, label: "60% of $102.8k invoiced" }} />
</StatGroup>

{/* Standalone */}
<Stat variant="card" label="Open tickets" value="23" delta={-4} deltaUnit="" baseline="since yesterday" lowerIsBetter
  action={<IconButton size="xs" variant="ghost" label="More"><IconMoreHorizontal /></IconButton>}
  footer={<><span>3 over SLA</span><a href="/support">Open queue</a></>} />
```

## Another Lucide icon

```tsx
import { Truck } from "lucide-react";
import { keelIcon } from "@/keel/components";
export const IconTruck = keelIcon(Truck);
```
