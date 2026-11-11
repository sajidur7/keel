# Keel components — full catalog

Generated from the TypeScript source (`npm run api && node scripts/gen-skill-catalog.mjs`). Import everything from `@keel/components` (components/index.ts).
Every component also accepts `xstyle` (StyleX styles), `className` and `style`. `*` = required.

## action.tsx

- **Button** — The main way to act. Tactile by design: a top highlight, a hairline ring and a soft drop;
  `size`: "xs" | "sm" | "md" | "lg" = "md" · `variant`: "outline" | "link" | "soft" | "accent" | "danger" | "primary" | "secondary" | "ghost" | "danger-ghost" = "secondary" · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `fullWidth`: boolean · `disabled`: boolean
- **ButtonGroup** — Related actions joined into one tactile bar (Undo | Redo, Prev | Next). Children are Buttons/IconButtons with variant="ghost".
  `size`: "xs" | "sm" | "md" | "lg" · `label`: string
- **ContextMenu** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **ContextMenuCheckboxItem** — —
  `disabled`: boolean · `checked`: boolean | "indeterminate" · `onCheckedChange`: { bivarianceHack(checked: boolean): void; }['bivarianceHack'] | undefined
- **ContextMenuContent** — —
- **ContextMenuGroup** — —
- **ContextMenuItem** — —
  `icon`: ReactNode · `shortcut`: string · `destructive`: boolean · `disabled`: boolean
- **ContextMenuLabel** — —
- **ContextMenuSeparator** — —
- **ContextMenuSub** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **ContextMenuSubContent** — —
- **ContextMenuSubTrigger** — —
  `icon`: ReactNode · `disabled`: boolean
- **ContextMenuTrigger** — —
  `disabled`: boolean
- **CopyButton** — Copies `value`, swaps to a check for 1.5s. Icon-only by default; pass children for a labelled button.
  `value*`: string · `label`: string = "Copy" · `size`: "xs" | "sm" | "md" | "lg" = "sm" · `variant`: "outline" | "link" | "soft" | "accent" | "danger" | "primary" | "secondary" | "ghost" | "danger-ghost" = "ghost" · `onCopied`: () => void
- **DropdownMenu** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **DropdownMenuCheckboxItem** — —
  `shortcut`: string · `disabled`: boolean · `checked`: boolean | "indeterminate" · `onCheckedChange`: { bivarianceHack(checked: boolean): void; }['bivarianceHack'] | undefined
- **DropdownMenuContent** — —
- **DropdownMenuGroup** — —
- **DropdownMenuItem** — One action. `destructive` turns it red; `shortcut` shows the key on the right.
  `icon`: ReactNode · `shortcut`: string · `destructive`: boolean · `disabled`: boolean
- **DropdownMenuLabel** — —
- **DropdownMenuPortal** — —
- **DropdownMenuRadioGroup** — —
  `onValueChange`: { bivarianceHack(value: string): void; }['bivarianceHack'] | undefined
- **DropdownMenuRadioItem** — —
  `value*`: string · `disabled`: boolean
- **DropdownMenuSeparator** — —
- **DropdownMenuSub** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **DropdownMenuSubContent** — —
- **DropdownMenuSubTrigger** — —
  `icon`: ReactNode · `disabled`: boolean
- **DropdownMenuTrigger** — —
  `disabled`: boolean
- **IconButton** — A square button with one icon. Always labelled; shows its label as a tooltip.
  `label*`: string · `size`: "xs" | "sm" | "md" | "lg" = "md" · `variant`: "outline" | "link" | "soft" | "accent" | "danger" | "primary" | "secondary" | "ghost" | "danger-ghost" = "ghost" · `tooltip`: boolean | string = true · `loading`: boolean · `shortcut`: string · `disabled`: boolean
- **Link** — Text that navigates. Use Button for actions. `external` opens a new tab and shows ↗.
  `tone`: "accent" | "neutral" | "quiet" = "accent" · `external`: boolean
- **MoreMenu** — "…" button with a menu, from a list. The quickest way to add row or card actions.
  `items*`: MenuItemSpec[] · `label`: string = "More actions" · `size`: "xs" | "sm" | "md" | "lg" = "sm" · `align`: "end" | "start" = "end" · `variant`: "outline" | "link" | "soft" | "accent" | "danger" | "primary" | "secondary" | "ghost" | "danger-ghost" = "ghost"
- **SegmentedControl** — Pick one of 2–5 views. The selection is a raised knob that slides between options.
  `items`: SegmentedItem[] · `size`: "sm" | "md" | "lg" = "md" · `fullWidth`: boolean · `label`: string · `onValueChange`: (v: string) => void
- **SegmentedControlItem** — Declarative option for <SegmentedControl> (alternative to `items`). Renders nothing on its own.
  `value*`: string · `label`: ReactNode · `icon`: ReactNode · `ariaLabel`: string · `disabled`: boolean
- **ToggleButton** — A button that stays pressed (Bold, Pin, Follow). Sinks in when on.
  `size`: "xs" | "sm" | "md" | "lg" = "md" · `label`: string · `leading`: ReactNode · `disabled`: boolean
- **ToggleButtonGroup** — A set of toggles in a sunken tray — formatting (B I U), view options. Single or multiple.
  `items*`: { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean; ariaLabel?: string }[] · `size`: "xs" | "sm" | "md" | "lg" = "sm" · `type*`: "single" | "multiple" · `onValueChange`: (v: string) => void
- **Toolbar** — A row of tools (editor formatting, canvas tools, bulk actions). Arrow keys move between items.
  `variant`: "flat" | "floating" = "floating"
- **ToolbarButton** — A tool. Pass `label` for icon-only tools (it becomes the tooltip); omit it for text tools.
  `size`: "xs" | "sm" | "md" | "lg" = "sm" · `active`: boolean · `label`: string · `variant`: "outline" | "link" | "soft" | "accent" | "danger" | "primary" | "secondary" | "ghost" | "danger-ghost" = "ghost" · `tooltip`: boolean | string · `loading`: boolean · `shortcut`: string · `disabled`: boolean
- **ToolbarSeparator** — —
- **ToolbarToggleGroup** — —
  `items*`: { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean; ariaLabel?: string }[] · `size`: "xs" | "sm" | "md" | "lg" · `type*`: "single" | "multiple" · `onValueChange`: (v: string) => void

## chat.tsx

- **ChatComposer** — Where the person writes. Grows with the text; ↵ sends, ⇧↵ adds a line; attach, dictate, stop.
  `onSubmit*`: (v: string) => void · `value*`: string · `onValueChange*`: (v: string) => void · `streaming`: boolean · `onStop`: () => void · `attachments`: ChatAttachment[] · `onAttach`: (files: File[]) => void · `onRemoveAttachment`: (name: string) => void · `tools`: ReactNode · `dictation`: boolean = true · `autoFocus`: boolean · `placeholder`: string = "Ask anything…" · `disabled`: boolean
- **ChatDictationButton** — Mic button that dictates into the composer (Web Speech API). Hidden when the browser can't.
  `onTranscript*`: (text: string, final: boolean) => void · `hideWhenUnsupported`: boolean = true · `size`: "xs" | "sm" | "md" = "sm"
- **ChatLayout** — A full-height conversation: optional header, a thread that sticks to the newest message, the composer pinned below.
  `header`: ReactNode · `children*`: ReactNode · `composer`: ReactNode · `footer`: ReactNode
- **ChatMessage** — One turn. User messages are raised bubbles on the right; assistant replies are open text on the left.
  `role*`: "user" | "assistant" · `content`: string · `author`: { name: string; src?: string } · `streaming`: boolean · `sources`: CitationSource[] · `attachments`: ChatAttachment[] · `before`: ReactNode · `after`: ReactNode · `metadata`: ReactNode · `onRetry`: () => void · `onFeedback`: (v: "up" | "down") => void · `error`: string · `showActions`: boolean
- **ChatMessageMetadata** — Small facts under a message: time, model, tokens, sent/failed.
  `items*`: ReactNode[]
- **ChatSystemMessage** — A neutral notice in the thread: "Ana joined", "Context was reset", a date divider.
  `children*`: ReactNode · `icon`: ReactNode
- **ChatToolCalls** — What the assistant did: each tool call with status, input and output. Collapsed to one line by default.
  `calls*`: ToolCall[] · `label`: string · `defaultOpen`: boolean = false

## ai.tsx

- **AiBadge** — "AI" label for generated content.
  `label`: string = "AI" · `icon`: boolean = true
- **ApprovalCard** — The agent wants to do something consequential — show exactly what, and let a person approve or reject.
  `title*`: ReactNode · `onApprove*`: () => void · `onReject*`: () => void · `description`: ReactNode · `details`: ReactNode · `state`: "pending" | "approved" | "rejected" = "pending" · `onAlwaysAllow`: () => void · `approveLabel`: string = "Approve" · `tone`: "default" | "warning" = "default" · `label`: ReactNode
- **ConfidenceMeter** — How sure the model is, as five bars plus a word.
  `value*`: number
- **ContextCard** — A piece of context attached to a prompt: a file, a page, a record.
  `item*`: ContextItem · `onRemove`: () => void
- **ContextChips** — A scrollable row of ContextCards.
  `items*`: ContextItem[] · `onRemove`: (id: string) => void
- **DiffTable** — AI-proposed edits to records — old value struck → new value; accept or reject each, or all.
  `rows*`: DiffRow[] · `onAccept*`: (id: string) => void · `onReject*`: (id: string) => void · `onAcceptAll`: () => void · `label`: ReactNode = "Proposed changes"
- **FineTuneCard** — Alias.
  `params*`: Parameter[] · `onChange*`: (id: string, v: number) => void · `title`: ReactNode · `footer`: ReactNode
- **InsightCard** — A generated finding about a metric: the number, a trend, a one-line why, and a follow-up.
  `title*`: ReactNode · `explanation*`: ReactNode · `trend`: number[] · `onAsk`: () => void · `label`: ReactNode = "Insight" · `askLabel`: ReactNode = "Ask a follow-up"
- **LoadingState** — A longer wait with what's happening now: pixel loader, the current step, elapsed time.
  `title`: ReactNode = "Working on it" · `steps`: string[] = [] · `current`: number = 0 · `startTime`: number
- **ParameterCard** — Tunable model or job settings with live values — temperature, top-p, batch size.
  `params*`: Parameter[] · `onChange*`: (id: string, v: number) => void · `title`: ReactNode = "Parameters" · `footer`: ReactNode
- **PixelLoader** — A grid of pixels that ripple — for "working on it" moments longer than a spinner.
  `size`: number = 4 · `label`: string = "Working"
- **PromptBar** — A one-line "ask AI" pill — for search pages, empty states and table headers.
  `onSubmit*`: (v: string) => void · `value*`: string · `onValueChange*`: (v: string) => void · `busy`: boolean · `leading`: ReactNode = <IconAgent size={16} /> · `placeholder`: string = "Ask about your data…"
- **PromptSuggestions** — Starter prompts as raised pills.
  `items*`: { label: string; icon?: ReactNode }[] · `onPick*`: (label: string) => void
- **RecommendationCard** — A suggestion with its reasoning, confidence and one-click actions.
  `title*`: ReactNode · `rationale`: ReactNode · `confidence`: number · `actions`: ReactNode · `meta`: ReactNode · `label`: ReactNode = "Suggestion"
- **StreamingText** — Reveals text at a reading pace with a caret — for demos and for smoothing bursty streams.
  `text*`: string · `speed`: number = 40 · `onDone`: () => void
- **TaskList** — An agent's plan and progress, one row per task.
  `tasks*`: AgentTask[] · `plain`: boolean
- **TaskRows** — v1-style alias (beautifului calls these task rows).
  `tasks*`: AgentTask[] · `plain`: boolean
- **Thinking** — "Thinking…" with a moving sheen and elapsed time. Click to show the reasoning if you have it.
  `label`: string = "Thinking" · `startTime`: number · `reasoning`: string · `done`: boolean · `doneLabel`: string
- **ToolChips** — Tools the assistant can use; toggle them, and see which one is running now.
  `tools*`: ToolChip[] · `onToggle`: (id: string) => void

## container.tsx

- **Accordion** — Several collapsible sections (FAQ, settings groups). `variant="separated"` gives each item its own card.
  `children*`: ReactNode · `variant`: "divided" | "separated" = "divided" · `onValueChange`: (v: string) => void
- **AccordionItem** — One section. `meta` shows at the right of the trigger (a count, a status).
  `title*`: ReactNode · `value*`: string · `meta`: ReactNode · `children*`: ReactNode · `disabled`: boolean
- **Bezel** — A sunken shell with a mono label strip, holding a raised inner surface — Keel's signature container for
  `label`: ReactNode · `icon`: ReactNode · `meta`: ReactNode · `footer`: ReactNode · `padded`: boolean = true · `children*`: ReactNode
- **Card** — A surface that groups related content. Use only when grouping needs a boundary — most layouts don't.
  `variant`: "outline" | "card" | "sunken" | "raised" | "plain" = "card" · `padding`: "none" | "sm" | "md" | "lg" = "md"
- **CardBody** — —
  `children*`: ReactNode
- **CardFooter** — —
  `children*`: ReactNode
- **CardHeader** — Title row for a Card with padding="none".
  `title*`: ReactNode · `description`: ReactNode · `action`: ReactNode
- **Carousel** — A row of cards that scrolls sideways with snap. Swipe, shift+wheel, or the buttons.
  `children*`: ReactNode · `slideWidth`: number | string = 280 · `gap`: number = 12 · `buttons`: boolean = true · `edgeFade`: boolean = true · `label`: string = "Carousel" · `title`: ReactNode
- **ClickableCard** — A whole card that is one action (open a record, start a template). Lifts on hover.
  `href`: string · `onClick`: () => void · `padding`: "none" | "sm" | "md" | "lg" = "md" · `label`: string · `children*`: ReactNode · `disabled`: boolean
- **Collapsible** — Show/hide one section ("Advanced settings"). For several, use Accordion.
  `trigger*`: ReactNode · `children*`: ReactNode · `defaultOpen`: boolean · `chevron`: "end" | "start" = "end" · `open`: boolean · `onOpenChange`: (o: boolean) => void · `disabled`: boolean
- **SelectableCard** — A card you select (plans, templates, integrations). Ring + check when on. Use `type="radio"` inside a group for single choice.
  `selected*`: boolean · `onSelectedChange*`: (v: boolean) => void · `padding`: "none" | "sm" | "md" | "lg" = "md" · `label`: string · `children*`: ReactNode · `disabled`: boolean

## content.tsx

- **Avatar** — A person or organization. Falls back to tinted initials; the tint is stable per name.
  `name`: string = "" · `src`: string · `size`: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" = "md" · `shape`: "square" | "circle" = "circle" · `status`: "online" | "away" | "busy" | "offline" · `colored`: boolean = true · `tooltip`: boolean
- **AvatarGroup** — Overlapping avatars with a "+N" for the rest.
  `people*`: { name: string; src?: string }[] · `max`: number = 4 · `size`: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" = "md"
- **Blockquote** — A quotation, optionally attributed.
  `children*`: ReactNode · `cite`: ReactNode
- **Citation** — A source reference in generated text: a numbered marker or a source chip, with the source on hover.
  `source*`: CitationSource · `number`: number · `variant`: "number" | "chip" = "number"
- **Code** — Inline monospace value — ids, keys, file names.
  `tone`: "default" | "accent" = "default"
- **CodeBlock** — Multi-line code with optional title, line numbers, highlights, diff marks and copy.
  `code*`: string · `language`: string · `title`: ReactNode · `lineNumbers`: boolean · `startLine`: number = 1 · `highlightLines`: number[] · `diff`: boolean · `wrap`: boolean · `copy`: boolean = true · `collapseAfter`: number · `maxHeight`: number · `plain`: boolean
- **Heading** — A heading with the right element for its level. `level` sets semantics; `variant` can change the look.
  `wrap`: "balance" | "pretty" · `variant`: "display" | "small" | "body" | "caption" | "h1" | "h2" | "h3" | "title" | "eyebrow" | "mono" | "stat" · `tone`: "inherit" | "default" | "muted" | "soft" | "faint" | "accent" | "success" | "warning" | "danger" · `weight`: "medium" | "bold" | "regular" | "semibold" · `truncate`: boolean · `maxLines`: number · `tabular`: boolean · `strike`: boolean · `dateTime`: string · `htmlFor`: string · `level`: 2 | 1 | 3 | 4 | 5 | 6 = 2
- **Icon** — Renders any Keel icon with a tone and size. `tile` puts it on a small raised square (feature lists, empty states).
  `icon*`: ComponentType<IconProps> · `size`: IconProps["size"] = 16 · `tone`: "inherit" | "default" | "muted" | "accent" | "success" | "warning" | "danger" | "fg" = "default" · `label`: string · `tile`: boolean
- **ImagePreview** — A thumbnail that opens full size in a Lightbox.
  `src*`: string · `alt*`: string · `width`: number = 96 · `height`: number = 72
- **Kbd** — A key, drawn like a key. Symbols (⌘ ⇧ ⌥ ⌃ ↵ ↑ ↓ ← → ⌫ ⇥) and names ("shift", "enter", "mod") render as icons.
- **KbdGroup** — Several keys, one cap each: ["mod", "K"] or "⌘K".
  `keys*`: string[] | string
- **Markdown** — Renders a safe subset of Markdown: headings, lists, code fences, quotes, rules, bold/italic/code/links, [^n] citations.
  `children*`: string · `streaming`: boolean · `sources`: CitationSource[] · `density`: "default" | "compact" = "default"
- **Tag** — A short label for a category or attribute. Ten tones; `dot` for status-like tags.
  `tone`: "blue" | "teal" | "green" | "amber" | "orange" | "red" | "pink" | "violet" | "lime" | "gray" | "neutral" | "yellow" | "cyan" | "indigo" | "purple" = "gray" · `size`: "sm" | "md" | "lg" = "md" · `variant`: "outline" | "solid" | "soft" = "soft" · `shape`: "rounded" | "pill" = "rounded" · `dot`: boolean · `icon`: ReactNode · `onRemove`: () => void · `removeLabel`: string
- **Text** — Every piece of text. Pick a variant for size, a tone for emphasis — never raw font sizes.
  `as`: ElementType = "p" · `variant`: "display" | "small" | "body" | "caption" | "h1" | "h2" | "h3" | "title" | "eyebrow" | "mono" | "stat" = "small" · `tone`: "inherit" | "default" | "muted" | "soft" | "faint" | "accent" | "success" | "warning" | "danger" · `weight`: "medium" | "bold" | "regular" | "semibold" · `truncate`: boolean · `maxLines`: number · `tabular`: boolean · `strike`: boolean · `wrap`: "balance" | "pretty" · `dateTime`: string · `htmlFor`: string
- **Thumbnail** — A small image tile — attachments, uploads, galleries. Optional remove button, loading veil and caption.
  `src*`: string · `alt*`: string · `label`: string · `width`: number = 64 · `height`: number = 64 · `loading`: boolean · `onRemove`: () => void · `onClick`: () => void · `disabled`: boolean
- **Timer** — Live elapsed (or remaining, with `endTime`) time: a call, a running job, a countdown.
  `startTime`: number · `endTime`: number · `running`: boolean = true · `variant`: "display" | "small" | "body" | "caption" | "h1" | "h2" | "h3" | "title" | "eyebrow" | "mono" | "stat" = "small" · `tone`: "inherit" | "default" | "muted" | "soft" | "faint" | "accent" | "success" | "warning" | "danger"
- **Timestamp** — A date or time, relative when recent ("3 min ago"), absolute after `autoAfterDays`. Full date in a tooltip.
  `value*`: Date | string | number · `format`: "auto" | "relative" | "time" | "date" | "datetime" = "auto" · `autoAfterDays`: number = 7 · `live`: boolean = true · `variant`: "display" | "small" | "body" | "caption" | "h1" | "h2" | "h3" | "title" | "eyebrow" | "mono" | "stat" = "small" · `tone`: "inherit" | "default" | "muted" | "soft" | "faint" | "accent" | "success" | "warning" | "danger" = "muted"
- **Token** — An entity chip — a person, a team, a file — usually inside a Tokenizer or a sentence. Raised and removable.
  `label*`: string · `avatar`: { name: string; src?: string } · `icon`: ReactNode · `description`: string · `size`: "sm" | "md" = "md" · `onClick`: () => void · `onRemove`: () => void · `disabled`: boolean

## feedback.tsx

- **Alert** — A raised message card inside content — a result, a warning before a form, a next step.
  `title`: ReactNode · `tone`: "success" | "warning" | "danger" | "neutral" | "info" = "info" · `icon`: ReactNode | false · `action`: ReactNode · `onDismiss`: () => void
- **Badge** — A number or dot pinned to the corner of an icon/avatar (unread, alerts). Wrap the element.
  `count`: number · `dot`: boolean · `max`: number = 99 · `tone`: "success" | "warning" | "danger" | "neutral" | "info" = "danger" · `label`: string
- **Banner** — A page- or section-level message that stays until resolved (trial ending, sync paused).
  `tone`: "success" | "warning" | "danger" | "neutral" | "info" = "info" · `title`: ReactNode · `icon`: ReactNode | false · `action`: ReactNode · `onDismiss`: () => void · `flat`: boolean
- **CountBadge** — A small count next to a label (tabs, nav, filters).
  `children*`: ReactNode · `tone`: "accent" | "neutral" = "neutral"
- **EmptyState** — Nothing here yet — say why, and what to do next.
  `title*`: ReactNode · `icon`: ReactNode · `description`: ReactNode · `actions`: ReactNode · `compact`: boolean · `headingLevel`: 2 | 3 | 4 = 3
- **ErrorState** — —
  `title`: ReactNode = "Couldn't load this" · `description`: ReactNode · `onRetry`: () => void
- **ForbiddenPage** — —
  `actions`: ReactNode · `role`: string
- **InfoTip** — A "?" that explains a term. Opens on click/tap (works on touch), unlike Tooltip.
  `children*`: ReactNode · `label`: string = "More info" · `size`: 12 | 14 | 16 = 14
- **InlineMessage** — One line of status beside a field or row: "Saved", "Couldn't sync".
  `tone`: "success" | "warning" | "danger" | "neutral" | "info" = "info" · `children*`: ReactNode
- **NotFoundPage** — —
  `actions`: ReactNode
- **OfflineState** — —
  `onRetry`: () => void
- **PermissionState** — —
  `what`: string = "this section" · `requestAccess`: () => void
- **Progress** — v1 name.
  `max`: number · `tone`: "default" | "success" | "warning" | "danger" | "ink" · `size`: "xs" | "sm" | "md" | "lg" · `label`: ReactNode · `showValue`: boolean | ((value: number, max: number) => ReactNode) · `marks`: number[] · `disabled`: boolean
- **ProgressBar** — Completion of a known amount. Leave `value` undefined for indeterminate.
  `max`: number = 100 · `tone`: "default" | "success" | "warning" | "danger" | "ink" = "default" · `size`: "xs" | "sm" | "md" | "lg" = "sm" · `label`: ReactNode · `showValue`: boolean | ((value: number, max: number) => ReactNode) · `marks`: number[] · `disabled`: boolean
- **ProgressDots** — Position in a short sequence (tour steps, carousel pages). The current dot stretches.
  `count*`: number · `current*`: number · `tone`: "default" | "inverse" = "default" · `label`: string
- **ProgressRing** — Circular progress for tight spots — a quota in a sidebar footer, a score.
  `value*`: number · `max`: number = 100 · `size`: number = 32 · `stroke`: number = 3 · `tone`: "default" | "success" | "warning" | "danger" | "ink" = "default" · `label`: string · `showValue`: boolean = true
- **SegmentBar** — A score or capacity as discrete blocks. `tone="auto"`: low = danger, mid = warning, high = success.
  `value*`: number · `max`: number = 100 · `segments`: number = 12 · `tone`: "auto" | "default" | "success" | "warning" | "danger" | "ink" = "default" · `height`: number = 8 · `label`: string
- **ServerErrorPage** — —
  `actions`: ReactNode · `requestId`: string
- **Skeleton** — A shimmering placeholder in the shape of what's loading.
  `width`: number | string = "100%" · `height`: number | string = 12 · `radius`: number · `circle`: boolean
- **SkeletonText** — A paragraph placeholder; the last line is shorter.
  `lines`: number = 3
- **StatusDot** — A colored dot for live state. `pulse` for "happening now".
  `tone`: "success" | "warning" | "danger" | "neutral" | "info" = "success" · `pulse`: boolean · `label`: string
- **StatusPage** — A full-page error or blocking state. Plain words: what happened, what to do.
  `title*`: ReactNode · `code`: string · `icon`: ReactNode · `description`: ReactNode · `actions`: ReactNode · `detail`: ReactNode
- **StatusPill** — A record's state — a dot and a word on a white pill. Words should be the status name ("Paid", "Overdue").
  `status`: "active" | "success" | "warning" | "danger" | "neutral" | "info" | "pending" = "neutral" · `children*`: ReactNode · `pulse`: boolean
- **Toaster** — Wrap your app once. Toasts stack bottom-right, max 3, swipe right to dismiss.
  `children*`: ReactNode

## inputs.tsx

- **Field** — Wires a label, description, error and count to one control — no ids by hand.
  `label`: ReactNode · `required`: boolean = false · `optional`: boolean · `description`: ReactNode · `help`: ReactNode · `error`: ReactNode · `status`: { type: Exclude<FieldStatusType, "error">; message: ReactNode } · `count`: { value: number; max: number } · `labelTooltip`: ReactNode · `labelAside`: ReactNode · `layout`: "vertical" | "horizontal" = "vertical" · `readOnly`: boolean = false · `hideLabel`: boolean · `id`: string
- **FieldStatus** — One line under a control: an error, a confirmation, a warning.
  `children*`: ReactNode · `id`: string
- **FormField** — v1 name.
  `label`: ReactNode · `required`: boolean · `optional`: boolean · `description`: ReactNode · `help`: ReactNode · `error`: ReactNode · `status`: { type: Exclude<FieldStatusType, "error">; message: ReactNode } · `count`: { value: number; max: number } · `labelTooltip`: ReactNode · `labelAside`: ReactNode · `layout`: "vertical" | "horizontal" · `readOnly`: boolean · `hideLabel`: boolean · `id`: string
- **FormLayout** — Stacks Fields with consistent spacing. `inline` puts them on one wrapping row (filters, quick add).
  `layout`: "vertical" | "horizontal" | "inline" = "vertical" · `children*`: ReactNode
- **FormSection** — A titled group of fields in a long form: title + description on the left, fields on the right.
  `title*`: ReactNode · `description`: ReactNode · `children*`: ReactNode
- **Input** — Single-line text. Picks up label/error wiring from a surrounding Field.
  `size`: "sm" | "md" | "lg" = "md" · `prefix`: ReactNode · `variant`: "default" | "flat" = "default" · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `invalid`: boolean · `suffix`: ReactNode · `clearable`: boolean · `onClear`: () => void · `disabled`: boolean · `checked`: boolean · `placeholder`: string | undefined
- **InputGroup** — A control with attached add-ons on either side: "https://" [ domain ] ".com", or [ amount ][ Select currency ].
  `start`: ReactNode · `end`: ReactNode · `children*`: ReactNode
- **Label** — —
- **NumberInput** — A number with steppers, ↑/↓ keys, clamping and optional units.
  `size`: "sm" | "md" | "lg" · `prefix`: ReactNode · `variant`: "default" | "flat" · `format`: (n: number) => string · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `invalid`: boolean · `suffix`: ReactNode · `clearable`: boolean · `onClear`: () => void · `units`: string · `steppers`: "none" | "inline" | "sides" = "inline" · `integer`: boolean
- **PasswordInput** — Password with a show/hide toggle.
  `size`: "sm" | "md" | "lg" · `prefix`: ReactNode · `variant`: "default" | "flat" · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `invalid`: boolean · `suffix`: ReactNode · `clearable`: boolean · `onClear`: () => void · `disabled`: boolean · `checked`: boolean · `placeholder`: string | undefined
- **SearchInput** — Search: magnifier, clear button, optional shortcut hint ("/").
  `size`: "sm" | "md" | "lg" · `prefix`: ReactNode · `variant`: "default" | "flat" · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `shortcut`: string · `invalid`: boolean · `suffix`: ReactNode · `clearable`: boolean · `onClear`: () => void · `disabled`: boolean · `checked`: boolean · `placeholder`: string | undefined = "Search…"
- **Textarea** — v1 name.
  `footer`: ReactNode · `invalid`: boolean · `autoGrow`: boolean · `disabled`: boolean · `placeholder`: string | undefined
- **TextArea** — Multi-line text. `autoGrow` to fit content.
  `footer`: ReactNode · `invalid`: boolean · `autoGrow`: boolean · `disabled`: boolean · `placeholder`: string | undefined
- **TextInput** — Astryx-style name.
  `size`: "sm" | "md" | "lg" · `prefix`: ReactNode · `variant`: "default" | "flat" · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `invalid`: boolean · `suffix`: ReactNode · `clearable`: boolean · `onClear`: () => void · `disabled`: boolean · `checked`: boolean · `placeholder`: string | undefined

## choice.tsx

- **Checkbox** — A yes/no choice. `checked="indeterminate"` for "some selected". Raised box that turns accent when on.
  `size`: "sm" | "md" = "md" · `label`: ReactNode · `invalid`: boolean · `description`: ReactNode · `disabled`: boolean · `checked`: boolean | "indeterminate" · `onCheckedChange`: { bivarianceHack(checked: CheckedState): void; }['bivarianceHack'] | undefined
- **CheckboxInput** — —
  `size`: "sm" | "md" · `label`: ReactNode · `invalid`: boolean · `description`: ReactNode · `disabled`: boolean · `checked`: boolean | "indeterminate" · `onCheckedChange`: { bivarianceHack(checked: CheckedState): void; }['bivarianceHack'] | undefined
- **CheckboxList** — Several checkboxes under one label. `value` is the array of checked values.
  `options*`: ChoiceOption[] · `label`: ReactNode · `description`: ReactNode · `orientation`: "vertical" | "horizontal" = "vertical" · `dividers`: boolean · `onValueChange`: (v: string[]) => void · `disabled`: boolean
- **Radio** — One option in a RadioGroup.
  `value*`: string · `label`: ReactNode · `description`: ReactNode · `disabled`: boolean · `checked`: boolean
- **RadioGroup** — —
  `disabled`: boolean · `onValueChange`: RadioGroupContextValue['onValueChange'] | undefined
- **RadioList** — Pick exactly one from a short list (≤ 6). `variant="card"` for bigger, described choices (plans).
  `options*`: ChoiceOption[] · `label`: ReactNode · `description`: ReactNode · `orientation`: "vertical" | "horizontal" = "vertical" · `variant`: "default" | "card" = "default" · `onValueChange`: (v: string) => void · `disabled`: boolean
- **RangeSlider** — Two thumbs. Same as Slider with a two-value array.
  `showValue`: boolean · `format`: (v: number) => string · `marks`: { value: number; label: ReactNode }[] · `disabled`: boolean · `onValueChange`: { bivarianceHack(value: number[]): void; }['bivarianceHack'] | undefined
- **Slider** — Pick a value (or a range, with two values) on a continuous scale.
  `showValue`: boolean · `format`: (v: number) => string = (v) => String(v) · `marks`: { value: number; label: ReactNode }[] · `disabled`: boolean · `onValueChange`: { bivarianceHack(value: number[]): void; }['bivarianceHack'] | undefined
- **Switch** — On/off that takes effect immediately. Use Checkbox when a Save button applies it.
  `size`: "sm" | "md" = "md" · `label`: ReactNode · `loading`: boolean · `description`: ReactNode · `labelPosition`: "left" | "right" = "right" · `disabled`: boolean · `checked`: boolean · `onCheckedChange`: { bivarianceHack(checked: boolean): void; }['bivarianceHack'] | undefined

## select.tsx

- **Combobox** — Searchable select. With `multiple`, choices show as removable tokens in the field.
  `options*`: SelectOption[] · `searchPlaceholder`: string · `emptyLabel`: string · `size`: "sm" | "md" | "lg" · `invalid`: boolean · `loading`: boolean · `onCreate`: (label: string) => void · `id`: string · `aria-label`: string · `multiple`: boolean · `value*`: string | null · `onValueChange*`: (v: string | null) => void · `placeholder`: string · `disabled`: boolean
- **ComplexSelector** — Rich, grouped, searchable picker — people with roles, projects with owners. Single or multiple. Raised trigger.
  `options*`: ComplexOption[] · `value*`: string[] · `onValueChange*`: (v: string[]) => void · `multiple`: boolean · `searchPlaceholder`: string = "Search" · `emptyLabel`: string = "Nothing found" · `footer`: ReactNode · `width`: number = 320 · `placeholder`: string = "Choose…"
- **MultiSelector** — Combobox with `multiple`.
  `options*`: SelectOption[] · `size`: "sm" | "md" | "lg" · `id`: string · `aria-label`: string · `value*`: string[] · `loading`: boolean · `onValueChange*`: (v: string[]) => void · `invalid`: boolean · `searchPlaceholder`: string · `emptyLabel`: string · `onCreate`: (label: string) => void · `maxTokens`: number · `disabled`: boolean · `placeholder`: string
- **PowerSearch** — Structured search: pick a field → an operator → a value, as chips. Free text becomes a "contains" filter.
  `fields*`: PowerField[] · `filters*`: PowerFilter[] · `onFiltersChange*`: (f: PowerFilter[]) => void · `placeholder`: string = "Filter or search…"
- **Select** — Pick one from a short known list (≤ ~12). Longer or searchable lists → Combobox.
  `options`: SelectOption[] · `groups`: { label: string; options: SelectOption[] }[] · `size`: "sm" | "md" | "lg" = "md" · `invalid`: boolean · `readOnly`: boolean · `variant`: "button" | "field" = "field" · `id`: string · `aria-label`: string · `onValueChange`: (v: string) => void · `placeholder`: string = "Select" · `disabled`: boolean
- **Selector** — Astryx-style name.
  `options`: SelectOption[] · `groups`: { label: string; options: SelectOption[] }[] · `size`: "sm" | "md" | "lg" · `invalid`: boolean · `readOnly`: boolean · `variant`: "button" | "field" · `id`: string · `aria-label`: string · `onValueChange`: (v: string) => void · `placeholder`: string · `disabled`: boolean
- **SelectorOption** — Declarative option for <Select> (alternative to `options`). Renders nothing on its own.
  `label*`: string · `value*`: string · `description`: string · `icon`: ReactNode · `disabled`: boolean
- **Tokenizer** — Several entities as tokens in one field — recipients, assignees, tags. Backspace removes the last.
  `source*`: Source · `value*`: TypeaheadOption[] · `onValueChange*`: (v: TypeaheadOption[]) => void · `allowCreate`: boolean · `max`: number · `debounceMs`: number = 150 · `id`: string · `placeholder`: string = "Add…"
- **Typeahead** — Type to search, pick one suggestion. The field shows the chosen label.
  `source*`: Source · `minQuery`: number = 1 · `debounceMs`: number = 200 · `emptyLabel`: string = "No results" · `size`: "sm" | "md" | "lg" = "md" · `leading`: ReactNode = <IconSearch /> · `id`: string · `onValueChange`: (v: TypeaheadOption | null) => void · `placeholder`: string = "Search…"
- **TypeaheadItem** — One suggestion row — use in `renderItem` or your own lists.
  `option*`: TypeaheadOption · `active`: boolean · `selected`: boolean

## dates.tsx

- **Calendar** — A month grid. Arrows move by day/week, PageUp/PageDown by month, Home/End to the week's edges.
  `selected`: Date | null · `onSelect`: (d: Date) => void · `range`: DateRange · `onRangeSelect`: (r: DateRange) => void · `min`: Date · `max`: Date · `isDisabled`: (d: Date) => boolean · `weekStartsOn`: 0 | 1 = 1 · `months`: 2 | 1 = 1 · `outsideDays`: boolean · `weekNumbers`: boolean · `locale`: string
- **DateInput** — One date in a field that opens a calendar.
  `value*`: Date | null · `onValueChange*`: (d: Date | null) => void · `size`: "sm" | "md" | "lg" = "md" · `min`: Date · `max`: Date · `isDisabled`: (d: Date) => boolean · `presets`: { label: string; date: Date }[] · `clearable`: boolean = true · `invalid`: boolean · `weekStartsOn`: 0 | 1 · `id`: string · `locale`: string · `placeholder`: string = "Pick a date" · `disabled`: boolean
- **DatePicker** — v1 name (value/onChange).
  `onChange*`: (d: Date | null) => void · `size`: "sm" | "md" | "lg" · `id`: string · `max`: Date · `min`: Date · `value*`: Date | null · `invalid`: boolean · `clearable`: boolean · `isDisabled`: (d: Date) => boolean · `presets`: { label: string; date: Date }[] · `weekStartsOn`: 0 | 1 · `locale`: string · `disabled`: boolean · `placeholder`: string
- **DateRangeInput** — A start and end date: two months side by side, with presets. Apply commits.
  `value*`: DateRange · `onValueChange*`: (r: DateRange) => void · `size`: "sm" | "md" | "lg" = "md" · `min`: Date · `max`: Date · `presets`: { label: string; range: DateRange }[] = DEFAULT_PRESETS() · `invalid`: boolean · `id`: string · `locale`: string · `placeholder`: string = "Pick dates" · `disabled`: boolean
- **DateRangePicker** — v1 name.
  `onChange*`: (r: DateRange) => void · `size`: "sm" | "md" | "lg" · `id`: string · `max`: Date · `min`: Date · `value*`: DateRange · `invalid`: boolean · `presets`: { label: string; range: DateRange }[] · `locale`: string · `disabled`: boolean · `placeholder`: string
- **DateTimeInput** — A date and a time side by side; `value` is one Date.
  `value*`: Date | null · `onValueChange*`: (d: Date | null) => void · `step`: 5 | 10 | 15 | 30 | 60 = 15 · `hourFormat`: 24 | 12 = 24 · `size`: "sm" | "md" | "lg" = "md" · `min`: Date · `max`: Date · `invalid`: boolean · `id`: string · `disabled`: boolean
- **TimeInput** — A time of day from a grid of slots.
  `value*`: TimeValue · `onValueChange*`: (t: TimeValue) => void · `step`: 5 | 10 | 15 | 30 | 60 = 30 · `hourFormat`: 24 | 12 = 24 · `min`: string = "00:00" · `max`: string = "23:59" · `size`: "sm" | "md" | "lg" = "md" · `invalid`: boolean · `id`: string · `placeholder`: string = "Pick a time" · `disabled`: boolean
- **TimePicker** — v1 name.
  `value*`: TimeValue · `onValueChange*`: (t: TimeValue) => void · `step`: 5 | 10 | 15 | 30 | 60 · `hourFormat`: 24 | 12 · `min`: string · `max`: string · `size`: "sm" | "md" | "lg" · `invalid`: boolean · `id`: string · `placeholder`: string · `disabled`: boolean

## pickers.tsx

- **Cascader** — Pick a leaf in a hierarchy, column by column (Region → Country → City).
  `options*`: CascaderOption[] · `onChange*`: (path: string[]) => void · `value*`: string[] · `separator`: string = " / " · `size`: "sm" | "md" | "lg" = "md" · `invalid`: boolean · `id`: string · `placeholder`: string = "Select" · `disabled`: boolean
- **ColorPicker** — A brand or label color: swatches, a full picker and a hex field.
  `onChange*`: (hex: string) => void · `value*`: string · `presets`: string[] = PRESETS · `size`: "sm" | "md" | "lg" = "md" · `id`: string · `disabled`: boolean
- **FileInput** — Drag-and-drop or browse. Validates type and size before handing files to you; lists progress per file.
  `onFiles*`: (files: File[]) => void · `items`: UploadItem[] = [] · `onRemove`: (id: string) => void · `onRetry`: (id: string) => void · `accept`: string · `maxSize`: number · `multiple`: boolean = true · `hint`: ReactNode · `compact`: boolean · `label`: string = "Upload files" · `disabled`: boolean
- **FileUpload** — v1 name.
  `onFiles*`: (files: File[]) => void · `items`: UploadItem[] · `onRemove`: (id: string) => void · `onRetry`: (id: string) => void · `accept`: string · `maxSize`: number · `multiple`: boolean · `hint`: ReactNode · `compact`: boolean · `label`: string · `disabled`: boolean
- **InlineEdit** — Text that turns into a field on click. Enter saves, Esc cancels; async save shows a spinner.
  `onSave*`: (v: string) => void | Promise<void> · `label*`: string · `value*`: string · `validate`: (v: string) => string | null · `readOnly`: boolean · `placeholder`: string = "Empty"
- **OtpInput** — One-time code: one box per digit, paste fills all, Backspace walks back.
  `onChange*`: (v: string) => void · `length`: number = 6 · `value*`: string · `onComplete`: (v: string) => void · `invalid`: boolean · `autoFocus`: boolean · `groupSize`: number · `aria-label`: string · `disabled`: boolean
- **Rating** — Stars. Read-only shows the score; interactive supports arrows and hover preview.
  `value*`: number · `onChange`: (v: number) => void · `max`: number = 5 · `readOnly`: boolean · `size`: number = 16 · `label`: string = "Rating"
- **RichTextEditor** — Light formatting for notes and descriptions: bold, italic, underline, strike, lists, quote, code, link. Emits HTML.
  `onChange`: (html: string) => void · `minHeight`: number = 120 · `showCount`: boolean · `label`: string = "Text editor" · `placeholder`: string = "Write something…"
- **Transfer** — Move items between two lists — permissions, columns, members. Search, select, then → / ←.
  `items*`: TransferItem[] · `onChange*`: (keys: string[]) => void · `value*`: string[] · `titles`: [string, string] = ["Available", "Selected"] · `searchable`: boolean = true · `height`: number = 280

## layout.tsx

- **AppShell** — The whole app frame: side nav + (top nav) + content. Content sits on a raised, rounded panel.
  `sideNav`: ReactNode · `sidebar`: ReactNode · `topNav`: ReactNode · `banner`: ReactNode · `children*`: ReactNode · `variant`: "inset" | "flush" = "inset" · `defaultCollapsed`: boolean
- **AspectRatio** — Keeps media at a ratio (16/9, 1, 4/3) while filling the width.
  `ratio`: number = 16 / 9 · `children*`: ReactNode · `rounded`: boolean = true
- **Center** — Centers its child on both axes (empty states, loaders).
  `children*`: ReactNode · `inline`: boolean · `minHeight`: number | string
- **Divider** — A hairline between groups. `label` puts text in the middle ("or").
  `orientation`: "vertical" | "horizontal" = "horizontal" · `variant`: "dashed" | "default" | "strong" = "default" · `label`: ReactNode · `bleed`: boolean
- **Grid** — Equal columns that collapse on small screens, or an auto-fill grid with a minimum item width.
  `columns`: number | "auto" · `minItemWidth`: number = 240 · `gap`: number = 16 · `cols`: number
- **Header** — The sticky top bar of a screen: title, status, actions, profile. Frosted when content scrolls under it.
  `title*`: ReactNode · `status`: ReactNode · `breadcrumb`: ReactNode · `showTitle`: boolean · `start`: ReactNode · `actions`: ReactNode · `end`: ReactNode · `tabs`: ReactNode
- **HStack** — —
  `gap`: number · `wrap`: boolean · `justify`: "end" | "start" | "center" | "between" | "around" · `as`: ElementType · `align`: "end" | "start" | "center" | "baseline" | "stretch"
- **Inline** — A wrapping row (tags, buttons).
  `gap`: number = 8 · `justify`: "end" | "start" | "center" | "between" | "around" · `as`: ElementType · `align`: "end" | "start" | "center" | "baseline" | "stretch"
- **Layout** — Regions inside a screen: header, footer, a start pane (list), an end pane (inspector) and the content.
  `header`: ReactNode · `footer`: ReactNode · `start`: ReactNode · `end`: ReactNode · `children*`: ReactNode · `startWidth`: number = 280 · `endWidth`: number = 320 · `dividers`: boolean = true
- **Page** — The scrolling body of a screen with Keel's gutters. `narrow` for forms and settings.
  `width`: "full" | "wide" | "narrow" = "full"
- **PageHeading** — A big title block at the top of a page body.
  `title*`: ReactNode · `description`: ReactNode · `eyebrow`: ReactNode · `actions`: ReactNode · `size`: "sm" | "md" = "md"
- **PageToolbar** — Filters and search on the left, view options/actions on the right. Wraps on small screens.
  `end`: ReactNode
- **ResizeHandle** — A draggable divider. Arrow keys move it; double-click resets. Wire `onResize` to your pane size.
  `onResize*`: (next: number, e?: PointerEvent | PointerEvent) => void · `orientation`: "vertical" | "horizontal" = "vertical" · `value*`: number · `min`: number = 0 · `max`: number = 100 · `onReset`: () => void · `label`: string = "Resize" · `grip`: boolean = true
- **ScrollableArea** — A scrolling region with thin custom scrollbars. Give it a height (or let a flex parent).
  `children*`: ReactNode · `height`: number | string · `maxHeight`: number | string · `axis`: "both" | "x" | "y" = "y" · `label`: string
- **Section** — A titled region of a page. `variant="card"` puts it on a surface; `divided` adds a hairline on top.
  `title`: ReactNode · `description`: ReactNode · `action`: ReactNode · `variant`: "card" | "plain" | "divided" = "plain" · `children*`: ReactNode · `as`: ElementType = "section"
- **SplitPane** — Two panes with a draggable divider (list | detail). Stacks on phones.
  `start*`: ReactNode · `end*`: ReactNode · `defaultSize`: number = 40 · `min`: number = 20 · `max`: number = 80
- **Stack** — Flexbox with a gap. VStack/HStack are the common shorthands.
  `direction`: "column" | "row" = "column" · `gap`: number = 12 · `align`: "end" | "start" | "center" | "baseline" | "stretch" · `justify`: "end" | "start" | "center" | "between" | "around" · `wrap`: boolean · `as`: ElementType = "div"
- **Sticky** — Sticks to the top (or bottom) of its scroll container — table toolbars, form footers.
  `edge`: "bottom" | "top" = "top" · `offset`: number = 0 · `children*`: ReactNode
- **VStack** — —
  `gap`: number · `wrap`: boolean · `justify`: "end" | "start" | "center" | "between" | "around" · `as`: ElementType · `align`: "end" | "start" | "center" | "baseline" | "stretch"

## navigation.tsx

- **Anchor** — v1 name.
  `items*`: OutlineItem[] · `offset`: number · `title`: string
- **Breadcrumb** — v1 name.
  `items*`: Crumb[] · `separator`: "chevron" | "slash" · `max`: number
- **Breadcrumbs** — Where you are. The last item is the current page; long trails collapse into "…".
  `items*`: Crumb[] · `separator`: "chevron" | "slash" = "chevron" · `max`: number = 4
- **FilterButton** — A raised filter button with a count of active values.
  `size`: "xs" | "sm" | "md" | "lg" · `variant`: "outline" | "link" | "soft" | "accent" | "danger" | "primary" | "secondary" | "ghost" | "danger-ghost" · `leading`: ReactNode · `trailing`: ReactNode · `loading`: boolean · `fullWidth`: boolean · `count`: number · `disabled`: boolean
- **FilterMenu** — Multi-select filter in a menu, with search for long lists and a "Clear" action.
  `label*`: string · `options*`: FilterOption[] · `value*`: string[] · `onValueChange*`: (v: string[]) => void · `searchable`: boolean
- **MegaMenu** — A TopNav item that opens a wide panel of grouped links, with an optional featured card.
  `label*`: string · `columns*`: { title: string; links: NavLinkSpec[] }[] · `featured`: ReactNode
- **MegaMenuFeaturedCard** — A promo tile at the end of a MegaMenu: a new feature, a guide.
  `title*`: string · `eyebrow`: string · `description`: string · `href`: string
- **MobileNav** — Bottom tab bar for phones (hidden from 1024px). 3–5 destinations.
  `items*`: { value: string; label: string; icon: ReactNode; badge?: number }[] · `value*`: string · `onValueChange*`: (v: string) => void · `label`: string = "Main"
- **Outline** — "On this page" — tracks the section in view and scrolls to sections on click.
  `items*`: OutlineItem[] · `offset`: number = 80 · `title`: string = "On this page"
- **Pagination** — Move between pages of a list. Shows the range and, optionally, a rows-per-page picker.
  `page*`: number · `pageCount*`: number · `onPageChange*`: (p: number) => void · `total`: number · `pageSize`: number · `pageSizeOptions`: number[] · `onPageSizeChange`: (n: number) => void · `variant`: "full" | "simple" = "full" · `siblings`: number = 1 · `firstLast`: boolean
- **Sidebar** — The app's main navigation. Collapses to a 56px rail (⌘B), resizable by its edge, a drawer under 1024px.
  `children*`: ReactNode · `label`: string = "Main navigation"
- **SidebarBrand** — —
  `logo*`: ReactNode · `name*`: ReactNode · `meta`: ReactNode · `action`: ReactNode
- **SidebarContent** — —
  `children*`: ReactNode
- **SidebarFooter** — —
  `children*`: ReactNode
- **SidebarItem** — One destination. The active item is a raised tile. Children render as an indented sub-list.
  `label*`: string · `icon`: ReactNode · `count`: number · `active`: boolean · `href`: string · `onClick`: () => void · `trailing`: ReactNode
- **SidebarProvider** — Holds collapsed/width/mobile state. AppShell renders one for you. ⌘B / Ctrl+B toggles.
  `children*`: ReactNode · `defaultCollapsed`: boolean = false
- **SidebarSection** — —
  `title`: string · `action`: ReactNode · `children*`: ReactNode
- **SidebarTrigger** — The header button that collapses the rail (desktop) or opens the drawer (mobile).
- **SideNav** — Astryx-style name.
  `children*`: ReactNode · `label`: string
- **Stepper** — Progress through a multi-step flow. Completed steps can be clickable via `onStepClick`.
  `steps*`: Step[] · `current*`: number · `onStepClick`: (i: number) => void · `orientation`: "vertical" | "horizontal" = "horizontal"
- **Steps** — v1 name.
  `steps*`: Step[] · `current*`: number · `onStepClick`: (i: number) => void · `orientation`: "vertical" | "horizontal"
- **Tab** — Declarative tab for <TabList> (children = the panel). Renders nothing on its own.
  `label*`: ReactNode · `icon`: ReactNode · `value*`: string · `count`: number · `disabled`: boolean
- **TabList** — —
  `items`: TabItem[] · `variant`: "underline" | "pills" = "underline" · `onValueChange`: (v: string) => void
- **Tabs** — —
  `onValueChange`: { bivarianceHack(value: string): void; }['bivarianceHack'] | undefined
- **TabsContent** — —
  `value*`: string
- **TabsList** — The row of tabs. `underline` (page sections; a sliding ink bar) or `pills` (in-card views).
  `variant`: "underline" | "pills" = "underline" · `divider`: boolean = true · `fullWidth`: boolean
- **TabsTrigger** — —
  `value*`: string · `count`: number · `icon`: ReactNode · `disabled`: boolean
- **TopNav** — A product-level bar across the top: logo, primary links/menus, search and profile.
  `heading`: ReactNode · `start`: ReactNode · `center`: ReactNode · `end`: ReactNode · `label`: string = "Primary"
- **TopNavItem** — A plain link in the TopNav.
  `href`: string · `active`: boolean · `children*`: ReactNode · `onClick`: () => void
- **TopNavMegaMenu** — Astryx names.
  `label*`: string · `columns*`: { title: string; links: NavLinkSpec[] }[] · `featured`: ReactNode
- **TopNavMegaMenuFeaturedCard** — —
  `title*`: string · `eyebrow`: string · `description`: string · `href`: string
- **TopNavMenu** — A TopNav item that opens a simple list of links.
  `label*`: string · `links*`: NavLinkSpec[]

## overlay.tsx

- **AlertDialog** — Confirms a consequential action. Focus starts on Cancel; the action button names what happens.
  `title*`: ReactNode · `actionLabel*`: string · `onAction*`: () => void | Promise<void> · `open*`: boolean · `onOpenChange*`: (o: boolean) => void · `description`: ReactNode · `cancelLabel`: string = "Cancel" · `tone`: "default" | "warning" | "danger" = "danger"
- **BottomSheet** — Mobile-first sheet from the bottom. Drag the handle down (or press Esc) to dismiss.
  `title*`: ReactNode · `open*`: boolean · `onOpenChange*`: (o: boolean) => void · `showTitle`: boolean = true · `children*`: ReactNode · `footer`: ReactNode · `docked`: boolean = true
- **BottomSheetSwitcher** — Several bottom sheets where only one is open at a time (filters → sort → share). Pass the active id.
  `active*`: string | null · `onActiveChange*`: (id: string | null) => void · `sheets*`: { id: string; title: string; content: ReactNode; footer?: ReactNode }[]
- **Coachmark** — An onboarding hint anchored to one element. Chain steps with `step`/`total`. Show once per person.
  `title*`: ReactNode · `body*`: ReactNode · `children*`: ReactNode · `open*`: boolean · `onOpenChange*`: (o: boolean) => void · `step`: number · `total`: number · `onNext`: () => void · `onBack`: () => void · `side`: "bottom" | "left" | "right" | "top" = "bottom"
- **CommandPalette** — Search every action and destination. ↑/↓ move, ↵ runs, Esc closes.
  `items*`: CommandItem[] · `open*`: boolean · `onOpenChange*`: (o: boolean) => void · `emptyLabel`: string = "No results" · `footer`: boolean = true · `placeholder`: string = "Search or jump to…"
- **ConfirmDialog** — v1 name.
  `title*`: ReactNode · `actionLabel*`: string · `onAction*`: () => void | Promise<void> · `open*`: boolean · `onOpenChange*`: (o: boolean) => void · `description`: ReactNode · `cancelLabel`: string · `tone`: "default" | "warning" | "danger"
- **Dialog** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **DialogClose** — —
  `disabled`: boolean
- **DialogContent** — A focused task that blocks the page: confirm, short form, details. Esc and the scrim close it.
  `title*`: ReactNode · `description`: ReactNode · `footer`: ReactNode · `size`: "sm" | "md" | "lg" | "xl" = "md" · `hideClose`: boolean · `hideTitle`: boolean
- **DialogTrigger** — —
  `disabled`: boolean
- **Drawer** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **DrawerClose** — —
  `disabled`: boolean
- **DrawerContent** — A panel from the edge for record details and long forms. Floats 8px in, with rounded corners.
  `title*`: ReactNode · `description`: ReactNode · `side`: "left" | "right" = "right" · `size`: "sm" | "md" | "lg" | "xl" = "md" · `headerActions`: ReactNode · `eyebrow`: ReactNode · `footer`: ReactNode · `hideTitle`: boolean · `scrim`: boolean = true
- **DrawerSection** — A titled block in a drawer, separated by a hairline — not a card.
  `title`: ReactNode · `action`: ReactNode · `children*`: ReactNode
- **DrawerTrigger** — —
  `disabled`: boolean
- **HoverCard** — Rich preview on hover (a person, a record). Not for actions — use Popover.
  `trigger*`: ReactNode · `children*`: ReactNode · `side`: "bottom" | "left" | "right" | "top" = "bottom" · `align`: "end" | "start" | "center" = "start" · `openDelay`: number = 400
- **Lightbox** — Full-screen media viewer. ←/→ move, click zooms, Esc closes.
  `items*`: LightboxItem[] · `open*`: boolean · `onOpenChange*`: (o: boolean) => void · `index`: number = 0 · `onIndexChange`: (i: number) => void
- **Overlay** — Puts content over media — on hover (and keyboard focus) or always.
  `content*`: ReactNode · `children*`: ReactNode · `showOn`: "always" | "hover" = "hover" · `scrim`: boolean = true · `align`: "center" | "top-start" | "top-end" | "bottom-start" | "bottom-end" = "bottom-start"
- **Popconfirm** — A light, inline confirmation anchored to its trigger — for reversible-but-annoying actions.
  `title*`: ReactNode · `onConfirm*`: () => void | Promise<void> · `children*`: ReactNode · `description`: ReactNode · `confirmLabel`: string = "Confirm" · `cancelLabel`: string = "Cancel" · `tone`: "default" | "danger" = "default" · `side`: "bottom" | "left" | "right" | "top" = "top"
- **Popover** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **PopoverAnchor** — —
- **PopoverClose** — —
  `disabled`: boolean
- **PopoverContent** — —
  `flush`: boolean · `arrow`: boolean
- **PopoverTrigger** — —
  `disabled`: boolean
- **Sheet** — —
  `open`: boolean · `onOpenChange`: { bivarianceHack(open: boolean): void; }['bivarianceHack'] | undefined
- **SheetClose** — —
  `disabled`: boolean
- **SheetContent** — —
  `title*`: ReactNode · `description`: ReactNode · `side`: "left" | "right" · `size`: "sm" | "md" | "lg" | "xl" · `headerActions`: ReactNode · `eyebrow`: ReactNode · `footer`: ReactNode · `hideTitle`: boolean · `scrim`: boolean
- **SheetSection** — —
  `title`: ReactNode · `action`: ReactNode · `children*`: ReactNode
- **SheetTrigger** — —
  `disabled`: boolean
- **Tooltip** — A short label on hover/focus. Never put actions or essential info in it.
  `content*`: ReactNode · `shortcut`: string · `side`: "bottom" | "left" | "right" | "top" = "top" · `align`: "end" | "start" | "center" = "center" · `children*`: ReactNode · `open`: boolean
- **TooltipProvider** — —
  `children*`: ReactNode

## table.tsx

- **DataTable** — Sort, filter, select, expand, paginate, density and column visibility — the full records table.
  `data*`: T[] · `columns*`: Column<T>[] · `getRowId*`: (row: T) => string · `selectable`: boolean · `selected`: Set<string> · `onSelectedChange`: (ids: Set<string>) => void · `rowActions`: (row: T) => ReactNode · `renderExpanded`: (row: T) => ReactNode · `onRowClick`: (row: T) => void · `activeRowId`: string | null · `loading`: boolean · `loadingRows`: number = 8 · `empty`: ReactNode · `defaultSort`: SortState = null
- **Table** — —
- **TableBody** — —
- **TableCell** — —
  `align`: "left" | "right" | "center" · `density`: "default" | "compact" | "comfortable" = "default"
- **TableContainer** — Scroll wrapper. `variant="card"` (default) puts the table on a raised surface.
  `variant`: "card" | "plain" = "card"
- **TableFooter** — —
- **TableHead** — —
  `align`: "left" | "right" | "center"
- **TableHeader** — —
  `sticky`: boolean
- **TableRow** — —
  `selected`: boolean · `interactive`: boolean · `striped`: boolean
- **TableSelectionToolbar** — What to do with the selected rows. Floats at the bottom of the screen (default) or sits inline above the table.
  `count*`: number · `onClear*`: () => void · `children*`: ReactNode · `placement`: "inline" | "floating" = "floating" · `noun`: string = "selected"

## lists.tsx

- **DescriptionList** — v1 names.
  `items*`: MetadataItem[] · `layout`: "horizontal" | "stacked" · `columns`: 2 | 1 | 3 · `title`: ReactNode
- **List** — A vertical list of rows. `variant="card"` on a surface; `divided` adds hairlines.
  `children*`: ReactNode · `header`: ReactNode · `variant`: "card" | "plain" = "plain" · `divided`: boolean = true · `density`: "default" | "compact" = "default"
- **ListItem** — A row: leading avatar/icon, title + description, meta and trailing actions. Clickable when given onClick/href.
  `title*`: ReactNode · `leading`: ReactNode · `description`: ReactNode · `meta`: ReactNode · `trailing`: ReactNode · `onClick`: () => void · `href`: string · `selected`: boolean · `divided`: boolean = true · `compact`: boolean
- **MetadataList** — Key/value pairs for a record. Labels in a column (horizontal) or above values (stacked).
  `items*`: MetadataItem[] · `layout`: "horizontal" | "stacked" = "horizontal" · `columns`: 2 | 1 | 3 = 1 · `title`: ReactNode
- **OverflowList** — A single row of items (tags, avatars, links) that shows "+N" when they don't fit; the rest open in a popover.
  `children*`: ReactNode · `gap`: number = 6 · `minVisible`: number = 1 · `moreLabel`: (n: number) => ReactNode = (n: number) => `+${n}`
- **Timeline** — Chronological events, newest first, on a single hairline rail. Markers can be dots, icons or avatars.
  `events*`: TimelineEvent[]
- **Tree** — v1 name.
  `data*`: TreeNode[] · `aria-label*`: string · `selected`: string | null · `onSelect`: (id: string, node: TreeNode) => void · `checkable`: boolean · `defaultExpanded`: string[] · `expanded`: Set<string> · `onExpandedChange`: (ids: Set<string>) => void · `showIcons`: boolean · `checked`: Set<string> · `onCheckedChange`: (ids: Set<string>) => void
- **TreeList** — A hierarchy (folders, org chart, categories). Arrows move, → opens, ← closes, Space checks.
  `data*`: TreeNode[] · `aria-label*`: string · `selected`: string | null · `onSelect`: (id: string, node: TreeNode) => void · `checkable`: boolean · `defaultExpanded`: string[] = [] · `expanded`: Set<string> · `onExpandedChange`: (ids: Set<string>) => void · `showIcons`: boolean · `checked`: Set<string> · `onCheckedChange`: (ids: Set<string>) => void

## data.tsx

- **AreaChart** — Filled, stacked series (share of a total over time).
  `label*`: string · `labels*`: string[] · `series*`: ChartSeries[] · `height`: number · `legend`: boolean · `format`: (n: number) => string · `zero`: boolean · `curve`: boolean
- **BarChart** — Compare categories. Grouped or stacked; horizontal for long labels.
  `labels*`: string[] · `series*`: ChartSeries[] · `label*`: string · `height`: number = 220 · `format`: (n: number) => string = fmtCompact · `stacked`: boolean · `horizontal`: boolean · `highlight`: number · `legend`: boolean
- **BarList** — A ranked list with a bar behind each row — top pages, sources, countries. The best tool for "which ones?".
  `items*`: { name: ReactNode; value: number; icon?: ReactNode; href?: string }[] · `format`: (n: number) => string = fmtCompact · `highlight`: number = 0 · `onSelect`: (i: number) => void
- **BreakdownBar** — Parts of a whole as one segmented bar with a legend. Segments get the chart palette (first is blue).
  `items*`: { name: string; value: number; color?: number }[] · `height`: number = 10 · `legend`: "none" | "compact" | "full" = "full" · `total`: number · `format`: (n: number) => string = fmtCompact
- **BulletChart** — One measure against a target and qualitative ranges — the compact replacement for a gauge in tables and stats.
  `label*`: string · `value*`: number · `target`: number · `ranges`: number[] = [] · `max`: number · `format`: (n: number) => string = fmtCompact · `height`: number = 14 · `showValues`: boolean = true
- **ChartLegend** — A legend row. Optional values per item.
  `items*`: { name: string; color: string; value?: ReactNode }[]
- **ComboChart** — Bars for volume plus a line for a rate on a second axis — orders and conversion, tickets and CSAT.
  `labels*`: string[] · `bars*`: { name: string; values: number[] } · `line*`: { name: string; values: number[] } · `label*`: string · `height`: number = 240 · `format`: (n: number) => string = fmtCompact · `lineFormat`: (n: number) => string = (n: number) => `${n}%`
- **DonutChart** — Share of a whole (≤ 6 parts). The center shows the total, or the hovered part.
  `data*`: { name: string; value: number; color?: number }[] · `label*`: string · `size`: number = 160 · `thickness`: number = 18 · `format`: (n: number) => string = fmtCompact · `centerLabel`: string = "Total" · `legend`: boolean = true
- **DotPattern** — The texture under lines and in "rest of" areas: fine dots, no gradient.
  `id*`: string · `fill*`: string · `dense`: boolean
- **FunnelChart** — Steps that narrow — signup → activation → paid. Bars shrink to scale; conversion between steps on the right.
  `steps*`: { name: string; value: number }[] · `label*`: string · `format`: (n: number) => string = fmtCompact
- **GaugeChart** — A half-dial for a score against a range: health, NPS, utilization. Optional threshold ticks.
  `label*`: string · `value*`: number · `min`: number = 0 · `max`: number = 100 · `size`: number = 180 · `thickness`: number = 14 · `valueLabel`: ReactNode · `caption`: ReactNode · `thresholds`: number[] · `tone`: "accent" | "ink" = "accent"
- **Heatmap** — Values on a grid — activity by day × hour, usage by week. Five steps from muted to blue; hover shows the value.
  `rows*`: string[] · `columns*`: string[] · `values*`: number[][] · `label*`: string · `format`: (n: number) => string = (n: number) => String(n) · `cell`: number = 14 · `gap`: number = 3
- **LineChart** — Trend over time. Hover (or touch) scrubs a crosshair with every series' value.
  `labels*`: string[] · `series*`: ChartSeries[] · `label*`: string · `height`: number = 220 · `format`: (n: number) => string = fmtCompact · `area`: boolean = true · `zero`: boolean = false · `stacked`: boolean · `legend`: boolean · `curve`: boolean = true
- **RadarChart** — Several scores on shared axes — plan comparison, skills, health dimensions. Up to three series.
  `axes*`: string[] · `series*`: ChartSeries[] · `label*`: string · `size`: number = 240 · `max`: number
- **ScatterChart** — Two measures per item — size vs. growth, usage vs. revenue. Hover a dot for its name. Optional size channel.
  `points*`: { name: string; x: number; y: number; size?: number }[] · `label*`: string · `height`: number = 240 · `xLabel`: string · `yLabel`: string · `format`: (n: number) => string = fmtCompact · `highlight`: string[]
- **Sparkline** — A tiny trend for tables and stats. No axes. `type`: line (last point marked), area (dotted fill) or bars (last bar emphasized).
  `values*`: number[] · `width`: number = 96 · `height`: number = 28 · `tone`: "auto" | "muted" | "accent" | "success" | "danger" | "ink" | "inverse" = "accent" · `area`: boolean = false · `label`: string
- **Stat** — A headline number and its comparison. Every part except label and value can be turned on or off.
  `label*`: ReactNode · `value*`: ReactNode · `help`: ReactNode · `icon`: ReactNode · `iconTile`: boolean · `badge`: ReactNode · `action`: ReactNode · `delta`: number · `deltaUnit`: string = "%" · `deltaStyle`: "text" | "pill" | "arrow" = "pill" · `baseline`: ReactNode · `lowerIsBetter`: boolean · `neutral`: boolean · `meta`: ReactNode
- **StatGroup** — Stats side by side, split by hairlines on one surface. Two-up on phones.
  `children*`: ReactNode

## utility.tsx

- **KeelProvider** — Everything an app needs once at the root: theme, tooltips, toasts.
  `children*`: ReactNode · `defaultMode`: "light" | "dark" | "system" = "system"
- **ThemeProvider** — Theme state. Sets `data-theme` on <html> (tokens switch via `light-dark()`), remembers the choice,
  `children*`: ReactNode · `defaultMode`: "light" | "dark" | "system" = "system" · `storageKey`: string = "keel-theme"
- **VisuallyHidden** — Content for screen readers only (an icon button's extra context, a table caption).
  `as`: ElementType = "span" · `children*`: ReactNode

## spinner.tsx

- **Spinner** — A small ring that spins. Inherits the text color unless `tone="muted"`.
  `size`: number = 14 · `label`: string = "Loading" · `tone`: "current" | "muted" = "current"

## parts.tsx

- **AvatarGroupOverflow** — "+N" chip at the end of an avatar row.
  `count*`: number · `size`: number = 28 · `onClick`: () => void
- **AvatarStatusDot** — The presence dot on its own — for custom avatar layouts and people lists.
  `status`: "online" | "away" | "busy" | "offline" = "online" · `label`: string
- **BreadcrumbItem** — One crumb, for building breadcrumbs by hand. The last one is `current`.
  `href`: string · `current`: boolean · `icon`: ReactNode · `children*`: ReactNode
- **ChatComposerDrawer** — A tray that slides out above the composer — attachments, context, a slash-command menu.
  `children*`: ReactNode · `open`: boolean = true
- **ChatComposerInput** — The auto-growing textarea of a composer. Enter submits, Shift+Enter adds a line.
  `value*`: string · `onValueChange*`: (v: string) => void · `onSubmit`: () => void · `maxRows`: number = 8 · `placeholder`: string = "Message…"
- **ChatLayoutScrollButton** — "Jump to latest" pill. Show it when the reader has scrolled up and new messages arrive.
  `onClick*`: () => void · `visible`: boolean = true · `label`: string = "Jump to latest"
- **ChatMessageBubble** — A single bubble — user (ink, right) or assistant (sunken, left). For compact chat UIs.
  `role`: "user" | "assistant" = "assistant" · `children*`: ReactNode
- **ChatMessageList** — A live log of messages; announces new ones politely.
  `children*`: ReactNode
- **ChatSendButton** — Send, or Stop while streaming.
  `onClick*`: () => void · `onStop`: () => void · `streaming`: boolean · `disabled`: boolean
- **ChatTokenizedText** — Plain text with
  `text*`: string · `tokens`: string[] · `onTokenClick`: (t: string) => void
- **CheckboxIndicator** — —
  `checked*`: boolean | "indeterminate"
- **CheckboxListItem** — One checkbox row with label and description, divided — compose your own lists.
  `size`: "sm" | "md" · `label`: ReactNode · `invalid`: boolean · `description`: ReactNode · `divider`: boolean = true · `disabled`: boolean · `checked`: boolean | "indeterminate" · `onCheckedChange`: { bivarianceHack(checked: CheckedState): void; }['bivarianceHack'] | undefined
- **CheckIndicator** — —
  `checked*`: boolean | "indeterminate"
- **CollapsibleGroup** — Several collapsibles that behave as one: `type="single"` keeps one open.
  `items*`: { value: string; title: ReactNode; meta?: ReactNode; content: ReactNode; disabled?: boolean }[] · `variant`: "divided" | "separated" = "divided"
- **CommandMenu** — The composable command menu. Put it in a Dialog, a Popover or inline. Items filter by `value` (or their text) as you type.
  `children*`: ReactNode · `label`: string = "Commands"
- **CommandPaletteEmpty** — Shown when nothing matches.
- **CommandPaletteFooter** — Key hints along the bottom.
- **CommandPaletteGroup** — A titled group. Hides itself when none of its items match.
  `heading`: ReactNode · `children*`: ReactNode
- **CommandPaletteInput** — —
  `placeholder`: string = "Search or jump to…"
- **CommandPaletteItem** — —
  `onSelect*`: () => void · `icon`: ReactNode · `shortcut`: string · `end`: ReactNode · `children*`: ReactNode
- **CommandPaletteList** — —
  `children*`: ReactNode
- **DialogHeader** — A rich header for dialog bodies: icon tile, title, description, actions.
  `title*`: ReactNode · `icon`: ReactNode · `description`: ReactNode · `actions`: ReactNode
- **DrawerHeader** — —
  `title*`: ReactNode · `icon`: ReactNode · `description`: ReactNode · `actions`: ReactNode
- **FieldLabel** — —
- **GridSpan** — Make a Grid child span columns (or rows). `span="full"` spans the row.
  `span`: number | "full" = 1 · `rowSpan`: number · `children*`: ReactNode
- **Indicator** — Visual-only selection marks for custom rows (selectable cards, table-like pickers). Not focusable.
  `checked*`: boolean | "indeterminate"
- **InputGroupText** — Text inside an InputGroup edge: "https://", "USD", "@acme.com".
  `children*`: ReactNode
- **Item** — A generic row: leading visual, title + description, trailing meta/actions. Link, button or static.
  `title*`: ReactNode · `leading`: ReactNode · `description`: ReactNode · `trailing`: ReactNode · `href`: string · `onClick`: () => void · `as`: ElementType
- **LayoutContent** — —
  `children*`: ReactNode
- **LayoutFooter** — —
  `children*`: ReactNode
- **LayoutHeader** — —
  `children*`: ReactNode
- **LayoutPanel** — A side pane. `side` draws the divider on the correct edge.
  `side`: "end" | "start" = "start" · `width`: number | string = 280 · `children*`: ReactNode
- **LinkProvider** — Route every Keel link through your router: <LinkProvider component={NextLink}>.
  `component*`: LinkComp · `children*`: ReactNode
- **MegaMenuItem** — One rich link in a mega menu column.
  `title*`: ReactNode · `href*`: string · `icon`: ReactNode · `description`: ReactNode
- **MetadataListItem** — One label/value row, for building a MetadataList by hand.
  `label*`: ReactNode · `children*`: ReactNode
- **MobileNavToggle** — The hamburger that opens the side nav drawer on phones.
  `label`: string = "Open navigation"
- **NavHeadingMenu** — Workspace/app switcher at the top of a side nav or top nav.
  `name*`: string · `items*`: { id: string; name: string; meta?: string; logo?: ReactNode }[] · `onSelect*`: (id: string) => void · `logo`: ReactNode · `meta`: string · `footer`: ReactNode
- **NavIcon** — An icon with an optional count or dot — for nav items, toolbars, tab bars.
  `icon*`: ReactNode · `count`: number · `dot`: boolean
- **RadioIndicator** — —
  `checked*`: boolean | "indeterminate"
- **RadioListItem** — One radio row (use inside RadioGroup).
  `value*`: string · `label`: ReactNode · `description`: ReactNode · `divider`: boolean = true · `disabled`: boolean · `checked`: boolean
- **Resizable** — Two panes with a draggable, keyboard-resizable divider.
  `start*`: ReactNode · `end*`: ReactNode · `defaultSize`: number = 50 · `min`: number = 15 · `max`: number = 85 · `axis`: "x" | "y" = "x" · `label`: string = "Resize panes" · `onSizeChange`: (n: number) => void
- **SideNavCollapseButton** — —
- **SideNavHeading** — —
  `logo*`: ReactNode · `name*`: ReactNode · `meta`: ReactNode · `action`: ReactNode
- **SideNavItem** — —
  `label*`: string · `icon`: ReactNode · `count`: number · `active`: boolean · `href`: string · `onClick`: () => void · `trailing`: ReactNode
- **SideNavSection** — —
  `title`: string · `action`: ReactNode · `children*`: ReactNode
- **StackItem** — A Stack child that grows, shrinks or stays put.
  `grow`: boolean | number · `shrink`: boolean | number · `basis`: string | number · `align`: "end" | "start" | "center" | "stretch" · `children*`: ReactNode
- **TabMenu** — Tabs that never wrap: the ones that don't fit move into a "More" menu.
  `items*`: { value: string; label: ReactNode; count?: number; icon?: ReactNode }[] · `value*`: string · `onValueChange*`: (v: string) => void
- **Toast** — A toast you place yourself (inline confirmations, docs). For real notifications use `useToast()`.
  `title*`: ReactNode · `description`: ReactNode · `icon`: ReactNode · `tone`: "default" | "danger" = "default" · `action`: ReactNode · `onClose`: () => void
- **TopNavHeading** — Logo + product name for a TopNav.
  `name*`: ReactNode · `logo`: ReactNode · `href`: string = "/"

## hooks.ts

Headless behavior. Import from `@keel/components`.

- **useAnnounce** — Say something to screen readers without moving focus ("3 results", "Saved").
- **useCalendarDays** — The 6×7 (or fewer) day grid for a month, starting on `weekStartsOn` (0 = Sunday).
- **useClipboard** — Copy text; `copied` is true for `timeout` ms afterwards.
- **useCollapsible** — Collapsible state plus the ARIA wiring for a custom trigger and region.
- **useCollator** — A memoized Intl.Collator for sorting and searching names correctly.
- **useCombobox** — Headless combobox: query, filtered options, active index and the keyboard handler for your input.
- **useDebouncedValue** — A value that settles `ms` after it stops changing (search boxes).
- **useDisclosure** — Open/closed state for any overlay. Spread `{ open, onOpenChange }` onto Dialog, Drawer, Popover, Tooltip…
- **useFocusTrap** — Keeps Tab inside a container while active; restores focus when it ends.
- **useHotkeys** — Global shortcuts: { "mod+k": open, "shift+?": help, "g i": goInbox }. `mod` is ⌘ on Mac, Ctrl elsewhere. Ignored while typing unless `inInputs`.
- **useHoverCard**
- **useIsMobile** — Under 768px — Keel's phone breakpoint.
- **useLightbox** — Lightbox state: `show(i)` opens at an index; spread `props` onto <Lightbox items=…>.
- **useLocale** — The user's locale (from <html lang> or the browser).
- **useLongPress** — Press-and-hold (touch context menus, "hold to confirm"). Spread the returned handlers.
- **useMediaQuery** — Matches a media query, live. SSR-safe (false on the server).
- **useMergedRefs** — Combine refs (yours + a library's) onto one element.
- **useMultiCombobox** — Like useCombobox but keeps a set of picked values; Backspace on an empty query removes the last one.
- **useOutlineFromMarkdown** — Headings from a Markdown string, for an <Outline>: [{ id, title, level }].
- **useOverflow** — Whether an element's content overflows it (to show fades, "more" buttons, tooltips on truncated text).
- **useOverlay**
- **usePopover**
- **useResizable** — A size you can drag or nudge with arrow keys, clamped. Spread `handleProps` onto a separator.
- **useScrollLock** — Stops the page scrolling behind a custom overlay.
- **useSnapPaging** — Page through a scroll-snap row (carousels, card rails).
- **useStreamingText** — Reveals `text` progressively (for bursty model streams). Returns the visible slice and whether it's done.
- **useTableFiltering** — Text query across chosen fields plus per-column value filters.
- **useTablePagination** — Client-side paging. Resets to page 1 when the row count changes.
- **useTableSelection** — Row selection by id: toggle one, toggle all (on the visible rows), clear. `allState` drives a header checkbox.
- **useTableSort** — Sorts rows by a column. Click cycles asc → desc → none. Numbers, dates and strings (locale-aware) all sort correctly.
- **useTooltip**
