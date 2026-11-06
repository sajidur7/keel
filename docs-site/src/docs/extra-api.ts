import type { DocPage } from "./types";

/** API tables added to pages after the fact, so every exported component is documented somewhere. */
export const extraApi: Record<string, NonNullable<DocPage["api"]>> = {
  skeleton: [
    { title: "Skeleton", props: [
      { name: "className", type: "string", description: "Size and shape: h-3 w-2/5, size-8 rounded-full. The pulse and colour come from the component." },
    ] },
    { title: "SkeletonText", props: [
      { name: "lines", type: "number", default: "3", description: "Number of lines; the last one is shorter." },
      { name: "className", type: "string", description: "Width of the block." },
    ] },
  ],
  spinner: [
    { title: "Spinner", props: [
      { name: "size", type: "number", default: "14", description: "Diameter in px. Match the text size it sits beside." },
      { name: "label", type: "string", default: '"Loading"', description: 'Announced to screen readers (role="status"). Pass "" when visible text already says it.' },
    ] },
  ],
  "status-pages": [
    { title: "StatusPage", props: [
      { name: "code", type: "string", description: "Small mono code above the title (404, 410…)." },
      { name: "title", type: "ReactNode", description: "What happened, in a few words." },
      { name: "description", type: "ReactNode", description: "What the person can do next." },
      { name: "icon", type: "ReactNode", description: "Optional Lucide icon instead of the code." },
      { name: "actions", type: "ReactNode", description: "One primary action, at most one secondary." },
      { name: "detail", type: "ReactNode", description: "Request id or timestamp, in mono, for support." },
      { name: "className", type: "string", description: "Override the 60vh minimum height inside panels: min-h-0 py-10." },
    ] },
    { title: "NotFoundPage · ForbiddenPage · ServerErrorPage", props: [
      { name: "actions", type: "ReactNode", description: "Buttons under the message." },
      { name: "role", type: "string", description: "ForbiddenPage: the person's current role, shown in the message." },
      { name: "requestId", type: "string", description: "ServerErrorPage: shown in mono under the message, for support." },
    ] },
    { title: "OfflineState · PermissionState", props: [
      { name: "onRetry", type: "() => void", description: "OfflineState: retry button." },
      { name: "what", type: "string", description: "PermissionState: the thing they can't see (\"billing\")." },
      { name: "requestAccess", type: "() => void", description: "PermissionState: request-access button." },
    ] },
  ],
  "inline-message": [
    { title: "InlineMessage", props: [
      { name: "tone", type: '"info" | "success" | "warning" | "danger"', default: '"info"', description: "Icon and colour." },
      { name: "detail", type: "ReactNode", description: "Longer explanation in a tooltip on the message." },
      { name: "children", type: "ReactNode", description: "The message, one short line." },
    ] },
  ],
  "copy-button": [
    { title: "CopyButton", props: [
      { name: "value", type: "string", description: "Text written to the clipboard." },
      { name: "label", type: "string", default: '"Copy"', description: "Accessible name and tooltip." },
      { name: "size", type: '"xs" | "sm" | "md"', default: '"sm"', description: "Matches IconButton sizes." },
    ] },
  ],
  image: [
    { title: "ImagePreview", props: [
      { name: "src", type: "string", description: "Image URL." },
      { name: "alt", type: "string", description: "Required. Also the caption in the full-size view." },
      { name: "width / height", type: "number", default: "96 / 72", description: "Thumbnail size in px." },
    ] },
  ],
  anchor: [
    { title: "Anchor", props: [
      { name: "items", type: "{ id; label; level?: 1 | 2 }[]", description: "Section ids on the page; level 2 indents." },
      { name: "offset", type: "number", default: "80", description: "Header height to subtract when deciding the active section." },
    ] },
  ],
  dialog: [
    { title: "DialogClose", props: [
      { name: "asChild", type: "boolean", description: "Wrap your own button so it closes the dialog." },
    ] },
  ],
  sheet: [
    { title: "SheetTrigger · SheetClose · SheetOverlay", props: [
      { name: "SheetTrigger asChild", type: "boolean", description: "Opens the sheet; wraps your button." },
      { name: "SheetClose asChild", type: "boolean", description: "Closes the sheet; wraps your button." },
      { name: "SheetOverlay", type: "component", description: "The dimmed backdrop. SheetContent renders it for you; use it only in a custom layout." },
    ] },
  ],
  "dropdown-menu": [
    { title: "DropdownMenuGroup · DropdownMenuRadioGroup · DropdownMenuRadioItem", props: [
      { name: "DropdownMenuGroup", type: "component", description: "Groups related items for screen readers." },
      { name: "DropdownMenuRadioGroup value / onValueChange", type: "string / (v) => void", description: "One choice among items (sort order, density)." },
      { name: "DropdownMenuRadioItem value", type: "string", description: "An option in a radio group; shows a dot when chosen." },
    ] },
  ],
  tooltip: [
    { title: "PopoverAnchor · PopoverClose", props: [
      { name: "PopoverAnchor", type: "component", description: "Position the popover against a different element than its trigger." },
      { name: "PopoverClose asChild", type: "boolean", description: "Closes the popover; wraps your button." },
    ] },
  ],
  tag: [
    { title: "TAG_TONES", props: [
      { name: "TAG_TONES", type: "readonly Tone[]", description: "All ten tones in order — use it to build pickers or map categories to tones." },
    ] },
  ],
  table: [
    { title: "TableFooter", props: [
      { name: "children", type: "<tr>", description: "Totals row. Sticks to the bottom of the table." },
    ] },
  ],
  "date-picker": [
    { title: "Calendar", props: [
      { name: "selected / onSelect", type: "Date | null / (d) => void", description: "Single date mode." },
      { name: "range / onRangeSelect", type: "DateRange / (r) => void", description: "Range mode." },
      { name: "min / max / isDisabled", type: "Date / Date / (d) => boolean", description: "Days outside are struck through and skipped by the keyboard." },
      { name: "months", type: "1 | 2", default: "1", description: "Two months side by side for ranges." },
      { name: "weekStartsOn", type: "0 | 1", default: "1", description: "Monday by default." },
    ] },
  ],
  "app-shell": [
    { title: "SidebarProvider", props: [
      { name: "defaultCollapsed", type: "boolean", default: "false", description: "Start as the 56px rail. ⌘B toggles; width is remembered." },
    ] },
  ],
};

/** Figma node for each component page — the component set built from that page's "All states" demo. */
export const figmaNodes: Record<string, string> = {
  button: "7:434", "icon-button": "67:177", text: "61:22", kbd: "10:203", divider: "61:38", "app-shell": "13:70",
  header: "61:74", grid: "61:97", "split-pane": "61:125", sheet: "64:147", stack: "66:26", anchor: "61:143",
  tabs: "13:18", breadcrumb: "18:181", "dropdown-menu": "13:126", "filter-menu": "13:99", "command-palette": "64:193",
  pagination: "15:159", steps: "18:211", input: "8:170", "form-field": "8:225", select: "8:195", combobox: "62:61",
  checkbox: "9:54", radio: "9:83", switch: "9:132", slider: "9:133", "date-picker": "62:231", "file-upload": "62:325",
  "inline-edit": "62:349", avatar: "12:134", tag: "10:152", "status-pill": "10:195", "count-badge": "10:202",
  "description-list": "63:198", stat: "45:300", progress: "16:200", sparkline: "63:244", list: "63:275",
  timeline: "63:309", tooltip: "16:154", "code-block": "63:340", "empty-state": "16:220", skeleton: "16:214",
  table: "15:117", alert: "16:56", banner: "16:101", toast: "16:153", dialog: "16:157", spinner: "64:98",
  "status-pages": "64:114", charts: "63:434", accordion: "18:39", toggle: "63:519", tree: "18:180",
  transfer: "62:427", cascader: "62:464", "color-picker": "62:485", rating: "18:251", "otp-input": "18:250",
  popconfirm: "64:208", coachmark: "64:133", badge: "63:478", "inline-message": "63:588", "copy-button": "63:544",
  image: "63:560",
};
