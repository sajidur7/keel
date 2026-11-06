import { useState } from "react";
import {
  Alert, Avatar, Button, Code, CodeBlock, ConfirmDialog, FileUpload, FormField, FormSection, Input, Page,
  Select, Switch, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, useToast, Tag, IconKey, List, ListItem,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, IconButton, IconMoreHorizontal, IconTrash,
  Progress, StatusPill, IconPlus,
} from "@keel/components";
import { AdminShell, type Nav } from "./shell";

/*
  Template: settings page. Sections use FormSection (title column + fields, hairlines between,
  no cards). Each tab saves on its own; a sticky bar appears only when there are unsaved changes.
*/
export function SettingsTemplate({ go }: { go?: (to: Nav) => void }) {
  const toast = useToast();
  const [tab, setTab] = useState("general");
  const [name, setName] = useState("Fernhill Operations");
  const [subdomain, setSubdomain] = useState("fernhill");
  const [tz, setTz] = useState("Asia/Dhaka");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const touch = <T,>(set: (v: T) => void) => (v: T) => { set(v); setDirty(true); };

  return (
    <AdminShell
      active="settings"
      go={go}
      header={{
        title: "Settings",
        tabs: (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
          </Tabs>
        ),
      }}
    >
      <Page width="wide" className="pb-24">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value="general" className="flex flex-col gap-8">
            <FormSection title="Workspace" description="Shown on invoices, emails and the sign-in page.">
              <FormField label="Workspace name" required error={name.trim() ? undefined : "Enter a workspace name"}>
                <Input value={name} onChange={(e) => touch(setName)(e.target.value)} />
              </FormField>
              <FormField label="Subdomain" help="Changing it breaks old links to this workspace.">
                <Input value={subdomain} onChange={(e) => touch(setSubdomain)(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} suffix=".fernhill.app" />
              </FormField>
              <FormField label="Logo" help="Square PNG or SVG, at least 128px.">
                <div className="flex items-center gap-3">
                  <Avatar name={name} shape="square" size="xl" />
                  <FileUpload compact accept="image/png,image/svg+xml" multiple={false} onFiles={() => { setDirty(true); toast({ title: "Logo uploaded" }); }} className="flex-1" />
                </div>
              </FormField>
            </FormSection>
            <FormSection title="Regional" description="Used for dates, times and reports.">
              <FormField label="Time zone">
                <Select value={tz} onValueChange={touch(setTz)} options={[{ value: "Asia/Dhaka", label: "Dhaka (UTC+6)" }, { value: "Asia/Singapore", label: "Singapore (UTC+8)" }, { value: "Europe/Berlin", label: "Berlin (UTC+1)" }, { value: "America/Toronto", label: "Toronto (UTC−5)" }]} />
              </FormField>
              <FormField label="Week starts on">
                <Select defaultValue="mon" onValueChange={() => setDirty(true)} options={[{ value: "sat", label: "Saturday" }, { value: "sun", label: "Sunday" }, { value: "mon", label: "Monday" }]} />
              </FormField>
            </FormSection>
            <FormSection title="Notifications" description="Email to workspace admins. Changes apply immediately.">
              <Switch labelPosition="left" label="Failed payments" description="As soon as a charge fails" defaultChecked onCheckedChange={(v) => toast({ title: v ? "Failed payment emails on" : "Failed payment emails off" })} />
              <Switch labelPosition="left" label="New sign-ups" description="When a customer starts a trial" defaultChecked />
              <Switch labelPosition="left" label="Weekly summary" description="Mondays at 9:00" />
            </FormSection>
            <FormSection title="Danger zone" description="These actions can't be undone.">
              <div className="flex flex-col gap-3 rounded-lg border border-danger-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5"><span className="text-small font-medium">Delete workspace</span><span className="text-caption text-subtle">Removes all customers, invoices and members.</span></div>
                  <ConfirmDialog trigger={<Button variant="danger" size="sm">Delete workspace</Button>} tone="danger" title="Delete Fernhill Operations?" description="All 12 customers, 128 invoices and 8 members will be removed permanently." confirmText={subdomain} confirmLabel="Delete workspace" onConfirm={() => toast({ title: "Demo — nothing was deleted" })} />
                </div>
              </div>
            </FormSection>
          </TabsContent>

          <TabsContent value="billing" className="flex flex-col gap-8">
            <FormSection title="Plan" description="Billed monthly on the 1st.">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2"><span className="text-title font-medium">Scale</span><Tag tone="blue">$49 / seat</Tag></div>
                <Button size="sm">Change plan</Button>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-caption"><span className="text-soft">Seats</span><span className="tabular text-subtle">140 of 200</span></div>
                <Progress value={140} max={200} aria-label="Seats used" />
              </div>
            </FormSection>
            <FormSection title="Payment method">
              <Alert tone="warning" action={<Button size="sm">Update card</Button>}>The Visa ending 4417 expires this month.</Alert>
            </FormSection>
            <FormSection title="Billing details">
              <FormField label="Legal name"><Input defaultValue="Fernhill Operations Ltd." onChange={() => setDirty(true)} /></FormField>
              <FormField label="Address"><Textarea rows={3} defaultValue={"House 12, Road 7\nGulshan 1, Dhaka 1212\nBangladesh"} onChange={() => setDirty(true)} /></FormField>
              <FormField label="Tax ID" optional><Input placeholder="BIN 000-000-000" onChange={() => setDirty(true)} /></FormField>
            </FormSection>
          </TabsContent>

          <TabsContent value="security" className="flex flex-col gap-8">
            <FormSection title="Authentication">
              <Switch labelPosition="left" label="Require two-factor authentication" description="For every member, on next sign-in" defaultChecked />
              <Switch labelPosition="left" label="Single sign-on (SAML)" description="Okta · fernhill.okta.com" defaultChecked />
              <FormField label="Session length"><Select defaultValue="7d" options={[{ value: "1d", label: "1 day" }, { value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }]} /></FormField>
            </FormSection>
            <FormSection title="Allowed domains" description="Only people with these email domains can join.">
              <div className="flex flex-wrap gap-1.5"><Tag onRemove={() => {}}>fernhill.io</Tag><Tag onRemove={() => {}}>fernhill.com.bd</Tag></div>
              <div className="flex gap-2"><Input placeholder="company.com" shellClassName="max-w-64" /><Button>Add</Button></div>
            </FormSection>
          </TabsContent>

          <TabsContent value="api" className="flex flex-col gap-8">
            <FormSection title="API keys" description="Keys act as the workspace. Keep them on your server.">
              <List>
                {[
                  { name: "Production", key: "sk_live_…8f2k", created: "Created Nov 5 by Leah Tran", status: "active" as const },
                  { name: "Staging", key: "sk_test_…q71a", created: "Created Aug 12 by Leah Tran", status: "active" as const },
                  { name: "Old import script", key: "sk_live_…3bd0", created: "Last used 94 days ago", status: "neutral" as const },
                ].map((k) => (
                  <ListItem key={k.key} leading={<IconKey className="text-icon" />} title={<span className="flex items-center gap-2">{k.name}<StatusPill size="sm" status={k.status}>{k.status === "active" ? "Active" : "Unused"}</StatusPill></span>} description={<span className="flex gap-2"><Code>{k.key}</Code>{k.created}</span>}
                    trailing={
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><IconButton label={`${k.name} key actions`} size="sm"><IconMoreHorizontal /></IconButton></DropdownMenuTrigger>
                        <DropdownMenuContent align="end"><DropdownMenuItem>Roll key</DropdownMenuItem><DropdownMenuItem icon={<IconTrash />} destructive>Revoke</DropdownMenuItem></DropdownMenuContent>
                      </DropdownMenu>
                    } />
                ))}
              </List>
              <Button className="self-start" leading={<IconPlus />}>Create key</Button>
            </FormSection>
            <FormSection title="Webhooks">
              <FormField label="Endpoint URL" error="The last 12 deliveries returned 503"><Input defaultValue="https://api.fernhill.io/hooks/billing" /></FormField>
              <FormField label="Signing secret" help="Verify the Fernhill-Signature header with this secret."><CodeBlock code="whsec_3f9a2c71e4b84d0a9c6e5b1f" /></FormField>
            </FormSection>
          </TabsContent>
        </Tabs>
      </Page>

      {dirty && (
        <div className="sticky bottom-0 z-(--z-sticky) border-t border-border bg-surface">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-3 py-2.5 sm:px-4 lg:px-6">
            <span className="text-small text-soft">You have unsaved changes</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setDirty(false)}>Discard</Button>
              <Button size="sm" variant="primary" loading={saving} disabled={!name.trim()} onClick={async () => { setSaving(true); await new Promise((r) => setTimeout(r, 700)); setSaving(false); setDirty(false); toast({ title: "Settings saved" }); }}>Save changes</Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
