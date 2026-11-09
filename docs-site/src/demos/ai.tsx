import { useState } from "react";
import {
  AiBadge, ApprovalCard, Button, ConfidenceMeter, ContextCard, ContextChips, DiffTable, IconBook, IconChartBar, IconDatabase, IconGlobe, IconMail, IconSearch,
  IconAgent, InsightCard, LoadingState, ParameterCard, PixelLoader, PromptBar, PromptSuggestions, RecommendationCard, StreamingText, TaskList, Thinking, ToolChips,
  type ApprovalState, type DiffRow, type ToolChip,
} from "@keel/components";
import { Row, State, StateGrid } from "../docs/kit";

/* ---------------- Thinking & loaders ---------------- */
export function ThinkingDemo() {
  return (
    <StateGrid min={260}>
      <State label="Thinking"><Thinking reasoning={"The user wants churn risk. I'll compare seat usage month over month, then check login recency and failed payments."} /></State>
      <State label="Done"><Thinking done reasoning="Compared 412 accounts across 3 signals." /></State>
      <State label="Pixel loader"><PixelLoader /><PixelLoader size={5} /></State>
      <State label="Loading state" wide><LoadingState title="Building your report" steps={["Reading 12,408 invoices", "Grouping by plan", "Writing summary"]} current={1} /></State>
    </StateGrid>
  );
}

/* ---------------- StreamingText ---------------- */
export function StreamingTextDemo() {
  const [key, setKey] = useState(0);
  return (
    <Row col gap={12}>
      <p key={key} style={{ fontSize: 15, lineHeight: 1.6, maxWidth: 560 }}><StreamingText text="Revenue is up 6.2% this month. Most of the growth came from nine upgrades to the Pro plan in the second week." /></p>
      <div><Button size="sm" onClick={() => setKey((k) => k + 1)}>Replay</Button></div>
    </Row>
  );
}

/* ---------------- PromptBar ---------------- */
export function PromptBarDemo() {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 560 }}>
      <PromptBar value={q} onValueChange={setQ} busy={busy} onSubmit={() => { setBusy(true); setTimeout(() => { setBusy(false); setQ(""); }, 1200); }} />
      <PromptSuggestions onPick={setQ} items={[{ label: "Top customers by MRR", icon: <IconChartBar /> }, { label: "Who churned last month?", icon: <IconSearch /> }, { label: "Draft a renewal email", icon: <IconMail /> }]} />
    </div>
  );
}

/* ---------------- ToolChips ---------------- */
export function ToolChipsDemo() {
  const [tools, setTools] = useState<ToolChip[]>([
    { id: "web", label: "Web search", icon: <IconGlobe />, state: "on" },
    { id: "db", label: "Warehouse", icon: <IconDatabase />, state: "running" },
    { id: "docs", label: "Docs", icon: <IconBook />, state: "off" },
    { id: "mail", label: "Email", icon: <IconMail />, state: "off" },
  ]);
  return <ToolChips tools={tools} onToggle={(id) => setTools((t) => t.map((x) => (x.id === id ? { ...x, state: x.state === "on" ? "off" : "on" } : x)))} />;
}

/* ---------------- ApprovalCard ---------------- */
export function ApprovalCardDemo() {
  const [state, setState] = useState<ApprovalState>("pending");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 520 }}>
      <ApprovalCard title="Send 2 payment reminders?" description="The assistant wants to email Acme Inc. and Northwind about overdue invoices."
        details={"To: billing@acme.com, ap@northwind.com\nSubject: Invoice INV-1042 is 14 days overdue"} state={state}
        onApprove={() => setState("approved")} onReject={() => setState("rejected")} onAlwaysAllow={() => setState("approved")} approveLabel="Send emails" />
      <ApprovalCard tone="warning" title="Delete 128 archived records?" description="This can't be undone." state="rejected" onApprove={() => {}} onReject={() => {}} />
      {state !== "pending" && <div><Button size="sm" onClick={() => setState("pending")}>Reset</Button></div>}
    </div>
  );
}

/* ---------------- RecommendationCard ---------------- */
export function RecommendationCardDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <RecommendationCard title="Offer Acme an annual plan" rationale="They've paid monthly for 14 months with no failed payments. Annual saves them 20% and locks in $28.8k." confidence={0.86}
        meta="Based on 14 invoices" actions={<><Button size="sm" variant="ghost">Dismiss</Button><Button size="sm" variant="primary">Draft offer</Button></>} />
      <RecommendationCard title="Review Globex's seat count" rationale="Only 12 of 40 seats were used last month." confidence={0.54} actions={<Button size="sm">Open account</Button>} />
      <Row gap={16}><AiBadge /><AiBadge label="Generated" /><ConfidenceMeter value={0.3} /></Row>
    </div>
  );
}

/* ---------------- ContextCards ---------------- */
export function ContextCardsDemo() {
  const [items, setItems] = useState([
    { id: "1", title: "Q3 board deck.pdf", meta: "PDF · 24 pages", kind: "file" as const },
    { id: "2", title: "Pricing page", meta: "acme.com/pricing", kind: "link" as const },
    { id: "3", title: "Acme Inc.", meta: "Customer · Enterprise", kind: "record" as const, icon: <IconAgent /> },
  ]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 760 }}>
      <ContextChips items={items} onRemove={(id) => setItems((x) => x.filter((i) => i.id !== id))} />
      <ContextCard item={{ id: "x", title: "usage-october.csv", meta: "CSV · 4,210 rows" }} />
    </div>
  );
}

/* ---------------- InsightCard ---------------- */
export function InsightCardDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 16, width: "100%" }}>
      <InsightCard title="Net revenue retention" value="112%" trend={[96, 98, 101, 103, 105, 108, 112]} explanation="Expansion from Pro upgrades outpaced churn for the third month in a row." onAsk={() => {}} />
      <InsightCard title="Failed payments" value="23" trend={[8, 9, 12, 11, 15, 19, 23]} explanation="Up 3× since August — most are expired cards on monthly plans." onAsk={() => {}} />
    </div>
  );
}

/* ---------------- DiffTable ---------------- */
export function DiffTableDemo() {
  const [rows, setRows] = useState<DiffRow[]>([
    { id: "1", label: "Acme Inc.", field: "Plan", from: "Starter", to: "Pro" },
    { id: "2", label: "Globex", field: "Seats", from: "40", to: "15" },
    { id: "3", label: "Initech", field: "Billing email", from: "old@initech.io", to: "ap@initech.io" },
  ]);
  const set = (id: string, status: DiffRow["status"]) => setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  return <div style={{ width: "100%", maxWidth: 760 }}><DiffTable rows={rows} onAccept={(id) => set(id, "accepted")} onReject={(id) => set(id, "rejected")} onAcceptAll={() => setRows((r) => r.map((x) => ({ ...x, status: x.status ?? "accepted" })))} /></div>;
}

/* ---------------- TaskList ---------------- */
export function TaskListDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <TaskList tasks={[
        { id: "1", title: "Find overdue invoices", status: "done", meta: "2 found · 0.8s" },
        { id: "2", title: "Look up billing contacts", status: "done", meta: "0.4s" },
        { id: "3", title: "Draft reminder emails", status: "running" },
        { id: "4", title: "Schedule for 9:00 tomorrow", status: "queued" },
        { id: "5", title: "Sync to CRM", status: "failed", meta: "CRM token expired" },
      ]} />
    </div>
  );
}

/* ---------------- ParameterCard ---------------- */
export function ParameterCardDemo() {
  const [p, setP] = useState({ temp: 0.7, topP: 0.9, max: 1024 });
  return (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <ParameterCard title="Model settings" onChange={(id, v) => setP((x) => ({ ...x, [id]: v }))} params={[
        { id: "temp", label: "Temperature", value: p.temp, min: 0, max: 2, step: 0.1, format: (n) => n.toFixed(1) },
        { id: "topP", label: "Top P", value: p.topP, min: 0, max: 1, step: 0.05, format: (n) => n.toFixed(2) },
        { id: "max", label: "Max tokens", value: p.max, min: 256, max: 4096, step: 256 },
      ]} footer={<><Button size="sm" variant="ghost" onClick={() => setP({ temp: 0.7, topP: 0.9, max: 1024 })}>Reset</Button><Button size="sm" variant="primary" xstyle={undefined}>Save preset</Button></>} />
    </div>
  );
}
