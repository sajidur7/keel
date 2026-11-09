import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Alert, Button, Checkbox, Divider, Field, IconArrowLeft, IconMail, Input, Link, OtpInput, PasswordInput, Text } from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";
import type { Nav } from "./shell";

const s = stylex.create({
  page: {
    minHeight: "100dvh", display: "grid", placeItems: "center", padding: 16, backgroundColor: color.canvas,
    backgroundImage: `radial-gradient(60% 50% at 50% 0%, ${color.accentSoft}, transparent 70%), radial-gradient(${color.border} 1px, transparent 1px)`,
    backgroundSize: "100% 100%, 18px 18px",
  },
  card: { width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 20, padding: 28, borderRadius: radius.xxl, backgroundColor: color.surfaceRaised, boxShadow: depth.dialog },
  logo: {
    display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: radius.lg, color: color.onInk, fontWeight: font.bold,
    backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink,
  },
  head: { display: "flex", flexDirection: "column", gap: 6 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  sso: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
});

export function LoginTemplate({ go }: { go?: (to: Nav | "forgot") => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <main {...stylex.props(s.page)}>
      <form {...stylex.props(s.card)} onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); setErr(true); }, 900); }}>
        <span {...stylex.props(s.logo)}>F</span>
        <div {...stylex.props(s.head)}><Text variant="h2">Sign in to Fernhill</Text><Text tone="muted">Welcome back. Use your work email.</Text></div>
        {err && <Alert tone="danger" title="That password doesn't match">Try again, or reset it.</Alert>}
        <Field label="Email"><Input type="email" autoComplete="email" defaultValue="nadia@fernhill.io" leading={<IconMail />} /></Field>
        <Field label="Password" labelAside={<Link tone="quiet" href="#" onClick={(e) => { e.preventDefault(); go?.("forgot"); }}>Forgot?</Link>}><PasswordInput /></Field>
        <Checkbox label="Keep me signed in for 30 days" defaultChecked />
        <Button type="submit" variant="primary" size="lg" fullWidth loading={busy}>Sign in</Button>
        <Divider label="or" />
        <div {...stylex.props(s.sso)}><Button size="lg">Google</Button><Button size="lg">SSO</Button></div>
        <Text variant="caption" style={{ textAlign: "center" }}>New to Fernhill? <Link href="#">Create a workspace</Link></Text>
      </form>
    </main>
  );
}

export function ForgotPasswordTemplate({ go }: { go?: (to: Nav | "login") => void }) {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [code, setCode] = useState("");
  return (
    <main {...stylex.props(s.page)}>
      <div {...stylex.props(s.card)}>
        <span {...stylex.props(s.logo)}>F</span>
        {step === "email" && <>
          <div {...stylex.props(s.head)}><Text variant="h2">Reset your password</Text><Text tone="muted">We'll email you a 6-digit code.</Text></div>
          <Field label="Work email"><Input type="email" placeholder="you@company.com" leading={<IconMail />} /></Field>
          <Button variant="primary" size="lg" fullWidth onClick={() => setStep("code")}>Send code</Button>
        </>}
        {step === "code" && <>
          <div {...stylex.props(s.head)}><Text variant="h2">Check your email</Text><Text tone="muted">Enter the code we sent to nadia@fernhill.io.</Text></div>
          <OtpInput value={code} onChange={setCode} onComplete={() => setTimeout(() => setStep("done"), 400)} autoFocus />
          <div {...stylex.props(s.row)}><Text variant="caption">Didn't get it?</Text><Button size="sm" variant="ghost">Resend</Button></div>
        </>}
        {step === "done" && <>
          <div {...stylex.props(s.head)}><Text variant="h2">Choose a new password</Text><Text tone="muted">At least 12 characters.</Text></div>
          <Field label="New password"><PasswordInput autoComplete="new-password" /></Field>
          <Button variant="primary" size="lg" fullWidth onClick={() => go?.("login")}>Update password</Button>
        </>}
        <Button variant="ghost" leading={<IconArrowLeft />} onClick={() => go?.("login")}>Back to sign in</Button>
      </div>
    </main>
  );
}
