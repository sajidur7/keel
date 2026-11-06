import { useMemo, useState } from "react";
import tokens from "@keel/tokens/tokens.json";
import { Button, CodeBlock, Input, IconSearch, Tag, Tooltip, icons, cn, IconCheck } from "@keel/components";
import type { DocPage } from "../docs/types";
import { SectionTitle } from "../docs/doc-ui";

type ColorKey = keyof typeof tokens.color.dark;

function Swatch({ name, cssVar, dark, light }: { name: string; cssVar: string; dark: string; light: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(`var(${cssVar})`); setCopied(true); setTimeout(() => setCopied(false), 1000); }}
      className="group flex min-w-0 flex-col gap-2 rounded-md p-1 text-left outline-none hover:bg-hover focus-visible:shadow-focus"
    >
      <span className="relative h-12 w-full rounded-md shadow-[inset_0_0_0_1px_var(--border)]" style={{ background: `var(${cssVar})` }}>
        {copied && <span className="absolute inset-0 flex items-center justify-center text-caption mix-blend-difference text-white"><IconCheck size={14} /></span>}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 px-0.5">
        <span className="truncate text-caption font-medium text-foreground">{name}</span>
        <span className="truncate font-mono text-[11px] text-subtle">{dark}</span>
        <span className="truncate font-mono text-[11px] text-faint">{light}</span>
      </span>
    </button>
  );
}

const colorGroups: { title: string; note: string; keys: ColorKey[] }[] = [
  { title: "Surfaces", note: "Page → sidebar/toolbar zones → cards and controls → overlays. Each step is a small lightness change, so depth reads without shadows.", keys: ["background", "surface", "card", "popover", "muted", "hover", "selected"] },
  { title: "Lines", note: "Hairlines separate; strong lines outline inputs and empty dropzones.", keys: ["border", "input", "line-strong"] },
  { title: "Text", note: "Four greys carry the hierarchy. Most screens use foreground, soft and subtle.", keys: ["foreground", "soft", "subtle", "faint", "icon"] },
  { title: "Primary", note: "White in dark mode, near-black in light mode. The only bright fill in the UI.", keys: ["primary", "primary-hover", "primary-foreground", "ring"] },
  { title: "Data", note: "One hue for measured data: live dots, chart series, filled progress.", keys: ["data", "data-muted", "track"] },
  { title: "Status", note: "Only for state that needs attention. Each has a tint and border for alerts.", keys: ["success", "warning", "danger", "info", "danger-solid", "success-bg", "warning-bg", "danger-bg", "info-bg"] },
];

export function ColorsBody() {
  return (
    <div className="flex flex-col gap-10">
      <p className="max-w-[70ch] text-small text-subtle">Click a swatch to copy its CSS variable. Each shows the dark value, then the light value. In Tailwind, use the token name directly: <code className="font-mono text-soft">bg-card</code>, <code className="font-mono text-soft">text-subtle</code>, <code className="font-mono text-soft">border-line-strong</code>. Tailwind's default palette is switched off so no stray <code className="font-mono text-soft">blue-500</code> can appear.</p>
      {colorGroups.map((g) => (
        <section key={g.title} className="flex flex-col gap-3">
          <SectionTitle>{g.title}</SectionTitle>
          <p className="max-w-[70ch] text-small text-subtle">{g.note}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
            {g.keys.map((k) => <Swatch key={k} name={k} cssVar={`--${k}`} dark={tokens.color.dark[k]} light={tokens.color.light[k]} />)}
          </div>
        </section>
      ))}
      <section className="flex flex-col gap-3">
        <SectionTitle>Tag tones</SectionTitle>
        <p className="max-w-[70ch] text-small text-subtle">Ten category tones, each a bg / border / text triplet. Assign each tone one meaning per product.</p>
        <div className="grid gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-2">
          {(Object.keys(tokens.tag.dark) as (keyof typeof tokens.tag.dark)[]).map((t) => (
            <div key={t} className="flex items-center justify-between gap-3 bg-background px-3 py-2.5">
              <Tag tone={t}>{t}</Tag>
              <span className="truncate font-mono text-[11px] text-subtle">{tokens.tag.dark[t].bg} · {tokens.tag.dark[t].border} · {tokens.tag.dark[t].text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function TypographyBody() {
  const scale = [
    ["stat", "28 / 1.0 / 500 / −0.02em", "$102,750"],
    ["display", "22 / 1.2 / 600 / −0.01em", "Customers"],
    ["page", "18 / 1.2 / 600 / −0.01em", "Billing settings"],
    ["title", "16 / 1.2 / 500", "Payment methods"],
    ["body", "14 / 1.35 / 400", "Invoices are sent on the first business day."],
    ["small", "13 / 1.35 / 400", "Buttons, inputs, menus, table cells"],
    ["caption", "12 / 1.35 / 400", "Table headers, metadata, help text"],
    ["eyebrow", "11 / 1.0 / 500 / 0.08em / uppercase", "Section label"],
  ] as const;
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <SectionTitle>Families</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg p-4 shadow-card"><span className="eyebrow">Sans · Geist</span><span className="text-display font-semibold">Aa Bb 0123456789</span><span className="text-caption text-subtle">Interface text. Tabular figures on for numbers via the `tabular` utility.</span></div>
          <div className="flex flex-col gap-2 rounded-lg p-4 shadow-card"><span className="eyebrow">Mono · Geist Mono</span><span className="font-mono text-display">INV-2061 cus_01</span><span className="text-caption text-subtle">IDs, keys, codes and payloads.</span></div>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Scale</SectionTitle>
        <div className="flex flex-col">
          {scale.map(([k, spec, sample]) => (
            <div key={k} className="grid grid-cols-1 items-baseline gap-1 border-b border-border py-3 sm:grid-cols-[120px_220px_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-caption text-soft">text-{k}</span>
              <span className="font-mono text-caption text-faint">{spec}</span>
              <span className={cn("truncate", k === "eyebrow" ? "eyebrow" : `text-${k}`, k === "stat" && "tabular font-medium", (k === "display" || k === "page") && "font-semibold", k === "title" && "font-medium")}>{sample}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Rules</SectionTitle>
        <ul className="flex max-w-[72ch] list-disc flex-col gap-1.5 pl-5 text-small text-soft marker:text-faint">
          <li>Three weights only: 400, 500, 600. Semibold is for page titles and display; medium for titles, labels, active nav.</li>
          <li>Body copy in admin screens is 13–14px. Don't go below 11px (eyebrow) anywhere.</li>
          <li>Numbers in tables, stats and pagination always use tabular figures and right alignment.</li>
          <li>Sentence case for everything: titles, buttons, menu items, tabs.</li>
        </ul>
      </section>
    </div>
  );
}

export function SpacingBody() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <SectionTitle>Spacing scale</SectionTitle>
        <p className="max-w-[70ch] text-small text-subtle">A 4px base, used through Tailwind's spacing utilities (p-3 = 12px). The common rhythm: 8px inside controls, 12px between related items, 16–24px between groups, 32–48px between page sections.</p>
        <div className="flex flex-col">
          {Object.entries(tokens.space).filter(([k]) => k !== "0").map(([k, v]) => (
            <div key={k} className="grid grid-cols-[56px_56px_minmax(0,1fr)] items-center gap-4 border-b border-border py-2">
              <span className="font-mono text-caption text-soft">{k}</span>
              <span className="font-mono text-caption text-faint">{v}</span>
              <span className="h-2.5 rounded-xs bg-data" style={{ width: v }} />
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-2">
          {Object.entries(tokens.size).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between bg-background px-3 py-2.5"><span className="font-mono text-caption text-soft">--size-{k}</span><span className="font-mono text-caption text-subtle">{v}</span></div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Breakpoints and z-index</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            {Object.entries(tokens.breakpoint).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border py-2 text-caption"><span className="font-mono text-soft">{k}</span><span className="font-mono text-subtle">{v}</span><span className="text-faint">{{ xs: "Smallest supported", sm: "Large phones", md: "Tablets — forms go horizontal", lg: "Sidebar docks", xl: "Wide tables", "2xl": "Large desktop" }[k]}</span></div>
            ))}
          </div>
          <div className="flex flex-col">
            {Object.entries(tokens.z).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border py-2 text-caption"><span className="font-mono text-soft">--z-{k}</span><span className="font-mono text-subtle">{v}</span></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function RadiusBody() {
  const use: Record<string, string> = { xs: "Kbd, inline code", sm: "Menu items, checkboxes", md: "Buttons, inputs, nav items", lg: "Cards, menus, tables", xl: "Dialogs, sheets, command palette", full: "Tags, pills, avatars, badges" };
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {Object.entries(tokens.radius).map(([k, v]) => (
        <div key={k} className="flex flex-col gap-2">
          <span className="h-16 bg-card shadow-raised" style={{ borderRadius: v }} />
          <span className="font-mono text-caption text-soft">rounded-{k} · {v}</span>
          <span className="text-caption text-subtle">{use[k]}</span>
        </div>
      ))}
    </div>
  );
}

export function ElevationBody() {
  const shadows = [
    ["raised", "Secondary buttons, active nav, kbd, segmented thumb — a 1px top highlight + ring."],
    ["raised-primary", "Primary and danger buttons."],
    ["field", "Inputs and selects at rest."],
    ["card", "Cards, tables, code blocks — a ring, no drop shadow."],
    ["overlay", "Menus, popovers, dialogs, sheets, toasts."],
    ["focus", "Focus-visible ring on every interactive element."],
  ] as const;
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-[70ch] text-small text-subtle">Keel uses almost no drop shadows. In-flow elements are separated by surface steps and 1px rings; only floating layers get a real shadow. At most two floating layers are on screen at once.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shadows.map(([k, d]) => (
          <div key={k} className="flex flex-col gap-3">
            <span className="flex h-24 items-center justify-center rounded-lg bg-card" style={{ boxShadow: `var(--elevation-${k})` }}><span className="font-mono text-caption text-soft">shadow-{k}</span></span>
            <span className="text-caption text-subtle">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MotionBody() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <SectionTitle>Durations and easing</SectionTitle>
        <div className="grid gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-2">
          {Object.entries(tokens.motion.duration).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between bg-background px-3 py-2.5 text-caption"><span className="font-mono text-soft">--duration-{k}</span><span className="font-mono text-subtle">{v}</span><span className="text-faint">{{ instant: "Menu close", fast: "Hover, press, color", base: "Popovers, dialogs, switches", slow: "Sheets, progress, chart transitions" }[k]}</span></div>
          ))}
          {Object.entries(tokens.motion.ease).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between bg-background px-3 py-2.5 text-caption"><span className="font-mono text-soft">ease-{k}</span><span className="font-mono text-subtle">{v}</span></div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Try it</SectionTitle>
        <div className="flex flex-col gap-3">
          <Button className="self-start" onClick={() => setOn((o) => !o)}>Animate</Button>
          {(["fast", "base", "slow"] as const).map((d) => (
            <div key={d} className="flex items-center gap-3">
              <span className="w-12 font-mono text-caption text-subtle">{d}</span>
              <div className="relative h-6 flex-1 rounded-sm bg-surface">
                <span className="absolute top-1 left-1 size-4 rounded-xs bg-foreground transition-[left] ease-out" style={{ left: on ? "calc(100% - 20px)" : 4, transitionDuration: `var(--duration-${d})` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Reduced motion</SectionTitle>
        <p className="max-w-[70ch] text-small text-subtle">When the OS asks for reduced motion, every Keel duration becomes 0ms and animations run once instantly. Spinners and pulsing dots stop. Nothing important is ever communicated only through motion.</p>
        <CodeBlock code={`@media (prefers-reduced-motion: reduce) {\n  :root { --duration-fast: 0ms; --duration-base: 0ms; --duration-slow: 0ms; }\n}`} />
      </section>
    </div>
  );
}

export function IconsBody() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const list = useMemo(() => Object.entries(icons).filter(([n]) => n.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[70ch] text-small text-subtle">Keel uses <a className="text-foreground underline decoration-line-strong underline-offset-2" href="https://lucide.dev" target="_blank" rel="noreferrer">Lucide</a>. These {Object.keys(icons).length} are wrapped with Keel names and defaults — 16px, 1.5px absolute stroke, decorative unless labelled. Any other Lucide icon works through <code className="font-mono text-soft">keelIcon(LucideIcon)</code>. Click to copy the import.</p>
      <Input leading={<IconSearch />} placeholder="Search icons" value={q} onChange={(e) => setQ(e.target.value)} clearable onClear={() => setQ("")} shellClassName="max-w-xs" />
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {list.map(([name, I]) => (
          <Tooltip key={name} content={copied === name ? "Copied" : name}>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(`import { ${name} } from "@keel/components";`); setCopied(name); setTimeout(() => setCopied(null), 1000); }}
              className="flex h-20 min-w-0 flex-col items-center justify-center gap-2 rounded-md text-soft outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus"
            >
              <I />
              <span className="w-full truncate px-1 text-center text-[11px] text-subtle">{name.replace(/^Icon/, "")}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export const foundations: DocPage[] = [
  { slug: "colors", title: "Color", group: "Foundations", section: "Foundations", summary: "A neutral graphite ladder does nearly all the work. Color is reserved for status, category tags and one data hue — so when something is colored, it means something.", body: ColorsBody, keywords: ["palette", "tokens", "dark mode", "light mode"] },
  { slug: "typography-tokens", title: "Typography", group: "Foundations", section: "Foundations", summary: "Geist and Geist Mono on a short scale. Hierarchy comes from size, weight and text grey.", body: TypographyBody, keywords: ["font", "type scale"] },
  { slug: "spacing", title: "Spacing & layout", group: "Foundations", section: "Foundations", summary: "4px base spacing, fixed component sizes, breakpoints and z-index layers.", body: SpacingBody, keywords: ["grid", "breakpoints", "z-index", "sizes"] },
  { slug: "radius", title: "Radius", group: "Foundations", section: "Foundations", summary: "Small, consistent corners. Controls are 8px rectangles; only labels (tags, pills, badges) are fully round — shape tells a control from a label.", body: RadiusBody },
  { slug: "elevation", title: "Elevation", group: "Foundations", section: "Foundations", summary: "Rings and surface steps instead of shadows. Real shadows only for floating layers.", body: ElevationBody, keywords: ["shadow"] },
  { slug: "motion", title: "Motion", group: "Foundations", section: "Foundations", summary: "Short, quiet transitions with one easing family. Enter with ease-out, exit faster with ease-in.", body: MotionBody, keywords: ["animation", "easing", "reduced motion"] },
  { slug: "icons", title: "Icons", group: "Foundations", section: "Foundations", summary: "Lucide icons at Keel's sizes: 16px by default, 14px in small controls, 1.5px stroke at every size.", body: IconsBody, keywords: ["lucide", "svg"] },
];
