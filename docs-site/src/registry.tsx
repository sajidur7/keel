import type { ComponentType } from "react";
import {
  AuditLogTemplate, CustomersTemplate, ForgotPasswordTemplate, InvoiceFormTemplate, LoginTemplate, MembersTemplate,
  OverviewTemplate, SettingsTemplate, type Nav,
} from "@keel/templates";
import { docs as chartDocs } from "./demos/charts";
import { docs as entryDocs } from "./demos/data-entry";
import { docs as displayDocs } from "./demos/data-display";
import { docs as feedbackDocs } from "./demos/feedback";
import { docs as generalDocs } from "./demos/general";
import { docs as layoutDocs } from "./demos/layout";
import { docs as navDocs } from "./demos/navigation";
import { docs as tableDocs } from "./demos/table";
import { docs as moreDocs } from "./demos/more";
import { statesBySlug } from "./demos/states";
import { extraApi, figmaNodes } from "./docs/extra-api";
import type { DocPage } from "./docs/types";
import { foundations } from "./pages/foundations";
import { patterns } from "./pages/patterns";

export const componentGroups = ["General", "Layout", "Navigation", "Data entry", "Data display", "Feedback", "Charts"] as const;

const components = [...generalDocs, ...layoutDocs, ...navDocs, ...entryDocs, ...displayDocs, ...tableDocs, ...feedbackDocs, ...chartDocs, ...moreDocs].map((p) => {
  // Every component page gets an "All states" demo right after its first example.
  const extra = extraApi[p.slug];
  if (extra) p = { ...p, api: [...(p.api ?? []), ...extra] };
  if (!p.figma && figmaNodes[p.slug]) p = { ...p, figma: figmaNodes[p.slug] };
  const st = statesBySlug[p.slug];
  if (!st || p.demos?.some((d) => d.id === st.id)) return p;
  const demos = [...(p.demos ?? [])];
  demos.splice(Math.min(1, demos.length), 0, st);
  return { ...p, demos };
});
// Table sits right after Stat in Data display — it's the most-used component.
export const pages: DocPage[] = [...patterns.filter((p) => p.group === "Overview"), ...foundations, ...components, ...patterns.filter((p) => p.group !== "Overview")];
export const pageBySlug = new Map(pages.map((p) => [p.slug, p]));

export type TemplateSpec = {
  id: string;
  title: string;
  description: string;
  file: string;
  render: ComponentType<{ go: (to: Nav) => void }>;
};

export const templates: TemplateSpec[] = [
  { id: "overview", title: "Overview dashboard", file: "templates/overview.tsx", description: "Four stats with baselines, one trend with last year as a dashed line, then the problems — overdue invoices and churn risk — each with its action.", render: OverviewTemplate },
  { id: "customers", title: "List with filters", file: "templates/customers.tsx", description: "Saved-view tabs, search, Label | Value filters, a selectable sortable table with bulk actions, row menus, footer totals and pagination.", render: CustomersTemplate },
  { id: "customer-detail", title: "Detail sheet", file: "templates/customers.tsx", description: "The same list with a record open in the right sheet: inline edit, health, related invoices and activity, previous/next navigation.", render: (p) => <CustomersTemplate {...p} initialOpenId="cus_02" /> },
  { id: "invoice-form", title: "Create form with validation", file: "templates/invoice-form.tsx", description: "Shown after a failed submit: summary alert, inline errors, focus moved to the first invalid field. Fix the fields and submit again.", render: (p) => <InvoiceFormTemplate {...p} showErrors /> },
  { id: "settings", title: "Settings", file: "templates/settings.tsx", description: "Tabbed settings with FormSections, instant switches, a danger zone with type-to-confirm, and a sticky save bar that appears only with unsaved changes.", render: SettingsTemplate },
  { id: "members", title: "Users & roles", file: "templates/members.tsx", description: "Members with inline role change and an invite dialog; a permissions matrix for roles.", render: MembersTemplate },
  { id: "audit-log", title: "Audit log", file: "templates/audit-log.tsx", description: "Compact, read-only, filtered by date range, actor and level. Expand a row for the raw event.", render: AuditLogTemplate },
  { id: "login", title: "Sign in", file: "templates/auth.tsx", description: "SSO first, then email and password with field and credential errors.", render: ({ go }) => <LoginTemplate onForgot={() => { location.hash = "#/t/forgot-password"; void go; }} /> },
  { id: "forgot-password", title: "Forgot password", file: "templates/auth.tsx", description: "Request a reset link, then a clear confirmation that doesn't reveal whether the account exists.", render: () => <ForgotPasswordTemplate onBack={() => { location.hash = "#/t/login"; }} /> },
];
export const templateById = new Map(templates.map((t) => [t.id, t]));
export const navToTemplate: Record<Nav, string> = {
  overview: "overview", customers: "customers", invoices: "invoice-form", members: "members", audit: "audit-log", settings: "settings",
};
