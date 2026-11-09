import { useState } from "react";
import {
  AlertDialog, Avatar, BottomSheet, BottomSheetSwitcher, Button, Coachmark, CommandPalette, Dialog, DialogClose, DialogContent, DialogTrigger, Drawer, DrawerContent,
  DrawerSection, DrawerTrigger, Field, HoverCard, IconButton, IconChartBar, IconChevronDown, IconChevronUp, IconEdit, IconFile, IconHome, IconPlus, IconSettings, IconTrash,
  IconUsers, Input, Lightbox, MetadataList, MoreMenu, Overlay, Popconfirm, Popover, PopoverClose, PopoverContent, PopoverTrigger, RadioList, Select, StatusPill, Switch,
  Tag, Text, Textarea, Tooltip, useCommandShortcut, Kbd, type CommandItem, Thumbnail,
} from "@keel/components";
import { Row } from "../docs/kit";
import { useInPreview } from "../docs/kit";

const IMG = (c1: string, c2: string) => "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='960' height='640'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='960' height='640' fill='url(#g)'/></svg>`);

/* ---------------- Dialog ---------------- */
export function DialogDemo() {
  return (
    <Row>
      <Dialog>
        <DialogTrigger asChild><Button variant="primary" leading={<IconPlus />}>Invite member</Button></DialogTrigger>
        <DialogContent title="Invite a teammate" description="They'll get an email with a link to join Acme."
          footer={<><DialogClose asChild><Button>Cancel</Button></DialogClose><DialogClose asChild><Button variant="primary">Send invite</Button></DialogClose></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Email" required><Input type="email" placeholder="name@company.com" autoFocus /></Field>
            <Field label="Role"><Select defaultValue="member" options={[{ value: "admin", label: "Admin" }, { value: "member", label: "Member" }, { value: "viewer", label: "Viewer" }]} /></Field>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild><Button>Large dialog</Button></DialogTrigger>
        <DialogContent size="lg" title="Edit plan" footer={<DialogClose asChild><Button variant="primary">Done</Button></DialogClose>}>
          <RadioList variant="card" defaultValue="pro" options={[{ value: "starter", label: "Starter", description: "$19" }, { value: "pro", label: "Pro", description: "$49" }, { value: "scale", label: "Scale", description: "$129" }]} />
        </DialogContent>
      </Dialog>
    </Row>
  );
}

/* ---------------- AlertDialog ---------------- */
export function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState(false);
  return (
    <Row>
      <Button variant="danger" leading={<IconTrash />} onClick={() => setOpen(true)}>Delete 3 customers</Button>
      <Button onClick={() => setWarn(true)}>Pause sync</Button>
      <AlertDialog open={open} onOpenChange={setOpen} title="Delete 3 customers?" description="Their invoices stay, but you can't undo this." actionLabel="Delete customers" onAction={() => new Promise((r) => setTimeout(r, 800))} />
      <AlertDialog open={warn} onOpenChange={setWarn} tone="warning" title="Pause Stripe sync?" description="New payments won't appear until you resume." actionLabel="Pause sync" onAction={() => {}} />
    </Row>
  );
}

/* ---------------- Drawer ---------------- */
export function DrawerDemo() {
  return (
    <Row>
      <Drawer>
        <DrawerTrigger asChild><Button>Open customer</Button></DrawerTrigger>
        <DrawerContent title="Acme Inc." description="Customer since March 2024" eyebrow={<StatusPill status="active">Active</StatusPill>}
          headerActions={<><IconButton label="Previous" size="sm" shortcut="K"><IconChevronUp /></IconButton><IconButton label="Next" size="sm" shortcut="J"><IconChevronDown /></IconButton><MoreMenu items={[{ label: "Edit", icon: <IconEdit /> }, "separator", { label: "Delete", icon: <IconTrash />, destructive: true }]} /></>}
          footer={<><Button>Cancel</Button><Button variant="primary">Save</Button></>}>
          <DrawerSection title="Details"><MetadataList items={[{ label: "Plan", value: <Tag tone="blue">Enterprise</Tag> }, { label: "MRR", value: "$2,400" }, { label: "Owner", value: "Ana Lima" }, { label: "Region", value: "EU" }]} /></DrawerSection>
          <DrawerSection title="Notes"><Textarea defaultValue="Asked about SSO on the last call." /></DrawerSection>
        </DrawerContent>
      </Drawer>
      <Drawer>
        <DrawerTrigger asChild><Button>Left · no scrim</Button></DrawerTrigger>
        <DrawerContent side="left" size="sm" title="Filters" scrim={false}><div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Switch label="Only overdue" /><Switch label="Has notes" /></div></DrawerContent>
      </Drawer>
    </Row>
  );
}

/* ---------------- BottomSheet ---------------- */
export function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  return (
    <Row>
      <Button onClick={() => setOpen(true)}>Open bottom sheet</Button>
      <BottomSheet open={open} onOpenChange={setOpen} title="Share invoice" footer={<Button variant="primary" fullWidth onClick={() => setOpen(false)}>Copy link</Button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Field label="Email"><Input placeholder="name@company.com" /></Field><Switch label="Allow download" defaultChecked /></div>
      </BottomSheet>
      <Button onClick={() => setActive("filter")}>Sheet switcher</Button>
      <BottomSheetSwitcher active={active} onActiveChange={setActive} sheets={[
        { id: "filter", title: "Filter", content: <Button onClick={() => setActive("sort")}>Next: Sort →</Button> },
        { id: "sort", title: "Sort", content: <RadioList options={[{ value: "new", label: "Newest" }, { value: "old", label: "Oldest" }]} defaultValue="new" /> },
      ]} />
    </Row>
  );
}

/* ---------------- Popover ---------------- */
export function PopoverDemo() {
  return (
    <Row>
      <Popover>
        <PopoverTrigger asChild><Button>Quick edit</Button></PopoverTrigger>
        <PopoverContent arrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 240 }}>
            <Field label="Seats"><Input defaultValue="12" /></Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}><PopoverClose asChild><Button size="sm">Cancel</Button></PopoverClose><PopoverClose asChild><Button size="sm" variant="primary">Save</Button></PopoverClose></div>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild><Button variant="ghost">Flush</Button></PopoverTrigger>
        <PopoverContent flush><div style={{ padding: 12 }}><Text>Popover with no padding — bring your own layout.</Text></div></PopoverContent>
      </Popover>
    </Row>
  );
}

/* ---------------- HoverCard ---------------- */
export function HoverCardDemo() {
  return (
    <Text>Owner: <HoverCard trigger={<a href="#" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Ana Lima</a>}>
      <div style={{ display: "flex", gap: 12, width: 260 }}>
        <Avatar name="Ana Lima" size="xl" status="online" />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}><Text weight="semibold">Ana Lima</Text><Text variant="caption">Head of Finance · Acme</Text><Text variant="caption">Owns 14 accounts</Text></div>
      </div>
    </HoverCard></Text>
  );
}

/* ---------------- Tooltip ---------------- */
export function TooltipDemo() {
  const preview = useInPreview();
  return (
    <Row gap={16}>
      <Tooltip content="Edit customer"><Button>Hover me</Button></Tooltip>
      <Tooltip content="Search" shortcut="/"><Button>With shortcut</Button></Tooltip>
      <Tooltip content="Shown on the right" side="right"><Button>Right</Button></Tooltip>
      <Tooltip content="Always visible here" open={!preview}><Button variant="ghost">Pinned open</Button></Tooltip>
    </Row>
  );
}

/* ---------------- CommandPalette ---------------- */
export function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  useCommandShortcut(setOpen);
  const items: CommandItem[] = [
    { id: "new", label: "Create invoice", group: "Actions", icon: <IconPlus />, shortcut: "C", onSelect: () => {} },
    { id: "invite", label: "Invite teammate", group: "Actions", icon: <IconUsers />, onSelect: () => {} },
    { id: "home", label: "Overview", group: "Go to", icon: <IconHome />, onSelect: () => {} },
    { id: "rep", label: "Reports", group: "Go to", icon: <IconChartBar />, hint: "12", onSelect: () => {} },
    { id: "set", label: "Settings", group: "Go to", icon: <IconSettings />, keywords: ["preferences"], onSelect: () => {} },
    { id: "doc", label: "Billing guide", group: "Docs", icon: <IconFile />, onSelect: () => {} },
  ];
  return <><Button onClick={() => setOpen(true)} trailing={<Kbd>⌘K</Kbd>}>Open command palette</Button><CommandPalette open={open} onOpenChange={setOpen} items={items} /></>;
}

/* ---------------- Lightbox ---------------- */
export function LightboxDemo() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const items = [{ src: IMG("#5675ff", "#0ea5a4"), alt: "Receipt 1042", caption: "receipt-1042.png" }, { src: IMG("#e0891b", "#d9467a"), alt: "Warehouse" }, { src: IMG("#7c5cd6", "#3a5cf0"), alt: "Office" }];
  return (
    <Row>
      {items.map((it, n) => <Thumbnail key={n} src={it.src} alt={it.alt} width={96} height={72} onClick={() => { setI(n); setOpen(true); }} />)}
      <Lightbox open={open} onOpenChange={setOpen} items={items} index={i} />
    </Row>
  );
}

/* ---------------- Overlay ---------------- */
export function OverlayDemo() {
  return (
    <Row gap={16}>
      <Overlay content={<span style={{ display: "flex", gap: 6 }}><Button size="xs">Replace</Button><Button size="xs" variant="danger">Remove</Button></span>}>
        <img src={IMG("#5675ff", "#0ea5a4")} alt="Cover" style={{ width: 240, height: 150, borderRadius: 12, objectFit: "cover" }} />
      </Overlay>
      <Overlay showOn="always" align="bottom-start" content={<span style={{ fontWeight: 600 }}>Q3 offsite · 24 photos</span>}>
        <img src={IMG("#e0891b", "#d9467a")} alt="Album" style={{ width: 240, height: 150, borderRadius: 12, objectFit: "cover" }} />
      </Overlay>
    </Row>
  );
}

/* ---------------- Popconfirm ---------------- */
export function PopconfirmDemo() {
  return (
    <Row>
      <Popconfirm title="Remove this tag?" description="It's removed from 14 customers." confirmLabel="Remove" tone="danger" onConfirm={() => new Promise((r) => setTimeout(r, 600))}><Button variant="danger-ghost" leading={<IconTrash />}>Remove tag</Button></Popconfirm>
      <Popconfirm title="Resend the invoice?" onConfirm={() => {}} side="bottom"><Button>Resend</Button></Popconfirm>
    </Row>
  );
}

/* ---------------- Coachmark ---------------- */
export function CoachmarkDemo() {
  const [step, setStep] = useState(0);
  return (
    <Row gap={24}>
      <Coachmark open={step === 1} onOpenChange={(o) => !o && setStep(0)} step={1} total={2} onNext={() => setStep(2)} title="Create invoices here" body="Start from a template or a blank invoice.">
        <Button variant="primary" leading={<IconPlus />}>New invoice</Button>
      </Coachmark>
      <Coachmark open={step === 2} onOpenChange={(o) => !o && setStep(0)} step={2} total={2} onBack={() => setStep(1)} title="Filters live here" body="Save a filter to reuse it later.">
        <Button>Filters</Button>
      </Coachmark>
      <Button variant="ghost" onClick={() => setStep(1)}>Start tour</Button>
    </Row>
  );
}
