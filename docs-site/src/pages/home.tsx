import * as stylex from "@stylexjs/stylex";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Button, IconArrowRight, Kbd, SearchInput, Text } from "@keel/components";
import { screens } from "@keel/templates/screens";
import { color, depth, font, motion, radius } from "@keel/tokens/tokens.stylex";
import type { DocPage } from "../docs/types";
import { InPreview } from "../docs/kit";
import { KeelLogo } from "../logo";
import { componentGroups, componentPages } from "../registry";

/* The overview, Astryx-style: a short intro, then every component as a live preview card, grouped by category. */
const h = stylex.create({
  page: { display: "flex", flexDirection: "column", gap: 44, maxWidth: 1240, marginInline: "auto", width: "100%", paddingBottom: 96 },
  intro: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 720, paddingTop: 12 },
  brand: { color: color.fg, marginBottom: 4 },
  eyebrow: { fontFamily: font.mono, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: color.fgMuted },
  h1: { fontSize: { default: "32px", "@media (min-width: 768px)": "44px" }, lineHeight: 1.05, fontWeight: font.semibold, letterSpacing: "-0.04em", textWrap: "balance" },
  lede: { fontSize: font.xl, color: color.fgMuted, lineHeight: 1.55 },
  ctas: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" },
  facts: { display: "flex", flexWrap: "wrap", gap: 18, fontSize: font.sm, color: color.fgMuted },
  fact: { display: "inline-flex", gap: 6, alignItems: "baseline" },
  factN: { color: color.fg, fontWeight: font.semibold, fontVariantNumeric: "tabular-nums" },
  section: { display: "flex", flexDirection: "column", gap: 14, scrollMarginTop: 72 },
  secHead: { display: "flex", alignItems: "baseline", gap: 10 },
  h2: { fontSize: font.h3, fontWeight: font.semibold, letterSpacing: "-0.01em" },
  count: { fontFamily: font.mono, fontSize: "11px", color: color.fgFaint },
  grid: { display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))" },
  card: {
    display: "flex", flexDirection: "column", padding: 4, borderRadius: radius.xxl, backgroundColor: color.surfaceSunken, cursor: "pointer", outline: "none", textAlign: "start", width: "100%",
    boxShadow: { default: `inset 0 0 0 1px ${color.border}`, ":hover": `inset 0 0 0 1px ${color.borderStrong}` }, ":focus-visible": { boxShadow: depth.focus },
    transitionProperty: "box-shadow, transform", transitionDuration: motion.base, transform: { default: null, ":hover": "translateY(-1px)" },
  },
  preview: {
    position: "relative", height: 176, borderRadius: radius.xl, overflow: "hidden", backgroundColor: color.surface, boxShadow: depth.card,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  stage: { pointerEvents: "none", userSelect: "none", padding: 16, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "none" },
  name: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingInline: 10, paddingTop: 10, paddingBottom: 6 },
  title: { fontSize: font.md, fontWeight: font.semibold },
  badge: { fontFamily: font.mono, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.accent },
});

class Boundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? null : this.props.children; }
}

function Preview({ page }: { page: DocPage }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [fit, setFit] = useState<{ z: number; x: number; y: number } | null>(null);
  const demo = page.demos[page.previewDemo ?? 0];
  const Comp = demo?.Comp;
  const W = demo?.bleed || demo?.height ? 1100 : 600;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin: "400px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!show) return;
    // Measure the union of what the demo actually drew, then scale and centre that box in the card.
    const id = setTimeout(() => {
      const box = ref.current, st = stage.current; if (!box || !st) return;
      const o = st.getBoundingClientRect(); let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
      st.querySelectorAll("*").forEach((n) => { const q = (n as HTMLElement).getBoundingClientRect(); if (q.width < 2 || q.height < 2 || q.width > W + 40) return; l = Math.min(l, q.left - o.left); t = Math.min(t, q.top - o.top); r = Math.max(r, q.right - o.left); b = Math.max(b, q.bottom - o.top); });
      if (!isFinite(l)) { setFit({ z: 0.5, x: 0, y: 0 }); return; }
      const bw = box.clientWidth - 28, bh = box.clientHeight - 28; const cw = r - l, ch = b - t;
      const z = Math.min(1.1, bw / cw, bh / ch);
      setFit({ z, x: -(l + cw / 2), y: -(t + ch / 2) });
    }, 120);
    return () => clearTimeout(id);
  }, [show, W]);
  return (
    <div ref={ref} {...stylex.props(h.preview)} aria-hidden>
      {show && Comp && (
        <div style={{ position: "absolute", left: "50%", top: "50%", transformOrigin: "0 0", transform: fit ? `scale(${fit.z}) translate(${fit.x}px, ${fit.y}px)` : undefined, opacity: fit ? 1 : 0, transition: "opacity 160ms" }}>
          <div ref={stage} inert {...stylex.props(h.stage)} style={{ width: W, padding: 0 }}><Boundary><InPreview.Provider value><Comp /></InPreview.Provider></Boundary></div>
        </div>
      )}
    </div>
  );
}

export function Home({ go }: { go: (to: string) => void }) {
  const [q, setQ] = useState("");
  const match = (p: DocPage) => !q || `${p.title} ${p.components.join(" ")}`.toLowerCase().includes(q.toLowerCase());
  const fresh = componentPages.filter((p) => p.badge === "New").length;
  return (
    <div {...stylex.props(h.page)}>
      <section {...stylex.props(h.intro)}>
        <span {...stylex.props(h.brand)}><KeelLogo size={28} title="Keel" /></span>
        <span {...stylex.props(h.eyebrow)}>Keel v2 · StyleX · React 19</span>
        <h1 {...stylex.props(h.h1)}>Browse the library</h1>
        <p {...stylex.props(h.lede)}>Every component, with copy-ready examples for each variant, state and pattern — plus {screens.length} full SaaS screens built only from them.</p>
        <div {...stylex.props(h.ctas)}>
          <Button variant="primary" trailing={<IconArrowRight />} onClick={() => go("#/docs/installation")}>Install</Button>
          <Button onClick={() => go("#/screens")}>Browse {screens.length} screens</Button>
          <Text variant="caption">or press <Kbd>⌘K</Kbd></Text>
        </div>
        <div {...stylex.props(h.facts)}>
          {[[componentPages.length, "component pages"], [fresh, "new in v2"], [componentGroups.length, "categories"], [screens.length, "screens"]].map(([n, l]) => <span key={l} {...stylex.props(h.fact)}><span {...stylex.props(h.factN)}>{n}</span>{l}</span>)}
        </div>
        <SearchInput placeholder="Filter components" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 360 }} />
      </section>

      {componentGroups.map((grp) => {
        const list = componentPages.filter((p) => p.group === grp && match(p));
        if (!list.length) return null;
        return (
          <section key={grp} id={grp} {...stylex.props(h.section)}>
            <div {...stylex.props(h.secHead)}><h2 {...stylex.props(h.h2)}>{grp}</h2><span {...stylex.props(h.count)}>{list.length}</span></div>
            <div {...stylex.props(h.grid)}>
              {list.map((p) => (
                <div key={p.slug} role="link" tabIndex={0} onClick={() => go(`#/docs/${p.slug}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(`#/docs/${p.slug}`); } }} {...stylex.props(h.card)} aria-label={p.title}>
                  <Preview page={p} />
                  <span {...stylex.props(h.name)}><span {...stylex.props(h.title)}>{p.title}</span>{p.badge && <span {...stylex.props(h.badge)}>{p.badge}</span>}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
