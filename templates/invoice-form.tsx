import { useEffect, useRef, useState } from "react";
import {
  Alert, Breadcrumb, Button, Combobox, DatePicker, Divider, FormField, IconButton, IconPlus, IconTrash, Input,
  NumberInput, Page, RadioGroup, Radio, Select, Switch, Textarea, useToast,
} from "@keel/components";
import { customers, fmtMoney } from "./data";
import { AdminShell, type Nav } from "./shell";

/*
  Template: create/edit form with validation. Validates on blur and on submit;
  on a failed submit it shows a summary Alert and focuses the first invalid field.
*/
type Line = { id: number; description: string; qty: number | null; price: number | null };
type Errors = Partial<Record<"customer" | "due" | "email" | "lines", string>>;

export function InvoiceFormTemplate({ go, showErrors = false }: { go?: (to: Nav) => void; showErrors?: boolean }) {
  const toast = useToast();
  const [customer, setCustomer] = useState<string | null>(showErrors ? null : "cus_07");
  const [email, setEmail] = useState(showErrors ? "billing@orbital" : "ap@orbital-labs.io");
  const [due, setDue] = useState<Date | null>(showErrors ? null : new Date(2026, 11, 5));
  const [currency, setCurrency] = useState("usd");
  const [terms, setTerms] = useState("net30");
  const [notes, setNotes] = useState("");
  const [autoRemind, setAutoRemind] = useState(true);
  const [lines, setLines] = useState<Line[]>([
    { id: 1, description: "Scale plan · 610 seats · December", qty: 610, price: 49 },
    { id: 2, description: showErrors ? "" : "Priority support", qty: 1, price: showErrors ? null : 1200 },
  ]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!customer) e.customer = "Choose a customer";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Enter a valid email, like ap@company.com";
    if (!due) e.due = "Pick a due date";
    else if (due < new Date(2026, 10, 5)) e.due = "Pick a date after today";
    if (lines.some((l) => !l.description.trim() || !l.qty || l.price === null)) e.lines = "Every line needs a description, quantity and price";
    return e;
  };
  // The "with errors" preview starts as if the user had pressed Create once.
  useEffect(() => {
    if (showErrors) { setSubmitted(true); setErrors(validate()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showErrors]);

  const blur = (key: keyof Errors) => () => {
    if (!submitted) return;
    const e = validate();
    setErrors((prev) => ({ ...prev, [key]: e[key] }));
  };
  const total = lines.reduce((s, l) => s + (l.qty ?? 0) * (l.price ?? 0), 0);
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <AdminShell
      active="invoices"
      go={go}
      header={{
        title: "New invoice",
        breadcrumb: <Breadcrumb items={[{ label: "Invoices", onClick: () => go?.("invoices") }, { label: "New" }]} />,
        actions: <Button size="sm" variant="ghost" onClick={() => go?.("customers")}>Cancel</Button>,
      }}
    >
      <Page width="narrow">
        <form
          ref={formRef}
          noValidate
          className="flex flex-col gap-6"
          onSubmit={async (ev) => {
            ev.preventDefault();
            setSubmitted(true);
            const e = validate();
            setErrors(e);
            if (Object.keys(e).length) {
              requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
              return;
            }
            setSaving(true);
            await new Promise((r) => setTimeout(r, 800));
            setSaving(false);
            toast({ title: "Invoice INV-2073 created", description: `${fmtMoney(total)} due ${due!.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, tone: "success" });
          }}
        >
          {errorCount > 0 && (
            <Alert tone="danger" title={`Fix ${errorCount} ${errorCount === 1 ? "field" : "fields"} to create this invoice`}>
              Fields with problems are marked below.
            </Alert>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Customer" required error={errors.customer} className="md:col-span-2">
              <Combobox
                value={customer}
                onValueChange={(v) => { setCustomer(v); if (submitted) setErrors((p) => ({ ...p, customer: v ? undefined : "Choose a customer" })); }}
                placeholder="Search customers"
                options={customers.map((c) => ({ value: c.id, label: c.name }))}
              />
            </FormField>
            <FormField label="Billing email" required error={errors.email} help={!errors.email ? "The invoice and receipts are sent here" : undefined}>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={blur("email")} />
            </FormField>
            <FormField label="Due date" required error={errors.due}>
              <DatePicker value={due} onChange={(d) => { setDue(d); if (submitted) setErrors((p) => ({ ...p, due: d ? undefined : "Pick a due date" })); }} min={new Date(2026, 10, 5)} />
            </FormField>
            <FormField label="Currency">
              <Select value={currency} onValueChange={setCurrency} options={[{ value: "usd", label: "USD · US dollar" }, { value: "eur", label: "EUR · Euro" }, { value: "bdt", label: "BDT · Taka" }]} />
            </FormField>
            <FormField label="Payment terms">
              <RadioGroup value={terms} onValueChange={setTerms} orientation="horizontal" aria-label="Payment terms" className="h-[30px] items-center">
                <Radio value="net15" label="Net 15" />
                <Radio value="net30" label="Net 30" />
                <Radio value="receipt" label="On receipt" />
              </RadioGroup>
            </FormField>
          </div>

          <Divider />

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-title font-medium">Line items</legend>
            <div className="hidden grid-cols-[minmax(0,1fr)_96px_120px_96px_30px] gap-3 text-caption text-subtle sm:grid">
              <span>Description</span><span>Qty</span><span>Price</span><span className="text-right">Amount</span><span />
            </div>
            {lines.map((l, i) => {
              const bad = submitted && (!l.description.trim() || !l.qty || l.price === null);
              return (
                <div key={l.id} className="grid grid-cols-[minmax(0,1fr)_30px] gap-2 border-b border-border pb-3 sm:grid-cols-[minmax(0,1fr)_96px_120px_96px_30px] sm:gap-3 sm:border-0 sm:pb-0">
                  <Input aria-label={`Line ${i + 1} description`} placeholder="Description" value={l.description} invalid={bad && !l.description.trim()} onChange={(e) => setLines(lines.map((x) => (x.id === l.id ? { ...x, description: e.target.value } : x)))} />
                  <IconButton label={`Remove line ${i + 1}`} disabled={lines.length === 1} className="sm:order-last" onClick={() => setLines(lines.filter((x) => x.id !== l.id))}><IconTrash /></IconButton>
                  <div className="col-span-2 grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-2 sm:contents">
                    <NumberInput aria-label={`Line ${i + 1} quantity`} value={l.qty} min={1} invalid={bad && !l.qty} onValueChange={(v) => setLines(lines.map((x) => (x.id === l.id ? { ...x, qty: v } : x)))} />
                    <Input aria-label={`Line ${i + 1} price`} prefix="$" inputMode="decimal" className="tabular" value={l.price ?? ""} invalid={bad && l.price === null}
                      onChange={(e) => setLines(lines.map((x) => (x.id === l.id ? { ...x, price: e.target.value === "" ? null : Number(e.target.value) || 0 } : x)))} />
                    <span className="tabular text-right text-small text-soft sm:self-center">{fmtMoney((l.qty ?? 0) * (l.price ?? 0), 2)}</span>
                  </div>
                </div>
              );
            })}
            {errors.lines && <p className="text-caption text-danger" role="alert">{errors.lines}</p>}
            <div className="flex items-center justify-between gap-3 pt-1">
              <Button size="sm" variant="ghost" leading={<IconPlus />} onClick={() => setLines([...lines, { id: Date.now(), description: "", qty: 1, price: null }])}>Add line</Button>
              <div className="flex items-baseline gap-3"><span className="text-small text-subtle">Total</span><span className="tabular text-title font-medium">{fmtMoney(total, 2)}</span></div>
            </div>
          </fieldset>

          <Divider />

          <FormField label="Memo" optional count={{ value: notes.length, max: 240 }} help="Printed at the bottom of the invoice">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Thanks for your business." />
          </FormField>
          <Switch label="Send automatic reminders" description="3 days before and 1 day after the due date" checked={autoRemind} onCheckedChange={setAutoRemind} />

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <Button type="submit" variant="primary" loading={saving}>Create invoice</Button>
            <Button variant="secondary">Save as draft</Button>
            <Button variant="ghost" className="ml-auto" onClick={() => go?.("customers")}>Cancel</Button>
          </div>
        </form>
      </Page>
    </AdminShell>
  );
}
