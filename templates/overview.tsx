import { useState } from "react";
import {
  Alert, Avatar, BarChart, Button, IconArrowRight, LineChart, List, ListItem, Page, SegmentBar, SegmentedControl, Stat,
  StatGroup, StatusPill, Timeline, IconDownload,
} from "@keel/components";
import { auditLog, customers, fmtMoney, invoiceLabel, invoiceTone, invoices, revenue, revenuePrev, revenueWeeks } from "./data";
import { AdminShell, type Nav } from "./shell";

/*
  Template: overview dashboard. The question it answers: "Is the business healthy this week,
  and what needs my attention?" — four numbers, one trend, then the problems with their actions.
*/
export function OverviewTemplate({ go }: { go?: (to: Nav) => void }) {
  const [range, setRange] = useState("11w");
  const overdue = invoices.filter((i) => i.status === "overdue");
  const atRisk = customers.filter((c) => c.status === "churn-risk").sort((a, b) => a.health - b.health);
  const mrr = customers.filter((c) => c.status !== "paused").reduce((s, c) => s + c.mrr, 0);
  const n = range === "4w" ? 4 : 11;

  return (
    <AdminShell
      active="overview"
      go={go}
      header={{
        title: "Overview",
        status: <StatusPill status="active" pulse size="sm">Live</StatusPill>,
        actions: <Button size="sm" leading={<IconDownload />}>Export</Button>,
      }}
    >
      <Page width="wide" className="gap-6">
        {overdue.length > 0 && (
          <Alert tone="warning" title={`${overdue.length} invoices are overdue · ${fmtMoney(overdue.reduce((s, i) => s + i.amount, 0))}`} action={<Button size="sm" onClick={() => go?.("invoices")}>Review invoices</Button>}>
            {overdue.map((i) => i.customer).join(" and ")} haven't paid. Reminders went out on Nov 1.
          </Alert>
        )}

        <StatGroup>
          <Stat label="MRR" value={fmtMoney(mrr)} delta={6.2} baseline="vs Oct" help="Monthly recurring revenue from active and trial customers." />
          <Stat label="Customers" value={customers.length} delta={9.1} baseline="vs Oct" help="Paying and trial accounts. Churned accounts are excluded." />
          <Stat label="Net churn" value="1.8%" delta={0.4} deltaUnit="pt" baseline="vs Oct" lowerIsBetter help="MRR lost to cancellations and downgrades, minus expansion, as a share of last month's MRR." />
          <Stat label="Collected" value="$61.4k" help="Payments received this month, net of refunds." progress={{ value: 61.4, max: 102.8, label: "60% of $102.8k invoiced" }} />
        </StatGroup>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-title font-medium">Weekly revenue</h2>
              <span className="text-caption text-subtle"><span className="mr-1.5 inline-block h-0.5 w-3 rounded-full bg-data align-middle" />This year <span className="mr-1.5 ml-3 inline-block h-0.5 w-3 rounded-full bg-faint align-middle" />Last year</span>
            </div>
            <SegmentedControl size="sm" aria-label="Range" value={range} onValueChange={setRange} options={[{ value: "4w", label: "4 weeks" }, { value: "11w", label: "11 weeks" }]} />
          </div>
          <LineChart
            label={`Weekly revenue for the last ${n} weeks compared with last year`}
            labels={revenueWeeks.slice(-n)}
            series={[{ name: "This year", values: revenue.slice(-n) }, { name: "Last year", values: revenuePrev.slice(-n), tone: "muted", dashed: true }]}
            format={(v) => `$${Math.round(v / 1000)}k`}
            height={220}
          />
        </section>

        <div className="grid gap-8 border-t border-border pt-6 lg:grid-cols-2">
          <section className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-title font-medium">Churn risk</h2>
              <Button size="xs" variant="ghost" trailing={<IconArrowRight />} onClick={() => go?.("customers")}>All customers</Button>
            </div>
            <List>
              {atRisk.map((c) => (
                <ListItem key={c.id} leading={<Avatar name={c.name} shape="square" />} title={c.name} description={`${c.owner} · ${fmtMoney(c.mrr)}/mo`}
                  trailing={<span className="flex w-36 items-center gap-2"><SegmentBar value={c.health} tone="auto" label={`Health ${c.health}`} /><span className="tabular w-5 text-caption text-danger">{c.health}</span></span>} />
              ))}
            </List>
          </section>
          <section className="flex min-w-0 flex-col gap-2">
            <h2 className="text-title font-medium">Invoices paid per day</h2>
            <BarChart label="Invoices paid per day this week versus last week" labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} values={[18, 24, 21, 30, 27, 6, 4]} compare={[15, 20, 22, 25, 24, 8, 3]} height={150} format={(v) => String(Math.round(v))} />
          </section>
        </div>

        <div className="grid gap-8 border-t border-border pt-6 lg:grid-cols-2">
          <section className="flex min-w-0 flex-col gap-2">
            <h2 className="text-title font-medium">Latest invoices</h2>
            <ul className="flex flex-col">
              {invoices.slice(0, 5).map((i) => (
                <li key={i.id} className="grid grid-cols-[72px_minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border py-2.5 text-small last:border-b-0">
                  <span className="font-mono text-caption text-subtle">{i.id}</span>
                  <span className="truncate">{i.customer}</span>
                  <StatusPill size="sm" status={invoiceTone[i.status]}>{invoiceLabel[i.status]}</StatusPill>
                  <span className="tabular w-20 text-right">{fmtMoney(i.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-title font-medium">Activity</h2>
              <Button size="xs" variant="ghost" trailing={<IconArrowRight />} onClick={() => go?.("audit")}>Audit log</Button>
            </div>
            <Timeline events={auditLog.slice(0, 4).map((e) => ({ id: e.id, title: <><b>{e.actor}</b> {e.action.replace(".", " ").replace("_", " ")} · {e.target}</>, time: e.at.slice(11), tone: e.severity === "danger" ? "danger" : e.severity === "warning" ? "warning" : "default" }))} />
          </section>
        </div>
      </Page>
    </AdminShell>
  );
}
