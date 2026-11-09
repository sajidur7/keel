import { useState } from "react";
import {
  Avatar, Button, CodeBlock, DataTable, DateRangeInput, IconDownload, Page, PageHeading, PowerSearch, StatusPill, Text, type Column, type DateRange, type PowerFilter,
} from "@keel/components";
import { auditLog, people } from "./data";
import { AdminShell, type Nav } from "./shell";

type Event = (typeof auditLog)[number];
const SEV = { info: "info", warning: "warning", danger: "danger" } as const;

export function AuditLogTemplate({ go }: { go?: (to: Nav) => void }) {
  const [filters, setFilters] = useState<PowerFilter[]>([]);
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 10, 1), to: new Date(2026, 10, 5) });
  const rows = auditLog.filter((e) => filters.every((f) => {
    const v = f.field === "actor" ? e.actor : f.field === "action" ? e.action : f.field === "severity" ? e.severity : `${e.actor} ${e.action} ${e.target}`;
    const hit = v.toLowerCase().includes(f.value.toLowerCase());
    return f.operator === "is not" ? !hit : hit;
  }));
  const columns: Column<Event>[] = [
    { id: "at", header: "Time", sortable: true, value: (e) => e.at, width: 150, cell: (e) => <Text variant="mono" tone="muted">{e.at}</Text> },
    { id: "actor", header: "Actor", sortable: true, value: (e) => e.actor, cell: (e) => <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={e.actor} size="sm" colored={e.actor !== "System"} />{e.actor}</span> },
    { id: "action", header: "Action", value: (e) => e.action, cell: (e) => <Text variant="mono">{e.action}</Text> },
    { id: "target", header: "Target", showFrom: "md", cell: (e) => <Text truncate>{e.target}</Text> },
    { id: "sev", header: "Severity", value: (e) => e.severity, showFrom: "sm", cell: (e) => <StatusPill status={SEV[e.severity]}>{e.severity}</StatusPill> },
    { id: "ip", header: "IP", showFrom: "lg", cell: (e) => <Text variant="mono" tone="muted">{e.ip}</Text> },
  ];
  return (
    <AdminShell active="audit" go={go} header={{ title: "Audit log", actions: <Button size="sm" leading={<IconDownload />}>Export CSV</Button> }}>
      <Page>
        <PageHeading title="Audit log" description="Every sign-in, permission change and money movement, kept for 400 days." size="sm" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <div style={{ flex: "1 1 420px" }}><PowerSearch filters={filters} onFiltersChange={setFilters} placeholder="Filter by actor, action or severity…" fields={[
            { key: "actor", label: "Actor", values: ["System", ...people.map((p) => p.name)] },
            { key: "action", label: "Action", values: [...new Set(auditLog.map((e) => e.action))] },
            { key: "severity", label: "Severity", values: ["info", "warning", "danger"] },
          ]} /></div>
          <div style={{ width: 280 }}><DateRangeInput value={range} onValueChange={setRange} /></div>
        </div>
        <DataTable data={rows} columns={columns} getRowId={(e) => e.id} pageSize={8} density="compact" caption="Audit events"
          renderExpanded={(e) => <CodeBlock language="json" code={JSON.stringify({ id: e.id, actor: e.actor, action: e.action, target: e.target, ip: e.ip, at: e.at }, null, 2)} />} />
      </Page>
    </AdminShell>
  );
}
