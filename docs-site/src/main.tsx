import { StrictMode, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  AppShell, Button, CommandPalette, Header, IconButton, IconCommand, IconExternal, IconFile, IconGrid,
  IconMoon, IconPackage, IconSearch, IconSun, Kbd, Page, Sidebar, SidebarBrand, SidebarContent,
  SidebarFooter, SidebarItem, SidebarSection, SidebarTrigger, Toaster, Tooltip, TooltipProvider, useCommandShortcut,
  type CommandItem,
} from "@keel/components";
import { DocPageView } from "./docs/doc-ui";
import { Home } from "./pages/home";
import { componentGroups, navToTemplate, pageBySlug, pages, templateById, templates } from "./registry";
import type { Nav } from "@keel/templates";

function useHash() {
  const [hash, setHash] = useState(() => location.hash || "#/");
  useEffect(() => {
    const on = () => { setHash(location.hash || "#/"); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}
const nav = (to: string) => { location.hash = to; window.scrollTo({ top: 0 }); };

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "dark");
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("keel-theme", next); } catch { /* ignore */ }
    setTheme(next);
  };
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(document.documentElement.dataset.theme ?? "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return { theme, toggle };
}

/* -------- Full-screen template route (#/t/<id>) — also what the docs iframes load -------- */
function TemplateRoute({ id }: { id: string }) {
  const t = templateById.get(id);
  if (!t) return <p className="p-6">Unknown template</p>;
  const R = t.render;
  const go = (to: Nav) => nav(`#/t/${navToTemplate[to]}`);
  return <R go={go} />;
}

/* -------- Template doc page -------- */
function TemplatePage({ id }: { id: string }) {
  const t = templateById.get(id)!;
  const [width, setWidth] = useState<"100%" | 768 | 390>("100%");
  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-2 pt-2">
        <span className="eyebrow">Templates</span>
        <h1 className="text-display font-semibold">{t.title}</h1>
        <p className="max-w-[70ch] text-body text-soft">{t.description}</p>
        <p className="text-caption text-subtle">Source: <code className="font-mono text-soft">{t.file}</code> · built only from Keel components and sample data.</p>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex gap-0.5 rounded-md bg-muted p-0.5" role="group" aria-label="Preview width">
          {(["100%", 768, 390] as const).map((w) => (
            <button key={w} type="button" aria-pressed={width === w} onClick={() => setWidth(w)} className="h-[26px] rounded-[6px] px-2.5 text-caption text-subtle outline-none hover:text-foreground focus-visible:shadow-focus aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-raised">
              {w === "100%" ? "Desktop" : w === 768 ? "Tablet" : "Phone"}
            </button>
          ))}
        </div>
        <Button size="sm" asChild><a href={`#/t/${t.id}`} target="_blank" rel="noreferrer"><IconExternal />Open full screen</a></Button>
      </div>
      <div className="overflow-hidden rounded-xl bg-surface p-2 shadow-card">
        <iframe
          key={t.id}
          title={`${t.title} template preview`}
          src={`${location.pathname}#/t/${t.id}`}
          className="mx-auto block h-[760px] rounded-lg bg-background shadow-card transition-[width] duration-base ease-out"
          style={{ width: width === "100%" ? "100%" : width, maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}

/* -------- Docs shell -------- */
function DocsShell({ route, children, title }: { route: string; children: ReactNode; title: string }) {
  const { theme, toggle } = useTheme();
  const [cmd, setCmd] = useState(false);
  const setCmdFn = useCallback((fn: (o: boolean) => boolean) => setCmd(fn), []);
  useCommandShortcut(setCmdFn);

  const items: CommandItem[] = useMemo(() => [
    ...pages.map((p) => ({ id: p.slug, label: p.title, group: p.section === "Components" ? "Components" : p.section, keywords: [p.group, ...(p.keywords ?? [])], icon: <IconFile />, hint: p.section === "Components" ? p.group : undefined, onSelect: () => nav(`#/docs/${p.slug}`) })),
    ...templates.map((t) => ({ id: `t-${t.id}`, label: t.title, group: "Templates", icon: <IconGrid />, keywords: ["template", "screen", "page"], onSelect: () => nav(`#/templates/${t.id}`) })),
    { id: "theme", label: theme === "light" ? "Switch to dark theme" : "Switch to light theme", group: "Actions", icon: theme === "light" ? <IconMoon /> : <IconSun />, keywords: ["theme", "dark", "light", "mode"], onSelect: toggle },
  ], [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const link = (slug: string, label: string) => <SidebarItem key={slug} icon={null} label={label} active={route === `#/docs/${slug}`} href={`#/docs/${slug}`} />;
  const bySection = (s: string) => pages.filter((p) => p.section === s);

  return (
    <AppShell
      sidebar={
        <Sidebar className="[&_[data-nav-item]]:pl-3">
          <SidebarBrand
            logo={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 2.5v11M3.5 9.5c1.2 2.4 2.7 4 4.5 4s3.3-1.6 4.5-4M5.5 5.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            name="Keel"
            meta="Admin design system · v0.1"
          />
          <div className="px-2 pb-1">
            <button type="button" onClick={() => setCmd(true)} className="flex h-[30px] w-full items-center gap-2 rounded-md bg-card px-2 text-small text-faint shadow-raised outline-none hover:text-soft focus-visible:shadow-focus group-data-[collapsed]/sidebar:justify-center group-data-[collapsed]/sidebar:px-0">
              <IconSearch size={14} className="shrink-0 text-icon" />
              <span className="flex-1 truncate text-left group-data-[collapsed]/sidebar:hidden">Search docs</span>
              <Kbd className="group-data-[collapsed]/sidebar:hidden">⌘K</Kbd>
            </button>
          </div>
          <SidebarContent>
            <SidebarSection title="Overview">
              <SidebarItem icon={null} label="Introduction" active={route === "#/" || route === ""} href="#/" />
              {link("getting-started", "Getting started")}
            </SidebarSection>
            <SidebarSection title="Foundations">{bySection("Foundations").map((p) => link(p.slug, p.title))}</SidebarSection>
            {componentGroups.map((g) => (
              <SidebarSection key={g} title={g}>
                {pages.filter((p) => p.section === "Components" && p.group === g).map((p) => link(p.slug, p.title))}
              </SidebarSection>
            ))}
            <SidebarSection title="Patterns">{pages.filter((p) => p.section === "Patterns" && p.group !== "Overview").map((p) => link(p.slug, p.title))}</SidebarSection>
            <SidebarSection title="Templates">
              {templates.map((t) => <SidebarItem key={t.id} icon={null} label={t.title} active={route === `#/templates/${t.id}`} href={`#/templates/${t.id}`} />)}
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={<IconPackage />} label="SKILL.md for Claude" href="#/docs/getting-started" />
          </SidebarFooter>
        </Sidebar>
      }
    >
      <Header
        start={<SidebarTrigger />}
        title={title}
        actions={
          <>
            <Button size="sm" variant="secondary" leading={<IconSearch />} trailing={<Kbd className="hidden sm:inline-flex">⌘K</Kbd>} onClick={() => setCmd(true)} className="hidden sm:inline-flex">Search</Button>
            <IconButton label="Search" size="sm" className="sm:hidden" onClick={() => setCmd(true)}><IconCommand /></IconButton>
            <Tooltip content={theme === "light" ? "Dark theme" : "Light theme"}>
              <IconButton label="Toggle theme" size="sm" variant="secondary" onClick={toggle}>{theme === "light" ? <IconMoon /> : <IconSun />}</IconButton>
            </Tooltip>
          </>
        }
      />
      <Page width="wide" className="lg:px-10">{children}</Page>
      <CommandPalette open={cmd} onOpenChange={setCmd} items={items} placeholder="Search components, tokens, patterns…" />
    </AppShell>
  );
}

function App() {
  const hash = useHash();
  const [path] = hash.split("?");
  const parts = path.replace(/^#\/?/, "").split("/");

  useEffect(() => {
    const t = parts[0] === "docs" ? pageBySlug.get(parts[1])?.title : parts[0] === "templates" ? templateById.get(parts[1])?.title : parts[0] === "t" ? templateById.get(parts[1])?.title : "Introduction";
    document.title = `${t ?? "Keel"} — Keel`;
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  if (parts[0] === "t" && parts[1]) return <TemplateRoute id={parts[1]} />;

  let body: ReactNode = <Home />;
  let title = "Introduction";
  if (parts[0] === "docs" && pageBySlug.get(parts[1])) {
    const p = pageBySlug.get(parts[1])!;
    body = <DocPageView key={p.slug} page={p} />;
    title = p.title;
  } else if (parts[0] === "templates" && templateById.get(parts[1])) {
    body = <TemplatePage id={parts[1]} />;
    title = templateById.get(parts[1])!.title;
  }
  return <DocsShell route={path} title={title}>{body}</DocsShell>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <Toaster>
        <App />
      </Toaster>
    </TooltipProvider>
  </StrictMode>,
);

