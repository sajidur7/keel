import { useMemo, useState } from "react";
import {
  Avatar, Button, CodeBlock, DataTable, DateRangePicker, DescriptionList, FilterMenu, IconDownload, Page, SearchInput,
  StatusPill, Code, type Column, type DateRange,
} from "@keel/components";
import { auditLog } from "./data";
import { AdminShell, type Nav } from "./shell";

/*
  Template: audit log. Read-only, dense, monospace for machine values, expandable rows
  for the raw event. Filters by actor, severity and date range.
*/
type Event = (typeof auditLog)[number];
const sevTone = { info: "neutral", warning: "warning", danger: "danger" } as const;
const sevLabel = { info: "Info", warning: "Notice", danger: "Alert" } as const;

export function AuditLogTemplate({ go }: { go?: (to: Nav) => void }) {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<string[]>([]);
  const [actor, setActor] = useState("all");
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 9, 30), to: new Date(2026, 10, 5) });
  const actors = [...new Set(auditLog.map((e) => e.actor))];

  const rows = useMemo(() => auditLog.filter((e) => {
    const d = new Date(e.at.replace(" ", "T"));
    return (!q || `${e.action} ${e.target} ${e.ip}`.toLowerCase().includes(q.toLowerCase())) &&
      (!sev.length || sev.includes(e.severity)) && (actor === "all" || e.actor === actor) &&
      (!range.from || d >= range.from) && (!range.to || d <= new Date(range.to.getTime() + 86_400_000));
  }), [q, sev, actor, range]);

  const columns: Column<Event>[] = [
    { id: "at", header: "Time", sortable: true, value: (e) => e.at, width: 150, cell: (e) => <span className="tabular font-mono text-caption text-soft">{e.at}</span> },
    { id: "actor", header: "Actor", sortable: true, value: (e) => e.actor, cell: (e) => <span className="flex items-center gap-2">{e.actor === "System" ? <Avatar name="System" size="sm" colored={false} /> : <Avatar name={e.actor} size="sm" />}<span className="truncate">{e.actor}</span></span> },
    { id: "action", header: "Event", sortable: true, value: (e) => e.action, cell: (e) => <Code>{e.action}</Code> },
    { id: "target", header: "Target", showFrom: "md", cell: (e) => <span className="block max-w-72 truncate text-soft">{e.target}</span> },
    { id: "sev", header: "Level", value: (e) => e.severity, showFrom: "sm", cell: (e) => <StatusPill size="sm" status={sevTone[e.severity]}>{sevLabel[e.severity]}</StatusPill> },
    { id: "ip", header: "IP address", showFrom: "lg", cell: (e) => <span className="font-mono text-caption text-subtle">{e.ip}</span> },
  ];

  return (
    <AdminShell active="audit" go={go} header={{ title: "Audit log", status: <span className="text-caption text-subtle">Kept for 365 days</span>, actions: <Button size="sm" leading={<IconDownload />}>Export<span className="hidden sm:inline">&nbsp;CSV</span></Button> }}>
      <Page>
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(e) => e.id}
          density="compact"
          defaultSort={{ id: "at", dir: "desc" }}
          pageSize={25}
          caption="Audit log events"
          toolbar={
            <>
              <SearchInput size="sm" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shellClassName="w-full sm:w-56" placeholder="Event, target or IP" />
              <DateRangePicker size="sm" value={range} onChange={setRange} className="w-auto" presets={[
                { label: "Today", range: { from: new Date(2026, 10, 5), to: new Date(2026, 10, 5) } },
                { label: "Last 7 days", range: { from: new Date(2026, 9, 30), to: new Date(2026, 10, 5) } },
                { label: "Last 30 days", range: { from: new Date(2026, 9, 7), to: new Date(2026, 10, 5) } },
              ]} />
              <FilterMenu label="Actor" value={actor} onChange={setActor} options={[{ value: "all", label: "Anyone" }, ...actors.map((a) => ({ value: a, label: a }))]} />
              <FilterMenu mode="multi" label="Level" value={sev} onChange={setSev} options={[{ value: "info", label: "Info" }, { value: "warning", label: "Notice" }, { value: "danger", label: "Alert" }]} />
            </>
          }
          renderExpanded={(e) => (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <DescriptionList items={[{ label: "Event ID", value: <Code>{e.id}</Code> }, { label: "Target", value: e.target }, { label: "IP address", value: <span className="font-mono text-caption">{e.ip}</span> }, { label: "User agent", value: "Chrome 131 · macOS" }]} />
              <CodeBlock code={JSON.stringify({ id: e.id, type: e.action, actor: e.actor, target: e.target, ip: e.ip, at: e.at.replace(" ", "T") + ":00+06:00" }, null, 2)} />
            </div>
          )}
        />
      </Page>
    </AdminShell>
  );
}
