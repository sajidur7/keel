import { useState } from "react";
import {
  AvatarGroupOverflow, AvatarStatusDot, Avatar, BarList, Bezel, BreadcrumbItem, BreakdownBar, BulletChart, Button, Card, ChatComposerDrawer, ChatComposerInput,
  ChatLayoutScrollButton, ChatMessageBubble, ChatMessageList, ChatSendButton, ChatTokenizedText, CheckboxIndicator, CheckboxListItem, CheckIndicator, ComboChart,
  CommandMenu, CommandPaletteEmpty, CommandPaletteFooter, CommandPaletteGroup, CommandPaletteInput, CommandPaletteItem, CommandPaletteList, DialogHeader, FunnelChart,
  GaugeChart, GridSpan, Heatmap, IconAgent, IconArrowRight, IconBell, IconCalendar, IconCard, IconDollarSign, IconFile, IconHome, IconInbox, IconSettings, IconUsers,
  IconZap, Item, Kbd, KbdGroup, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel, Link, MegaMenuItem, MetadataListItem, MoreMenu, NavHeadingMenu, NavIcon,
  RadarChart, RadioGroup, RadioIndicator, RadioListItem, Resizable, ScatterChart, SegmentedControl, SegmentedControlItem, Select, SelectorOption, Sparkline, Stack, StackItem,
  Stat, StatusPill, Tab, TabList, TabMenu, Tag, Text, Toast, TopNavHeading, useClipboard, useDisclosure, useHotkeys, useImperativeDialog, useMediaQuery, useStreamingText,
  useTablePagination, useTableSelection, useTableSort, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Pagination, Checkbox, Token, Grid, useToast,
  useCalendarDays, IconCopy, IconCheck,
  PillBarChart, ValueChart, UsageMeter, ChatComposer as Composer2, TaskList as TaskList2, IconPaperclip as IcClip, IconGlobe as IcGlobe, IconDatabase as IcData,
} from "@keel/components";
import { Row, State, StateGrid } from "../docs/kit";

const W = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
const trend = [60, 62, 61, 66, 70, 69, 74, 78, 77, 81, 84, 88];

/* ---------------- Stat variants ---------------- */
export function StatVariants() {
  return (
    <StateGrid min={240}>
      <State label="card"><Stat variant="card" label="Revenue" icon={<IconDollarSign />} value="$84,320" delta={6.2} baseline="vs Oct" /></State>
      <State label="outline"><Stat variant="outline" label="Customers" value="1,284" delta={2.1} meta="12 new" /></State>
      <State label="sunken"><Stat variant="sunken" label="Storage" value="12.4 GB" progress={{ value: 25, label: "of 50 GB" }} /></State>
      <State label="bezel + footer"><Stat variant="bezel" label="Sales" value="$212,480" delta={14.2} trend={trend} trendType="area" footer={<><span>Updated 2 min ago</span><Link href="#">Details</Link></>} /></State>
      <State label="ink (hero)"><Stat variant="ink" label="Cash" icon={<IconDollarSign />} value="$2.41M" delta={3.2} baseline="vs Oct" trend={trend} /></State>
      <State label="clickable"><Stat variant="card" label="Open tickets" value="142" delta={-8} deltaUnit="" lowerIsBetter onClick={() => {}} action={<IconArrowRight size={14} />} /></State>
    </StateGrid>
  );
}
export function StatOptions() {
  return (
    <StateGrid min={240}>
      <State label="Icon tile + badge"><Stat variant="card" iconTile icon={<IconUsers />} label="Active users" badge={<StatusPill status="active" pulse>Live</StatusPill>} value="1,920" /></State>
      <State label="Trend beside (default)"><Stat variant="card" label="Weekly actives" value="18,402" delta={4.1} trend={trend} /></State>
      <State label="Trend below"><Stat variant="card" label="Weekly actives" value="18,402" delta={4.1} trend={trend} trendPosition="below" /></State>
      <State label="Mini bars"><Stat variant="card" label="Orders" value="3,914" delta={6.1} trend={[4, 6, 5, 7, 8, 6, 9, 11, 10, 12]} trendType="bars" /></State>
      <State label="Ring"><Stat variant="card" label="CSAT" value="94%" progress={{ value: 94, style: "ring" }} /></State>
      <State label="Segments"><Stat variant="card" label="Activation" value="63%" progress={{ value: 63, style: "segments" }} /></State>
      <State label="Target marker"><Stat variant="card" label="Quota" value="$412k" progress={{ value: 72, target: 85, label: "72% · target 85%" }} /></State>
      <State label="Compare row"><Stat variant="card" label="Avg. deal" value="$42k" delta={5.4} compare={{ label: "Last quarter", value: "$39.8k" }} /></State>
      <State label="Breakdown"><Stat variant="card" label="Pipeline" value="$1.9M" breakdown={[{ name: "Discovery", value: 820 }, { name: "Proposal", value: 640 }, { name: "Negotiation", value: 440 }]} /></State>
      <State label="Delta styles"><Stack gap={10}><Stat label="pill" value="$84k" delta={6.2} /><Stat label="text" value="$84k" delta={-1.2} deltaStyle="text" /><Stat label="arrow" value="$84k" delta={6.2} deltaStyle="arrow" /></Stack></State>
    </StateGrid>
  );
}

/* ---------------- Charts ---------------- */
export function SparklineTypes() {
  return <Row gap={28}><State label="line"><Sparkline values={trend} /></State><State label="area (dots)"><Sparkline values={trend} type="area" /></State><State label="bars"><Sparkline values={trend} type="bars" /></State><State label="ink"><Sparkline values={trend} tone="ink" /></State><State label="auto (down)"><Sparkline values={[9, 8, 8, 6, 4]} tone="auto" /></State></Row>;
}
export function BarListDemo() {
  return <Card style={{ width: "100%", maxWidth: 480 }}><BarList items={[{ name: "/pricing", value: 21400 }, { name: "/", value: 18800 }, { name: "/blog/ai-crm", value: 9200 }, { name: "/integrations", value: 6100 }, { name: "/compare", value: 4300 }]} onSelect={() => {}} /></Card>;
}
export function BreakdownBarDemo() {
  return <StateGrid min={280}><State label="Full legend"><BreakdownBar items={[{ name: "Organic", value: 52 }, { name: "Paid", value: 21 }, { name: "Social", value: 14 }, { name: "Referral", value: 9 }]} format={(n) => `${n}k`} /></State><State label="Compact"><BreakdownBar legend="compact" height={6} items={[{ name: "Starter", value: 3 }, { name: "Growth", value: 5 }, { name: "Scale", value: 3 }, { name: "Enterprise", value: 1 }]} /></State></StateGrid>;
}
export function GaugeDemo() {
  return <Row gap={32}><GaugeChart label="Health" value={72} caption="out of 100" thresholds={[40, 70]} /><GaugeChart label="Utilization" value={38} size={140} thickness={10} tone="ink" valueLabel="38%" caption="CPU" /></Row>;
}
export function HeatmapDemo() {
  const d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return <Card style={{ width: "100%" }}><Heatmap label="Sessions by day and hour" rows={d} columns={Array.from({ length: 24 }, (_, i) => `${i}`)} values={d.map((_, r) => Array.from({ length: 24 }, (_, h) => Math.max(0, Math.round((r > 4 ? 12 : 36) * Math.sin(((h - 6) / 14) * Math.PI)))))} format={(n) => `${n} sessions`} /></Card>;
}
export function FunnelDemo() {
  return <Card style={{ width: "100%" }}><FunnelChart label="Signup funnel" steps={[{ name: "Signed up", value: 12400 }, { name: "Created project", value: 8120 }, { name: "Invited team", value: 4310 }, { name: "Paid", value: 1104 }]} /></Card>;
}
export function ScatterDemo() {
  const pts = Array.from({ length: 24 }, (_, i) => ({ name: `Account ${i + 1}`, x: 10 + ((i * 37) % 90), y: 20 + ((i * 53) % 180), size: 5 + ((i * 7) % 40) }));
  return <Card style={{ width: "100%" }}><ScatterChart label="Usage vs ARR" xLabel="Weekly actives" yLabel="ARR ($k)" points={pts} highlight={["Account 3", "Account 9", "Account 14"]} /></Card>;
}
export function BulletDemo() {
  return <Stack gap={18} style={{ width: "100%", maxWidth: 520 }}>{[["Engineering", 92], ["Sales", 104], ["Marketing", 71]].map(([n, v]) => <BulletChart key={n as string} label={`${n} · % of budget`} value={v as number} target={100} ranges={[80, 100]} max={120} format={(x) => `${x}%`} />)}</Stack>;
}
export function ComboDemo() {
  return <Card style={{ width: "100%" }}><ComboChart label="Orders and conversion" labels={W} bars={{ name: "Orders", values: [320, 340, 310, 380, 420, 410, 450, 470, 460, 500, 520, 560] }} line={{ name: "Conversion", values: [2.8, 2.9, 2.7, 3.0, 3.2, 3.1, 3.3, 3.4, 3.2, 3.5, 3.6, 3.8] }} /></Card>;
}
export function RadarDemo() {
  return <RadarChart label="Health dimensions" axes={["Usage", "Adoption", "Support", "Billing", "Sentiment", "Growth"]} series={[{ name: "Now", values: [78, 64, 82, 90, 70, 58] }, { name: "Last quarter", values: [70, 60, 74, 88, 72, 49], color: "muted" }]} size={280} />;
}

/* ---------------- Bezel ---------------- */
export function BezelDemo() {
  return (
    <StateGrid min={280}>
      <State label="Label + footer"><Bezel label="Insight" icon={<IconAgent size={12} />} footer={<><Text variant="caption">Updated 4m ago</Text><span style={{ marginLeft: "auto" }}><Button size="sm">Open</Button></span></>}><Text weight="semibold">Expansion opportunity</Text><Text tone="muted">6 Growth accounts are above 90% seat usage.</Text></Bezel></State>
      <State label="Meta on the right"><Bezel label="At risk" meta="5 accounts"><Text>Airbnb · Medium · Zoom · Apple · Shopify</Text></Bezel></State>
      <State label="Unpadded (lists, tables)"><Bezel label="Today" padded={false}><Item title="Review pricing proposal" description="Deals · 11:00" trailing={<Kbd>R</Kbd>} /><Item title="Approve 3 refunds" description="Finance · 14:00" /></Bezel></State>
    </StateGrid>
  );
}

/* ---------------- Composable command menu ---------------- */
export function CommandMenuDemo() {
  const [last, setLast] = useState("—");
  return (
    <Stack gap={10} style={{ width: "100%", maxWidth: 520 }}>
      <CommandMenu>
        <CommandPaletteInput />
        <CommandPaletteList>
          <CommandPaletteGroup heading="Go to"><CommandPaletteItem icon={<IconHome />} shortcut="g h" onSelect={() => setLast("Home")}>Home</CommandPaletteItem><CommandPaletteItem icon={<IconInbox />} end={<Tag size="sm">12</Tag>} onSelect={() => setLast("Inbox")}>Inbox</CommandPaletteItem><CommandPaletteItem icon={<IconUsers />} onSelect={() => setLast("People")}>People</CommandPaletteItem></CommandPaletteGroup>
          <CommandPaletteGroup heading="Actions"><CommandPaletteItem icon={<IconZap />} shortcut="⌘N" onSelect={() => setLast("New deal")}>New deal</CommandPaletteItem><CommandPaletteItem icon={<IconSettings />} shortcut="⌘," onSelect={() => setLast("Settings")}>Open settings</CommandPaletteItem></CommandPaletteGroup>
          <CommandPaletteEmpty>Nothing matches — try “inbox”.</CommandPaletteEmpty>
        </CommandPaletteList>
        <CommandPaletteFooter />
      </CommandMenu>
      <Text variant="caption">Last run: {last}</Text>
    </Stack>
  );
}

/* ---------------- Indicators & list items ---------------- */
export function IndicatorDemo() {
  return <Row gap={24}>{([false, true, "indeterminate"] as const).map((c) => <State key={String(c)} label={`checkbox · ${c}`}><CheckboxIndicator checked={c} /></State>)}<State label="radio on"><RadioIndicator checked /></State><State label="radio off"><RadioIndicator checked={false} /></State><State label="check"><CheckIndicator checked /></State></Row>;
}
export function ListItemPartsDemo() {
  return (
    <StateGrid min={280}>
      <State label="CheckboxListItem"><div><CheckboxListItem label="Weekly summary" description="Every Monday at 8:00" defaultChecked /><CheckboxListItem label="Mentions" description="When someone @mentions you" /></div></State>
      <State label="RadioListItem"><RadioGroup defaultValue="a"><RadioListItem value="a" label="Monthly" description="Billed every month" /><RadioListItem value="b" label="Yearly" description="Two months free" /></RadioGroup></State>
      <State label="MetadataListItem"><dl style={{ margin: 0 }}><MetadataListItem label="Owner">Maya Okafor</MetadataListItem><MetadataListItem label="Plan">Growth</MetadataListItem></dl></State>
      <State label="BreadcrumbItem"><Row gap={6}><BreadcrumbItem href="#" icon={<IconHome />}>Home</BreadcrumbItem><Text tone="muted">/</Text><BreadcrumbItem href="#">People</BreadcrumbItem><Text tone="muted">/</Text><BreadcrumbItem current>Ethan Moreau</BreadcrumbItem></Row></State>
    </StateGrid>
  );
}
export function ItemDemo() {
  return (
    <Card padding="sm" style={{ width: "100%", maxWidth: 480 }}>
      <Item leading={<Avatar name="Maya Okafor" size="md" />} title="Maya Okafor" description="maya@northwind.io · Owner" trailing={<MoreMenu items={[{ label: "Edit" }]} />} />
      <Item leading={<IconFile />} title="Board deck Q3.pdf" description="2.4 MB · Lena" href="#" trailing="Mon" />
      <Item leading={<IconCard />} title="Visa ending 4242" description="Expires 08/28" onClick={() => {}} trailing={<Button size="xs">Update</Button>} />
    </Card>
  );
}

/* ---------------- Layout parts ---------------- */
export function LayoutPartsDemo() {
  return (
    <div style={{ width: "100%", height: 300, display: "flex", flexDirection: "column", borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
      <LayoutHeader><Text weight="semibold">Inbox</Text><span style={{ marginLeft: "auto" }}><Button size="sm">Compose</Button></span></LayoutHeader>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <LayoutPanel width={200}><div style={{ padding: 12 }}><Text variant="caption">LayoutPanel side="start"</Text></div></LayoutPanel>
        <LayoutContent><Grid columns={3} gap={10}><GridSpan span={2}><Card padding="sm">GridSpan span=2</Card></GridSpan><Card padding="sm">1</Card><GridSpan span="full"><Card padding="sm">GridSpan span="full"</Card></GridSpan></Grid></LayoutContent>
      </div>
      <LayoutFooter><Stack direction="row" gap={8} style={{ width: "100%" }}><StackItem grow><Text variant="caption">StackItem grow</Text></StackItem><Button size="sm" variant="primary">Save</Button></Stack></LayoutFooter>
    </div>
  );
}
export function ResizableDemo() {
  return <div style={{ width: "100%", height: 220, borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}><Resizable defaultSize={35} start={<div style={{ padding: 16 }}><Text weight="medium">List</Text><Text variant="caption">Drag the divider, or focus it and use ← →. Double-click resets.</Text></div>} end={<div style={{ padding: 16 }}><Text weight="medium">Detail</Text></div>} /></div>;
}

/* ---------------- Navigation parts ---------------- */
export function NavPartsDemo() {
  return (
    <StateGrid min={260}>
      <State label="NavHeadingMenu"><div style={{ width: 240 }}><NavHeadingMenu name="Northwind" meta="Revenue workspace" items={[{ id: "a", name: "Northwind" }, { id: "b", name: "Acme Labs" }]} onSelect={() => {}} /></div></State>
      <State label="NavIcon"><Row gap={20}><NavIcon icon={<IconBell size={18} />} dot /><NavIcon icon={<IconInbox size={18} />} count={12} /><NavIcon icon={<IconCalendar size={18} />} /></Row></State>
      <State label="TopNavHeading"><TopNavHeading name="Northwind" /></State>
      <State label="MegaMenuItem"><MegaMenuItem href="#" icon={<IconZap />} title="Workflows" description="Route leads and follow up automatically." /></State>
    </StateGrid>
  );
}
export function TabMenuDemo() {
  const [v, setV] = useState("all");
  return <div style={{ width: "100%", maxWidth: 520, resize: "horizontal", overflow: "hidden", padding: 4 }}><TabMenu value={v} onValueChange={setV} items={[{ value: "all", label: "All", count: 48 }, { value: "new", label: "Net new", count: 8 }, { value: "saved", label: "Saved", count: 18 }, { value: "won", label: "Won" }, { value: "lost", label: "Lost" }, { value: "archived", label: "Archived" }]} /><Text variant="caption">Drag the corner to make it narrower — tabs that don't fit move into “More”.</Text></div>;
}

/* ---------------- Overlay parts ---------------- */
export function DialogPartsDemo() {
  const [el, confirm] = useImperativeDialog();
  const [res, setRes] = useState("—");
  return (
    <Stack gap={16} style={{ width: "100%", maxWidth: 520 }}>
      <Card><DialogHeader icon={<IconUsers />} title="Invite teammates" description="They'll get an email with a link." actions={<Button size="sm" variant="ghost">Copy link</Button>} /><Text tone="muted">DialogHeader / DrawerHeader — for custom dialog bodies.</Text></Card>
      <Row><Button variant="primary" onClick={async () => setRes((await confirm({ title: "Publish workflow?", description: "It starts running for new leads right away.", confirmLabel: "Publish" })) ? "Published" : "Cancelled")}>await confirm()</Button><Text tone="muted">Result: {res}</Text></Row>
      {el}
    </Stack>
  );
}
export function ToastStaticDemo() {
  return <Stack gap={10}><Toast title="Invoice sent" description="INV-2063 to Tidewater Energy" icon={<IconCheck />} action={<Button size="xs" variant="ghost">Undo</Button>} onClose={() => {}} /><Toast tone="danger" title="Payment failed" description="Card declined — we'll retry Thursday" icon={<IconBell />} /></Stack>;
}

/* ---------------- Chat parts ---------------- */
export function ChatPartsDemo() {
  const [v, setV] = useState("Draft a reply to @Ines about /sso");
  return (
    <Stack gap={14} style={{ width: "100%", maxWidth: 560 }}>
      <ChatMessageList>
        <ChatMessageBubble role="user">Can you check why SSO is failing for Snapchat?</ChatMessageBubble>
        <ChatMessageBubble>Their IdP clock is 4 minutes ahead — SAML assertions arrive “from the future”.</ChatMessageBubble>
      </ChatMessageList>
      <ChatLayoutScrollButton onClick={() => {}} />
      <div>
        <ChatComposerDrawer><Token label="snapchat.com" size="sm" onRemove={() => {}} /><Token label="T-8812" size="sm" onRemove={() => {}} /></ChatComposerDrawer>
        <Card padding="sm"><Row align="flex-end" wrap={false}><div style={{ flex: 1 }}><ChatComposerInput value={v} onValueChange={setV} onSubmit={() => setV("")} /></div><ChatSendButton onClick={() => setV("")} disabled={!v.trim()} /></Row></Card>
      </div>
      <Text><ChatTokenizedText text="Ping @Lena in #revenue, then run /forecast" /></Text>
    </Stack>
  );
}
export function AvatarPartsDemo() {
  return <Row gap={20}>{(["online", "away", "busy", "offline"] as const).map((s) => <State key={s} label={s}><AvatarStatusDot status={s} /></State>)}<State label="AvatarGroupOverflow"><Row gap={0}><Avatar name="Ana Lima" /><Avatar name="Bo Chen" /><AvatarGroupOverflow count={7} size={32} onClick={() => {}} /></Row></State></Row>;
}
export function DeclarativeDemo() {
  return (
    <StateGrid min={240}>
      <State label="SegmentedControlItem"><SegmentedControl defaultValue="week"><SegmentedControlItem value="day" label="Day" /><SegmentedControlItem value="week" label="Week" /><SegmentedControlItem value="month" label="Month" /></SegmentedControl></State>
      <State label="SelectorOption"><Select defaultValue="eur" aria-label="Currency"><SelectorOption value="usd" label="USD" /><SelectorOption value="eur" label="EUR" /><SelectorOption value="bdt" label="BDT" /></Select></State>
      <State label="Tab" wide><TabList><Tab value="a" label="Overview">Overview panel</Tab><Tab value="b" label="Activity" count={14}>Activity panel</Tab><Tab value="c" label="Files">Files panel</Tab></TabList></State>
    </StateGrid>
  );
}

/* ---------------- Hooks ---------------- */
const ROWS = Array.from({ length: 23 }, (_, i) => ({ id: `r${i}`, name: ["Figma", "Linear", "Vercel", "Stripe", "Ramp", "Notion", "Loom", "Miro"][i % 8] + ` ${i + 1}`, arr: 1000 * ((i * 37) % 97 + 3) }));
export function HooksDemo() {
  const toast = useToast();
  const { copy, copied } = useClipboard();
  const wide = useMediaQuery("(min-width: 900px)");
  const panel = useDisclosure();
  const { visible, done, reset } = useStreamingText("Hooks are the headless half of Keel — the same behavior the components use, for your own markup.", 2, 30);
  useHotkeys({ "mod+j": () => toast({ title: "mod+J pressed" }) });
  const sort = useTableSort(ROWS, (r, k: "name" | "arr") => r[k], { key: "arr", dir: "desc" });
  const pg = useTablePagination(sort.sorted, 5);
  const sel = useTableSelection(pg.items, (r) => r.id);
  const weeks = useCalendarDays(new Date(2026, 10, 1));
  return (
    <StateGrid min={300}>
      <State label="useClipboard"><Button leading={copied ? <IconCheck /> : <IconCopy />} onClick={() => copy("nw_live_k3x9f2")}>{copied ? "Copied" : "Copy API key"}</Button></State>
      <State label="useHotkeys"><Text>Press <KbdGroup keys={["⌘", "J"]} /> anywhere on this page.</Text></State>
      <State label="useMediaQuery"><Text>Viewport is <b>{wide ? "≥ 900px" : "< 900px"}</b>.</Text></State>
      <State label="useDisclosure"><Row><Button onClick={panel.toggle}>{panel.open ? "Hide" : "Show"} panel</Button>{panel.open && <Tag>open</Tag>}</Row></State>
      <State label="useStreamingText"><Text>{visible}{!done && "▍"}</Text><Button size="xs" variant="ghost" onClick={reset}>Replay</Button></State>
      <State label="useCalendarDays"><Text variant="caption">November 2026 → {weeks.length} weeks, starts {weeks[0][0].date.toDateString().slice(4, 10)}</Text></State>
      <State label="useTableSort + useTablePagination + useTableSelection" wide>
        <Table><TableHeader><TableRow><TableHead style={{ width: 40 }}><Checkbox aria-label="Select page" checked={sel.allState} onCheckedChange={sel.toggleAll} /></TableHead>
          <TableHead aria-sort={sort.dirOf("name")}><button type="button" onClick={() => sort.toggle("name")}>Company {sort.sort?.key === "name" ? (sort.sort.dir === "asc" ? "↑" : "↓") : ""}</button></TableHead>
          <TableHead align="right" aria-sort={sort.dirOf("arr")}><button type="button" onClick={() => sort.toggle("arr")}>ARR {sort.sort?.key === "arr" ? (sort.sort.dir === "asc" ? "↑" : "↓") : ""}</button></TableHead></TableRow></TableHeader>
          <TableBody>{pg.items.map((r) => <TableRow key={r.id}><TableCell><Checkbox aria-label={`Select ${r.name}`} checked={sel.isSelected(r.id)} onCheckedChange={() => sel.toggle(r.id)} /></TableCell><TableCell>{r.name}</TableCell><TableCell align="right">${r.arr.toLocaleString()}</TableCell></TableRow>)}</TableBody></Table>
        <Row><Text variant="caption">{pg.from}–{pg.to} of {pg.total} · {sel.count} selected</Text><span style={{ marginLeft: "auto" }}><Pagination page={pg.page} pageCount={pg.pages} onPageChange={pg.setPage} variant="simple" /></span></Row>
      </State>
    </StateGrid>
  );
}
export function KbdIconsDemo() {
  return <Row gap={16}><Kbd>⌘K</Kbd><Kbd>⇧↵</Kbd><Kbd>⌥</Kbd><Kbd>⌃</Kbd><Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>⌫</Kbd><Kbd>⇥</Kbd><Kbd>Esc</Kbd><KbdGroup keys="mod+shift+p" /><KbdGroup keys={["⌘", "⇧", "P"]} /></Row>;
}
void [IconAgent];

/* ---------------------------------------------------------------- charts with a header */
const days = Array.from({ length: 20 }, (_, i) => new Date(2026, 8, 22 + i).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
const wave = (base: number, amp: number, k: number) => days.map((_, i) => Math.round(base + amp * Math.sin(i / k) + ((i * 37) % 11) * (amp / 14)));
export function PillBarDemo() {
  const [by, setBy] = useState("day");
  return (
    <Row>
      <Card style={{ width: 380, maxWidth: "100%" }}>
        <PillBarChart label="Traffic by source, last 20 days" title="Traffic" description="Last 20 days" unit="visits"
          action={<SegmentedControl size="sm" value={by} onValueChange={setBy} items={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }]} />}
          labels={days}
          series={[{ name: "Direct", values: wave(520, 180, 2.1) }, { name: "Search", values: wave(330, 120, 1.6) }, { name: "Social", values: wave(170, 60, 2.8) }, { name: "Email", values: wave(210, 90, 1.3) }]}
          negative={{ name: "Bounced", values: wave(150, 60, 1.9) }} />
      </Card>
      <Card style={{ width: 380, maxWidth: "100%" }}>
        <PillBarChart label="Signups by plan" title="Signups" description="Two series, no negatives" unit="signups" height={150}
          labels={days.slice(0, 12)} series={[{ name: "Self-serve", values: wave(42, 16, 1.7).slice(0, 12) }, { name: "Sales-led", values: wave(18, 8, 2.4).slice(0, 12) }]} />
      </Card>
    </Row>
  );
}
const walk = (n: number, start: number, drift: number, vol: number) => { let v = start; return Array.from({ length: n }, (_, i) => (v += drift + Math.sin(i * 1.7) * vol + Math.cos(i * 0.6) * vol * 0.6)); };
export function ValueChartDemo() {
  return (
    <Row>
      <Card style={{ width: 380, maxWidth: "100%" }}>
        <ValueChart label="Account balance" title="Balance"
          ranges={[{ label: "1H", values: walk(24, 58610, 9, 30), caption: "past hour" }, { label: "4H", values: walk(32, 58200, 20, 60), caption: "past 4 hours" }, { label: "1D", values: walk(40, 57630, 30, 90), caption: "today" }]} />
      </Card>
      <Card style={{ width: 380, maxWidth: "100%" }}>
        <ValueChart label="Monthly recurring revenue" title="MRR" area={false} format={(n) => `$${Math.round(n).toLocaleString()}`}
          ranges={[{ label: "30d", values: walk(30, 81200, 104, 220), caption: "last 30 days" }, { label: "90d", values: walk(45, 74800, 212, 380), caption: "last 90 days" }, { label: "12m", values: walk(48, 52100, 670, 900), caption: "last 12 months" }]} defaultRange="90d" />
      </Card>
    </Row>
  );
}

export function UsageMeterDemo() {
  return (
    <Row>
      <Card style={{ width: 340, maxWidth: "100%" }}>
        <UsageMeter title="Context" max={200000} action={<Button size="xs">Compact</Button>}
          items={[{ name: "Chat", value: 92000 }, { name: "Files", value: 41000 }, { name: "Tools", value: 14600 }, { name: "System", value: 6000 }, { name: "Memory", value: 22000 }]} />
      </Card>
      <Card style={{ width: 340, maxWidth: "100%" }}>
        <UsageMeter title="Seats" max={100} format={(n) => `${n}`} action={<Button size="xs" variant="primary">Upgrade</Button>}
          items={[{ name: "Admins", value: 6 }, { name: "Members", value: 58 }, { name: "Guests", value: 8 }]} />
      </Card>
    </Row>
  );
}
export function ComposerStylesDemo() {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [c, setC] = useState("");
  const sources = [{ id: "f", label: "Add photos & files", description: "From your computer", icon: <IcClip /> }, { id: "d", label: "Workspace data", description: "Deals, people, invoices", icon: <IcData /> }, { id: "w", label: "Web search", description: "Live results", icon: <IcGlobe /> }];
  return (
    <StateGrid min={320}>
      <State label="Pill — opens when you click it"><div style={{ width: "100%", minHeight: 120 }}><Composer2 variant="pill" value={a} onValueChange={setA} onSubmit={() => setA("")} sources={sources} /></div></State>
      <State label="Label, suggestions and a Send button"><div style={{ width: "100%" }}><Composer2 value={b} onValueChange={setB} onSubmit={() => setB("")} label="Reply to Emma" placeholder="Write a reply…" minRows={2} dictation={false} sendLabel="Send" suggestions={["Sounds good", "Can we move it to Friday?", "Send the contract"]} /></div></State>
      <State label="Add menu (+) with sources"><div style={{ width: "100%" }}><Composer2 value={c} onValueChange={setC} onSubmit={() => setC("")} sources={sources} label="Ask Northwind" meta="Fast" /></div></State>
    </StateGrid>
  );
}
export function TaskCapsulesDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <TaskList2 variant="capsule" tasks={[{ id: "1", title: "Verified vendor records", status: "done", meta: "12 suppliers" }, { id: "2", title: "Build reorder task list", status: "running", meta: "7 SKUs" }, { id: "3", title: "Draft supplier emails", status: "queued", meta: "2 messages" }, { id: "4", title: "Sync to ERP", status: "failed", meta: "Timeout" }]} />
    </div>
  );
}
