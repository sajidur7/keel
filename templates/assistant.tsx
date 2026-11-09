import { useRef, useState } from "react";
import {
  ApprovalCard, ChatComposer, ChatLayout, ChatMessage, ChatSystemMessage, ChatToolCalls, ContextChips, DiffTable, IconDatabase, IconGlobe, IconMail, IconAgent,
  PromptSuggestions, RecommendationCard, Select, TaskList, Text, Thinking, ToolChips, Button, IconChartBar, IconSearch, type ApprovalState, type DiffRow, type ToolChip,
} from "@keel/components";
import { AdminShell, type Nav } from "./shell";

type Turn = { id: number; role: "user" | "assistant"; content?: string; kind?: "plan" | "diff" | "approval" | "reco"; streaming?: boolean };

export function AssistantTemplate({ go }: { go?: (to: Nav) => void }) {
  const [turns, setTurns] = useState<Turn[]>([
    { id: 1, role: "user", content: "Which accounts are at risk this month, and what should we do?" },
    { id: 2, role: "assistant", content: "Three accounts dropped below 50 health. **Riverbend Credit** has two failed payments; **Brightpath Schools** lost 30% of weekly actives; **Kestrel Mobility** hasn't logged in for 3 weeks.\n\nI drafted fixes below — review them before anything is sent.", kind: "plan" },
    { id: 3, role: "assistant", kind: "diff" },
    { id: 4, role: "assistant", kind: "approval" },
  ]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState("large");
  const [approval, setApproval] = useState<ApprovalState>("pending");
  const [diff, setDiff] = useState<DiffRow[]>([
    { id: "1", label: "Riverbend Credit", field: "Plan", from: "Scale", to: "Growth" },
    { id: "2", label: "Brightpath Schools", field: "Owner", from: "Mira Okafor", to: "Tanvir Hasan" },
    { id: "3", label: "Kestrel Mobility", field: "Status", from: "Active", to: "Paused" },
  ]);
  const [tools, setTools] = useState<ToolChip[]>([{ id: "db", label: "Warehouse", icon: <IconDatabase />, state: "on" }, { id: "web", label: "Web", icon: <IconGlobe />, state: "off" }, { id: "mail", label: "Email", icon: <IconMail />, state: "on" }]);
  const t = useRef<ReturnType<typeof setInterval>>(undefined);
  const send = (text: string) => {
    const id = Date.now(); const answer = "On it — I'll pull last quarter's renewals and compare discount rates by plan. This takes about a minute.";
    setTurns((x) => [...x, { id, role: "user", content: text }, { id: id + 1, role: "assistant", content: "", streaming: true }]); setDraft(""); setStreaming(true);
    let n = 0; t.current = setInterval(() => { n += 4; setTurns((x) => x.map((y) => (y.id === id + 1 ? { ...y, content: answer.slice(0, n), streaming: n < answer.length } : y))); if (n >= answer.length) { clearInterval(t.current); setStreaming(false); } }, 30);
  };
  const setRow = (rid: string, status: DiffRow["status"]) => setDiff((d) => d.map((r) => (r.id === rid ? { ...r, status } : r)));
  return (
    <AdminShell active="assistant" go={go} header={{ title: "Assistant", status: <Text variant="caption">Fernhill data · read & draft</Text>, actions: <Select size="sm" variant="button" value={model} onValueChange={setModel} aria-label="Model" options={[{ value: "large", label: "Keel Large" }, { value: "fast", label: "Keel Fast" }]} /> }}>
      <div style={{ flex: 1, minHeight: 0, height: "calc(100dvh - 68px)" }}>
        <ChatLayout
          composer={<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {turns.length < 6 && <PromptSuggestions onPick={setDraft} items={[{ label: "Top accounts by MRR", icon: <IconChartBar /> }, { label: "Who renews next month?", icon: <IconSearch /> }, { label: "Draft a renewal email", icon: <IconMail /> }]} />}
            <ChatComposer value={draft} onValueChange={setDraft} onSubmit={send} streaming={streaming} onStop={() => { clearInterval(t.current); setStreaming(false); }} onAttach={() => {}}
              tools={<ToolChips tools={tools} onToggle={(id) => setTools((x) => x.map((y) => (y.id === id ? { ...y, state: y.state === "on" ? "off" : "on" } : y)))} />} />
          </div>}
          footer="The assistant drafts changes; people approve them.">
          <ChatSystemMessage icon={<IconAgent />}>Connected to Fernhill · 12 customers, 14 invoices</ChatSystemMessage>
          {turns.map((x) => {
            if (x.role === "user") return <ChatMessage key={x.id} role="user" content={x.content} />;
            if (x.kind === "plan") return <ChatMessage key={x.id} role="assistant" author={{ name: "Keel AI" }} content={x.content}
              before={<><Thinking done reasoning="Ranked accounts by health score, then checked payments, weekly actives and last login." /><ChatToolCalls calls={[{ id: "a", name: "warehouse.health_scores", status: "done", durationMs: 640 }, { id: "b", name: "billing.failed_payments", status: "done", durationMs: 380 }]} /></>}
              after={<><ContextChips items={[{ id: "1", title: "Riverbend Credit", meta: "Health 29" }, { id: "2", title: "Brightpath Schools", meta: "Health 38" }, { id: "3", title: "Kestrel Mobility", meta: "Health 0" }]} />
                <TaskList tasks={[{ id: "1", title: "Find at-risk accounts", status: "done" }, { id: "2", title: "Propose account changes", status: "done" }, { id: "3", title: "Email owners", status: approval === "approved" ? "done" : "queued" }]} /></>}
              onFeedback={() => {}} />;
            if (x.kind === "diff") return <ChatMessage key={x.id} role="assistant" author={{ name: "Keel AI" }}><DiffTable rows={diff} onAccept={(rid) => setRow(rid, "accepted")} onReject={(rid) => setRow(rid, "rejected")} onAcceptAll={() => setDiff((d) => d.map((r) => ({ ...r, status: r.status ?? "accepted" })))} /></ChatMessage>;
            if (x.kind === "approval") return <ChatMessage key={x.id} role="assistant" author={{ name: "Keel AI" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ApprovalCard title="Email the 3 account owners?" description="One short email each, with the account's numbers and a suggested next step." details={"To: samir@, mira@, tanvir@fernhill.io\nSubject: Account at risk — next step"} state={approval}
                  onApprove={() => setApproval("approved")} onReject={() => setApproval("rejected")} approveLabel="Send 3 emails" />
                <RecommendationCard title="Offer Riverbend a 2-month payment plan" rationale="Two failed payments in 30 days; they've been a customer for 18 months with no prior failures." confidence={0.74} actions={<Button size="sm">Draft offer</Button>} />
              </div>
            </ChatMessage>;
            return <ChatMessage key={x.id} role="assistant" author={{ name: "Keel AI" }} content={x.content} streaming={x.streaming} />;
          })}
        </ChatLayout>
      </div>
    </AdminShell>
  );
}
