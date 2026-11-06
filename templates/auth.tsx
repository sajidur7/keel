import { useState } from "react";
import { Alert, Button, Checkbox, Divider, FormField, IconArrowLeft, IconMail, Input, PasswordInput } from "@keel/components";

/*
  Template: sign in and forgot password. Centered, single column, no hero art.
  The only decoration is the workspace mark.
*/
function Frame({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-[360px] flex-col gap-7">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-card text-foreground shadow-raised" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3.5 4.5h9M5 8h6M6.5 11.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </span>
          {children}
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 pb-6 text-caption text-faint">
        {footer ?? <><span>© 2026 Fernhill</span><a href="#" className="hover:text-soft">Privacy</a><a href="#" className="hover:text-soft">Terms</a><a href="#" className="hover:text-soft">Status</a></>}
      </footer>
    </div>
  );
}

export function LoginTemplate({ onForgot }: { onForgot?: () => void }) {
  const [email, setEmail] = useState("nadia@fernhill.io");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  return (
    <Frame>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-display font-semibold">Sign in to Fernhill</h1>
        <p className="text-small text-subtle">Use your work email.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button size="lg" className="w-full">Continue with SSO</Button>
        <Button size="lg" className="w-full">Continue with Google</Button>
      </div>
      <Divider label="Or" />
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fe: typeof fieldErr = {};
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fe.email = "Enter a valid email address";
          if (!password) fe.password = "Enter your password";
          setFieldErr(fe);
          setError(null);
          if (Object.keys(fe).length) return;
          setLoading(true);
          await new Promise((r) => setTimeout(r, 800));
          setLoading(false);
          setError("That email and password don't match. Try again or reset your password.");
        }}
      >
        {error && <Alert tone="danger">{error}</Alert>}
        <FormField label="Email" error={fieldErr.email}>
          <Input size="lg" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <FormField label="Password" error={fieldErr.password} labelAside={<Button variant="link" size="xs" onClick={onForgot} className="text-caption text-subtle">Forgot password?</Button>}>
          <PasswordInput size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>
        <Checkbox label="Keep me signed in for 7 days" defaultChecked />
        <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" loading={loading}>Sign in</Button>
      </form>
      <p className="text-small text-subtle">New to Fernhill? <a href="#" className="text-foreground underline decoration-line-strong underline-offset-2 hover:decoration-foreground">Ask your admin for an invite</a></p>
    </Frame>
  );
}

export function ForgotPasswordTemplate({ onBack }: { onBack?: () => void }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <Frame>
      {sent ? (
        <div className="flex flex-col gap-5">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-success-bg text-success"><IconMail /></span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-display font-semibold">Check your email</h1>
            <p className="text-small text-subtle">If an account exists for <span className="text-foreground">{email}</span>, you'll get a reset link within a few minutes. It expires in 30 minutes.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="lg" variant="secondary" className="w-full" onClick={() => setSent(false)}>Use a different email</Button>
            <Button size="lg" variant="ghost" className="w-full" leading={<IconArrowLeft />} onClick={onBack}>Back to sign in</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-display font-semibold">Reset your password</h1>
            <p className="text-small text-subtle">Enter the email you sign in with and we'll send you a link.</p>
          </div>
          <form noValidate className="flex flex-col gap-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Enter a valid email address");
            setErr(undefined); setLoading(true);
            await new Promise((r) => setTimeout(r, 700));
            setLoading(false); setSent(true);
          }}>
            <FormField label="Email" error={err}>
              <Input size="lg" type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            </FormField>
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>Send reset link</Button>
            <Button variant="ghost" size="lg" className="w-full" leading={<IconArrowLeft />} onClick={onBack}>Back to sign in</Button>
          </form>
        </>
      )}
    </Frame>
  );
}
