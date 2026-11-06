import { CodeBlock, Kbd } from "@keel/components";
import type { DocPage } from "../docs/types";
import { SectionTitle } from "../docs/doc-ui";

function Rules({ items }: { items: string[] }) {
  return (
    <ul className="flex max-w-[74ch] list-disc flex-col gap-1.5 pl-5 text-small text-soft marker:text-faint">
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
}

function Anatomy({ rows }: { rows: [string, string][] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-card">
      {rows.map(([a, b], i) => (
        <div key={a} className="grid grid-cols-[28px_160px_minmax(0,1fr)] gap-3 border-b border-border px-3 py-2.5 text-small last:border-b-0 max-sm:grid-cols-[28px_minmax(0,1fr)]">
          <span className="tabular text-faint">{i + 1}</span>
          <span className="font-medium max-sm:col-start-2">{a}</span>
          <span className="text-soft max-sm:col-start-2">{b}</span>
        </div>
      ))}
    </div>
  );
}

function ListPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <SectionTitle>Anatomy</SectionTitle>
        <Anatomy rows={[
          ["Header", "Title + live status pill, primary action on the right (one), secondary actions as secondary buttons or in a … menu."],
          ["Tabs (optional)", "Saved views or record types (“All · Overdue · Drafts”) with counts."],
          ["Toolbar", "Search (sm, ⌘/), then Label | Value filter menus, then View (density, columns) on the right."],
          ["Table", "Name column first with a muted second line; status second; numbers right-aligned; row actions last."],
          ["Footer", "Range + pagination, or totals in the table footer."],
        ]} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Rules</SectionTitle>
        <Rules items={[
          "Filters apply instantly; show counts in filter options so users avoid empty results.",
          "Selecting rows swaps the toolbar for bulk actions, with “N selected” on the left.",
          "Clicking a row opens the detail sheet; the row stays highlighted while it's open.",
          "Below 768px, hide secondary columns with showFrom. Never let the page scroll sideways.",
          "Empty result: say why (filters) and offer “Clear filters”. First use: say what goes here and offer “Create”.",
        ]} />
      </section>
    </div>
  );
}

function DetailPattern() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <SectionTitle>Sheet or page?</SectionTitle>
        <Rules items={[
          "Sheet: the user came from a list and will go back to it (triage, quick edits). Esc returns them with scroll and selection intact.",
          "Page: the record is a destination with its own tabs, sub-lists and long history — give it a URL and a breadcrumb.",
          "Dialog: one small task, no browsing (rename, invite one person).",
        ]} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Inside a detail sheet</SectionTitle>
        <Anatomy rows={[
          ["Eyebrow row", "Status pill and category tags."],
          ["Title + description", "Name and the one identifying detail (domain, email)."],
          ["Header actions", "Previous/next record (↑/↓), … menu with destructive actions last."],
          ["Sections", "Eyebrow titles, hairlines between — Details (DescriptionList), related records, Activity (Timeline)."],
          ["Footer", "Only when there are unsaved edits: Cancel + Save."],
        ]} />
      </section>
    </div>
  );
}

function FormsPattern() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <SectionTitle>Validation</SectionTitle>
        <Rules items={[
          "Validate on blur and on submit, not on every keystroke. Clear an error as soon as the value becomes valid.",
          "On submit with errors: show every error inline, show an Alert at the top with the count, and move focus to the first invalid field.",
          "Error text says how to fix it, in one sentence: “Enter a date after Nov 5, 2026”.",
          "Disable the submit button only while saving (loading), not while the form is invalid — users need to press it to see what's missing.",
          "Mark required or optional, whichever is rarer in the form — not both.",
        ]} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Layout</SectionTitle>
        <Rules items={[
          "Single column, max ~640px wide. Two short related fields (city, postcode) may share a row from 768px.",
          "Settings pages: FormSection with a 240px title column; each section saves independently or the page has one sticky Save bar.",
          "Primary action bottom-left of the form on pages, bottom-right in dialogs and sheets.",
        ]} />
      </section>
    </div>
  );
}

function DestructivePattern() {
  return (
    <div className="flex flex-col gap-6">
      <Rules items={[
        "Reversible (archive, remove a tag): do it immediately and show a toast with Undo. No confirm.",
        "Irreversible but routine (delete a draft): ConfirmDialog naming the object and count — “Delete 3 invoices?”.",
        "Irreversible and large (delete workspace, revoke all keys): ConfirmDialog with confirmText the user must type.",
        "The confirm button repeats the action: “Delete invoices”, never “OK”. Cancel gets initial focus.",
        "Destructive menu items go last, after a separator, in danger text — never as a red-filled button in a toolbar.",
      ]} />
    </div>
  );
}

function StatesPattern() {
  return (
    <Anatomy rows={[
      ["Loading (<300ms)", "Show nothing new; avoid flashing spinners."],
      ["Loading (>300ms)", "Skeletons shaped like the content. Tables keep columns and headers."],
      ["Refreshing", "Keep old data visible; a small spinner or “Updating…” next to the title."],
      ["Empty — first use", "What goes here + the create action."],
      ["Empty — filtered", "“No rows match these filters” + Clear filters."],
      ["Error — section", "Alert in place of the content with Retry; the rest of the page still works."],
      ["Error — page", "ServerErrorPage with request ID."],
      ["No permission", "PermissionState in place of the section; keep layout stable."],
      ["Offline", "Banner at the top + OfflineState in panels that need the network."],
    ]} />
  );
}

function KeyboardPattern() {
  const keys: [string[], string][] = [
    [["⌘", "K"], "Command palette"], [["/"], "Focus search"], [["⌘", "B"], "Toggle sidebar"], [["↑", "↓"], "Move between rows / menu items"],
    [["↵"], "Open row / run command"], [["Esc"], "Close sheet, dialog, menu"], [["E"], "Edit (in a menu or sheet)"], [["?"], "Show shortcuts"],
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-2">
        {keys.map(([k, d]) => (
          <div key={d} className="flex items-center justify-between gap-3 bg-background px-3 py-2.5 text-small">
            <span className="text-soft">{d}</span>
            <span className="flex gap-1">{k.map((x) => <Kbd key={x}>{x}</Kbd>)}</span>
          </div>
        ))}
      </div>
      <Rules items={[
        "Every interactive element is reachable with Tab and shows the focus ring.",
        "Show shortcuts where the action lives: in menu items, tooltips and the command palette.",
        "Single-key shortcuts only fire when focus isn't in a text field.",
      ]} />
    </div>
  );
}

function GettingStarted() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <SectionTitle>1. Copy the system into your app</SectionTitle>
        <p className="max-w-[70ch] text-small text-subtle">Keel is source you own, like a design system repo you vendor: copy <code className="font-mono text-soft">/tokens</code> and <code className="font-mono text-soft">/components</code> into your project (e.g. <code className="font-mono text-soft">src/keel</code>).</p>
        <CodeBlock code={`npm i react react-dom radix-ui lucide-react class-variance-authority clsx tailwind-merge \\\n  @fontsource-variable/geist @fontsource-variable/geist-mono\nnpm i -D tailwindcss @tailwindcss/vite`} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>2. Import the stylesheet</SectionTitle>
        <CodeBlock title="src/index.css" code={`@import "tailwindcss";\n@import "@fontsource-variable/geist";\n@import "@fontsource-variable/geist-mono";\n@import "./keel/components/styles.css";`} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>3. Wrap the app and build</SectionTitle>
        <CodeBlock title="src/App.tsx" code={`import { AppShell, Sidebar, Header, Page, Toaster, TooltipProvider } from "./keel/components";\n\nexport default function App() {\n  return (\n    <TooltipProvider>\n      <Toaster>\n        <AppShell sidebar={<Sidebar>…</Sidebar>}>\n          <Header title="Customers" />\n          <Page>…</Page>\n        </AppShell>\n      </Toaster>\n    </TooltipProvider>\n  );\n}`} />
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Themes</SectionTitle>
        <p className="max-w-[70ch] text-small text-subtle">Dark is the default. Set <code className="font-mono text-soft">data-theme="light"</code> on <code className="font-mono text-soft">&lt;html&gt;</code> for light mode. Both themes come from the same token names, so components never need a dark: variant.</p>
      </section>
      <section className="flex flex-col gap-3">
        <SectionTitle>Figma</SectionTitle>
        <p className="max-w-[70ch] text-small text-subtle">The Figma library uses the same tokens as Figma Variables (collection “Keel / Color” with Dark and Light modes, plus “Keel / Dimension”) and text styles. Edit a value in <code className="font-mono text-soft">tokens/tokens.json</code>, run <code className="font-mono text-soft">npm run tokens</code>, and re-import <code className="font-mono text-soft">figma-variables.json</code> (or <code className="font-mono text-soft">tokens.studio.json</code> with Tokens Studio).</p>
      </section>
    </div>
  );
}

export const patterns: DocPage[] = [
  { slug: "getting-started", title: "Getting started", group: "Overview", section: "Patterns", summary: "Install Keel in a React + Tailwind v4 app and build your first admin screen.", body: GettingStarted, keywords: ["install", "setup", "theme", "figma"] },
  { slug: "list-pages", title: "List pages", group: "Patterns", section: "Patterns", summary: "Most admin work happens on a filtered table. This is the standard anatomy.", body: ListPage, keywords: ["index", "table page", "filters"] },
  { slug: "detail-views", title: "Detail views", group: "Patterns", section: "Patterns", summary: "How to show one record: sheet, page or dialog.", body: DetailPattern },
  { slug: "forms", title: "Forms & validation", group: "Patterns", section: "Patterns", summary: "Calm forms that tell people exactly how to fix things.", body: FormsPattern },
  { slug: "destructive-actions", title: "Destructive actions", group: "Patterns", section: "Patterns", summary: "Match the friction to the risk: undo, confirm, or type to confirm.", body: DestructivePattern, keywords: ["delete", "confirm"] },
  { slug: "states", title: "Loading, empty & error", group: "Patterns", section: "Patterns", summary: "Every panel needs a plan for each of these states.", body: StatesPattern },
  { slug: "keyboard", title: "Keyboard", group: "Patterns", section: "Patterns", summary: "Admin users are repeat users. Make the fast path the keyboard path.", body: KeyboardPattern, keywords: ["shortcuts", "a11y"] },
];
