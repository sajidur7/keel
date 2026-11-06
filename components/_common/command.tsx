import { Dialog as D } from "radix-ui";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { IconCorner, IconSearch } from "../_ui/icons";
import { cn } from "../lib/cn";
import { Kbd } from "../_ui/kbd";

/*
  Command palette (⌘K / Ctrl+K). A modal list of actions and destinations, grouped,
  filtered by a fuzzy-ish match on label + keywords. ↑/↓ moves, Enter runs, Esc closes.
  Implemented as an ARIA combobox: the input owns a listbox and tracks the active option.
*/
export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  /** Extra words that should match (synonyms, ids). */
  keywords?: string[];
  shortcut?: string;
  /** Right-aligned hint, e.g. "Page" or a record id. */
  hint?: ReactNode;
  onSelect: () => void;
};

function score(item: CommandItem, q: string) {
  if (!q) return 1;
  const hay = `${item.label} ${item.keywords?.join(" ") ?? ""} ${item.group ?? ""}`.toLowerCase();
  const query = q.toLowerCase().trim();
  if (hay.startsWith(query)) return 3;
  if (hay.includes(query)) return 2;
  // all characters in order
  let i = 0;
  for (const ch of hay) if (ch === query[i]) i++;
  return i === query.length ? 1 : 0;
}

export function useCommandShortcut(setOpen: (fn: (o: boolean) => boolean) => void, key = "k") {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen, key]);
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Search or jump to…",
  emptyLabel = "No results",
  footer = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyLabel?: string;
  footer?: boolean;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () =>
      items
        .map((it, idx) => ({ it, s: score(it, q), idx }))
        .filter((r) => r.s > 0)
        .sort((a, b) => (q ? b.s - a.s : 0) || a.idx - b.idx)
        .map((r) => r.it),
    [items, q],
  );
  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const r of results) {
      const g = r.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(r);
    }
    return [...map.entries()];
  }, [results]);
  const flat = groups.flatMap(([, list]) => list);

  useEffect(() => setActive(0), [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (it?: CommandItem) => {
    if (!it) return;
    onOpenChange(false);
    // let the dialog close before running (focus returns to the trigger first)
    setTimeout(it.onSelect, 0);
  };

  let index = -1;
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-(--z-modal) bg-overlay data-[state=open]:animate-[keel-fade-in_var(--duration-fast)_var(--ease-out)]" />
        <D.Content
          aria-label="Command palette"
          className={cn(
            "fixed top-[12dvh] left-1/2 z-(--z-modal) flex max-h-[min(520px,76dvh)] w-[calc(100vw-24px)] max-w-[600px] -translate-x-1/2 flex-col overflow-hidden",
            "rounded-xl bg-popover text-foreground shadow-overlay outline-none data-[state=open]:animate-[keel-pop-in_var(--duration-base)_var(--ease-out)]",
          )}
        >
          <D.Title className="sr-only">Command palette</D.Title>
          <D.Description className="sr-only">Type to search actions and pages. Use arrow keys to move and Enter to run.</D.Description>
          <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border px-4">
            <IconSearch className="text-icon" />
            <input
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={flat[active] ? `${listId}-${flat[active].id}` : undefined}
              aria-autocomplete="list"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className="h-full min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-faint"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
                if (e.key === "Home") { e.preventDefault(); setActive(0); }
                if (e.key === "End") { e.preventDefault(); setActive(flat.length - 1); }
                if (e.key === "Enter") { e.preventDefault(); run(flat[active]); }
              }}
            />
            <Kbd>Esc</Kbd>
          </div>
          <div ref={listRef} id={listId} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {flat.length === 0 && <p className="px-3 py-10 text-center text-small text-subtle">{emptyLabel}</p>}
            {groups.map(([g, list]) => (
              <div key={g || "_"} role="group" aria-label={g || undefined} className="pb-1">
                {g && <div className="eyebrow px-2.5 pt-2.5 pb-1.5">{g}</div>}
                {list.map((it) => {
                  index++;
                  const i = index;
                  const on = i === active;
                  return (
                    <div
                      key={it.id}
                      id={`${listId}-${it.id}`}
                      role="option"
                      aria-selected={on}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(it)}
                      className={cn(
                        "flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-small",
                        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-icon",
                        on && "bg-hover",
                      )}
                    >
                      {it.icon}
                      <span className="min-w-0 flex-1 truncate">{it.label}</span>
                      {it.hint && <span className="shrink-0 text-caption text-faint">{it.hint}</span>}
                      {it.shortcut && <Kbd>{it.shortcut}</Kbd>}
                      {on && !it.shortcut && <IconCorner size={14} className="text-faint!" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {footer && (
            <div className="hidden shrink-0 items-center gap-4 border-t border-border px-4 py-2 text-caption text-subtle sm:flex">
              <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> Move</span>
              <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> Open</span>
              <span className="ml-auto flex items-center gap-1.5"><Kbd>⌘</Kbd><Kbd>K</Kbd> Toggle</span>
            </div>
          )}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
