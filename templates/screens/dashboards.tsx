/* Dashboards & analytics — 8 screens. Every chart answers one question; series 1 is blue, the rest grey. */
import { useState, type ReactNode } from "react";
import {
  Avatar, PillBarChart, ValueChart, BarChart, BarList, Bezel, BreakdownBar, BulletChart, Button, Card, CardBody, CardHeader, ComboChart, DateRangeInput, FunnelChart, GaugeChart, Heatmap,
  IconAgent, IconArrowRight, IconCard, IconDollarSign, IconDownload, IconGlobe, IconPlus, IconTarget, IconUsers, IconZap, InsightCard, LineChart, Link, List, ListItem,
  MoreMenu, ProgressBar, RadarChart, ScatterChart, Section, SegmentedControl, Select, Sparkline, Stat, StatGroup, StatusPill, Tag, Text, Timeline, DonutChart, AreaChart,
  RecommendationCard, AvatarGroup, PageHeading, IconCalendar, TaskList, ChartLegend, type DateRange,
} from "@keel/components";
import { Col, Cols, companies, deals, int, money, months, num, people, ScreenShell, series, useGo, weeks } from "./kit";

const card = (title: ReactNode, body: ReactNode, action?: ReactNode, description?: ReactNode) => (
  <Card padding="none"><CardHeader title={title} description={description} action={action ?? <MoreMenu items={[{ label: "Open report" }, { label: "Export CSV" }]} />} /><CardBody>{body}</CardBody></Card>
);
const range = (v: string, set: (v: string) => void) => <SegmentedControl size="sm" value={v} onValueChange={set} items={[{ value: "7d", label: "7d" }, { value: "30d", label: "30d" }, { value: "90d", label: "90d" }, { value: "12m", label: "12m" }]} />;

/* 1 — Home: what needs me today */
function HomeDash() {
  const go = useGo();
  const [r, setR] = useState("30d");
  return (
    <ScreenShell active="dash-home" header={{ title: "Home", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>New</Button> }}>
      <PageHeading title="Good morning, Maya" description="Tuesday, Nov 18 · 3 things need you today" size="sm" actions={range(r, setR)} />
      <StatGroup>
        <Stat label="Revenue" icon={<IconDollarSign />} value="$84,320" delta={6.2} baseline="vs Oct" trend={series(60, 0.03)} trendType="area" />
        <Stat label="New customers" icon={<IconUsers />} value="128" delta={12} deltaUnit="" baseline="this month" trend={series(6, 0.05)} trendType="bars" />
        <Stat label="Pipeline" icon={<IconTarget />} value="$1.2M" delta={-3.1} baseline="vs Oct" trend={[14, 13.6, 13.9, 13.2, 13.4, 12.8, 12.9, 12.4, 12.6, 12.1, 12]} />
        <Stat label="Quota" icon={<IconZap />} value="$412k" progress={{ value: 72, target: 85, label: "72% · target 85% by Dec 31" }} />
      </StatGroup>
      <Cols cols="2:1">
        {card("Revenue", <LineChart height={300} label="Revenue by week" labels={weeks} format={(n) => money(n, true)} legend series={[{ name: "This year", values: series(60000, 0.02) }, { name: "Last year", values: series(52000, 0.015), color: "muted", dashed: true }]} />, undefined, "Weekly, compared with last year")}
        <Col>
          <Bezel label="Today" padded={false} meta={<Link href="#" onClick={(e) => { e.preventDefault(); go("work-tasks"); }}>All tasks</Link>}>
            <TaskList tasks={[{ id: "1", title: "Review Q4 pricing proposal", status: "running", meta: "Due 11:00" }, { id: "2", title: "Approve 3 refunds", status: "queued", meta: "Finance" }, { id: "3", title: "Send board update", status: "done", meta: "Done 08:12" }]} plain />
          </Bezel>
          <InsightCard title="Expansion opportunity" value="$38,400" trend={[2, 3, 3, 5, 6, 8, 9]} explanation="6 Growth accounts are above 90% seat usage — they usually upgrade within 30 days." onAsk={() => go("ai-assistant")} />
        </Col>
      </Cols>
      <Cols cols="1:1:1">
        {card("Top deals", <List>{deals.slice(0, 5).map((d) => <ListItem key={d.id} compact leading={<Avatar name={d.company} size="sm" shape="square" />} title={d.name} description={`${d.stage} · closes ${d.close}`} meta={money(d.value, true)} />)}</List>, <Link href="#" onClick={(e) => { e.preventDefault(); go("list-deals"); }}>View all</Link>)}
        {card("Traffic sources", <BarList items={[{ name: "Google", value: 18420, icon: <IconGlobe /> }, { name: "Direct", value: 9210 }, { name: "LinkedIn", value: 6402 }, { name: "Product Hunt", value: 2190 }, { name: "Newsletter", value: 1820 }]} />)}
        {card("Activity", <Timeline events={[{ id: "1", title: "Lena closed Figma · Expansion", time: "12m", marker: <Avatar name="Lena Novak" size="xs" /> }, { id: "2", title: "Payment failed · Lyft", time: "1h", tone: "danger" }, { id: "3", title: "SSO enabled with Okta", time: "Yesterday", tone: "info" }, { id: "4", title: "42 leads imported", time: "Mon" }]} />)}
      </Cols>
    </ScreenShell>
  );
}

/* 2 — Product analytics */
function Analytics() {
  const [r, setR] = useState("30d");
  const [dr, setDr] = useState<DateRange>({ from: new Date(2026, 9, 19), to: new Date(2026, 10, 18) });
  const hours = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <ScreenShell active="dash-analytics" header={{ title: "Product analytics", actions: <><DateRangeInput size="sm" value={dr} onValueChange={setDr} /><Button size="sm" leading={<IconDownload />}>Export</Button></> }}>
      <PageHeading title="Engagement" description="Who uses the product, how often, and where they drop off." size="sm" actions={range(r, setR)} />
      <StatGroup>
        <Stat label="Weekly actives" value="18,402" delta={4.1} baseline="vs last week" trend={series(14000, 0.02)} trendPosition="side" />
        <Stat label="DAU / MAU" value="41%" delta={1.2} deltaUnit="pt" progress={{ value: 41, style: "ring" }} />
        <Stat label="Avg. session" value="7m 42s" delta={-0.6} deltaStyle="text" baseline="vs last week" />
        <Stat label="Activation" value="63%" progress={{ value: 63, style: "segments" }} />
      </StatGroup>
      <Cols cols="2:1">
        {card("Activation funnel", <FunnelChart label="Signup to paid funnel" steps={[{ name: "Signed up", value: 12400 }, { name: "Created project", value: 8120 }, { name: "Invited team", value: 4310 }, { name: "Connected data", value: 2980 }, { name: "Paid", value: 1104 }]} />, undefined, "Last 30 days")}
        {card("Health score", <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}><GaugeChart label="Product health" value={72} caption="out of 100" thresholds={[40, 70]} /></div>)}
      </Cols>
      {card("When people use Northwind", <Heatmap label="Sessions by day and hour" rows={hours} columns={Array.from({ length: 24 }, (_, i) => `${i}`)} values={hours.map((_, d) => Array.from({ length: 24 }, (_, h) => (d > 4 ? 0.3 : 1) * Math.max(0, Math.round(40 * Math.sin(((h - 6) / 14) * Math.PI) + int(-6, 6)))))} format={(n) => `${n} sessions`} />, undefined, "Sessions per hour, local time")}
      <Cols cols="1:1">
        {card("Feature adoption", <BarChart label="Feature adoption" horizontal labels={["Reports", "Workflows", "Assistant", "Sequences", "API", "Mobile app"]} series={[{ name: "Accounts", values: [82, 64, 51, 38, 22, 17] }]} highlight={2} format={(n) => `${n}%`} />)}
        {card("Retention by cohort", <LineChart label="Retention curves" labels={["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"]} zero format={(n) => `${n}%`} legend area={false}
          series={[{ name: "Oct cohort", values: [100, 72, 61, 55, 52, 50, 49, 48] }, { name: "Sep", values: [100, 66, 55, 49, 45, 43, 41, 40] }, { name: "Aug", values: [100, 61, 50, 44, 40, 38, 37, 36] }]} />)}
      </Cols>
    </ScreenShell>
  );
}

/* 3 — Sales */
function Sales() {
  const byStage = ["Discovery", "Proposal", "Negotiation", "Won"].map((s) => deals.filter((d) => d.stage === s).reduce((a, d) => a + d.value, 0));
  return (
    <ScreenShell active="list-deals" header={{ title: "Sales", actions: <Select size="sm" variant="button" defaultValue="q4" options={[{ value: "q4", label: "Q4 2026" }, { value: "q3", label: "Q3 2026" }]} aria-label="Quarter" /> }}>
      <StatGroup>
        <Stat label="Closed won" value={money(byStage[3], true)} delta={18} baseline="vs Q3" variant="plain" compare={{ label: "Q3", value: "$460K" }} />
        <Stat label="Quota attainment" value="68%" progress={{ value: 68, target: 75, label: "Target 75% by today" }} />
        <Stat label="Open pipeline" value={money(byStage[0] + byStage[1] + byStage[2], true)} breakdown={[{ name: "Discovery", value: byStage[0] }, { name: "Proposal", value: byStage[1] }, { name: "Negotiation", value: byStage[2] }]} />
        <Stat label="Avg. deal" value="$42k" delta={5.4} compare={{ label: "Last quarter", value: "$39.8k" }} />
      </StatGroup>
      <Cols cols="2:1">
        {card("Bookings vs. win rate", <ComboChart label="Monthly bookings and win rate" labels={months} bars={{ name: "Bookings", values: series(120000, 0.04) }} line={{ name: "Win rate", values: series(24, 0.01, 12, 0.2) }} format={(n) => money(n, true)} />)}
        {card("Rep leaderboard", <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{["Lena Novak", "Rafi Ahmed", "Maya Okafor", "Kenji Sato"].map((n, i) => <div key={n} style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={n} size="xs" /><Text weight="medium">{n}</Text><Text variant="caption" style={{ marginLeft: "auto" }}>{money([182000, 151000, 128000, 96000][i], true)}</Text></span><BulletChart label="of quota" value={[91, 76, 64, 48][i]} target={75} ranges={[50, 75]} max={110} showValues={false} height={10} /></div>)}</div>)}
      </Cols>
      {card("Deal size vs. cycle length", <ScatterChart label="Deals by value and days open" xLabel="Days open" yLabel="Value" points={deals.map((d) => ({ name: d.name, x: int(6, 120), y: d.value }))} highlight={deals.filter((d) => d.stage === "Won").map((d) => d.name)} />, undefined, "Blue = won")}
    </ScreenShell>
  );
}

/* 4 — Marketing */
function Marketing() {
  return (
    <ScreenShell active="dash-analytics" header={{ title: "Marketing", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>New campaign</Button> }}>
      <StatGroup>
        <Stat label="Visitors" value="142k" delta={9.3} trend={series(100, 0.03)} trendType="bars" variant="plain" />
        <Stat label="Signups" value="4,812" delta={3.8} trend={series(300, 0.02)} />
        <Stat label="CAC" value="$184" delta={-6.2} lowerIsBetter deltaStyle="arrow" baseline="vs Oct" />
        <Stat label="Payback" value="7.4 mo" compare={{ label: "Benchmark", value: "12 mo" }} />
      </StatGroup>
      <Cols cols="1:2">
        <Card><PillBarChart label="Visits by source, last 20 days" title="Traffic" description="Last 20 days" unit="visits" height={170} labels={Array.from({ length: 20 }, (_, k) => `Oct ${k + 1}`)}
          series={[{ name: "Organic", values: series(520, 0.012).concat(series(560, 0.01)).slice(0, 20) }, { name: "Paid", values: series(300, 0.02).concat(series(340, 0.01)).slice(0, 20) }, { name: "Social", values: series(160, 0.03).concat(series(190, 0.02)).slice(0, 20) }]}
          negative={{ name: "Bounced", values: series(140, 0.02).concat(series(150, 0.01)).slice(0, 20) }} /></Card>
        {card("Signups by channel", <AreaChart label="Signups by channel" labels={weeks} series={[{ name: "Organic", values: series(180, 0.02) }, { name: "Paid", values: series(90, 0.01) }, { name: "Social", values: series(60, 0.03) }]} />)}
      </Cols>
      <Cols cols="1:1:1">
        {card("Top landing pages", <BarList items={[{ name: "/pricing", value: 21400 }, { name: "/", value: 18800 }, { name: "/blog/ai-crm", value: 9200 }, { name: "/integrations", value: 6100 }, { name: "/compare/hubspot", value: 4300 }]} />)}
        {card("Countries", <BarList highlight={-1} items={[{ name: "United States", value: 48 }, { name: "Germany", value: 14 }, { name: "United Kingdom", value: 11 }, { name: "Bangladesh", value: 7 }, { name: "Brazil", value: 5 }]} format={(n) => `${n}%`} />)}
        {card("Campaigns", <List>{["Black Friday", "Q4 webinar", "Re-engage trials"].map((c, i) => <ListItem key={c} compact title={c} description={["Email · 42k sent", "LinkedIn · 18k reached", "In-app · 3.2k shown"][i]} trailing={<StatusPill status={i ? "neutral" : "active"} pulse={!i}>{i ? "Scheduled" : "Live"}</StatusPill>} />)}</List>)}
      </Cols>
    </ScreenShell>
  );
}

/* 5 — Finance */
function Finance() {
  return (
    <ScreenShell active="list-invoices" header={{ title: "Finance", actions: <><Button size="sm" leading={<IconDownload />}>Export</Button><Button size="sm" variant="primary">Close the month</Button></> }}>
      <Cols cols="1:1:1:1">
        <Stat variant="ink" label="Cash" icon={<IconDollarSign />} value="$2.41M" delta={3.2} baseline="vs Oct" trend={series(2100, 0.01)} />
        <Stat variant="card" label="Burn" value="$182k" delta={-4.8} lowerIsBetter baseline="/ month" />
        <Stat variant="card" label="Runway" value="22 mo" progress={{ value: 22, max: 36, label: "Target 24 months" }} />
        <Stat variant="card" label="ARR" value="$4.8M" delta={11} compare={{ label: "Plan", value: "$4.6M" }} />
      </Cols>
      <Cols cols="1:2">
        <Card><ValueChart label="Cash balance" title="Cash balance" format={(n) => `$${Math.round(n).toLocaleString()}`}
          ranges={[{ label: "1M", values: series(2330000, 0.002, 30, 0.012), caption: "this month" }, { label: "3M", values: series(2180000, 0.004, 36, 0.02), caption: "this quarter" }, { label: "1Y", values: series(1700000, 0.007, 52, 0.03), caption: "this year" }]} defaultRange="3M" /></Card>
        {card("Revenue vs. expenses", <BarChart label="Monthly revenue and expenses" labels={months} legend format={(n) => money(n, true)} series={[{ name: "Revenue", values: series(320000, 0.02) }, { name: "Expenses", values: series(280000, 0.005) }]} />)}
      </Cols>
      <Cols cols="1:1:1">
        {card("Accounts receivable aging", <BreakdownBar items={[{ name: "Current", value: 182000 }, { name: "1–30 days", value: 64000 }, { name: "31–60 days", value: 21000 }, { name: "60+ days", value: 9000 }]} format={(n) => money(n, true)} />)}
        {card("Budget vs. actual", <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{[["Engineering", 92], ["Sales", 104], ["Marketing", 71], ["G&A", 58]].map(([n, v]) => <BulletChart key={n as string} label={`${n} · % of budget`} value={v as number} target={100} ranges={[80, 100]} max={120} format={(x) => `${x}%`} />)}</div>)}
        {card("Spend by category", <DonutChart label="Spend by category" data={[{ name: "People", value: 61 }, { name: "Software", value: 14 }, { name: "Marketing", value: 12 }, { name: "Facilities", value: 8 }, { name: "Other", value: 5 }]} centerLabel="% of spend" format={(n) => `${n}%`} />)}
      </Cols>
    </ScreenShell>
  );
}

/* 6 — Support */
function Support() {
  return (
    <ScreenShell active="inbox" header={{ title: "Support overview", actions: <Button size="sm" variant="primary" trailing={<IconArrowRight />}>Open queue</Button> }}>
      <StatGroup>
        <Stat label="Open tickets" value="142" delta={-8} deltaUnit="" lowerIsBetter baseline="since yesterday" />
        <Stat label="First reply" value="38m" delta={-12} deltaUnit="%" lowerIsBetter compare={{ label: "SLA", value: "1h" }} />
        <Stat label="CSAT" value="94%" progress={{ value: 94, style: "ring" }} />
        <Stat label="Backlog > 24h" value="9" badge={<StatusPill status="danger">Breaching</StatusPill>} />
      </StatGroup>
      <Cols cols="2:1">
        {card("Tickets vs. CSAT", <ComboChart label="Daily tickets and CSAT" labels={weeks} bars={{ name: "Tickets", values: series(400, 0.0) }} line={{ name: "CSAT", values: series(90, 0.002, 12, 0.03) }} />)}
        {card("Tickets by topic", <BarList items={[{ name: "Billing", value: 412 }, { name: "Login & SSO", value: 288 }, { name: "Integrations", value: 201 }, { name: "Exports", value: 133 }, { name: "Bugs", value: 96 }]} />)}
      </Cols>
      <Cols cols="1:1">
        {card("Agent load", <List>{["Maya Okafor", "Rafi Ahmed", "Lena Novak", "Kenji Sato"].map((n, i) => <ListItem key={n} compact leading={<Avatar name={n} size="sm" status={i === 3 ? "away" : "online"} />} title={n} description={`${[18, 14, 11, 4][i]} open · ${[22, 31, 40, 55][i]}m avg reply`} trailing={<div style={{ width: 90 }}><ProgressBar value={[90, 70, 55, 20][i]} /></div>} />)}</List>)}
        <RecommendationCard title="Add a macro for “Change billing email”" rationale="It's the 3rd most common billing ticket and every reply is the same 4 steps." confidence={0.86} actions={<><Button size="sm" variant="ghost">Dismiss</Button><Button size="sm" variant="primary">Create macro</Button></>} meta="Saves ~6h / week" />
      </Cols>
    </ScreenShell>
  );
}

/* 7 — E-commerce */
function Ecommerce() {
  return (
    <ScreenShell active="dash-analytics" header={{ title: "Store", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>Add product</Button> }}>
      <Cols cols="1:1:1:1">
        <Stat variant="bezel" label="Sales" value="$212,480" delta={14.2} baseline="vs last month" trend={series(150, 0.03)} trendType="area" footer={<><span>Updated 2 min ago</span><Link href="#">Details</Link></>} />
        <Stat variant="bezel" label="Orders" value="3,914" delta={6.1} trend={series(250, 0.02)} trendType="bars" footer={<><span>Avg. $54.30</span><Link href="#">Orders</Link></>} />
        <Stat variant="bezel" label="Conversion" value="3.2%" delta={-0.3} deltaUnit="pt" progress={{ value: 3.2, max: 5, label: "Goal 4%" , target: 4 }} footer={<span>Sessions 122k</span>} />
        <Stat variant="bezel" label="Returns" value="4.1%" delta={-0.8} deltaUnit="pt" lowerIsBetter compare={{ label: "Industry", value: "8.9%" }} footer={<span>162 this month</span>} />
      </Cols>
      <Cols cols="2:1">
        {card("Sales by channel", <LineChart label="Sales by channel" labels={weeks} format={(n) => money(n, true)} legend series={[{ name: "Web", values: series(32000, 0.02) }, { name: "iOS", values: series(14000, 0.03) }, { name: "POS", values: series(9000, 0.0) }]} />)}
        {card("Best sellers", <BarList items={[{ name: "Field jacket", value: 1204 }, { name: "Merino tee", value: 980 }, { name: "Trail runner", value: 744 }, { name: "Canvas tote", value: 521 }, { name: "Wool beanie", value: 310 }]} format={(n) => `${n} sold`} />)}
      </Cols>
    </ScreenShell>
  );
}

/* 8 — Customer health */
function Health() {
  const go = useGo();
  const risky = companies.filter((c) => c.health < 45).slice(0, 5);
  return (
    <ScreenShell active="list-companies" header={{ title: "Customer health", actions: <Button size="sm" leading={<IconCalendar />}>Schedule QBRs</Button> }}>
      <Cols cols="1:2">
        <Col>
          <Card><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><GaugeChart label="Portfolio health" value={68} caption="Portfolio score" thresholds={[45, 70]} /><Text variant="caption">Up 4 points since September</Text></div></Card>
          {card("Health dimensions", <div style={{ display: "flex", justifyContent: "center" }}><RadarChart label="Health dimensions vs last quarter" axes={["Usage", "Adoption", "Support", "Billing", "Sentiment", "Growth"]} series={[{ name: "Now", values: [78, 64, 82, 90, 70, 58] }, { name: "Last quarter", values: [70, 60, 74, 88, 72, 49], color: "muted" }]} size={260} /></div>)}
        </Col>
        <Col>
          <Bezel label="At risk" meta={`${risky.length} accounts · ${money(risky.reduce((a, c) => a + c.arr, 0), true)} ARR`} padded={false}>
            <List>{risky.map((c) => <ListItem key={c.id} leading={<Avatar name={c.name} size="sm" shape="square" />} title={c.name} description={`${c.plan} · owner ${c.owner}`} meta={money(c.arr, true)} trailing={<Tag size="sm" tone="red">{c.health}</Tag>} onClick={() => go("detail-company")} />)}</List>
          </Bezel>
          {card("Usage vs. revenue", <ScatterChart label="Accounts by usage and ARR" xLabel="Weekly actives" yLabel="ARR" points={companies.map((c) => ({ name: c.name, x: int(5, 400), y: c.arr, size: c.employees }))} highlight={risky.map((c) => c.name)} />, undefined, "Bubble size = employees · blue = at risk")}
        </Col>
      </Cols>
    </ScreenShell>
  );
}

export const dashboardScreens = [
  { id: "dash-home", title: "Home", category: "Dashboards", render: () => <HomeDash /> },
  { id: "dash-analytics", title: "Product analytics", category: "Dashboards", render: () => <Analytics /> },
  { id: "dash-sales", title: "Sales dashboard", category: "Dashboards", render: () => <Sales /> },
  { id: "dash-marketing", title: "Marketing dashboard", category: "Dashboards", render: () => <Marketing /> },
  { id: "dash-finance", title: "Finance dashboard", category: "Dashboards", render: () => <Finance /> },
  { id: "dash-support", title: "Support overview", category: "Dashboards", render: () => <Support /> },
  { id: "dash-store", title: "Store dashboard", category: "Dashboards", render: () => <Ecommerce /> },
  { id: "dash-health", title: "Customer health", category: "Dashboards", render: () => <Health /> },
];
void [Section, Sparkline, IconAgent, IconCard, AvatarGroup, ChartLegend, num, people];
