import * as stylex from "@stylexjs/stylex";
import { useState, type ComponentType } from "react";
import { Button, IconExternal, SegmentedControl, Tag, Text } from "@keel/components";
import {
  AssistantTemplate, AuditLogTemplate, CustomersTemplate, ForgotPasswordTemplate, InvoiceFormTemplate, LoginTemplate, MembersTemplate, OverviewTemplate, SettingsTemplate,
  type Nav,
} from "@keel/templates";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";

type Go = (to: string) => void;
type T = { id: string; title: string; description: string; Comp: ComponentType<{ go?: (to: Nav & string) => void }>; badge?: string };
const NAV_TO_ID: Record<string, string> = { overview: "overview", customers: "customers", invoices: "invoice", members: "members", audit: "audit-log", settings: "settings", assistant: "assistant", forgot: "forgot-password", login: "sign-in" };

const list: T[] = [
  { id: "overview", title: "Overview", description: "Dashboard: stat group, revenue chart with comparison, at-risk insight, recent invoices, plan mix and activity.", Comp: OverviewTemplate },
  { id: "customers", title: "Customers", description: "DataTable with search, plan filter, status filter, health bars, sparklines, bulk actions, a record drawer with inline edit, and delete confirmation.", Comp: CustomersTemplate },
  { id: "invoice", title: "New invoice", description: "A two-column form: customer combobox, dates, terms, editable line items, VAT switch, a live raised preview and send with undo.", Comp: InvoiceFormTemplate },
  { id: "settings", title: "Settings", description: "Tabs of form sections: workspace, regional, notifications, API keys, webhooks and a danger zone with an unsaved-changes banner.", Comp: SettingsTemplate },
  { id: "members", title: "Members & roles", description: "Members table with roles and presence, invite dialog with a tokenizer, and a permissions tree.", Comp: MembersTemplate },
  { id: "audit-log", title: "Audit log", description: "Compact table filtered by PowerSearch and a date range; rows expand into the raw event.", Comp: AuditLogTemplate },
  { id: "assistant", title: "AI assistant", description: "An agent workspace: thinking, tool calls, context, a task list, proposed diffs, an approval card and a recommendation, with a streaming composer.", Comp: AssistantTemplate, badge: "New" },
  { id: "sign-in", title: "Sign in", description: "Centered card with email, password, remember me, error alert and SSO.", Comp: LoginTemplate as T["Comp"] },
  { id: "forgot-password", title: "Forgot password", description: "Three steps: email, one-time code, new password.", Comp: ForgotPasswordTemplate as T["Comp"] },
];

export const templates = list.map((t) => ({ ...t, render: ({ go }: { go: Go }) => <t.Comp go={(to) => go(`#/t/${NAV_TO_ID[to] ?? to}`)} /> }));
export const templateById = new Map(templates.map((t) => [t.id, t]));

const s = stylex.create({
  page: { display: "flex", flexDirection: "column", gap: 40, maxWidth: 1240, marginInline: "auto", width: "100%", paddingBottom: 96 },
  head: { display: "flex", flexDirection: "column", gap: 8 },
  h1: { fontSize: "34px", fontWeight: font.semibold, letterSpacing: "-0.03em" },
  item: { display: "flex", flexDirection: "column", gap: 12, scrollMarginTop: 80 },
  bar: { display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  frameWrap: { display: "flex", justifyContent: "center", padding: 12, borderRadius: radius.xxl, backgroundColor: color.surfaceSunken, boxShadow: `inset 0 0 0 1px ${color.border}` },
  frame: { width: "100%", height: 720, border: 0, borderRadius: radius.xl, backgroundColor: color.canvas, boxShadow: depth.dialog, transitionProperty: "width", transitionDuration: "280ms" },
});

function Preview({ t, go }: { t: (typeof templates)[number]; go: Go }) {
  const [w, setW] = useState("full");
  const width = w === "full" ? "100%" : w === "tablet" ? 820 : 390;
  return (
    <section id={t.id} {...stylex.props(s.item)}>
      <div {...stylex.props(s.bar)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 720 }}>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Text variant="h3">{t.title}</Text>{t.badge && <Tag size="sm" tone="blue" shape="pill">{t.badge}</Tag>}</span>
          <Text tone="muted">{t.description}</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SegmentedControl size="sm" value={w} onValueChange={setW} label="Preview width" items={[{ value: "full", label: "Desktop" }, { value: "tablet", label: "Tablet" }, { value: "phone", label: "Phone" }]} />
          <Button size="sm" trailing={<IconExternal />} onClick={() => go(`#/t/${t.id}`)}>Open</Button>
        </div>
      </div>
      <div {...stylex.props(s.frameWrap)}><iframe title={t.title} src={`${location.pathname}#/t/${t.id}`} loading="lazy" {...stylex.props(s.frame)} style={{ width }} /></div>
    </section>
  );
}

export function TemplatesPage({ go }: { go: Go }) {
  return (
    <div {...stylex.props(s.page)}>
      <header {...stylex.props(s.head)}><Text variant="eyebrow">Templates</Text><h1 {...stylex.props(s.h1)}>Full screens, ready to copy</h1><Text variant="body" tone="muted">Every template is built only from Keel components and tokens. Open one full screen, or switch the preview to tablet and phone widths.</Text></header>
      {templates.map((t) => <Preview key={t.id} t={t} go={go} />)}
    </div>
  );
}
