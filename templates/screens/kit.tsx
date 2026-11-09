/**
 * Screens kit — the shared frame and sample data for the 100+ SaaS screens.
 * Every screen is built only from @keel/components; nothing here is special-cased.
 */
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  AppShell, Avatar, Button, CommandPalette, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Header,
  IconAgent, IconBell, IconBuilding, IconCalendar, IconChartBar, IconHome, IconInbox, IconLogOut, IconMoon, IconSearch, IconSettings, IconSun, IconTarget, IconUser,
  IconUsers, IconWorkflow, IconButton, IconLifeBuoy, IconReceipt, IconBook, Kbd, NavHeadingMenu, Page, ProgressBar, Sidebar, SidebarContent, SidebarFooter, SidebarItem,
  SidebarSection, SidebarTrigger, Text, useCommandShortcut, type CommandItem, type HeaderProps,
} from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";

/* ------------------------------------------------------------------ navigation between screens */

type Go = (id: string) => void;
const GoCtx = createContext<Go>(() => {});
export const useGo = () => useContext(GoCtx);
export function GoProvider({ go, children }: { go: Go; children: ReactNode }) { return <GoCtx.Provider value={go}>{children}</GoCtx.Provider>; }

export function toggleTheme() {
  const el = document.documentElement;
  const dark = el.dataset.theme ? el.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  el.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("keel-theme", el.dataset.theme); } catch { /* blocked */ }
}

const k = stylex.create({
  search: {
    display: "flex", alignItems: "center", gap: 8, width: "100%", height: 32, paddingInline: 10, borderRadius: radius.md, cursor: "pointer", outline: "none",
    fontSize: font.md, color: color.fgMuted, backgroundColor: color.surface, boxShadow: { default: depth.recessed, ":hover": `inset 0 1px 1.5px ${color.shadeXs}, 0 0 0 1px ${color.borderStrong}` },
    ":focus-visible": { boxShadow: depth.focus },
  },
  searchText: { flex: 1, textAlign: "start" },
  plan: { display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: depth.card },
  planTitle: { fontSize: font.md, fontWeight: font.semibold },
  user: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: 6, borderRadius: radius.md, cursor: "pointer", outline: "none", textAlign: "start", backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus } },
  userText: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1, lineHeight: 1.25 },
  userName: { fontSize: font.md, fontWeight: font.medium, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  userMail: { fontSize: font.xs, color: color.fgMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  wide: { display: { default: "none", "@media (min-width: 640px)": "inline-flex" } },
});

/* The product every screen belongs to: "Northwind", a revenue & ops workspace. */
export const NAV = [
  { id: "dash-home", label: "Home", icon: <IconHome /> },
  { id: "inbox", label: "Inbox", icon: <IconInbox />, count: 12 },
  { id: "ai-assistant", label: "Assistant", icon: <IconAgent /> },
] as const;
export const NAV_CRM = [
  { id: "list-people", label: "People", icon: <IconUsers />, count: 2148 },
  { id: "list-companies", label: "Companies", icon: <IconBuilding /> },
  { id: "list-deals", label: "Deals", icon: <IconTarget />, count: 64 },
  { id: "list-invoices", label: "Invoices", icon: <IconReceipt /> },
] as const;
export const NAV_WORK = [
  { id: "work-kanban", label: "Projects", icon: <IconChartBar /> },
  { id: "work-calendar", label: "Calendar", icon: <IconCalendar /> },
  { id: "work-workflow", label: "Workflows", icon: <IconWorkflow /> },
  { id: "dash-analytics", label: "Reports", icon: <IconChartBar /> },
] as const;

export type ShellProps = {
  /** Screen id of the active nav item. */
  active?: string;
  header: Omit<HeaderProps, "start" | "end">;
  children: ReactNode;
  /** No Page padding — the screen manages its own (boards, canvases, split views). */
  flush?: boolean;
  pageWidth?: "full" | "wide" | "narrow";
};

/** Northwind's app frame: workspace switcher, quick search (⌘K), grouped nav with counts, plan card and account menu. */
export function ScreenShell({ active, header, children, flush, pageWidth = "full" }: ShellProps) {
  const go = useGo();
  const [cmd, setCmd] = useState(false);
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.dataset.theme !== "light");
  useCommandShortcut(setCmd);
  const items: CommandItem[] = useMemo(() => [
    ...[...NAV, ...NAV_CRM, ...NAV_WORK].map((n): CommandItem => ({ id: n.id, label: n.label, group: "Go to", icon: n.icon, onSelect: () => go(n.id) })),
    { id: "set-general", label: "Settings", group: "Go to", icon: <IconSettings />, onSelect: () => go("set-general") },
  ], [go]);
  const item = (n: { id: string; label: string; icon: ReactNode; count?: number }) => (
    <SidebarItem key={n.id} icon={n.icon} label={n.label} count={n.count} active={active === n.id} onClick={() => go(n.id)} />
  );
  return (
    <AppShell sideNav={
      <Sidebar>
        <div style={{ padding: "8px 8px 0" }}>
          <NavHeadingMenu name="Northwind" meta="Revenue workspace" items={[{ id: "nw", name: "Northwind" }, { id: "ac", name: "Acme Labs" }, { id: "fx", name: "Foxglove" }]} onSelect={() => {}} />
        </div>
        <div style={{ padding: "8px 8px 0" }}>
          <button type="button" onClick={() => setCmd(true)} {...stylex.props(k.search)}><IconSearch size={14} /><span {...stylex.props(k.searchText)}>Quick search</span><Kbd>⌘K</Kbd></button>
        </div>
        <SidebarContent>
          <SidebarSection>{NAV.map(item)}</SidebarSection>
          <SidebarSection title="Customers">{NAV_CRM.map(item)}</SidebarSection>
          <SidebarSection title="Operate">{NAV_WORK.map(item)}</SidebarSection>
          <SidebarSection title="Workspace">
            {item({ id: "set-general", label: "Settings", icon: <IconSettings /> })}
            {item({ id: "sys-help", label: "Help center", icon: <IconLifeBuoy /> })}
            {item({ id: "sys-changelog", label: "What's new", icon: <IconBook /> })}
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <div {...stylex.props(k.plan)}>
            <span {...stylex.props(k.planTitle)}>Growth plan</span>
            <ProgressBar value={72} size="sm" />
            <Text variant="caption">72 of 100 seats used</Text>
            <Button size="sm" variant="primary" onClick={() => go("com-pricing")}>Upgrade</Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" {...stylex.props(k.user)}>
                <Avatar name="Maya Okafor" size="sm" status="online" />
                <span {...stylex.props(k.userText)}><span {...stylex.props(k.userName)}>Maya Okafor</span><span {...stylex.props(k.userMail)}>maya@northwind.io</span></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" style={{ minWidth: 220 }}>
              <DropdownMenuLabel>maya@northwind.io</DropdownMenuLabel>
              <DropdownMenuItem icon={<IconUser />} onSelect={() => go("set-profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem icon={<IconSettings />} onSelect={() => go("set-general")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<IconLogOut />} onSelect={() => go("auth-login")}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    }>
      <Header start={<SidebarTrigger />} {...header} end={<>
        <IconButton xstyle={k.wide} label={dark ? "Light theme" : "Dark theme"} size="sm" onClick={() => { toggleTheme(); setDark((d) => !d); }}>{dark ? <IconSun /> : <IconMoon />}</IconButton>
        <IconButton xstyle={k.wide} label="Notifications" size="sm" onClick={() => go("work-notifications")}><IconBell /></IconButton>
      </>} />
      {flush ? children : <Page width={pageWidth}>{children}</Page>}
      <CommandPalette open={cmd} onOpenChange={setCmd} items={items} />
    </AppShell>
  );
}

/* ------------------------------------------------------------------ sample data (deterministic) */

let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
export const pick = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
export const int = (lo: number, hi: number) => Math.floor(lo + rnd() * (hi - lo + 1));

const FIRST = ["Emma", "Noah", "Ava", "Lucas", "Oliver", "Mia", "Ethan", "Sophia", "Liam", "Amelia", "Mason", "Isabella", "Harper", "Benjamin", "Charlotte", "Jameson", "Nadia", "Rafi", "Tanvir", "Mira", "Kenji", "Lena", "Omar", "Priya", "Diego", "Sara", "Yusuf", "Chloe", "Ines", "Theo"];
const LAST = ["Rivers", "Kingsley", "Sinclair", "Fairchild", "Greenfield", "Blackwood", "Westbrook", "Caldwell", "Brightman", "Hartman", "Winslow", "Stone", "Cross", "Hawthorne", "Lane", "Pierce", "Karim", "Ahmed", "Hasan", "Okafor", "Sato", "Novak", "Haddad", "Raman", "Ortega", "Lind", "Demir", "Moreau", "Silva", "Brandt"];
export const COMPANIES = ["Meta", "Airbnb", "Medium", "Zoom", "Apple", "Tinder", "Shopify", "Lyft", "Snapchat", "Discord", "Pinterest", "Safari", "Notion", "Linear", "Vercel", "Figma", "Stripe", "Ramp", "Loom", "Miro"];
export const INDUSTRIES = ["CRM", "Productivity", "Social media", "Travel", "Media", "Tech", "E-commerce", "Transportation", "Fintech", "Health"];
const TITLES = ["User Research Director", "Product Design Lead", "VP Engineering", "Head of Growth", "Customer Experience Director", "Design Operations Manager", "Service Design Lead", "Head of RevOps", "CFO", "Founder & CEO", "Account Executive", "Data Scientist"];
const CITIES = ["Berlin", "Lisbon", "New York", "Austin", "Toronto", "Dhaka", "Singapore", "London", "Paris", "Tokyo"];

export type Person = { id: string; name: string; email: string; title: string; company: string; industry: string; city: string; phone: string; stage: "Lead" | "Qualified" | "Customer" | "Churned"; score: number; owner: string; lastSeen: string; trend: number[] };
export const people: Person[] = Array.from({ length: 48 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`; const company = pick(COMPANIES);
  return {
    id: `P-${1000 + i}`, name, email: `${name.split(" ")[0].toLowerCase()}@${company.toLowerCase()}.com`, title: pick(TITLES), company, industry: pick(INDUSTRIES), city: pick(CITIES),
    phone: `+1 ${int(200, 989)} ${int(100, 999)} ${int(1000, 9999)}`, stage: pick(["Lead", "Qualified", "Customer", "Churned"] as const), score: int(12, 98),
    owner: pick(["Maya Okafor", "Rafi Ahmed", "Lena Novak", "Kenji Sato"]), lastSeen: `${int(1, 28)}d ago`, trend: Array.from({ length: 8 }, () => int(2, 20)),
  };
});

export type Company = { id: string; name: string; domain: string; industry: string; employees: number; arr: number; plan: "Starter" | "Growth" | "Scale" | "Enterprise"; health: number; city: string; owner: string };
export const companies: Company[] = COMPANIES.map((n, i) => ({
  id: `C-${200 + i}`, name: n, domain: `${n.toLowerCase()}.com`, industry: pick(INDUSTRIES), employees: int(12, 9000), arr: int(8, 420) * 1000, plan: pick(["Starter", "Growth", "Scale", "Enterprise"] as const),
  health: int(18, 99), city: pick(CITIES), owner: pick(["Maya Okafor", "Rafi Ahmed", "Lena Novak", "Kenji Sato"]),
}));

export type Deal = { id: string; name: string; company: string; value: number; stage: "Discovery" | "Proposal" | "Negotiation" | "Won" | "Lost"; close: string; owner: string; probability: number };
export const deals: Deal[] = Array.from({ length: 28 }, (_, i) => {
  const company = pick(COMPANIES); const stage = pick(["Discovery", "Proposal", "Negotiation", "Won", "Lost"] as const);
  return { id: `D-${300 + i}`, name: `${company} · ${pick(["Expansion", "New logo", "Renewal", "Pilot", "Platform"])}`, company, value: int(4, 180) * 1000, stage, close: `${pick(["Nov", "Dec", "Jan", "Feb"])} ${int(1, 28)}`, owner: pick(["Maya Okafor", "Rafi Ahmed", "Lena Novak", "Kenji Sato"]), probability: { Discovery: 10, Proposal: 35, Negotiation: 65, Won: 100, Lost: 0 }[stage] };
});

export const money = (n: number, compact = false) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: compact ? 1 : 0, notation: compact ? "compact" : "standard" }).format(n);
export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);
export const weeks = ["Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29", "Oct 6", "Oct 13", "Oct 20", "Oct 27", "Nov 3", "Nov 10", "Nov 17"];
export const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
export const series = (start: number, drift: number, n = 12, noise = 0.08) => { let v = start; return Array.from({ length: n }, () => { v = Math.max(1, v * (1 + drift + (rnd() - 0.5) * noise)); return Math.round(v); }); };

/* ------------------------------------------------------------------ responsive columns that never leave holes */
const cols = stylex.create({
  base: { display: "grid", gap: 16, alignItems: "start", minWidth: 0, gridTemplateColumns: "minmax(0, 1fr)" },
  stretch: { alignItems: "stretch" },
  c11: { gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 900px)": "repeat(2, minmax(0, 1fr))" } },
  c21: { gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1100px)": "minmax(0, 2fr) minmax(0, 1fr)" } },
  c12: { gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1100px)": "minmax(0, 1fr) minmax(0, 2fr)" } },
  c111: { gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 760px)": "repeat(2, minmax(0, 1fr))", "@media (min-width: 1200px)": "repeat(3, minmax(0, 1fr))" } },
  c1111: { gridTemplateColumns: { default: "repeat(2, minmax(0, 1fr))", "@media (min-width: 1100px)": "repeat(4, minmax(0, 1fr))" } },
  stack: { display: "flex", flexDirection: "column", gap: 16, minWidth: 0 },
});
/** Columns that collapse to one on phones: "1:1", "2:1", "1:2", "1:1:1", "1:1:1:1". */
export function Cols({ cols: c = "1:1", stretch, children }: { cols?: "1:1" | "2:1" | "1:2" | "1:1:1" | "1:1:1:1"; stretch?: boolean; children: ReactNode }) {
  const v = { "1:1": cols.c11, "2:1": cols.c21, "1:2": cols.c12, "1:1:1": cols.c111, "1:1:1:1": cols.c1111 }[c];
  return <div {...stylex.props(cols.base, v, stretch && cols.stretch)}>{children}</div>;
}
/** A column of cards inside a Cols cell. */
export function Col({ children }: { children: ReactNode }) { return <div {...stylex.props(cols.stack)}>{children}</div>; }
