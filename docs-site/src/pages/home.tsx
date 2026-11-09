import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import {
  Avatar, AvatarGroup, Button, Card, ChatComposer, ClickableCard, IconArrowRight, IconSparkles, InsightCard, Kbd, ProgressBar, SegmentedControl, Sparkline, Stat,
  StatusPill, Switch, Tag, Text, Thinking, Token, ToggleButtonGroup, IconBold, IconItalic, IconUnderline, ApprovalCard,
} from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";
import { componentGroups, componentPages } from "../registry";

const h = stylex.create({
  page: { display: "flex", flexDirection: "column", gap: 56, maxWidth: 1180, marginInline: "auto", width: "100%", paddingBottom: 96 },
  hero: { display: "grid", gridTemplateColumns: { default: "1fr", "@media (min-width: 1100px)": "minmax(0, 1fr) minmax(0, 1.1fr)" }, gap: 40, alignItems: "center", paddingTop: 24 },
  copy: { display: "flex", flexDirection: "column", gap: 18 },
  title: { fontSize: { default: "40px", "@media (min-width: 768px)": "54px" }, lineHeight: 1.02, fontWeight: font.semibold, letterSpacing: "-0.045em", textWrap: "balance" },
  grad: { backgroundImage: `linear-gradient(120deg, ${color.fg} 30%, ${color.accent} 70%, ${color.chart5})`, backgroundClip: "text", color: "transparent" },
  lede: { fontSize: font.xl, color: color.fgMuted, lineHeight: 1.55, maxWidth: "52ch" },
  ctas: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" },
  mosaic: {
    display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14, padding: 18, borderRadius: 28, position: "relative",
    backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}`,
    backgroundImage: `radial-gradient(${color.border} 1px, transparent 1px)`, backgroundSize: "16px 16px",
  },
  tile: { display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, minWidth: 0 },
  span2: { gridColumn: "1 / -1" },
  row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  stats: { display: "grid", gridTemplateColumns: { default: "repeat(2, 1fr)", "@media (min-width: 768px)": "repeat(4, 1fr)" }, gap: 12 },
  big: { fontSize: "32px", fontWeight: font.semibold, letterSpacing: "-0.03em" },
  cats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))", gap: 12 },
  catHead: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  h2: { fontSize: font.h2, fontWeight: font.semibold, letterSpacing: "-0.02em", marginBottom: 14 },
});

export function Home({ go }: { go: (to: string) => void }) {
  const [plan, setPlan] = useState("yearly");
  const total = componentPages.length;
  const fresh = componentPages.filter((p) => p.badge === "New").length;
  return (
    <div {...stylex.props(h.page)}>
      <section {...stylex.props(h.hero)}>
        <div {...stylex.props(h.copy)}>
          <div {...stylex.props(h.row)}><Tag tone="blue" shape="pill">v2 preview</Tag><Text variant="caption">StyleX · React 19 · Radix</Text></div>
          <h1 {...stylex.props(h.title)}>Admin UI that feels <span {...stylex.props(h.grad)}>good to press.</span></h1>
          <p {...stylex.props(h.lede)}>Keel is a tactile, dense design system for admin products — {total} documented components with live code, every state, AI primitives and full templates. Styled with StyleX, themed with tokens, built to be copied.</p>
          <div {...stylex.props(h.ctas)}>
            <Button variant="primary" size="lg" trailing={<IconArrowRight />} onClick={() => go("#/docs/installation")}>Get started</Button>
            <Button size="lg" onClick={() => go("#/docs/button")}>Browse components</Button>
            <Text variant="caption">or press <Kbd>⌘K</Kbd></Text>
          </div>
        </div>
        <div {...stylex.props(h.mosaic)} aria-hidden>
          <div {...stylex.props(h.tile)}><Stat label="MRR" value="$84,320" delta={6.2} baseline="vs Oct" chart={<Sparkline values={[60, 62, 64, 63, 68, 71, 74, 79, 84]} width={180} />} /></div>
          <div {...stylex.props(h.tile)}>
            <SegmentedControl size="sm" value={plan} onValueChange={setPlan} items={[{ value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly" }]} fullWidth />
            <Switch label="Auto-renew" defaultChecked />
            <div {...stylex.props(h.row)}><Button variant="primary" size="sm">Upgrade</Button><Button size="sm">Later</Button></div>
          </div>
          <div {...stylex.props(h.tile)}>
            <div {...stylex.props(h.row)}><StatusPill status="active">Live</StatusPill><Tag tone="violet">Beta</Tag><Tag tone="green" dot>Paid</Tag></div>
            <div {...stylex.props(h.row)}><Token label="Ana Lima" avatar={{ name: "Ana Lima" }} onRemove={() => {}} /><AvatarGroup people={[{ name: "Bo Chen" }, { name: "Cy Diaz" }, { name: "Dee Eko" }, { name: "Eli Fox" }]} max={3} /></div>
            <ProgressBar value={68} label="Seats" showValue />
          </div>
          <div {...stylex.props(h.tile)}>
            <Thinking />
            <ToggleButtonGroup type="multiple" defaultValue={["b"]} items={[{ value: "b", label: "", icon: <IconBold />, ariaLabel: "Bold" }, { value: "i", label: "", icon: <IconItalic />, ariaLabel: "Italic" }, { value: "u", label: "", icon: <IconUnderline />, ariaLabel: "Underline" }]} />
            <div {...stylex.props(h.row)}><Avatar name="Ana Lima" status="online" size="lg" /><Text weight="medium">Ana Lima</Text></div>
          </div>
          <div {...stylex.props(h.span2)}><ChatComposer value="" onValueChange={() => {}} onSubmit={() => {}} placeholder="Ask about your billing…" dictation={false} /></div>
        </div>
      </section>

      <section {...stylex.props(h.stats)}>
        {[[`${total}`, "documented components"], [`${fresh}`, "new in v2"], [`${componentGroups.length}`, "categories"], ["0", "Tailwind classes"]].map(([n, l]) => (
          <Card key={l}><span {...stylex.props(h.big)}>{n}</span><Text tone="muted">{l}</Text></Card>
        ))}
      </section>

      <section>
        <h2 {...stylex.props(h.h2)}>Components</h2>
        <div {...stylex.props(h.cats)}>
          {componentGroups.map((grp) => {
            const list = componentPages.filter((p) => p.group === grp);
            return (
              <ClickableCard key={grp} onClick={() => go(`#/docs/${list[0].slug}`)}>
                <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span {...stylex.props(h.catHead)}><Text weight="semibold">{grp}</Text><Tag size="sm">{list.length}</Tag></span>
                  <Text variant="caption" maxLines={2}>{list.map((p) => p.title).join(" · ")}</Text>
                </span>
              </ClickableCard>
            );
          })}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 16 }}>
        <InsightCard title="Net revenue retention" value="112%" trend={[96, 98, 101, 103, 105, 108, 112]} explanation="AI primitives are first-class: insights, approvals, diffs, tool calls and a full chat kit." onAsk={() => go("#/docs/insight-card")} />
        <ApprovalCard title="Send 2 payment reminders?" description="Agents ask before they act." onApprove={() => {}} onReject={() => {}} details={"To: billing@acme.com\nSubject: INV-1042 is overdue"} />
      </section>
      <span hidden><IconSparkles /></span>
    </div>
  );
}
