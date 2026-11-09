import * as stylex from "@stylexjs/stylex";
import { useMemo, useState, type ReactNode } from "react";
import {
  AppShell, Avatar, CommandPalette, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Header, IconBell,
  IconButton, IconChartBar, IconChevronsUpDown, IconHistory, IconHome, IconLogOut, IconMoon, IconPlus, IconReceipt, IconSearch, IconSettings, IconSparkles, IconSun, IconUser,
  IconUsers, Kbd, ProgressRing, Sidebar, SidebarBrand, SidebarContent, SidebarFooter, SidebarItem, SidebarSection, SidebarTrigger, Text, useCommandShortcut, type CommandItem,
  type HeaderProps,
} from "@keel/components";

const s = stylex.create({ wide: { display: { default: "none", "@media (min-width: 640px)": "inline-flex" } } });

/* The Fernhill admin frame every template shares: side nav, header, ⌘K palette, profile menu. */
export type Nav = "overview" | "customers" | "invoices" | "members" | "audit" | "settings" | "assistant";

export function toggleTheme() {
  const el = document.documentElement;
  const dark = el.dataset.theme ? el.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  el.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("keel-theme", el.dataset.theme); } catch { /* blocked */ }
}

const NAV: { id: Nav; label: string; icon: ReactNode; count?: number }[] = [
  { id: "overview", label: "Overview", icon: <IconHome /> },
  { id: "customers", label: "Customers", icon: <IconUsers />, count: 12 },
  { id: "invoices", label: "Invoices", icon: <IconReceipt />, count: 3 },
  { id: "assistant", label: "Assistant", icon: <IconSparkles /> },
];

export function AdminShell({ active, go = () => {}, header, children }: { active: Nav; go?: (to: Nav) => void; header: Omit<HeaderProps, "start" | "end">; children: ReactNode }) {
  const [cmd, setCmd] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme !== "light");
  useCommandShortcut(setCmd);
  const items: CommandItem[] = useMemo(() => [
    ...NAV.map((n) => ({ id: n.id, label: n.label, group: "Go to", icon: n.icon, onSelect: () => go(n.id) })),
    { id: "members", label: "Members & roles", group: "Go to", icon: <IconUser />, onSelect: () => go("members") },
    { id: "audit", label: "Audit log", group: "Go to", icon: <IconHistory />, onSelect: () => go("audit") },
    { id: "settings", label: "Settings", group: "Go to", icon: <IconSettings />, onSelect: () => go("settings") },
    { id: "new-invoice", label: "Create invoice", group: "Actions", icon: <IconPlus />, shortcut: "C", onSelect: () => go("invoices") },
  ], [go]);
  return (
    <AppShell sideNav={
      <Sidebar>
        <SidebarBrand logo="F" name="Fernhill" meta="Operations" action={<IconButton label="Switch workspace" size="xs" tooltip={false}><IconChevronsUpDown /></IconButton>} />
        <SidebarContent>
          <SidebarSection>
            <SidebarItem icon={<IconSearch />} label="Search" trailing={<Kbd>⌘K</Kbd>} onClick={() => setCmd(true)} />
            {NAV.map((n) => <SidebarItem key={n.id} icon={n.icon} label={n.label} count={n.count} active={active === n.id} onClick={() => go(n.id)} />)}
          </SidebarSection>
          <SidebarSection title="Workspace">
            <SidebarItem icon={<IconUser />} label="Members & roles" active={active === "members"} onClick={() => go("members")} />
            <SidebarItem icon={<IconHistory />} label="Audit log" active={active === "audit"} onClick={() => go("audit")} />
            <SidebarItem icon={<IconSettings />} label="Settings" active={active === "settings"} onClick={() => go("settings")} />
          </SidebarSection>
          <SidebarSection title="Reports"><SidebarItem icon={<IconChartBar />} label="Revenue" onClick={() => go("overview")} /></SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px" }}>
            <ProgressRing value={72} size={30} label="Seats used" />
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}><Text variant="caption" weight="medium" tone="default">72% of seats</Text><Text variant="caption">Scale plan</Text></div>
          </div>
        </SidebarFooter>
      </Sidebar>
    }>
      <Header start={<SidebarTrigger />} {...header} end={<>
        <IconButton xstyle={s.wide} label={dark ? "Light theme" : "Dark theme"} size="sm" onClick={() => { toggleTheme(); setDark((d) => !d); }}>{dark ? <IconSun /> : <IconMoon />}</IconButton>
        <IconButton xstyle={s.wide} label="Notifications" size="sm"><IconBell /></IconButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><button type="button" aria-label="Account" style={{ borderRadius: 999 }}><Avatar name="Nadia Karim" status="online" /></button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>nadia@fernhill.io</DropdownMenuLabel>
            <DropdownMenuItem icon={<IconUser />}>Profile</DropdownMenuItem>
            <DropdownMenuItem icon={<IconSettings />} onSelect={() => go("settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={<IconLogOut />}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>} />
      {children}
      <CommandPalette open={cmd} onOpenChange={setCmd} items={items} />
    </AppShell>
  );
}
