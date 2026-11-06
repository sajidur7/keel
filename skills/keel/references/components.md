# Components

All exported from `components/index.ts`. Each entry: when to use it, the props that matter, the trap.

## Choice table

| Need | Use | Not |
|---|---|---|
| The main action | `Button variant="primary"` (one per view) | A colored CTA |
| Other actions | `Button` (secondary), `ghost`/`subtle` in toolbars | Several primaries |
| Icon-only action | `IconButton label=…` (+ `Tooltip`) | Unlabelled icons |
| Pressed state (pin, show archived) | `Toggle`, `ToggleGroup` | A checkbox in a toolbar |
| Switch a local view (7d/30d) | `SegmentedControl` | Tabs |
| Switch the page's main view | `Tabs` (underline) in `Header tabs` | Buttons |
| Filter a list | `FilterMenu` ("Label \| Value"), `SearchInput size="sm"` | A filter form above the table |
| Many records, compare attributes | `DataTable` | Cards in a grid |
| A few items, one action each | `List` / `ListItem` | A table |
| One record's fields | `DescriptionList` (+ `InlineEdit`) | A form when it's read-mostly |
| Hierarchy | `Tree` (select or checkable) | Nested lists |
| Assign many items (permissions) | `Transfer` | A long checkbox list |
| Pick one of ≤12 | `Select`; 2–4 visible → `Radio` | Combobox |
| Pick from many / search / multi | `Combobox` (`multiple`, `onCreate`) | Select |
| Nested choice (region → site) | `Cascader` | Three selects |
| Dates | `DatePicker`, `DateRangePicker` (presets), `TimePicker` | Native date input |
| On/off applied now | `Switch` | Checkbox + Save |
| On/off saved with form | `Checkbox` (indeterminate for select-all) | Switch |
| Number | `NumberInput` (arrows, clamping) | Plain input |
| Code from email/SMS | `OtpInput` | Six inputs by hand |
| Color | `ColorPicker` | Free text |
| Files | `FileUpload` (zone or `compact`) | A bare file input |
| Headline number | `Stat` / `StatGroup` (parts: `help` → dashed underline, `delta`+`baseline`, `meta`, `progress`, `chart`, `footer`, `action`, `icon`; `variant="card"` standalone) | A card with an icon square |
| Score or capacity in a row | `SegmentBar`, `Progress`, `ProgressRing` | A chart |
| Trend in a cell | `Sparkline` | A full chart |
| Real trend / comparison / share | `LineChart`, `BarChart`, `DonutChart` | Charts to fill space |
| Category | `Tag tone` | Status pill |
| State of a record | `StatusPill status` | Tag |
| Count next to text | `CountBadge`; on an icon → `Badge` | — |
| Person / org | `Avatar` (`shape="square"` for orgs), `AvatarGroup` | — |
| Record history | `Timeline` | A table |
| ID / key / payload | `Code`, `CodeBlock`, `CopyButton` | — |
| Optional detail | `Accordion`, `Collapsible` | Hiding primary info |
| Short label on hover | `Tooltip` | Essential info in a tooltip |
| Small interactive overlay | `Popover`, `HoverCard` | Dialog |
| View/edit one record from a list | `Sheet` (right) | Navigating away |
| Small blocking task | `Dialog` | A long form in a dialog |
| Confirm destruction | `ConfirmDialog` (`confirmText` for big ones), `Popconfirm` for small | `window.confirm` |
| Feedback after an action | `useToast()` (with Undo) | An alert that stays |
| Problem in a section | `Alert`; one line next to a field → `InlineMessage` | A toast |
| Workspace-wide notice | `Banner` (one at a time) | Several alerts |
| Onboarding hint | `Coachmark` + `ProgressDots` | Modal walkthroughs |
| Nothing to show | `EmptyState` (title, one line, one action) | Illustrations |
| Loading content | `Skeleton`, `SkeletonText`; control → `Spinner` | Full-page spinners |
| Error pages | `NotFoundPage`, `ForbiddenPage`, `ServerErrorPage`, `OfflineState`, `PermissionState` | Raw errors |
| Navigate anywhere | `CommandPalette` + `useCommandShortcut` | — |
| Where am I | `Breadcrumb` | — |
| Multi-step flow | `Steps` | — |
| On this page | `Anchor` | — |
| Layout | `AppShell`, `Sidebar*`, `Header`, `Page`, `PageHeading`, `PageToolbar`, `Grid`, `Card`, `SplitPane`, `Stack`, `Inline`, `Sticky` | Ad-hoc wrappers |

## Key props and traps

**Button** — `variant` primary|secondary|muted|subtle|ghost|link|danger|danger-ghost; `size` xs|sm|md|lg|icon*;
`leading`, `trailing`, `loading` (keeps width, `aria-busy`), `asChild` for links. Trap: disabling a button
without saying why — prefer enabled + inline error.

**Input family** — `Input` (`leading`, `prefix`, `suffix`, `trailing`, `clearable`, `size`), `SearchInput`
(`shortcut`), `PasswordInput`, `NumberInput`, `Textarea` (`autoGrow`). Inside `FormField` they get id,
`aria-describedby`, invalid, required, read-only and disabled automatically.

**FormField** — `label`, `required` or `optional`, `help`, `error`, `count={{value,max}}`, `layout`,
`labelAside`. Layouts: `FormLayout` (vertical|horizontal|inline), `FormSection` (title column + fields).

**DataTable** — `columns: Column<T>[]` with `id, header, cell, value, sortable, filterOptions, align,
showFrom, defaultHidden, required, footer`; table props `selectable, bulkActions, rowActions,
renderExpanded, onRowClick, activeRowId, loading, empty, defaultSort, density, pageSize, toolbar,
maxHeight, caption`. The View menu (density + columns) is built in. Trap: putting search inside a card above
the table — use `toolbar`.

**Sheet** — `SheetContent title description eyebrow headerActions footer side size`; `SheetSection title
action`. Focuses the panel on open; Esc closes and returns focus.

**Dialogs** — `DialogContent title description footer size`; `ConfirmDialog title description confirmLabel
tone confirmText onConfirm` (async onConfirm shows loading).

**Sidebar** — inside `AppShell`: `Sidebar` > `SidebarBrand`, `SidebarContent` > `SidebarSection title` >
`SidebarItem icon label count active href|onClick`, `SidebarFooter`; `SidebarTrigger` in the header.
⌘B collapses; drag the edge to resize (200–360); drawer below 1024px.

**Tabs** — `TabsList variant="underline|segmented"`, `TabsTrigger value count icon`.

**FilterMenu** — `label`, `mode="single|multi"`, `value`, `onChange`, `options` with `count`.

**CommandPalette** — `items: { id, label, group, icon, keywords, shortcut, hint, onSelect }[]`.

**Tree** — `data: TreeNode[]`, `selected/onSelect` or `checkable/checked/onCheckedChange`, expansion props,
`aria-label` required.

**Charts** — always pass `label` (accessible summary). One data hue; comparison `tone="muted" dashed`.
`LineChart zero` to force a zero baseline.
