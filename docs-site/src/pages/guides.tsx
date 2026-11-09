import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button, Card, CodeBlock, IconArrowRight, Text, Tag, Kbd } from "@keel/components";
import { color, depth, font, motion, radius, tone } from "@keel/tokens/tokens.stylex";
import type { DocPage } from "../docs/types";

const g = stylex.create({
  page: { display: "flex", flexDirection: "column", gap: 32, maxWidth: 920, marginInline: "auto", width: "100%", paddingBottom: 96 },
  head: { display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 },
  h1: { fontSize: "34px", fontWeight: font.semibold, letterSpacing: "-0.03em", lineHeight: 1.1 },
  lede: { fontSize: font.xl, color: color.fgMuted, lineHeight: 1.55, maxWidth: "68ch" },
  h2: { fontSize: font.h3, fontWeight: font.semibold, letterSpacing: "-0.015em", marginBottom: 10 },
  p: { fontSize: font.lg, lineHeight: 1.65, color: color.fgSoft, maxWidth: "70ch" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: 12 },
  sw: { display: "flex", flexDirection: "column", gap: 8, padding: 10, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: depth.card },
  chip: { height: 44, borderRadius: radius.md, boxShadow: `inset 0 0 0 1px ${color.border}` },
  name: { fontFamily: font.mono, fontSize: "11.5px", color: color.fgSoft },
  depthTile: { height: 72, borderRadius: radius.lg, backgroundColor: color.surface, display: "grid", placeItems: "center", fontSize: font.sm, color: color.fgMuted },
  steps: { display: "flex", flexDirection: "column", gap: 20 },
  step: { display: "grid", gridTemplateColumns: "28px 1fr", gap: 14 },
  num: { display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: "50%", fontWeight: font.semibold, fontSize: font.sm, color: color.onInk, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink },
  ease: { height: 6, width: 40, borderRadius: 3, backgroundColor: color.accent },
  row: { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" },
});

function Guide({ eyebrow = "Get started", title, lede, children }: { eyebrow?: string; title: string; lede: string; children: ReactNode }) {
  return (
    <div {...stylex.props(g.page)}>
      <header {...stylex.props(g.head)}><Text variant="eyebrow">{eyebrow}</Text><h1 {...stylex.props(g.h1)}>{title}</h1><p {...stylex.props(g.lede)}>{lede}</p></header>
      {children}
    </div>
  );
}
const H2 = ({ children }: { children: ReactNode }) => <h2 {...stylex.props(g.h2)}>{children}</h2>;
const P = ({ children }: { children: ReactNode }) => <p {...stylex.props(g.p)}>{children}</p>;

function Install() {
  const steps: [string, ReactNode, string?][] = [
    ["Install", "Keel's runtime is React 19, Radix primitives, Lucide icons and StyleX.", "npm i react react-dom radix-ui lucide-react @stylexjs/stylex @fontsource-variable/geist @fontsource-variable/geist-mono\nnpm i -D @stylexjs/unplugin"],
    ["Copy Keel in", "Copy the components/ and tokens/ folders into your app (or add the repo as a workspace package). Keel is source you own, not a black box.", "src/keel/components/…\nsrc/keel/tokens/tokens.stylex.ts"],
    ["Add the StyleX plugin", "Put it before React in vite.config.ts so Fast Refresh keeps working.", `import stylex from "@stylexjs/unplugin";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [\n    stylex.vite({\n      useCSSLayers: false,\n      unstable_moduleResolution: { type: "commonJS", rootDir: __dirname },\n    }),\n    react(),\n  ],\n});`],
    ["Target modern browsers", "So light-dark() colors ship as-is (no polyfill). Add to package.json:", `"browserslist": ["chrome >= 123", "edge >= 123", "safari >= 17.5", "firefox >= 120"]`],
    ["Import the base CSS and wrap your app", "styles.css holds the reset and fonts; StyleX appends every component's CSS to it at build time.", `import "./keel/components/styles.css";\nimport { KeelProvider, Button } from "./keel/components";\n\ncreateRoot(root).render(\n  <KeelProvider>\n    <Button variant="primary">Hello Keel</Button>\n  </KeelProvider>,\n);`],
  ];
  return (
    <Guide title="Installation" lede="Five steps from an empty Vite app to Keel components, styled with StyleX.">
      <div {...stylex.props(g.steps)}>
        {steps.map(([t, body, code], i) => (
          <div key={t} {...stylex.props(g.step)}><span {...stylex.props(g.num)}>{i + 1}</span><div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}><Text variant="title">{t}</Text><P>{body}</P>{code && <CodeBlock code={code} language={i === 0 ? "bash" : "tsx"} />}</div></div>
        ))}
      </div>
      <section><H2>Style your own UI with Keel tokens</H2><P>Use the same tokens Keel uses, in your own StyleX styles. Pass them to any component through <code>xstyle</code>.</P>
        <CodeBlock language="tsx" code={`import * as stylex from "@stylexjs/stylex";\nimport { color, depth, radius } from "./keel/tokens/tokens.stylex";\n\nconst s = stylex.create({\n  panel: { backgroundColor: color.surface, boxShadow: depth.card, borderRadius: radius.xl, padding: 16 },\n  wide: { width: 320 },\n});\n\n<div {...stylex.props(s.panel)}>…</div>\n<Button xstyle={s.wide}>Wide button</Button>`} /></section>
    </Guide>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return <div {...stylex.props(g.sw)}><div {...stylex.props(g.chip)} style={{ background: value }} /><span {...stylex.props(g.name)}>{name}</span></div>;
}
function Colors() {
  const c = color as unknown as Record<string, string>;
  const groups: [string, string[]][] = [
    ["Surfaces", ["canvas", "surface", "surfaceRaised", "surfaceSunken", "muted", "hover", "selected", "surfaceInverse"]],
    ["Text & lines", ["fg", "fgSoft", "fgMuted", "fgFaint", "icon", "border", "borderStrong", "borderInput"]],
    ["Ink & blue", ["inkTop", "inkBottom", "accent", "accentStrong", "accentSoft", "accentBorder", "focusRing", "onAccent"]],
    ["Status", ["success", "successSoft", "warning", "warningSoft", "danger", "dangerSoft", "info", "infoSoft"]],
    ["Charts", ["chart1", "chart2", "chart3", "chart4", "chart5", "chart6"]],
  ];
  const t = tone as unknown as Record<string, string>;
  return (
    <Guide eyebrow="Foundations" title="Color" lede="Every color is written once as light-dark(light, dark). Switch theme with color-scheme on <html> — no classes, no re-render. Keel is black and white with one flat blue. Ink (black on light, white on dark) is the primary action; blue marks selection, focus, links, progress and chart series 1. Status reads by icon and word; red is only for errors. No gradients.">
      {groups.map(([gname, keys]) => <section key={gname}><H2>{gname}</H2><div {...stylex.props(g.grid)}>{keys.map((k) => <Swatch key={k} name={`color.${k}`} value={c[k]} />)}</div></section>)}
      <section><H2>Tag tones</H2><div {...stylex.props(g.grid)}>{["gray", "red", "orange", "amber", "green", "teal", "blue", "violet", "pink", "lime"].map((k) => <Swatch key={k} name={`tone.${k}Bg / Fg`} value={`linear-gradient(90deg, ${t[k + "Bg"]} 60%, ${t[k + "Fg"]} 60%)`} />)}</div></section>
    </Guide>
  );
}

function Typography() {
  const rows: [string, string][] = [["display", "36 / semibold"], ["h1", "28 / semibold"], ["h2", "22 / semibold"], ["h3", "18 / semibold"], ["title", "16 / semibold"], ["body", "14 / regular"], ["small", "13 / regular — UI default"], ["caption", "12 / regular"], ["eyebrow", "11 / medium caps"], ["mono", "Geist Mono 12"]];
  return (
    <Guide eyebrow="Foundations" title="Typography" lede="Geist for UI, Geist Mono for code and ids. A tight scale with negative tracking on headings; 13px is the working size for dense admin screens.">
      <Card padding="lg"><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{rows.map(([v, m]) => <div key={v} style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "baseline", gap: 16 }}><Text variant="mono" tone="muted">{v}</Text><Text variant={v as "body"}>{m}</Text></div>)}</div></Card>
    </Guide>
  );
}

function Depth() {
  const d = depth as unknown as Record<string, string>;
  return (
    <Guide eyebrow="Foundations" title="Depth" lede="Keel's tactile look comes from three layers on every raised thing: a 1px top highlight, a hairline ring and a soft drop. Pressed things lose the drop and gain an inner shade. Inputs are recessed — the opposite of buttons.">
      <div {...stylex.props(g.grid)}>{["raised", "pressed", "ink", "solid", "recessed", "card", "cardHover", "popover", "dialog", "focus"].map((k) => <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}><div {...stylex.props(g.depthTile)} style={{ boxShadow: d[k] }}>{k}</div><span {...stylex.props(g.name)}>depth.{k}</span></div>)}</div>
      <section><H2>Buttons use gradients, not flat fills</H2><P>Primary is a two-stop ink gradient (top lighter), secondary is white-to-off-white, and both add a hover wash layer instead of changing the base color — so the 3D read stays consistent in both themes.</P>
        <div {...stylex.props(g.row)}><Button variant="primary">Primary</Button><Button>Secondary</Button><Button variant="accent">Accent</Button><Button variant="danger">Danger</Button></div></section>
    </Guide>
  );
}

function Shape() {
  const r = radius as unknown as Record<string, string>;
  const m = motion as unknown as Record<string, string>;
  return (
    <Guide eyebrow="Foundations" title="Shape, spacing & motion" lede="A 4-point spacing grid, radii that grow with the size of the surface, and short, springy motion.">
      <section><H2>Radius</H2><div {...stylex.props(g.grid)}>{["xs", "sm", "md", "lg", "xl", "xxl", "full"].map((k) => <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={{ height: 64, borderRadius: r[k], boxShadow: "inset 0 0 0 1.5px currentColor", opacity: 0.4 }} /><span {...stylex.props(g.name)}>radius.{k}</span></div>)}</div></section>
      <section><H2>Control heights</H2><P>xs 24 · sm 28 · md 32 (default) · lg 40. Buttons, inputs, selects and segmented controls share them, so rows line up.</P></section>
      <section><H2>Spacing</H2><P>4, 8, 12, 16, 20, 24, 32, 48. Use gaps on Stack and Grid instead of margins.</P></section>
      <section><H2>Motion</H2><P>fast {m.fast} for hover and press · base {m.base} for open/close · slow {m.slow} for sheets. Ease-out for entering, a gentle spring for knobs and indicators. Everything respects reduced motion.</P></section>
    </Guide>
  );
}

function Agents() {
  return (
    <Guide eyebrow="Get started" title="AI agents & skills" lede="Keel ships instructions so Claude Code, Claude on the web, Codex and Cursor build with the right components and tokens — and never reach for Tailwind.">
      <div {...stylex.props(g.grid)} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))" }}>
        {[
          ["Claude Code", "Install the plugin from the repo (.claude-plugin) or copy skills/keel into .claude/skills. Ask: “build a customers page with Keel”."],
          ["Claude (web & desktop)", "Upload keel-skill.zip in Settings → Capabilities → Skills. Claude loads it when you ask for admin UI."],
          ["Codex", "AGENTS.md at the repo root tells Codex the stack, the components and the rules."],
          ["Cursor", ".cursor/rules/keel.mdc applies to every .tsx file in the project."],
        ].map(([t, b]) => <Card key={t}><Text variant="title">{t}</Text><Text tone="muted">{b}</Text></Card>)}
      </div>
      <section><H2>What the skill teaches</H2><P>The component catalog (every export and its main props), the token names, page patterns (list, detail, form, settings, dashboard, assistant), the do/don't rules, and a QA checklist. It's the same content as these docs, written for an agent.</P>
        <CodeBlock language="text" title="Example prompt" code={"Use the Keel skill. Build an Invoices page: DataTable with status filter,\nsearch, bulk export, a drawer for invoice details, and an empty state."} /></section>
      <div {...stylex.props(g.row)}><Tag tone="blue">llms.txt</Tag><Tag>AGENTS.md</Tag><Tag>.cursor/rules</Tag><Tag>skills/keel</Tag><Kbd>⌘K</Kbd><Text tone="muted">search the docs</Text></div>
    </Guide>
  );
}

const guide = (slug: string, title: string, group: string, description: string, render: () => ReactNode): DocPage => ({ slug, title, group, description, components: [], demos: [], render: render as DocPage["render"] });
export const guides: DocPage[] = [
  guide("installation", "Installation", "Get started", "Set up StyleX and add Keel.", Install),
  guide("ai-agents", "AI agents & skills", "Get started", "Claude Code, Claude web, Codex and Cursor.", Agents),
  guide("color", "Color", "Foundations", "Tokens and themes.", Colors),
  guide("typography", "Typography", "Foundations", "Type scale.", Typography),
  guide("depth", "Depth", "Foundations", "Shadows and the tactile look.", Depth),
  guide("shape", "Shape & motion", "Foundations", "Radius, spacing, motion.", Shape),
];
export { IconArrowRight };
