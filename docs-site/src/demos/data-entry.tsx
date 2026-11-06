import { useEffect, useRef, useState } from "react";
import {
  Button, Checkbox, Combobox, DatePicker, DateRangePicker, FileUpload, FormField, FormLayout, FormSection, IconGlobe,
  IconMail, InlineEdit, Input, NumberInput, PasswordInput, Radio, RadioGroup, SearchInput, Select, Slider,
  Switch, Textarea, TimePicker, type DateRange, type UploadItem,
} from "@keel/components";
import type { DocPage } from "../docs/types";

/* ===== Input ===== */

export function InputBasics() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Input placeholder="Company name" />
      <Input leading={<IconMail />} placeholder="name@company.com" type="email" />
      <Input prefix="https://" placeholder="fernhill.io" />
      <Input suffix="USD" defaultValue="1,200.00" className="tabular" />
      <Input clearable defaultValue="Northwind Logistics" />
      <Input leading={<IconGlobe />} suffix=".fernhill.app" defaultValue="northwind" />
    </div>
  );
}

export function InputSizes() {
  return (
    <div className="flex w-full flex-col gap-3 sm:max-w-sm">
      <Input size="sm" placeholder="Small · 26px (toolbars)" />
      <Input size="md" placeholder="Medium · 30px (default)" />
      <Input size="lg" placeholder="Large · 36px (auth screens)" />
    </div>
  );
}

export function InputStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <FormField label="Default"><Input placeholder="Placeholder" /></FormField>
      <FormField label="Error" error="This subdomain is taken. Try another."><Input defaultValue="northwind" /></FormField>
      <FormField label="Read-only" readOnly help="Set by your identity provider"><Input defaultValue="nadia@fernhill.io" /></FormField>
      <FormField label="Disabled" disabled><Input defaultValue="Locked while syncing" /></FormField>
    </div>
  );
}

export function SpecialInputs() {
  const [seats, setSeats] = useState<number | null>(25);
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <FormField label="Search"><SearchInput shortcut="/" placeholder="Search customers" /></FormField>
      <FormField label="Password"><PasswordInput defaultValue="correct-horse" /></FormField>
      <FormField label="Seats" help="Arrow keys step by 1, Shift + arrow by 10"><NumberInput value={seats} onValueChange={setSeats} min={1} max={1000} /></FormField>
      <FormField label="Notes" count={{ value: 0, max: 280 }}><Textarea placeholder="Visible to your team only" /></FormField>
    </div>
  );
}

/* ===== Form field ===== */

export function FormFieldDemo() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("Operations team for the APAC region.");
  const [submitted, setSubmitted] = useState(false);
  const err = submitted && !name.trim() ? "Enter a workspace name" : undefined;
  return (
    <form className="flex w-full max-w-md flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate>
      <FormField label="Workspace name" required error={err} help="Shown on invoices and emails">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Fernhill Operations" />
      </FormField>
      <FormField label="Description" optional count={{ value: bio.length, max: 80 }}>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} />
      </FormField>
      <div className="flex gap-2">
        <Button type="submit" variant="primary">Save</Button>
        <Button variant="ghost" onClick={() => { setSubmitted(false); setName(""); }}>Reset</Button>
      </div>
    </form>
  );
}

export function FormLayouts() {
  return (
    <div className="flex w-full flex-col gap-10">
      <FormLayout layout="horizontal">
        <FormField layout="horizontal" label="Legal name" required><Input defaultValue="Fernhill Operations Ltd." /></FormField>
        <FormField layout="horizontal" label="Billing email" help="Receipts and invoices go here"><Input defaultValue="billing@fernhill.io" /></FormField>
      </FormLayout>
      <FormLayout layout="inline">
        <FormField label="Email" className="w-full sm:w-56"><Input placeholder="name@company.com" /></FormField>
        <FormField label="Role" className="w-full sm:w-36"><Select defaultValue="editor" options={[{ value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer" }]} /></FormField>
        <Button variant="primary">Invite</Button>
      </FormLayout>
    </div>
  );
}

export function FormSections() {
  return (
    <div className="flex w-full flex-col gap-6">
      <FormSection title="Company" description="Appears on invoices and in emails to customers.">
        <FormField label="Legal name" required><Input defaultValue="Fernhill Operations Ltd." /></FormField>
        <FormField label="Tax ID" optional><Input placeholder="BIN 000-000-000" /></FormField>
      </FormSection>
      <FormSection title="Notifications" description="Sent to workspace admins.">
        <Switch label="Failed payments" description="Email as soon as a charge fails" defaultChecked />
        <Switch label="Weekly summary" description="Every Monday at 9:00" />
      </FormSection>
    </div>
  );
}

/* ===== Select / Combobox ===== */

const regions = [
  { value: "dhaka", label: "Dhaka" }, { value: "singapore", label: "Singapore" }, { value: "berlin", label: "Berlin" },
  { value: "toronto", label: "Toronto" }, { value: "austin", label: "Austin" },
];

export function SelectDemo() {
  const [v, setV] = useState("growth");
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <FormField label="Plan">
        <Select value={v} onValueChange={setV} options={[
          { value: "starter", label: "Starter", description: "Up to 10 seats" },
          { value: "growth", label: "Growth", description: "Up to 100 seats" },
          { value: "scale", label: "Scale", description: "Unlimited seats" },
          { value: "enterprise", label: "Enterprise", description: "SSO, audit log, SLA", disabled: true },
        ]} />
      </FormField>
      <FormField label="Region">
        <Select placeholder="Choose region" groups={[{ label: "Asia", options: regions.slice(0, 2) }, { label: "Europe & Americas", options: regions.slice(2) }]} />
      </FormField>
      <FormField label="Invalid" error="Choose a region"><Select placeholder="Choose region" options={regions} /></FormField>
      <FormField label="Read-only" readOnly><Select defaultValue="berlin" options={regions} /></FormField>
    </div>
  );
}

export function ComboboxDemo() {
  const [owner, setOwner] = useState<string | null>("nadia");
  const [tags, setTags] = useState<string[]>(["logistics", "annual"]);
  const [opts, setOpts] = useState([
    { value: "logistics", label: "Logistics" }, { value: "annual", label: "Annual" }, { value: "healthcare", label: "Healthcare" },
    { value: "sso", label: "SSO" }, { value: "agency", label: "Agency" }, { value: "finance", label: "Finance" }, { value: "education", label: "Education" },
  ]);
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <FormField label="Owner">
        <Combobox value={owner} onValueChange={setOwner} placeholder="Assign owner" searchPlaceholder="Search people" options={[
          { value: "nadia", label: "Nadia Karim" }, { value: "rafi", label: "Rafi Ahmed" }, { value: "tanvir", label: "Tanvir Hasan" }, { value: "mira", label: "Mira Okafor" },
        ]} />
      </FormField>
      <FormField label="Tags" help="Type a new tag and press Enter to create it">
        <Combobox multiple value={tags} onValueChange={setTags} options={opts} placeholder="Add tags"
          onCreate={(l) => { const v = l.toLowerCase(); setOpts([...opts, { value: v, label: l }]); setTags([...tags, v]); }} />
      </FormField>
    </div>
  );
}

/* ===== Choice controls ===== */

export function CheckboxDemo() {
  const [items, setItems] = useState({ invoices: true, payments: true, exports: false });
  const all = Object.values(items);
  const state = all.every(Boolean) ? true : all.some(Boolean) ? "indeterminate" : false;
  return (
    <div className="flex flex-col gap-3">
      <Checkbox label="All notifications" checked={state} onCheckedChange={() => {
        const v = state !== true; setItems({ invoices: v, payments: v, exports: v });
      }} />
      <div className="ml-6 flex flex-col gap-2.5">
        <Checkbox label="Invoices sent" checked={items.invoices} onCheckedChange={(c) => setItems({ ...items, invoices: c === true })} />
        <Checkbox label="Payments failed" description="Includes retries" checked={items.payments} onCheckedChange={(c) => setItems({ ...items, payments: c === true })} />
        <Checkbox label="Exports finished" checked={items.exports} onCheckedChange={(c) => setItems({ ...items, exports: c === true })} />
      </div>
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  );
}

export function RadioDemo() {
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup defaultValue="monthly" aria-label="Billing cycle">
        <Radio value="monthly" label="Monthly" description="Billed on the 1st" />
        <Radio value="annual" label="Annual" description="Two months free" />
        <Radio value="custom" label="Custom contract" disabled />
      </RadioGroup>
      <RadioGroup defaultValue="all" orientation="horizontal" aria-label="Scope">
        <Radio value="all" label="All customers" />
        <Radio value="active" label="Active only" />
      </RadioGroup>
    </div>
  );
}

export function SwitchDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Switch label="Two-factor authentication" description="Required for all admins" defaultChecked labelPosition="left" />
      <Switch label="Public status page" labelPosition="left" />
      <Switch label="Small switch" size="sm" />
      <Switch label="Disabled" disabled defaultChecked />
    </div>
  );
}

export function SliderDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Slider defaultValue={[60]} max={100} step={5} showValue format={(v) => `${v}%`} aria-label="Health threshold" />
      <Slider defaultValue={[20, 80]} max={100} showValue format={(v) => `$${v}k`} aria-label="MRR range" />
      <Slider defaultValue={[40]} disabled showValue />
    </div>
  );
}

/* ===== Date and time ===== */

export function DateDemos() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 10, 14));
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 9, 6), to: new Date(2026, 10, 3) });
  const [time, setTime] = useState<string | null>("09:30");
  const today = new Date(2026, 10, 5);
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Due date">
        <DatePicker value={date} onChange={setDate} min={today} presets={[
          { label: "In 7 days", date: new Date(2026, 10, 12) }, { label: "In 14 days", date: new Date(2026, 10, 19) }, { label: "In 30 days", date: new Date(2026, 11, 5) },
        ]} />
      </FormField>
      <FormField label="Period">
        <DateRangePicker value={range} onChange={setRange} presets={[
          { label: "Last 7 days", range: { from: new Date(2026, 9, 30), to: today } },
          { label: "Last 30 days", range: { from: new Date(2026, 9, 7), to: today } },
          { label: "This quarter", range: { from: new Date(2026, 9, 1), to: today } },
        ]} />
      </FormField>
      <FormField label="Send at"><TimePicker value={time} onChange={setTime} step={30} /></FormField>
      <FormField label="Invalid" error="Pick a date in the future"><DatePicker value={null} onChange={() => {}} /></FormField>
      <FormField label="12-hour"><TimePicker value="14:00" onChange={() => {}} hour12 /></FormField>
      <FormField label="Disabled" disabled><DatePicker value={date} onChange={setDate} /></FormField>
    </div>
  );
}

/* ===== Upload ===== */

export function UploadDemo() {
  const [items, setItems] = useState<UploadItem[]>([
    { id: "a", name: "customers-q3.csv", size: 182_000, status: "done" },
    { id: "b", name: "contract-orbital.pdf", size: 2_400_000, status: "error", error: "Connection lost at 64%" },
  ]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearInterval), []);
  const start = (f: File, id = `${f.name}-${Date.now()}`) => {
    setItems((l) => [...l.filter((x) => x.id !== id), { id, name: f.name, size: f.size, status: "uploading", progress: 0 }]);
    const t = window.setInterval(() => {
      setItems((l) => l.map((x) => {
        if (x.id !== id || x.status !== "uploading") return x;
        const p = (x.progress ?? 0) + 12;
        if (p >= 100) { clearInterval(t); return { ...x, status: "done", progress: undefined }; }
        return { ...x, progress: p };
      }));
    }, 180);
    timers.current.push(t);
  };
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <FileUpload accept=".csv,.xlsx,.pdf" maxSize={10 * 1024 * 1024} items={items}
        onFiles={(fs) => fs.forEach((f) => start(f))}
        onRemove={(id) => setItems((l) => l.filter((x) => x.id !== id))}
        onRetry={(id) => { const it = items.find((x) => x.id === id); if (it) start(new File(["x"], it.name), id); }} />
      <FileUpload compact accept="image/*" multiple={false} onFiles={() => {}} />
    </div>
  );
}

/* ===== Inline edit ===== */

export function InlineEditDemo() {
  const [name, setName] = useState("Northwind Logistics");
  const [domain, setDomain] = useState("northwind.co");
  return (
    <div className="flex w-full max-w-md flex-col gap-1">
      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <span className="text-small text-subtle">Name</span>
        <InlineEdit label="Company name" value={name} onSave={setName} validate={(v) => (v.trim() ? null : "Name can't be empty")} />
      </div>
      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <span className="text-small text-subtle">Domain</span>
        <InlineEdit label="Domain" value={domain} onSave={async (v) => { await new Promise((r) => setTimeout(r, 500)); setDomain(v); }} />
      </div>
      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <span className="text-small text-subtle">Account ID</span>
        <InlineEdit label="Account ID" value="cus_01HZ8K2M4N" onSave={() => {}} readOnly />
      </div>
    </div>
  );
}

/* ===== Docs ===== */

const fieldControlProps = [
  { name: "invalid", type: "boolean", description: "Red ring + aria-invalid. Set automatically inside a FormField with an error." },
  { name: "readOnly", type: "boolean", description: "Quiet surface, no ring, still selectable and focusable." },
  { name: "disabled", type: "boolean", description: "Not focusable, 50% opacity. Explain why nearby if it isn't obvious." },
];

export const docs: DocPage[] = [
  {
    slug: "input", title: "Input", group: "Data entry", section: "Components", source: "data-entry", keywords: ["text field", "textbox", "search", "password", "number", "textarea"],
    summary: "Single-line text entry with icons, text add-ons and a clear button. Every field shares one shell: a hairline ring that strengthens on hover and becomes a focus ring on focus.",
    whenToUse: ["Free text a user types: names, emails, ids, amounts.", "Search fields in toolbars (size sm)."],
    whenNot: ["Picking from known options — use Select or Combobox.", "Long text — use Textarea."],
    demos: [
      { id: "InputBasics", title: "Icons, prefix, suffix, clearable", render: InputBasics, full: true },
      { id: "InputSizes", title: "Sizes", render: InputSizes, full: true },
      { id: "InputStates", title: "States", description: "Default, error, read-only and disabled. Hover a field to see the ring strengthen; Tab to see focus.", render: InputStates, full: true },
      { id: "SpecialInputs", title: "Search, password, number, textarea", render: SpecialInputs, full: true },
    ],
    api: [
      { title: "Input", props: [
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "26 / 30 / 36px." },
        { name: "leading", type: "ReactNode", description: "Icon inside the field, left." },
        { name: "prefix", type: "ReactNode", description: "Muted text before the value (https://)." },
        { name: "suffix", type: "ReactNode", description: "Muted text after the value (USD, a Kbd)." },
        { name: "trailing", type: "ReactNode", description: "Icon or control on the right." },
        { name: "clearable", type: "boolean", description: "Shows × when there's a value." },
        { name: "onClear", type: "() => void", description: "Called after clearing (needed for controlled inputs)." },
        ...fieldControlProps,
      ] },
      { title: "NumberInput", props: [
        { name: "value / onValueChange", type: "number | null", description: "Controlled number. null when empty." },
        { name: "min / max / step", type: "number", description: "Clamped on blur and stepping." },
      ] },
      { title: "Textarea", props: [{ name: "autoGrow", type: "boolean", description: "Grows with content (field-sizing)." }, ...fieldControlProps] },
    ],
    a11y: [
      "Inside a FormField the input gets the label's id, aria-describedby for help and error text, and aria-invalid automatically.",
      "Clicking anywhere in the field shell (icons, padding) focuses the input.",
      "The clear and show-password buttons are real buttons with labels; NumberInput exposes role=spinbutton with min/max/now.",
    ],
    dos: [
      { do: "Put format hints in the placeholder or help text: “name@company.com”.", dont: "Use the placeholder as the only label — it disappears when typing." },
      { do: "Show errors after the user leaves the field or submits.", dont: "Show red errors while the user is still typing the first character." },
    ],
  },
  {
    slug: "form-field", title: "Form field", group: "Data entry", section: "Components", source: "data-entry", keywords: ["label", "error", "validation", "form layout", "help text"],
    summary: "Wires a label, required mark, help text, error message and character count to one control — ids and aria attributes are handled for you. FormLayout and FormSection arrange fields without cards.",
    demos: [
      { id: "FormFieldDemo", title: "Validation", description: "Submit with an empty name to see the error state.", render: FormFieldDemo, full: true },
      { id: "FormLayouts", title: "Horizontal and inline layouts", description: "Horizontal puts labels in a 200px column from 768px up; inline is for quick-add rows.", render: FormLayouts, full: true },
      { id: "FormSections", title: "Sections", description: "Settings pages group fields with a title column and hairlines, not boxes.", render: FormSections, full: true },
    ],
    api: [{ title: "FormField", props: [
      { name: "label", type: "ReactNode", description: "Visible label, linked to the control." },
      { name: "required", type: "boolean", description: "Red * and `required` on the control." },
      { name: "optional", type: "boolean", description: "“Optional” after the label. Use one convention per form." },
      { name: "help", type: "ReactNode", description: "Grey hint under the control." },
      { name: "error", type: "ReactNode", description: "Replaces nothing — shows above help, marks the control invalid, announced via role=alert." },
      { name: "count", type: "{ value: number; max: number }", description: "Character count; turns red over the max." },
      { name: "layout", type: '"vertical" | "horizontal"', default: '"vertical"', description: "" },
      { name: "labelAside", type: "ReactNode", description: "Element on the label row (e.g. “Forgot password?”)." },
    ] }],
    a11y: ["Errors are linked with aria-describedby and announced when they appear.", "Required is conveyed by the `required` attribute, not just the asterisk."],
    dos: [{ do: "Write errors that say how to fix it: “Enter a valid URL, like fernhill.io”.", dont: "Write “Invalid input” or “Error 422”." }],
  },
  {
    slug: "select", title: "Select", group: "Data entry", section: "Components", source: "data-entry",
    summary: "Picks one value from a short list. Options can have descriptions, icons and groups.",
    whenToUse: ["Up to ~12 known options."], whenNot: ["Long or searchable lists — use Combobox.", "2–4 options always visible — use Radio or SegmentedControl."],
    demos: [{ id: "SelectDemo", title: "Select", render: SelectDemo, full: true }],
    api: [{ props: [
      { name: "options", type: "SelectOption[]", description: "{ value, label, description?, icon?, disabled? }" },
      { name: "groups", type: "{ label; options }[]", description: "Grouped options instead of `options`." },
      { name: "value / defaultValue / onValueChange", type: "string", description: "" },
      { name: "placeholder", type: "string", default: '"Select"', description: "" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "" }, ...fieldControlProps,
    ] }],
    a11y: ["Built on Radix Select: type-ahead, arrow keys, Home/End, Esc, and correct listbox semantics."],
  },
  {
    slug: "combobox", title: "Combobox", group: "Data entry", section: "Components", source: "data-entry", keywords: ["autocomplete", "multi select", "tags input"],
    summary: "Searchable select, single or multiple. In multiple mode, chosen values show as removable tags inside the field and you can create new ones.",
    demos: [{ id: "ComboboxDemo", title: "Single and multiple", render: ComboboxDemo, full: true }],
    api: [{ props: [
      { name: "multiple", type: "boolean", description: "Switches value to string[]." },
      { name: "value / onValueChange", type: "string | null | string[]", description: "" },
      { name: "onCreate", type: "(label: string) => void", description: "Offer “Create …” when nothing matches." },
      { name: "maxTags", type: "number", default: "3", description: "Tags shown before “+N”." },
      { name: "loading", type: "boolean", description: "Spinner in the trigger; “Loading…” in the list." },
    ] }],
    a11y: ["Trigger is role=combobox; the list uses aria-activedescendant so focus stays in the search input.", "Backspace on an empty search removes the last tag."],
  },
  {
    slug: "checkbox", title: "Checkbox", group: "Data entry", section: "Components", source: "data-entry",
    summary: "Toggles one option on or off, or selects several from a list. Supports an indeterminate state for “select all”.",
    demos: [{ id: "CheckboxDemo", title: "Group with indeterminate parent", render: CheckboxDemo, full: true }],
    api: [{ props: [
      { name: "checked", type: 'boolean | "indeterminate"', description: "" },
      { name: "onCheckedChange", type: "(checked) => void", description: "" },
      { name: "label / description", type: "ReactNode", description: "Clickable label and grey description." },
    ] }],
    a11y: ["Indeterminate is announced as “mixed”.", "Label is a real <label> so the hit area includes the text."],
  },
  {
    slug: "radio", title: "Radio", group: "Data entry", section: "Components", source: "data-entry",
    summary: "Picks one option when all choices should stay visible.",
    demos: [{ id: "RadioDemo", title: "Vertical and horizontal", render: RadioDemo, full: true }],
    api: [{ title: "RadioGroup", props: [{ name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Arrow keys follow the orientation." }, { name: "value / defaultValue / onValueChange", type: "string", description: "" }] }, { title: "Radio", props: [{ name: "value", type: "string", description: "" }, { name: "label / description", type: "ReactNode", description: "" }] }],
  },
  {
    slug: "switch", title: "Switch", group: "Data entry", section: "Components", source: "data-entry", keywords: ["toggle"],
    summary: "Turns a setting on or off immediately. If the change needs a Save button, use a Checkbox instead.",
    demos: [{ id: "SwitchDemo", title: "Settings rows", render: SwitchDemo, full: true }],
    api: [{ props: [{ name: "labelPosition", type: '"left" | "right"', default: '"right"', description: "Left for settings lists (label leads, switch right-aligned)." }, { name: "size", type: '"sm" | "md"', default: '"md"', description: "" }] }],
    dos: [{ do: "Apply the change instantly and confirm with a toast if it matters.", dont: "Put switches in a form that only saves on submit." }],
  },
  {
    slug: "slider", title: "Slider", group: "Data entry", section: "Components", source: "data-entry",
    summary: "Picks a value or range on a continuous scale where the exact number matters less than the position.",
    demos: [{ id: "SliderDemo", title: "Single, range, disabled", render: SliderDemo, full: true }],
    api: [{ props: [{ name: "value / defaultValue", type: "number[]", description: "Two values make a range." }, { name: "showValue", type: "boolean", description: "Readout on the right." }, { name: "format", type: "(n) => string", description: "" }] }],
  },
  {
    slug: "date-picker", title: "Date & time", group: "Data entry", section: "Components", source: "data-entry", keywords: ["calendar", "date range", "time picker"],
    summary: "DatePicker, DateRangePicker and TimePicker. The calendar is keyboard-navigable (arrows, PageUp/PageDown, Home/End) and uses the browser's locale for names.",
    demos: [{ id: "DateDemos", title: "Pickers", description: "Dates before Nov 5, 2026 are disabled in the first picker. Ranges show two months from 768px.", render: DateDemos, full: true }],
    api: [
      { title: "DatePicker", props: [{ name: "value / onChange", type: "Date | null", description: "" }, { name: "min / max", type: "Date", description: "" }, { name: "isDisabled", type: "(d: Date) => boolean", description: "e.g. weekends." }, { name: "presets", type: "{ label; date }[]", description: "Shortcuts column from 640px." }] },
      { title: "DateRangePicker", props: [{ name: "value / onChange", type: "{ from: Date | null; to: Date | null }", description: "Applied only on “Apply”." }, { name: "presets", type: "{ label; range }[]", description: "" }] },
      { title: "TimePicker", props: [{ name: "value / onChange", type: 'string | null ("HH:mm")', description: "" }, { name: "step", type: "5 | 10 | 15 | 30 | 60", default: "15", description: "" }, { name: "hour12", type: "boolean", description: "" }] },
    ],
  },
  {
    slug: "file-upload", title: "File upload", group: "Data entry", section: "Components", source: "data-entry", keywords: ["dropzone", "drag and drop"],
    summary: "Drag-and-drop or click to browse, with type and size validation and a per-file progress list. You own the actual upload; the component shows its state.",
    demos: [{ id: "UploadDemo", title: "Zone and compact", description: "Drop a file to see simulated progress. The failed item can be retried.", render: UploadDemo, full: true }],
    api: [{ props: [
      { name: "onFiles", type: "(files: File[]) => void", description: "Accepted files only." },
      { name: "items", type: "UploadItem[]", description: "{ id, name, size, status: uploading | done | error, progress?, error? }" },
      { name: "accept / maxSize", type: "string / number", description: "Rejected files show an inline error." },
      { name: "compact", type: "boolean", description: "30px button-style target." },
    ] }],
  },
  {
    slug: "inline-edit", title: "Inline edit", group: "Data entry", section: "Components", source: "data-entry",
    summary: "A value that reads as plain text and turns into an input on click. Enter or blur saves, Esc cancels. Good for detail sheets where most fields are read more than edited.",
    demos: [{ id: "InlineEditDemo", title: "Detail fields", description: "Domain simulates a 500ms save.", render: InlineEditDemo, full: true }],
    api: [{ props: [{ name: "value / onSave", type: "string / (v) => void | Promise", description: "A rejected promise keeps the field open with the error." }, { name: "validate", type: "(v) => string | null", description: "" }, { name: "label", type: "string", description: "Required accessible name." }] }],
  },
];

