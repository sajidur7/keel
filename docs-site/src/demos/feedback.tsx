import { useState } from "react";
import {
  Alert, Badge, Banner, Button, CountBadge, EmptyState, ErrorState, ForbiddenPage, IconBell, IconButton, IconInbox, IconSearch, IconUsers, InfoTip, InlineMessage,
  NotFoundPage, OfflineState, PermissionState, ProgressBar, ProgressDots, ProgressRing, SegmentBar, ServerErrorPage, Skeleton, SkeletonText, Spinner, StatusDot,
  StatusPill, Text, useToast, Avatar, Link,
} from "@keel/components";
import { Row, State, StateGrid } from "../docs/kit";

/* ---------------- Badge ---------------- */
export function BadgeDemo() {
  return (
    <StateGrid min={200}>
      <State label="Count on icon"><Badge count={3}><IconButton label="Notifications" variant="secondary"><IconBell /></IconButton></Badge><Badge count={128}><IconButton label="Inbox" variant="secondary"><IconInbox /></IconButton></Badge></State>
      <State label="Dot"><Badge dot tone="info"><Avatar name="Ana Lima" size="lg" /></Badge><Badge dot><IconButton label="Alerts" variant="secondary"><IconBell /></IconButton></Badge></State>
      <State label="Inline"><Badge count={7} tone="info" /><Badge count={2} tone="success" /><Badge count={0} /></State>
      <State label="CountBadge"><CountBadge>12</CountBadge><CountBadge tone="accent">3</CountBadge><Text>Inbox <CountBadge>24</CountBadge></Text></State>
    </StateGrid>
  );
}

/* ---------------- StatusDot & StatusPill ---------------- */
export function StatusDemo() {
  return (
    <StateGrid min={220}>
      <State label="Status pill"><StatusPill status="active">Live</StatusPill><StatusPill status="success">Paid</StatusPill><StatusPill status="pending">Pending</StatusPill><StatusPill status="danger">Failed</StatusPill><StatusPill status="neutral">Draft</StatusPill></State>
      <State label="Status dot"><StatusDot tone="success" label="Online" /><StatusDot tone="warning" /><StatusDot tone="danger" /><StatusDot tone="info" /><StatusDot tone="neutral" /></State>
      <State label="Pulsing"><StatusDot tone="success" pulse label="Live" /><StatusDot tone="danger" pulse label="Incident" /></State>
      <State label="In a row"><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><StatusDot tone="success" pulse /><Text>api.keel.dev — operational</Text></span></State>
    </StateGrid>
  );
}

/* ---------------- Banner ---------------- */
export function BannerDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 760 }}>
      {open && <Banner tone="warning" title="Your trial ends in 3 days" action={<Button size="sm" variant="primary">Add payment method</Button>} onDismiss={() => setOpen(false)}>Add a card to keep your workspace and data.</Banner>}
      <Banner tone="info" title="Scheduled maintenance">Sunday 02:00–03:00 UTC. Exports may be slow.</Banner>
      <Banner tone="success">Stripe is connected. New payments sync every 5 minutes.</Banner>
      <Banner tone="danger" title="Sync paused" action={<Button size="sm">Reconnect</Button>}>We couldn't reach HubSpot. Check your API key.</Banner>
      <Banner tone="neutral" icon={false} flat>A flat, full-bleed strip for the top of the app.</Banner>
    </div>
  );
}

/* ---------------- Alert & InlineMessage ---------------- */
export function AlertDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 12, width: "100%" }}>
      <Alert tone="success" title="Import finished">1,240 customers added. <Link href="#">View log</Link></Alert>
      <Alert tone="info" title="New: usage-based pricing" action={<><Button size="sm" variant="primary">Try it</Button><Button size="sm" variant="ghost">Later</Button></>}>Bill by API calls, seats or storage.</Alert>
      <Alert tone="warning" title="3 invoices need review" onDismiss={() => {}}>Amounts changed after the customer upgraded.</Alert>
      <Alert tone="danger" title="Payment failed">The card ending 4242 was declined.</Alert>
    </div>
  );
}
export function InlineMessageDemo() {
  return (
    <Row col gap={10} align="flex-start">
      <InlineMessage tone="success">Saved just now</InlineMessage>
      <InlineMessage tone="info">Syncing 12 records…</InlineMessage>
      <InlineMessage tone="warning">Unsaved changes</InlineMessage>
      <InlineMessage tone="danger">Couldn't save — check your connection</InlineMessage>
    </Row>
  );
}

/* ---------------- InfoTip ---------------- */
export function InfoTipDemo() {
  return (
    <Row gap={16}>
      <Text>MRR <InfoTip>Monthly recurring revenue: the sum of active subscriptions, normalized to a month.</InfoTip></Text>
      <Text>Net revenue retention <InfoTip size={12}>Revenue from last year's customers this year, including expansion and churn.</InfoTip></Text>
    </Row>
  );
}

/* ---------------- Progress ---------------- */
export function ProgressDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 520 }}>
      <ProgressBar value={64} label="Storage" showValue={(v) => `${v} of 100 GB`} />
      <ProgressBar value={82} tone="warning" label="Seats" showValue />
      <ProgressBar value={100} tone="success" size="md" label="Import" showValue />
      <ProgressBar value={35} tone="ink" size="lg" marks={[25, 50, 75]} />
      <ProgressBar label="Uploading…" size="xs" />
    </div>
  );
}
export function ProgressStates() {
  return (
    <StateGrid min={200}>
      <State label="Ring"><ProgressRing value={24} /><ProgressRing value={72} size={44} tone="success" /><ProgressRing value={92} size={56} stroke={5} tone="danger" /></State>
      <State label="Segments" wide><div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}><SegmentBar value={25} tone="auto" /><SegmentBar value={58} tone="auto" /><SegmentBar value={90} tone="auto" segments={20} height={6} /></div></State>
      <State label="Dots"><ProgressDots count={5} current={1} /><ProgressDots count={3} current={2} /></State>
      <State label="Disabled"><div style={{ width: 200 }}><ProgressBar value={40} disabled /></div></State>
    </StateGrid>
  );
}

/* ---------------- Skeleton ---------------- */
export function SkeletonDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}><Skeleton circle width={40} height={40} /><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton width="40%" height={12} /><Skeleton width="70%" height={10} /></div></div>
      <SkeletonText lines={4} />
      <Skeleton height={120} radius={14} />
    </div>
  );
}

/* ---------------- Spinner ---------------- */
export function SpinnerDemo() {
  return (
    <Row gap={20}>
      <Spinner size={12} /><Spinner /><Spinner size={20} /><Spinner size={28} tone="muted" />
      <Text tone="muted" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Spinner size={12} label="" />Loading customers…</Text>
      <Button loading variant="primary">Saving</Button>
    </Row>
  );
}

/* ---------------- Toast ---------------- */
export function ToastDemo() {
  const toast = useToast();
  return (
    <Row>
      <Button onClick={() => toast({ title: "Invoice sent", description: "INV-1042 to billing@acme.com", tone: "success", action: { label: "Undo", onClick: () => {} } })}>Success with undo</Button>
      <Button onClick={() => toast({ title: "Syncing with Stripe", tone: "info" })}>Info</Button>
      <Button onClick={() => toast({ title: "2 invoices overdue", tone: "warning" })}>Warning</Button>
      <Button onClick={() => toast({ title: "Couldn't save", description: "Check your connection and try again.", tone: "danger" })}>Error</Button>
      <Button variant="ghost" onClick={() => toast({ title: "Copied to clipboard" })}>Plain</Button>
    </Row>
  );
}

/* ---------------- EmptyState ---------------- */
export function EmptyStateDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <EmptyState icon={<IconUsers />} title="No customers yet" description="Import from Stripe or a CSV, or add your first customer by hand." actions={<><Button>Import</Button><Button variant="primary">Add customer</Button></>} />
      <EmptyState compact icon={<IconSearch />} title="No results for “acme ltd”" description="Check the spelling or clear filters." actions={<Button size="sm">Clear filters</Button>} />
    </div>
  );
}
export function EmptyStateStates() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <OfflineState onRetry={() => {}} />
      <PermissionState what="billing" requestAccess={() => {}} />
      <ErrorState onRetry={() => {}} description="The server took too long to answer." />
    </div>
  );
}

/* ---------------- Status pages ---------------- */
export function StatusPagesDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <NotFoundPage style={{ minHeight: 0 }} actions={<Button variant="primary">Go to dashboard</Button>} />
      <ForbiddenPage style={{ minHeight: 0 }} role="Viewer" actions={<Button>Request access</Button>} />
      <ServerErrorPage style={{ minHeight: 0 }} requestId="req_7Kd92hQ" actions={<Button variant="primary">Try again</Button>} />
    </div>
  );
}
