# QA checklist

Run before calling a screen done. Screenshot at 390, 768 and 1440 in **light and dark**.

## Visual
- [ ] No Tailwind classes, no hex colors, no raw box-shadows — tokens only.
- [ ] One primary (ink) button per view; accent only for selection/focus/links/progress.
- [ ] Buttons look raised, inputs look recessed, cards have the card depth — nothing flat and borderless by accident.
- [ ] Text uses `<Text variant>`/`Heading`, 13px for UI, 14px for reading. Numbers `tabular`.
- [ ] No horizontal page scroll at 390px. Tables hide secondary columns with `showFrom`.
- [ ] Both themes readable: check muted text on surfaces, status colors, charts.

## States
- [ ] Hover, focus-visible ring, pressed, disabled for every control you built yourself.
- [ ] Loading (skeleton or `loading` prop), empty (`EmptyState` with an action), error (`ErrorState`/`Alert`/field errors).
- [ ] Long content: names truncate, descriptions clamp, tables scroll inside their container.
- [ ] Destructive actions confirm (`AlertDialog`/`Popconfirm`) and toasts offer Undo where possible.

## Accessibility
- [ ] Keyboard only: tab order, Esc closes overlays, Enter/Space activate, arrows in menus, tabs, trees, calendars.
- [ ] Every `IconButton` has `label`; every control is inside a `Field` or has `aria-label`.
- [ ] Charts have `label`; status isn't color-only (dot + word).
- [ ] `prefers-reduced-motion` respected (styles.css handles it).

## AI screens
- [ ] Streaming shows a caret; Stop works; errors offer Retry.
- [ ] Any side effect goes through `ApprovalCard`; proposed record changes through `DiffTable`.
- [ ] Sources cited with `[^n]` / `Citation`.
