/* Entry — 10 auth screens + 8 onboarding screens. Centered card on a dotted canvas; onboarding uses a stepper frame. */
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import {
  Alert, Avatar, Bezel, Button, Checkbox, Divider, Field, FileInput, IconArrowLeft, IconArrowRight, IconBuilding, IconCheck, IconCheckCircle, IconGlobe, IconKey, IconLock,
  IconMail, IconUpload, IconUsers, Input, InputGroup, InputGroupText, Link, List, ListItem, OtpInput, PasswordInput, ProgressBar, RadioList, SegmentBar, Select,
  SelectableCard, Spinner, StatusPill, Stepper, Switch, Tag, Text, Tokenizer, IconPlug, IconFileSpreadsheet, IconChartBar, IconTarget, IconAgent, Kbd, TaskList,
} from "@keel/components";
import { color, depth, font, radius } from "@keel/tokens/tokens.stylex";
import { ScreenShell, useGo } from "./kit";

const s = stylex.create({
  page: { minHeight: "100dvh", display: "grid", placeItems: "center", padding: 16, backgroundColor: color.canvas, backgroundImage: `radial-gradient(${color.border} 1px, transparent 1px)`, backgroundSize: "18px 18px" },
  card: { width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 20, padding: { default: 22, "@media (min-width: 480px)": 28 }, borderRadius: radius.xxl, backgroundColor: color.surfaceRaised, boxShadow: depth.dialog },
  wide: { maxWidth: 560 },
  logo: { display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: radius.lg, color: color.onInk, fontWeight: font.bold, backgroundImage: `linear-gradient(180deg, ${color.inkTop}, ${color.inkBottom})`, boxShadow: depth.ink },
  head: { display: "flex", flexDirection: "column", gap: 6 },
  h1: { fontSize: font.h2, fontWeight: font.semibold, letterSpacing: "-0.02em", lineHeight: 1.2 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" },
  two: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  split: { minHeight: "100dvh", display: "grid", gridTemplateColumns: { default: "1fr", "@media (min-width: 1000px)": "1fr 1fr" }, backgroundColor: color.canvas },
  splitSide: {
    display: { default: "none", "@media (min-width: 1000px)": "flex" }, flexDirection: "column", justifyContent: "space-between", padding: 40, margin: 12, borderRadius: radius.xxl, color: color.onInk,
    backgroundImage: `radial-gradient(color-mix(in srgb, ${color.onInk} 14%, transparent) 1px, transparent 1px), linear-gradient(170deg, ${color.inkTop}, ${color.inkBottom})`, backgroundSize: "16px 16px, auto", boxShadow: depth.ink,
  },
  quote: { fontSize: "22px", lineHeight: 1.4, letterSpacing: "-0.01em", maxWidth: 440 },
  icon: { display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: radius.xl, color: color.fg, backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised },
  center: { textAlign: "center", alignItems: "center" },
  onb: { minHeight: "100dvh", display: "flex", flexDirection: "column", backgroundColor: color.canvas },
  onbTop: { display: "flex", alignItems: "center", gap: 12, paddingInline: { default: 16, "@media (min-width: 768px)": 32 }, height: 64 },
  onbBody: { flex: 1, display: "flex", justifyContent: "center", padding: 16, paddingTop: { default: 8, "@media (min-width: 768px)": 32 } },
  onbCard: { width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 24 },
  grid2: { display: "grid", gap: 10, gridTemplateColumns: { default: "1fr", "@media (min-width: 560px)": "1fr 1fr" } },
  foot: { display: "flex", justifyContent: "space-between", gap: 8, paddingTop: 8 },
});

const Logo = () => <span {...stylex.props(s.logo)}>N</span>;
function Auth({ title, sub, children, wide, center, icon }: { title: ReactNode; sub?: ReactNode; children: ReactNode; wide?: boolean; center?: boolean; icon?: ReactNode }) {
  return (
    <main {...stylex.props(s.page)}>
      <div {...stylex.props(s.card, wide && s.wide, center && s.center)}>
        {icon ? <span {...stylex.props(s.icon)}>{icon}</span> : <Logo />}
        <div {...stylex.props(s.head, center && s.center)}><h1 {...stylex.props(s.h1)}>{title}</h1>{sub && <Text tone="muted">{sub}</Text>}</div>
        {children}
      </div>
    </main>
  );
}
const SSO = () => <div {...stylex.props(s.two)}><Button leading={<IconGlobe />}>Google</Button><Button leading={<IconKey />}>SSO</Button></div>;

function Login() {
  const go = useGo(); const [busy, setBusy] = useState(false);
  return (
    <Auth title="Sign in to Northwind" sub="Welcome back. Use your work email.">
      <form style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => go("dash-home"), 700); }}>
        <Field label="Work email"><Input type="email" placeholder="you@company.com" autoComplete="email" /></Field>
        <Field label="Password" labelAside={<Link href="#" onClick={(e) => { e.preventDefault(); go("auth-reset"); }}>Forgot?</Link>}><PasswordInput autoComplete="current-password" /></Field>
        <Checkbox label="Keep me signed in for 30 days" defaultChecked />
        <Button type="submit" variant="primary" fullWidth loading={busy}>Sign in</Button>
      </form>
      <Divider label="or" /><SSO />
      <Text variant="caption" style={{ textAlign: "center" }}>New to Northwind? <Link href="#" onClick={(e) => { e.preventDefault(); go("auth-signup"); }}>Create an account</Link></Text>
    </Auth>
  );
}
function LoginSplit() {
  const go = useGo();
  return (
    <main {...stylex.props(s.split)}>
      <aside {...stylex.props(s.splitSide)}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}><Logo />Northwind</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}><p {...stylex.props(s.quote)}>“We replaced three tools with Northwind and our reps got four hours a week back.”</p><span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name="Sara Lind" size="md" /><span style={{ display: "flex", flexDirection: "column" }}><b>Sara Lind</b><span style={{ opacity: 0.7 }}>VP Sales, Foxglove (sample)</span></span></span></div>
        <span style={{ opacity: 0.6, fontSize: 12 }}>SOC 2 Type II · GDPR · 99.99% uptime</span>
      </aside>
      <div style={{ display: "grid", placeItems: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 20 }}>
          <div {...stylex.props(s.head)}><h1 {...stylex.props(s.h1)}>Welcome back</h1><Text tone="muted">Sign in with your work account.</Text></div>
          <SSO /><Divider label="or with email" />
          <Field label="Email"><Input type="email" placeholder="you@company.com" /></Field>
          <Button variant="primary" fullWidth onClick={() => go("auth-magic")}>Email me a sign-in link</Button>
        </div>
      </div>
    </main>
  );
}
function Signup() {
  const go = useGo(); const [pw, setPw] = useState("");
  const strength = Math.min(4, [/.{8,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length);
  return (
    <Auth title="Create your account" sub="Free for 14 days. No credit card.">
      <div {...stylex.props(s.two)}><Field label="First name"><Input /></Field><Field label="Last name"><Input /></Field></div>
      <Field label="Work email"><Input type="email" placeholder="you@company.com" /></Field>
      <Field label="Password" description={["Use 8+ characters", "Weak", "Okay", "Good", "Strong"][strength]}><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
      <SegmentBar value={strength} max={4} segments={4} tone={strength < 2 ? "danger" : "default"} label="Password strength" />
      <Checkbox label={<>I agree to the <Link href="#">terms</Link> and <Link href="#">privacy policy</Link></>} />
      <Button variant="primary" fullWidth onClick={() => go("auth-verify")}>Create account</Button>
      <Text variant="caption" style={{ textAlign: "center" }}>Already have an account? <Link href="#" onClick={(e) => { e.preventDefault(); go("auth-login"); }}>Sign in</Link></Text>
    </Auth>
  );
}
function Magic() { const go = useGo(); return <Auth center icon={<IconMail size={22} />} title="Check your email" sub={<>We sent a sign-in link to <b>maya@northwind.io</b>. It expires in 15 minutes.</>}><Button fullWidth onClick={() => go("auth-login")} leading={<IconArrowLeft />}>Back to sign in</Button><Text variant="caption">Didn't get it? <Link href="#">Resend</Link></Text></Auth>; }
function TwoFactor() {
  const go = useGo(); const [v, setV] = useState("");
  return <Auth center icon={<IconLock size={22} />} title="Two-step verification" sub="Enter the 6-digit code from your authenticator app."><OtpInput value={v} onChange={setV} groupSize={3} autoFocus onComplete={() => go("dash-home")} /><Button variant="primary" fullWidth disabled={v.length < 6} onClick={() => go("dash-home")}>Verify</Button><Link href="#">Use a backup code instead</Link></Auth>;
}
function Reset() { const go = useGo(); return <Auth title="Reset your password" sub="We'll email you a link to choose a new one."><Field label="Email"><Input type="email" defaultValue="maya@northwind.io" /></Field><Button variant="primary" fullWidth onClick={() => go("auth-newpass")}>Send reset link</Button><Button variant="ghost" leading={<IconArrowLeft />} onClick={() => go("auth-login")}>Back</Button></Auth>; }
function NewPassword() { const go = useGo(); return <Auth title="Choose a new password" sub="You'll be signed out on other devices."><Field label="New password"><PasswordInput /></Field><Field label="Confirm password" error="Passwords don't match"><PasswordInput invalid /></Field><Button variant="primary" fullWidth onClick={() => go("auth-login")}>Update password</Button></Auth>; }
function Invite() {
  const go = useGo();
  return (
    <Auth title="Join Northwind" sub={<><b>Maya Okafor</b> invited you to the Northwind workspace as a <b>Member</b>.</>}>
      <ListItem leading={<Avatar name="Maya Okafor" size="md" />} title="Maya Okafor" description="maya@northwind.io · Head of Revenue" divided={false} />
      <Field label="Your name"><Input defaultValue="Kenji Sato" /></Field>
      <Field label="Password"><PasswordInput /></Field>
      <Button variant="primary" fullWidth onClick={() => go("onb-welcome")}>Accept & continue</Button>
    </Auth>
  );
}
function SsoPick() { const go = useGo(); return <Auth title="Sign in with SSO" sub="Enter your company domain."><Field label="Company domain"><InputGroup end={<InputGroupText>.keel.dev</InputGroupText>}><Input placeholder="northwind" /></InputGroup></Field><Button variant="primary" fullWidth onClick={() => go("dash-home")}>Continue</Button><Alert tone="info">Your admin turned on Okta for this workspace.</Alert></Auth>; }
function Verify() { const go = useGo(); return <Auth center icon={<IconCheckCircle size={22} />} title="Verify your email" sub="Confirm maya@northwind.io to finish setting up."><Spinner label="Waiting for confirmation" /><Button fullWidth onClick={() => go("onb-welcome")}>I've confirmed</Button><Text variant="caption">Wrong address? <Link href="#">Change it</Link></Text></Auth>; }
function Locked() { return <Auth center icon={<IconLock size={22} />} title="Account locked" sub="Too many sign-in attempts. Try again in 15 minutes, or reset your password."><Alert tone="danger" title="5 failed attempts">From Lisbon, Portugal · 10:42</Alert><Button fullWidth>Reset password</Button></Auth>; }

/* ------------------------------------------------------------------ onboarding */
const STEPS = ["Welcome", "Workspace", "Import", "Team", "Tools"];
function Onb({ step, title, sub, children, next, back }: { step: number; title: string; sub: string; children: ReactNode; next: string; back?: string }) {
  const go = useGo();
  return (
    <main {...stylex.props(s.onb)}>
      <div {...stylex.props(s.onbTop)}><Logo /><div style={{ flex: 1, minWidth: 0 }}><ProgressBar value={(step + 1) / STEPS.length * 100} size="xs" /></div><Text variant="caption">Step {step + 1} of {STEPS.length}</Text></div>
      <div {...stylex.props(s.onbBody)}><div {...stylex.props(s.onbCard)}>
        <div style={{ display: "none" }}><Stepper current={step} steps={STEPS.map((t) => ({ title: t }))} /></div>
        <div {...stylex.props(s.head)}><h1 {...stylex.props(s.h1)}>{title}</h1><Text tone="muted">{sub}</Text></div>
        {children}
        <div {...stylex.props(s.foot)}>{back ? <Button variant="ghost" leading={<IconArrowLeft />} onClick={() => go(back)}>Back</Button> : <span />}<span style={{ display: "flex", gap: 8 }}><Button variant="ghost" onClick={() => go(next)}>Skip</Button><Button variant="primary" trailing={<IconArrowRight />} onClick={() => go(next)}>Continue</Button></span></div>
      </div></div>
    </main>
  );
}
function Welcome() {
  const [role, setRole] = useState("sales");
  const roles: [string, string, ReactNode][] = [["sales", "Sales", <IconTarget />], ["success", "Customer success", <IconUsers />], ["ops", "RevOps", <IconChartBar />], ["founder", "Founder", <IconBuilding />]];
  return <Onb step={0} title="What do you do?" sub="We'll set up Northwind around your work." next="onb-workspace"><div {...stylex.props(s.grid2)}>{roles.map(([v, l, ic]) => <SelectableCard key={v} type="radio" selected={role === v} onSelectedChange={() => setRole(v)} label={l}><span style={{ display: "flex", alignItems: "center", gap: 10 }}>{ic}<Text weight="medium">{l}</Text></span></SelectableCard>)}</div></Onb>;
}
function Workspace() {
  return <Onb step={1} title="Name your workspace" sub="Usually your company name." next="onb-import" back="onb-welcome">
    <Field label="Workspace name"><Input defaultValue="Northwind" /></Field>
    <Field label="URL"><InputGroup start={<InputGroupText>app.keel.dev/</InputGroupText>}><Input defaultValue="northwind" /></InputGroup></Field>
    <Field label="Team size"><RadioList orientation="horizontal" defaultValue="11" options={[{ value: "1", label: "Just me" }, { value: "11", label: "2–20" }, { value: "50", label: "21–100" }, { value: "100", label: "100+" }]} /></Field>
  </Onb>;
}
function Import() {
  const [src, setSrc] = useState("csv");
  return <Onb step={2} title="Bring your customers" sub="Import from a file or connect your current CRM." next="onb-team" back="onb-workspace">
    <div {...stylex.props(s.grid2)}>{[["csv", "Upload CSV", <IconFileSpreadsheet />], ["hubspot", "HubSpot", <IconPlug />], ["salesforce", "Salesforce", <IconPlug />], ["none", "Start empty", <IconCheck />]].map(([v, l, ic]) => <SelectableCard key={v as string} type="radio" selected={src === v} onSelectedChange={() => setSrc(v as string)} label={l as string}><span style={{ display: "flex", alignItems: "center", gap: 10 }}>{ic}<Text weight="medium">{l}</Text></span></SelectableCard>)}</div>
    {src === "csv" && <FileInput accept=".csv" hint="Up to 50,000 rows. We'll map the columns next." multiple={false} onFiles={() => {}} />}
  </Onb>;
}
function Team() {
  const [emails, setEmails] = useState([{ value: "lena@northwind.io", label: "lena@northwind.io" }, { value: "rafi@northwind.io", label: "rafi@northwind.io" }]);
  return <Onb step={3} title="Invite your team" sub="Northwind works best with everyone in it." next="onb-tools" back="onb-import">
    <Field label="Emails" description="Press Enter after each address."><Tokenizer value={emails} onValueChange={setEmails} allowCreate placeholder="name@company.com" source={async () => []} /></Field>
    <Field label="Role"><Select defaultValue="member" options={[{ value: "member", label: "Member" }, { value: "admin", label: "Admin" }]} /></Field>
    <Switch label="Let anyone with a @northwind.io email join" defaultChecked />
  </Onb>;
}
function Tools() {
  return <Onb step={4} title="Connect your tools" sub="You can do this later in Settings → Integrations." next="onb-checklist" back="onb-team">
    <List>{[["Slack", "Deal alerts in channels", true], ["Google Calendar", "Meetings on records", false], ["Stripe", "Revenue and invoices", false], ["Gmail", "Email history", false]].map(([n, d, on]) => <ListItem key={n as string} leading={<Avatar name={n as string} size="md" shape="square" />} title={n} description={d} trailing={on ? <StatusPill status="active">Connected</StatusPill> : <Button size="sm">Connect</Button>} />)}</List>
  </Onb>;
}
function Checklist() {
  const go = useGo();
  return (
    <ScreenShell active="dash-home" header={{ title: "Get started" }} pageWidth="narrow">
      <Bezel label="Setup" meta="3 of 6 done"><ProgressBar value={50} showValue /><TaskList plain tasks={[{ id: "1", title: "Create your workspace", status: "done" }, { id: "2", title: "Import customers", status: "done", meta: "2,148 people" }, { id: "3", title: "Invite your team", status: "done", meta: "2 invited" }, { id: "4", title: "Connect your calendar", status: "running" }, { id: "5", title: "Build your first workflow", status: "queued" }, { id: "6", title: "Ask the assistant a question", status: "queued" }]} /></Bezel>
      <div {...stylex.props(s.grid2)}>
        <Bezel label="Next" footer={<Button size="sm" variant="primary" onClick={() => go("work-workflow")}>Open builder</Button>}><Text weight="medium">Build your first workflow</Text><Text tone="muted">Route new leads to the right owner automatically.</Text></Bezel>
        <Bezel label="Try" icon={<IconAgent size={12} />} footer={<Button size="sm" onClick={() => go("ai-assistant")}>Ask</Button>}><Text weight="medium">“Which deals slipped this week?”</Text><Text tone="muted">The assistant reads your pipeline and explains.</Text></Bezel>
      </div>
      <Text variant="caption">Press <Kbd>⌘K</Kbd> anytime to jump anywhere.</Text>
    </ScreenShell>
  );
}
function Trial() {
  const go = useGo();
  return <Auth wide title="Your trial ends in 3 days" sub="Pick a plan to keep your data and workflows.">
    <List>{[["Starter", "$12 / seat", "Up to 5 seats, core CRM"], ["Growth", "$39 / seat", "Workflows, reports, assistant"], ["Scale", "$79 / seat", "SSO, audit log, custom roles"]].map(([n, p, d], i) => <ListItem key={n} title={<span style={{ display: "flex", gap: 8, alignItems: "center" }}>{n}{i === 1 && <Tag size="sm" tone="blue">Recommended</Tag>}</span>} description={d} meta={p} />)}</List>
    <div {...stylex.props(s.row)}><Button variant="ghost" onClick={() => go("dash-home")}>Remind me later</Button><Button variant="primary" onClick={() => go("com-checkout")}>Choose Growth</Button></div>
  </Auth>;
}

export const entryScreens = [
  { id: "auth-login", title: "Sign in", category: "Auth", render: () => <Login /> },
  { id: "auth-login-split", title: "Sign in · split", category: "Auth", render: () => <LoginSplit /> },
  { id: "auth-signup", title: "Sign up", category: "Auth", render: () => <Signup /> },
  { id: "auth-magic", title: "Magic link sent", category: "Auth", render: () => <Magic /> },
  { id: "auth-2fa", title: "Two-step verification", category: "Auth", render: () => <TwoFactor /> },
  { id: "auth-reset", title: "Reset password", category: "Auth", render: () => <Reset /> },
  { id: "auth-newpass", title: "New password", category: "Auth", render: () => <NewPassword /> },
  { id: "auth-invite", title: "Accept invite", category: "Auth", render: () => <Invite /> },
  { id: "auth-sso", title: "SSO sign in", category: "Auth", render: () => <SsoPick /> },
  { id: "auth-verify", title: "Verify email", category: "Auth", render: () => <Verify /> },
  { id: "auth-locked", title: "Account locked", category: "Auth", render: () => <Locked /> },
  { id: "onb-welcome", title: "Onboarding · role", category: "Onboarding", render: () => <Welcome /> },
  { id: "onb-workspace", title: "Onboarding · workspace", category: "Onboarding", render: () => <Workspace /> },
  { id: "onb-import", title: "Onboarding · import", category: "Onboarding", render: () => <Import /> },
  { id: "onb-team", title: "Onboarding · invite team", category: "Onboarding", render: () => <Team /> },
  { id: "onb-tools", title: "Onboarding · connect tools", category: "Onboarding", render: () => <Tools /> },
  { id: "onb-checklist", title: "Setup checklist", category: "Onboarding", render: () => <Checklist /> },
  { id: "onb-trial", title: "Trial ending", category: "Onboarding", render: () => <Trial /> },
];
void [IconUpload, SegmentBar];
