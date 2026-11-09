import { useState } from "react";
import {
  Button, ButtonGroup, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, CopyButton, DropdownMenu,
  DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, IconArchive, IconBold, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconCopy, IconDownload, IconEdit, IconGrid, IconItalic, IconLink, IconList, IconPin, IconPlus, IconRedo, IconShare, IconStrikethrough, IconTrash, IconUnderline,
  IconUndo, IconUpload, IconBell, IconStar, IconColumns, IconSort, IconFilter, Kbd, Link, MoreMenu, SegmentedControl, ToggleButton, ToggleButtonGroup, Toolbar, ToolbarButton, ToolbarSeparator, IconButton, Text,
} from "@keel/components";
import { Row, State, StateGrid } from "../docs/kit";

/* ---------------- Button ---------------- */
export function ButtonVariants() {
  return (
    <Row>
      <Button variant="primary" leading={<IconPlus />}>New invoice</Button>
      <Button>Export</Button>
      <Button variant="accent">Upgrade plan</Button>
      <Button variant="danger" leading={<IconTrash />}>Delete</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger-ghost">Remove</Button>
      <Button variant="link">Learn more</Button>
    </Row>
  );
}
export function ButtonSizes() {
  return (
    <Row>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
      <Button leading={<IconDownload />} trailing={<Kbd>⌘E</Kbd>}>Export CSV</Button>
      <Button variant="primary" trailing={<IconChevronDown />}>Create</Button>
    </Row>
  );
}
export function ButtonStates() {
  const [busy, setBusy] = useState(false);
  return (
    <StateGrid>
      <State label="Default"><Button variant="primary">Save</Button><Button>Cancel</Button></State>
      <State label="Loading"><Button variant="primary" loading>Saving</Button><Button loading>Loading</Button></State>
      <State label="Disabled"><Button variant="primary" disabled>Save</Button><Button disabled>Cancel</Button></State>
      <State label="Full width"><Button variant="primary" fullWidth>Continue</Button></State>
      <State label="Async click"><Button variant="primary" loading={busy} onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1200); }}>Send invite</Button></State>
      <State label="As link"><Button asChild variant="secondary"><a href="#/docs/link">Open docs</a></Button></State>
    </StateGrid>
  );
}

/* ---------------- IconButton ---------------- */
export function IconButtonVariants() {
  return (
    <Row>
      <IconButton label="Add" variant="primary"><IconPlus /></IconButton>
      <IconButton label="Edit" variant="secondary"><IconEdit /></IconButton>
      <IconButton label="Share" variant="soft"><IconShare /></IconButton>
      <IconButton label="Download"><IconDownload /></IconButton>
      <IconButton label="Delete" variant="danger-ghost"><IconTrash /></IconButton>
      <IconButton label="Pin" shortcut="P" variant="outline"><IconPin /></IconButton>
    </Row>
  );
}
export function IconButtonStates() {
  return (
    <StateGrid>
      <State label="Sizes"><IconButton label="XS" size="xs"><IconEdit /></IconButton><IconButton label="SM" size="sm"><IconEdit /></IconButton><IconButton label="MD"><IconEdit /></IconButton><IconButton label="LG" size="lg" variant="secondary"><IconEdit /></IconButton></State>
      <State label="Loading"><IconButton label="Sync" variant="secondary" loading><IconUpload /></IconButton></State>
      <State label="Disabled"><IconButton label="Edit" variant="secondary" disabled><IconEdit /></IconButton></State>
      <State label="No tooltip"><IconButton label="Copy" tooltip={false}><IconCopy /></IconButton></State>
    </StateGrid>
  );
}

/* ---------------- ButtonGroup ---------------- */
export function ButtonGroupDemo() {
  return (
    <Row>
      <ButtonGroup label="History"><IconButton label="Undo" variant="ghost"><IconUndo /></IconButton><IconButton label="Redo" variant="ghost"><IconRedo /></IconButton></ButtonGroup>
      <ButtonGroup label="Pager"><Button variant="ghost" leading={<IconChevronLeft />}>Prev</Button><Button variant="ghost" trailing={<IconChevronRight />}>Next</Button></ButtonGroup>
      <ButtonGroup label="Save"><Button variant="ghost">Save draft</Button><IconButton label="More save options" variant="ghost"><IconChevronDown /></IconButton></ButtonGroup>
      <ButtonGroup size="sm" label="Sort"><Button size="sm" variant="ghost" leading={<IconSort />}>Sort</Button><Button size="sm" variant="ghost" leading={<IconFilter />}>Filter</Button><Button size="sm" variant="ghost" leading={<IconColumns />}>Columns</Button></ButtonGroup>
    </Row>
  );
}

/* ---------------- Link ---------------- */
export function LinkDemo() {
  return (
    <Row col gap={10}>
      <Text>Read the <Link href="#">billing guide</Link> before you change plans.</Text>
      <Text>Neutral: <Link tone="neutral" href="#">View all invoices</Link></Text>
      <Text>Quiet: <Link tone="quiet" href="#">Privacy</Link> · <Link tone="quiet" href="#">Terms</Link></Text>
      <Text>External: <Link external href="https://stylexjs.com">StyleX docs</Link></Text>
    </Row>
  );
}

/* ---------------- ToggleButton ---------------- */
export function ToggleButtonDemo() {
  const [following, setFollowing] = useState(true);
  const [marks, setMarks] = useState(["b"]);
  const [view, setView] = useState("grid");
  return (
    <Row gap={16}>
      <ToggleButton pressed={following} onPressedChange={setFollowing} leading={<IconBell />}>{following ? "Following" : "Follow"}</ToggleButton>
      <ToggleButton label="Star" leading={<IconStar />} />
      <ToggleButtonGroup type="multiple" value={marks} onValueChange={setMarks} items={[
        { value: "b", label: "", icon: <IconBold />, ariaLabel: "Bold" }, { value: "i", label: "", icon: <IconItalic />, ariaLabel: "Italic" },
        { value: "u", label: "", icon: <IconUnderline />, ariaLabel: "Underline" }, { value: "s", label: "", icon: <IconStrikethrough />, ariaLabel: "Strikethrough" },
      ]} />
      <ToggleButtonGroup type="single" value={view} onValueChange={(v) => v && setView(v)} items={[{ value: "grid", label: "Grid", icon: <IconGrid /> }, { value: "list", label: "List", icon: <IconList /> }]} />
    </Row>
  );
}

/* ---------------- SegmentedControl ---------------- */
export function SegmentedControlDemo() {
  const [range, setRange] = useState("30d");
  return (
    <Row col gap={16}>
      <SegmentedControl label="Range" value={range} onValueChange={setRange} items={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "90d", label: "90 days" }, { value: "12m", label: "12 months" }]} />
      <SegmentedControl size="sm" label="View" defaultValue="grid" items={[{ value: "grid", icon: <IconGrid />, ariaLabel: "Grid" }, { value: "list", icon: <IconList />, ariaLabel: "List" }]} />
      <SegmentedControl size="lg" fullWidth label="Billing" defaultValue="year" items={[{ value: "month", label: "Monthly" }, { value: "year", label: "Yearly · save 20%" }]} />
    </Row>
  );
}

/* ---------------- Toolbar ---------------- */
export function ToolbarDemo() {
  return (
    <Row col gap={16} align="flex-start">
      <Toolbar aria-label="Formatting">
        <ToolbarButton label="Undo"><IconUndo /></ToolbarButton>
        <ToolbarButton label="Redo"><IconRedo /></ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton label="Bold" active><IconBold /></ToolbarButton>
        <ToolbarButton label="Italic"><IconItalic /></ToolbarButton>
        <ToolbarButton label="Link"><IconLink /></ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Comment</ToolbarButton>
      </Toolbar>
      <Toolbar variant="flat" aria-label="Bulk actions">
        <ToolbarButton><IconArchive /> Archive</ToolbarButton>
        <ToolbarButton><IconDownload /> Export</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton variant="danger-ghost"><IconTrash /> Delete</ToolbarButton>
      </Toolbar>
    </Row>
  );
}

/* ---------------- DropdownMenu ---------------- */
export function DropdownMenuDemo() {
  const [cols, setCols] = useState({ email: true, plan: true, mrr: false });
  const [sort, setSort] = useState("newest");
  return (
    <Row>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button trailing={<IconChevronDown />}>Actions</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem icon={<IconEdit />} shortcut="↵">Open</DropdownMenuItem>
          <DropdownMenuItem icon={<IconCopy />} shortcut="⌘C">Copy ID</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<IconShare />}>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Email</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button leading={<IconColumns />}>View</Button></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={cols.email} onCheckedChange={(v) => setCols({ ...cols, email: v === true })}>Email</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={cols.plan} onCheckedChange={(v) => setCols({ ...cols, plan: v === true })}>Plan</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={cols.mrr} onCheckedChange={(v) => setCols({ ...cols, mrr: v === true })}>MRR</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Row>
  );
}
export function DropdownMenuStates() {
  return (
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger asChild><Button>Open (pinned)</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<IconEdit />} shortcut="↵">Open</DropdownMenuItem>
        <DropdownMenuItem icon={<IconCopy />}>Copy ID</DropdownMenuItem>
        <DropdownMenuItem icon={<IconArchive />} disabled>Archive (disabled)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<IconTrash />} destructive>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------- ContextMenu ---------------- */
export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div style={{ display: "grid", placeItems: "center", width: 320, height: 140, borderRadius: 14, border: "1px dashed currentColor", opacity: 0.7 }}>Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<IconEdit />} shortcut="↵">Open</ContextMenuItem>
        <ContextMenuItem icon={<IconCopy />} shortcut="⌘C">Copy ID</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<IconTrash />} destructive>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/* ---------------- MoreMenu ---------------- */
export function MoreMenuDemo() {
  return (
    <Row>
      <MoreMenu items={[
        { label: "Open", icon: <IconEdit />, shortcut: "↵" }, { label: "Copy ID", icon: <IconCopy /> }, "separator",
        { label: "Delete", icon: <IconTrash />, destructive: true },
      ]} />
      <MoreMenu variant="secondary" size="md" items={[{ heading: "Invoice" }, { label: "Download PDF", icon: <IconDownload /> }, { label: "Duplicate", icon: <IconCopy /> }, { label: "Void", disabled: true }]} />
    </Row>
  );
}

/* ---------------- CopyButton ---------------- */
export function CopyButtonDemo() {
  return (
    <Row>
      <CopyButton value="cus_01HZ8K2M4N" label="Copy customer ID" />
      <CopyButton value="cus_01HZ8K2M4N" variant="secondary">Copy ID</CopyButton>
      <CopyButton value="sk_live_51Hc…" size="md" variant="secondary" label="Copy key" />
    </Row>
  );
}
