import { useState } from "react";
import {
  Alert, Banner, Button, ConfirmDialog, Dialog, DialogContent, DialogTrigger, ForbiddenPage, FormField, Input,
  NotFoundPage, OfflineState, PermissionState, Select, ServerErrorPage, Spinner, useToast,
} from "@keel/components";
import type { DocPage } from "../docs/types";

/* ===== Alert ===== */

export function AlertDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert tone="info" title="SSO is available on your plan">Connect Okta or Google Workspace so members sign in with their company account.</Alert>
      <Alert tone="success">Payment method updated. The next invoice will be charged to the Visa ending 4417.</Alert>
      <Alert tone="warning" title="3 invoices are overdue" action={<Button size="sm">Review invoices</Button>}>Customers were reminded on Nov 1. A second reminder goes out tomorrow.</Alert>
      <Alert tone="danger" title="Webhook endpoint failing" onDismiss={() => {}}>The last 12 deliveries to api.northwind.co returned 503.</Alert>
      <Alert tone="neutral">Exports include only the columns currently visible.</Alert>
    </div>
  );
}

/* ===== Banner ===== */

export function BannerDemo() {
  const [show, setShow] = useState(true);
  return (
    <div className="flex w-full flex-col gap-2 overflow-hidden rounded-lg shadow-card">
      <Banner>Scheduled maintenance Sunday 02:00–02:30 UTC. Billing will be read-only.</Banner>
      <Banner tone="warning" action={<Button size="xs">Update card</Button>}>Your card expires this month.</Banner>
      {show ? <Banner tone="danger" onDismiss={() => setShow(false)}>Workspace is in read-only mode while we restore data.</Banner> : <Button size="xs" variant="ghost" className="m-2 self-start" onClick={() => setShow(true)}>Show again</Button>}
    </div>
  );
}

/* ===== Toast ===== */

export function ToastDemo() {
  const toast = useToast();
  return (
    <>
      <Button onClick={() => toast({ title: "Invoice sent", description: "INV-2063 to Tidewater Energy" })}>Default</Button>
      <Button onClick={() => toast({ title: "Customer archived", tone: "success", action: { label: "Undo", onClick: () => toast({ title: "Restored" }) } })}>With undo</Button>
      <Button onClick={() => toast({ title: "Couldn't sync with Stripe", description: "We'll retry in 5 minutes.", tone: "danger" })}>Error</Button>
    </>
  );
}

/* ===== Dialog ===== */

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="primary">Invite member</Button></DialogTrigger>
      <DialogContent title="Invite member" description="They'll get an email to join Fernhill." footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => setOpen(false)}>Send invite</Button></>}>
        <div className="flex flex-col gap-4">
          <FormField label="Email" required><Input type="email" placeholder="name@company.com" autoFocus /></FormField>
          <FormField label="Role" help="Editors can send invoices; viewers can't change anything.">
            <Select defaultValue="editor" options={[{ value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer" }]} />
          </FormField>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDemo() {
  const toast = useToast();
  return (
    <>
      <ConfirmDialog
        trigger={<Button variant="danger">Delete 3 customers</Button>}
        tone="danger"
        title="Delete 3 customers?"
        description="Their invoices and activity history will be deleted. This can't be undone."
        confirmLabel="Delete customers"
        onConfirm={() => new Promise((r) => setTimeout(r, 700)).then(() => toast({ title: "3 customers deleted" }))}
      />
      <ConfirmDialog
        trigger={<Button>Delete workspace</Button>}
        tone="danger"
        title="Delete Fernhill workspace?"
        description="All customers, invoices and members will be removed permanently."
        confirmText="fernhill"
        confirmLabel="Delete workspace"
        onConfirm={() => toast({ title: "Not really — this is a demo" })}
      />
      <ConfirmDialog trigger={<Button variant="ghost">Send reminders</Button>} title="Send 12 reminders?" description="Each overdue customer gets one email." confirmLabel="Send 12 reminders" onConfirm={() => {}} />
    </>
  );
}

/* ===== Spinner ===== */

export function SpinnerDemo() {
  return (
    <>
      <Spinner size={12} /><Spinner size={14} /><Spinner size={16} /><Spinner size={20} /><Spinner size={24} />
      <span className="flex items-center gap-2 text-small text-subtle"><Spinner label="" /> Syncing with Stripe…</span>
    </>
  );
}

/* ===== Status pages ===== */

export function StatusPages() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3">
      <div className="rounded-lg shadow-card"><NotFoundPage className="min-h-0 py-10" actions={<Button size="sm">Go to overview</Button>} /></div>
      <div className="rounded-lg shadow-card"><ForbiddenPage className="min-h-0 py-10" role="Viewer" actions={<Button size="sm">Request access</Button>} /></div>
      <div className="rounded-lg shadow-card"><ServerErrorPage className="min-h-0 py-10" requestId="req_7Hc2kQ9" actions={<><Button size="sm" variant="primary">Try again</Button><Button size="sm" variant="ghost">Status page</Button></>} /></div>
    </div>
  );
}

export function InlineStates() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="rounded-lg shadow-card"><OfflineState onRetry={() => {}} /></div>
      <div className="rounded-lg shadow-card"><PermissionState what="billing" requestAccess={() => {}} /></div>
    </div>
  );
}

export const docs: DocPage[] = [
  {
    slug: "alert", title: "Alert", group: "Feedback", section: "Components", source: "feedback", keywords: ["callout", "notice", "message"],
    summary: "An inline message tied to the content around it. One or two sentences: what happened, then what to do.",
    whenToUse: ["A form or section has a problem or a note that stays until resolved."],
    whenNot: ["Confirming an action that just happened — use a Toast.", "App-wide notices — use a Banner."],
    demos: [{ id: "AlertDemo", title: "Tones", render: AlertDemo, full: true }],
    api: [{ props: [{ name: "tone", type: '"info" | "success" | "warning" | "danger" | "neutral"', default: '"info"', description: "" }, { name: "title", type: "ReactNode", description: "" }, { name: "action", type: "ReactNode", description: "Buttons under the text." }, { name: "onDismiss", type: "() => void", description: "" }] }],
    a11y: ["Warning and danger use role=alert (announced immediately); others use role=status."],
  },
  {
    slug: "banner", title: "Banner", group: "Feedback", section: "Components", source: "feedback",
    summary: "A full-width message above the app header for workspace-level conditions. One at a time.",
    demos: [{ id: "BannerDemo", title: "Banner", render: BannerDemo, full: true }],
    api: [{ props: [{ name: "tone", type: "neutral | info | success | warning | danger", default: '"neutral"', description: "" }, { name: "action / onDismiss", type: "ReactNode / () => void", description: "" }] }],
  },
  {
    slug: "toast", title: "Toast", group: "Feedback", section: "Components", source: "feedback", keywords: ["notification", "snackbar"],
    summary: "Brief confirmation after an action, bottom-right. Offer Undo instead of a confirm dialog for reversible actions.",
    demos: [{ id: "ToastDemo", title: "Toasts", render: ToastDemo }],
    api: [{ title: "useToast()(options)", props: [{ name: "title / description", type: "ReactNode", description: "" }, { name: "tone", type: "neutral | info | success | warning | danger", description: "" }, { name: "action", type: "{ label; onClick }", description: "" }, { name: "duration", type: "number", default: "5000", description: "ms" }] }],
    a11y: ["Announced politely (errors assertively). Pause on hover and focus; swipe right to dismiss. Wrap the app in <Toaster>."],
    dos: [{ do: "“Customer archived · Undo”.", dont: "“Success! Your customer was archived successfully.”" }],
  },
  {
    slug: "dialog", title: "Dialog", group: "Feedback", section: "Components", source: "feedback", keywords: ["modal", "confirm"],
    summary: "Modal dialogs for short focused tasks, and ConfirmDialog for destructive actions — with optional type-to-confirm for irreversible ones.",
    whenToUse: ["A small task that blocks the flow: invite one member, rename, confirm."],
    whenNot: ["Long forms or viewing a record — use a Sheet or a page."],
    demos: [
      { id: "DialogDemo", title: "Dialog", render: DialogDemo },
      { id: "ConfirmDemo", title: "Confirm dialog", description: "The second one requires typing the workspace name.", render: ConfirmDemo },
    ],
    api: [
      { title: "DialogContent", props: [{ name: "title / description / footer", type: "ReactNode", description: "" }, { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "400 / 520 / 680 / 880px." }] },
      { title: "ConfirmDialog", props: [
        { name: "title / description / confirmLabel", type: "ReactNode / ReactNode / string", description: "Name the action in the button." },
        { name: "tone", type: '"default" | "danger"', default: '"default"', description: "" },
        { name: "confirmText", type: "string", description: "Must be typed to enable confirm." },
        { name: "onConfirm", type: "() => void | Promise", description: "Button shows loading until it resolves." },
      ] },
    ],
    a11y: ["Focus is trapped inside and returns to the trigger on close. ConfirmDialog is an alertdialog; Cancel gets initial focus."],
  },
  {
    slug: "spinner", title: "Spinner", group: "Feedback", section: "Components", source: "feedback", keywords: ["loading"],
    summary: "For short, indeterminate waits inside a control or next to a status word. For content areas, prefer skeletons.",
    demos: [{ id: "SpinnerDemo", title: "Sizes", render: SpinnerDemo }],
  },
  {
    slug: "status-pages", title: "Error & empty pages", group: "Feedback", section: "Components", source: "feedback", keywords: ["404", "403", "500", "offline", "permission"],
    summary: "Full-page and inline blocking states. Say what happened in plain words and offer the next step; the error code stays quiet.",
    demos: [
      { id: "StatusPages", title: "403, 404, 500", render: StatusPages, full: true },
      { id: "InlineStates", title: "Offline and permission", render: InlineStates, full: true },
    ],
  },
];
