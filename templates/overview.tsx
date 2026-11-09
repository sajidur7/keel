import { useState } from "react";
import {
  Avatar, Button, Card, CardBody, CardHeader, DonutChart, IconDownload, IconPlus, InsightCard, LineChart, Link, List, ListItem, MoreMenu, Page, PageHeading, Section,
  SegmentedControl, Sparkline, Stat, StatGroup, StatusPill, Timeline, Grid,
} from "@keel/components";
import { customers, fmtMoney, invoiceLabel, invoices, invoiceTone, revenue, revenuePrev, revenueWeeks } from "./data";
import { AdminShell, type Nav } from "./shell";

export function OverviewTemplate({ go }: { go?: (to: Nav) => void }) {
  const [range, setRange] = useState("11w");
  const mrr = customers.reduce((a, c) => a + c.mrr, 0);
  const risk = customers.filter((c) => c.health < 50);
  return (
    <AdminShell active="overview" go={go} header={{ title: "Overview", actions: <><Button size="sm" leading={<IconDownload />}>Export</Button><Button size="sm" variant="primary" leading={<IconPlus />} onClick={() => go?.("invoices")}>New invoice</Button></> }}>
      <Page>
        <PageHeading title="Good morning, Nadia" description="Here's how Fernhill is doing this week." size="sm" actions={<SegmentedControl size="sm" value={range} onValueChange={setRange} items={[{ value: "4w", label: "4w" }, { value: "11w", label: "11w" }, { value: "1y", label: "1y" }]} />} />
        <StatGroup>
          <Stat label="MRR" help="Monthly recurring revenue from active subscriptions." value={fmtMoney(mrr)} delta={6.2} baseline="vs Oct" chart={<Sparkline values={revenue.map((v) => v / 1000)} width={150} />} />
          <Stat label="Customers" value={customers.length} delta={2} deltaUnit="" baseline="new this month" />
          <Stat label="Net churn" help="Revenue lost to cancellations and downgrades this month." value="1.8%" delta={-0.4} deltaUnit="pt" lowerIsBetter baseline="vs Oct" />
          <Stat label="Collected" value={fmtMoney(62700)} progress={{ value: 62.7, max: 102.8, label: `61% of ${fmtMoney(102800)} invoiced` }} />
        </StatGroup>
        <Grid columns={3} gap={16} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}>
          <Card padding="none" style={{ gridColumn: "span 2" }}>
            <CardHeader title="Revenue" description="Weekly, compared with last year" action={<MoreMenu items={[{ label: "Open report" }, { label: "Export CSV" }]} />} />
            <CardBody><LineChart label="Weekly revenue, up 6.6% over 11 weeks" labels={revenueWeeks} format={(n) => fmtMoney(n / 1000) + "k"} legend
              series={[{ name: "This year", values: revenue }, { name: "Last year", values: revenuePrev, color: "muted", dashed: true }]} /></CardBody>
          </Card>
          <InsightCard title="At-risk revenue" value={fmtMoney(risk.reduce((a, c) => a + c.mrr, 0))} trend={[3, 4, 4, 6, 7, 9, 10]} explanation={`${risk.length} accounts dropped below 50 health — mostly falling weekly actives.`} onAsk={() => go?.("assistant")} />
        </Grid>
        <Grid columns={3} gap={16} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}>
          <Section variant="card" title="Recent invoices" action={<Link href="#" onClick={(e) => { e.preventDefault(); go?.("invoices"); }}>View all</Link>}>
            <List>{invoices.slice(0, 5).map((i) => <ListItem key={i.id} title={i.customer} description={`${i.id} · ${i.method}`} meta={fmtMoney(i.amount)} trailing={<StatusPill status={invoiceTone[i.status]}>{invoiceLabel[i.status]}</StatusPill>} />)}</List>
          </Section>
          <Section variant="card" title="Plan mix"><DonutChart label="Customers by plan" size={140} data={["Starter", "Growth", "Scale", "Enterprise"].map((p) => ({ name: p, value: customers.filter((c) => c.plan === p).length }))} centerLabel="Customers" /></Section>
          <Section variant="card" title="Activity">
            <Timeline events={[
              { id: "1", title: <span><b>INV-2063</b> sent to Tidewater</span>, time: "14:22", marker: <Avatar name="Rafi Ahmed" size="xs" /> },
              { id: "2", title: "Payment failed · Riverbend", time: "09:00", tone: "danger" },
              { id: "3", title: "SSO enabled with Okta", time: "Yesterday", tone: "info" },
            ]} />
          </Section>
        </Grid>
      </Page>
    </AdminShell>
  );
}
