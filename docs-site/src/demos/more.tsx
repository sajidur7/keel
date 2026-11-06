import { useState } from "react";
import {
  Accordion, AccordionItem, Anchor, Avatar, Badge, Button, Cascader, Collapsible, ColorPicker, Coachmark, CopyButton,
  Code, FormField, IconBell, IconButton, IconColumns, IconGrid, IconList, IconSettings, ImagePreview, Inline, InlineMessage, Input,
  OtpInput, Popconfirm, ProgressDots, Rating, Stack, StatusPill, Sticky, Tag, Toggle, ToggleGroup, ToggleGroupItem, Transfer, Tree,
  type TreeNode, useToast,
} from "@keel/components";
import type { DocPage } from "../docs/types";

/* ===== Accordion ===== */

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="billing" className="w-full max-w-xl">
      <AccordionItem value="billing" title="Billing" description="Plan, seats and invoices" meta={<StatusPill size="sm" status="success">Active</StatusPill>}>
        Invoices are sent on the first business day of each month. Seats are prorated when added mid-cycle.
      </AccordionItem>
      <AccordionItem value="security" icon={<IconSettings />} title="Security" description="SSO, 2FA, session length">
        Two-factor authentication is required for every admin. SSO is enforced for fernhill.io accounts.
      </AccordionItem>
      <AccordionItem value="api" title="API access" description="Keys and webhooks" meta="3 keys">
        Keys act as the workspace. Rotate them every 90 days.
      </AccordionItem>
      <AccordionItem value="legacy" title="Legacy import" description="Available on Enterprise" disabled>Unavailable</AccordionItem>
    </Accordion>
  );
}

export function CollapsibleDemo() {
  return (
    <Collapsible trigger="Advanced options" className="w-full max-w-md">
      <Stack gap={4}>
        <FormField label="Webhook URL"><Input placeholder="https://api.company.com/hooks" /></FormField>
        <FormField label="Retry attempts"><Input defaultValue="3" className="tabular" /></FormField>
      </Stack>
    </Collapsible>
  );
}

export function ToggleDemo() {
  const [view, setView] = useState("list");
  return (
    <>
      <Toggle aria-label="Show archived">Show archived</Toggle>
      <Toggle aria-label="Pin" defaultPressed>Pinned</Toggle>
      <Toggle disabled>Disabled</Toggle>
      <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)} aria-label="View">
        <ToggleGroupItem value="list" aria-label="List view"><IconList /></ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view"><IconGrid /></ToggleGroupItem>
        <ToggleGroupItem value="columns" aria-label="Board view"><IconColumns /></ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" defaultValue={["paid"]} aria-label="Show">
        <ToggleGroupItem value="paid" className="px-2.5 text-caption">Paid</ToggleGroupItem>
        <ToggleGroupItem value="due" className="px-2.5 text-caption">Due</ToggleGroupItem>
        <ToggleGroupItem value="void" className="px-2.5 text-caption">Void</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}

/* ===== Tree ===== */

const org: TreeNode[] = [
  { id: "ops", label: "Operations", meta: "24", children: [
    { id: "ops-bd", label: "Dhaka", meta: "14", children: [{ id: "ops-bd-1", label: "Fulfilment", meta: "9" }, { id: "ops-bd-2", label: "Support", meta: "5" }] },
    { id: "ops-sg", label: "Singapore", meta: "10" },
  ] },
  { id: "fin", label: "Finance", meta: "6", children: [{ id: "fin-ar", label: "Receivables", meta: "4" }, { id: "fin-ap", label: "Payables", meta: "2", disabled: true }] },
  { id: "eng", label: "Engineering", meta: "18", loading: true },
];

export function TreeDemo() {
  const [sel, setSel] = useState<string | null>("ops-bd");
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <Tree aria-label="Teams" data={org} selected={sel} onSelect={setSel} defaultExpanded={["ops", "ops-bd"]} />
      <Tree aria-label="Permission scopes" checkable showIcons={false} defaultExpanded={["ops", "fin"]} data={org} />
    </div>
  );
}

/* ===== Transfer / Cascader ===== */

const perms = [
  { key: "customers.view", label: "View customers" }, { key: "customers.edit", label: "Edit customers" },
  { key: "customers.delete", label: "Delete customers", description: "Irreversible" }, { key: "invoices.view", label: "View invoices" },
  { key: "invoices.send", label: "Send invoices" }, { key: "invoices.refund", label: "Refund payments" },
  { key: "members.invite", label: "Invite members" }, { key: "keys.manage", label: "Manage API keys", disabled: true },
];

export function TransferDemo() {
  const [value, setValue] = useState(["customers.view", "invoices.view"]);
  return <Transfer className="w-full" items={perms} value={value} onChange={setValue} titles={["Available permissions", "Editor role"]} height={220} />;
}

export function CascaderDemo() {
  const [v, setV] = useState<string[]>(["apac", "bd", "dhaka"]);
  return (
    <FormField label="Warehouse" className="w-full max-w-xs">
      <Cascader value={v} onChange={setV} options={[
        { value: "apac", label: "Asia Pacific", children: [
          { value: "bd", label: "Bangladesh", children: [{ value: "dhaka", label: "Dhaka" }, { value: "ctg", label: "Chattogram" }] },
          { value: "sg", label: "Singapore", children: [{ value: "jurong", label: "Jurong" }] },
        ] },
        { value: "emea", label: "Europe", children: [{ value: "de", label: "Germany", children: [{ value: "berlin", label: "Berlin" }, { value: "hamburg", label: "Hamburg", disabled: true }] }] },
        { value: "amer", label: "Americas", children: [{ value: "ca", label: "Canada", children: [{ value: "toronto", label: "Toronto" }] }] },
      ]} />
    </FormField>
  );
}

/* ===== Color / Rating / OTP ===== */

export function ColorDemo() {
  const [c, setC] = useState("#3ec8b4");
  return (
    <>
      <ColorPicker value={c} onChange={setC} />
      <span className="flex items-center gap-2 text-small text-soft"><span className="size-4 rounded-full" style={{ background: c }} />Label color</span>
      <ColorPicker value="#6f727b" onChange={() => {}} disabled />
    </>
  );
}

export function RatingDemo() {
  const [r, setR] = useState(4);
  return (
    <>
      <Rating value={r} onChange={setR} label="Support quality" />
      <span className="tabular text-small text-subtle">{r} of 5</span>
      <Rating value={3} readOnly size={14} label="Average rating" />
    </>
  );
}

export function OtpDemo() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  return (
    <Stack gap={3}>
      <OtpInput value={code} onChange={(v) => { setCode(v); setErr(false); }} onComplete={(v) => setErr(v !== "246810")} invalid={err} />
      {err ? <InlineMessage tone="danger">That code didn't match. Try again or resend.</InlineMessage> : <span className="text-caption text-subtle">Hint: 246810. Paste works too.</span>}
      <OtpInput value="1234" onChange={() => {}} length={4} disabled aria-label="Disabled code" />
    </Stack>
  );
}

/* ===== Overlays ===== */

export function PopconfirmDemo() {
  const toast = useToast();
  return (
    <>
      <Popconfirm title="Remove this tag?" description="It stays on past invoices." confirmLabel="Remove" onConfirm={() => toast({ title: "Tag removed" })}>
        <Button size="sm">Remove tag</Button>
      </Popconfirm>
      <Popconfirm tone="danger" title="Revoke this key?" description="Requests using it will fail immediately." confirmLabel="Revoke" side="bottom"
        onConfirm={() => new Promise((r) => setTimeout(r, 600)).then(() => toast({ title: "Key revoked" }))}>
        <Button size="sm" variant="danger-ghost">Revoke key</Button>
      </Popconfirm>
    </>
  );
}

export function CoachmarkDemo() {
  const [step, setStep] = useState<number | null>(null);
  const steps = [
    { title: "Filter by plan", body: "Narrow the list with Label | Value filters. Counts show how many rows each option keeps." },
    { title: "Open the command palette", body: "Press ⌘K anywhere to jump to a page or run an action." },
  ];
  return (
    <>
      <Button size="sm" variant="primary" onClick={() => setStep(1)}>Start tour</Button>
      <Coachmark open={step === 1} onOpenChange={(o) => !o && setStep(null)} step={1} total={2} onNext={() => setStep(2)} {...steps[0]}>
        <Button size="sm">Plan · All</Button>
      </Coachmark>
      <Coachmark open={step === 2} onOpenChange={(o) => !o && setStep(null)} step={2} total={2} onBack={() => setStep(1)} {...steps[1]}>
        <Button size="sm">Search ⌘K</Button>
      </Coachmark>
      <ProgressDots count={4} current={1} />
    </>
  );
}

/* ===== Small pieces ===== */

export function BadgeDemo() {
  return (
    <>
      <Badge count={3}><IconButton label="Notifications" variant="secondary"><IconBell /></IconButton></Badge>
      <Badge dot><IconButton label="Inbox" variant="secondary"><IconBell /></IconButton></Badge>
      <Badge count={120} tone="neutral"><IconButton label="Tasks" variant="secondary"><IconList /></IconButton></Badge>
      <Badge dot tone="data"><Avatar name="Nadia Karim" size="lg" /></Badge>
    </>
  );
}

export function InlineMessageDemo() {
  return (
    <Stack gap={3}>
      <InlineMessage tone="info" detail="Synced every 15 minutes from Stripe.">Last synced 4 min ago</InlineMessage>
      <InlineMessage tone="success">Domain verified</InlineMessage>
      <InlineMessage tone="warning">Card expires this month</InlineMessage>
      <InlineMessage tone="danger">Webhook failing</InlineMessage>
    </Stack>
  );
}

export function CopyDemo() {
  return (
    <Inline gap={2}>
      <Code>cus_01HZ8K2M4N</Code><CopyButton value="cus_01HZ8K2M4N" label="Copy customer ID" size="xs" />
      <span className="mx-2 h-4 w-px bg-border" />
      <Code>whsec_3f9a2c71e4b8</Code><CopyButton value="whsec_3f9a2c71e4b8" label="Copy secret" size="xs" />
    </Inline>
  );
}

export function ImageDemo() {
  const src = (bg: string, label: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="${bg}"/><text x="40" y="70" font-family="monospace" font-size="28" fill="#a6a9b1">${label}</text><rect x="40" y="110" width="560" height="2" fill="#373a40"/><rect x="40" y="150" width="300" height="14" rx="3" fill="#373a40"/><rect x="40" y="185" width="420" height="14" rx="3" fill="#2e3135"/><rect x="40" y="220" width="360" height="14" rx="3" fill="#2e3135"/></svg>`)}`;
  return (
    <>
      <ImagePreview src={src("#1e2023", "INV-2064 · receipt")} alt="Receipt for INV-2064" />
      <ImagePreview src={src("#18191c", "Contract · Orbital Labs")} alt="Orbital Labs contract, page 1" />
    </>
  );
}

export function LayoutHelpersDemo() {
  return (
    <div className="h-56 w-full overflow-auto rounded-lg shadow-card" tabIndex={0}>
      <Sticky className="flex items-center justify-between border-b border-border bg-background px-3 py-2">
        <span className="text-small font-medium">Sticky toolbar</span><Button size="xs">Action</Button>
      </Sticky>
      <Stack gap={3} className="p-3">
        <Inline gap={1.5}>{["Logistics", "Annual", "SSO", "Healthcare", "Agency"].map((t) => <Tag key={t}>{t}</Tag>)}</Inline>
        {Array.from({ length: 8 }, (_, i) => <p key={i} className="text-small text-subtle">Row {i + 1} — scroll to see the toolbar stay pinned.</p>)}
      </Stack>
    </div>
  );
}

export function AnchorDemo() {
  return (
    <div className="flex w-full gap-6">
      <div className="h-48 flex-1 overflow-auto rounded-lg p-3 shadow-card" id="anchor-scroll">
        {["Overview", "Billing", "Members", "Danger zone"].map((h) => (
          <section key={h} id={`a-${h}`} className="py-3"><h4 className="text-small font-medium">{h}</h4><p className="text-caption text-subtle">Section content for {h.toLowerCase()}. Lorem-free sample text that keeps going for a few lines to give the section height.</p></section>
        ))}
      </div>
      <Anchor className="w-36 shrink-0" items={["Overview", "Billing", "Members", "Danger zone"].map((h) => ({ id: `a-${h}`, label: h }))} />
    </div>
  );
}

export const docs: DocPage[] = [
  { slug: "accordion", title: "Accordion", group: "Data display", section: "Components", source: "more", keywords: ["collapse", "expand", "disclosure", "collapsible"],
    summary: "Sections that expand in place, separated by hairlines. Collapsible is the single show/hide version for “Advanced options”.",
    whenToUse: ["Long settings pages split into scannable groups.", "Optional detail the user rarely needs."], whenNot: ["Primary content most users need — show it."],
    demos: [{ id: "AccordionDemo", title: "Accordion", render: AccordionDemo, full: true }, { id: "CollapsibleDemo", title: "Collapsible", render: CollapsibleDemo, full: true }],
    api: [{ title: "Accordion", props: [{ name: "type", type: '"single" | "multiple"', description: "One or many open." }, { name: "collapsible", type: "boolean", description: "Single mode: allow closing all." }, { name: "defaultValue / value / onValueChange", type: "string | string[]", description: "" }] },
      { title: "AccordionItem", props: [{ name: "value / title", type: "string / ReactNode", description: "Required." }, { name: "description / meta / icon", type: "ReactNode", description: "" }, { name: "disabled", type: "boolean", description: "" }] }],
    a11y: ["Triggers are buttons inside headings with aria-expanded; ↑/↓ move between triggers (Radix)."] },
  { slug: "toggle", title: "Toggle & toggle group", group: "General", section: "Components", source: "more", keywords: ["toggle button", "pressed"],
    summary: "Buttons that stay pressed. ToggleGroup for icon view switches or multi-select chips.", demos: [{ id: "ToggleDemo", title: "Toggles", render: ToggleDemo }],
    api: [{ title: "ToggleGroup", props: [{ name: "type", type: '"single" | "multiple"', description: "" }, { name: "value / onValueChange", type: "string | string[]", description: "" }] }],
    a11y: ["Toggle uses aria-pressed; groups use roving focus with arrow keys."] },
  { slug: "tree", title: "Tree", group: "Data display", section: "Components", source: "more", keywords: ["hierarchy", "folders", "org chart", "tree select"],
    summary: "Hierarchical data with expand/collapse, single selection or checkboxes with indeterminate parents, and lazy-loading nodes.",
    demos: [{ id: "TreeDemo", title: "Select and checkable", description: "Use the keyboard: ↑/↓, → to open, ← to close or go to parent, Space to check. Engineering shows the loading state.", render: TreeDemo, full: true }],
    api: [{ props: [
      { name: "data", type: "TreeNode[]", description: "{ id, label, text?, icon?, meta?, children?, disabled?, loading? }" },
      { name: "selected / onSelect", type: "string | null / (id, node) => void", description: "Single-select mode." },
      { name: "checkable / checked / onCheckedChange", type: "boolean / Set<string>", description: "Checkbox mode; parents compute indeterminate." },
      { name: "defaultExpanded / expanded / onExpandedChange", type: "string[] / Set<string>", description: "" },
      { name: "aria-label", type: "string", description: "Required." },
    ] }],
    a11y: ["Implements the ARIA tree pattern with roving tabindex, aria-level and aria-expanded."] },
  { slug: "transfer", title: "Transfer", group: "Data entry", section: "Components", source: "more", keywords: ["dual list", "permissions", "assign"],
    summary: "Move items between two searchable lists. The standard way to assign permissions or members to a role.",
    demos: [{ id: "TransferDemo", title: "Assign permissions", render: TransferDemo, full: true }],
    api: [{ props: [{ name: "items", type: "{ key; label; description?; disabled? }[]", description: "" }, { name: "value / onChange", type: "string[]", description: "Keys on the right." }, { name: "titles", type: "[string, string]", description: "" }, { name: "height", type: "number", default: "260", description: "List height." }] }] },
  { slug: "cascader", title: "Cascader", group: "Data entry", section: "Components", source: "more", keywords: ["nested select", "region", "category"],
    summary: "Picks a path through nested options in side-by-side columns.", demos: [{ id: "CascaderDemo", title: "Region → country → site", render: CascaderDemo, full: true }],
    api: [{ props: [{ name: "options", type: "{ value; label; children?; disabled? }[]", description: "" }, { name: "value / onChange", type: "string[]", description: "The path." }, { name: "separator", type: "string", default: '" / "', description: "" }] }] },
  { slug: "color-picker", title: "Color picker", group: "Data entry", section: "Components", source: "more", keywords: ["color", "hex", "brand"],
    summary: "Hex field with presets and the system picker — for brand, label and chart colors.", demos: [{ id: "ColorDemo", title: "Color picker", render: ColorDemo }],
    api: [{ props: [{ name: "value / onChange", type: "string (#rrggbb)", description: "" }, { name: "presets", type: "string[]", description: "" }] }] },
  { slug: "rating", title: "Rating", group: "Data entry", section: "Components", source: "more", keywords: ["stars", "score"],
    summary: "Star rating as a radio group. Read-only for display.", demos: [{ id: "RatingDemo", title: "Rating", render: RatingDemo }],
    api: [{ props: [{ name: "value / onChange", type: "number", description: "" }, { name: "max", type: "number", default: "5", description: "" }, { name: "readOnly", type: "boolean", description: "" }] }] },
  { slug: "otp-input", title: "OTP input", group: "Data entry", section: "Components", source: "more", keywords: ["verification code", "2fa", "pin"],
    summary: "One-time code entry for 2FA and email verification. Paste fills every box.", demos: [{ id: "OtpDemo", title: "Code entry", render: OtpDemo, full: true }],
    api: [{ props: [{ name: "length", type: "number", default: "6", description: "" }, { name: "value / onChange / onComplete", type: "string", description: "" }, { name: "invalid / disabled", type: "boolean", description: "" }] }],
    a11y: ["Each box is labelled “Digit N”; the group carries the field name. autocomplete=one-time-code lets phones offer the SMS code."] },
  { slug: "popconfirm", title: "Popconfirm", group: "Feedback", section: "Components", source: "more", keywords: ["confirm", "popover"],
    summary: "A small confirm anchored to its button for low-risk single-object actions.", demos: [{ id: "PopconfirmDemo", title: "Popconfirm", render: PopconfirmDemo }],
    api: [{ props: [{ name: "title / description", type: "ReactNode", description: "" }, { name: "tone", type: '"default" | "danger"', description: "" }, { name: "onConfirm", type: "() => void | Promise", description: "Shows loading until resolved." }] }] },
  { slug: "coachmark", title: "Coachmark & tour", group: "Feedback", section: "Components", source: "more", keywords: ["onboarding", "spotlight", "tour", "progress dots"],
    summary: "Onboarding hints anchored to real UI, one at a time, with progress dots. Show once; never block a task.",
    demos: [{ id: "CoachmarkDemo", title: "Two-step tour", render: CoachmarkDemo, minHeight: 200 }],
    api: [{ title: "Coachmark", props: [{ name: "open / onOpenChange", type: "boolean", description: "" }, { name: "title / body", type: "ReactNode", description: "" }, { name: "step / total / onNext / onBack", type: "number / () => void", description: "" }] }] },
  { slug: "badge", title: "Badge", group: "Data display", section: "Components", source: "more", keywords: ["indicator", "dot", "notification"],
    summary: "A dot or count on the corner of an icon button or avatar.", demos: [{ id: "BadgeDemo", title: "Badges", render: BadgeDemo }],
    api: [{ props: [{ name: "count / dot", type: "number / boolean", description: "" }, { name: "tone", type: '"danger" | "data" | "neutral"', default: '"danger"', description: "" }] }] },
  { slug: "inline-message", title: "Inline message", group: "Feedback", section: "Components", source: "more",
    summary: "Icon + one line beside a field or header, with optional detail on hover. Lighter than an Alert.", demos: [{ id: "InlineMessageDemo", title: "Tones", render: InlineMessageDemo, full: true }] },
  { slug: "copy-button", title: "Copy button", group: "General", section: "Components", source: "more",
    summary: "Copies a value and confirms with a check.", demos: [{ id: "CopyDemo", title: "Copy", render: CopyDemo }] },
  { slug: "image", title: "Image preview", group: "Data display", section: "Components", source: "more", keywords: ["thumbnail", "lightbox"],
    summary: "Thumbnail that opens a full-size preview dialog.", demos: [{ id: "ImageDemo", title: "Thumbnails", render: ImageDemo }] },
  { slug: "stack", title: "Stack, inline & sticky", group: "Layout", section: "Components", source: "more", keywords: ["space", "flex", "affix", "spacing"],
    summary: "Layout helpers on the spacing scale: vertical Stack, wrapping Inline (Ant Space), and Sticky (Ant Affix).",
    demos: [{ id: "LayoutHelpersDemo", title: "Stack, inline, sticky", render: LayoutHelpersDemo, full: true }],
    api: [{ title: "Stack / Inline", props: [{ name: "gap", type: "0 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10", description: "Spacing-scale step." }, { name: "align / justify / wrap", type: "Inline only", description: "" }] }] },
  { slug: "anchor", title: "Anchor", group: "Navigation", section: "Components", source: "more", keywords: ["toc", "on this page", "scrollspy"],
    summary: "On-this-page navigation that highlights the section in view.", demos: [{ id: "AnchorDemo", title: "Anchor", render: AnchorDemo, full: true }] },
];
