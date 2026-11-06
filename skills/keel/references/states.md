# States

Every interactive element shows each state that applies. Build them in, then check them on screenshots.

## Control states

| State | How it looks in Keel | Implementation |
|---|---|---|
| Default | Resting surface + hairline ring (fields) or raised highlight (secondary buttons) | Built in |
| Hover | Fields: ring → `line-strong`. Buttons: one surface step up. Rows/items: `bg-hover` | Built in |
| Focus-visible | 2px ring offset from the element (`shadow-focus`), never removed | Built in; don't add `outline-none` without a replacement |
| Active / pressed | 1px downward press on buttons; `data-[state=on]` tint on toggles | Built in |
| Selected | `bg-selected` tint (rows, list items, tree items, date cells); active nav = raised card | `selected`, `activeRowId`, `active` props |
| Open | Trigger keeps hover look while its menu/popover is open; chevron rotates | Built in (`data-state=open`) |
| Disabled | 45–50% opacity, not focusable, no hover. Say why nearby | `disabled` |
| Loading | Button: spinner over invisible label (width kept). Table: skeleton rows. Combobox: spinner in trigger. Async confirm: button loading | `loading` props |
| Error / invalid | Red ring + `aria-invalid`; message under the field in `danger` | `FormField error` or `invalid` |
| Read-only | `surface` fill, no ring, still focusable and selectable | `readOnly` |
| Empty (field) | Placeholder in `faint`, an example of valid input | `placeholder` |

## Panel states

| State | Pattern |
|---|---|
| Loading < 300ms | Show nothing new (no spinner flash) |
| Loading > 300ms | `Skeleton` shaped like content; tables keep headers and widths (`DataTable loading`) |
| Refreshing | Keep old data; small spinner or “Updating…” by the title |
| Empty — first use | `EmptyState` — what goes here + the create action |
| Empty — filtered | “No rows match these filters” + Clear filters (DataTable does this) |
| Error — section | `Alert tone="danger"` in place of content + Retry; the rest of the page works |
| Error — page | `ServerErrorPage requestId` |
| Not found | `NotFoundPage` |
| No permission | `PermissionState what="billing"` in place of the section; `ForbiddenPage role` for pages |
| Offline | `Banner` + `OfflineState` in network panels |
| Unsaved changes | Sticky save bar (settings template) appears only when dirty |
| Success | Toast; with Undo for reversible actions |

## Coverage by component

| Component | Default | Hover | Focus | Active/On | Selected | Disabled | Loading | Error | Read-only | Empty |
|---|---|---|---|---|---|---|---|---|---|---|
| Button / IconButton | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — | — |
| Input / Textarea / Number / Password / Search | ✓ | ✓ | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ |
| Select / Combobox / Cascader | ✓ | ✓ | ✓ | open | ✓ | ✓ | ✓ (combobox) | ✓ | ✓ (select) | ✓ |
| Date / Range / Time picker | ✓ | ✓ | ✓ | open | ✓ | ✓ | — | ✓ | — | ✓ |
| Checkbox / Radio / Switch | ✓ | ✓ | ✓ | ✓ (+indeterminate) | — | ✓ | — | ✓ | — | — |
| Slider / Rating / OTP / Color | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ (OTP, color) | ✓ (rating) | ✓ |
| File upload | ✓ | ✓ | ✓ | drag-over | — | ✓ | progress | ✓ rejected/failed | — | ✓ |
| Inline edit | ✓ | ✓ | ✓ | editing | — | — | saving | ✓ | ✓ | ✓ |
| Tabs / Segmented / Toggle | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — | — |
| Sidebar item | ✓ | ✓ | ✓ | — | ✓ active | — | — | — | — | — |
| Menu item | ✓ | highlighted | ✓ | — | ✓ checked | ✓ | — | destructive | — | — |
| DataTable | ✓ | row | row | sort | ✓ rows | — | ✓ skeleton | — | — | ✓ first-use / filtered |
| Tree | ✓ | ✓ | ✓ | expanded | ✓ / checked | ✓ | ✓ lazy | — | — | — |
| Transfer | ✓ | ✓ | ✓ | — | ✓ | ✓ items | — | — | — | ✓ |
| Sheet / Dialog / Confirm | open | — | trapped | — | — | — | ✓ confirm | — | — | — |
| Alert / Banner / Toast / Inline message | info · success · warning · danger · neutral |

Figma mirrors this: each component set has a `State` property with the states above.
