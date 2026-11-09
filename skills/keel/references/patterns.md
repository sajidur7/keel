# Page patterns

Each pattern has a working template in `templates/`. Copy it, then change the data.

## App frame
`AppShell` (inset content panel) + `Sidebar` (`SidebarBrand`, `SidebarSection`, `SidebarItem` with `count`, `SidebarFooter`) +
per-screen `Header` (`start={<SidebarTrigger/>}`, title, `status`, `actions`, `end`= theme/notifications/avatar menu) + `Page`.
Add `CommandPalette` with `useCommandShortcut` (⌘K). `templates/shell.tsx`.

## List of records — `templates/customers.tsx`
`PageHeading` → `DataTable` with `toolbar` (`SearchInput shortcut="/"`, `FilterMenu`), columns with `sortable`, `filterOptions`,
`showFrom` for secondary columns, `footer` totals, `rowActions` (Open ↵ / Copy ID / separator / Delete), `bulkActions`
(floating `TableSelectionToolbar`), `onRowClick` → detail `Drawer`. Deleting → `AlertDialog`. After actions → `useToast` with Undo.
Empty → `EmptyState` with the next action. Loading → `loading` prop (skeleton rows).

## Detail — drawer
`DrawerContent size="lg"` with `eyebrow` (status pill), `headerActions` (prev/next `IconButton`s with J/K, `MoreMenu`),
`DrawerSection`s of `MetadataList`, `InlineEdit` for quick fixes, `Timeline` for activity, footer actions.

## Form — `templates/invoices.tsx`
`Page width="wide"`, `Stepper` for multi-step, `Card` with `FormLayout`; every control inside `Field` (label, required, description,
error). Group with `FormSection`. Pickers: `Combobox`, `DateInput`, `Select`, `NumberInput`, `SegmentedControl`. Live preview on a
`Card variant="raised"`, sticky. Submit = one primary `Button loading`.

## Settings — `templates/settings.tsx`
`TabList` of `FormSection`s. Instant toggles → `Switch labelPosition="left"`; batched edits → unsaved `Banner` with Save/Discard.
Secrets → `Code` + `CopyButton`. Danger zone → `Alert tone="danger"` + `AlertDialog` that asks to type the name.

## Members & roles — `templates/members.tsx`
`DataTable` with `Avatar status`, role `Tag`s; invite `Dialog` with `Tokenizer allowCreate`; permissions `TreeList checkable`.

## Audit log — `templates/audit-log.tsx`
`PowerSearch` (field → operator → value) + `DateRangeInput`; `DataTable density="compact"` with `renderExpanded` showing JSON in `CodeBlock`.

## Dashboard — `templates/overview.tsx`
`PageHeading` + period `SegmentedControl`; `StatGroup` of `Stat` (help, delta, baseline, sparkline, progress); `LineChart` with a muted
dashed comparison; `InsightCard`; recent `List`; `DonutChart`; `Timeline`. Charts only for real questions.

## AI assistant — `templates/assistant.tsx`
`ChatLayout` (thread + composer + footer note). Assistant turns: `Thinking` (done, with reasoning), `ChatToolCalls`, Markdown content
with `[^n]` citations, `ContextChips`, `TaskList`, `DiffTable` for proposed record edits, `ApprovalCard` before any side effect,
`RecommendationCard` with `ConfidenceMeter`. Composer: `ChatComposer` with `ToolChips` in `tools`, `PromptSuggestions` above.
Rule: **the agent proposes, a person approves.**

## Auth — `templates/auth.tsx`
Centered `surfaceRaised` card, `Field`s, `PasswordInput`, `Checkbox`, primary `Button fullWidth`, `Divider label="or"`, SSO buttons,
`OtpInput` for codes, `Alert` for errors.

## 105 screens — `templates/screens/`
Before building a page, copy the closest screen. All use `ScreenShell` (workspace switcher, quick search with ⌘K, grouped nav
with counts, plan card, account menu) and the `Cols` helper (columns that collapse to one on phones — never leaves holes).
- `dashboards.tsx` — home, product analytics, sales, marketing, finance, support, store, customer health
- `lists.tsx` — one `ListScreen` config per record type (people, companies, deals, leads, invoices, orders, products, tickets,
  employees, candidates, subscriptions, transactions, campaigns, projects, files, API keys, webhooks, assets, vendors, audit log):
  count tabs (`TabMenu`), search, filter, saved views, `DataTable`, bulk actions, detail `Drawer`
- `details.tsx` — person, company, deal, invoice document, ticket thread, project, order, employee, candidate, product
- `work.tsx` — inbox, kanban, calendar, workflow builder (canvas + inspector), files, notifications, tasks, team chat, roadmap,
  doc editor, report builder (`Resizable` + `CommandMenu`), activity
- `settings.tsx` — 12 settings pages behind one sub-nav
- `more.tsx` — pricing, compare, checkout, usage, upgrade, pay invoice · assistant, agent runs/run, prompts, knowledge,
  approvals, AI search, assistant settings · 404/500/403, maintenance, offline, empty, status, changelog, help, search
- `entry.tsx` — 11 auth screens and 7 onboarding screens
