import { useState } from "react";
import {
  Avatar, Button, DataTable, DescriptionList, DropdownMenuItem, DropdownMenuSeparator, FilterMenu, IconArchive, IconCopy,
  IconDownload, IconEdit, IconMail, IconTrash, SearchInput, SegmentBar, Sparkline, StatusPill, Table, TableBody,
  TableCell, TableContainer, TableHead, TableHeader, TableRow, Tag, type Column,
} from "@keel/components";
import { customerLabel, customerTone, customers, fmtMoney, planTone, type Customer } from "@keel/templates/data";
import type { DocPage } from "../docs/types";

const columns: Column<Customer>[] = [
  {
    id: "name", header: "Customer", title: "Customer", required: true, sortable: true, value: (c) => c.name,
    cell: (c) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar name={c.name} shape="square" size="md" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-foreground">{c.name}</span>
          <span className="truncate text-caption text-subtle">{c.domain}</span>
        </span>
      </span>
    ),
  },
  {
    id: "status", header: "Status", sortable: true, value: (c) => c.status,
    filterOptions: Object.entries(customerLabel).map(([value, label]) => ({ value, label })),
    cell: (c) => <StatusPill status={customerTone[c.status]}>{customerLabel[c.status]}</StatusPill>,
  },
  { id: "plan", header: "Plan", value: (c) => c.plan, sortable: true, showFrom: "md", cell: (c) => <Tag tone={planTone[c.plan]}>{c.plan}</Tag> },
  { id: "health", header: "Health", value: (c) => c.health, sortable: true, showFrom: "lg", width: 160, cell: (c) => <span className="flex items-center gap-2.5"><SegmentBar value={c.health} tone="auto" className="w-24" label="Health" /><span className="tabular text-caption text-subtle">{c.health}</span></span> },
  { id: "trend", header: "Usage", showFrom: "xl", cell: (c) => <Sparkline values={c.trend} tone={c.health < 40 ? "danger" : "data"} /> },
  { id: "owner", header: "Owner", value: (c) => c.owner, showFrom: "lg", defaultHidden: false, cell: (c) => <span className="flex items-center gap-2 text-soft"><Avatar size="sm" name={c.owner} />{c.owner}</span> },
  { id: "seats", header: "Seats", align: "right", value: (c) => c.seats, sortable: true, showFrom: "sm", cell: (c) => c.seats, footer: (rows) => rows.reduce((s, r) => s + r.seats, 0).toLocaleString() },
  { id: "mrr", header: "MRR", align: "right", value: (c) => c.mrr, sortable: true, cell: (c) => fmtMoney(c.mrr), footer: (rows) => fmtMoney(rows.reduce((s, r) => s + r.mrr, 0)) },
  { id: "region", header: "Region", value: (c) => c.region, defaultHidden: true, cell: (c) => c.region },
];

export function FullTable() {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<string[]>([]);
  const rows = customers.filter((c) => (!q || c.name.toLowerCase().includes(q.toLowerCase())) && (!plan.length || plan.includes(c.plan)));
  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowId={(c) => c.id}
      selectable
      pageSize={8}
      defaultSort={{ id: "mrr", dir: "desc" }}
      caption="Customers"
      toolbar={
        <>
          <SearchInput size="sm" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shellClassName="w-full sm:w-60" placeholder="Search customers" />
          <FilterMenu mode="multi" label="Plan" value={plan} onChange={setPlan} options={["Starter", "Growth", "Scale", "Enterprise"].map((p) => ({ value: p, label: p, count: customers.filter((c) => c.plan === p).length }))} />
        </>
      }
      bulkActions={(sel, clear) => (
        <>
          <Button size="sm" leading={<IconMail />}>Email {sel.length}</Button>
          <Button size="sm" leading={<IconDownload />}>Export</Button>
          <Button size="sm" variant="danger-ghost" leading={<IconArchive />} onClick={clear}>Archive</Button>
        </>
      )}
      rowActions={(c) => (
        <>
          <DropdownMenuItem icon={<IconEdit />} shortcut="E">Edit</DropdownMenuItem>
          <DropdownMenuItem icon={<IconCopy />} onSelect={() => navigator.clipboard?.writeText(c.id)}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem>
        </>
      )}
    />
  );
}

export function ExpandableTable() {
  return (
    <DataTable
      data={customers.slice(0, 4)}
      columns={columns.filter((c) => ["name", "status", "mrr"].includes(c.id))}
      getRowId={(c) => c.id}
      renderExpanded={(c) => (
        <DescriptionList columns={2} items={[
          { label: "Owner", value: c.owner }, { label: "Region", value: c.region },
          { label: "Seats", value: c.seats }, { label: "Tags", value: <span className="flex flex-wrap gap-1">{c.tags.map((t) => <Tag key={t} size="sm">{t}</Tag>)}</span> },
        ]} />
      )}
    />
  );
}

export function TableStates() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Button size="sm" className="self-start" onClick={() => setLoading((l) => !l)}>{loading ? "Show data" : "Show loading"}</Button>
        <DataTable data={customers.slice(0, 3)} columns={columns.slice(0, 3)} getRowId={(c) => c.id} loading={loading} loadingRows={3} />
      </div>
      <DataTable data={[]} columns={columns.slice(0, 3)} getRowId={(c) => c.id} />
    </div>
  );
}

export function DenseTable() {
  return (
    <DataTable data={customers.slice(0, 6)} columns={columns.filter((c) => ["name", "plan", "seats", "mrr"].includes(c.id))} getRowId={(c) => c.id} density="compact" stickyHeader maxHeight={220} />
  );
}

export function PrimitiveTable() {
  return (
    <TableContainer className="w-full">
      <Table>
        <TableHeader>
          <tr><TableHead>Plan</TableHead><TableHead align="right">Customers</TableHead><TableHead align="right">MRR</TableHead></tr>
        </TableHeader>
        <TableBody>
          {(["Enterprise", "Scale", "Growth", "Starter"] as const).map((p) => {
            const list = customers.filter((c) => c.plan === p);
            return (
              <TableRow key={p}>
                <TableCell className="h-10"><Tag tone={planTone[p]}>{p}</Tag></TableCell>
                <TableCell align="right">{list.length}</TableCell>
                <TableCell align="right">{fmtMoney(list.reduce((s, c) => s + c.mrr, 0))}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export const docs: DocPage[] = [
  {
    slug: "table", title: "Table", group: "Data display", section: "Components", source: "table", keywords: ["data table", "grid", "datagrid", "list"],
    summary: "The core of admin work. DataTable adds sorting, row selection with bulk actions, header filters, column visibility, density, expandable rows, row actions, loading and empty states, footer totals and pagination. The primitives (Table, TableRow, TableCell…) are there for simple static tables.",
    whenToUse: ["Comparing many records across the same attributes.", "Anything users sort, filter, select in bulk or scan for problems."],
    whenNot: ["A handful of items with one action each — use List.", "One record's fields — use DescriptionList."],
    demos: [
      { id: "FullTable", title: "Everything on", description: "Sort by clicking headers, filter Status from its header icon, select rows to see bulk actions, open View for density and columns. Plan, Health, Usage and Owner hide on small screens; the table scrolls inside its container, never the page.", render: FullTable, full: true },
      { id: "ExpandableTable", title: "Expandable rows", render: ExpandableTable, full: true },
      { id: "TableStates", title: "Loading and empty", description: "Skeleton rows keep column widths; the empty state offers the next step.", render: TableStates, full: true },
      { id: "DenseTable", title: "Compact density with sticky header", description: "Give the table a maxHeight and the header sticks while the body scrolls.", render: DenseTable, full: true },
      { id: "PrimitiveTable", title: "Primitives", description: "Plain parts with Keel's rhythm for simple summaries.", render: PrimitiveTable, full: true },
    ],
    api: [
      { title: "DataTable", props: [
        { name: "data / columns / getRowId", type: "T[] / Column<T>[] / (row) => string", description: "Required." },
        { name: "selectable", type: "boolean", description: "Checkbox column with select-all (indeterminate when partial)." },
        { name: "selected / onSelectedChange", type: "Set<string>", description: "Controlled selection." },
        { name: "bulkActions", type: "(rows, clear) => ReactNode", description: "Replaces the toolbar while rows are selected." },
        { name: "rowActions", type: "(row) => ReactNode", description: "DropdownMenuItems for the … button." },
        { name: "renderExpanded", type: "(row) => ReactNode", description: "Adds an expand chevron column." },
        { name: "onRowClick / activeRowId", type: "(row) => void / string", description: "Open a detail sheet; highlight the open row. Rows become focusable (Enter opens)." },
        { name: "loading / loadingRows", type: "boolean / number", default: "— / 8", description: "Skeleton rows; sets aria-busy." },
        { name: "empty", type: "ReactNode", description: "Custom empty state." },
        { name: "defaultSort", type: '{ id; dir: "asc" | "desc" }', description: "" },
        { name: "density / onDensityChange", type: '"compact" | "default" | "comfortable"', default: '"default"', description: "32 / 40 / 48px rows." },
        { name: "pageSize", type: "number", description: "Client-side pagination." },
        { name: "toolbar", type: "ReactNode", description: "Search and filters, left of the View menu." },
        { name: "stickyHeader / maxHeight", type: "boolean / number | string", default: "true / —", description: "" },
      ] },
      { title: "Column<T>", props: [
        { name: "id / header / cell", type: "string / ReactNode / (row) => ReactNode", description: "Required." },
        { name: "value", type: "(row) => string | number | Date", description: "Used by sort and filter." },
        { name: "sortable", type: "boolean", description: "" },
        { name: "filterOptions", type: "{ label; value }[]", description: "Header filter menu." },
        { name: "align", type: '"left" | "right" | "center"', description: "Right-align numbers (tabular figures applied)." },
        { name: "showFrom", type: '"sm" | "md" | "lg" | "xl"', description: "Hide secondary columns below this breakpoint." },
        { name: "defaultHidden / required", type: "boolean", description: "Column visibility defaults." },
        { name: "footer", type: "(rows) => ReactNode", description: "Summary cell (uses filtered rows)." },
      ] },
    ],
    a11y: [
      "Sortable headers are buttons and the header cell carries aria-sort.",
      "Select-all reports “mixed” when some rows on the page are selected.",
      "Clickable rows are focusable and open with Enter; row checkboxes and the actions menu don't trigger the row click.",
      "Pass `caption` for a screen-reader table name.",
    ],
    dos: [
      { do: "Right-align numbers and money so digits line up.", dont: "Center numbers or mix units in one column." },
      { do: "Hide secondary columns on small screens with showFrom.", dont: "Let the page scroll horizontally." },
      { do: "Keep one line per row; put the second fact in a muted line under the name.", dont: "Wrap long text into tall rows." },
    ],
  },
];
