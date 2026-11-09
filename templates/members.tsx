import { useState } from "react";
import {
  Avatar, Button, DataTable, Dialog, DialogClose, DialogContent, DropdownMenuItem, DropdownMenuSeparator, Field, IconMail, IconPlus, IconTrash, IconUser, Page, PageHeading,
  SearchInput, Select, StatusDot, Tag, Text, Tokenizer, TreeList, Card, useToast, type Column, type TreeNode, type TypeaheadOption,
} from "@keel/components";
import { people } from "./data";
import { AdminShell, type Nav } from "./shell";

type Person = (typeof people)[number];
const ROLE_TONE = { Owner: "violet", Admin: "blue", Editor: "teal", Viewer: "gray" } as const;
const PERMS: TreeNode[] = [
  { id: "customers", label: "Customers", children: [{ id: "c.view", label: "View" }, { id: "c.edit", label: "Edit" }, { id: "c.delete", label: "Delete" }] },
  { id: "billing", label: "Billing", children: [{ id: "b.view", label: "View invoices" }, { id: "b.send", label: "Send invoices" }, { id: "b.refund", label: "Issue refunds" }] },
  { id: "workspace", label: "Workspace", children: [{ id: "w.members", label: "Manage members" }, { id: "w.api", label: "API keys" }] },
];

export function MembersTemplate({ go }: { go?: (to: Nav) => void }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [invite, setInvite] = useState(false);
  const [emails, setEmails] = useState<TypeaheadOption[]>([]);
  const [perms, setPerms] = useState(new Set(["c.view", "c.edit", "b.view", "b.send"]));
  const rows = people.filter((p) => `${p.name} ${p.email} ${p.team}`.toLowerCase().includes(q.toLowerCase()));
  const columns: Column<Person>[] = [
    { id: "name", header: "Member", required: true, sortable: true, value: (p) => p.name, cell: (p) => <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={p.name} status={p.status} /><span style={{ display: "flex", flexDirection: "column" }}><Text weight="medium">{p.name}</Text><Text variant="caption">{p.email}</Text></span></span> },
    { id: "role", header: "Role", sortable: true, value: (p) => p.role, filterOptions: ["Owner", "Admin", "Editor", "Viewer"].map((r) => ({ value: r, label: r })), cell: (p) => <Tag tone={ROLE_TONE[p.role as keyof typeof ROLE_TONE]}>{p.role}</Tag> },
    { id: "team", header: "Team", sortable: true, value: (p) => p.team, showFrom: "md", cell: (p) => p.team },
    { id: "active", header: "Last active", showFrom: "sm", value: (p) => p.lastActive, cell: (p) => <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{p.lastActive === "Now" && <StatusDot tone="success" pulse />}<Text tone={p.lastActive === "Invited" ? "warning" : "muted"}>{p.lastActive}</Text></span> },
  ];
  return (
    <AdminShell active="members" go={go} header={{ title: "Members & roles", actions: <Button size="sm" variant="primary" leading={<IconPlus />} onClick={() => setInvite(true)}>Invite</Button> }}>
      <Page>
        <PageHeading title="Members & roles" description={`${people.length} people in Fernhill. Roles decide what each person can see and change.`} size="sm" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 20, alignItems: "start" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <DataTable data={rows} columns={columns} getRowId={(p) => p.email} selectable caption="Members"
              toolbar={<SearchInput size="sm" placeholder="Search members" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240 }} />}
              rowActions={(p) => <><DropdownMenuItem icon={<IconUser />}>Change role</DropdownMenuItem><DropdownMenuItem icon={<IconMail />}>Resend invite</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem icon={<IconTrash />} destructive onSelect={() => toast({ title: `${p.name} removed` })}>Remove</DropdownMenuItem></>}
              bulkActions={(sel, clear) => <Button size="sm" variant="danger" leading={<IconTrash />} onClick={() => { toast({ title: `${sel.length} removed` }); clear(); }}>Remove</Button>} />
          </div>
          <Card padding="lg">
            <Text variant="title">Editor role</Text>
            <Text tone="muted" style={{ marginBottom: 12 }}>What editors can do. Changes apply to {people.filter((p) => p.role === "Editor").length} people.</Text>
            <TreeList aria-label="Editor permissions" data={PERMS} checkable checked={perms} onCheckedChange={setPerms} defaultExpanded={["customers", "billing", "workspace"]} />
          </Card>
        </div>
      </Page>
      <Dialog open={invite} onOpenChange={setInvite}>
        <DialogContent title="Invite teammates" description="They'll get an email to join Fernhill."
          footer={<><DialogClose asChild><Button>Cancel</Button></DialogClose><Button variant="primary" disabled={!emails.length} onClick={() => { setInvite(false); toast({ title: `${emails.length} invite${emails.length > 1 ? "s" : ""} sent`, tone: "success" }); setEmails([]); }}>Send invites</Button></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Emails" description="Press Enter after each address."><Tokenizer source={[]} value={emails} onValueChange={setEmails} allowCreate placeholder="name@company.com" /></Field>
            <Field label="Role"><Select defaultValue="Editor" options={["Admin", "Editor", "Viewer"].map((r) => ({ value: r, label: r }))} /></Field>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
