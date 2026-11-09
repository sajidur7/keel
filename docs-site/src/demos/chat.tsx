import { useRef, useState } from "react";
import {
  Button, ChatComposer, ChatLayout, ChatMessage, ChatMessageMetadata, ChatSystemMessage, ChatToolCalls, IconAgent, Select, Text, Thinking,
  type ChatAttachment, type ToolCall,
} from "@keel/components";
import { Row } from "../docs/kit";

const REPLY = "Here's what changed in **October**:\n\n- MRR grew **6.2%** to $84.3k, mostly from 9 upgrades to Pro.\n- Churn fell to 1.8% (−0.4 pt).\n- Two invoices are overdue: Acme Inc. and Northwind.\n\nWant me to draft reminders for the overdue ones?[^1]";
const SOURCES = [{ title: "Billing report — October", url: "https://example.com/reports/oct" }];

/* ---------------- ChatLayout ---------------- */
export function ChatLayoutDemo() {
  const [messages, setMessages] = useState<{ id: number; role: "user" | "assistant"; content: string; streaming?: boolean }[]>([
    { id: 1, role: "user", content: "Summarize billing for October" },
    { id: 2, role: "assistant", content: REPLY },
  ]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const send = (text: string) => {
    const id = Date.now();
    const answer = "Done — I drafted two reminders. They'll go out at 9:00 tomorrow unless you change them.";
    setMessages((m) => [...m, { id, role: "user", content: text }, { id: id + 1, role: "assistant", content: "", streaming: true }]);
    setDraft(""); setStreaming(true);
    let n = 0;
    timer.current = setInterval(() => {
      n += 3;
      setMessages((m) => m.map((x) => (x.id === id + 1 ? { ...x, content: answer.slice(0, n), streaming: n < answer.length } : x)));
      if (n >= answer.length) { clearInterval(timer.current); setStreaming(false); }
    }, 30);
  };
  return (
    <ChatLayout
      header={<div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px" }}><IconAgent size={16} /><Text weight="semibold">Assistant</Text></div>}
      composer={<ChatComposer value={draft} onValueChange={setDraft} onSubmit={send} streaming={streaming} onStop={() => { clearInterval(timer.current); setStreaming(false); }} />}
      footer="Answers can be wrong. Check important numbers."
    >
      <ChatSystemMessage>Today</ChatSystemMessage>
      {messages.map((m) => <ChatMessage key={m.id} role={m.role} content={m.content} streaming={m.streaming} sources={SOURCES} author={m.role === "assistant" ? { name: "Keel AI" } : undefined} onFeedback={() => {}} onRetry={() => {}} />)}
    </ChatLayout>
  );
}

/* ---------------- ChatMessage ---------------- */
export function ChatMessageDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 640 }}>
      <ChatMessage role="user" content="Which customers are at risk of churning this month?" attachments={[{ name: "usage-oct.csv" }]} />
      <ChatMessage role="assistant" author={{ name: "Keel AI" }} content={"Three accounts look at risk:\n\n1. **Acme Inc.** — seats used dropped 40%\n2. **Globex** — no logins in 21 days\n3. **Initech** — two failed payments"} onFeedback={() => {}} onRetry={() => {}} showActions />
    </div>
  );
}
export function ChatMessageStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 640 }}>
      <ChatMessage role="assistant" author={{ name: "Thinking" }} before={<Thinking reasoning="Looking at seat usage, logins and payment history for 412 accounts…" />} />
      <ChatMessage role="assistant" author={{ name: "Streaming" }} content="Pulling the latest invoices from Stripe and" streaming />
      <ChatMessage role="assistant" author={{ name: "Error" }} error="The billing service didn't respond." onRetry={() => {}} />
      <ChatMessage role="user" content="Long user message that wraps onto several lines to show how the bubble keeps its width under 560px and stays easy to read." />
    </div>
  );
}

/* ---------------- ChatMessageMetadata ---------------- */
export function ChatMessageMetadataDemo() {
  return (
    <Row col gap={12}>
      <ChatMessageMetadata items={["9:41 AM", "keel-large", "1,204 tokens", "2.1s"]} />
      <ChatMessageMetadata items={["Sent", "Read by Ana"]} />
      <ChatMessageMetadata items={[<span key="f" style={{ color: "var(--danger, #dc2626)" }}>Failed to send</span>, "Tap to retry"]} />
    </Row>
  );
}

/* ---------------- ChatSystemMessage ---------------- */
export function ChatSystemMessageDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      <ChatSystemMessage>Yesterday</ChatSystemMessage>
      <ChatSystemMessage icon={<IconAgent />}>Ana added the assistant to this thread</ChatSystemMessage>
      <ChatSystemMessage>Context was reset — earlier messages aren't used</ChatSystemMessage>
    </div>
  );
}

/* ---------------- ChatToolCalls ---------------- */
const CALLS: ToolCall[] = [
  { id: "1", name: "billing.search_invoices", status: "done", input: '{ "status": "overdue", "month": "2026-10" }', output: "2 invoices · $4,820", durationMs: 820 },
  { id: "2", name: "crm.get_contacts", status: "done", input: '{ "accounts": ["acme", "northwind"] }', output: "2 contacts", durationMs: 410 },
  { id: "3", name: "email.draft", status: "running", input: '{ "template": "reminder" }' },
];
export function ChatToolCallsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 560 }}>
      <ChatToolCalls calls={CALLS} defaultOpen />
      <ChatToolCalls calls={CALLS.slice(0, 2)} />
      <ChatToolCalls calls={[{ id: "x", name: "warehouse.query", status: "error", output: "Timeout after 30s", durationMs: 30000 }]} defaultOpen />
    </div>
  );
}

/* ---------------- ChatComposer ---------------- */
export function ChatComposerDemo() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<ChatAttachment[]>([{ name: "q3-board-deck.pdf" }]);
  const [model, setModel] = useState("large");
  return (
    <div style={{ width: "100%", maxWidth: 680 }}>
      <ChatComposer value={value} onValueChange={setValue} onSubmit={() => setValue("")}
        attachments={files} onAttach={(fs) => setFiles((x) => [...x, ...fs.map((f) => ({ name: f.name }))])} onRemoveAttachment={(n) => setFiles((x) => x.filter((f) => f.name !== n))}
        tools={<Select size="sm" variant="button" value={model} onValueChange={setModel} aria-label="Model" options={[{ value: "large", label: "Keel Large" }, { value: "fast", label: "Keel Fast" }]} />} />
    </div>
  );
}
export function ChatComposerStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 680 }}>
      <ChatComposer value="Draft two reminders for the overdue invoices" onValueChange={() => {}} onSubmit={() => {}} streaming onStop={() => {}} />
      <ChatComposer value="" onValueChange={() => {}} onSubmit={() => {}} disabled placeholder="Assistant is offline" dictation={false} />
      <Button variant="ghost" size="sm" onClick={() => {}}>Stop button shows while streaming ↑</Button>
    </div>
  );
}
