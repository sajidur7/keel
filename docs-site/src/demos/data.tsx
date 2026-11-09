import { useState } from "react";
import {
  AreaChart, BarChart, Button, Card, DonutChart, IconCard, IconDollarSign, IconUsers, LineChart, Link, MoreMenu, SegmentBar, SegmentedControl, Sparkline, Stat, StatGroup,
  Switch, Text,
} from "@keel/components";
import { Row, State, StateGrid } from "../docs/kit";

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ---------------- Stat ---------------- */
export function StatDemo() {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
      <StatGroup>
        <Stat label="MRR" help="Monthly recurring revenue, normalized to a month." icon={<IconDollarSign />} value="$84,320" delta={6.2} baseline="vs Oct" chart={<Sparkline values={[60, 62, 64, 63, 68, 71, 74, 79, 84]} width={140} />} />
        <Stat label="Customers" icon={<IconUsers />} value="1,284" delta={2.1} meta="12 new this week" />
        <Stat label="Net churn" help="Revenue lost to cancellations and downgrades." value="1.8%" delta={-0.4} deltaUnit="pt" lowerIsBetter baseline="vs Oct" />
        <Stat label="Collected" icon={<IconCard />} value="$62.7k" progress={{ value: 62.7, max: 102.8, label: "61% of $102.8k invoiced" }} />
      </StatGroup>
    </div>
  );
}
export function StatPlayground() {
  const [on, setOn] = useState({ help: true, icon: true, action: true, delta: true, meta: false, progress: false, chart: true, footer: true, card: true, inline: false });
  const t = (k: keyof typeof on) => <Switch size="sm" label={k} checked={on[k]} onCheckedChange={(v) => setOn({ ...on, [k]: v })} />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 24, width: "100%", alignItems: "start" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{(Object.keys(on) as (keyof typeof on)[]).map((k) => <span key={k}>{t(k)}</span>)}</div>
      <Stat label="Revenue" value="$84,320" variant={on.card ? "card" : "plain"} layout={on.inline ? "inline" : "stacked"}
        help={on.help ? "Sum of paid invoices this month." : undefined} icon={on.icon ? <IconDollarSign /> : undefined}
        action={on.action ? <MoreMenu items={[{ label: "View report" }, { label: "Export" }]} /> : undefined}
        delta={on.delta ? 6.2 : undefined} baseline={on.delta ? "vs Oct" : undefined} meta={on.meta ? "of $102.8k target" : undefined}
        progress={on.progress ? { value: 82, label: "82% of target" } : undefined} chart={on.chart ? <Sparkline values={[3, 4, 3, 5, 6, 5, 7, 8]} width={160} /> : undefined}
        footer={on.footer ? <><span>Updated 2 min ago</span><Link href="#">Details</Link></> : undefined} />
    </div>
  );
}
export function StatStates() {
  return (
    <StateGrid min={200}>
      <State label="Sizes"><Stat size="sm" label="Small" value="1,284" /><Stat size="lg" label="Large" value="$84k" /></State>
      <State label="Neutral delta"><Stat label="Sessions" value="9,120" delta={0.3} neutral baseline="vs last week" /></State>
      <State label="No data"><Stat label="NPS" value={null} meta="Survey runs on Monday" /></State>
      <State label="Loading"><Stat label="Revenue" value="" loading /></State>
      <State label="Inline"><Stat layout="inline" label="ARPU" value="$65.70" delta={1.8} /></State>
      <State label="With segments"><Stat label="Health" value="72 / 100" chart={<SegmentBar value={72} tone="auto" />} /></State>
    </StateGrid>
  );
}

/* ---------------- Charts ---------------- */
export function LineChartDemo() {
  const [cmp, setCmp] = useState(true);
  return (
    <Card style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><Text weight="semibold">Revenue, last 12 weeks</Text><Switch size="sm" label="Compare" checked={cmp} onCheckedChange={setCmp} /></div>
      <LineChart label="Revenue, last 12 weeks, up 8%" labels={WEEKS} format={(n) => `$${n}k`} legend
        series={[{ name: "This year", values: [62, 64, 63, 66, 70, 69, 73, 75, 74, 78, 81, 84] }, ...(cmp ? [{ name: "Last year", values: [55, 56, 58, 57, 59, 60, 61, 61, 63, 64, 66, 67], color: "muted" as const, dashed: true }] : [])]} />
    </Card>
  );
}
export function AreaChartDemo() {
  return (
    <Card style={{ width: "100%" }}>
      <Text weight="semibold">MRR by plan</Text>
      <AreaChart label="MRR by plan, stacked" labels={MONTHS} format={(n) => `$${n}k`}
        series={[{ name: "Starter", values: [8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14] }, { name: "Pro", values: [20, 22, 23, 25, 27, 28, 30, 31, 33, 35, 37, 39] }, { name: "Enterprise", values: [18, 18, 19, 21, 21, 22, 24, 25, 26, 28, 29, 31] }]} />
    </Card>
  );
}
export function BarChartDemo() {
  const [mode, setMode] = useState("grouped");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><Text weight="semibold">New vs churned</Text><SegmentedControl size="sm" value={mode} onValueChange={setMode} items={[{ value: "grouped", label: "Grouped" }, { value: "stacked", label: "Stacked" }]} /></div>
        <BarChart label="New and churned customers by month" labels={MONTHS.slice(0, 8)} stacked={mode === "stacked"} legend series={[{ name: "New", values: [42, 38, 51, 47, 60, 58, 66, 71] }, { name: "Churned", values: [8, 12, 9, 11, 7, 10, 9, 6], color: 3 }]} />
      </Card>
      <Card>
        <Text weight="semibold">Top plans by revenue</Text>
        <BarChart horizontal label="Revenue by plan" labels={["Enterprise", "Scale", "Pro", "Starter", "Legacy"]} format={(n) => `$${n}k`} highlight={0} series={[{ name: "Revenue", values: [31, 24, 39, 14, 3] }]} />
      </Card>
    </div>
  );
}
export function DonutChartDemo() {
  return (
    <Row gap={40}>
      <DonutChart label="Customers by plan" data={[{ name: "Starter", value: 512 }, { name: "Pro", value: 438 }, { name: "Scale", value: 214 }, { name: "Enterprise", value: 120 }]} centerLabel="Customers" />
      <DonutChart label="Payment methods" size={120} thickness={14} data={[{ name: "Card", value: 82 }, { name: "Bank", value: 14 }, { name: "Other", value: 4 }]} format={(n) => `${n}%`} centerLabel="Share" />
    </Row>
  );
}
export function SparklineDemo() {
  return (
    <StateGrid min={180}>
      <State label="Accent"><Sparkline values={[4, 6, 5, 8, 7, 9, 12]} /></State>
      <State label="Auto (up)"><Sparkline values={[3, 4, 3, 6, 8]} tone="auto" /></State>
      <State label="Auto (down)"><Sparkline values={[9, 8, 8, 6, 4]} tone="auto" /></State>
      <State label="Muted, no area"><Sparkline values={[5, 5, 6, 5, 6, 7]} tone="muted" area={false} /></State>
      <State label="Large"><Sparkline values={[10, 14, 12, 18, 16, 22, 26, 24, 30]} width={220} height={48} /></State>
      <State label="In a button"><Button trailing={<Sparkline values={[2, 3, 5, 4, 6]} width={40} height={16} />}>Revenue</Button></State>
    </StateGrid>
  );
}
