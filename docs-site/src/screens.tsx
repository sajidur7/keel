import * as stylex from "@stylexjs/stylex";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, IconArrowRight, IconExternal, SearchInput, SegmentedControl, Tag, Text } from "@keel/components";
import { screenCategories, screens, type Screen } from "@keel/templates/screens";
import { color, depth, font, motion, radius } from "@keel/tokens/tokens.stylex";

type Go = (to: string) => void;

const s = stylex.create({
  page: { display: "flex", flexDirection: "column", gap: 28, maxWidth: 1320, marginInline: "auto", width: "100%", paddingBottom: 96 },
  head: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 720 },
  eyebrow: { fontFamily: font.mono, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: color.fgMuted },
  h1: { fontSize: { default: "30px", "@media (min-width: 768px)": "38px" }, lineHeight: 1.1, fontWeight: font.semibold, letterSpacing: "-0.035em" },
  bar: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", position: "sticky", top: 52, zIndex: 5, paddingBlock: 10, backgroundColor: `color-mix(in srgb, ${color.surface} 92%, transparent)`, backdropFilter: "blur(8px)" },
  chips: { display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", flex: 1, minWidth: 0, padding: 4, margin: -4 },
  chip: {
    display: "inline-flex", alignItems: "center", gap: 6, height: 28, paddingInline: 10, borderRadius: radius.full, fontSize: font.sm, fontWeight: font.medium, whiteSpace: "nowrap",
    cursor: "pointer", outline: "none", color: color.fgSoft, backgroundColor: color.surface, boxShadow: { default: `inset 0 0 0 1px ${color.border}`, ":hover": `inset 0 0 0 1px ${color.borderStrong}` },
    ":focus-visible": { boxShadow: depth.focus },
  },
  chipOn: { color: color.onInk, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: { default: depth.ink, ":hover": depth.ink } },
  count: { fontSize: font.xs, opacity: 0.7, fontVariantNumeric: "tabular-nums" },
  section: { display: "flex", flexDirection: "column", gap: 12, scrollMarginTop: 120 },
  secHead: { display: "flex", alignItems: "baseline", gap: 10 },
  h2: { fontSize: font.h3, fontWeight: font.semibold, letterSpacing: "-0.01em" },
  grid: { display: "grid", gap: 16, gridTemplateColumns: { default: "minmax(0, 1fr)", "@media (min-width: 700px)": "repeat(2, minmax(0, 1fr))", "@media (min-width: 1180px)": "repeat(3, minmax(0, 1fr))" } },
  card: {
    display: "flex", flexDirection: "column", gap: 0, padding: 4, borderRadius: radius.xxl, backgroundColor: color.surfaceSunken, cursor: "pointer", outline: "none", textAlign: "start",
    boxShadow: { default: `inset 0 0 0 1px ${color.border}`, ":hover": `inset 0 0 0 1px ${color.borderStrong}` }, ":focus-visible": { boxShadow: depth.focus },
    transitionProperty: "box-shadow, transform", transitionDuration: motion.base, transform: { default: null, ":hover": "translateY(-1px)" },
  },
  thumb: { position: "relative", aspectRatio: "16 / 10", borderRadius: radius.xl, overflow: "hidden", backgroundColor: color.canvas, boxShadow: depth.card },
  frame: { position: "absolute", top: 0, left: 0, width: 1440, height: 900, border: 0, transformOrigin: "0 0", pointerEvents: "none" },
  meta: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingInline: 10, paddingTop: 10, paddingBottom: 6 },
  title: { fontSize: font.md, fontWeight: font.semibold },
  id: { fontFamily: font.mono, fontSize: "11px", color: color.fgFaint },
});

function Thumb({ sc }: { sc: Screen }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(el);
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1440)); ro.observe(el);
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);
  return (
    <div ref={ref} {...stylex.props(s.thumb)}>
      {show && <iframe title={sc.title} tabIndex={-1} aria-hidden src={`${location.pathname}#/s/${sc.id}?thumb`} loading="lazy" {...stylex.props(s.frame)} style={{ transform: `scale(${scale})` }} />}
    </div>
  );
}

export function ScreensPage({ go }: { go: Go }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => screens.filter((x) => (cat === "All" || x.category === cat) && (!q || `${x.title} ${x.category}`.toLowerCase().includes(q.toLowerCase()))), [cat, q]);
  const cats = screenCategories.filter((c) => list.some((x) => x.category === c));
  return (
    <div {...stylex.props(s.page)}>
      <header {...stylex.props(s.head)}>
        <span {...stylex.props(s.eyebrow)}>Screens · {screens.length}</span>
        <h1 {...stylex.props(s.h1)}>{screens.length} SaaS screens, built only from Keel</h1>
        <Text tone="muted">Dashboards, lists, records, settings, billing, onboarding, auth, AI and system pages for one product, Northwind. Every one is responsive and copy-ready. Open a screen to use it at full size.</Text>
      </header>
      <div {...stylex.props(s.bar)}>
        <div {...stylex.props(s.chips)} role="tablist" aria-label="Categories">
          {["All", ...screenCategories].map((c) => (
            <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)} {...stylex.props(s.chip, cat === c && s.chipOn)}>
              {c}<span {...stylex.props(s.count)}>{c === "All" ? screens.length : screens.filter((x) => x.category === c).length}</span>
            </button>
          ))}
        </div>
        <SearchInput size="sm" placeholder="Search screens" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
      </div>
      {cats.map((c) => (
        <section key={c} {...stylex.props(s.section)}>
          <div {...stylex.props(s.secHead)}><h2 {...stylex.props(s.h2)}>{c}</h2><Tag size="sm">{list.filter((x) => x.category === c).length}</Tag></div>
          <div {...stylex.props(s.grid)}>
            {list.filter((x) => x.category === c).map((sc) => (
              <button key={sc.id} type="button" onClick={() => go(`#/s/${sc.id}`)} {...stylex.props(s.card)} aria-label={`Open ${sc.title}`}>
                <Thumb sc={sc} />
                <span {...stylex.props(s.meta)}><span {...stylex.props(s.title)}>{sc.title}</span><span {...stylex.props(s.id)}>{sc.id}</span></span>
              </button>
            ))}
          </div>
        </section>
      ))}
      {!cats.length && <Text tone="muted">No screens match “{q}”.</Text>}
      <div style={{ display: "flex", gap: 8 }}><Button onClick={() => go("#/templates")} trailing={<IconArrowRight />}>Annotated templates</Button></div>
      <span hidden><IconExternal /><SegmentedControl items={[]} /></span>
    </div>
  );
}
