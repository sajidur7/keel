import { useState } from "react";
import {
  Accordion, AccordionItem, Card, CardBody, CardFooter, CardHeader, Carousel, ClickableCard, Collapsible, Field, IconChartBar,
  IconRocket, IconSettings, IconUsers, Input, Link, MoreMenu, SelectableCard, Stat, Switch, Text,
} from "@keel/components";

/* ---------------- Card ---------------- */
export function CardDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <Card padding="none">
        <CardHeader title="Payouts" description="Next payout on Nov 14" action={<MoreMenu items={[{ label: "Payout settings" }, { label: "Export" }]} />} />
        <CardBody><Stat label="Balance" value="$12,480.20" delta={4.1} baseline="vs last week" /></CardBody>
        <CardFooter><span>Stripe · ••4242</span><Link href="#">View all</Link></CardFooter>
      </Card>
      <Card><Text weight="semibold">Card</Text><Text tone="muted">The default surface: hairline ring and a soft drop.</Text></Card>
      <Card variant="outline"><Text weight="semibold">Outline</Text><Text tone="muted">Only a hairline — for nested groups.</Text></Card>
      <Card variant="sunken"><Text weight="semibold">Sunken</Text><Text tone="muted">A well, for read-only or secondary content.</Text></Card>
      <Card variant="raised"><Text weight="semibold">Raised</Text><Text tone="muted">Tactile tile, same depth as buttons.</Text></Card>
    </div>
  );
}

/* ---------------- ClickableCard ---------------- */
export function ClickableCardDemo() {
  const items = [
    { icon: <IconRocket />, title: "Start from a template", text: "Invoices, onboarding, renewals" },
    { icon: <IconUsers />, title: "Import customers", text: "CSV, Stripe or HubSpot" },
    { icon: <IconSettings />, title: "Connect billing", text: "Takes about 2 minutes", disabled: true },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: 16, width: "100%" }}>
      {items.map((it) => (
        <ClickableCard key={it.title} onClick={() => {}} disabled={it.disabled}>
          <span style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ display: "inline-flex", opacity: 0.7 }}>{it.icon}</span>
            <Text weight="semibold">{it.title}</Text>
            <Text tone="muted" variant="caption">{it.text}</Text>
          </span>
        </ClickableCard>
      ))}
    </div>
  );
}

/* ---------------- SelectableCard ---------------- */
export function SelectableCardDemo() {
  const [plan, setPlan] = useState("pro");
  const [addons, setAddons] = useState<string[]>(["sso"]);
  const plans = [{ id: "starter", name: "Starter", price: "$19" }, { id: "pro", name: "Pro", price: "$49" }, { id: "scale", name: "Scale", price: "$129" }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
      <div role="radiogroup" aria-label="Plan" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(180px, 100%), 1fr))", gap: 12 }}>
        {plans.map((p) => (
          <SelectableCard key={p.id} type="radio" selected={plan === p.id} onSelectedChange={() => setPlan(p.id)} label={p.name}>
            <span style={{ display: "flex", flexDirection: "column", gap: 4 }}><Text weight="semibold">{p.name}</Text><Text variant="h3">{p.price}<Text as="span" tone="muted"> /mo</Text></Text></span>
          </SelectableCard>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {["sso", "audit", "sla"].map((a) => (
          <SelectableCard key={a} padding="sm" selected={addons.includes(a)} onSelectedChange={(on) => setAddons((x) => (on ? [...x, a] : x.filter((y) => y !== a)))}>
            <span style={{ paddingRight: 24 }}>{a.toUpperCase()} add-on</span>
          </SelectableCard>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Collapsible ---------------- */
export function CollapsibleDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 8 }}>
      <Collapsible trigger="Advanced settings" defaultOpen>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
          <Field label="Webhook URL"><Input placeholder="https://" /></Field>
          <Switch label="Retry failed deliveries" defaultChecked />
        </div>
      </Collapsible>
      <Collapsible trigger="Chevron at the start" chevron="start">Nested content, like a tree.</Collapsible>
      <Collapsible trigger="Disabled" disabled>Can't open.</Collapsible>
    </div>
  );
}

/* ---------------- Accordion ---------------- */
export function AccordionDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24, width: "100%" }}>
      <Accordion defaultValue="billing">
        <AccordionItem value="billing" title="How does billing work?">You're billed monthly for active seats. Changes are prorated to the day.</AccordionItem>
        <AccordionItem value="cancel" title="Can I cancel anytime?">Yes. You keep access until the end of the period.</AccordionItem>
        <AccordionItem value="data" title="Where is my data stored?" meta="EU">In Frankfurt, encrypted at rest.</AccordionItem>
      </Accordion>
      <Accordion type="multiple" variant="separated" defaultValue={["a"]}>
        <AccordionItem value="a" title="Notifications" meta="3 on">Email, Slack and in-app.</AccordionItem>
        <AccordionItem value="b" title="Security" meta="2FA">Two-factor is required for admins.</AccordionItem>
        <AccordionItem value="c" title="Danger zone" disabled>Only owners can open this.</AccordionItem>
      </Accordion>
    </div>
  );
}

/* ---------------- Carousel ---------------- */
export function CarouselDemo() {
  const items = ["Revenue", "Customers", "Churn", "Expansion", "Payouts", "Refunds", "Disputes"];
  return (
    <div style={{ width: "100%", maxWidth: 820, display: "flex", flexDirection: "column", gap: 24 }}>
      <Carousel label="Metrics" slideWidth={220}>
        {items.map((t, i) => <Card key={t}><Stat label={t} value={`$${(12 + i * 3.4).toFixed(1)}k`} delta={i % 2 ? -1.2 : 3.4} size="sm" /></Card>)}
      </Carousel>
      <Carousel label="Templates" title={<Text weight="semibold">Templates</Text>} slideWidth={180} edgeFade={false}>
        {items.map((t) => <Card key={t} variant="raised"><span style={{ display: "flex", alignItems: "center", gap: 8 }}><IconChartBar size={16} /><Text>{t}</Text></span></Card>)}
      </Carousel>
    </div>
  );
}

