import "@keel/components/styles.css";
import * as stylex from "@stylexjs/stylex";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AppShell, Breadcrumbs, Button, CommandPalette, Header, IconBook, IconButton, IconExternal, IconFile, IconGrid, IconHome, IconLayers, IconMoon, IconPackage, IconSearch,
  IconSparkles, IconSun, KeelProvider, Kbd, Page, Sidebar, SidebarBrand, SidebarContent, SidebarFooter, SidebarItem, SidebarSection, SidebarTrigger, Tag, Text,
  useCommandShortcut, useTheme, type CommandItem,
} from "@keel/components";
import { color, font } from "@keel/tokens/tokens.stylex";
import { DocPageView } from "./docs/kit";
import { Home } from "./pages/home";
import { componentGroups, componentPages, pageBySlug, pages } from "./registry";
import { templateById, templates, TemplatesPage } from "./templates";

function useHash() {
  const [hash, setHash] = useState(() => location.hash || "#/");
  useEffect(() => { const on = () => setHash(location.hash || "#/"); window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on); }, []);
  return hash;
}
const go = (to: string) => { location.hash = to; window.scrollTo({ top: 0 }); };

const s = stylex.create({
  navLabel: { fontSize: font.md },
  search: {
    display: "flex", alignItems: "center", gap: 8, height: 30, width: { default: 30, "@media (min-width: 768px)": 240 }, paddingInline: 10, borderRadius: 8, cursor: "pointer",
    color: color.fgMuted, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`, fontSize: font.md,
  },
  searchText: { flex: 1, textAlign: "start", display: { default: "none", "@media (min-width: 768px)": "inline" } },
  kbd: { display: { default: "none", "@media (min-width: 768px)": "inline-flex" } },
});

function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  return <IconButton label={resolved === "dark" ? "Light theme" : "Dark theme"} size="sm" onClick={toggle}>{resolved === "dark" ? <IconSun /> : <IconMoon />}</IconButton>;
}

function Docs() {
  const hash = useHash();
  const [cmd, setCmd] = useState(false);
  useCommandShortcut(setCmd);
  const route = hash.replace(/^#/, "");
  const slug = route.startsWith("/docs/") ? route.slice(6) : null;
  const tid = route.startsWith("/t/") ? route.slice(3) : null;
  const page = slug ? pageBySlug.get(slug) : null;

  const items: CommandItem[] = useMemo(() => [
    { id: "home", label: "Overview", group: "Pages", icon: <IconHome />, onSelect: () => go("#/") },
    { id: "templates", label: "Templates", group: "Pages", icon: <IconGrid />, onSelect: () => go("#/templates") },
    ...pages.map((p) => ({ id: p.slug, label: p.title, group: p.group, icon: p.render ? <IconBook /> : <IconPackage />, keywords: p.components, onSelect: () => go(`#/docs/${p.slug}`) })),
    ...templates.map((t) => ({ id: `t-${t.id}`, label: t.title, group: "Templates", icon: <IconFile />, onSelect: () => go(`#/t/${t.id}`) })),
  ], []);

  if (tid) { const t = templateById.get(tid); if (t) { const R = t.render; return <R go={(to: string) => go(to)} />; } }

  const guidesBy = (g: string) => pages.filter((p) => p.group === g && p.render);
  const title = page?.title ?? (route === "/templates" ? "Templates" : "Overview");
  return (
    <AppShell sideNav={
      <Sidebar label="Documentation">
        <SidebarBrand logo="K" name="Keel" meta="v2 · StyleX" action={<Tag size="sm" tone="blue" shape="pill">Preview</Tag>} />
        <SidebarContent>
          <SidebarSection>
            <SidebarItem icon={<IconHome />} label="Overview" active={route === "/" || route === ""} onClick={() => go("#/")} />
            <SidebarItem icon={<IconGrid />} label="Templates" count={templates.length} active={route === "/templates"} onClick={() => go("#/templates")} />
          </SidebarSection>
          {["Get started", "Foundations"].map((g) => (
            <SidebarSection key={g} title={g}>
              {guidesBy(g).map((p) => <SidebarItem key={p.slug} icon={g === "Get started" ? <IconSparkles /> : <IconLayers />} label={p.title} active={slug === p.slug} onClick={() => go(`#/docs/${p.slug}`)} />)}
            </SidebarSection>
          ))}
          {componentGroups.map((g) => (
            <SidebarSection key={g} title={g}>
              {componentPages.filter((p) => p.group === g).map((p) => <SidebarItem key={p.slug} label={p.title} active={slug === p.slug} onClick={() => go(`#/docs/${p.slug}`)} trailing={p.badge ? <Tag size="sm" tone="blue" shape="pill">New</Tag> : undefined} />)}
            </SidebarSection>
          ))}
        </SidebarContent>
        <SidebarFooter><Text variant="caption">No Tailwind · StyleX atomic CSS</Text></SidebarFooter>
      </Sidebar>
    }>
      <Header title={title} start={<SidebarTrigger />}
        breadcrumb={page ? <Breadcrumbs items={[{ label: "Docs", onClick: () => go("#/") }, { label: page.group }, { label: page.title }]} /> : undefined}
        actions={<>
          <button type="button" onClick={() => setCmd(true)} {...stylex.props(s.search)} aria-label="Search docs"><IconSearch size={14} /><span {...stylex.props(s.searchText)}>Search…</span><span {...stylex.props(s.kbd)}><Kbd>⌘K</Kbd></span></button>
          <ThemeToggle />
          <Button size="sm" variant="ghost" trailing={<IconExternal />} onClick={() => window.open("https://github.com/sajidur7/keel", "_blank")}>GitHub</Button>
        </>} />
      <Page>
        {page ? <DocPageView key={page.slug} page={page} /> : route === "/templates" ? <TemplatesPage go={go} /> : <Home go={go} />}
      </Page>
      <CommandPalette open={cmd} onOpenChange={setCmd} items={items} placeholder="Search components, guides, templates…" />
    </AppShell>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><KeelProvider defaultMode="dark"><Docs /></KeelProvider></StrictMode>);
