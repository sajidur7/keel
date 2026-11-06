import { useState } from "react";
import {
  Button, ButtonGroup, Divider, IconArchive, IconButton, IconChevronDown, IconDownload, IconEdit, IconMoreHorizontal,
  IconPlus, IconRefresh, IconSettings, IconTrash, Kbd, KbdGroup, Text,
} from "@keel/components";
import type { DocPage } from "../docs/types";

/* ===== Button ===== */

export function ButtonVariants() {
  return (
    <>
      <Button variant="primary">Create invoice</Button>
      <Button variant="secondary">Export</Button>
      <Button variant="muted">Duplicate</Button>
      <Button variant="subtle">Archive</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="link">View history</Button>
      <Button variant="danger">Delete customer</Button>
      <Button variant="danger-ghost">Remove</Button>
    </>
  );
}

export function ButtonSizes() {
  return (
    <>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <IconButton label="Settings" size="xs" variant="secondary"><IconSettings /></IconButton>
      <IconButton label="Settings" size="sm" variant="secondary"><IconSettings /></IconButton>
      <IconButton label="Settings" size="md" variant="secondary"><IconSettings /></IconButton>
      <IconButton label="Settings" size="lg" variant="secondary"><IconSettings /></IconButton>
    </>
  );
}

export function ButtonWithIcons() {
  return (
    <>
      <Button variant="primary" leading={<IconPlus />}>New customer</Button>
      <Button leading={<IconDownload />}>Export CSV</Button>
      <Button trailing={<IconChevronDown />}>Actions</Button>
      <Button size="sm" trailing={<Kbd>E</Kbd>}>Edit</Button>
    </>
  );
}

export function ButtonStates() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Button variant="primary" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
        Save changes
      </Button>
      <Button loading>Syncing</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button disabled>Disabled</Button>
      <Button variant="ghost" disabled>Disabled</Button>
    </>
  );
}

export function ButtonGroups() {
  return (
    <>
      <ButtonGroup>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save</Button>
      </ButtonGroup>
      <ButtonGroup attached>
        <Button leading={<IconEdit />}>Edit</Button>
        <Button leading={<IconArchive />}>Archive</Button>
        <IconButton label="More actions" variant="secondary"><IconMoreHorizontal /></IconButton>
      </ButtonGroup>
    </>
  );
}

export function IconButtons() {
  return (
    <>
      <IconButton label="Refresh"><IconRefresh /></IconButton>
      <IconButton label="More actions" variant="secondary"><IconMoreHorizontal /></IconButton>
      <IconButton label="Delete" variant="danger-ghost"><IconTrash /></IconButton>
      <IconButton label="Add" variant="primary"><IconPlus /></IconButton>
      <IconButton label="Loading" loading variant="secondary"><IconRefresh /></IconButton>
    </>
  );
}

/* ===== Typography ===== */

export function TypeScale() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Text variant="eyebrow">Monthly recurring revenue</Text>
      <Text variant="stat">$102,750</Text>
      <Text variant="display">Customers</Text>
      <Text variant="page">Billing settings</Text>
      <Text variant="title">Payment methods</Text>
      <Text variant="body">Invoices are sent on the first business day of each month.</Text>
      <Text variant="small" tone="soft">Last synced 4 minutes ago</Text>
      <Text variant="caption" tone="subtle">Created Nov 5, 2026 by Rafi Ahmed</Text>
      <Text variant="mono" tone="soft">cus_01HZ8K2M4N</Text>
    </div>
  );
}

export function TextTones() {
  return (
    <div className="flex flex-col gap-2">
      <Text>Foreground — primary content</Text>
      <Text tone="soft">Soft — secondary content, values in a list</Text>
      <Text tone="subtle">Subtle — labels, metadata, table headers</Text>
      <Text tone="faint">Faint — placeholders, disabled, eyebrows</Text>
    </div>
  );
}

/* ===== Kbd ===== */

export function KbdExamples() {
  return (
    <>
      <Kbd>⌘K</Kbd>
      <KbdGroup keys={["⌘", "Shift", "P"]} />
      <Kbd>Esc</Kbd>
      <span className="text-small text-subtle">Press <Kbd>/</Kbd> to search</span>
    </>
  );
}

/* ===== Divider ===== */

export function Dividers() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Divider />
      <Divider label="Or continue with" />
      <div className="flex h-5 items-center gap-3 text-small text-soft">
        <span>Edit</span><Divider orientation="vertical" /><span>Duplicate</span><Divider orientation="vertical" /><span>Archive</span>
      </div>
    </div>
  );
}

/* ===== Docs ===== */

const buttonProps = [
  { name: "variant", type: '"primary" | "secondary" | "muted" | "subtle" | "ghost" | "link" | "danger" | "danger-ghost"', default: '"secondary"', description: "Visual weight. Use one primary per view." },
  { name: "size", type: '"xs" | "sm" | "md" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"', default: '"md"', description: "Heights 22 / 26 / 30 / 36px. Toolbars use sm, forms md." },
  { name: "leading", type: "ReactNode", description: "Icon before the label." },
  { name: "trailing", type: "ReactNode", description: "Icon or Kbd after the label." },
  { name: "loading", type: "boolean", default: "false", description: "Shows a spinner, keeps the width, sets aria-busy, ignores clicks." },
  { name: "disabled", type: "boolean", default: "false", description: "Native disabled. Prefer explaining why an action isn't available." },
  { name: "asChild", type: "boolean", default: "false", description: "Render the child (e.g. a router Link) with button styles." },
];

export const docs: DocPage[] = [
  {
    slug: "button",
    title: "Button",
    group: "General",
    section: "Components",
    source: "general",
    keywords: ["cta", "action"],
    summary: "Triggers an action. Keel's primary button is white in dark mode and near-black in light mode — the only bright fill in the interface — so the one thing to do next is always obvious.",
    whenToUse: ["Committing or starting an action: save, create, send, export.", "Opening a menu of actions (with a trailing chevron).", "Toolbar actions next to filters (size sm)."],
    whenNot: ["Navigating to another page in body text — use a link.", "Toggling a view option — use SegmentedControl or Tabs.", "Showing a category or status — use Tag or StatusPill."],
    demos: [
      { id: "ButtonVariants", title: "Variants", description: "Primary for the main action, secondary for everything else. Muted and subtle sit quieter in dense toolbars. Danger only for destructive confirms.", render: ButtonVariants },
      { id: "ButtonSizes", title: "Sizes", description: "Four heights on Keel's control scale. Icon buttons are square at the same heights.", render: ButtonSizes },
      { id: "ButtonWithIcons", title: "With icons and shortcuts", render: ButtonWithIcons },
      { id: "ButtonStates", title: "Loading and disabled", description: "Click Save changes. Loading keeps the button's width so the layout doesn't jump.", render: ButtonStates },
      { id: "ButtonGroups", title: "Button group", description: "Spaced for sibling actions; attached for a single segmented control.", render: ButtonGroups },
    ],
    api: [{ title: "Button", props: buttonProps }, { title: "ButtonGroup", props: [{ name: "attached", type: "boolean", default: "false", description: "Join buttons into one control with hairline dividers." }] }],
    a11y: [
      "Renders a native <button type=\"button\"> so Enter and Space work and it's in the tab order.",
      "Focus shows a 2px ring offset from the button (shadow-focus) — visible on every surface and in both themes.",
      "Loading sets aria-busy and keeps the accessible name; the spinner itself is hidden from screen readers.",
      "Hover, active (1px press), focus-visible and disabled states are all distinct without relying on color alone.",
    ],
    dos: [
      { do: "Use one primary button per view, for the action most people take next.", dont: "Make every action primary or color CTAs blue/purple — color is reserved for status." },
      { do: "Label buttons with a verb and object: “Send invoice”, “Delete 3 customers”.", dont: "Use “OK”, “Submit” or “Yes” — the user has to read the context to know what happens." },
    ],
  },
  {
    slug: "icon-button",
    title: "IconButton",
    group: "General",
    section: "Components",
    source: "general",
    summary: "A square button with only an icon. It requires a `label`, used as the accessible name and the native title.",
    whenToUse: ["Repeated row actions (… menu), toolbar utilities, close buttons."],
    whenNot: ["The action is unique or important — add a visible label instead."],
    demos: [{ id: "IconButtons", title: "Icon buttons", description: "Ghost by default so they don't compete with content.", render: IconButtons }],
    api: [{ props: [{ name: "label", type: "string", description: "Required. Accessible name and tooltip text." }, { name: "size", type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: "22 / 26 / 30 / 36px squares." }, { name: "variant", type: "Button variant", default: '"ghost"', description: "Same variants as Button." }] }],
    a11y: ["`label` becomes aria-label, so screen readers announce the action, not the icon.", "Wrap in a Tooltip when the meaning isn't universal (a close × doesn't need one)."],
    dos: [{ do: "Use the same icon for the same action everywhere.", dont: "Use an icon-only button for a destructive action without a confirm." }],
  },
  {
    slug: "text",
    title: "Text",
    group: "General",
    section: "Components",
    source: "general",
    summary: "The Text component maps Keel's short type scale and four text greys. Hierarchy comes from size, weight and grey — not from boxes or color.",
    demos: [
      { id: "TypeScale", title: "Scale", render: TypeScale, full: true },
      { id: "TextTones", title: "Text greys", description: "Four steps. Most screens need only foreground, soft and subtle.", render: TextTones, full: true },
    ],
    api: [{ props: [
      { name: "variant", type: '"stat" | "display" | "page" | "title" | "body" | "body-medium" | "small" | "caption" | "eyebrow" | "mono"', default: '"body"', description: "Picks size, weight and the default element (h1 for page, h2 for title…)." },
      { name: "tone", type: '"default" | "soft" | "subtle" | "faint" | "success" | "warning" | "danger" | "info"', description: "Text color." },
      { name: "as", type: "ElementType", description: "Override the rendered element (keep heading order correct)." },
      { name: "truncate", type: "boolean", description: "Single line with ellipsis." },
    ] }],
    dos: [{ do: "Use the eyebrow style for section labels and KPI labels.", dont: "Bold a whole paragraph or use color to make text stand out." }],
  },
  {
    slug: "kbd",
    title: "Kbd",
    group: "General",
    section: "Components",
    source: "general",
    summary: "Shows a keyboard shortcut. Keel surfaces shortcuts in menus, tooltips and the command palette so power users can learn them in place.",
    demos: [{ id: "KbdExamples", title: "Keys and combos", render: KbdExamples }],
    api: [{ props: [{ name: "children", type: "ReactNode", description: "Key label. Use symbols: ⌘ ⇧ ⌥ ↵ Esc." }] }, { title: "KbdGroup", props: [{ name: "keys", type: "string[]", description: "One chip per key." }] }],
  },
  {
    slug: "divider",
    title: "Divider",
    group: "General",
    section: "Components",
    source: "general",
    summary: "A 1px hairline that separates groups. In Keel, dividers and whitespace do the grouping work that cards do elsewhere.",
    demos: [{ id: "Dividers", title: "Horizontal, labelled, vertical", render: Dividers, full: true }],
    api: [{ props: [{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "" }, { name: "label", type: "string", description: "Centered eyebrow label (horizontal only)." }, { name: "decorative", type: "boolean", default: "false", description: "Hide from assistive tech when purely visual." }] }],
  },
];
