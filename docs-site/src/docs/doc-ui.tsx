import { useMemo, useState, type ReactNode } from "react";
import * as Keel from "@keel/components";
import {
  Button, CodeBlock, IconExternal, IconFile, IconCheck, IconCode, IconX, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, cn,
} from "@keel/components";
import type { DemoSpec, DocPage, Prop } from "./types";

/* Raw source of every demo file, so "Show code" shows exactly what renders. */
const sources = import.meta.glob("../demos/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** Pull one exported function's body out of a demo file. */
export function extractSource(file: string | undefined, id: string) {
  const raw = Object.entries(sources).find(([k]) => file && k.endsWith(`/${file}.tsx`))?.[1];
  if (!raw) return "";
  const start = raw.search(new RegExp(`export function ${id}\\b`));
  if (start < 0) return "";
  const rest = raw.slice(start);
  const next = rest.slice(1).search(/\n(export (function|const)|\/\* ={3,})/);
  const body = next < 0 ? rest : rest.slice(0, next + 1);
  return body.replace(/^export /, "").trim();
}

export function Demo({ spec, file }: { spec: DemoSpec; file?: string }) {
  const [open, setOpen] = useState(false);
  const code = useMemo(() => extractSource(spec.file ?? file, spec.id), [file, spec.file, spec.id]);
  const R = spec.render;
  return (
    <section id={spec.id} className="flex scroll-mt-20 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-body font-medium">{spec.title}</h3>
        {spec.description && <p className="max-w-[68ch] text-small text-subtle">{spec.description}</p>}
      </div>
      <div className="min-w-0 overflow-hidden rounded-lg shadow-card">
        <div
          className={cn("min-w-0 bg-background p-4 sm:p-6", !spec.full && "flex flex-wrap items-center gap-3")}
          style={{ minHeight: spec.minHeight }}
        >
          <R />
        </div>
        <div className="flex items-center justify-end border-t border-border bg-surface px-2 py-1">
          <Button size="xs" variant="ghost" leading={<IconCode />} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Hide code" : "Show code"}
          </Button>
        </div>
        {open && code && <CodeBlock code={code} className="rounded-none shadow-none [&_pre]:max-h-[460px]" />}
      </div>
    </section>
  );
}

/* ===== States ===== */

/** Grid of labelled states. Each cell's content is plain library usage; the label is only for the docs. */
export function StateGrid({ children, min = 160 }: { children: ReactNode; min?: number }) {
  return (
    <div className="grid w-full gap-x-6 gap-y-6" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))` }}>
      {children}
    </div>
  );
}

/** One state. `data-force` on the child (docs only) renders hover / focus / active without a pointer. */
export function State({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div data-state={label} className={cn("flex min-w-0 flex-col items-start gap-2.5", wide && "col-span-full")}>
      <span className="eyebrow">{label}</span>
      <div data-state-body className="flex w-full min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/* ===== Source ===== */

const componentSources = import.meta.glob("../../../components/**/*.{ts,tsx}", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const keelExports = new Set(Object.keys(Keel).filter((k) => /^([A-Z]|use[A-Z])/.test(k)));
const repoPath = (k: string) => k.replace(/^(\.\.\/)+/, "");

function filesFor(names: string[]) {
  const out: string[] = [];
  for (const n of names) {
    const hit = Object.entries(componentSources).find(([k, src]) => !k.endsWith("index.ts") && new RegExp(`export (function|const|type) ${n}\\b`).test(src));
    if (hit && !out.includes(hit[0])) out.push(hit[0]);
  }
  return out;
}

function depsOf(src: string, file: string) {
  const dir = file.slice(0, file.lastIndexOf("/"));
  return [...src.matchAll(/from "(\.{1,2}\/[^"]+)"/g)].map((m) => {
    const parts = (dir + "/" + m[1]).split("/");
    const res: string[] = [];
    for (const x of parts) { if (x === "..") res.pop(); else if (x !== ".") res.push(x); }
    return repoPath(res.join("/")) + (/\.tsx?$/.test(m[1]) ? "" : ".tsx");
  }).map((d) => (d.endsWith("lib/cn.tsx") ? d.replace(".tsx", ".ts") : d));
}

/** Pages whose title isn't a single component name. */
const PAGE_COMPONENTS: Record<string, string[]> = {
  "app-shell": ["AppShell", "Sidebar", "Header"],
  grid: ["Grid", "Card"],
  "date-picker": ["Calendar", "DatePicker", "DateRangePicker", "TimePicker"],
  tooltip: ["Tooltip", "Popover", "HoverCard"],
  toast: ["Toaster", "useToast"],
  "status-pages": ["StatusPage", "NotFoundPage", "ForbiddenPage", "ServerErrorPage", "OfflineState", "PermissionState"],
  charts: ["LineChart", "BarChart", "DonutChart"],
  toggle: ["Toggle", "ToggleGroup"],
  "otp-input": ["OtpInput"],
  coachmark: ["Coachmark", "ProgressDots"],
  stack: ["Stack", "Inline", "Sticky"],
};

export function SourceSection({ page }: { page: DocPage }) {
  const names = page.components ?? PAGE_COMPONENTS[page.slug] ?? [page.title.replace(/(^|\s)([a-z])/g, (_, a, b) => b.toUpperCase()).replace(/[^A-Za-z]/g, "")];
  const files = filesFor(names);
  const used = useMemo(() => {
    const code = (page.demos ?? []).map((d) => extractSource(d.file ?? page.source, d.id)).join("\n");
    return [...new Set([...code.matchAll(/<([A-Z][A-Za-z0-9]*)|\b(use[A-Z]\w*)\(/g)].map((m) => m[1] ?? m[2]).concat(names))].filter((n) => keelExports.has(n)).sort();
  }, [page, names]);
  const [open, setOpen] = useState<string | null>(null);
  if (!files.length) return null;
  const importLine = `import { ${used.join(", ")} } from "@/keel/components";`;
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle id="source">Code</SectionTitle>
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Import</span>
        <CodeBlock code={importLine} language="tsx" />
      </div>
      {files.map((f) => {
        const src = componentSources[f];
        const deps = depsOf(src, f);
        const path = repoPath(f);
        return (
          <div key={f} className="min-w-0 overflow-hidden rounded-lg shadow-card">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-surface px-3 py-2">
              <IconFile size={14} className="text-icon" />
              <span className="font-mono text-caption text-foreground">{path}</span>
              <span className="text-caption text-subtle">{src.split("\n").length} lines</span>
              <Button size="xs" variant="ghost" className="ml-auto" aria-expanded={open === f} onClick={() => setOpen((o) => (o === f ? null : f))}>
                {open === f ? "Hide source" : "Show source"}
              </Button>
            </div>
            {deps.length > 0 && (
              <p className="border-t border-border px-3 py-2 text-caption text-subtle">
                Uses <span className="font-mono text-soft">{deps.join(", ")}</span> — copy those too if you take this file on its own.
              </p>
            )}
            {open === f && <CodeBlock code={src} language="tsx" className="rounded-none shadow-none [&_pre]:max-h-[560px]" />}
          </div>
        );
      })}
    </section>
  );
}

export const FIGMA_FILE = "https://www.figma.com/design/oOZ1MBB4ycKuRKKPl4MT5q";

export function ApiTable({ props, title }: { props: Prop[]; title?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {title && <h3 className="font-mono text-small text-soft">{title}</h3>}
      <TableContainer className="rounded-lg shadow-card">
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="pl-4">Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Default</TableHead>
              <TableHead>Description</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {props.map((p) => (
              <TableRow key={p.name} className="last:[&>td]:border-b-0">
                <TableCell className="py-2.5 pl-4 align-top font-mono text-caption text-foreground">{p.name}</TableCell>
                <TableCell className="max-w-56 py-2.5 align-top font-mono text-caption whitespace-normal text-soft">{p.type}</TableCell>
                <TableCell className="hidden py-2.5 align-top font-mono text-caption text-subtle md:table-cell">{p.default ?? "—"}</TableCell>
                <TableCell className="min-w-56 py-2.5 align-top text-small whitespace-normal text-soft">{p.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="scroll-mt-20 border-b border-border pb-2 text-title font-medium">
      {children}
    </h2>
  );
}

function WhenList({ items, ok }: { items: string[]; ok: boolean }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-small text-soft">
          <span className={cn("mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full", ok ? "bg-success-bg text-success" : "bg-danger-bg text-danger")}>
            {ok ? <IconCheck size={12} /> : <IconX size={12} />}
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

export function DocPageView({ page }: { page: DocPage }) {
  const Body = page.body;
  const toc = [
    page.whenToUse && ["usage", "Usage"],
    page.demos?.length && ["examples", "Examples"],
    page.api?.length && ["api", "API"],
    page.section === "Components" && ["source", "Code"],
    page.a11y?.length && ["a11y", "Accessibility"],
    page.dos?.length && ["guidelines", "Do and don't"],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="flex gap-10">
      <article className="flex min-w-0 flex-1 flex-col gap-10 pb-24">
        <header className="flex flex-col gap-2 pt-2">
          <span className="eyebrow">{page.section === page.group ? page.section : `${page.section} · ${page.group}`}</span>
          <h1 className="text-display font-semibold">{page.title}</h1>
          <div className="max-w-[70ch] text-body text-soft">{page.summary}</div>
          {page.figma && (
            <a href={`${FIGMA_FILE}?node-id=${page.figma.replace(":", "-")}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-sm text-caption text-subtle outline-none hover:text-foreground focus-visible:shadow-focus">
              Open in Figma <IconExternal size={12} />
            </a>
          )}
        </header>

        {Body && <Body />}

        {(page.whenToUse || page.whenNot) && (
          <section className="flex flex-col gap-4">
            <SectionTitle id="usage">Usage</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2">
              {page.whenToUse && (
                <div className="flex flex-col gap-3">
                  <span className="eyebrow">When to use</span>
                  <WhenList items={page.whenToUse} ok />
                </div>
              )}
              {page.whenNot && (
                <div className="flex flex-col gap-3">
                  <span className="eyebrow">When not to use</span>
                  <WhenList items={page.whenNot} ok={false} />
                </div>
              )}
            </div>
          </section>
        )}

        {page.demos && page.demos.length > 0 && (
          <section className="flex flex-col gap-8">
            <SectionTitle id="examples">Examples</SectionTitle>
            {page.demos.map((d) => <Demo key={d.id} spec={d} file={page.source} />)}
          </section>
        )}

        {page.api && page.api.length > 0 && (
          <section className="flex flex-col gap-4">
            <SectionTitle id="api">API</SectionTitle>
            {page.api.map((a, i) => <ApiTable key={i} title={a.title} props={a.props} />)}
          </section>
        )}

        {page.section === "Components" && <SourceSection page={page} />}

        {page.a11y && (
          <section className="flex flex-col gap-4">
            <SectionTitle id="a11y">Accessibility</SectionTitle>
            <ul className="flex max-w-[72ch] list-disc flex-col gap-1.5 pl-5 text-small text-soft marker:text-faint">
              {page.a11y.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </section>
        )}

        {page.dos && (
          <section className="flex flex-col gap-4">
            <SectionTitle id="guidelines">Do and don't</SectionTitle>
            <div className="flex flex-col gap-3">
              {page.dos.map((d) => (
                <div key={d.do} className="grid overflow-hidden rounded-lg shadow-card md:grid-cols-2">
                  <div className="flex gap-2.5 border-b border-border p-3.5 md:border-r md:border-b-0">
                    <span className="mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-success-bg text-success"><IconCheck size={12} /></span>
                    <p className="text-small"><span className="font-medium text-success">Do </span><span className="text-soft">{d.do}</span></p>
                  </div>
                  <div className="flex gap-2.5 p-3.5">
                    <span className="mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger"><IconX size={12} /></span>
                    <p className="text-small"><span className="font-medium text-danger">Don't </span><span className="text-soft">{d.dont}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
      {toc.length > 1 && (
        <nav aria-label="On this page" className="sticky top-20 hidden h-fit w-44 shrink-0 flex-col gap-1 xl:flex">
          <span className="eyebrow mb-1">On this page</span>
          {toc.map(([id, label]) => (
            <a key={id} href="#" onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }} className="rounded-xs py-1 text-caption text-subtle outline-none hover:text-foreground focus-visible:shadow-focus">
              {label}
            </a>
          ))}
          {page.demos?.map((d) => (
            <a key={d.id} href="#" onClick={(e) => { e.preventDefault(); document.getElementById(d.id)?.scrollIntoView({ behavior: "smooth" }); }} className="truncate rounded-xs py-0.5 pl-3 text-caption text-faint outline-none hover:text-foreground focus-visible:shadow-focus">
              {d.title}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
