/* Work — 12 screens: inbox, board, calendar, workflow builder, files, notifications, tasks, team chat, roadmap, doc editor, report builder, activity. */
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import {
  Avatar, AvatarGroup, Bezel, Button, Calendar, Card, ChatComposer, ChatMessage, Checkbox, CommandMenu, CommandPaletteEmpty, CommandPaletteGroup, CommandPaletteInput,
  CommandPaletteItem, CommandPaletteList, Divider, EmptyState, Field, IconArchive, IconCalendar, IconChevronLeft, IconChevronRight, IconFile, IconFilter, IconFolder,
  IconHash, IconMail, IconPlus, IconReply, IconSearch, IconSend, IconStar, IconTrash, IconWorkflow, IconX, IconBookmark, IconUsers, IconClock, IconCheckCircle, IconFileImage,
  IconFileSpreadsheet, IconGrid, IconList, IconDownload, IconShare, IconBold, IconItalic, IconLink, IconQuote, IconHeading, IconListOrdered, IconSettings, IconBell,
  IconButton, Input, Kbd, LineChart, List, ListItem, Markdown, MoreMenu, ProgressBar, SearchInput, SegmentedControl, Select, Stat, Switch, TabMenu, Tag, Text,
  Timeline, Toolbar, ToolbarButton, ToolbarSeparator, useToast, BarChart, SelectableCard, Outline, NavIcon, IconAgent, Resizable, IconSend as IconPaper, Stack,
} from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";
import { deals, money, people, ScreenShell, series, weeks } from "./kit";

const s = stylex.create({
  split: { display: "grid", minHeight: "calc(100dvh - 68px)", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 900px)": "320px minmax(0, 1fr)" } },
  pane: { display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, borderInlineEndWidth: { default: 0, "@media (min-width: 900px)": 1 }, borderInlineEndStyle: "solid", borderInlineEndColor: color.border },
  paneHead: { display: "flex", alignItems: "center", gap: 8, padding: 12, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  read: { display: { default: "none", "@media (min-width: 900px)": "flex" }, flexDirection: "column", gap: 20, padding: { default: 16, "@media (min-width: 768px)": 28 }, minWidth: 0 },
  board: { display: "flex", gap: 12, overflowX: "auto", padding: { default: 16, "@media (min-width: 768px)": 24 }, alignItems: "flex-start", minHeight: "calc(100dvh - 68px)" },
  col: { display: "flex", flexDirection: "column", gap: 8, width: 284, flexShrink: 0, padding: 6, borderRadius: radius.xxl, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}` },
  colHead: { display: "flex", alignItems: "center", gap: 8, paddingInline: 8, paddingTop: 6, paddingBottom: 2 },
  colTitle: { fontFamily: font.mono, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgMuted, flex: 1 },
  kcard: { display: "flex", flexDirection: "column", gap: 10, padding: 12, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: { default: depth.card, ":hover": depth.cardHover }, cursor: "grab", textAlign: "start" },
  row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  month: { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", borderRadius: radius.xl, overflow: "hidden", boxShadow: depth.card, backgroundColor: color.border, gap: 1 },
  dayHead: { padding: 8, fontSize: font.xs, fontFamily: font.mono, textTransform: "uppercase", letterSpacing: "0.06em", color: color.fgMuted, backgroundColor: color.surfaceSunken },
  day: { minHeight: { default: 72, "@media (min-width: 900px)": 112 }, padding: 6, display: "flex", flexDirection: "column", gap: 4, backgroundColor: color.surface, minWidth: 0 },
  dayOut: { backgroundColor: color.surfaceSunken, color: color.fgFaint },
  dayNum: { fontSize: font.sm, fontVariantNumeric: "tabular-nums", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" },
  today: { color: color.onAccent, backgroundColor: color.accent, fontWeight: font.semibold },
  ev: { fontSize: font.xs, paddingInline: 6, paddingBlock: 2, borderRadius: radius.xs, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", backgroundColor: color.muted, boxShadow: `inset 2px 0 0 ${color.fgFaint}` },
  evBlue: { backgroundColor: color.accentSoft, boxShadow: `inset 2px 0 0 ${color.accent}`, color: color.accentStrong },
  canvas: {
    position: "relative", minHeight: "calc(100dvh - 68px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 0, padding: { default: 16, "@media (min-width: 768px)": 40 },
    backgroundColor: color.surfaceSunken, backgroundImage: `radial-gradient(${color.borderStrong} 1px, transparent 1px)`, backgroundSize: "18px 18px",
  },
  wfGrid: { display: "grid", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1100px)": "minmax(0, 1fr) 340px" }, minHeight: "calc(100dvh - 68px)" },
  side: { display: "flex", flexDirection: "column", gap: 16, padding: 16, backgroundColor: color.surface, borderInlineStartWidth: { default: 0, "@media (min-width: 1100px)": 1 }, borderTopWidth: { default: 1, "@media (min-width: 1100px)": 0 }, borderStyle: "solid", borderColor: color.border },
  node: { width: "min(360px, 100%)", display: "flex", flexDirection: "column", gap: 10, padding: 14, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  nodeOn: { boxShadow: `0 0 0 1.5px ${color.accent}, 0 0 0 5px ${color.focusRing}, ${depth.card}` },
  pillLabel: { display: "inline-flex", alignItems: "center", gap: 6, height: 22, paddingInline: 8, borderRadius: radius.full, fontSize: font.xs, fontWeight: font.medium, color: color.accentStrong, backgroundColor: color.accentSoft, boxShadow: `inset 0 0 0 1px ${color.accentBorder}` },
  wire: { width: 1.5, height: 28, backgroundColor: color.borderStrong },
  files: { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(min(140px, 100%), 1fr))" },
  file: { display: "flex", flexDirection: "column", gap: 8, padding: 4, borderRadius: radius.xl, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`, cursor: "pointer", textAlign: "start" },
  fileThumb: { aspectRatio: "4 / 3", borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: depth.card, display: "flex", alignItems: "center", justifyContent: "center", color: color.icon },
  fileMeta: { display: "flex", flexDirection: "column", paddingInline: 8, paddingBottom: 6, minWidth: 0 },
  chatGrid: { display: "grid", minHeight: "calc(100dvh - 68px)", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 900px)": "240px minmax(0, 1fr)" } },
  chatMain: { display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 },
  chatThread: { flex: 1, display: "flex", flexDirection: "column", gap: 18, padding: { default: 16, "@media (min-width: 768px)": 24 }, overflowY: "auto", maxWidth: 820, width: "100%", marginInline: "auto" },
  chatFoot: { padding: 16, maxWidth: 820, width: "100%", marginInline: "auto" },
  gantt: { display: "grid", gridTemplateColumns: "180px repeat(12, minmax(48px, 1fr))", minWidth: 760, fontSize: font.sm },
  gCell: { height: 40, display: "flex", alignItems: "center", paddingInline: 8, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, minWidth: 0 },
  gRow: { alignItems: "center", height: 44, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent calc((100% - 180px) / 12 - 1px), ${color.border} calc((100% - 180px) / 12 - 1px), ${color.border} calc((100% - 180px) / 12))`, backgroundPosition: "180px 0", backgroundRepeat: "no-repeat" },
  gName: { gridColumn: "1", paddingInline: 8, minWidth: 0 },
  gTrack: { gridRow: "1", paddingInline: 2, minWidth: 0 },
  gHead: { fontFamily: font.mono, fontSize: "10.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgMuted, backgroundColor: color.surfaceSunken },
  gBar: { height: 22, borderRadius: radius.sm, display: "flex", alignItems: "center", paddingInline: 8, fontSize: font.xs, fontWeight: font.medium, color: color.onInk, whiteSpace: "nowrap", overflow: "hidden", backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink },
  gBarBlue: { backgroundImage: "none", backgroundColor: color.accent, color: color.onAccent, boxShadow: "none" },
  gBarGrey: { backgroundImage: "none", backgroundColor: color.muted, color: color.fgSoft, boxShadow: `inset 0 0 0 1px ${color.border}` },
  doc: { maxWidth: 760, width: "100%", marginInline: "auto", display: "flex", flexDirection: "column", gap: 14 },
  docTitle: { fontSize: { default: "28px", "@media (min-width: 768px)": "36px" }, fontWeight: font.semibold, letterSpacing: "-0.03em", outline: "none" },
  docGrid: { display: "grid", gap: 32, gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1200px)": "minmax(0, 1fr) 200px" } },
});

/* 1 — Inbox */
function Inbox() {
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState("all");
  const mails = people.slice(0, 12).map((p, i) => ({ id: p.id, from: p.name, subject: ["Re: Q4 proposal", "Security questionnaire", "Can we move Thursday?", "Invoice INV-2063", "Intro — Northwind × Zoom", "Pricing for 200 seats", "Your trial ends in 3 days", "Feedback on onboarding", "Contract redlines", "Team offsite", "Webhook failures", "Thanks for the demo!"][i], preview: "Thanks — looping in our security lead so we can wrap this up before the end of the quarter…", time: ["09:41", "09:12", "Yesterday", "Yesterday", "Mon", "Mon", "Sun", "Nov 14", "Nov 13", "Nov 12", "Nov 12", "Nov 11"][i], unread: i < 3 }));
  const m = mails[sel];
  return (
    <ScreenShell active="inbox" flush header={{ title: "Inbox", status: <Tag size="sm">12 unread</Tag>, actions: <Button size="sm" variant="primary" leading={<IconMail />}>Compose</Button> }}>
      <div {...stylex.props(s.split)}>
        <div {...stylex.props(s.pane)}>
          <div {...stylex.props(s.paneHead)}><SearchInput size="sm" placeholder="Search mail" style={{ flex: 1 }} /><IconButton label="Filter" size="sm"><IconFilter /></IconButton></div>
          <div style={{ paddingInline: 8 }}><TabMenu value={tab} onValueChange={setTab} items={[{ value: "all", label: "All" }, { value: "unread", label: "Unread", count: 3 }, { value: "mentions", label: "Mentions" }]} /></div>
          <List>{mails.map((x, i) => <ListItem key={x.id} selected={i === sel} onClick={() => setSel(i)} leading={<Avatar name={x.from} size="sm" />} title={<span style={{ fontWeight: x.unread ? 600 : 450 }}>{x.from}</span>} description={x.subject} meta={x.time} />)}</List>
        </div>
        <div {...stylex.props(s.read)}>
          <div {...stylex.props(s.row)} style={{ justifyContent: "space-between" }}><Text variant="h3">{m.subject}</Text><span {...stylex.props(s.row)}><IconButton label="Archive" size="sm" shortcut="E"><IconArchive /></IconButton><IconButton label="Star" size="sm"><IconStar /></IconButton><IconButton label="Delete" size="sm"><IconTrash /></IconButton></span></div>
          <ChatMessage role="user" author={{ name: m.from }} content={`Hi Maya,\n\n${m.preview}\n\nCould you send the SOC 2 report and the DPA? Our procurement team needs both before Friday.\n\nBest,\n${m.from.split(" ")[0]}`} metadata={[m.time]} />
          <Bezel label="Suggested reply" icon={<IconAgent size={12} />} footer={<><Button size="sm" variant="ghost">Edit</Button><span style={{ marginLeft: "auto", display: "flex", gap: 8 }}><Button size="sm" leading={<IconReply />}>Reply</Button><Button size="sm" variant="primary" leading={<IconSend />}>Send</Button></span></>}>
            <Text>Hi {m.from.split(" ")[0]} — attached are our SOC 2 Type II report and DPA. Happy to jump on a call with procurement if useful.</Text>
          </Bezel>
        </div>
      </div>
    </ScreenShell>
  );
}

/* 2 — Kanban */
function Kanban() {
  const cols = ["Discovery", "Proposal", "Negotiation", "Won"] as const;
  return (
    <ScreenShell active="work-kanban" flush header={{ title: "Pipeline board", actions: <><SegmentedControl size="sm" defaultValue="board" items={[{ value: "board", icon: <IconGrid />, ariaLabel: "Board" }, { value: "list", icon: <IconList />, ariaLabel: "List" }]} /><Button size="sm" variant="primary" leading={<IconPlus />}>Add deal</Button></> }}>
      <div {...stylex.props(s.board)}>
        {cols.map((c) => { const list = deals.filter((d) => d.stage === c); return (
          <section key={c} {...stylex.props(s.col)} aria-label={c}>
            <div {...stylex.props(s.colHead)}><span {...stylex.props(s.colTitle)}>{c}</span><Tag size="sm">{list.length}</Tag><Text variant="caption">{money(list.reduce((a, d) => a + d.value, 0), true)}</Text></div>
            {list.map((d) => (
              <article key={d.id} tabIndex={0} {...stylex.props(s.kcard)}>
                <div {...stylex.props(s.row)} style={{ justifyContent: "space-between" }}><Text weight="medium" truncate>{d.name}</Text><MoreMenu items={[{ label: "Open" }, { label: "Move to…" }]} /></div>
                <div {...stylex.props(s.row)}><Tag size="sm" variant="outline">{money(d.value, true)}</Tag><Tag size="sm" icon={<IconCalendar />}>{d.close}</Tag></div>
                <div {...stylex.props(s.row)} style={{ justifyContent: "space-between" }}><Avatar name={d.owner} size="xs" /><Text variant="caption">{d.probability}%</Text></div>
              </article>
            ))}
            <Button size="sm" variant="ghost" leading={<IconPlus />}>Add</Button>
          </section>
        ); })}
      </div>
    </ScreenShell>
  );
}

/* 3 — Calendar */
function CalendarScreen() {
  const days = Array.from({ length: 35 }, (_, i) => i - 5);
  const events: Record<number, [string, boolean][]> = { 3: [["Pipeline review", true]], 6: [["QBR · Figma", false], ["1:1 Lena", false]], 12: [["Board meeting", true]], 17: [["Security review", true], ["Demo · Zoom", false]], 18: [["Offsite", false]], 24: [["Launch: Billing v2", true]] };
  return (
    <ScreenShell active="work-calendar" header={{ title: "Calendar", actions: <><Button size="sm">Today</Button><IconButton label="Previous month" size="sm"><IconChevronLeft /></IconButton><IconButton label="Next month" size="sm"><IconChevronRight /></IconButton><Button size="sm" variant="primary" leading={<IconPlus />}>Event</Button></> }}>
      <div {...stylex.props(s.row)} style={{ justifyContent: "space-between" }}><Text variant="h3">November 2026</Text><SegmentedControl size="sm" defaultValue="month" items={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]} /></div>
      <div {...stylex.props(s.month)}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} {...stylex.props(s.dayHead)}>{d}</div>)}
        {days.map((d) => { const inM = d >= 1 && d <= 30; const n = d < 1 ? 31 + d : d > 30 ? d - 30 : d; return (
          <div key={d} {...stylex.props(s.day, !inM && s.dayOut)}>
            <span {...stylex.props(s.dayNum, d === 18 && s.today)}>{n}</span>
            {inM && events[d]?.map(([t, b]) => <span key={t} {...stylex.props(s.ev, b && s.evBlue)}>{t}</span>)}
          </div>
        ); })}
      </div>
    </ScreenShell>
  );
}

/* 4 — Workflow builder (Listkit-style canvas + inspector) */
function WorkflowBuilder() {
  const [src, setSrc] = useState("saved");
  return (
    <ScreenShell active="work-workflow" flush header={{ title: "Untitled workflow", status: <Tag size="sm" tone="blue">Draft</Tag>, actions: <><Switch size="sm" label="Notify me" labelPosition="left" /><Button size="sm" variant="primary">Publish</Button></> }}>
      <div {...stylex.props(s.wfGrid)}>
        <div {...stylex.props(s.canvas)}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", maxWidth: 420, marginBottom: 28 }}>
            <span style={{ display: "inline-flex", padding: 10, borderRadius: 12, boxShadow: "0 0 0 1px rgba(127,127,127,.25)" }}><IconWorkflow size={20} /></span>
            <Text variant="h3">Streamline your outreach with workflows</Text>
            <Text tone="muted">New leads are added to your campaigns or CRM on a daily, weekly or monthly cadence — on autopilot.</Text>
          </div>
          <span {...stylex.props(s.pillLabel)}><IconClock size={11} />When this happens</span><div {...stylex.props(s.wire)} />
          <div {...stylex.props(s.node)}><div {...stylex.props(s.row)}><IconSend size={16} /><span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">Run this workflow every 2 days</Text><Text variant="caption">Starts right after activation</Text></span></div></div>
          <div {...stylex.props(s.wire)} /><span {...stylex.props(s.pillLabel)}>Then do this</span><div {...stylex.props(s.wire)} />
          <div {...stylex.props(s.node, s.nodeOn)}>
            <div {...stylex.props(s.row)}><IconBookmark size={16} /><span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">Lead criteria</Text><Text variant="caption">Saved filter</Text></span></div>
            <Tag size="sm" variant="outline"><IconUsers size={11} />Decision makers at insurance brokerages</Tag>
            <Bezel label="Matching these attributes" meta="5 filters"><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><span><Text variant="caption">Redemption</Text><Text>With email</Text></span><span><Text variant="caption">Per company</Text><Text>123</Text></span><span><Text variant="caption">Lead quantity</Text><Text>123</Text></span></div></Bezel>
          </div>
          <div {...stylex.props(s.wire)} /><span {...stylex.props(s.pillLabel)}><IconCheckCircle size={11} />End</span>
        </div>
        <aside {...stylex.props(s.side)}>
          <div><Text variant="h3">Untitled workflow</Text><span {...stylex.props(s.row)} style={{ marginTop: 6 }}><Tag size="sm"><IconClock size={11} />2 days</Tag><Tag size="sm"><IconUsers size={11} />123</Tag></span></div>
          <TabMenu value="build" onValueChange={() => {}} items={[{ value: "build", label: "Build" }, { value: "int", label: "Integration" }]} />
          <Field label="Frequency in days"><Input type="number" defaultValue={2} /></Field>
          <Field label="Lead source" required><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <SelectableCard type="radio" selected={src === "saved"} onSelectedChange={() => setSrc("saved")} label="Saved filter" padding="sm"><span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><IconBookmark size={16} /><Text variant="caption">Saved filter</Text></span></SelectableCard>
            <SelectableCard type="radio" selected={src === "orders"} onSelectedChange={() => setSrc("orders")} label="Order history" padding="sm"><span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><IconFile size={16} /><Text variant="caption">Order history</Text></span></SelectableCard>
          </div></Field>
          <Field label="Saved filter"><Select defaultValue="dm" options={[{ value: "dm", label: "Decision makers at insurance…" }, { value: "vp", label: "VPs in fintech" }]} /></Field>
          <Field label="Credit redemption" required><div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{["With email", "With phone", "With email + phone"].map((l, i) => <Switch key={l} size="sm" label={l} labelPosition="left" defaultChecked={i === 0} />)}</div></Field>
          <Field label="Max people per company" required><Input type="number" defaultValue={123} /></Field>
          <Button variant="primary" leading={<IconSend />}>Send to email campaigns</Button>
        </aside>
      </div>
    </ScreenShell>
  );
}

/* 5 — Files */
function Files() {
  const [view, setView] = useState("grid");
  const items: [string, ReactNode, string][] = [["Board deck Q3.pdf", <IconFile size={28} />, "2.4 MB · Lena"], ["Pricing model.xlsx", <IconFileSpreadsheet size={28} />, "640 KB · Maya"], ["Brand", <IconFolder size={28} />, "24 items"], ["Hero.png", <IconFileImage size={28} />, "1.8 MB · Rafi"], ["Contracts", <IconFolder size={28} />, "112 items"], ["Roadmap.pdf", <IconFile size={28} />, "880 KB · Kenji"], ["SOC2 evidence", <IconFolder size={28} />, "38 items"], ["Q4 plan.docx", <IconFile size={28} />, "92 KB · Maya"]];
  return (
    <ScreenShell active="work-files" header={{ title: "Files", actions: <><SegmentedControl size="sm" value={view} onValueChange={setView} items={[{ value: "grid", icon: <IconGrid />, ariaLabel: "Grid" }, { value: "list", icon: <IconList />, ariaLabel: "List" }]} /><Button size="sm" variant="primary" leading={<IconPlus />}>Upload</Button></> }}>
      <Stat variant="sunken" label="Storage" value="12.4 GB" meta="of 50 GB" progress={{ value: 24.8, label: "24.8% used · resets never" }} />
      {view === "grid"
        ? <div {...stylex.props(s.files)}>{items.map(([n, ic, m]) => <button key={n} type="button" {...stylex.props(s.file)}><span {...stylex.props(s.fileThumb)}>{ic}</span><span {...stylex.props(s.fileMeta)}><Text weight="medium" truncate>{n}</Text><Text variant="caption">{m}</Text></span></button>)}</div>
        : <Card padding="none"><List>{items.map(([n, ic, m]) => <ListItem key={n} leading={ic} title={n} description={m} trailing={<MoreMenu items={[{ label: "Share", icon: <IconShare /> }, { label: "Download", icon: <IconDownload /> }]} />} />)}</List></Card>}
    </ScreenShell>
  );
}

/* 6 — Notifications */
function Notifications() {
  const [tab, setTab] = useState("all");
  const items = [["Lena Novak", "mentioned you in Figma · Expansion", "“@Maya can you approve the discount?”", "4m", true], ["System", "Payment failed for Lyft", "Card declined — retrying Thursday", "1h", true], ["Rafi Ahmed", "assigned you a ticket", "T-8812 · SSO login loop", "2h", false], ["Kenji Sato", "closed a deal", "Zoom · Expansion · $96k", "Yesterday", false], ["System", "Weekly summary is ready", "Pipeline up 8% week over week", "Mon", false]] as const;
  return (
    <ScreenShell active="dash-home" header={{ title: "Notifications", actions: <Button size="sm" variant="ghost">Mark all read</Button> }} pageWidth="narrow">
      <TabMenu value={tab} onValueChange={setTab} items={[{ value: "all", label: "All" }, { value: "mentions", label: "Mentions", count: 1 }, { value: "assigned", label: "Assigned" }, { value: "system", label: "System" }]} />
      <Card padding="none"><List>{items.map(([w, a, d, t, unread]) => <ListItem key={a} leading={w === "System" ? <NavIcon icon={<IconBell size={18} />} dot={unread} /> : <Avatar name={w} size="md" status={unread ? "online" : undefined} />} title={<span><b>{w}</b> {a}</span>} description={d} meta={t} />)}</List></Card>
    </ScreenShell>
  );
}

/* 7 — My tasks */
function Tasks() {
  const [done, setDone] = useState<Set<number>>(new Set([4]));
  const groups: [string, [string, string, string][]][] = [["Today", [["Review Q4 pricing proposal", "Deals", "11:00"], ["Approve 3 refunds", "Finance", "14:00"], ["Prep QBR for Figma", "Customers", "16:30"]]], ["This week", [["Send board update", "Company", "Thu"], ["Interview: Priya Raman", "Hiring", "Fri"], ["Renew Datadog", "Vendors", "Fri"]]]];
  let k = 0;
  return (
    <ScreenShell active="dash-home" header={{ title: "My tasks", actions: <Button size="sm" variant="primary" leading={<IconPlus />}>Task</Button> }} pageWidth="narrow">
      <Stat variant="bezel" label="This week" value={`${done.size} of 6 done`} progress={{ value: done.size, max: 6, style: "segments", label: "Keep going" }} />
      {groups.map(([g, list]) => (
        <section key={g} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Text variant="eyebrow">{g}</Text>
          <Card padding="none"><List>{list.map(([t, c, w]) => { const i = k++; return <ListItem key={t} leading={<Checkbox aria-label={t} checked={done.has(i)} onCheckedChange={() => setDone((d) => { const n = new Set(d); if (n.has(i)) n.delete(i); else n.add(i); return n; })} />} title={<span style={{ textDecoration: done.has(i) ? "line-through" : undefined, opacity: done.has(i) ? 0.5 : 1 }}>{t}</span>} description={c} meta={w} />; })}</List></Card>
        </section>
      ))}
    </ScreenShell>
  );
}

/* 8 — Team chat */
function TeamChat() {
  const [v, setV] = useState("");
  return (
    <ScreenShell active="inbox" flush header={{ title: "# revenue", status: <AvatarGroup people={people.slice(0, 5)} max={4} size="xs" />, actions: <IconButton label="Search" size="sm"><IconSearch /></IconButton> }}>
      <div {...stylex.props(s.chatGrid)}>
        <div {...stylex.props(s.pane)} style={{ display: "none" }} />
        <aside {...stylex.props(s.pane)} style={{ padding: 8 }}>
          <List>{["revenue", "deals", "support", "product", "random"].map((c, i) => <ListItem key={c} compact selected={i === 0} leading={<IconHash size={14} />} title={c} meta={i === 2 ? <Tag size="sm">4</Tag> : undefined} onClick={() => {}} />)}</List>
          <Divider label="Direct" />
          <List>{people.slice(0, 4).map((p) => <ListItem key={p.id} compact leading={<Avatar name={p.name} size="xs" status="online" />} title={p.name} onClick={() => {}} />)}</List>
        </aside>
        <div {...stylex.props(s.chatMain)}>
          <div {...stylex.props(s.chatThread)}>
            <ChatMessage role="user" author={{ name: "Lena Novak" }} content="Figma just signed the expansion — 120 seats on Scale 🎉" metadata={["10:02"]} />
            <ChatMessage role="user" author={{ name: "Kenji Sato" }} content="Huge. Can we get the case study going while they're happy?" metadata={["10:04"]} />
            <ChatMessage role="user" author={{ name: "Maya Okafor" }} content={"On it. Drafting questions now — @Lena can you intro me to their RevOps lead?"} metadata={["10:06"]} />
          </div>
          <div {...stylex.props(s.chatFoot)}><ChatComposer value={v} onValueChange={setV} onSubmit={() => setV("")} placeholder="Message #revenue" /></div>
        </div>
      </div>
    </ScreenShell>
  );
}

/* 9 — Roadmap */
function Roadmap() {
  const rows: [string, number, number, "ink" | "blue" | "grey"][] = [["Billing v2", 0, 5, "ink"], ["Mobile app", 2, 8, "blue"], ["SOC 2 Type II", 1, 4, "grey"], ["Assistant GA", 4, 9, "ink"], ["EU data region", 6, 11, "grey"], ["Pricing page", 3, 5, "blue"]];
  const m = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  return (
    <ScreenShell active="work-kanban" header={{ title: "Roadmap", actions: <><Select size="sm" variant="button" defaultValue="q" options={[{ value: "q", label: "By quarter" }, { value: "m", label: "By month" }]} aria-label="Zoom" /><Button size="sm" variant="primary" leading={<IconPlus />}>Initiative</Button></> }}>
      <Card padding="none"><div style={{ overflowX: "auto" }}>
        <div {...stylex.props(s.gantt)}><div {...stylex.props(s.gCell, s.gHead)}>Initiative</div>{m.map((x) => <div key={x} {...stylex.props(s.gCell, s.gHead)}>{x}</div>)}</div>
        {rows.map(([n, a, b, t]) => (
          <div key={n} {...stylex.props(s.gantt, s.gRow)}>
            <div {...stylex.props(s.gName)}><Text weight="medium" truncate>{n}</Text></div>
            <div {...stylex.props(s.gTrack)} style={{ gridColumn: `${a + 2} / ${b + 2}` }}><span {...stylex.props(s.gBar, t === "blue" && s.gBarBlue, t === "grey" && s.gBarGrey)}>{n}</span></div>
          </div>
        ))}
      </div></Card>
      <Text variant="caption">Black = committed · Blue = in progress · Grey = exploring</Text>
    </ScreenShell>
  );
}

/* 10 — Doc editor */
function DocEditor() {
  const md = "## Goals\nWin 40 new logos in Q1 and expand 25 existing accounts.\n\n## Plan\n- Launch the Scale plan with SSO and audit log\n- Run two webinars a month\n- Ship the assistant to every customer\n\n## Risks\nHiring two AEs takes longer than planned.";
  return (
    <ScreenShell active="work-files" header={{ title: "Q1 revenue plan", status: <Text variant="caption">Saved</Text>, actions: <><AvatarGroup people={people.slice(0, 3)} size="xs" /><Button size="sm" leading={<IconShare />}>Share</Button></> }}>
      <div {...stylex.props(s.docGrid)}>
        <div {...stylex.props(s.doc)}>
          <Toolbar variant="flat"><ToolbarButton label="Heading"><IconHeading /></ToolbarButton><ToolbarButton label="Bold" active><IconBold /></ToolbarButton><ToolbarButton label="Italic"><IconItalic /></ToolbarButton><ToolbarSeparator /><ToolbarButton label="Numbered list"><IconListOrdered /></ToolbarButton><ToolbarButton label="Quote"><IconQuote /></ToolbarButton><ToolbarButton label="Link"><IconLink /></ToolbarButton></Toolbar>
          <h1 contentEditable suppressContentEditableWarning {...stylex.props(s.docTitle)}>Q1 revenue plan</h1>
          <Markdown>{md}</Markdown>
        </div>
        <Outline items={[{ id: "goals", label: "Goals" }, { id: "plan", label: "Plan" }, { id: "risks", label: "Risks" }]} />
      </div>
    </ScreenShell>
  );
}

/* 11 — Report builder */
function ReportBuilder() {
  const [metric, setMetric] = useState("revenue");
  return (
    <ScreenShell active="dash-analytics" flush header={{ title: "New report", actions: <><Button size="sm">Cancel</Button><Button size="sm" variant="primary">Save report</Button></> }}>
      <Resizable defaultSize={28} min={20} max={45} start={
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}>
          <Field label="Metric"><Select value={metric} onValueChange={setMetric} options={[{ value: "revenue", label: "Revenue" }, { value: "deals", label: "Deals won" }, { value: "tickets", label: "Tickets" }]} /></Field>
          <Field label="Group by"><Select defaultValue="week" options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "owner", label: "Owner" }]} /></Field>
          <Field label="Chart"><SegmentedControl fullWidth defaultValue="line" items={[{ value: "line", label: "Line" }, { value: "bar", label: "Bar" }]} /></Field>
          <Field label="Compare"><Switch label="Previous period" defaultChecked /></Field>
          <CommandMenu label="Add a filter"><CommandPaletteInput placeholder="Add a filter…" /><CommandPaletteList>
            <CommandPaletteGroup heading="Properties"><CommandPaletteItem icon={<IconUsers />} onSelect={() => {}}>Owner</CommandPaletteItem><CommandPaletteItem icon={<IconSettings />} onSelect={() => {}}>Plan</CommandPaletteItem><CommandPaletteItem icon={<IconCalendar />} onSelect={() => {}}>Close date</CommandPaletteItem></CommandPaletteGroup>
            <CommandPaletteEmpty /></CommandPaletteList></CommandMenu>
        </div>
      } end={
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <Text variant="h3">{metric === "revenue" ? "Revenue by week" : metric === "deals" ? "Deals won by week" : "Tickets by week"}</Text>
          <Card><LineChart label="Report preview" labels={weeks} legend series={[{ name: "This period", values: series(60, 0.02) }, { name: "Previous", values: series(55, 0.015), color: "muted", dashed: true }]} /></Card>
          <Card><BarChart label="By owner" labels={["Lena", "Rafi", "Maya", "Kenji"]} series={[{ name: "Value", values: [182, 151, 128, 96] }]} highlight={0} height={180} /></Card>
        </div>
      } />
    </ScreenShell>
  );
}

/* 12 — Activity feed */
function Activity() {
  return (
    <ScreenShell active="dash-home" header={{ title: "Activity", actions: <Select size="sm" variant="button" defaultValue="all" options={[{ value: "all", label: "Everyone" }, { value: "me", label: "Only me" }]} aria-label="Filter" /> }} pageWidth="narrow">
      {["Today", "Yesterday"].map((d, gi) => (
        <section key={d} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Text variant="eyebrow">{d}</Text>
          <Card><Timeline events={(gi ? people.slice(6, 10) : people.slice(0, 5)).map((p, i) => ({ id: p.id, marker: <Avatar name={p.name} size="xs" />, title: <span><b>{p.name}</b> {["updated the deal stage", "added 3 contacts", "closed a ticket", "left a note", "invited a teammate"][i % 5]}</span>, body: i === 1 ? "Imported from LinkedIn · Sales Navigator" : undefined, time: `${9 + i}:${String(i * 7).padStart(2, "0")}` }))} /></Card>
        </section>
      ))}
    </ScreenShell>
  );
}

export const workScreens = [
  { id: "inbox", title: "Inbox", category: "Work", render: () => <Inbox /> },
  { id: "work-kanban", title: "Pipeline board", category: "Work", render: () => <Kanban /> },
  { id: "work-calendar", title: "Calendar", category: "Work", render: () => <CalendarScreen /> },
  { id: "work-workflow", title: "Workflow builder", category: "Work", render: () => <WorkflowBuilder /> },
  { id: "work-files", title: "Files", category: "Work", render: () => <Files /> },
  { id: "work-notifications", title: "Notifications", category: "Work", render: () => <Notifications /> },
  { id: "work-tasks", title: "My tasks", category: "Work", render: () => <Tasks /> },
  { id: "work-chat", title: "Team chat", category: "Work", render: () => <TeamChat /> },
  { id: "work-roadmap", title: "Roadmap", category: "Work", render: () => <Roadmap /> },
  { id: "work-doc", title: "Doc editor", category: "Work", render: () => <DocEditor /> },
  { id: "work-report", title: "Report builder", category: "Work", render: () => <ReportBuilder /> },
  { id: "work-activity", title: "Activity feed", category: "Work", render: () => <Activity /> },
];
void [Calendar, EmptyState, IconX, ProgressBar, useToast, IconPaper, Stack, Kbd];
