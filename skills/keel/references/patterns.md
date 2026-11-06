# Page patterns

Each has a working template in `templates/` built only from Keel components with realistic data
(`templates/data.ts`).

## List page — `templates/customers.tsx`

Header (title + count, Export, primary New) → saved-view tabs with counts → DataTable with `toolbar` (search
`/`, Label | Value filters with counts) → selection swaps toolbar for bulk actions → `…` row menu (Open, Copy ID,
separator, Delete) → footer totals → pagination. Row click opens the detail sheet; the row stays highlighted
(`activeRowId`).

## Detail sheet — `templates/customers.tsx` (`initialOpenId`)

Sheet `size="lg"`: eyebrow (status + plan tag) · title · description · header actions (prev/next with K/J,
`…` menu) · sections: Details (DescriptionList + InlineEdit), Health (number + SegmentBar + Sparkline), related
records, Activity (Timeline). Footer only when there are unsaved edits.

## Create / edit form — `templates/invoice-form.tsx`

Narrow page, single column, two related fields may pair from 768px. Validate on blur and submit. Failed submit →
Alert at top with the count, inline errors, focus the first invalid field. Primary button bottom-left
(`loading` while saving), "Save as draft" secondary, Cancel ghost right.

## Settings — `templates/settings.tsx`

Header tabs (General, Billing, Security, API). FormSections with title column. Switches apply instantly with a
toast; text fields mark the page dirty → sticky save bar (Discard, Save changes). Danger zone: bordered in
`danger-border`, ConfirmDialog with `confirmText`.

## Users and roles — `templates/members.tsx`

Members DataTable: avatar + email, inline role `Select size="sm"` (owner fixed as a tag), last active, 2FA.
Invite dialog: multi Combobox for emails (`onCreate`), role Select with descriptions. Roles tab: permission
matrix (Check / Minus icons, grouped rows with eyebrow headers). For editing a role's permissions use `Transfer`
or a checkable `Tree`.

## Audit log — `templates/audit-log.tsx`

Read-only, `density="compact"`, monospace times/IPs/event names, `DateRangePicker` with presets, actor and
level filters, expandable rows with the raw event in a CodeBlock. Export CSV in the header.

## Overview dashboard — `templates/overview.tsx`

Answer one question ("is the business healthy and what needs attention?"): Alert for problems with its action →
StatGroup (4 stats with baselines) → one trend (LineChart, last year dashed grey) → problems with actions
(churn-risk list with SegmentBars) → recent records → activity. No chart without a question.

## Auth — `templates/auth.tsx`

360px centered column, workspace mark only. SSO buttons first, divider, email + password (lg inputs), "Forgot
password?" as `labelAside`, credential errors as an Alert above the fields. Reset: confirmation that doesn't
reveal whether the account exists.

## Destructive actions

Reversible → do it + toast Undo. Irreversible routine → ConfirmDialog naming object and count. Irreversible
large → `confirmText`. Low-risk single object → Popconfirm. Destructive menu items last, red text.
