/*
  Sample data for templates and docs. A fictional B2B operations workspace ("Fernhill")
  that bills customers, manages a team and keeps an audit log. Fixed values (no random)
  so screenshots and totals are stable.
*/

export type InvoiceStatus = "paid" | "due" | "overdue" | "draft" | "void";
export type Plan = "Starter" | "Growth" | "Scale" | "Enterprise";

export type Customer = {
  id: string;
  name: string;
  domain: string;
  plan: Plan;
  owner: string;
  region: "Dhaka" | "Singapore" | "Berlin" | "Toronto" | "Austin";
  seats: number;
  mrr: number;
  health: number; // 0–100
  trend: number[]; // weekly active users, 10 weeks
  status: "active" | "trial" | "churn-risk" | "paused";
  since: string;
  tags: string[];
};

export const people = [
  { name: "Nadia Karim", email: "nadia@fernhill.io", role: "Owner", team: "Operations", lastActive: "Now", status: "online" as const },
  { name: "Rafi Ahmed", email: "rafi@fernhill.io", role: "Admin", team: "Finance", lastActive: "4 min ago", status: "online" as const },
  { name: "Tanvir Hasan", email: "tanvir@fernhill.io", role: "Editor", team: "Customer success", lastActive: "1 h ago", status: "away" as const },
  { name: "Mira Okafor", email: "mira@fernhill.io", role: "Editor", team: "Sales", lastActive: "Yesterday", status: "offline" as const },
  { name: "Jonas Weber", email: "jonas@fernhill.io", role: "Viewer", team: "Engineering", lastActive: "3 days ago", status: "offline" as const },
  { name: "Leah Tran", email: "leah@fernhill.io", role: "Admin", team: "Engineering", lastActive: "12 min ago", status: "busy" as const },
  { name: "Samir Chowdhury", email: "samir@fernhill.io", role: "Editor", team: "Finance", lastActive: "2 h ago", status: "offline" as const },
  { name: "Ines Duarte", email: "ines@fernhill.io", role: "Viewer", team: "Sales", lastActive: "Invited", status: "offline" as const },
];

export const customers: Customer[] = [
  { id: "cus_01", name: "Northwind Logistics", domain: "northwind.co", plan: "Scale", owner: "Mira Okafor", region: "Toronto", seats: 140, mrr: 8400, health: 86, trend: [62, 64, 63, 70, 72, 71, 78, 80, 83, 86], status: "active", since: "2023-02-14", tags: ["Logistics", "Annual"] },
  { id: "cus_02", name: "Lumen Health", domain: "lumenhealth.com", plan: "Enterprise", owner: "Tanvir Hasan", region: "Singapore", seats: 420, mrr: 21600, health: 74, trend: [80, 79, 81, 78, 77, 76, 75, 75, 74, 74], status: "active", since: "2022-09-03", tags: ["Healthcare", "SSO"] },
  { id: "cus_03", name: "Brightpath Schools", domain: "brightpath.edu", plan: "Growth", owner: "Mira Okafor", region: "Austin", seats: 64, mrr: 2240, health: 38, trend: [55, 51, 49, 46, 44, 41, 40, 39, 39, 38], status: "churn-risk", since: "2024-01-22", tags: ["Education"] },
  { id: "cus_04", name: "Copperline Studio", domain: "copperline.design", plan: "Starter", owner: "Samir Chowdhury", region: "Berlin", seats: 9, mrr: 270, health: 92, trend: [70, 74, 78, 80, 84, 86, 88, 90, 91, 92], status: "active", since: "2025-06-10", tags: ["Agency"] },
  { id: "cus_05", name: "Meridian Freight", domain: "meridianfreight.com", plan: "Scale", owner: "Tanvir Hasan", region: "Dhaka", seats: 210, mrr: 11340, health: 67, trend: [60, 62, 61, 63, 64, 66, 65, 66, 67, 67], status: "active", since: "2023-11-01", tags: ["Logistics", "Annual"] },
  { id: "cus_06", name: "Saltmarsh Foods", domain: "saltmarsh.co.uk", plan: "Growth", owner: "Rafi Ahmed", region: "Berlin", seats: 48, mrr: 1680, health: 55, trend: [50, 52, 49, 53, 55, 54, 56, 55, 55, 55], status: "trial", since: "2026-10-18", tags: ["Retail"] },
  { id: "cus_07", name: "Orbital Labs", domain: "orbital-labs.io", plan: "Enterprise", owner: "Nadia Karim", region: "Austin", seats: 610, mrr: 29890, health: 81, trend: [72, 74, 75, 77, 78, 78, 79, 80, 80, 81], status: "active", since: "2022-04-27", tags: ["SaaS", "SSO", "Annual"] },
  { id: "cus_08", name: "Riverbend Credit", domain: "riverbendcredit.com", plan: "Scale", owner: "Samir Chowdhury", region: "Toronto", seats: 96, mrr: 5760, health: 29, trend: [48, 45, 42, 40, 37, 35, 33, 31, 30, 29], status: "churn-risk", since: "2024-07-15", tags: ["Finance"] },
  { id: "cus_09", name: "Kestrel Mobility", domain: "kestrel.app", plan: "Growth", owner: "Mira Okafor", region: "Singapore", seats: 32, mrr: 1120, health: 0, trend: [40, 35, 30, 22, 15, 8, 4, 0, 0, 0], status: "paused", since: "2025-01-09", tags: ["Mobility"] },
  { id: "cus_10", name: "Ashgrove Clinics", domain: "ashgrove.health", plan: "Growth", owner: "Tanvir Hasan", region: "Dhaka", seats: 58, mrr: 2030, health: 71, trend: [58, 60, 61, 63, 65, 66, 68, 69, 70, 71], status: "active", since: "2025-03-30", tags: ["Healthcare"] },
  { id: "cus_11", name: "Tidewater Energy", domain: "tidewater.energy", plan: "Enterprise", owner: "Nadia Karim", region: "Toronto", seats: 380, mrr: 18240, health: 63, trend: [70, 69, 68, 67, 66, 65, 64, 64, 63, 63], status: "active", since: "2023-05-19", tags: ["Energy", "Annual"] },
  { id: "cus_12", name: "Pinecrest Realty", domain: "pinecrest.homes", plan: "Starter", owner: "Rafi Ahmed", region: "Austin", seats: 6, mrr: 180, health: 48, trend: [40, 42, 44, 45, 46, 46, 47, 47, 48, 48], status: "trial", since: "2026-10-29", tags: ["Real estate"] },
];

export type Invoice = { id: string; customer: string; amount: number; status: InvoiceStatus; issued: string; due: string; method: "Card" | "Bank transfer" | "Invoice" };

export const invoices: Invoice[] = [
  { id: "INV-2061", customer: "Orbital Labs", amount: 29890, status: "paid", issued: "2026-10-01", due: "2026-10-31", method: "Bank transfer" },
  { id: "INV-2062", customer: "Lumen Health", amount: 21600, status: "paid", issued: "2026-10-01", due: "2026-10-31", method: "Bank transfer" },
  { id: "INV-2063", customer: "Tidewater Energy", amount: 18240, status: "due", issued: "2026-10-15", due: "2026-11-14", method: "Invoice" },
  { id: "INV-2064", customer: "Meridian Freight", amount: 11340, status: "overdue", issued: "2026-09-28", due: "2026-10-28", method: "Invoice" },
  { id: "INV-2065", customer: "Northwind Logistics", amount: 8400, status: "paid", issued: "2026-10-02", due: "2026-11-01", method: "Card" },
  { id: "INV-2066", customer: "Riverbend Credit", amount: 5760, status: "overdue", issued: "2026-09-20", due: "2026-10-20", method: "Invoice" },
  { id: "INV-2067", customer: "Brightpath Schools", amount: 2240, status: "due", issued: "2026-10-22", due: "2026-11-21", method: "Card" },
  { id: "INV-2068", customer: "Ashgrove Clinics", amount: 2030, status: "paid", issued: "2026-10-05", due: "2026-11-04", method: "Card" },
  { id: "INV-2069", customer: "Saltmarsh Foods", amount: 1680, status: "draft", issued: "2026-11-04", due: "2026-12-04", method: "Card" },
  { id: "INV-2070", customer: "Kestrel Mobility", amount: 1120, status: "void", issued: "2026-09-12", due: "2026-10-12", method: "Card" },
  { id: "INV-2071", customer: "Copperline Studio", amount: 270, status: "paid", issued: "2026-10-10", due: "2026-11-09", method: "Card" },
  { id: "INV-2072", customer: "Pinecrest Realty", amount: 180, status: "draft", issued: "2026-11-05", due: "2026-12-05", method: "Card" },
];

export const auditLog = [
  { id: "evt_9f31", actor: "Rafi Ahmed", action: "invoice.sent", target: "INV-2063", ip: "103.92.84.12", at: "2026-11-05 14:22", severity: "info" as const },
  { id: "evt_9f30", actor: "Leah Tran", action: "api_key.created", target: "Production key", ip: "52.14.200.7", at: "2026-11-05 13:58", severity: "warning" as const },
  { id: "evt_9f2f", actor: "Nadia Karim", action: "role.changed", target: "Jonas Weber → Viewer", ip: "103.92.84.40", at: "2026-11-05 12:10", severity: "warning" as const },
  { id: "evt_9f2e", actor: "System", action: "payment.failed", target: "INV-2066 · Riverbend Credit", ip: "—", at: "2026-11-05 09:00", severity: "danger" as const },
  { id: "evt_9f2d", actor: "Tanvir Hasan", action: "customer.updated", target: "Lumen Health", ip: "103.92.84.51", at: "2026-11-04 18:41", severity: "info" as const },
  { id: "evt_9f2c", actor: "Mira Okafor", action: "export.created", target: "Customers (CSV, 12 rows)", ip: "88.130.4.9", at: "2026-11-04 16:03", severity: "info" as const },
  { id: "evt_9f2b", actor: "Leah Tran", action: "sso.enabled", target: "Okta · fernhill.okta.com", ip: "52.14.200.7", at: "2026-11-04 11:27", severity: "warning" as const },
  { id: "evt_9f2a", actor: "Nadia Karim", action: "member.invited", target: "ines@fernhill.io", ip: "103.92.84.40", at: "2026-11-03 10:15", severity: "info" as const },
  { id: "evt_9f29", actor: "System", action: "login.blocked", target: "5 failed attempts · jonas@fernhill.io", ip: "185.220.101.3", at: "2026-11-02 23:48", severity: "danger" as const },
  { id: "evt_9f28", actor: "Samir Chowdhury", action: "invoice.voided", target: "INV-2070", ip: "103.92.84.77", at: "2026-11-02 15:30", severity: "info" as const },
];

export const revenueWeeks = ["Aug 25", "Sep 1", "Sep 8", "Sep 15", "Sep 22", "Sep 29", "Oct 6", "Oct 13", "Oct 20", "Oct 27", "Nov 3"];
export const revenue = [96.2, 97.8, 98.1, 99.4, 99.0, 100.6, 101.9, 102.4, 103.8, 104.1, 102.75].map((v) => v * 1000);
export const revenuePrev = [90.1, 90.8, 91.6, 92.0, 93.1, 93.5, 94.2, 94.0, 95.3, 95.9, 96.4].map((v) => v * 1000);

export const fmtMoney = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
export const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso + "T00:00:00"));

export const invoiceTone = { paid: "success", due: "warning", overdue: "danger", draft: "pending", void: "neutral" } as const;
export const invoiceLabel = { paid: "Paid", due: "Due", overdue: "Overdue", draft: "Draft", void: "Void" } as const;
export const customerTone = { active: "active", trial: "info", "churn-risk": "danger", paused: "neutral" } as const;
export const customerLabel = { active: "Active", trial: "Trial", "churn-risk": "Churn risk", paused: "Paused" } as const;
export const planTone = { Starter: "neutral", Growth: "teal", Scale: "blue", Enterprise: "violet" } as const;
