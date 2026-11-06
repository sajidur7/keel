# QA pass

Run before showing a screen to anyone. Look at the screenshots — reading code is not seeing the screen.

## 1. Screenshots

Capture every changed screen at **320, 768, 1024 and 1440px**, in **dark and light** (8 shots per screen). With
Playwright: set `localStorage.keel-theme` (docs) or `document.documentElement.dataset.theme`, set the viewport,
wait for network idle, full-page screenshot.

Check on each shot:

- No page-level horizontal scroll (`document.documentElement.scrollWidth === clientWidth`). Tables scroll inside
  their container.
- No clipped or overlapping text; truncated values have a tooltip or are fully visible elsewhere.
- The primary action and record name are visible at every width.
- Sidebar is a drawer below 1024px and docked at 1024+.
- Light theme has no dark-only artifacts (hard-coded colors, invisible borders).

## 2. States

Open each panel in loading, empty (first use and filtered), error, and no-permission states. Tab through the
page: every focus is visible and in a sensible order. Hover rows and controls. Open each menu, sheet and dialog,
then press Esc — focus returns to the trigger.

## 3. Numbers and words

- Numbers right-aligned, tabular, same value everywhere it appears; totals match their rows.
- No sentences under numbers; explanations in tooltips.
- Buttons are verb + object; errors say how to fix; sentence case; no "Submit", "OK", "Success!".

## 4. Tokens

Search JSX for `#`, `rgb(`, `bg-[`, `text-[#`, `blue-`, `gray-`. Every color is a Keel token. Only Lucide icons
through Keel wrappers; no emoji.

## Smells → fixes

| Smell | Fix |
|---|---|
| Every section in a card | Remove cards; separate with hairlines and spacing |
| Two primary buttons | Keep one; the other becomes secondary |
| Colored CTA | `variant="primary"` |
| Red/green tags for categories | Tag tones for categories, StatusPill for state |
| Icon square beside each KPI | Remove; eyebrow label + number + baseline |
| Spinner over a whole page | Skeletons shaped like the content |
| Disabled save with no reason | Enable; show inline errors on submit |
| Page scrolls sideways on phone | `showFrom` on secondary columns; content in `TableContainer` |
| Toast for a persistent problem | Alert in the section |
