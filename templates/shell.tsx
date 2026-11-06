import { useCallback, useState, type ReactNode } from "react";
import {
  AppShell, Avatar, CommandPalette, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, Header, IconBell, IconBuilding, IconButton, IconChartBar,
  IconChevronsUpDown, IconHistory, IconHome, IconKey, IconLogOut, IconMoon, IconPlus, IconReceipt, IconSearch,
  IconSettings, IconSun, IconUser, IconUsers, Kbd, ProgressRing, Sidebar, SidebarBrand, SidebarContent, SidebarFooter,
  SidebarItem, SidebarSection, SidebarTrigger, Tooltip, useCommandShortcut, type HeaderProps,
} from "@keel/components";

/*
  The Fernhill admin frame shared by every template: sidebar, header, ⌘K palette and profile menu.
  `active` highlights the nav item; `go` is how templates navigate (the docs site passes hash routing).
*/
export type Nav = "overview" | "customers" | "invoices" | "members" | "audit" | "settings";

const LOGO = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3.5 4.5h9M5 8h6M6.5 11.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export function toggleTheme() {
  const el = document.documentElement;
  const next = el.dataset.theme === "light" ? "dark" : "light";
  el.dataset.theme = next;
  try { localStorage.setItem("keel-theme", next); } catch { /* ignore */ }
}

export function AdminShell({
  active,
  go = () => {},
  header,
  children,
}: {
  active: Nav;
  go?: (to: Nav) => void;
  header: Omit<HeaderProps, "start" | "end">;
  children: ReactNode;
}) {
  const [cmd, setCmd] = useState(false);
  const toggle = useCallback((fn: (o: boolean) => boolean) => setCmd(fn), []);
  useCommandShortcut(toggle);
  const item = (id: Nav, label: string, icon: ReactNode, count?: number) => (
    <SidebarItem icon={icon} label={label} count={count} active={active === id} onClick={() => go(id)} />
  );

  return (
    <AppShell
      sidebar={
        <Sidebar>
          <SidebarBrand logo={LOGO} name="Fernhill" meta="Operations · Scale" action={<IconChevronsUpDown size={14} className="text-icon" />} />
          <div className="px-2 pb-1">
            <button
              type="button"
              onClick={() => setCmd(true)}
              className="flex h-[30px] w-full items-center gap-2 rounded-md bg-card px-2 text-small text-faint shadow-raised outline-none hover:text-soft focus-visible:shadow-focus group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:px-0"
            >
              <IconSearch size={14} className="shrink-0 text-icon" />
              <span className="flex-1 truncate text-left group-data-[collapsed]/sidebar:hidden">Search</span>
              <Kbd className="group-data-[collapsed]/sidebar:hidden">⌘K</Kbd>
            </button>
          </div>
          <SidebarContent>
            <SidebarSection title="Workspace">
              {item("overview", "Overview", <IconHome />)}
              {item("customers", "Customers", <IconBuilding />, 12)}
              {item("invoices", "Invoices", <IconReceipt />, 3)}
            </SidebarSection>
            <SidebarSection title="Admin">
              {item("members", "Members & roles", <IconUsers />, 8)}
              {item("audit", "Audit log", <IconHistory />)}
              {item("settings", "Settings", <IconSettings />)}
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2.5 px-2 py-1.5 group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:px-0">
              <ProgressRing value={140} max={200} size={22} stroke={2.5} showValue={false} label="Seats used: 140 of 200" />
              <div className="flex min-w-0 flex-col group-data-[collapsed]/sidebar:hidden">
                <span className="tabular text-caption">140 of 200 seats</span>
                <span className="text-[11px] text-subtle">Renews Dec 1</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Header
        {...header}
        start={<SidebarTrigger />}
        end={
          <>
            <Tooltip content="Notifications"><IconButton label="Notifications" size="sm" className="hidden sm:inline-flex"><IconBell /></IconButton></Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Account menu" className="rounded-full outline-none focus-visible:shadow-focus">
                  <Avatar name="Nadia Karim" size="md" status="online" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1 normal-case tracking-normal">
                  <span className="text-small font-medium text-foreground">Nadia Karim</span>
                  <span className="text-caption font-normal text-subtle">nadia@fernhill.io</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<IconUser />}>Profile</DropdownMenuItem>
                <DropdownMenuItem icon={<IconKey />}>API keys</DropdownMenuItem>
                <DropdownMenuItem icon={<><IconMoon className="light:hidden" /><IconSun className="hidden light:block" /></>} onSelect={toggleTheme}>
                  Toggle theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<IconLogOut />}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
      {children}
      <CommandPalette
        open={cmd}
        onOpenChange={setCmd}
        items={[
          { id: "new-invoice", group: "Actions", label: "Create invoice", icon: <IconPlus />, onSelect: () => go("invoices") },
          { id: "invite", group: "Actions", label: "Invite member", icon: <IconUsers />, onSelect: () => go("members") },
          { id: "theme", group: "Actions", label: "Toggle theme", icon: <IconMoon />, keywords: ["dark", "light"], onSelect: toggleTheme },
          { id: "go-overview", group: "Go to", label: "Overview", icon: <IconHome />, keywords: ["dashboard"], onSelect: () => go("overview") },
          { id: "go-customers", group: "Go to", label: "Customers", icon: <IconBuilding />, onSelect: () => go("customers") },
          { id: "go-invoices", group: "Go to", label: "Invoices", icon: <IconReceipt />, onSelect: () => go("invoices") },
          { id: "go-members", group: "Go to", label: "Members & roles", icon: <IconUsers />, onSelect: () => go("members") },
          { id: "go-audit", group: "Go to", label: "Audit log", icon: <IconHistory />, onSelect: () => go("audit") },
          { id: "go-settings", group: "Go to", label: "Settings", icon: <IconSettings />, onSelect: () => go("settings") },
          { id: "go-reports", group: "Go to", label: "Reports", icon: <IconChartBar />, hint: "Soon", onSelect: () => go("overview") },
        ]}
      />
    </AppShell>
  );
}
