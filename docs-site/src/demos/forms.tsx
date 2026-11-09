import { useState } from "react";
import {
  Button, Calendar, Cascader, Checkbox, CheckboxList, ColorPicker, Combobox, ComplexSelector, DateInput, DateRangeInput, DateTimeInput, Field, FieldStatus, FileInput,
  FormLayout, FormSection, IconAtSign, IconBuilding, IconDollarSign, IconGlobe, IconMail, IconSearch, IconUser, InlineEdit, Input, InputGroup, Kbd, Link, MultiSelector,
  NumberInput, OtpInput, PasswordInput, PowerSearch, Radio, RadioGroup, RadioList, Rating, RichTextEditor, SearchInput, Select, Slider, Switch, TextArea, TimeInput,
  Tokenizer, Transfer, Typeahead, TypeaheadItem, Text,
  type DateRange, type PowerFilter, type TimeValue, type TypeaheadOption, type UploadItem,
} from "@keel/components";
import { Row, State, StateGrid } from "../docs/kit";

const PEOPLE: TypeaheadOption[] = ["Ana Lima", "Bo Chen", "Cy Diaz", "Dee Eko", "Eli Fox", "Fay Gu", "Gil Ho", "Hana Ito"].map((n, i) => ({
  value: n.toLowerCase().replace(" ", "-"), label: n, description: ["Finance", "Engineering", "Sales", "Support"][i % 4], avatar: { name: n },
}));
const search = (q: string) => new Promise<TypeaheadOption[]>((r) => setTimeout(() => r(PEOPLE.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))), 350));
const COUNTRIES = ["Bangladesh", "Brazil", "Canada", "Denmark", "Germany", "India", "Japan", "Kenya", "Mexico", "Norway", "Portugal", "Singapore", "Spain", "Sweden", "United Kingdom", "United States"].map((c) => ({ value: c.toLowerCase(), label: c }));

/* ---------------- Field ---------------- */
export function FieldDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <FormLayout>
        <Field label="Company name" required description="Shown on invoices and receipts."><Input placeholder="Acme Inc." /></Field>
        <Field label="Billing email" error="Enter an email like name@company.com"><Input defaultValue="ana@" leading={<IconMail />} /></Field>
        <Field label="Workspace URL" status={{ type: "success", message: "acme is available" }}><Input prefix="keel.app/" defaultValue="acme" /></Field>
        <Field label="Bio" optional count={{ value: 42, max: 160 }} labelTooltip="Shown on your public profile."><TextArea defaultValue="Finance lead at Acme. Ask me about invoices." /></Field>
        <Field label="Password" labelAside={<Link href="#" tone="quiet">Forgot?</Link>}><PasswordInput /></Field>
      </FormLayout>
    </div>
  );
}
export function FieldStates() {
  return (
    <StateGrid min={240}>
      <State label="Disabled"><Field label="Plan" disabled><Input defaultValue="Pro" /></Field></State>
      <State label="Read-only"><Field label="Customer ID" readOnly><Input defaultValue="cus_01HZ8K" /></Field></State>
      <State label="Warning"><Field label="Seats" status={{ type: "warning", message: "Above your plan limit" }}><Input defaultValue="52" /></Field></State>
      <State label="Field status"><FieldStatus type="error">Required</FieldStatus><FieldStatus type="success">Verified</FieldStatus><FieldStatus type="info">Takes a minute</FieldStatus></State>
    </StateGrid>
  );
}
export function FormLayoutDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 860 }}>
      <FormSection title="Profile" description="How you appear to teammates.">
        <Field label="Full name"><Input defaultValue="Ana Lima" /></Field>
        <Field label="Role"><Select defaultValue="admin" options={[{ value: "admin", label: "Admin" }, { value: "member", label: "Member" }]} /></Field>
      </FormSection>
      <FormSection title="Notifications" description="Where we send alerts.">
        <Switch label="Email" description="Daily digest at 9:00" defaultChecked />
        <Switch label="Slack" description="Real-time to #billing" />
      </FormSection>
      <div style={{ paddingTop: 16 }}>
        <Text variant="eyebrow">Inline layout (filters)</Text>
        <div style={{ marginTop: 10 }}><FormLayout layout="inline"><Field label="Status"><Select defaultValue="all" options={[{ value: "all", label: "All" }, { value: "paid", label: "Paid" }]} /></Field><Field label="From"><Input type="date" /></Field><Button variant="primary">Apply</Button></FormLayout></div>
      </div>
    </div>
  );
}

/* ---------------- TextInput ---------------- */
export function InputDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 420 }}>
      <Input placeholder="Plain" />
      <Input leading={<IconUser />} placeholder="With icon" />
      <Input prefix="https://" suffix=".com" placeholder="domain" />
      <Input placeholder="Clearable" defaultValue="Acme" clearable />
      <SearchInput shortcut="/" />
      <PasswordInput defaultValue="correct horse" />
      <Input placeholder="Inline edit look" variant="flat" />
    </div>
  );
}
export function InputStates() {
  return (
    <StateGrid min={220}>
      <State label="Sizes"><div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}><Input size="sm" placeholder="Small" /><Input placeholder="Medium" /><Input size="lg" placeholder="Large" /></div></State>
      <State label="Invalid"><Input invalid defaultValue="ana@" /></State>
      <State label="Loading"><Input loading defaultValue="Checking…" /></State>
      <State label="Disabled"><Input disabled defaultValue="Locked" /></State>
      <State label="Read-only"><Input readOnly defaultValue="cus_01HZ8K" /></State>
      <State label="With kbd"><Input placeholder="Jump to" trailing={<Kbd>⌘J</Kbd>} /></State>
    </StateGrid>
  );
}

/* ---------------- NumberInput ---------------- */
export function NumberInputDemo() {
  const [seats, setSeats] = useState<number | null>(12);
  return (
    <StateGrid min={220}>
      <State label="Steppers"><NumberInput value={seats} onValueChange={setSeats} min={1} max={500} units="seats" /></State>
      <State label="Side buttons"><NumberInput defaultValue={3} steppers="sides" min={0} max={10} /></State>
      <State label="Currency"><NumberInput defaultValue={49} leading={<IconDollarSign />} step={5} format={(n) => n.toFixed(2)} /></State>
      <State label="Percent"><NumberInput defaultValue={20} units="%" min={0} max={100} integer /></State>
      <State label="Invalid / disabled"><NumberInput defaultValue={600} invalid /><NumberInput defaultValue={1} disabled /></State>
    </StateGrid>
  );
}

/* ---------------- TextArea ---------------- */
export function TextAreaDemo() {
  const [v, setV] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480 }}>
      <Field label="Note" count={{ value: v.length, max: 200 }}><TextArea value={v} onChange={(e) => setV(e.target.value)} placeholder="Add an internal note…" /></Field>
      <TextArea autoGrow placeholder="Grows as you type" rows={2} />
      <TextArea placeholder="With footer" footer={<><Text variant="caption">Markdown supported</Text><Button size="xs" variant="primary">Post</Button></>} />
      <TextArea invalid defaultValue="Too short" rows={2} />
    </div>
  );
}

/* ---------------- InputGroup ---------------- */
export function InputGroupDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 440 }}>
      <InputGroup start="https://" end=".keel.app"><Input defaultValue="acme" /></InputGroup>
      <InputGroup start={<IconAtSign size={14} />}><Input placeholder="username" /></InputGroup>
      <InputGroup end={<Select size="sm" variant="button" defaultValue="usd" aria-label="Currency" options={[{ value: "usd", label: "USD" }, { value: "eur", label: "EUR" }]} />}><Input defaultValue="1,200.00" /></InputGroup>
    </div>
  );
}

/* ---------------- Checkbox ---------------- */
export function CheckboxDemo() {
  const [v, setV] = useState(["email"]);
  return (
    <Row gap={32} align="flex-start">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox label="Send receipt" description="To the billing contact" defaultChecked />
        <Checkbox label="Select all" checked="indeterminate" />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled on" disabled defaultChecked />
        <Checkbox label="Invalid" invalid />
        <Checkbox aria-label="No label" />
      </div>
      <CheckboxList label="Notify me by" value={v} onValueChange={setV} options={[{ value: "email", label: "Email" }, { value: "slack", label: "Slack" }, { value: "sms", label: "SMS", description: "Charges may apply" }]} />
    </Row>
  );
}

/* ---------------- RadioList ---------------- */
export function RadioListDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 640 }}>
      <RadioList label="Billing cycle" defaultValue="monthly" options={[{ value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly", description: "Save 20%" }, { value: "custom", label: "Custom", disabled: true }]} />
      <RadioList label="Plan" variant="card" defaultValue="pro" options={[{ value: "starter", label: "Starter", description: "$19 / month" }, { value: "pro", label: "Pro", description: "$49 / month" }, { value: "scale", label: "Scale", description: "Talk to sales" }]} />
      <RadioGroup orientation="horizontal" defaultValue="a"><Radio value="a" label="Left" /><Radio value="b" label="Center" /><Radio value="c" label="Right" /></RadioGroup>
    </div>
  );
}

/* ---------------- Switch ---------------- */
export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <StateGrid min={220}>
      <State label="Default"><Switch checked={on} onCheckedChange={setOn} label="Auto-renew" /></State>
      <State label="Description"><Switch label="Weekly digest" description="Every Monday at 9:00" defaultChecked /></State>
      <State label="Small"><Switch size="sm" label="Compact" defaultChecked /></State>
      <State label="Loading"><Switch label="Saving…" loading defaultChecked /></State>
      <State label="Disabled"><Switch label="Off" disabled /><Switch label="On" disabled defaultChecked /></State>
      <State label="Settings row" wide><div style={{ width: "100%", maxWidth: 420 }}><Switch labelPosition="left" label="Two-factor authentication" description="Required for admins" defaultChecked /></div></State>
    </StateGrid>
  );
}

/* ---------------- Slider ---------------- */
export function SliderDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 440 }}>
      <Slider defaultValue={[40]} showValue aria-label="Volume" />
      <Slider defaultValue={[20, 80]} showValue format={(v) => `$${v}`} aria-label="Price" />
      <Slider defaultValue={[2]} min={0} max={4} step={1} marks={[{ value: 0, label: "XS" }, { value: 1, label: "S" }, { value: 2, label: "M" }, { value: 3, label: "L" }, { value: 4, label: "XL" }]} aria-label="Size" />
      <Slider defaultValue={[60]} disabled aria-label="Disabled" />
    </div>
  );
}

/* ---------------- Select ---------------- */
export function SelectDemo() {
  return (
    <StateGrid min={220}>
      <State label="Default"><Select placeholder="Choose a plan" options={[{ value: "starter", label: "Starter" }, { value: "pro", label: "Pro" }, { value: "scale", label: "Scale" }]} /></State>
      <State label="Groups & descriptions"><Select defaultValue="usd" groups={[{ label: "Popular", options: [{ value: "usd", label: "USD", description: "US dollar" }, { value: "eur", label: "EUR", description: "Euro" }] }, { label: "Other", options: [{ value: "bdt", label: "BDT", description: "Taka" }] }]} /></State>
      <State label="Button look"><Select variant="button" size="sm" defaultValue="30d" options={[{ value: "7d", label: "Last 7 days" }, { value: "30d", label: "Last 30 days" }]} /></State>
      <State label="Invalid"><Select invalid placeholder="Required" options={[{ value: "a", label: "A" }]} /></State>
      <State label="Disabled"><Select disabled defaultValue="a" options={[{ value: "a", label: "Locked" }]} /></State>
      <State label="Read-only"><Select readOnly defaultValue="a" options={[{ value: "a", label: "Owner" }]} /></State>
    </StateGrid>
  );
}

/* ---------------- Combobox / MultiSelector ---------------- */
export function ComboboxDemo() {
  const [one, setOne] = useState<string | null>("germany");
  const [many, setMany] = useState(["denmark", "japan", "kenya", "norway"]);
  const [opts, setOpts] = useState(COUNTRIES);
  return (
    <StateGrid min={260}>
      <State label="Single"><Combobox options={opts} value={one} onValueChange={setOne} placeholder="Country" /></State>
      <State label="Multiple (MultiSelector)"><MultiSelector options={opts} value={many} onValueChange={setMany} placeholder="Countries" /></State>
      <State label="Create new"><Combobox options={opts} value={null} onValueChange={() => {}} onCreate={(l) => setOpts((o) => [...o, { value: l.toLowerCase(), label: l }])} placeholder="Type a new one" /></State>
      <State label="Loading / invalid"><Combobox options={[]} value={null} onValueChange={() => {}} loading placeholder="Loading…" /><Combobox options={opts} value={null} onValueChange={() => {}} invalid /></State>
    </StateGrid>
  );
}

/* ---------------- ComplexSelector ---------------- */
export function ComplexSelectorDemo() {
  const [owner, setOwner] = useState(["ana-lima"]);
  const [team, setTeam] = useState<string[]>(["bo-chen", "cy-diaz"]);
  const options = PEOPLE.map((p, i) => ({ value: p.value, label: p.label, description: `${p.label.split(" ")[0].toLowerCase()}@acme.com`, avatar: p.avatar, meta: ["Owner", "Admin", "Member", "Viewer"][i % 4], group: i < 4 ? "Finance team" : "Others" }));
  return (
    <Row gap={16}>
      <ComplexSelector options={options} value={owner} onValueChange={setOwner} placeholder="Assign owner" footer="Owners get every alert for this account" />
      <ComplexSelector multiple options={options} value={team} onValueChange={setTeam} placeholder="Add watchers" />
    </Row>
  );
}

/* ---------------- Typeahead ---------------- */
export function TypeaheadDemo() {
  const [v, setV] = useState<TypeaheadOption | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
      <Field label="Account manager" description="Async search — try “an”"><Typeahead source={search} value={v} onValueChange={setV} placeholder="Search people" /></Field>
      <Field label="Country (local list)"><Typeahead source={COUNTRIES} leading={<IconGlobe />} placeholder="Start typing" /></Field>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: 4, borderRadius: 12, boxShadow: "0 0 0 1px rgba(127,127,127,.2)" }}>
        <TypeaheadItem option={PEOPLE[0]} active /><TypeaheadItem option={PEOPLE[1]} selected /><TypeaheadItem option={{ value: "x", label: "Plain item" }} />
      </div>
    </div>
  );
}

/* ---------------- Tokenizer ---------------- */
export function TokenizerDemo() {
  const [to, setTo] = useState<TypeaheadOption[]>([PEOPLE[0], PEOPLE[2]]);
  const [tags, setTags] = useState<TypeaheadOption[]>([{ value: "vip", label: "vip" }]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 520 }}>
      <Field label="Share with"><Tokenizer source={search} value={to} onValueChange={setTo} placeholder="Add people" /></Field>
      <Field label="Tags" description="Type and press Enter to create"><Tokenizer source={[{ value: "enterprise", label: "enterprise" }, { value: "trial", label: "trial" }]} value={tags} onValueChange={setTags} allowCreate max={5} /></Field>
    </div>
  );
}

/* ---------------- PowerSearch ---------------- */
export function PowerSearchDemo() {
  const [filters, setFilters] = useState<PowerFilter[]>([{ field: "status", operator: "is", value: "Overdue" }]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 720 }}>
      <PowerSearch filters={filters} onFiltersChange={setFilters} fields={[
        { key: "status", label: "Status", values: ["Paid", "Overdue", "Draft", "Void"], icon: <IconSearch /> },
        { key: "plan", label: "Plan", values: ["Starter", "Pro", "Scale"], icon: <IconBuilding /> },
        { key: "amount", label: "Amount", operators: ["=", ">", "<", "between"] },
        { key: "owner", label: "Owner", values: PEOPLE.map((p) => p.label), icon: <IconUser /> },
      ]} />
      <Text variant="caption">{filters.length ? filters.map((f) => `${f.field} ${f.operator} ${f.value}`).join(" AND ") : "No filters"}</Text>
    </div>
  );
}

/* ---------------- Calendar & dates ---------------- */
export function CalendarDemo() {
  const [d, setD] = useState<Date | null>(new Date());
  const [r, setR] = useState<DateRange>({ from: null, to: null });
  return (
    <Row gap={32} align="flex-start">
      <Calendar selected={d} onSelect={setD} />
      <Calendar range={r} onRangeSelect={setR} weekNumbers outsideDays isDisabled={(x) => x.getDay() === 0} />
    </Row>
  );
}
export function DateInputDemo() {
  const [d, setD] = useState<Date | null>(null);
  const t = new Date();
  return (
    <StateGrid min={240}>
      <State label="Default"><DateInput value={d} onValueChange={setD} /></State>
      <State label="Presets"><DateInput value={d} onValueChange={setD} presets={[{ label: "Today", date: t }, { label: "Tomorrow", date: new Date(t.getTime() + 86400000) }, { label: "In a week", date: new Date(t.getTime() + 7 * 86400000) }]} /></State>
      <State label="Min/max"><DateInput value={null} onValueChange={() => {}} min={t} max={new Date(t.getTime() + 30 * 86400000)} placeholder="Next 30 days" /></State>
      <State label="Invalid / disabled"><DateInput value={null} onValueChange={() => {}} invalid /><DateInput value={t} onValueChange={() => {}} disabled /></State>
    </StateGrid>
  );
}
export function DateRangeInputDemo() {
  const [r, setR] = useState<DateRange>({ from: new Date(Date.now() - 6 * 86400000), to: new Date() });
  return <div style={{ width: "100%", maxWidth: 320 }}><DateRangeInput value={r} onValueChange={setR} /></div>;
}
export function DateTimeInputDemo() {
  const [d, setD] = useState<Date | null>(new Date(new Date().setHours(9, 30, 0, 0)));
  return <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 8 }}><DateTimeInput value={d} onValueChange={setD} /><Text variant="caption">{d?.toString()}</Text></div>;
}
export function TimeInputDemo() {
  const [t, setT] = useState<TimeValue>({ h: 9, m: 30 });
  return (
    <StateGrid>
      <State label="24-hour"><TimeInput value={t} onValueChange={setT} /></State>
      <State label="12-hour, 15 min"><TimeInput value={t} onValueChange={setT} hourFormat={12} step={15} min="08:00" max="18:00" /></State>
      <State label="Empty / disabled"><TimeInput value={null} onValueChange={() => {}} /><TimeInput value={t} onValueChange={() => {}} disabled /></State>
    </StateGrid>
  );
}

/* ---------------- FileInput ---------------- */
export function FileInputDemo() {
  const [items, setItems] = useState<UploadItem[]>([
    { id: "1", name: "customers-q3.csv", size: 182_000, status: "done" },
    { id: "2", name: "invoices-oct.xlsx", size: 2_400_000, status: "uploading", progress: 46 },
    { id: "3", name: "contracts.zip", size: 41_000_000, status: "error", error: "Too large" },
  ]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 520 }}>
      <FileInput items={items} accept=".csv,.xlsx,.zip" maxSize={20_000_000} hint="CSV or Excel, up to 20 MB"
        onFiles={(fs) => setItems((x) => [...x, ...fs.map((f, i) => ({ id: `${Date.now()}${i}`, name: f.name, size: f.size, status: "done" as const }))])}
        onRemove={(id) => setItems((x) => x.filter((i) => i.id !== id))} onRetry={(id) => setItems((x) => x.map((i) => (i.id === id ? { ...i, status: "uploading", progress: 10 } : i)))} />
      <FileInput compact onFiles={() => {}} hint="PNG or JPG" label="Upload logo" />
      <FileInput disabled onFiles={() => {}} hint="Uploads are paused" />
    </div>
  );
}

/* ---------------- OTP ---------------- */
export function OtpInputDemo() {
  const [v, setV] = useState("12");
  return (
    <StateGrid min={300}>
      <State label="Six digits"><OtpInput value={v} onChange={setV} /></State>
      <State label="Grouped 3–3"><OtpInput value="123456" onChange={() => {}} groupSize={3} /></State>
      <State label="Invalid"><OtpInput value="123499" onChange={() => {}} invalid /></State>
      <State label="Four / disabled"><OtpInput length={4} value="12" onChange={() => {}} disabled /></State>
    </StateGrid>
  );
}

/* ---------------- Rating ---------------- */
export function RatingDemo() {
  const [r, setR] = useState(4);
  return (
    <StateGrid>
      <State label="Interactive"><Rating value={r} onChange={setR} /></State>
      <State label="Read-only"><Rating value={3.6} readOnly /></State>
      <State label="Large, 10"><Rating value={7} max={10} size={20} onChange={() => {}} /></State>
    </StateGrid>
  );
}

/* ---------------- ColorPicker ---------------- */
export function ColorPickerDemo() {
  const [c, setC] = useState("#3a5cf0");
  return <Row gap={16}><div style={{ width: 220 }}><ColorPicker value={c} onChange={setC} /></div><span style={{ width: 40, height: 40, borderRadius: 10, background: c }} /><ColorPicker value="#16a34a" onChange={() => {}} disabled /></Row>;
}

/* ---------------- Transfer ---------------- */
export function TransferDemo() {
  const items = ["View customers", "Edit customers", "Delete customers", "View invoices", "Issue refunds", "Manage team", "Billing settings", "API keys"].map((l, i) => ({ key: `p${i}`, label: l, description: i % 3 === 0 ? "Read-only" : undefined, disabled: i === 7 }));
  const [v, setV] = useState(["p0", "p3"]);
  return <div style={{ width: "100%", maxWidth: 720 }}><Transfer items={items} value={v} onChange={setV} titles={["Available permissions", "Granted"]} height={240} /></div>;
}

/* ---------------- Cascader ---------------- */
export function CascaderDemo() {
  const [v, setV] = useState<string[]>(["asia", "bd", "dhaka"]);
  const options = [
    { value: "asia", label: "Asia", children: [{ value: "bd", label: "Bangladesh", children: [{ value: "dhaka", label: "Dhaka" }, { value: "ctg", label: "Chattogram" }] }, { value: "jp", label: "Japan", children: [{ value: "tokyo", label: "Tokyo" }, { value: "osaka", label: "Osaka" }] }] },
    { value: "europe", label: "Europe", children: [{ value: "de", label: "Germany", children: [{ value: "berlin", label: "Berlin" }] }, { value: "fr", label: "France", disabled: true }] },
  ];
  return <div style={{ width: "100%", maxWidth: 320 }}><Field label="Office"><Cascader options={options} value={v} onChange={setV} /></Field></div>;
}

/* ---------------- InlineEdit ---------------- */
export function InlineEditDemo() {
  const [name, setName] = useState("Acme Inc.");
  const [note, setNote] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
      <InlineEdit label="Company name" value={name} onSave={(v) => new Promise((r) => setTimeout(() => { setName(v); r(); }, 600))} validate={(v) => (v.trim() ? null : "Name can't be empty")} />
      <InlineEdit label="Note" value={note} onSave={setNote} placeholder="Add a note" />
      <InlineEdit label="Customer ID" value="cus_01HZ8K" onSave={() => {}} readOnly />
    </div>
  );
}

/* ---------------- RichTextEditor ---------------- */
export function RichTextEditorDemo() {
  const [html, setHtml] = useState("<p>Hi <b>Ana</b>, thanks for renewing!</p>");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 620 }}>
      <RichTextEditor value={html} onChange={setHtml} showCount />
      <Text variant="caption" truncate>HTML: {html}</Text>
    </div>
  );
}
