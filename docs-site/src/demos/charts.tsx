import { useState } from "react";
import { BarChart, DonutChart, LineChart, SegmentedControl, Stat } from "@keel/components";
import { customers, fmtMoney, revenue, revenuePrev, revenueWeeks } from "@keel/templates/data";
import type { DocPage } from "../docs/types";

export function LineDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stat label="Weekly revenue" value={fmtMoney(revenue[revenue.length - 1])} delta={6.6} baseline="vs last year" />
      <LineChart
        label="Weekly revenue, last 11 weeks, compared with the same weeks last year"
        labels={revenueWeeks}
        series={[{ name: "This year", values: revenue }, { name: "Last year", values: revenuePrev, tone: "muted", dashed: true }]}
        format={(n) => `$${Math.round(n / 1000)}k`}
      />
    </div>
  );
}

export function BarDemo() {
  const [cmp, setCmp] = useState("on");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Invoices paid per day</span>
        <SegmentedControl size="sm" aria-label="Compare" value={cmp} onValueChange={setCmp} options={[{ value: "on", label: "vs last week" }, { value: "off", label: "Off" }]} />
      </div>
      <BarChart label="Invoices paid per day this week" labels={days} values={[18, 24, 21, 30, 27, 6, 4]} compare={cmp === "on" ? [15, 20, 22, 25, 24, 8, 3] : undefined} format={(n) => String(Math.round(n))} />
    </div>
  );
}

export function BarHighlight() {
  const byRegion = ["Dhaka", "Singapore", "Berlin", "Toronto", "Austin"].map((r) => customers.filter((c) => c.region === r).reduce((s, c) => s + c.mrr, 0));
  return <BarChart label="MRR by region; Austin highlighted" labels={["Dhaka", "Singapore", "Berlin", "Toronto", "Austin"]} values={byRegion} highlight={4} height={140} format={(n) => `$${Math.round(n / 1000)}k`} />;
}

export function DonutDemo() {
  const plans = ["Enterprise", "Scale", "Growth", "Starter"].map((p) => ({ name: p, value: customers.filter((c) => c.plan === p).reduce((s, c) => s + c.mrr, 0) }));
  const total = plans.reduce((s, p) => s + p.value, 0);
  return <DonutChart label="MRR share by plan" data={plans} centerValue={`$${Math.round(total / 1000)}k`} centerLabel="MRR" format={(n) => `$${(n / 1000).toFixed(1)}k`} className="w-full max-w-md" />;
}

export const docs: DocPage[] = [
  {
    slug: "charts", title: "Charts", group: "Charts", section: "Components", source: "charts", keywords: ["line", "bar", "donut", "graph", "visualization"],
    summary: "Line, bar and donut charts drawn from tokens. One data hue for the thing being measured, grey for comparisons, status colors only for status. Use a chart only when it answers the page's question better than a number or a table.",
    whenToUse: ["A trend over time (line), a comparison across a few categories (bar), a share of one whole with ≤5 parts (donut)."],
    whenNot: ["To fill space on a dashboard.", "One number — use Stat.", "Exact values matter more than shape — use a Table."],
    demos: [
      { id: "LineDemo", title: "Line with previous period", description: "Last year is a grey dashed line. Hover for values.", render: LineDemo, full: true },
      { id: "BarDemo", title: "Bar with comparison", render: BarDemo, full: true },
      { id: "BarHighlight", title: "Highlight one bar", description: "Mute the rest to direct attention.", render: BarHighlight, full: true },
      { id: "DonutDemo", title: "Donut", description: "Slices step down in opacity of one hue — they're parts of one thing.", render: DonutDemo, full: true },
    ],
    api: [
      { title: "LineChart", props: [{ name: "labels / series", type: "string[] / { name; values; tone?; dashed? }[]", description: "" }, { name: "label", type: "string", description: "Required accessible summary." }, { name: "format", type: "(n) => string", description: "Axis and tooltip format." }, { name: "area", type: "boolean", default: "true", description: "Flat 7% fill under the first series." }] },
      { title: "BarChart", props: [{ name: "values / compare", type: "number[]", description: "Compare draws a grey bar behind." }, { name: "highlight", type: "number", description: "Index in full color, others muted." }] },
      { title: "DonutChart", props: [{ name: "data", type: "{ name; value }[]", description: "≤ 5 slices." }, { name: "centerValue / centerLabel", type: "string", description: "" }] },
    ],
    a11y: ["Each chart has an accessible name and a visually hidden data table with every value."],
    dos: [{ do: "Give every chart a baseline: previous period, target or normal range.", dont: "Use a rainbow of series colors or a 3D/gradient style." }],
  },
];
