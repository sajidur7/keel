import { useId, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "./button";
import { useField } from "./field";
import { IconAlertCircle, IconCheck, IconEdit, IconFile, IconUpload, IconX } from "./icons";
import { Input } from "./input";
import { cn } from "../lib/cn";
import { Progress } from "./progress";

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  /** 0–100 while uploading; undefined when done. */
  progress?: number;
  status: "uploading" | "done" | "error";
  error?: string;
};

const fmtSize = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`;

/**
 * Drag-and-drop zone + click to browse. You own the upload: `onFiles` gives you the files,
 * you update `items` with progress/status. Validation for type and size runs before `onFiles`.
 */
export function FileUpload({
  items = [],
  onFiles,
  onRemove,
  onRetry,
  accept,
  maxSize,
  multiple = true,
  hint,
  disabled,
  compact,
  className,
}: {
  items?: UploadItem[];
  onFiles: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  /** e.g. ".csv,.xlsx" or "image/*" */
  accept?: string;
  /** Bytes */
  maxSize?: number;
  multiple?: boolean;
  hint?: ReactNode;
  disabled?: boolean;
  /** A single-line button-style drop target instead of the tall zone. */
  compact?: boolean;
  className?: string;
}) {
  const field = useField({ disabled });
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const hintId = useId();

  const accepts = (f: File) => {
    if (!accept) return true;
    return accept.split(",").map((s) => s.trim().toLowerCase()).some((rule) =>
      rule.startsWith(".") ? f.name.toLowerCase().endsWith(rule) : rule.endsWith("/*") ? f.type.startsWith(rule.slice(0, -1)) : f.type === rule,
    );
  };
  const handle = (list: FileList | null) => {
    if (!list?.length) return;
    const files = Array.from(list).slice(0, multiple ? undefined : 1);
    const bad = files.find((f) => !accepts(f) || (maxSize && f.size > maxSize));
    if (bad) {
      setRejected(!accepts(bad) ? `${bad.name} isn't an accepted file type.` : `${bad.name} is larger than ${fmtSize(maxSize!)}.`);
    } else setRejected(null);
    const ok = files.filter((f) => accepts(f) && (!maxSize || f.size <= maxSize));
    if (ok.length) onFiles(ok);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={field.disabled ? -1 : 0}
        aria-disabled={field.disabled || undefined}
        aria-describedby={hintId}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(e) => { e.preventDefault(); if (!field.disabled) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (!field.disabled) handle(e.dataTransfer.files); }}
        className={cn(
          "flex cursor-pointer items-center rounded-lg text-center outline-none transition-[background-color,box-shadow] duration-fast ease-out",
          "bg-surface shadow-[inset_0_0_0_1px_var(--line-strong)] [background-image:none] hover:bg-hover focus-visible:shadow-focus",
          compact ? "h-[30px] justify-start gap-2 px-3 text-small" : "flex-col justify-center gap-2 px-6 py-8",
          drag && "bg-selected shadow-[inset_0_0_0_1.5px_var(--foreground)]",
          field.disabled && "pointer-events-none opacity-50",
        )}
        style={{ borderStyle: "dashed" }}
      >
        <span className={cn("inline-flex items-center justify-center text-icon", !compact && "size-8 rounded-lg bg-card shadow-raised")}>
          <IconUpload />
        </span>
        <span className={cn("text-small", compact ? "text-soft" : "text-foreground")}>
          {drag ? "Drop to upload" : <><span className="font-medium">Click to upload</span>{!compact && <span className="text-subtle"> or drag and drop</span>}</>}
        </span>
        {!compact && (
          <span id={hintId} className="text-caption text-subtle">
            {hint ?? [accept && accept.replaceAll(",", ", "), maxSize && `up to ${fmtSize(maxSize)}`].filter(Boolean).join(" · ")}
          </span>
        )}
        <input ref={inputRef} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
      </div>
      {rejected && <p className="text-caption text-danger" role="alert">{rejected}</p>}
      {items.length > 0 && (
        <ul className="flex flex-col">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 border-b border-border py-2 last:border-b-0">
              <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-card shadow-raised", it.status === "error" ? "text-danger" : "text-icon")}>
                {it.status === "error" ? <IconAlertCircle size={14} /> : <IconFile size={14} />}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2 text-small">
                  <span className="truncate">{it.name}</span>
                  <span className="tabular shrink-0 text-caption text-subtle">
                    {it.status === "uploading" ? `${Math.round(it.progress ?? 0)}%` : it.status === "done" ? fmtSize(it.size) : ""}
                  </span>
                </div>
                {it.status === "uploading" && <Progress value={it.progress ?? 0} size="xs" aria-label={`Uploading ${it.name}`} />}
                {it.status === "error" && <span className="text-caption text-danger">{it.error ?? "Upload failed"}</span>}
              </div>
              {it.status === "done" && <IconCheck size={14} className="shrink-0 text-success" />}
              {it.status === "error" && onRetry && <Button size="xs" variant="ghost" onClick={() => onRetry(it.id)}>Retry</Button>}
              {onRemove && (
                <IconButton label={`Remove ${it.name}`} size="xs" onClick={() => onRemove(it.id)}>
                  <IconX />
                </IconButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Inline edit: reads as plain text, becomes an input on click/Enter.
 * Enter saves, Esc cancels, blur saves. `onSave` may return a promise; an error message keeps it open.
 */
export function InlineEdit({
  value,
  onSave,
  placeholder = "Empty",
  validate,
  label,
  readOnly,
  className,
}: {
  value: string;
  onSave: (v: string) => void | Promise<void>;
  placeholder?: string;
  validate?: (v: string) => string | null;
  /** Accessible name, e.g. "Company name". */
  label: string;
  readOnly?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const commit = async () => {
    if (draft === value) return setEditing(false);
    const err = validate?.(draft) ?? null;
    if (err) return setError(err);
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        type="button"
        disabled={readOnly}
        aria-label={`${label}: ${value || placeholder}. Edit`}
        onClick={() => { setDraft(value); setEditing(true); }}
        className={cn(
          "group/ie -mx-1.5 inline-flex h-[30px] max-w-full min-w-0 items-center gap-1.5 rounded-md px-1.5 text-left text-small outline-none",
          "hover:bg-hover focus-visible:shadow-focus disabled:cursor-default disabled:hover:bg-transparent",
          className,
        )}
      >
        <span className={cn("truncate", !value && "text-faint")}>{value || placeholder}</span>
        {!readOnly && <IconEdit size={12} className="shrink-0 text-faint opacity-0 transition-opacity group-hover/ie:opacity-100 group-focus-visible/ie:opacity-100" />}
      </button>
    );
  }
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <Input
        autoFocus
        aria-label={label}
        value={draft}
        invalid={Boolean(error)}
        disabled={saving}
        onChange={(e) => { setDraft(e.target.value); setError(null); }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") { e.preventDefault(); setDraft(value); setError(null); setEditing(false); }
        }}
      />
      {error && <span className="text-caption text-danger" role="alert">{error}</span>}
    </div>
  );
}
