import { Fragment, useState } from "react";
import {
  Avatar, Button, Checkbox, DataTable, Dialog, DialogContent, DropdownMenuItem, DropdownMenuSeparator, FilterMenu,
  FormField, IconCheck, IconMail, IconMinus, IconShield, IconTrash, IconUserPlus, Page, SearchInput, Select,
  StatusPill, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, Tabs, TabsContent,
  TabsList, TabsTrigger, Tag, Combobox, ConfirmDialog, useToast, type Column,
} from "@keel/components";
import { people } from "./data";
import { AdminShell, type Nav } from "./shell";

/*
  Template: users and roles management. Members table with inline role change,
  invite dialog, and a permissions matrix for roles.
*/
type Person = (typeof people)[number];
const ROLES = ["Owner", "Admin", "Editor", "Viewer"] as const;
const roleTone = { Owner: "violet", Admin: "blue", Editor: "teal", Viewer: "neutral" } as const;
const PERMS: { area: string; actions: { label: string; roles: (typeof ROLES)[number][] }[] }[] = [
  { area: "Customers", actions: [{ label: "View customers", roles: ["Owner", "Admin", "Editor", "Viewer"] }, { label: "Create and edit", roles: ["Owner", "Admin", "Editor"] }, { label: "Delete", roles: ["Owner", "Admin"] }] },
  { area: "Billing", actions: [{ label: "View invoices", roles: ["Owner", "Admin", "Editor", "Viewer"] }, { label: "Send invoices", roles: ["Owner", "Admin", "Editor"] }, { label: "Refund and void", roles: ["Owner", "Admin"] }, { label: "Change plan", roles: ["Owner"] }] },
  { area: "Workspace", actions: [{ label: "Invite members", roles: ["Owner", "Admin"] }, { label: "Change roles", roles: ["Owner", "Admin"] }, { label: "Manage API keys", roles: ["Owner", "Admin"] }, { label: "Delete workspace", roles: ["Owner"] }] },
];

export function MembersTemplate({ go }: { go?: (to: Nav) => void }) {
  const toast = useToast();
  const [list, setList] = useState<Person[]>(people);
  const [q, setQ] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [invite, setInvite] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [inviteRole, setInviteRole] = useState("Editor");
  const [removing, setRemoving] = useState<Person | null>(null);
  const rows = list.filter((p) => (!q || `${p.name} ${p.email}`.toLowerCase().includes(q.toLowerCase())) && (!roles.length || roles.includes(p.role)));

  const columns: Column<Person>[] = [
    { id: "name", header: "Member", required: true, sortable: true, value: (p) => p.name, cell: (p) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar name={p.name} status={p.status} />
        <span className="flex min-w-0 flex-col"><span className="truncate">{p.name}</span><span className="truncate text-caption text-subtle">{p.email}</span></span>
      </span>
    ) },
    { id: "role", header: "Role", sortable: true, value: (p) => ROLES.indexOf(p.role as never), cell: (p) =>
      p.role === "Owner" ? <Tag tone="violet">Owner</Tag> : (
        <Select size="sm" aria-label={`Role for ${p.name}`} value={p.role} className="w-28"
          onValueChange={(r) => { setList(list.map((x) => (x.email === p.email ? { ...x, role: r } : x))); toast({ title: `${p.name.split(" ")[0]} is now ${r === "Admin" ? "an" : "a"} ${r}` }); }}
          options={ROLES.slice(1).map((r) => ({ value: r, label: r }))} />
      ) },
    { id: "team", header: "Team", sortable: true, value: (p) => p.team, showFrom: "md", cell: (p) => <span className="text-soft">{p.team}</span> },
    { id: "active", header: "Last active", showFrom: "sm", value: (p) => p.lastActive, cell: (p) => p.lastActive === "Invited" ? <StatusPill status="pending" size="sm">Invited</StatusPill> : <span className="text-soft">{p.lastActive}</span> },
    { id: "2fa", header: "2FA", showFrom: "lg", cell: (p) => p.lastActive === "Invited" ? <span className="text-faint">—</span> : <span className="flex items-center gap-1.5 text-caption text-soft"><IconShield size={14} className="text-success" />On</span> },
  ];

  return (
    <AdminShell active="members" go={go} header={{ title: "Members & roles", status: <span className="tabular text-caption text-subtle">{list.length} of 200 seats</span>, actions: <Button size="sm" variant="primary" leading={<IconUserPlus />} onClick={() => setInvite(true)}>Invite</Button> }}>
      <Page>
        <Tabs defaultValue="members">
          <TabsList className="mb-2 border-b border-border">
            <TabsTrigger value="members" count={list.length}>Members</TabsTrigger>
            <TabsTrigger value="roles" count={ROLES.length}>Roles</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <DataTable
              data={rows}
              columns={columns}
              getRowId={(p) => p.email}
              selectable
              caption="Members"
              toolbar={<><SearchInput size="sm" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shellClassName="w-full sm:w-64" placeholder="Search members" /><FilterMenu mode="multi" label="Role" value={roles} onChange={setRoles} options={ROLES.map((r) => ({ value: r, label: r, count: list.filter((p) => p.role === r).length }))} /></>}
              bulkActions={(sel, clear) => <><Button size="sm" leading={<IconMail />} onClick={clear}>Resend invite</Button><Button size="sm" variant="danger-ghost" leading={<IconTrash />} disabled={sel.some((s) => s.role === "Owner")} onClick={() => { setList(list.filter((p) => !sel.includes(p))); clear(); toast({ title: `${sel.length} removed` }); }}>Remove</Button></>}
              rowActions={(p) => (
                <>
                  <DropdownMenuItem icon={<IconMail />}>{p.lastActive === "Invited" ? "Resend invite" : "Email"}</DropdownMenuItem>
                  <DropdownMenuItem>Reset two-factor</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem icon={<IconTrash />} destructive disabled={p.role === "Owner"} onSelect={() => setRemoving(p)}>Remove from workspace</DropdownMenuItem>
                </>
              )}
            />
          </TabsContent>
          <TabsContent value="roles" className="pt-2">
            <TableContainer className="rounded-lg shadow-card">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <tr>
                    <TableHead className="pl-4">Permission</TableHead>
                    {ROLES.map((r) => <TableHead key={r} align="center" className="w-24"><Tag size="sm" tone={roleTone[r]}>{r}</Tag></TableHead>)}
                  </tr>
                </TableHeader>
                <TableBody>
                  {PERMS.map((g) => (
                    <Fragment key={g.area}>
                      <tr><td colSpan={5} className="border-b border-border bg-surface px-4 pt-4 pb-2"><span className="eyebrow">{g.area}</span></td></tr>
                      {g.actions.map((a) => (
                        <TableRow key={a.label}>
                          <TableCell className="h-10 pl-4 text-soft">{a.label}</TableCell>
                          {ROLES.map((r) => (
                            <TableCell key={r} align="center">
                              {a.roles.includes(r) ? <IconCheck size={14} className="inline text-foreground" aria-label="Allowed" /> : <IconMinus size={14} className="inline text-faint" aria-label="Not allowed" />}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabsContent>
        </Tabs>
      </Page>

      <Dialog open={invite} onOpenChange={setInvite}>
        <DialogContent title="Invite members" description="They'll get an email with a link to join Fernhill." footer={
          <><Button variant="ghost" onClick={() => setInvite(false)}>Cancel</Button><Button variant="primary" disabled={!emails.length} onClick={() => { setInvite(false); toast({ title: `${emails.length} ${emails.length === 1 ? "invite" : "invites"} sent`, tone: "success" }); setEmails([]); }}>Send {emails.length || ""} {emails.length === 1 ? "invite" : "invites"}</Button></>
        }>
          <div className="flex flex-col gap-4">
            <FormField label="Email addresses" help="Type an address and press Enter">
              <Combobox multiple value={emails} onValueChange={setEmails} options={emails.map((e) => ({ value: e, label: e }))} placeholder="name@fernhill.io" searchPlaceholder="name@fernhill.io" emptyLabel="Type an email address" onCreate={(v) => setEmails([...emails, v])} />
            </FormField>
            <FormField label="Role">
              <Select value={inviteRole} onValueChange={setInviteRole} options={[
                { value: "Admin", label: "Admin", description: "Everything except billing plan and deleting the workspace" },
                { value: "Editor", label: "Editor", description: "Create and send; can't delete or manage members" },
                { value: "Viewer", label: "Viewer", description: "Read-only" },
              ]} />
            </FormField>
            <Checkbox label="Require two-factor on first sign-in" defaultChecked />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={Boolean(removing)} onOpenChange={(o) => !o && setRemoving(null)} tone="danger" title={`Remove ${removing?.name}?`} description="They'll lose access right away. Their past activity stays in the audit log." confirmLabel="Remove member"
        onConfirm={() => { setList(list.filter((p) => p !== removing)); toast({ title: `${removing?.name} removed` }); setRemoving(null); }} />
    </AdminShell>
  );
}
