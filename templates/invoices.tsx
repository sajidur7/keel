import { useState } from "react";
import {
  Button, Card, Combobox, DateInput, Divider, Field, FormLayout, IconButton, IconPlus, IconSend, IconTrash, Input, NumberInput, Page, PageHeading, SegmentedControl, Select,
  Stepper, Text, TextArea, useToast, Tag, Switch,
} from "@keel/components";
import { customers, fmtMoney } from "./data";
import { AdminShell, type Nav } from "./shell";

type Line = { id: number; item: string; qty: number; price: number };

export function InvoiceFormTemplate({ go }: { go?: (to: Nav) => void }) {
  const toast = useToast();
  const [customer, setCustomer] = useState<string | null>("cus_02");
  const [issued, setIssued] = useState<Date | null>(new Date());
  const [due, setDue] = useState<Date | null>(new Date(Date.now() + 30 * 86400000));
  const [currency, setCurrency] = useState("usd");
  const [terms, setTerms] = useState("30");
  const [lines, setLines] = useState<Line[]>([{ id: 1, item: "Scale plan · 140 seats", qty: 1, price: 8400 }, { id: 2, item: "Onboarding workshop", qty: 2, price: 600 }]);
  const [tax, setTax] = useState(true);
  const [sending, setSending] = useState(false);
  const sub = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const vat = tax ? sub * 0.15 : 0;
  const set = (id: number, p: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));
  const c = customers.find((x) => x.id === customer);
  return (
    <AdminShell active="invoices" go={go} header={{ title: "New invoice", status: <Tag size="sm" tone="amber">Draft</Tag>, actions: <><Button size="sm" onClick={() => go?.("overview")}>Cancel</Button><Button size="sm">Save draft</Button></> }}>
      <Page width="wide">
        <PageHeading title="New invoice" description="Bill a customer for a plan, usage or a one-off." size="sm" />
        <Stepper steps={[{ title: "Details" }, { title: "Line items" }, { title: "Review & send" }]} current={1} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: 20, alignItems: "start" }}>
          <Card padding="lg" style={{ gridColumn: "span 1" }}>
            <FormLayout>
              <Field label="Customer" required><Combobox options={customers.map((x) => ({ value: x.id, label: x.name, description: x.domain }))} value={customer} onValueChange={setCustomer} placeholder="Choose a customer" /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Issued"><DateInput value={issued} onValueChange={setIssued} /></Field>
                <Field label="Due" error={due && issued && due < issued ? "Due date is before the issue date" : undefined}><DateInput value={due} onValueChange={setDue} /></Field>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 12 }}>
                <Field label="Currency"><Select value={currency} onValueChange={setCurrency} options={[{ value: "usd", label: "USD — US dollar" }, { value: "eur", label: "EUR — Euro" }, { value: "bdt", label: "BDT — Taka" }]} /></Field>
                <Field label="Terms"><SegmentedControl fullWidth value={terms} onValueChange={setTerms} items={[{ value: "15", label: "Net 15" }, { value: "30", label: "Net 30" }, { value: "60", label: "Net 60" }]} /></Field>
              </div>
              <Divider />
              <Text weight="semibold">Line items</Text>
              {lines.map((l) => (
                <div key={l.id} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: "1 1 200px", minWidth: 0 }}><Input aria-label="Item" value={l.item} onChange={(e) => set(l.id, { item: e.target.value })} /></div>
                  <div style={{ flex: "1 1 64px", maxWidth: 84, minWidth: 0 }}><NumberInput aria-label="Quantity" value={l.qty} onValueChange={(v) => set(l.id, { qty: v ?? 0 })} min={0} integer steppers="none" /></div>
                  <div style={{ flex: "1 1 96px", maxWidth: 120, minWidth: 0 }}><NumberInput aria-label="Price" value={l.price} onValueChange={(v) => set(l.id, { price: v ?? 0 })} min={0} prefix="$" steppers="none" /></div>
                  <IconButton label="Remove line" size="sm" onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))}><IconTrash /></IconButton>
                </div>
              ))}
              <div><Button size="sm" variant="ghost" leading={<IconPlus />} onClick={() => setLines((ls) => [...ls, { id: Date.now(), item: "", qty: 1, price: 0 }])}>Add line</Button></div>
              <Switch label="Add VAT (15%)" checked={tax} onCheckedChange={setTax} />
              <Field label="Note to customer" optional><TextArea placeholder="Thanks for your business!" rows={3} /></Field>
            </FormLayout>
          </Card>
          <Card padding="lg" variant="raised" style={{ position: "sticky", top: 72 }}>
            <Text variant="eyebrow">Preview</Text>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}><Text variant="h3">Fernhill</Text><Text variant="mono" tone="muted">INV-2072</Text></div>
            <Text tone="muted">Bill to {c?.name ?? "—"}</Text>
            <Divider style={{ margin: "14px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lines.map((l) => <div key={l.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><Text truncate>{l.item || "Untitled item"} × {l.qty}</Text><Text tabular>{fmtMoney(l.qty * l.price)}</Text></div>)}
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between" }}><Text tone="muted">Subtotal</Text><Text tabular>{fmtMoney(sub)}</Text></div>
              {tax && <div style={{ display: "flex", justifyContent: "space-between" }}><Text tone="muted">VAT 15%</Text><Text tabular>{fmtMoney(vat)}</Text></div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><Text weight="semibold">Total due</Text><Text variant="stat">{fmtMoney(sub + vat)}</Text></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button fullWidth>Download PDF</Button>
              <Button fullWidth variant="primary" leading={<IconSend />} loading={sending} disabled={!customer || !lines.length}
                onClick={() => { setSending(true); setTimeout(() => { setSending(false); toast({ title: "Invoice sent", description: `To ${c?.name}`, tone: "success", action: { label: "Undo", onClick: () => {} } }); }, 900); }}>Send</Button>
            </div>
          </Card>
        </div>
      </Page>
    </AdminShell>
  );
}
