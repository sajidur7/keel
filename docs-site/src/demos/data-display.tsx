import {
  Avatar, AvatarGroup, Button, Code, CodeBlock, CountBadge, DescriptionList, EmptyState, HoverCard, IconButton, IconCopy,
  IconInbox, IconPlus, IconUsers, List, ListItem, Popover, PopoverContent, PopoverTrigger, Progress, ProgressRing,
  SegmentBar, Skeleton, SkeletonText, Sparkline, Stat, StatGroup, StatusPill, Tag, TAG_TONES, Timeline, Tooltip,
  FormField, Input,
} from "@keel/components";
import { customers, people } from "@keel/templates/data";
import { useState } from "react";
import { IconCard, IconMoreHorizontal, SegmentedControl, Switch } from "@keel/components";
import type { DocPage } from "../docs/types";

/* ===== Avatar ===== */

export function AvatarDemo() {
  return (
    <>
      <Avatar name="Nadia Karim" size="xs" />
      <Avatar name="Nadia Karim" size="sm" />
      <Avatar name="Nadia Karim" size="md" />
      <Avatar name="Nadia Karim" size="lg" status="online" />
      <Avatar name="Rafi Ahmed" size="xl" status="away" />
      <Avatar name="Leah Tran" size="2xl" status="busy" />
      <Avatar name="Orbital Labs" size="lg" shape="square" />
      <Avatar name="Jonas Weber" size="lg" colored={false} status="offline" />
      <AvatarGroup people={people} max={4} size="md" />
    </>
  );
}

/* ===== Tag / status / badge ===== */

export function TagTones() {
  return (
    <>
      {TAG_TONES.map((t) => <Tag key={t} tone={t}>{t[0].toUpperCase() + t.slice(1)}</Tag>)}
    </>
  );
}

export function TagOptions() {
  const [tags, setTags] = useState(["Logistics", "Annual", "SSO"]);
  return (
    <>
      <Tag size="sm" tone="blue">Small</Tag>
      <Tag size="md" tone="blue">Medium</Tag>
      <Tag size="lg" tone="blue">Large</Tag>
      <Tag tone="teal" dot>Growth</Tag>
      <Tag tone="violet" dot>Enterprise</Tag>
      {tags.map((t) => <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>)}
      {tags.length < 3 && <Button size="xs" variant="ghost" onClick={() => setTags(["Logistics", "Annual", "SSO"])}>Reset</Button>}
    </>
  );
}

export function StatusPills() {
  return (
    <>
      <StatusPill status="active" pulse>Live</StatusPill>
      <StatusPill status="success">Paid</StatusPill>
      <StatusPill status="warning">Due</StatusPill>
      <StatusPill status="danger">Overdue</StatusPill>
      <StatusPill status="info">Trial</StatusPill>
      <StatusPill status="neutral">Paused</StatusPill>
      <StatusPill status="pending">Draft</StatusPill>
      <StatusPill status="success" size="sm">Small</StatusPill>
    </>
  );
}

export function CountBadges() {
  return (
    <>
      <CountBadge count={4} />
      <CountBadge count={128} />
      <CountBadge count={7} tone="strong" />
      <CountBadge count={3} tone="danger" />
      <span className="flex items-center gap-2 text-small text-soft">Inbox <CountBadge count={12} /></span>
    </>
  );
}

/* ===== Description list ===== */

export function DescriptionListDemo() {
  const c = customers[0];
  return (
    <div className="grid w-full gap-8 lg:grid-cols-2">
      <DescriptionList items={[
        { label: "Customer", value: c.name },
        { label: "Domain", value: <a className="underline decoration-line-strong underline-offset-2 hover:decoration-foreground" href="#">{c.domain}</a> },
        { label: "Plan", value: <Tag tone="blue">{c.plan}</Tag> },
        { label: "Owner", value: <span className="flex items-center gap-2"><Avatar size="sm" name={c.owner} />{c.owner}</span> },
        { label: "Account ID", value: <Code>{c.id}</Code> },
        { label: "Tax ID", value: null },
      ]} />
      <DescriptionList layout="stacked" columns={2} items={[
        { label: "Seats", value: <span className="tabular">{c.seats}</span> },
        { label: "Region", value: c.region },
        { label: "Customer since", value: "Feb 14, 2023" },
        { label: "Health", value: <SegmentBar value={c.health} tone="auto" className="max-w-40" label="Health" /> },
        { label: "Notes", value: "Renewal call booked for Dec 2. Wants SSO on the Scale plan.", full: true },
      ]} />
    </div>
  );
}

/* ===== Stats ===== */

export function StatDemo() {
  return (
    <StatGroup className="w-full">
      <Stat label="MRR" value="$102,750" delta={6.2} baseline="vs Oct" help="Monthly recurring revenue across active subscriptions, excluding one-off charges." />
      <Stat label="Active customers" value="1,284" delta={2.1} baseline="vs Oct" help="Customers with at least one paid seat." />
      <Stat label="Churn" value="1.8%" delta={0.4} deltaUnit="pt" baseline="vs Oct" lowerIsBetter help="Share of MRR lost to cancellations and downgrades." />
      <Stat label="Avg. response" value="3h 12m" delta={-14} baseline="vs Oct" lowerIsBetter help="Median first response time on support tickets." />
    </StatGroup>
  );
}

export function StatPlayground() {
  const [on, setOn] = useState({ help: true, icon: false, action: false, delta: true, meta: false, progress: false, chart: false, footer: false, card: true, inline: false, loading: false });
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const parts: [keyof typeof on, string][] = [
    ["help", "Help underline"], ["icon", "Icon"], ["action", "Action"], ["delta", "Delta"], ["meta", "Meta"],
    ["progress", "Progress"], ["chart", "Sparkline"], ["footer", "Footer"], ["card", "Card"], ["inline", "Inline delta"], ["loading", "Loading"],
  ];
  return (
    <div className="grid w-full gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
      <Stat
        label="Collected"
        value="$61,430"
        size={size}
        variant={on.card ? "card" : "plain"}
        layout={on.inline ? "inline" : "stacked"}
        loading={on.loading}
        help={on.help ? "Payments received this month, net of refunds." : undefined}
        icon={on.icon ? <IconCard /> : undefined}
        action={on.action ? <IconButton size="xs" variant="ghost" label="More"><IconMoreHorizontal /></IconButton> : undefined}
        delta={on.delta ? 6.2 : undefined}
        baseline="vs Oct"
        meta={on.meta ? "14 invoices" : undefined}
        progress={on.progress ? { value: 61430, max: 102750, label: "60% of $102.8k expected" } : undefined}
        chart={on.chart ? <Sparkline values={[41, 44, 43, 48, 50, 52, 55, 54, 58, 61]} width={120} height={20} label="Collected, last 10 days" /> : undefined}
        footer={on.footer ? <><span>Updated 4 min ago</span><a href="#/docs/stat">View report</a></> : undefined}
      />
      <div className="flex flex-col gap-3">
        <span className="eyebrow">Parts</span>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 xl:grid-cols-3">
          {parts.map(([k, l]) => (
            <Switch key={k} size="sm" label={l} checked={on[k]} onCheckedChange={(v) => setOn((o) => ({ ...o, [k]: v }))} />
          ))}
        </div>
        <span className="eyebrow mt-2">Size</span>
        <SegmentedControl aria-label="Stat size" size="sm" value={size} onValueChange={(v) => setSize(v as "sm" | "md" | "lg")}
          options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
      </div>
    </div>
  );
}

export function StatRecipes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Stat variant="card" label="Seats used" help="Paid seats assigned to members." value="148" meta="of 200"
        progress={{ value: 148, max: 200, label: "52 seats left" }} />
      <Stat variant="card" label="Weekly revenue" help="Invoices paid in the last 7 days." value="$24,180" delta={6.6} baseline="vs last week"
        chart={<Sparkline variant="line" values={[18, 19, 21, 20, 22, 23, 24]} width={160} height={24} label="Weekly revenue trend" />} />
      <Stat variant="card" label="Open tickets" help="Tickets waiting on your team." value="23" delta={-4} deltaUnit="" baseline="since yesterday" lowerIsBetter
        footer={<><span>3 over SLA</span><a href="#/docs/stat">Open queue</a></>} />
    </div>
  );
}

/* ===== Progress ===== */

export function ProgressDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-caption"><span className="text-soft">Seats used</span><span className="tabular text-subtle">140 / 200</span></div>
        <Progress value={140} max={200} aria-label="Seats used" />
      </div>
      <Progress value={82} tone="data" size="md" aria-label="Import" />
      <Progress value={96} tone="danger" aria-label="Storage" />
      <Progress aria-label="Syncing" />
      <div className="flex items-center gap-4">
        <ProgressRing value={72} label="Profile complete" />
        <ProgressRing value={40} size={44} tone="data" label="Quota" />
        <ProgressRing value={92} size={24} tone="warning" showValue={false} label="Storage" />
      </div>
    </div>
  );
}

export function SegmentBarDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {customers.slice(0, 4).map((c) => (
        <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_120px_28px] items-center gap-3 text-small">
          <span className="truncate text-soft">{c.name}</span>
          <SegmentBar value={c.health} tone="auto" label={`${c.name} health`} />
          <span className="tabular text-right text-caption text-subtle">{c.health}</span>
        </div>
      ))}
      <SegmentBar value={7} max={10} segments={10} size="sm" label="7 of 10 steps" />
    </div>
  );
}

export function SparklineDemo() {
  return (
    <div className="flex flex-col gap-3">
      {customers.slice(0, 4).map((c) => (
        <div key={c.id} className="flex items-center gap-4 text-small">
          <span className="w-44 truncate text-soft">{c.name}</span>
          <Sparkline values={c.trend} tone={c.health < 40 ? "danger" : "data"} label={`${c.name} weekly active users`} />
          <Sparkline values={c.trend} variant="line" tone="neutral" />
        </div>
      ))}
    </div>
  );
}

/* ===== List / Timeline ===== */

export function ListDemo() {
  const [sel, setSel] = useState(people[0].email);
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <List>
        {people.slice(0, 4).map((p) => (
          <ListItem key={p.email} leading={<Avatar name={p.name} status={p.status} />} title={p.name} description={p.email} meta={p.role} />
        ))}
      </List>
      <List>
        {people.slice(0, 4).map((p) => (
          <ListItem key={p.email} onClick={() => setSel(p.email)} selected={sel === p.email} title={p.team} description={`${p.name} · ${p.lastActive}`} />
        ))}
      </List>
    </div>
  );
}

export function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-lg" events={[
      { id: "1", title: <><b>Rafi Ahmed</b> sent invoice <b>INV-2063</b></>, time: "14:22", tone: "info" },
      { id: "2", title: <><b>Payment failed</b> for Riverbend Credit</>, body: "Card declined (insufficient funds). Retry scheduled for Nov 7.", time: "09:00", tone: "danger" },
      { id: "3", marker: <Avatar name="Tanvir Hasan" size="sm" />, title: <><b>Tanvir Hasan</b> changed plan to <b>Enterprise</b></>, time: "Yesterday" },
      { id: "4", title: <><b>Contract renewed</b> · 12 months</>, time: "Nov 1", tone: "success" },
    ]} />
  );
}

/* ===== Tooltip / Popover ===== */

export function TooltipDemo() {
  return (
    <>
      <Tooltip content="Copy account ID" shortcut="⌘C"><IconButton label="Copy" variant="secondary"><IconCopy /></IconButton></Tooltip>
      <Tooltip content="Northwind Logistics Incorporated (Canada)"><span tabIndex={0} className="max-w-32 truncate rounded-xs text-small text-soft outline-none focus-visible:shadow-focus">Northwind Logistics Incorporated (Canada)</span></Tooltip>
      <Tooltip content="Below" side="bottom"><Button size="sm">Bottom</Button></Tooltip>
      <HoverCard trigger={<a href="#" className="text-small underline decoration-line-strong underline-offset-2">Nadia Karim</a>}>
        <div className="flex gap-3">
          <Avatar name="Nadia Karim" size="lg" status="online" />
          <div className="flex flex-col gap-0.5"><span className="font-medium">Nadia Karim</span><span className="text-caption text-subtle">Owner · Operations</span><span className="text-caption text-subtle">nadia@fernhill.io</span></div>
        </div>
      </HoverCard>
    </>
  );
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild><Button leading={<IconPlus />}>Add seats</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5"><span className="font-medium">Add seats</span><span className="text-caption text-subtle">Prorated on the next invoice.</span></div>
          <FormField label="Seats"><Input type="number" defaultValue={5} className="tabular" /></FormField>
          <div className="flex justify-end gap-2"><Button size="sm" variant="ghost">Cancel</Button><Button size="sm" variant="primary">Add 5 seats</Button></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ===== Code ===== */

export function CodeDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <p className="text-small text-soft">Use your secret key <Code>sk_live_…8f2k</Code> only on the server.</p>
      <CodeBlock title="Webhook payload" code={`{
  "id": "evt_9f2e",
  "type": "payment.failed",
  "data": {
    "invoice": "INV-2066",
    "customer": "cus_08",
    "amount": 5760,
    "reason": "card_declined"
  }
}`} />
      <CodeBlock code="curl https://api.fernhill.io/v1/invoices -H 'Authorization: Bearer $FERNHILL_KEY'" />
    </div>
  );
}

/* ===== Empty / skeleton ===== */

export function EmptyDemo() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <div className="rounded-lg shadow-card">
        <EmptyState icon={<IconUsers />} title="Invite your team" description="Members can view customers and send invoices based on their role." action={<><Button variant="primary" size="sm">Invite members</Button><Button size="sm" variant="ghost">Learn about roles</Button></>} />
      </div>
      <div className="rounded-lg shadow-card">
        <EmptyState icon={<IconInbox />} size="sm" title="No overdue invoices" description="Everything is paid or within terms." />
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-1 flex-col gap-2"><Skeleton className="h-3 w-2/5" /><Skeleton className="h-3 w-3/5" /></div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex flex-col gap-2"><Skeleton className="h-2.5 w-20" /><Skeleton className="h-7 w-32" /></div>
    </div>
  );
}

/* ===== Docs ===== */

export const docs: DocPage[] = [
  {
    slug: "avatar", title: "Avatar", group: "Data display", section: "Components", source: "data-display",
    summary: "A person or organization. Falls back to initials tinted by a stable color per name, with an optional presence dot.",
    demos: [{ id: "AvatarDemo", title: "Sizes, status, shapes, group", render: AvatarDemo }],
    api: [
      { title: "Avatar", props: [
        { name: "name", type: "string", description: "Initials and accessible name." }, { name: "src", type: "string", description: "Image; initials show while loading or on error." },
        { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"', default: '"md"', description: "16 / 20 / 24 / 32 / 40 / 56px." },
        { name: "status", type: '"online" | "away" | "busy" | "offline"', description: "Presence dot." }, { name: "shape", type: '"circle" | "square"', default: '"circle"', description: "Square for organizations." },
        { name: "colored", type: "boolean", default: "true", description: "Tint initials by name." },
      ] },
      { title: "AvatarGroup", props: [{ name: "people", type: "{ name; src? }[]", description: "" }, { name: "max", type: "number", default: "4", description: "Shown before “+N”." }] },
    ],
  },
  {
    slug: "tag", title: "Tag", group: "Data display", section: "Components", source: "data-display", keywords: ["chip", "badge", "label"],
    summary: "Labels a category with one of ten tones. Tone carries category meaning (plan, segment, type) — status lives in StatusPill.",
    demos: [
      { id: "TagTones", title: "Tones", description: "Each tone is a bg + border + text triplet tuned per theme.", render: TagTones },
      { id: "TagOptions", title: "Sizes, dot, removable", render: TagOptions },
    ],
    api: [{ props: [
      { name: "tone", type: TAG_TONES.map((t) => `"${t}"`).join(" | "), default: '"neutral"', description: "" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "18 / 20 / 24px." },
      { name: "dot", type: "boolean", description: "Colored dot before the label." },
      { name: "onRemove", type: "() => void", description: "Adds a remove button with an accessible label." },
    ] }],
    dos: [
      { do: "Map each tone to one meaning per product (e.g. plan: Starter neutral, Growth teal, Scale blue).", dont: "Cycle tones for decoration — a column of rainbow tags is unreadable." },
      { do: "Use StatusPill for states that change (paid, overdue).", dont: "Use red or green tags for categories — they read as status." },
    ],
  },
  {
    slug: "status-pill", title: "Status pill", group: "Data display", section: "Components", source: "data-display",
    summary: "A neutral pill with a colored dot. The pill stays grey so a column of statuses reads calmly; only the dot carries color, and the word carries the meaning.",
    demos: [{ id: "StatusPills", title: "Statuses", render: StatusPills }],
    api: [{ props: [{ name: "status", type: '"active" | "success" | "warning" | "danger" | "info" | "neutral" | "pending"', default: '"neutral"', description: "" }, { name: "pulse", type: "boolean", description: "Animated dot for live states (off with reduced motion)." }, { name: "size", type: '"sm" | "md"', default: '"md"', description: "" }] }],
    a11y: ["The word is always present — color is never the only signal."],
  },
  {
    slug: "count-badge", title: "Count badge", group: "Data display", section: "Components", source: "data-display",
    summary: "A small number next to nav items, tabs and buttons.",
    demos: [{ id: "CountBadges", title: "Tones", render: CountBadges }],
    api: [{ props: [{ name: "count", type: "number", description: "" }, { name: "max", type: "number", default: "99", description: "Shows “99+” above it." }, { name: "tone", type: '"neutral" | "strong" | "danger"', default: '"neutral"', description: "Danger only when the count needs action." }] }],
  },
  {
    slug: "description-list", title: "Description list", group: "Data display", section: "Components", source: "data-display", keywords: ["key value", "details"],
    summary: "Key/value pairs for a record — the body of detail sheets. Labels in a fixed column, values left-aligned, empty values show an em dash.",
    demos: [{ id: "DescriptionListDemo", title: "Horizontal and stacked", render: DescriptionListDemo, full: true }],
    api: [{ props: [{ name: "items", type: "{ label; value; full? }[]", description: "null value renders —." }, { name: "layout", type: '"horizontal" | "stacked"', default: '"horizontal"', description: "" }, { name: "columns", type: "1 | 2", default: "1", description: "Two columns from 768px." }] }],
  },
  {
    slug: "stat", title: "Stat", group: "Data display", section: "Components", source: "data-display", keywords: ["kpi", "metric", "number"],
    summary: "A headline number with its comparison. Every stat answers “compared to what?” with a delta and a one-word baseline. Explanations live in a tooltip on the label, not under the number.",
    demos: [
      { id: "StatDemo", title: "Stat group", description: "Churn and response time are lower-is-better, so their colors flip.", render: StatDemo, full: true },
      { id: "StatPlayground", title: "Parts — turn each on or off", description: "Label and value are always there. Everything else is optional.", render: StatPlayground, full: true },
      { id: "StatRecipes", title: "Common combinations", description: "Progress toward a limit, a trend, and a count with a footer action.", render: StatRecipes, full: true },
    ],
    api: [{ props: [
      { name: "label / value", type: "ReactNode", description: "Always shown. value={null} shows —." },
      { name: "help", type: "ReactNode", description: "Tooltip on the label; adds the dashed underline." },
      { name: "icon", type: "ReactNode", description: "Small Lucide icon before the label." },
      { name: "action", type: "ReactNode", description: "Top-right slot: menu, link, period select." },
      { name: "delta / deltaUnit", type: "number / string", default: '— / "%"', description: "Change vs baseline; sign sets the arrow. \"pt\" for points." },
      { name: "baseline", type: "ReactNode", description: "“vs Oct”, “vs last week”." },
      { name: "lowerIsBetter / neutral", type: "boolean", description: "Flip colors / keep grey." },
      { name: "meta", type: "ReactNode", description: "Quiet text in the delta row: “of 200”." },
      { name: "progress", type: "{ value; max?; label?; tone? }", description: "Bar toward a target under the number." },
      { name: "chart", type: "ReactNode", description: "Sparkline, SegmentBar or any small visual." },
      { name: "footer", type: "ReactNode", description: "Bottom row under a hairline." },
      { name: "layout", type: '"stacked" | "inline"', default: '"stacked"', description: "Delta under the number, or beside it." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "16 / 22 / 28px number." },
      { name: "variant", type: '"plain" | "card"', default: '"plain"', description: "plain inside StatGroup; card standalone." },
      { name: "loading", type: "boolean", description: "Skeleton in place of the number." },
    ] }],
    dos: [{ do: "Show 3–6 stats that answer the page's question.", dont: "Add icon squares and sentences under each number." }],
  },
  {
    slug: "progress", title: "Progress", group: "Data display", section: "Components", source: "data-display", keywords: ["progress bar", "ring", "meter", "segment bar"],
    summary: "Progress bar, ring and segmented bar. Segmented bars show a score or capacity as discrete blocks — scannable in a table column.",
    demos: [
      { id: "ProgressDemo", title: "Bar and ring", render: ProgressDemo, full: true },
      { id: "SegmentBarDemo", title: "Segment bar", description: "tone=\"auto\" colors low scores red, mid amber, high green.", render: SegmentBarDemo, full: true },
    ],
    api: [
      { title: "Progress", props: [{ name: "value / max", type: "number", description: "Omit value for indeterminate." }, { name: "tone", type: '"default" | "data" | "success" | "warning" | "danger"', default: '"default"', description: "" }, { name: "size", type: '"xs" | "sm" | "md"', default: '"sm"', description: "3 / 4 / 6px." }] },
      { title: "SegmentBar", props: [{ name: "value / max / segments", type: "number", default: "— / 100 / 12", description: "" }, { name: "tone", type: '"auto" | tone', default: '"data"', description: "" }] },
    ],
  },
  {
    slug: "sparkline", title: "Sparkline", group: "Data display", section: "Components", source: "data-display",
    summary: "A tiny trend with no axes, sized for table cells. The last value is emphasized; earlier ones are muted.",
    demos: [{ id: "SparklineDemo", title: "Bars and line", render: SparklineDemo, full: true }],
    api: [{ props: [{ name: "values", type: "number[]", description: "" }, { name: "variant", type: '"bars" | "line"', default: '"bars"', description: "" }, { name: "tone", type: '"data" | "danger" | "neutral"', default: '"data"', description: "" }, { name: "label", type: "string", description: "Makes it an img with a name; otherwise decorative." }] }],
  },
  {
    slug: "list", title: "List", group: "Data display", section: "Components", source: "data-display",
    summary: "A vertical list with hairline dividers for small sets — members, recent items, settings links.",
    whenNot: ["More than ~20 items or several attributes to compare — use a Table."],
    demos: [{ id: "ListDemo", title: "Static and selectable", render: ListDemo, full: true }],
    api: [{ title: "ListItem", props: [{ name: "leading / title / description / meta / trailing", type: "ReactNode", description: "" }, { name: "onClick", type: "() => void", description: "Makes the row a button." }, { name: "selected", type: "boolean", description: "" }] }],
  },
  {
    slug: "timeline", title: "Timeline", group: "Data display", section: "Components", source: "data-display", keywords: ["activity", "feed", "history"],
    summary: "Chronological events, newest first. Use it for record activity in detail sheets.",
    demos: [{ id: "TimelineDemo", title: "Activity feed", render: TimelineDemo, full: true }],
    api: [{ props: [{ name: "events", type: "{ id; title; time; body?; marker?; tone? }[]", description: "Use <b> in titles for actor and object." }] }],
  },
  {
    slug: "tooltip", title: "Tooltip & popover", group: "Data display", section: "Components", source: "data-display", keywords: ["hover card", "popover"],
    summary: "Tooltip labels an icon or reveals a truncated value. Popover holds small interactive content. HoverCard previews a linked record.",
    demos: [
      { id: "TooltipDemo", title: "Tooltip and hover card", render: TooltipDemo },
      { id: "PopoverDemo", title: "Popover", render: PopoverDemo },
    ],
    api: [{ title: "Tooltip", props: [{ name: "content", type: "ReactNode", description: "One line." }, { name: "shortcut", type: "string", description: "Kbd chip after the text." }, { name: "side / align", type: "Radix side / align", description: "" }] }],
    a11y: ["Tooltips open on hover and keyboard focus, close on Esc. Wrap the app in <TooltipProvider>.", "Never put essential information or interactive content in a tooltip; it's unreachable on touch."],
  },
  {
    slug: "code-block", title: "Code", group: "Data display", section: "Components", source: "data-display",
    summary: "Inline Code for ids and keys; CodeBlock for payloads and commands, with a copy button.",
    demos: [{ id: "CodeDemo", title: "Inline and block", render: CodeDemo, full: true }],
    api: [{ title: "CodeBlock", props: [{ name: "code", type: "string", description: "" }, { name: "title / language", type: "string", description: "Header label." }, { name: "wrap", type: "boolean", description: "Wrap long lines instead of scrolling." }] }],
  },
  {
    slug: "empty-state", title: "Empty state", group: "Data display", section: "Components", source: "data-display",
    summary: "Says what a space is for and offers the one action that fills it. No illustrations, no apologies.",
    demos: [{ id: "EmptyDemo", title: "First-use and all-clear", render: EmptyDemo, full: true }],
    api: [{ props: [{ name: "icon / title / description / action", type: "ReactNode", description: "" }, { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "" }] }],
    dos: [{ do: "“Invite your team” + an Invite button.", dont: "“Nothing here yet :(” with a large illustration." }],
  },
  {
    slug: "skeleton", title: "Skeleton", group: "Data display", section: "Components", source: "data-display", keywords: ["loading", "placeholder"],
    summary: "Placeholder blocks shaped like the real content, so nothing shifts when it loads. Use for loads over ~300ms.",
    demos: [{ id: "SkeletonDemo", title: "Shapes", render: SkeletonDemo, full: true }],
    a11y: ["Skeletons are aria-hidden; mark the loading region with aria-busy (DataTable does this)."],
  },
];
