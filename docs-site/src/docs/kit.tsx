/* Docs building blocks: demo card with live code, API table, page layout. Built with Keel itself. */
import * as stylex from "@stylexjs/stylex";
import { useContext, createContext, useMemo, useState, type ReactNode } from "react";
import {
  Badge as _B, Button, CodeBlock, CopyButton, IconCheck, IconChevronDown, IconCode, IconExternal, IconX, Kbd, Outline, SegmentedControl, Tag, Text,
} from "@keel/components";
import { color, depth, font, motion, radius } from "@keel/tokens/tokens.stylex";
import api from "../generated/api.json";
import type { Demo, DocPage } from "./types";

void _B;
type ApiEntry = { file: string; description: string; props: { name: string; type: string; required: boolean; default?: string; description: string }[] };
export const API = api as Record<string, ApiEntry>;

const demoSources = import.meta.glob("../demos/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const compSources = import.meta.glob("../../../components/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** Pull one exported function's source out of a demo file. */
export function extractFn(file: string, name: string) {
  const src = demoSources[`../demos/${file}.tsx`] ?? "";
  const start = src.search(new RegExp(`export function ${name}\\b`));
  if (start < 0) return "";
  let i = src.indexOf("{", src.indexOf(")", start)); let depth0 = 0;
  for (; i < src.length; i++) { if (src[i] === "{") depth0++; else if (src[i] === "}") { depth0--; if (depth0 === 0) break; } }
  return src.slice(start, i + 1).replace(/^export /, "");
}
/** Keel components a snippet uses, for its import line. */
export function importsFor(code: string) {
  const names = new Set<string>();
  for (const m of code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) if (API[m[1]] || /^Icon[A-Z]/.test(m[1])) names.add(m[1]);
  for (const m of code.matchAll(/\b(use[A-Z][A-Za-z]+)\(/g)) if (["useToast", "useTheme", "useSidebar", "useCommandShortcut", "useField"].includes(m[1])) names.add(m[1]);
  return [...names].sort();
}
export const importLine = (names: string[]) => names.length ? `import { ${names.join(", ")} } from "@keel/components";` : "";
export const componentSource = (file: string) => compSources[`../../../components/${file}`] ?? "";

const k = stylex.create({
  page: { display: "grid", gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 1280px)": "minmax(0, 1fr) 200px" }, gap: 48, maxWidth: 1180, marginInline: "auto", width: "100%" },
  main: { display: "flex", flexDirection: "column", gap: 40, minWidth: 0, paddingBottom: 96 },
  aside: { display: { default: "none", "@media (min-width: 1280px)": "block" }, position: "sticky", top: 76, alignSelf: "start", maxHeight: "calc(100dvh - 96px)", overflowY: "auto" },
  head: { display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 },
  eyebrowRow: { display: "flex", alignItems: "center", gap: 8 },
  h1: { fontSize: "34px", fontWeight: font.semibold, letterSpacing: "-0.03em", lineHeight: 1.1 },
  lede: { fontSize: font.xl, color: color.fgMuted, lineHeight: 1.55, maxWidth: "68ch", textWrap: "pretty" },
  section: { display: "flex", flexDirection: "column", gap: 14, scrollMarginTop: 80 },
  h2: { fontSize: font.h3, fontWeight: font.semibold, letterSpacing: "-0.015em" },
  h2desc: { color: color.fgMuted, fontSize: font.lg, marginTop: -6 },
  // demo
  demo: { display: "flex", flexDirection: "column", borderRadius: radius.xxl, backgroundColor: color.surface, boxShadow: depth.card, overflow: "hidden", minWidth: 0 },
  demoBar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingInline: 14, height: 44, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  demoTitle: { fontWeight: font.semibold, fontSize: font.md, display: "inline-flex", alignItems: "baseline", gap: 8 },
  demoNo: { fontFamily: font.mono, fontSize: "11px", fontWeight: font.regular, color: color.fgFaint },
  pager: { display: "grid", gap: 12, gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 640px)": "repeat(2, minmax(0, 1fr))" }, paddingTop: 8 },
  pagerCard: { display: "flex", flexDirection: "column", gap: 2, padding: 14, borderRadius: radius.xl, cursor: "pointer", outline: "none", textAlign: "start", backgroundColor: color.surface, boxShadow: { default: `inset 0 0 0 1px ${color.border}`, ":hover": `inset 0 0 0 1px ${color.borderStrong}`, ":focus-visible": depth.focus } },
  pagerEnd: { textAlign: "end", alignItems: "flex-end", gridColumnStart: { default: "auto", "@media (min-width: 640px)": 2 } },
  pagerKicker: { fontFamily: font.mono, fontSize: "10.5px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.fgFaint },
  pagerTitle: { fontWeight: font.semibold, fontSize: font.md, color: color.fg },
  demoDesc: { paddingInline: 14, paddingTop: 10, fontSize: font.md, color: color.fgMuted },
  stage: {
    position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16, padding: { default: 20, "@media (min-width: 768px)": 32 }, minHeight: 140,
    backgroundColor: color.canvas,
    backgroundImage: `radial-gradient(${color.border} 1px, transparent 1px)`, backgroundSize: "16px 16px",
  },
  stageBlock: { display: "block" },
  bleed: { padding: 0, display: "block" },
  code: { borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: color.border },
  codeInner: { borderRadius: 0, boxShadow: "none" },
  // api
  apiTitle: { display: "flex", alignItems: "center", gap: 8, fontFamily: font.mono, fontSize: font.lg, fontWeight: font.semibold },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: font.md },
  th: { textAlign: "start", fontSize: font.sm, fontWeight: font.medium, color: color.fgMuted, paddingBlock: 8, paddingInline: 12, backgroundColor: color.surfaceSunken, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  td: { paddingBlock: 10, paddingInline: 12, verticalAlign: "top", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  pname: { fontFamily: font.mono, fontSize: "12.5px", fontWeight: font.semibold, color: color.fg, whiteSpace: "nowrap" },
  req: { color: color.danger, marginInlineStart: 2 },
  ptype: { fontFamily: font.mono, fontSize: "12px", color: color.accentStrong, overflowWrap: "anywhere" },
  pdef: { fontFamily: font.mono, fontSize: "12px", color: color.fgSoft },
  pdesc: { color: color.fgSoft, lineHeight: 1.5 },
  apiCard: { borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, overflow: "auto" },
  // dos
  rules: { display: "grid", gridTemplateColumns: { default: "1fr", "@media (min-width: 768px)": "1fr 1fr" }, gap: 12 },
  rule: { display: "flex", flexDirection: "column", gap: 8, padding: 16, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card },
  ruleHead: { display: "flex", alignItems: "center", gap: 6, fontWeight: font.semibold },
  ruleItem: { display: "flex", gap: 8, color: color.fgSoft, lineHeight: 1.5 },
  yes: { color: color.success, display: "inline-flex", marginTop: 3 }, no: { color: color.danger, display: "inline-flex", marginTop: 3 },
  srcHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  chev: { display: "inline-flex", transitionProperty: "transform", transitionDuration: motion.fast },
  chevOpen: { transform: "rotate(180deg)" },
});

export function DemoCard({ demo, index }: { demo: Demo; index?: number }) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const code = useMemo(() => extractFn(demo.file, demo.id), [demo]);
  const full = useMemo(() => { const im = importLine(importsFor(code)); return `${im ? im + "\n\n" : ""}${code}`; }, [code]);
  const C = demo.Comp;
  return (
    <section id={demo.id} {...stylex.props(k.section)}>
      <div {...stylex.props(k.demo)}>
        <div {...stylex.props(k.demoBar)}>
          <span {...stylex.props(k.demoTitle)}>{index !== undefined && <span {...stylex.props(k.demoNo)}>{String(index + 1).padStart(2, "0")}</span>}{demo.title}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <SegmentedControl size="sm" value={view} onValueChange={(v) => setView(v as "preview" | "code")} label={`${demo.title} view`}
              items={[{ value: "preview", label: "Preview" }, { value: "code", label: "Code", icon: <IconCode /> }]} />
            <CopyButton value={full} label="Copy code" />
          </span>
        </div>
        {demo.description && <p {...stylex.props(k.demoDesc)}>{demo.description}</p>}
        {view === "preview"
          ? <div {...stylex.props(k.stage, demo.bleed && k.bleed)} style={demo.height ? { height: demo.height, minHeight: demo.height } : undefined}><C /></div>
          : <div {...stylex.props(k.code)}><CodeBlock code={full} language="tsx" lineNumbers copy={false} xstyle={k.codeInner} maxHeight={560} /></div>}
      </div>
    </section>
  );
}

export function ApiTable({ name }: { name: string }) {
  const e = API[name];
  if (!e) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div {...stylex.props(k.apiTitle)}>&lt;{name}&gt;<Tag size="sm" tone="gray">{e.file}</Tag></div>
      {e.description && <p style={{ margin: 0 }}><Text as="span" tone="soft">{e.description}</Text></p>}
      {e.props.length > 0 ? (
        <div {...stylex.props(k.apiCard)}>
          <table {...stylex.props(k.table)}>
            <thead><tr><th {...stylex.props(k.th)}>Prop</th><th {...stylex.props(k.th)}>Type</th><th {...stylex.props(k.th)}>Default</th><th {...stylex.props(k.th)}>Description</th></tr></thead>
            <tbody>
              {e.props.map((p) => (
                <tr key={p.name}>
                  <td {...stylex.props(k.td)}><span {...stylex.props(k.pname)}>{p.name}</span>{p.required && <span {...stylex.props(k.req)}>*</span>}</td>
                  <td {...stylex.props(k.td)}><span {...stylex.props(k.ptype)}>{p.type}</span></td>
                  <td {...stylex.props(k.td)}><span {...stylex.props(k.pdef)}>{p.default ?? "—"}</span></td>
                  <td {...stylex.props(k.td)}><span {...stylex.props(k.pdesc)}>{p.description || (p.name === "xstyle" ? "StyleX overrides, applied last." : p.name === "children" ? "Content." : "")}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Text tone="muted">No props.</Text>}
    </div>
  );
}

function SourceBlock({ file }: { file: string }) {
  const [open, setOpen] = useState(false);
  const src = componentSource(file);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div {...stylex.props(k.srcHead)}>
        <Text weight="medium">components/{file}</Text>
        <Button size="sm" variant="ghost" trailing={<span {...stylex.props(k.chev, open && k.chevOpen)}><IconChevronDown /></span>} onClick={() => setOpen((v) => !v)}>{open ? "Hide source" : "Show source"}</Button>
      </div>
      {open && <CodeBlock code={src} language="tsx" title={`components/${file}`} lineNumbers maxHeight={600} />}
    </div>
  );
}

export function DocPageView({ page, prev, next, go }: { page: DocPage; prev?: DocPage; next?: DocPage; go?: (to: string) => void }) {
  if (page.render) { const R = page.render; return <R />; }
  const files = [...new Set(page.components.map((c) => API[c]?.file).filter(Boolean))] as string[];
  const outline = [
    ...page.demos.map((d) => ({ id: d.id, label: d.title })),
    ...(page.dos || page.donts ? [{ id: "usage", label: "Usage" }] : []),
    { id: "api", label: "API" }, { id: "code", label: "Code" },
  ];
  return (
    <div {...stylex.props(k.page)}>
      <div {...stylex.props(k.main)}>
        <header {...stylex.props(k.head)}>
          <div {...stylex.props(k.eyebrowRow)}><Text variant="eyebrow">{page.group}</Text>{page.badge && <Tag size="sm" tone="blue" shape="pill">{page.badge}</Tag>}</div>
          <h1 {...stylex.props(k.h1)}>{page.title}</h1>
          <p {...stylex.props(k.lede)}>{page.description}</p>
          <CodeBlock code={importLine(page.components.filter((c) => API[c]))} language="tsx" />
        </header>
        {page.demos.map((d, i) => <DemoCard key={d.id} demo={d} index={page.demos.length > 1 ? i : undefined} />)}
        {(page.dos || page.donts) && (
          <section id="usage" {...stylex.props(k.section)}>
            <h2 {...stylex.props(k.h2)}>Usage</h2>
            <div {...stylex.props(k.rules)}>
              {page.dos && <div {...stylex.props(k.rule)}><span {...stylex.props(k.ruleHead)}><span {...stylex.props(k.yes)}><IconCheck size={16} /></span>Do</span>{page.dos.map((t) => <span key={t} {...stylex.props(k.ruleItem)}><span {...stylex.props(k.yes)}><IconCheck size={12} /></span>{t}</span>)}</div>}
              {page.donts && <div {...stylex.props(k.rule)}><span {...stylex.props(k.ruleHead)}><span {...stylex.props(k.no)}><IconX size={16} /></span>Don't</span>{page.donts.map((t) => <span key={t} {...stylex.props(k.ruleItem)}><span {...stylex.props(k.no)}><IconX size={12} /></span>{t}</span>)}</div>}
            </div>
          </section>
        )}
        <section id="api" {...stylex.props(k.section)}>
          <h2 {...stylex.props(k.h2)}>API</h2>
          <p {...stylex.props(k.h2desc)}>Generated from the TypeScript source. Every component also takes <code>xstyle</code> (StyleX), <code>className</code> and <code>style</code>.</p>
          {page.components.map((c) => <ApiTable key={c} name={c} />)}
        </section>
        <section id="code" {...stylex.props(k.section)}>
          <h2 {...stylex.props(k.h2)}>Code</h2>
          <p {...stylex.props(k.h2desc)}>The full component source — copy it into your project or read how it's built.</p>
          {files.map((f) => <SourceBlock key={f} file={f} />)}
        </section>
        {(prev || next) && (
          <nav aria-label="More pages" {...stylex.props(k.pager)}>
            {prev && <button type="button" onClick={() => go?.(`#/docs/${prev.slug}`)} {...stylex.props(k.pagerCard)}><span {...stylex.props(k.pagerKicker)}>Previous</span><span {...stylex.props(k.pagerTitle)}>{prev.title}</span></button>}
            {next && <button type="button" onClick={() => go?.(`#/docs/${next.slug}`)} {...stylex.props(k.pagerCard, k.pagerEnd)}><span {...stylex.props(k.pagerKicker)}>Next</span><span {...stylex.props(k.pagerTitle)}>{next.title}</span></button>}
          </nav>
        )}
      </div>
      <aside {...stylex.props(k.aside)}><Outline items={outline} /></aside>
    </div>
  );
}

/** Wraps several examples in one demo. */
/** True inside overview preview cards — demos use it to avoid opening portaled overlays there. */
export const InPreview = createContext(false);
export const useInPreview = () => useContext(InPreview);

export function Row({ children, gap = 12, wrap = true, align = "center", col }: { children: ReactNode; gap?: number; wrap?: boolean; align?: string; col?: boolean }) {
  return <div style={{ display: "flex", flexDirection: col ? "column" : "row", flexWrap: wrap ? "wrap" : "nowrap", alignItems: col ? "stretch" : align, gap, width: col ? "100%" : undefined, maxWidth: "100%" }}>{children}</div>;
}
/** A labelled cell for state grids. */
export function State({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div data-state={label} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, gridColumn: wide ? "1 / -1" : undefined }}>
      <span style={{ fontSize: 11, fontWeight: 520, letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.6 }}>{label}</span>
      <div data-state-body style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, minWidth: 0 }}>{children}</div>
    </div>
  );
}
export function StateGrid({ children, min = 180 }: { children: ReactNode; min?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`, gap: 24, width: "100%" }}>{children}</div>;
}
export { Kbd, IconExternal };
