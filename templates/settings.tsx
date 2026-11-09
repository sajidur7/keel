import { useState } from "react";
import {
  Alert, Avatar, Banner, Button, Card, CheckboxList, ColorPicker, Field, FileInput, FormSection, IconKey, Input, Page, PageHeading, RadioList, Select, Switch, TabList, Text,
  TextArea, useToast, CopyButton, Code, AlertDialog, InputGroup,
} from "@keel/components";
import { AdminShell, type Nav } from "./shell";

export function SettingsTemplate({ go }: { go?: (to: Nav) => void }) {
  const toast = useToast();
  const [dirty, setDirty] = useState(false);
  const [brand, setBrand] = useState("#3a5cf0");
  const [del, setDel] = useState(false);
  const mark = () => setDirty(true);
  const general = (
    <div>
      {dirty && <Banner tone="info" title="Unsaved changes" action={<><Button size="sm" variant="ghost" onClick={() => setDirty(false)}>Discard</Button><Button size="sm" variant="primary" onClick={() => { setDirty(false); toast({ title: "Settings saved", tone: "success" }); }}>Save</Button></>} xstyle={undefined} style={{ marginBottom: 8 }}>Save or discard before you leave.</Banner>}
      <FormSection title="Workspace" description="Shown on invoices and emails.">
        <Field label="Workspace name" required><Input defaultValue="Fernhill" onChange={mark} /></Field>
        <Field label="Workspace URL"><InputGroup start="app.keel.dev/" ><Input defaultValue="fernhill" onChange={mark} /></InputGroup></Field>
        <Field label="Logo" description="SVG or PNG, at least 256px."><FileInput compact accept="image/*" onFiles={mark} label="Upload logo" /></Field>
        <Field label="Brand color"><div style={{ width: 220 }}><ColorPicker value={brand} onChange={(v) => { setBrand(v); mark(); }} /></div></Field>
      </FormSection>
      <FormSection title="Regional" description="Formats for dates, money and time.">
        <Field label="Default currency"><Select defaultValue="usd" onValueChange={mark} options={[{ value: "usd", label: "USD" }, { value: "eur", label: "EUR" }, { value: "bdt", label: "BDT" }]} /></Field>
        <Field label="Week starts on"><RadioList orientation="horizontal" defaultValue="mon" onValueChange={mark} options={[{ value: "mon", label: "Monday" }, { value: "sun", label: "Sunday" }]} /></Field>
      </FormSection>
      <FormSection title="Danger zone" description="Irreversible actions.">
        <Alert tone="danger" title="Delete workspace" action={<Button size="sm" variant="danger" onClick={() => setDel(true)}>Delete workspace</Button>}>Removes every customer, invoice and member. Exports stay in your email for 30 days.</Alert>
      </FormSection>
    </div>
  );
  const notifications = (
    <div>
      <FormSection title="Email" description="Where we send alerts.">
        <Switch labelPosition="left" label="Daily digest" description="Every morning at 9:00" defaultChecked />
        <Switch labelPosition="left" label="Failed payments" description="As they happen" defaultChecked />
        <Switch labelPosition="left" label="Product updates" description="About once a month" />
      </FormSection>
      <FormSection title="Slack"><CheckboxList label="Post to #billing when" defaultValue={["paid", "failed"]} options={[{ value: "paid", label: "An invoice is paid" }, { value: "failed", label: "A payment fails" }, { value: "churn", label: "A customer cancels" }]} /></FormSection>
    </div>
  );
  const api = (
    <div>
      <FormSection title="API keys" description="Use these from your server. Never in a browser.">
        <Card variant="sunken"><div style={{ display: "flex", alignItems: "center", gap: 10 }}><IconKey size={16} /><Code>sk_live_51Hc…9Tq2</Code><CopyButton value="sk_live_51Hc9Tq2" size="xs" /><Text variant="caption" style={{ marginLeft: "auto" }}>Created Oct 2 by Leah Tran</Text></div></Card>
        <div><Button>Roll key</Button></div>
      </FormSection>
      <FormSection title="Webhooks"><Field label="Endpoint URL"><Input defaultValue="https://api.fernhill.io/hooks/keel" /></Field><Field label="Signing secret" description="Verify the Keel-Signature header."><TextArea readOnly rows={2} defaultValue="whsec_3f9a7d…" /></Field></FormSection>
    </div>
  );
  return (
    <AdminShell active="settings" go={go} header={{ title: "Settings" }}>
      <Page width="wide">
        <PageHeading title="Settings" description="Workspace, notifications and developer settings." size="sm" actions={<Avatar name="Fernhill" shape="square" size="lg" />} />
        <TabList items={[{ value: "general", label: "General", content: general }, { value: "notifications", label: "Notifications", content: notifications }, { value: "api", label: "API & webhooks", content: api }]} />
      </Page>
      <AlertDialog open={del} onOpenChange={setDel} title="Delete Fernhill?" description="Type the workspace name to confirm. This can't be undone." actionLabel="Delete workspace" onAction={() => {}}><Input placeholder="Fernhill" /></AlertDialog>
    </AdminShell>
  );
}
