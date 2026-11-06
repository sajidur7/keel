import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Checkbox } from "./checkbox";
import { IconChevronRight, IconFolder, IconFile } from "./icons";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/*
  Tree — hierarchical data (folders, org units, permission scopes, categories).
  ARIA tree pattern: ↑/↓ move, → opens or moves to the first child, ← closes or moves
  to the parent, Home/End, Enter/Space selects (or toggles the checkbox).
*/
export type TreeNode = {
  id: string;
  label: ReactNode;
  /** Plain text for type-ahead and aria. */
  text?: string;
  icon?: ReactNode;
  meta?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  /** Children will load later — shows a spinner when expanded with no children. */
  loading?: boolean;
};

type Flat = { node: TreeNode; depth: number; parent: string | null };

function flatten(nodes: TreeNode[], open: Set<string>, depth = 0, parent: string | null = null, out: Flat[] = []) {
  for (const n of nodes) {
    out.push({ node: n, depth, parent });
    if (n.children && open.has(n.id)) flatten(n.children, open, depth + 1, n.id, out);
  }
  return out;
}
function descendants(n: TreeNode): string[] {
  return (n.children ?? []).flatMap((c) => [c.id, ...descendants(c)]);
}

export type TreeProps = {
  data: TreeNode[];
  /** Single selection (highlighted row). */
  selected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Checkbox mode: parents show indeterminate when some children are checked. */
  checkable?: boolean;
  checked?: Set<string>;
  onCheckedChange?: (ids: Set<string>) => void;
  defaultExpanded?: string[];
  expanded?: Set<string>;
  onExpandedChange?: (ids: Set<string>) => void;
  /** Show folder/file icons when a node has no icon. */
  showIcons?: boolean;
  "aria-label": string;
  className?: string;
};

export function Tree({
  data, selected, onSelect, checkable, checked: checkedProp, onCheckedChange, defaultExpanded = [], expanded: expProp,
  onExpandedChange, showIcons = true, className, ...aria
}: TreeProps) {
  const [innerExp, setInnerExp] = useState(() => new Set(defaultExpanded));
  const [innerChecked, setInnerChecked] = useState<Set<string>>(new Set());
  const [focus, setFocus] = useState<string | null>(null);
  const ref = useRef<HTMLUListElement>(null);
  const open = expProp ?? innerExp;
  const setOpen = (s: Set<string>) => (onExpandedChange ? onExpandedChange(s) : setInnerExp(s));
  const checked = checkedProp ?? innerChecked;
  const setChecked = (s: Set<string>) => (onCheckedChange ? onCheckedChange(s) : setInnerChecked(s));

  const rows = useMemo(() => flatten(data, open), [data, open]);
  const focusId = focus ?? rows[0]?.node.id;

  const stateOf = (n: TreeNode): boolean | "indeterminate" => {
    const kids = descendants(n);
    if (!kids.length) return checked.has(n.id);
    const leaf = kids.filter((id) => checked.has(id)).length;
    return leaf === 0 ? false : leaf === kids.length ? true : "indeterminate";
  };
  const toggleCheck = (n: TreeNode) => {
    const next = new Set(checked);
    const ids = [n.id, ...descendants(n)];
    const on = stateOf(n) !== true;
    ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
    setChecked(next);
  };
  const toggleOpen = (id: string) => {
    const next = new Set(open);
    if (next.has(id)) next.delete(id); else next.add(id);
    setOpen(next);
  };
  const move = (id: string | undefined) => {
    if (!id) return;
    setFocus(id);
    requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus());
  };

  const onKey = (e: KeyboardEvent, r: Flat, i: number) => {
    const n = r.node;
    const hasKids = Boolean(n.children?.length || n.loading);
    if (e.key === "ArrowDown") { e.preventDefault(); move(rows[i + 1]?.node.id); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(rows[i - 1]?.node.id); }
    else if (e.key === "Home") { e.preventDefault(); move(rows[0]?.node.id); }
    else if (e.key === "End") { e.preventDefault(); move(rows[rows.length - 1]?.node.id); }
    else if (e.key === "ArrowRight") { e.preventDefault(); if (hasKids && !open.has(n.id)) toggleOpen(n.id); else if (hasKids) move(rows[i + 1]?.node.id); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); if (open.has(n.id)) toggleOpen(n.id); else move(r.parent ?? undefined); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (n.disabled) return; if (checkable) toggleCheck(n); else onSelect?.(n.id, n); }
  };

  return (
    <ul ref={ref} role="tree" aria-multiselectable={checkable || undefined} className={cn("flex flex-col text-small", className)} {...aria}>
      {rows.map((r, i) => {
        const n = r.node;
        const hasKids = Boolean(n.children?.length || n.loading);
        const isOpen = open.has(n.id);
        const isSel = selected === n.id;
        const cstate = checkable ? stateOf(n) : undefined;
        return (
          <li
            key={n.id}
            role="treeitem"
            data-id={n.id}
            aria-level={r.depth + 1}
            aria-expanded={hasKids ? isOpen : undefined}
            aria-selected={checkable ? cstate === true : isSel}
            aria-disabled={n.disabled || undefined}
            tabIndex={focusId === n.id ? 0 : -1}
            onFocus={() => setFocus(n.id)}
            onKeyDown={(e) => onKey(e, r, i)}
            onClick={() => { if (n.disabled) return; setFocus(n.id); if (!checkable) onSelect?.(n.id, n); }}
            className={cn(
              "group/tree flex h-7 cursor-default items-center gap-1.5 rounded-sm pr-2 outline-none select-none",
              "hover:bg-hover focus-visible:shadow-[inset_0_0_0_1.5px_var(--ring)]",
              isSel && !checkable && "bg-selected text-foreground",
              n.disabled && "opacity-45",
            )}
            style={{ paddingLeft: 4 + r.depth * 16 }}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={(e) => { e.stopPropagation(); if (hasKids) toggleOpen(n.id); }}
              className={cn("inline-flex size-4 shrink-0 items-center justify-center rounded-xs text-icon hover:text-foreground", !hasKids && "invisible")}
            >
              <IconChevronRight size={12} className={cn("transition-transform duration-fast", isOpen && "rotate-90")} />
            </button>
            {checkable && (
              <span className="flex" onClick={(e) => e.stopPropagation()}>
                <Checkbox tabIndex={-1} aria-hidden checked={cstate} disabled={n.disabled} onCheckedChange={() => toggleCheck(n)} />
              </span>
            )}
            {(n.icon || showIcons) && (
              <span className="inline-flex shrink-0 text-icon [&_svg]:size-3.5">{n.icon ?? (hasKids ? <IconFolder /> : <IconFile />)}</span>
            )}
            <span className="min-w-0 flex-1 truncate text-soft group-aria-selected/tree:text-foreground">{n.label}</span>
            {n.meta && <span className="tabular shrink-0 text-caption text-faint">{n.meta}</span>}
            {hasKids && isOpen && n.loading && !n.children?.length && <Spinner size={12} label="Loading" />}
          </li>
        );
      })}
    </ul>
  );
}
