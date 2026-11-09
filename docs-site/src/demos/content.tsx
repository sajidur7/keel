import { useState } from "react";
import {
  Avatar, AvatarGroup, Blockquote, Citation, Code, CodeBlock, Heading, Icon, IconCalendar, IconCheckCircle, IconCloud, IconDatabase, IconRocket, IconAgent, IconUser,
  IconUsers, IconZap, ImagePreview, Kbd, KbdGroup, Markdown, Tag, TAG_TONES, Text, Thumbnail, Timer, Timestamp, Token, Button,
} from "@keel/components";
import * as Icons from "@keel/components/icons";
import { Row, State, StateGrid } from "../docs/kit";

const IMG = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='#5675ff'/><stop offset='1' stop-color='#0ea5a4'/></linearGradient></defs><rect width='480' height='320' fill='url(#g)'/><circle cx='360' cy='90' r='54' fill='#fff' opacity='.25'/><path d='M0 260 L140 160 L240 230 L340 150 L480 250 L480 320 L0 320Z' fill='#fff' opacity='.3'/></svg>`);

/* ---------------- Text ---------------- */
export function TextDemo() {
  return (
    <Row col gap={8} align="flex-start">
      <Text variant="display">Display — 36</Text>
      <Text variant="h1">Heading 1 — 28</Text>
      <Text variant="h2">Heading 2 — 22</Text>
      <Text variant="h3">Heading 3 — 18</Text>
      <Text variant="title">Title — 16</Text>
      <Text variant="body">Body — 14. For reading paragraphs and descriptions.</Text>
      <Text variant="small">Small — 13. The default for UI text, tables and controls.</Text>
      <Text variant="caption">Caption — 12. Help text, timestamps, meta.</Text>
      <Text variant="eyebrow">Eyebrow — 11</Text>
      <Text variant="mono">mono — cus_01HZ8K2M4N</Text>
      <Text variant="stat">$84,320</Text>
    </Row>
  );
}
export function TextStates() {
  return (
    <StateGrid min={220}>
      <State label="Tones"><Text tone="default">Default</Text><Text tone="soft">Soft</Text><Text tone="muted">Muted</Text><Text tone="faint">Faint</Text></State>
      <State label="Status tones"><Text tone="accent">Accent</Text><Text tone="success">Success</Text><Text tone="warning">Warning</Text><Text tone="danger">Danger</Text></State>
      <State label="Weights"><Text weight="regular">Regular</Text><Text weight="medium">Medium</Text><Text weight="semibold">Semibold</Text><Text weight="bold">Bold</Text></State>
      <State label="Truncate"><div style={{ width: 180 }}><Text truncate>A very long customer name that does not fit</Text></div></State>
      <State label="Clamp to 2 lines"><div style={{ width: 200 }}><Text maxLines={2}>Clamped text keeps cards tidy when a description runs longer than the space you gave it.</Text></div></State>
      <State label="Tabular / strike"><Text tabular>1,204.50</Text><Text strike tone="muted">$59</Text></State>
    </StateGrid>
  );
}

/* ---------------- Heading ---------------- */
export function HeadingDemo() {
  return (
    <Row col gap={8} align="flex-start">
      <Heading level={1}>Customers</Heading>
      <Heading level={2}>Billing history</Heading>
      <Heading level={3}>Payment methods</Heading>
      <Heading level={4}>Default card</Heading>
      <Heading level={2} variant="title" tone="muted">Level 2 that looks like a title</Heading>
    </Row>
  );
}

/* ---------------- Avatar ---------------- */
export function AvatarDemo() {
  return (
    <StateGrid min={240}>
      <State label="Sizes"><Avatar name="Ana Lima" size="xs" /><Avatar name="Ana Lima" size="sm" /><Avatar name="Ana Lima" size="md" /><Avatar name="Ana Lima" size="lg" /><Avatar name="Ana Lima" size="xl" /><Avatar name="Ana Lima" size="2xl" /></State>
      <State label="Image"><Avatar name="Landscape" src={IMG} size="xl" /><Avatar name="Landscape" src={IMG} size="xl" shape="square" /></State>
      <State label="Status"><Avatar name="Bo Chen" size="lg" status="online" /><Avatar name="Cy Diaz" size="lg" status="away" /><Avatar name="Dee Eko" size="lg" status="busy" /><Avatar name="Eli Fox" size="lg" status="offline" /></State>
      <State label="Tints by name"><Avatar name="Ana Lima" /><Avatar name="Bo Chen" /><Avatar name="Cy Diaz" /><Avatar name="Dee Eko" /><Avatar name="Eli Fox" /><Avatar name="Fay Gu" colored={false} /></State>
      <State label="Organization"><Avatar name="Acme Inc" shape="square" size="lg" /><Avatar name="Globex" shape="square" size="lg" /></State>
      <State label="With tooltip"><Avatar name="Ana Lima" size="lg" tooltip /></State>
    </StateGrid>
  );
}

/* ---------------- AvatarGroup ---------------- */
export function AvatarGroupDemo() {
  const people = ["Ana Lima", "Bo Chen", "Cy Diaz", "Dee Eko", "Eli Fox", "Fay Gu", "Gil Ho"].map((name) => ({ name }));
  return (
    <Row gap={24}>
      <AvatarGroup people={people.slice(0, 3)} />
      <AvatarGroup people={people} max={4} size="lg" />
      <AvatarGroup people={people} max={5} size="sm" />
    </Row>
  );
}

/* ---------------- Blockquote ---------------- */
export function BlockquoteDemo() {
  return <div style={{ maxWidth: 520 }}><Blockquote cite="Ana Lima, Head of Finance at Acme">We closed the books two days faster after moving invoicing here.</Blockquote></div>;
}

/* ---------------- Citation ---------------- */
export function CitationDemo() {
  const s = [{ title: "Stripe — Billing report, October", url: "https://stripe.com/reports" }, { title: "Internal wiki — Churn definition", url: "https://wiki.example.com/churn" }];
  return (
    <Row col gap={14} align="flex-start">
      <Text variant="body">MRR grew 6.2% in October<Citation number={1} source={s[0]} />, while churn — counted on cancellation date<Citation number={2} source={s[1]} /> — fell to 1.8%.</Text>
      <Row><Citation variant="chip" source={s[0]} /><Citation variant="chip" source={s[1]} /></Row>
    </Row>
  );
}

/* ---------------- Code ---------------- */
export function CodeDemo() {
  return (
    <Row col gap={10} align="flex-start">
      <Text>Use <Code>xstyle</Code> to pass StyleX overrides.</Text>
      <Text>Customer <Code>cus_01HZ8K2M4N</Code> was created from <Code tone="accent">api.v2</Code>.</Text>
    </Row>
  );
}

/* ---------------- CodeBlock ---------------- */
export function CodeBlockDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 720 }}>
      <CodeBlock title="Install" language="bash" code={"npm i @stylexjs/stylex radix-ui lucide-react\nnpm i -D @stylexjs/unplugin"} />
      <CodeBlock title="button.tsx" language="tsx" lineNumbers highlightLines={[3]} code={'import { Button } from "@keel/components";\n\nexport const Save = () => <Button variant="primary">Save</Button>;'} />
    </div>
  );
}
export function CodeBlockStates() {
  const long = Array.from({ length: 24 }, (_, i) => `const row${i + 1} = await db.customers.find({ page: ${i + 1} });`).join("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 720 }}>
      <CodeBlock title="Diff" language="ts" diff lineNumbers code={"const plan = 'starter';\n-const seats = 40;\n+const seats = 15;\nsave(plan, seats);"} />
      <CodeBlock title="Collapsed after 6 lines" language="ts" collapseAfter={6} code={long} />
      <CodeBlock code={"Wrapped: a very long single line that keeps going so you can see how wrap mode breaks it onto the next line instead of scrolling sideways."} wrap />
    </div>
  );
}

/* ---------------- Markdown ---------------- */
export function MarkdownDemo() {
  const [streaming, setStreaming] = useState(true);
  return (
    <div style={{ width: "100%", maxWidth: 620, display: "flex", flexDirection: "column", gap: 12 }}>
      <Markdown streaming={streaming} sources={[{ title: "Billing guide", url: "https://example.com/billing" }]}>
        {"## Renewal summary\nAcme renews on **Dec 1** for *$28,800*[^1].\n\n- 40 seats, 31 active\n- Annual, net 30\n\n> Their champion asked about SSO.\n\n```ts\nrenew({ account: \"acme\", seats: 35 })\n```"}
      </Markdown>
      <div><Button size="sm" onClick={() => setStreaming((v) => !v)}>{streaming ? "Finish streaming" : "Show caret"}</Button></div>
    </div>
  );
}

/* ---------------- Icon ---------------- */
export function IconDemo() {
  return (
    <Row gap={16}>
      <Icon icon={IconUsers} /><Icon icon={IconUsers} tone="fg" /><Icon icon={IconCheckCircle} tone="success" /><Icon icon={IconZap} tone="warning" /><Icon icon={IconAgent} tone="accent" />
      <Icon icon={IconRocket} tile /><Icon icon={IconDatabase} tile size={20} /><Icon icon={IconCloud} tile tone="accent" />
    </Row>
  );
}
export function IconGallery() {
  const [q, setQ] = useState("");
  const names = Object.keys(Icons).filter((n) => /^Icon[A-Z]/.test(n) && n !== "IconSizeContext" && n.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${names.length} icons`} style={{ height: 32, padding: "0 10px", borderRadius: 8, boxShadow: "inset 0 0 0 1px rgba(127,127,127,.3)" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))", gap: 6 }}>
        {names.map((n) => { const I = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[n]; return <div key={n} title={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 4px", borderRadius: 10, fontSize: 10.5, opacity: 0.85 }}><I size={18} />{n.replace(/^Icon/, "")}</div>; })}
      </div>
    </div>
  );
}

/* ---------------- Kbd ---------------- */
export function KbdDemo() {
  return (
    <Row gap={16}>
      <Kbd>⌘</Kbd><Kbd>Esc</Kbd><Kbd>↵</Kbd><KbdGroup keys={["⌘", "K"]} /><KbdGroup keys={["Ctrl", "Shift", "P"]} />
      <Text>Press <Kbd>/</Kbd> to search</Text>
    </Row>
  );
}

/* ---------------- Thumbnail ---------------- */
export function ThumbnailDemo() {
  const [items, setItems] = useState(["a", "b", "c"]);
  return (
    <StateGrid min={200}>
      <State label="Removable">{items.map((i) => <Thumbnail key={i} src={IMG} alt={`Photo ${i}`} onRemove={() => setItems((x) => x.filter((y) => y !== i))} />)}</State>
      <State label="Loading"><Thumbnail src={IMG} alt="Uploading" loading /></State>
      <State label="Caption"><Thumbnail src={IMG} alt="Receipt" label="receipt-1042.png" width={120} height={80} /></State>
      <State label="Disabled"><Thumbnail src={IMG} alt="Disabled" disabled /></State>
      <State label="Image preview (opens lightbox)"><ImagePreview src={IMG} alt="Warehouse photo" /></State>
    </StateGrid>
  );
}

/* ---------------- Timer ---------------- */
export function TimerDemo() {
  const [start] = useState(() => Date.now() - 83_000);
  const [end] = useState(() => Date.now() + 5 * 60_000);
  return (
    <StateGrid>
      <State label="Elapsed (call)"><Timer startTime={start} variant="title" /></State>
      <State label="Countdown"><Timer endTime={end} variant="title" tone="warning" /></State>
      <State label="Paused"><Timer startTime={start} running={false} tone="muted" /></State>
    </StateGrid>
  );
}

/* ---------------- Timestamp ---------------- */
export function TimestampDemo() {
  const now = Date.now();
  return (
    <StateGrid min={200}>
      <State label="Just now"><Timestamp value={now - 4000} /></State>
      <State label="Minutes"><Timestamp value={now - 12 * 60000} /></State>
      <State label="Days"><Timestamp value={now - 3 * 86400000} /></State>
      <State label="Absolute (old)"><Timestamp value={now - 40 * 86400000} /></State>
      <State label="Date & time"><Timestamp value={now} format="datetime" tone="default" /></State>
      <State label="Time"><Timestamp value={now} format="time" /></State>
    </StateGrid>
  );
}

/* ---------------- Token ---------------- */
export function TokenDemo() {
  const [people, setPeople] = useState(["Ana Lima", "Bo Chen"]);
  return (
    <StateGrid min={220}>
      <State label="People">{people.map((p) => <Token key={p} label={p} avatar={{ name: p }} onRemove={() => setPeople((x) => x.filter((y) => y !== p))} />)}</State>
      <State label="Icon + description"><Token label="Design" icon={<IconUsers />} description="12" /><Token label="Q4" icon={<IconCalendar />} /></State>
      <State label="Clickable"><Token label="Ana Lima" avatar={{ name: "Ana Lima" }} onClick={() => {}} /></State>
      <State label="Small / disabled"><Token size="sm" label="Billing" /><Token label="Locked" icon={<IconUser />} disabled /></State>
    </StateGrid>
  );
}

/* ---------------- Tag ---------------- */
export function TagDemo() {
  return (
    <StateGrid min={240}>
      <State label="Tones" wide>{TAG_TONES.map((t) => <Tag key={t} tone={t}>{t[0].toUpperCase() + t.slice(1)}</Tag>)}</State>
      <State label="Solid" wide>{TAG_TONES.map((t) => <Tag key={t} tone={t} variant="solid">{t}</Tag>)}</State>
      <State label="Dot"><Tag tone="green" dot>Paid</Tag><Tag tone="amber" dot>Pending</Tag><Tag tone="red" dot>Overdue</Tag></State>
      <State label="Sizes"><Tag size="sm">Small</Tag><Tag>Medium</Tag><Tag size="lg">Large</Tag></State>
      <State label="Pill"><Tag shape="pill" tone="violet">Beta</Tag><Tag shape="pill" tone="blue">New</Tag></State>
      <State label="Removable"><Tag tone="blue" onRemove={() => {}}>Enterprise</Tag><Tag onRemove={() => {}}>EU</Tag></State>
    </StateGrid>
  );
}
