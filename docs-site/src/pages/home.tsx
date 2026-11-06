import {
  Avatar, Button, IconArrowRight, Kbd, SegmentBar, Sparkline, StatusPill, Tag, Table, TableBody, TableCell,
  TableContainer, TableHead, TableHeader, TableRow, FilterMenu, SearchInput,
} from "@keel/components";
import { customerLabel, customerTone, customers, fmtMoney, planTone } from "@keel/templates/data";
import { useState } from "react";
import { SectionTitle } from "../docs/doc-ui";
import { pages, templates } from "../registry";

const principles = [
  ["Density over decoration", "Tables and lists are the work. 40px rows, 13px text, nothing between the user and the data."],
  ["Hierarchy without boxes", "Size, weight and four text greys do the grouping. Hairlines and whitespace replace most cards."],
  ["One bright button", "Primary actions are white in dark mode, near-black in light. Color is kept for status and categories."],
  ["Every state designed", "Hover, focus-visible, active, disabled, loading, empty, error and read-only — on every control."],
  ["Keyboard first", "⌘K everywhere, visible focus rings, shortcuts shown where actions live."],
  ["320px to wide", "The sidebar becomes a drawer, secondary columns step away, tables scroll inside themselves."],
];

export function Home() {
  const [plan, setPlan] = useState<string[]>([]);
  const rows = customers.filter((c) => !plan.length || plan.includes(c.plan)).slice(0, 5);
  const comps = pages.filter((p) => p.section === "Components").length;
  return (
    <div className="flex flex-col gap-14 pb-24">
      <section className="flex flex-col gap-5 pt-4">
        <span className="eyebrow">Keel · v0.1</span>
        <h1 className="max-w-[18ch] text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] sm:text-[36px]">A calm, dense design system for admin interfaces.</h1>
        <p className="max-w-[62ch] text-body text-soft">Tokens, {comps} documented components and {templates.length} real admin templates — React, TypeScript, Tailwind v4 and Radix. Dark first, with a complete light theme from the same tokens, and a Figma library on the same variables.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" trailing={<IconArrowRight />} asChild><a href="#/docs/getting-started">Get started</a></Button>
          <Button asChild><a href="#/templates/customers">See a template</a></Button>
          <span className="flex items-center gap-1.5 pl-1 text-small text-subtle">or press <Kbd>⌘K</Kbd></span>
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-label="Sample">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput size="sm" shellClassName="w-full sm:w-56" placeholder="Search customers" />
          <FilterMenu mode="multi" label="Plan" value={plan} onChange={setPlan} options={["Starter", "Growth", "Scale", "Enterprise"].map((p) => ({ value: p, label: p }))} />
        </div>
        <TableContainer className="rounded-lg shadow-card">
          <Table>
            <TableHeader>
              <tr>
                <TableHead className="pl-4">Customer</TableHead><TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Plan</TableHead><TableHead className="hidden lg:table-cell">Health</TableHead>
                <TableHead className="hidden sm:table-cell">Usage</TableHead><TableHead align="right" className="pr-4">MRR</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id} className="last:[&>td]:border-b-0">
                  <TableCell className="h-11 pl-4"><span className="flex items-center gap-2.5"><Avatar name={c.name} shape="square" /><span className="truncate">{c.name}</span></span></TableCell>
                  <TableCell><StatusPill status={customerTone[c.status]}>{customerLabel[c.status]}</StatusPill></TableCell>
                  <TableCell className="hidden md:table-cell"><Tag tone={planTone[c.plan]}>{c.plan}</Tag></TableCell>
                  <TableCell className="hidden lg:table-cell"><SegmentBar value={c.health} tone="auto" className="w-24" label="Health" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Sparkline values={c.trend} tone={c.health < 40 ? "danger" : "data"} /></TableCell>
                  <TableCell align="right" className="pr-4">{fmtMoney(c.mrr)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>

      <section className="flex flex-col gap-5">
        <SectionTitle>Principles</SectionTitle>
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map(([t, d], i) => (
            <div key={t} className="flex flex-col gap-1.5">
              <span className="tabular font-mono text-caption text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-body font-medium">{t}</span>
              <span className="text-small text-subtle">{d}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionTitle>Templates</SectionTitle>
        <div className="grid gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <a key={t.id} href={`#/templates/${t.id}`} className="group flex flex-col gap-1 bg-background p-4 outline-none hover:bg-surface focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]">
              <span className="flex items-center justify-between text-small font-medium">{t.title}<IconArrowRight size={14} className="text-faint transition-transform duration-fast group-hover:translate-x-0.5" /></span>
              <span className="line-clamp-2 text-caption text-subtle">{t.description}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
