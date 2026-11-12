import type { ComponentType } from "react";
import * as action from "./demos/action";
import * as ai from "./demos/ai";
import * as chat from "./demos/chat";
import * as container from "./demos/container";
import * as content from "./demos/content";
import * as data from "./demos/data";
import * as feedback from "./demos/feedback";
import * as forms from "./demos/forms";
import * as layout from "./demos/layout";
import * as navigation from "./demos/navigation";
import * as overlay from "./demos/overlay";
import * as table from "./demos/table";
import * as utility from "./demos/utility";
import * as extras from "./demos/extras";
import type { Demo, DocPage } from "./docs/types";
import { guides } from "./pages/guides";

const files = { action, ai, chat, container, content, data, feedback, forms, layout, navigation, overlay, table, utility, extras } as const;
type File = keyof typeof files;

/** d("action", "ButtonVariants", "Variants") — a demo by its exported function name. */
function d(file: File, id: string, title: string, opts: Partial<Demo> = {}): Demo {
  const Comp = (files[file] as Record<string, ComponentType>)[id];
  if (!Comp) throw new Error(`Missing demo ${file}.${id}`);
  return { id, title, file, Comp, ...opts };
}
function p(group: string, slug: string, title: string, components: string[], description: string, demos: Demo[], extra: Partial<DocPage> = {}): DocPage {
  return { slug, title, group, components, description, demos, ...extra };
}

export const componentGroups = ["Action", "Chat", "AI", "Container", "Content", "Feedback & Status", "Form Controls", "Layout", "Navigation", "Overlay", "Table & List", "Data & Charts", "Utility"] as const;

const components: DocPage[] = [
  /* ---------------- Action */
  p("Action", "button", "Button", ["Button"], "The main way to act. Tactile: a top highlight, a hairline ring and a soft drop, sinking 1px when pressed.",
    [d("action", "ButtonVariants", "Variants"), d("action", "ButtonSizes", "Sizes & icons"), d("action", "ButtonStates", "All states")],
    { dos: ["One primary button per view — usually the action that finishes the task.", "Label with a verb: “Save changes”, “Send invite”.", "Use loading for anything that takes over ~300ms."], donts: ["Don't use a button to navigate — use Link.", "Don't put two primary buttons side by side.", "Don't color buttons by meaning except danger."] }),
  p("Action", "icon-button", "Icon Button", ["IconButton"], "A square button with a single icon. Always labelled — the label is read by screen readers and shown as a tooltip.",
    [d("action", "IconButtonVariants", "Variants"), d("action", "IconButtonStates", "All states")]),
  p("Action", "button-group", "Button Group", ["ButtonGroup"], "Related actions joined into one tactile bar — Undo | Redo, Prev | Next, a split button.", [d("action", "ButtonGroupDemo", "Examples")], { badge: "New" }),
  p("Action", "link", "Link", ["Link"], "Text that navigates. Accent by default; neutral and quiet for dense UI; external links open in a new tab.", [d("action", "LinkDemo", "Tones")], { badge: "New" }),
  p("Action", "toggle-button", "Toggle Button", ["ToggleButton", "ToggleButtonGroup"], "A button that stays pressed (Follow, Pin, Bold). Groups put toggles in a sunken tray, single or multiple.", [d("action", "ToggleButtonDemo", "Examples")], { badge: "New" }),
  p("Action", "segmented-control", "Segmented Control", ["SegmentedControl"], "Pick one of 2–5 views. The selection is a raised knob that slides between options.", [d("action", "SegmentedControlDemo", "Examples")]),
  p("Action", "toolbar", "Toolbar", ["Toolbar", "ToolbarButton", "ToolbarSeparator"], "A row of tools — formatting, canvas tools, bulk actions. Arrow keys move between items.", [d("action", "ToolbarDemo", "Floating & flat")], { badge: "New" }),
  p("Action", "dropdown-menu", "Dropdown Menu", ["DropdownMenuContent", "DropdownMenuItem", "DropdownMenuCheckboxItem", "DropdownMenuRadioItem", "DropdownMenuLabel", "DropdownMenuSeparator", "DropdownMenuSubTrigger", "DropdownMenuSubContent"],
    "Actions and options in a menu from a button. Items take an icon, a shortcut and a destructive style; supports checkboxes, radios and submenus.",
    [d("action", "DropdownMenuDemo", "Actions & options"), d("action", "DropdownMenuStates", "All states (pinned open)", { height: 260 })]),
  p("Action", "context-menu", "Context Menu", ["ContextMenuContent", "ContextMenuItem", "ContextMenuSeparator"], "The same menu, opened with a right-click or long-press on an area.", [d("action", "ContextMenuDemo", "Right-click area")]),
  p("Action", "more-menu", "More Menu", ["MoreMenu"], "A “…” button with a menu built from a list — the quickest way to add row or card actions.", [d("action", "MoreMenuDemo", "Examples")], { badge: "New" }),
  p("Action", "copy-button", "Copy Button", ["CopyButton"], "Copies a value and confirms with a check for 1.5 seconds.", [d("action", "CopyButtonDemo", "Examples")]),

  /* ---------------- Chat */
  p("Chat", "chat-layout", "Chat Layout", ["ChatLayout"], "A full-height conversation. The thread sticks to the newest message; a “Latest” button appears when you scroll up.", [d("chat", "ChatLayoutDemo", "Live conversation", { bleed: true, height: 560 })], { badge: "New" }),
  p("Chat", "chat-message", "Chat Message", ["ChatMessage"], "One turn. User messages are raised bubbles on the right; assistant replies are open Markdown on the left with copy, vote and retry.",
    [d("chat", "ChatMessageDemo", "User & assistant"), d("chat", "ChatMessageStates", "All states")], { badge: "New" }),
  p("Chat", "chat-parts", "Chat Parts", ["ChatMessageList", "ChatMessageBubble", "ChatComposerInput", "ChatComposerDrawer", "ChatSendButton", "ChatLayoutScrollButton", "ChatTokenizedText"], "The pieces behind ChatLayout and ChatComposer, for compact or custom chat UIs.", [d("extras", "ChatPartsDemo", "Parts")], { badge: "New" }),
  p("Chat", "chat-message-metadata", "Chat Message Metadata", ["ChatMessageMetadata"], "Small facts under a message: time, model, tokens, delivery state.", [d("chat", "ChatMessageMetadataDemo", "Examples")], { badge: "New" }),
  p("Chat", "chat-system-message", "Chat System Message", ["ChatSystemMessage"], "A neutral notice in the thread — a date divider, someone joining, context reset.", [d("chat", "ChatSystemMessageDemo", "Examples")], { badge: "New" }),
  p("Chat", "chat-tool-calls", "Chat Tool Calls", ["ChatToolCalls"], "What the assistant did: each tool call with status, input and output, collapsed to one line by default.", [d("chat", "ChatToolCallsDemo", "Examples")], { badge: "New" }),
  p("Chat", "chat-composer", "Chat Composer", ["ChatComposer", "ChatDictationButton"], "Where people write. Grows with the text; Enter sends, Shift+Enter adds a line; attachments, dictation, a model picker slot, and Stop while streaming.",
    [d("extras", "ComposerStylesDemo", "Styles"), d("chat", "ChatComposerDemo", "Composer"), d("chat", "ChatComposerStates", "All states")], { badge: "New" }),

  /* ---------------- AI */
  p("AI", "thinking", "Thinking & Loaders", ["Thinking", "PixelLoader", "LoadingState"], "Moments of waiting: a shimmering “Thinking…” with elapsed time and expandable reasoning, a pixel loader, and a longer loading state with the current step.", [d("ai", "ThinkingDemo", "All states")], { badge: "New" }),
  p("AI", "streaming-text", "Streaming Text", ["StreamingText"], "Reveals text at a reading pace with a caret — for demos and for smoothing bursty streams.", [d("ai", "StreamingTextDemo", "Example")], { badge: "New" }),
  p("AI", "prompt-bar", "Prompt Bar", ["PromptBar", "PromptSuggestions"], "A one-line “ask AI” pill for search pages, empty states and table headers, with starter prompts.", [d("ai", "PromptBarDemo", "Example")], { badge: "New" }),
  p("AI", "tool-chips", "Tool Chips", ["ToolChips"], "Tools the assistant may use. Toggle them, and see which is running.", [d("ai", "ToolChipsDemo", "Example")], { badge: "New" }),
  p("AI", "approval-card", "Approval Card", ["ApprovalCard"], "The agent wants to do something consequential — show exactly what, and let a person approve or reject.", [d("ai", "ApprovalCardDemo", "Pending & resolved")], { badge: "New" }),
  p("AI", "recommendation-card", "Recommendation Card", ["RecommendationCard", "ConfidenceMeter", "AiBadge"], "A suggestion with its reasoning, a confidence meter and one-click actions.", [d("ai", "RecommendationCardDemo", "Examples")], { badge: "New" }),
  p("AI", "context-cards", "Context Cards", ["ContextCard", "ContextChips"], "Files, pages and records attached to a prompt.", [d("ai", "ContextCardsDemo", "Examples")], { badge: "New" }),
  p("AI", "insight-card", "Insight Card", ["InsightCard"], "A generated finding about a metric: the number, the trend, one line of why, and a follow-up.", [d("ai", "InsightCardDemo", "Examples")], { badge: "New" }),
  p("AI", "diff-table", "Diff Table", ["DiffTable"], "AI-proposed edits to records. Old values struck, new ones highlighted; accept or reject each, or all.", [d("ai", "DiffTableDemo", "Review changes")], { badge: "New" }),
  p("AI", "task-list", "Task List", ["TaskList"], "An agent's plan and its progress, one row per task.", [d("ai", "TaskListDemo", "All states"), d("extras", "TaskCapsulesDemo", "Capsules")], { badge: "New" }),
  p("AI", "parameter-card", "Parameter Card", ["ParameterCard"], "Tunable model or job settings with live values.", [d("ai", "ParameterCardDemo", "Example")], { badge: "New" }),

  /* ---------------- Container */
  p("Container", "card", "Card", ["Card", "CardHeader", "CardBody", "CardFooter"], "A surface that groups related content. Use only when the group needs a boundary — most layouts don't.", [d("container", "CardDemo", "Variants")]),
  p("Container", "bezel", "Bezel", ["Bezel"], "Keel's signature container: a sunken shell with a mono label strip around a raised surface. For proposals, insights, approvals — anything that says “look at this”.", [d("extras", "BezelDemo", "Examples")], { badge: "New" }),
  p("Container", "clickable-card", "Clickable Card", ["ClickableCard"], "A whole card that is one action. Lifts on hover, sinks back on press.", [d("container", "ClickableCardDemo", "Examples")], { badge: "New" }),
  p("Container", "selectable-card", "Selectable Card", ["SelectableCard"], "A card you select — plans, templates, add-ons. A ring and a check when on; radio or checkbox semantics.", [d("container", "SelectableCardDemo", "Single & multiple")], { badge: "New" }),
  p("Container", "collapsible", "Collapsible", ["Collapsible"], "Show or hide one section, like “Advanced settings”.", [d("container", "CollapsibleDemo", "Examples")]),
  p("Container", "accordion", "Accordion", ["Accordion", "AccordionItem"], "Several collapsible sections — FAQs, settings groups. Divided or separated cards; single or multiple open.", [d("container", "AccordionDemo", "Divided & separated")]),
  p("Container", "carousel", "Carousel", ["Carousel"], "A row of cards that scrolls sideways with snap. Swipe, shift+wheel, or the buttons; edges fade when there's more.", [d("container", "CarouselDemo", "Examples")], { badge: "New" }),

  /* ---------------- Content */
  p("Content", "text", "Text", ["Text"], "Every piece of text. Pick a variant for size and a tone for emphasis — never raw font sizes.", [d("content", "TextDemo", "Scale"), d("content", "TextStates", "Tones & modifiers")]),
  p("Content", "heading", "Heading", ["Heading"], "A heading with the right element for its level; the look can differ from the level.", [d("content", "HeadingDemo", "Levels")], { badge: "New" }),
  p("Content", "avatar", "Avatar", ["Avatar"], "A person or organization. Falls back to initials with a stable tint per name.", [d("content", "AvatarDemo", "All states")]),
  p("Content", "avatar-parts", "Avatar Status Dot & Overflow", ["AvatarStatusDot", "AvatarGroupOverflow"], "Presence dots and the “+N” chip on their own, for custom people layouts.", [d("extras", "AvatarPartsDemo", "Examples")], { badge: "New" }),
  p("Content", "avatar-group", "Avatar Group", ["AvatarGroup"], "Overlapping avatars with a “+N” for the rest, names on hover.", [d("content", "AvatarGroupDemo", "Examples")]),
  p("Content", "blockquote", "Blockquote", ["Blockquote"], "A quotation, optionally attributed.", [d("content", "BlockquoteDemo", "Example")], { badge: "New" }),
  p("Content", "citation", "Citation", ["Citation"], "A source reference in generated text: a numbered marker or a source chip, with the source on hover.", [d("content", "CitationDemo", "Marker & chip")], { badge: "New" }),
  p("Content", "code", "Code", ["Code"], "An inline monospace value — ids, keys, file names.", [d("content", "CodeDemo", "Examples")]),
  p("Content", "code-block", "Code Block", ["CodeBlock"], "Multi-line code with a title bar, syntax colors, line numbers, highlights, diffs, wrap, collapse and copy.", [d("content", "CodeBlockDemo", "Examples"), d("content", "CodeBlockStates", "All states")]),
  p("Content", "markdown", "Markdown", ["Markdown"], "Renders a safe subset of Markdown with [^n] citations and a streaming caret — made for assistant replies.", [d("content", "MarkdownDemo", "Example")], { badge: "New" }),
  p("Content", "icon", "Icon", ["Icon"], "Keel icons are Lucide at a 1.5px stroke. Icon gives any of them a tone, a size, or a raised tile.", [d("content", "IconDemo", "Tones & tiles"), d("content", "IconGallery", "All icons")], { badge: "New" }),
  p("Content", "kbd", "Kbd", ["Kbd", "KbdGroup"], "A key, drawn like a key.", [d("content", "KbdDemo", "Examples")]),
  p("Content", "kbd-icons", "Key Icons", ["Kbd", "KbdGroup", "keyParts", "KeyHint"], "Modifier and arrow keys are always drawn as icons — never as ⌘ ⇧ ↵ text. Pass symbols or names (mod, shift, enter).", [d("extras", "KbdIconsDemo", "All keys")], { badge: "New" }),
  p("Content", "thumbnail", "Thumbnail", ["Thumbnail", "ImagePreview"], "A small image tile for attachments and galleries, with remove, loading and caption; ImagePreview opens it full size.", [d("content", "ThumbnailDemo", "All states")], { badge: "New" }),
  p("Content", "timer", "Timer", ["Timer"], "Live elapsed or remaining time — a call, a running job, a countdown.", [d("content", "TimerDemo", "Examples")], { badge: "New" }),
  p("Content", "timestamp", "Timestamp", ["Timestamp"], "A date or time — relative when recent, absolute after a week — with the full date on hover.", [d("content", "TimestampDemo", "Formats")], { badge: "New" }),
  p("Content", "token", "Token", ["Token"], "An entity chip — a person, a team, a file. Raised, clickable and removable.", [d("content", "TokenDemo", "All states")], { badge: "New" }),
  p("Content", "tag", "Tag", ["Tag"], "A short label for a category or attribute. Ten tones, soft or solid.", [d("content", "TagDemo", "All states")]),

  /* ---------------- Feedback */
  p("Feedback & Status", "badge", "Badge", ["Badge", "CountBadge"], "A number or dot pinned to an icon, or a small count beside a label.", [d("feedback", "BadgeDemo", "All states")]),
  p("Feedback & Status", "status-dot", "Status Dot & Pill", ["StatusDot", "StatusPill"], "Live state as a colored dot, or a record's status as a dot and a word on a pill.", [d("feedback", "StatusDemo", "All states")], { badge: "New" }),
  p("Feedback & Status", "banner", "Banner", ["Banner"], "A page or section message that stays until resolved.", [d("feedback", "BannerDemo", "Tones")]),
  p("Feedback & Status", "alert", "Alert & Inline Message", ["Alert", "InlineMessage"], "A raised message card inside content, and one-line status beside a field or row.", [d("feedback", "AlertDemo", "Alerts"), d("feedback", "InlineMessageDemo", "Inline messages")]),
  p("Feedback & Status", "info-tip", "Info Tip", ["InfoTip"], "A “?” that explains a term. Opens on click or tap, so it works on touch.", [d("feedback", "InfoTipDemo", "Example")], { badge: "New" }),
  p("Feedback & Status", "progress-bar", "Progress", ["ProgressBar", "ProgressRing", "SegmentBar", "ProgressDots"], "Completion as a bar, a ring, segments or dots. Leave value out for indeterminate.", [d("feedback", "ProgressDemo", "Bars"), d("feedback", "ProgressStates", "Ring, segments, dots")]),
  p("Feedback & Status", "skeleton", "Skeleton", ["Skeleton", "SkeletonText"], "A shimmering placeholder in the shape of what's loading.", [d("feedback", "SkeletonDemo", "Example")]),
  p("Feedback & Status", "spinner", "Spinner", ["Spinner"], "A small ring that spins. Inherits the text color.", [d("feedback", "SpinnerDemo", "Examples")]),
  p("Feedback & Status", "toast", "Toast", ["Toaster", "useToast"], "Brief confirmation after an action, bottom-right, with an optional Undo.", [d("feedback", "ToastDemo", "Tones")]),
  p("Feedback & Status", "toast-static", "Toast (static)", ["Toast"], "A toast you place yourself — for inline confirmations and docs. Real notifications use useToast().", [d("extras", "ToastStaticDemo", "Examples")], { badge: "New" }),
  p("Feedback & Status", "empty-state", "Empty State", ["EmptyState", "ErrorState", "OfflineState", "PermissionState"], "Nothing here yet — say why and what to do next.", [d("feedback", "EmptyStateDemo", "Examples"), d("feedback", "EmptyStateStates", "Error, offline, permission")]),
  p("Feedback & Status", "status-pages", "Status Pages", ["StatusPage", "NotFoundPage", "ForbiddenPage", "ServerErrorPage"], "Full-page errors in plain words: what happened, what to do.", [d("feedback", "StatusPagesDemo", "404, 403, 500")]),

  /* ---------------- Forms */
  p("Form Controls", "field", "Field", ["Field", "FieldStatus", "Label"], "Wires a label, description, error, status and count to one control — no ids by hand.", [d("forms", "FieldDemo", "Examples"), d("forms", "FieldStates", "All states")]),
  p("Form Controls", "text-input", "Text Input", ["Input", "SearchInput", "PasswordInput"], "Single-line text in a recessed well that lifts its ring on focus.", [d("forms", "InputDemo", "Examples"), d("forms", "InputStates", "All states")]),
  p("Form Controls", "number-input", "Number Input", ["NumberInput"], "A number with steppers, arrow keys (Shift for ×10), clamping and units.", [d("forms", "NumberInputDemo", "All states")], { badge: "New" }),
  p("Form Controls", "text-area", "Text Area", ["TextArea"], "Multi-line text; grows with its content when asked; a footer slot for tools.", [d("forms", "TextAreaDemo", "Examples")]),
  p("Form Controls", "input-group", "Input Group", ["InputGroup"], "A control with attached add-ons: “https://” [ domain ] “.com”.", [d("forms", "InputGroupDemo", "Examples")], { badge: "New" }),
  p("Form Controls", "checkbox", "Checkbox", ["Checkbox", "CheckboxList"], "Yes/no choices. A raised box that turns accent; indeterminate for “some”.", [d("forms", "CheckboxDemo", "All states")]),
  p("Form Controls", "indicators", "Indicators & List Items", ["Indicator", "CheckboxIndicator", "RadioIndicator", "CheckIndicator", "CheckboxListItem", "RadioListItem"], "Visual-only selection marks for custom rows, and single list rows with label and description.", [d("extras", "IndicatorDemo", "Indicators"), d("extras", "ListItemPartsDemo", "List items")], { badge: "New" }),
  p("Form Controls", "declarative-items", "Declarative Items", ["SegmentedControlItem", "SelectorOption", "Tab"], "Write options as children instead of arrays: <SegmentedControlItem>, <SelectorOption>, <Tab>.", [d("extras", "DeclarativeDemo", "Examples")], { badge: "New" }),
  p("Form Controls", "radio-list", "Radio List", ["RadioList", "RadioGroup", "Radio"], "Exactly one from a short list — plain or as described cards.", [d("forms", "RadioListDemo", "Examples")]),
  p("Form Controls", "switch", "Switch", ["Switch"], "On/off that takes effect immediately. The knob springs across the track.", [d("forms", "SwitchDemo", "All states")]),
  p("Form Controls", "slider", "Slider", ["Slider", "RangeSlider"], "A value or range on a continuous scale, with marks.", [d("forms", "SliderDemo", "Examples")]),
  p("Form Controls", "selector", "Selector", ["Select"], "Pick one from a short known list. Recessed field or raised button look.", [d("forms", "SelectDemo", "All states")]),
  p("Form Controls", "combobox", "Combobox & Multi Selector", ["Combobox", "MultiSelector"], "Searchable select, single or multiple, with create-new.", [d("forms", "ComboboxDemo", "All states")]),
  p("Form Controls", "complex-selector", "Complex Selector", ["ComplexSelector"], "A rich, grouped picker — people with roles, projects with owners.", [d("forms", "ComplexSelectorDemo", "Single & multiple")], { badge: "New" }),
  p("Form Controls", "typeahead", "Typeahead", ["Typeahead", "TypeaheadItem"], "Type to search a list or an async source; pick one suggestion.", [d("forms", "TypeaheadDemo", "Examples")], { badge: "New" }),
  p("Form Controls", "tokenizer", "Tokenizer", ["Tokenizer"], "Several entities as tokens in one field — recipients, assignees, tags.", [d("forms", "TokenizerDemo", "Examples")], { badge: "New" }),
  p("Form Controls", "power-search", "Power Search", ["PowerSearch"], "Structured search: field → operator → value, as chips. Free text becomes a contains filter.", [d("forms", "PowerSearchDemo", "Example")], { badge: "New" }),
  p("Form Controls", "calendar", "Calendar", ["Calendar"], "A month grid for single dates or ranges, with week numbers and disabled days. Full keyboard support.", [d("forms", "CalendarDemo", "Single & range")]),
  p("Form Controls", "date-input", "Date Input", ["DateInput"], "One date in a field that opens a calendar, with presets.", [d("forms", "DateInputDemo", "All states")]),
  p("Form Controls", "date-range-input", "Date Range Input", ["DateRangeInput"], "A start and end date across two months, with presets and Apply.", [d("forms", "DateRangeInputDemo", "Example")]),
  p("Form Controls", "date-time-input", "Date Time Input", ["DateTimeInput"], "A date and a time side by side; the value is one Date.", [d("forms", "DateTimeInputDemo", "Example")], { badge: "New" }),
  p("Form Controls", "time-input", "Time Input", ["TimeInput"], "A time of day from a grid of slots, 12 or 24-hour.", [d("forms", "TimeInputDemo", "All states")]),
  p("Form Controls", "file-input", "File Input", ["FileInput"], "Drag-and-drop or browse. Validates type and size; lists progress per file.", [d("forms", "FileInputDemo", "All states")]),
  p("Form Controls", "otp-input", "OTP Input", ["OtpInput"], "One-time codes: a box per digit, paste fills all.", [d("forms", "OtpInputDemo", "All states")]),
  p("Form Controls", "rating", "Rating", ["Rating"], "Stars, read-only or interactive.", [d("forms", "RatingDemo", "All states")]),
  p("Form Controls", "color-picker", "Color Picker", ["ColorPicker"], "A brand or label color from swatches, a full picker, or hex.", [d("forms", "ColorPickerDemo", "Example")]),
  p("Form Controls", "transfer", "Transfer", ["Transfer"], "Move items between two lists — permissions, columns, members.", [d("forms", "TransferDemo", "Example")]),
  p("Form Controls", "cascader", "Cascader", ["Cascader"], "Pick a leaf in a hierarchy, column by column.", [d("forms", "CascaderDemo", "Example")]),
  p("Form Controls", "inline-edit", "Inline Edit", ["InlineEdit"], "Text that turns into a field on click. Enter saves, Esc cancels.", [d("forms", "InlineEditDemo", "All states")]),
  p("Form Controls", "rich-text-editor", "Rich Text Editor", ["RichTextEditor"], "Light formatting for notes and descriptions. Emits HTML.", [d("forms", "RichTextEditorDemo", "Example")], { badge: "New" }),

  /* ---------------- Layout */
  p("Layout", "app-shell", "App Shell", ["AppShell", "Sidebar", "SidebarBrand", "SidebarItem", "SidebarSection", "SidebarTrigger"], "The whole app frame: side nav, optional top nav and banner, and content on a raised, rounded panel.", [d("layout", "AppShellDemo", "Live shell", { bleed: true })]),
  p("Layout", "layout", "Layout", ["Layout"], "Regions inside a screen: header, footer, a start pane, an end pane and scrolling content.", [d("layout", "LayoutDemo", "Panes", { bleed: false })], { badge: "New" }),
  p("Layout", "page-header", "Header & Page", ["Header", "Page", "PageHeading", "PageToolbar"], "The sticky top bar, the page body with gutters, a big heading block and the toolbar above lists.", [d("layout", "PageHeaderDemo", "Examples")]),
  p("Layout", "stack", "Stack", ["Stack", "VStack", "HStack", "Inline", "Center"], "Flexbox with a gap — vertical, horizontal, wrapping, centered.", [d("layout", "StackDemo", "Examples")]),
  p("Layout", "grid", "Grid", ["Grid"], "Equal columns that collapse on small screens, or auto-fill with a minimum width.", [d("layout", "GridDemo", "Examples")]),
  p("Layout", "section", "Section", ["Section"], "A titled region of a page — plain, on a card, or divided.", [d("layout", "SectionDemo", "Variants")], { badge: "New" }),
  p("Layout", "form-layout", "Form Layout", ["FormLayout", "FormSection"], "Spacing for forms: stacked fields, titled sections, or one inline row.", [d("forms", "FormLayoutDemo", "Sections & inline")]),
  p("Layout", "divider", "Divider", ["Divider"], "A hairline between groups; strong, dashed, vertical or with a label.", [d("layout", "DividerDemo", "Variants")]),
  p("Layout", "aspect-ratio", "Aspect Ratio", ["AspectRatio"], "Keeps media at a ratio while filling the width.", [d("layout", "AspectRatioDemo", "Ratios")], { badge: "New" }),
  p("Layout", "scrollable-area", "Scrollable Area", ["ScrollableArea"], "A scrolling region with thin custom scrollbars.", [d("layout", "ScrollableAreaDemo", "Example")], { badge: "New" }),
  p("Layout", "resize-handle", "Resize Handle & Split Pane", ["ResizeHandle", "SplitPane"], "A draggable divider, and two panes that use one. Arrow keys work; double-click resets.", [d("layout", "SplitPaneDemo", "Examples")]),
  p("Layout", "resizable", "Resizable", ["Resizable", "useResizable"], "Two panes with a draggable, keyboard-resizable divider.", [d("extras", "ResizableDemo", "Example")], { badge: "New" }),
  p("Layout", "layout-parts", "Layout Parts", ["LayoutHeader", "LayoutContent", "LayoutFooter", "LayoutPanel", "GridSpan", "StackItem", "Item"], "Regions and children for building your own layouts: header/content/footer/panel, grid spans, stack items and a generic row.", [d("extras", "LayoutPartsDemo", "Regions"), d("extras", "ItemDemo", "Item")], { badge: "New" }),
  p("Layout", "sticky", "Sticky", ["Sticky"], "Sticks to the top or bottom of its scroll container.", [d("layout", "StickyDemo", "Example")]),

  /* ---------------- Navigation */
  p("Navigation", "side-nav", "Side Nav", ["Sidebar", "SidebarBrand", "SidebarContent", "SidebarSection", "SidebarItem", "SidebarFooter", "SidebarTrigger", "SidebarProvider"],
    "The app's main navigation. The active item is a raised tile. Collapses to a rail (Cmd/Ctrl+B), resizes by its edge, becomes a drawer on phones.", [d("layout", "AppShellDemo", "In the app shell", { bleed: true })]),
  p("Navigation", "top-nav", "Top Nav", ["TopNav", "TopNavItem", "TopNavMenu"], "A product-level bar across the top: logo, links and menus, search and profile.", [d("navigation", "TopNavDemo", "With menus", { bleed: true })], { badge: "New" }),
  p("Navigation", "mega-menu", "Mega Menu", ["MegaMenu", "MegaMenuFeaturedCard"], "A wide panel of grouped links with a featured card, from a TopNav item.", [d("navigation", "TopNavDemo", "In a top nav", { bleed: true })], { badge: "New" }),
  p("Navigation", "mobile-nav", "Mobile Nav", ["MobileNav"], "A floating bottom tab bar for phones.", [d("navigation", "MobileNavDemo", "Example")], { badge: "New" }),
  p("Navigation", "breadcrumbs", "Breadcrumbs", ["Breadcrumbs"], "Where you are. Long trails collapse into a menu.", [d("navigation", "BreadcrumbsDemo", "All states")]),
  p("Navigation", "tabs", "Tabs", ["TabList", "TabsList", "TabsTrigger", "TabsContent"], "Switch between views of the same thing. Underline (with a sliding ink bar) or pills.", [d("navigation", "TabsDemo", "Underline & pills")]),
  p("Navigation", "tab-menu", "Tab Menu", ["TabMenu"], "Tabs that never wrap — the ones that don't fit move into a More menu. Good for count tabs in page headers.", [d("extras", "TabMenuDemo", "Example")], { badge: "New" }),
  p("Navigation", "nav-parts", "Navigation Parts", ["NavHeadingMenu", "NavIcon", "TopNavHeading", "MegaMenuItem", "MobileNavToggle", "SideNavItem", "SideNavSection", "SideNavHeading", "SideNavCollapseButton"], "Workspace switcher, icons with counts, top nav heading and rich mega menu links.", [d("extras", "NavPartsDemo", "Parts")], { badge: "New" }),
  p("Navigation", "pagination", "Pagination", ["Pagination"], "Move between pages of a list, with the range and rows per page.", [d("navigation", "PaginationDemo", "Full, simple, first/last")]),
  p("Navigation", "stepper", "Stepper", ["Stepper"], "Progress through a multi-step flow; completed steps can be revisited.", [d("navigation", "StepperDemo", "Horizontal & vertical")]),
  p("Navigation", "outline", "Outline", ["Outline"], "“On this page” — tracks the section in view and scrolls on click.", [d("navigation", "OutlineDemo", "Example")]),
  p("Navigation", "filter-menu", "Filter Menu", ["FilterMenu", "FilterButton"], "Multi-select filters in a menu with counts, search and clear.", [d("navigation", "FilterMenuDemo", "Examples")]),

  /* ---------------- Overlay */
  p("Overlay", "dialog", "Dialog", ["DialogContent"], "A focused task that blocks the page. Title, body, and a sunken footer for actions.", [d("overlay", "DialogDemo", "Examples")]),
  p("Overlay", "dialog-parts", "Dialog Header & Imperative Dialogs", ["DialogHeader", "DrawerHeader", "useImperativeDialog", "useImperativeAlertDialog"], "A rich header for dialog bodies, and confirm dialogs you can await from an event handler.", [d("extras", "DialogPartsDemo", "Examples")], { badge: "New" }),
  p("Overlay", "alert-dialog", "Alert Dialog", ["AlertDialog"], "Confirms a consequential action. Focus starts on Cancel; the action names what happens.", [d("overlay", "AlertDialogDemo", "Danger & warning")], { badge: "New" }),
  p("Overlay", "drawer", "Drawer", ["DrawerContent", "DrawerSection"], "A panel from the edge for details and long forms. Floats 8px in, with rounded corners.", [d("overlay", "DrawerDemo", "Examples")]),
  p("Overlay", "bottom-sheet", "Bottom Sheet", ["BottomSheet", "BottomSheetSwitcher"], "A sheet from the bottom for phones. Drag the handle down to dismiss; the switcher moves between sheets.", [d("overlay", "BottomSheetDemo", "Examples")], { badge: "New" }),
  p("Overlay", "popover", "Popover", ["PopoverContent"], "Rich content anchored to a trigger — quick edits, pickers.", [d("overlay", "PopoverDemo", "Examples")]),
  p("Overlay", "hover-card", "Hover Card", ["HoverCard"], "A preview on hover — a person, a record. Not for actions.", [d("overlay", "HoverCardDemo", "Example")]),
  p("Overlay", "tooltip", "Tooltip", ["Tooltip"], "A short label on hover or focus, with an optional shortcut.", [d("overlay", "TooltipDemo", "Examples")]),
  p("Overlay", "command-palette", "Command Palette", ["CommandPalette", "useCommandShortcut"], "Search every action and destination. Cmd/Ctrl+K toggles; ↑↓ move; Enter runs.", [d("overlay", "CommandPaletteDemo", "Example")]),
  p("Overlay", "command-menu", "Command Menu (composable)", ["CommandMenu", "CommandPaletteInput", "CommandPaletteList", "CommandPaletteGroup", "CommandPaletteItem", "CommandPaletteEmpty", "CommandPaletteFooter"], "The palette as parts: put it in a dialog, a popover or inline. Items filter by text; arrows move, Enter runs.", [d("extras", "CommandMenuDemo", "Inline")], { badge: "New" }),
  p("Overlay", "lightbox", "Lightbox", ["Lightbox"], "Full-screen media viewer. Arrows move, click zooms, Esc closes.", [d("overlay", "LightboxDemo", "Gallery")], { badge: "New" }),
  p("Overlay", "overlay", "Overlay", ["Overlay"], "Content over media — on hover and focus, or always.", [d("overlay", "OverlayDemo", "Examples")], { badge: "New" }),
  p("Overlay", "popconfirm", "Popconfirm", ["Popconfirm"], "A light confirmation anchored to its trigger.", [d("overlay", "PopconfirmDemo", "Examples")]),
  p("Overlay", "coachmark", "Coachmark", ["Coachmark"], "An onboarding hint anchored to one element; chain steps into a tour.", [d("overlay", "CoachmarkDemo", "Tour")]),

  /* ---------------- Table & List */
  p("Table & List", "table", "Data Table", ["DataTable"], "The full records table: sort, filter, select, expand, paginate, density and column visibility, with a floating selection bar.", [d("table", "DataTableDemo", "Customers"), d("table", "DataTableStates", "Loading, empty, compact")]),
  p("Table & List", "table-primitives", "Table", ["TableContainer", "Table", "TableHeader", "TableRow", "TableHead", "TableCell"], "The building blocks, for tables that need custom behavior.", [d("table", "TablePrimitivesDemo", "Example")]),
  p("Table & List", "table-selection-toolbar", "Table Selection Toolbar", ["TableSelectionToolbar"], "What to do with selected rows. Floats at the bottom of the screen, or sits inline.", [d("table", "TableSelectionToolbarDemo", "Inline")], { badge: "New" }),
  p("Table & List", "list", "List", ["List", "ListItem"], "Rows that aren't a table: leading avatar or icon, text, meta and trailing actions.", [d("table", "ListDemo", "Examples")]),
  p("Table & List", "metadata-list", "Metadata List", ["MetadataList"], "Key/value pairs for a record, in columns or stacked.", [d("table", "MetadataListDemo", "Examples")]),
  p("Table & List", "overflow-list", "Overflow List", ["OverflowList"], "One row of items that shows “+N” when they don't fit.", [d("table", "OverflowListDemo", "Resize it")], { badge: "New" }),
  p("Table & List", "tree-list", "Tree List", ["TreeList"], "A hierarchy with selection or checkboxes. Full arrow-key navigation.", [d("table", "TreeListDemo", "Select & check")]),
  p("Table & List", "timeline", "Timeline", ["Timeline"], "Events in order on one hairline rail.", [d("table", "TimelineDemo", "Activity")]),

  /* ---------------- Data */
  p("Data & Charts", "stat", "Stat", ["Stat", "StatGroup"], "A headline number with its comparison. Every part except label and value can be turned on or off.", [d("data", "StatDemo", "Stat group"), d("data", "StatPlayground", "Playground"), d("data", "StatStates", "All states")]),
  p("Data & Charts", "stat-options", "Stat Variants & Options", ["Stat"], "Every surface (card, outline, sunken, bezel, ink) and every add-on: icon tile, badge, trend beside or below, mini bars, ring, segments, target marker, compare row, breakdown and delta styles.", [d("extras", "StatVariants", "Surfaces"), d("extras", "StatOptions", "Options")], { badge: "New" }),
  p("Data & Charts", "line-chart", "Line & Area Chart", ["LineChart", "AreaChart"], "Trends over time. Hover scrubs a crosshair with every series' value.", [d("data", "LineChartDemo", "Line"), d("data", "AreaChartDemo", "Stacked area")]),
  p("Data & Charts", "bar-chart", "Bar Chart", ["BarChart"], "Compare categories — grouped, stacked or horizontal.", [d("data", "BarChartDemo", "Examples")]),
  p("Data & Charts", "donut-chart", "Donut Chart", ["DonutChart", "ChartLegend"], "Share of a whole, ≤ 6 parts.", [d("data", "DonutChartDemo", "Examples")]),
  p("Data & Charts", "sparkline", "Sparkline", ["Sparkline"], "A tiny trend for tables and stats: line, dotted area or bars.", [d("extras", "SparklineTypes", "Types"), d("data", "SparklineDemo", "All states")]),
  p("Data & Charts", "bar-list", "Bar List", ["BarList"], "A ranked list with a bar behind each row — top pages, sources, countries.", [d("extras", "BarListDemo", "Example")], { badge: "New" }),
  p("Data & Charts", "breakdown-bar", "Breakdown Bar", ["BreakdownBar"], "Parts of a whole as one segmented bar with a legend.", [d("extras", "BreakdownBarDemo", "Examples")], { badge: "New" }),
  p("Data & Charts", "gauge-chart", "Gauge", ["GaugeChart"], "A half-dial for a score in a range, with optional threshold ticks.", [d("extras", "GaugeDemo", "Examples")], { badge: "New" }),
  p("Data & Charts", "heatmap", "Heatmap", ["Heatmap"], "Values on a grid — activity by day and hour. Five steps from muted to blue.", [d("extras", "HeatmapDemo", "Example")], { badge: "New" }),
  p("Data & Charts", "pill-bar-chart", "Pill Bar Chart", ["PillBarChart"], "Stacked capsule bars with a headline number. Each series is its own rounded segment; a negative series hangs below the baseline. Hover or drag to read a day.", [d("extras", "PillBarDemo", "Examples")], { badge: "New" }),
  p("Data & Charts", "value-chart", "Value Chart", ["ValueChart"], "A headline value, its line and range tabs in one piece — balances, prices, MRR. Drag across the line to read any point.", [d("extras", "ValueChartDemo", "Examples")], { badge: "New" }),
  p("Data & Charts", "usage-meter", "Usage Meter", ["UsageMeter"], "What is using a limited budget — seats, storage, tokens — as one bar of parts with a chip per part. The unused part is a dotted track.", [d("extras", "UsageMeterDemo", "Examples")], { badge: "New" }),
  p("Data & Charts", "funnel-chart", "Funnel", ["FunnelChart"], "Steps that narrow, with conversion between each.", [d("extras", "FunnelDemo", "Example")], { badge: "New" }),
  p("Data & Charts", "scatter-chart", "Scatter", ["ScatterChart"], "Two measures per item, optional size channel and highlighted points.", [d("extras", "ScatterDemo", "Example")], { badge: "New" }),
  p("Data & Charts", "bullet-chart", "Bullet", ["BulletChart"], "One measure against a target and bands — the compact gauge for tables and stats.", [d("extras", "BulletDemo", "Example")], { badge: "New" }),
  p("Data & Charts", "combo-chart", "Combo", ["ComboChart"], "Bars for volume plus a line for a rate on a second axis.", [d("extras", "ComboDemo", "Example")], { badge: "New" }),
  p("Data & Charts", "radar-chart", "Radar", ["RadarChart"], "Several scores on shared axes, up to three series.", [d("extras", "RadarDemo", "Example")], { badge: "New" }),

  /* ---------------- Utility */
  p("Utility", "visually-hidden", "Visually Hidden", ["VisuallyHidden"], "Content for screen readers only.", [d("utility", "VisuallyHiddenDemo", "Example")], { badge: "New" }),
  p("Utility", "theme", "Theme", ["ThemeProvider", "useTheme", "KeelProvider"], "Light, dark or system. Tokens switch with CSS light-dark(), so there's no flash and nothing to re-render.", [d("utility", "ThemeDemo", "Switch theme")], { badge: "New" }),
  p("Utility", "hooks", "Hooks", ["useClipboard", "useHotkeys", "useMediaQuery", "useDisclosure", "useStreamingText", "useCalendarDays", "useTableSort", "useTablePagination", "useTableSelection", "useTableFiltering", "useCombobox", "useMultiCombobox", "useSnapPaging", "useOverflow", "useScrollLock", "useFocusTrap", "useLongPress", "useAnnounce", "useMergedRefs", "useLocale", "useCollator", "useOutlineFromMarkdown", "useDebouncedValue", "useCollapsible", "useLightbox"], "The headless half of Keel: the same behavior the components use, for your own markup.", [d("extras", "HooksDemo", "Live hooks")], { badge: "New" }),
  p("Utility", "link-provider", "Link Provider", ["LinkProvider", "useLinkComponent"], "Route every Keel link (Item, BreadcrumbItem, MegaMenuItem, TopNavHeading) through your router.", [d("extras", "ItemDemo", "Links in Item")], { badge: "New" }),
];

export const pages: DocPage[] = [...guides, ...components];
export const pageBySlug = new Map(pages.map((pg) => [pg.slug, pg]));
export const componentPages = components;
