/**
 * Form controls — special pickers and editors.
 * FileInput (FileUpload) · OtpInput · Rating · ColorPicker · Transfer · Cascader · InlineEdit · RichTextEditor
 */
import * as stylex from "@stylexjs/stylex";
import { Popover as P } from "radix-ui";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { color, depth, font, motion, radius } from "../tokens/tokens.stylex";
import { Button, IconButton, ToggleButtonGroup } from "./action";
import { ProgressBar } from "./feedback";
import { field, Input, useField } from "./inputs";
import {
  IconBold, IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconCode, IconEdit, IconFile, IconItalic, IconLink, IconList, IconListOrdered,
  IconQuote, IconRefresh, IconSearch, IconSizeContext, IconStar, IconStrikethrough, IconTrash, IconUnderline, IconUpload, IconX,
} from "./icons";
import { px, sx, type StyleProps } from "./lib/sx";
import { lb } from "./select";

const k = stylex.create({
  col: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  row: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  muted: { color: color.fgMuted, fontSize: font.sm },
  strong: { fontWeight: font.medium, color: color.fg },
  danger: { color: color.danger, fontSize: font.sm },
  // dropzone
  zone: {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, paddingBlock: 28, paddingInline: 16,
    borderRadius: radius.xl, textAlign: "center", cursor: "pointer", outline: "none", backgroundColor: color.surfaceSunken,
    backgroundImage: `repeating-linear-gradient(90deg, ${color.borderStrong} 0 6px, transparent 6px 12px), repeating-linear-gradient(90deg, ${color.borderStrong} 0 6px, transparent 6px 12px), repeating-linear-gradient(0deg, ${color.borderStrong} 0 6px, transparent 6px 12px), repeating-linear-gradient(0deg, ${color.borderStrong} 0 6px, transparent 6px 12px)`,
    backgroundSize: "100% 1px, 100% 1px, 1px 100%, 1px 100%", backgroundPosition: "0 0, 0 100%, 0 0, 100% 0", backgroundRepeat: "no-repeat",
    transitionProperty: "background-color, box-shadow", transitionDuration: motion.fast,
    ":hover": { backgroundColor: color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  zoneOver: { backgroundColor: color.accentSoft, boxShadow: `inset 0 0 0 1.5px ${color.accent}` },
  zoneOff: { opacity: 0.5, cursor: "not-allowed" },
  zoneIcon: {
    display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, marginBottom: 4, borderRadius: radius.lg, color: color.icon,
    backgroundImage: `linear-gradient(180deg, ${color.buttonTop}, ${color.buttonBottom})`, boxShadow: depth.raised,
  },
  files: { display: "flex", flexDirection: "column", gap: 6 },
  file: { display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: depth.card },
  fileIcon: { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: radius.md, backgroundColor: color.muted, color: color.icon, flexShrink: 0 },
  fileBody: { display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 },
  name: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: font.medium },
  // otp
  otp: { display: "flex", gap: 8 },
  otpCell: {
    width: 40, height: 46, minWidth: 0, flex: "0 1 40px", borderRadius: radius.md, textAlign: "center", fontSize: "20px", fontWeight: font.semibold,
    fontVariantNumeric: "tabular-nums", color: color.fg, backgroundColor: color.surface, outline: "none", caretColor: color.accent,
    boxShadow: { default: depth.recessed, ":focus": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` },
    transitionProperty: "box-shadow", transitionDuration: motion.fast,
  },
  otpFilled: { backgroundColor: color.surfaceSunken },
  otpBad: { boxShadow: { default: `0 0 0 1px ${color.danger}`, ":focus": `0 0 0 1px ${color.danger}, 0 0 0 4px ${color.dangerBorder}` } },
  otpSep: { alignSelf: "center", width: 8, height: 2, borderRadius: 1, backgroundColor: color.borderStrong },
  // rating
  stars: { display: "inline-flex", gap: 2 },
  star: { display: "inline-flex", color: color.borderStrong, borderRadius: radius.xs, outline: "none", transitionProperty: "transform, color", transitionDuration: motion.fast, ":focus-visible": { boxShadow: depth.focus } },
  starBtn: { cursor: "pointer", transform: { default: null, ":hover": "scale(1.15)" } },
  starOn: { color: "#f5a524" },
  // color
  swatch: { width: 18, height: 18, borderRadius: radius.sm, flexShrink: 0, boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)` },
  swatches: { display: "grid", gridTemplateColumns: "repeat(8, 24px)", gap: 6 },
  swBtn: { width: 24, height: 24, borderRadius: radius.sm, outline: "none", cursor: "pointer", boxShadow: { default: "inset 0 0 0 1px rgba(0,0,0,0.12)", ":hover": "inset 0 0 0 1px rgba(0,0,0,0.12), 0 0 0 2px var(--hov)", ":focus-visible": depth.focus }, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  native: { width: "100%", height: 120, borderRadius: radius.md, cursor: "crosshair", padding: 0, border: 0 },
  pop: { padding: 12, display: "flex", flexDirection: "column", gap: 10, width: 252 },
  // transfer
  tr: { display: "grid", gridTemplateColumns: { default: "1fr", "@media (min-width: 640px)": "1fr auto 1fr" }, gap: 12, alignItems: "stretch" },
  pane: { display: "flex", flexDirection: "column", minWidth: 0, borderRadius: radius.xl, backgroundColor: color.surface, boxShadow: depth.card, overflow: "hidden" },
  paneHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingInline: 12, height: 40, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, backgroundColor: color.surfaceSunken },
  paneList: { flex: 1, overflowY: "auto", padding: 4 },
  paneSearch: { padding: 8, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border },
  mid: { display: "flex", flexDirection: { default: "row", "@media (min-width: 640px)": "column" }, justifyContent: "center", gap: 6 },
  // cascader
  cols: { display: "flex", maxHeight: 280 },
  ccol: { minWidth: 180, overflowY: "auto", padding: 4, borderInlineStartWidth: { default: 1, ":first-child": 0 }, borderInlineStartStyle: "solid", borderInlineStartColor: color.border },
  path: { color: color.fgFaint, paddingInline: 4 },
  // inline edit
  ie: {
    display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%", minHeight: 30, paddingInline: 8, marginInline: -8, borderRadius: radius.md,
    textAlign: "start", cursor: "text", outline: "none", color: color.fg,
    backgroundColor: { default: "transparent", ":hover": color.hover }, ":focus-visible": { boxShadow: depth.focus },
  },
  iePencil: { display: "inline-flex", color: color.fgFaint, opacity: { default: 0, [stylex.when.ancestor(":hover")]: 1, [stylex.when.ancestor(":focus-visible")]: 1 } },
  ieEmpty: { color: color.fgFaint },
  ieRow: { display: "flex", alignItems: "flex-start", gap: 6, width: "100%" },
  // rich text
  rte: { display: "flex", flexDirection: "column", borderRadius: radius.lg, backgroundColor: color.surface, boxShadow: { default: depth.recessed, ":focus-within": `0 0 0 1px ${color.accent}, 0 0 0 4px ${color.focusRing}` }, overflow: "hidden" },
  rteBar: { display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", padding: 4, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: color.border, backgroundColor: color.surfaceSunken },
  rteSep: { width: 1, height: 18, backgroundColor: color.border, marginInline: 2 },
  rteWrap: { position: "relative" },
  rtePh: { position: "absolute", top: 12, left: 12, color: color.fgFaint, pointerEvents: "none", fontSize: font.lg },
  rteBody: { minHeight: 120, padding: 12, outline: "none", fontSize: font.lg, lineHeight: 1.6, overflowY: "auto" },
  rteFoot: { display: "flex", justifyContent: "flex-end", paddingInline: 10, paddingBottom: 6, fontSize: font.xs, color: color.fgFaint },
});

const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`);

/* ============================================================== FileInput */

export type UploadItem = { id: string; name: string; size: number; progress?: number; status: "uploading" | "done" | "error"; error?: string };

export type FileInputProps = StyleProps & {
  items?: UploadItem[];
  /** You own the upload: get the files here, update `items` with progress/status. */
  onFiles: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  /** ".csv,.xlsx" or "image/*". */
  accept?: string;
  /** Bytes. */
  maxSize?: number;
  multiple?: boolean;
  hint?: ReactNode;
  disabled?: boolean;
  /** A single raised button instead of the tall drop zone. */
  compact?: boolean;
  label?: string;
};

/** Drag-and-drop or browse. Validates type and size before handing files to you; lists progress per file. */
export function FileInput({ items = [], onFiles, onRemove, onRetry, accept, maxSize, multiple = true, hint, disabled, compact, label = "Upload files", ...p }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const take = (list: FileList | null) => {
    if (!list) return;
    const ok: File[] = []; const bad: string[] = [];
    const types = accept?.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    for (const file of Array.from(list)) {
      const typeOk = !types?.length || types.some((t) => t.startsWith(".") ? file.name.toLowerCase().endsWith(t) : t.endsWith("/*") ? file.type.startsWith(t.slice(0, -1)) : file.type === t);
      if (!typeOk) bad.push(`${file.name}: not an accepted type`);
      else if (maxSize && file.size > maxSize) bad.push(`${file.name}: larger than ${fmtSize(maxSize)}`);
      else ok.push(file);
    }
    setRejected(bad); if (ok.length) onFiles(multiple ? ok : ok.slice(0, 1));
  };
  const input = <input ref={inputRef} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => { take(e.target.files); e.target.value = ""; }} />;
  return (
    <div {...sx(p, k.col)}>
      {compact ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button leading={<IconUpload />} onClick={() => inputRef.current?.click()} disabled={disabled}>{label}</Button>
          {hint && <span {...px(k.muted)}>{hint}</span>}
          {input}
        </div>
      ) : (
        <div role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined} aria-label={label}
          onClick={() => !disabled && inputRef.current?.click()} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); inputRef.current?.click(); } }}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }} onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) take(e.dataTransfer.files); }}
          {...px(k.zone, over && k.zoneOver, disabled && k.zoneOff)}>
          <span {...px(k.zoneIcon)}><IconUpload size={18} /></span>
          <span {...px(k.strong)}>Drop files here or <span style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>browse</span></span>
          {hint && <span {...px(k.muted)}>{hint}</span>}
          {input}
        </div>
      )}
      {rejected.map((r) => <p key={r} role="alert" {...px(k.danger)}>{r}</p>)}
      {items.length > 0 && (
        <ul {...px(k.files)}>
          {items.map((it) => (
            <li key={it.id} {...px(k.file)}>
              <span {...px(k.fileIcon)}><IconFile size={16} /></span>
              <div {...px(k.fileBody)}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span {...px(k.name)}>{it.name}</span>
                  <span {...px(it.status === "error" ? k.danger : k.muted)}>{it.status === "error" ? it.error ?? "Failed" : it.status === "uploading" ? `${it.progress ?? 0}%` : fmtSize(it.size)}</span>
                </div>
                {it.status === "uploading" && <ProgressBar value={it.progress ?? 0} size="xs" />}
              </div>
              {it.status === "error" && onRetry && <IconButton label="Retry" size="sm" onClick={() => onRetry(it.id)}><IconRefresh /></IconButton>}
              {onRemove && <IconButton label={it.status === "uploading" ? "Cancel" : "Remove"} size="sm" onClick={() => onRemove(it.id)}>{it.status === "uploading" ? <IconX /> : <IconTrash />}</IconButton>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
/** v1 name. */
export const FileUpload = FileInput;

/* ============================================================== OtpInput */

/** One-time code: one box per digit, paste fills all, Backspace walks back. */
export function OtpInput({ length = 6, value, onChange, onComplete, invalid, disabled, autoFocus, groupSize, "aria-label": ariaLabel = "Verification code", ...p }: StyleProps & {
  length?: number; value: string; onChange: (v: string) => void; onComplete?: (v: string) => void; invalid?: boolean; disabled?: boolean; autoFocus?: boolean;
  /** Visual split, e.g. 3 → "123 – 456". */ groupSize?: number; "aria-label"?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (v: string) => { const clean = v.replace(/\D/g, "").slice(0, length); onChange(clean); if (clean.length === length) onComplete?.(clean); };
  return (
    <div role="group" aria-label={ariaLabel} {...sx(p, k.otp)}>
      {Array.from({ length }, (_, i) => [
        groupSize && i > 0 && i % groupSize === 0 ? <span key={`s${i}`} aria-hidden {...px(k.otpSep)} /> : null,
        <input key={i} ref={(el) => { refs.current[i] = el; }} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={1} disabled={disabled}
          autoFocus={autoFocus && i === 0} aria-label={`Digit ${i + 1}`} value={value[i] ?? ""} aria-invalid={invalid || undefined}
          onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(-1); const next = (value.slice(0, i) + d + value.slice(i + 1)).slice(0, length); set(next); if (d) refs.current[i + 1]?.focus(); }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i]) { refs.current[i - 1]?.focus(); set(value.slice(0, i - 1) + value.slice(i)); }
            if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
          }}
          onPaste={(e) => { e.preventDefault(); const t = e.clipboardData.getData("text"); set(t); refs.current[Math.min(length - 1, t.replace(/\D/g, "").length)]?.focus(); }}
          {...px(k.otpCell, Boolean(value[i]) && k.otpFilled, invalid && k.otpBad)} />,
      ])}
    </div>
  );
}

/* ============================================================== Rating */

/** Stars. Read-only shows the score; interactive supports arrows and hover preview. */
export function Rating({ value, onChange, max = 5, readOnly, size = 16, label = "Rating", ...p }: StyleProps & { value: number; onChange?: (v: number) => void; max?: number; readOnly?: boolean; size?: number; label?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;
  if (readOnly || !onChange) {
    return <span role="img" aria-label={`${label}: ${value} of ${max}`} {...sx(p, k.stars)}>{Array.from({ length: max }, (_, i) => <span key={i} {...px(k.star, i < Math.round(value) && k.starOn)}><IconStar size={size} fill="currentColor" /></span>)}</span>;
  }
  return (
    <span role="radiogroup" aria-label={label} onMouseLeave={() => setHover(null)} {...sx(p, k.stars)}>
      {Array.from({ length: max }, (_, i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i + 1} aria-label={`${i + 1} of ${max}`} tabIndex={value === i + 1 || (value === 0 && i === 0) ? 0 : -1}
          onMouseEnter={() => setHover(i + 1)} onClick={() => onChange(value === i + 1 ? 0 : i + 1)}
          onKeyDown={(e) => { if (e.key === "ArrowRight") onChange(Math.min(max, value + 1)); if (e.key === "ArrowLeft") onChange(Math.max(0, value - 1)); }}
          {...px(k.star, k.starBtn, i < shown && k.starOn)}><IconStar size={size} fill="currentColor" /></button>
      ))}
    </span>
  );
}

/* ============================================================== ColorPicker */

const PRESETS = ["#17171b", "#6b7280", "#dc2626", "#ea580c", "#d97706", "#16a34a", "#0d9488", "#0891b2", "#3a5cf0", "#7c3aed", "#c026d3", "#db2777", "#f4f4f6", "#fecaca", "#bbf7d0", "#c7d2fe"];

/** A brand or label color: swatches, a full picker and a hex field. */
export function ColorPicker({ value, onChange, presets = PRESETS, size = "md", disabled, id, ...p }: StyleProps & { value: string; onChange: (hex: string) => void; presets?: string[]; size?: "sm" | "md" | "lg"; disabled?: boolean; id?: string }) {
  const f = useField({ id, disabled });
  const [hex, setHex] = useState(value);
  useEffect(() => setHex(value), [value]);
  const valid = /^#[0-9a-f]{6}$/i.test(hex);
  return (
    <P.Root>
      <P.Trigger asChild disabled={f.disabled}>
        <button type="button" id={f.id} aria-label={`Color ${value}`} {...sx(p, field.shell, size !== "md" && field[size], lb.trigger, f.disabled && field.disabled)}>
          <span {...px(k.swatch)} style={{ backgroundColor: value }} />
          <span style={{ flex: 1, fontFamily: "var(--mono, ui-monospace)", fontSize: 12, textTransform: "uppercase" }}>{value}</span>
          <span {...px(lb.chev)}><IconChevronDown size={14} /></span>
        </button>
      </P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={6} collisionPadding={8} {...px(lb.pop, k.pop)}>
          <input type="color" value={valid ? hex : "#000000"} onChange={(e) => onChange(e.target.value)} aria-label="Pick any color" {...px(k.native)} />
          <div {...px(k.swatches)}>
            {presets.map((c) => <button key={c} type="button" aria-label={c} aria-pressed={c.toLowerCase() === value.toLowerCase()} onClick={() => onChange(c)} {...px(k.swBtn)} style={{ backgroundColor: c, ["--hov" as string]: c }}>{c.toLowerCase() === value.toLowerCase() && <IconCheck size={14} />}</button>)}
          </div>
          <Input size="sm" value={hex} aria-label="Hex" invalid={!valid} onChange={(e) => { setHex(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value); }} leading={<span {...px(k.swatch)} style={{ backgroundColor: valid ? hex : "transparent", width: 14, height: 14 }} />} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

/* ============================================================== Transfer */

export type TransferItem = { key: string; label: string; description?: string; disabled?: boolean };

/** Move items between two lists — permissions, columns, members. Search, select, then → / ←. */
export function Transfer({ items, value, onChange, titles = ["Available", "Selected"], searchable = true, height = 280, ...p }: StyleProps & {
  items: TransferItem[]; value: string[]; onChange: (keys: string[]) => void; titles?: [string, string]; searchable?: boolean; height?: number;
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [q, setQ] = useState(["", ""]);
  const left = items.filter((i) => !value.includes(i.key));
  const right = value.map((v) => items.find((i) => i.key === v)).filter(Boolean) as TransferItem[];
  const toggle = (key: string) => setChecked((s) => { const n = new Set(s); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  const move = (dir: 1 | -1) => {
    const src = dir === 1 ? left : right;
    const keys = src.filter((i) => checked.has(i.key) && !i.disabled).map((i) => i.key);
    onChange(dir === 1 ? [...value, ...keys] : value.filter((v) => !keys.includes(v)));
    setChecked((s) => { const n = new Set(s); keys.forEach((x) => n.delete(x)); return n; });
  };
  const pane = (list: TransferItem[], i: 0 | 1) => {
    const shown = list.filter((it) => it.label.toLowerCase().includes(q[i].toLowerCase()));
    const sel = shown.filter((it) => checked.has(it.key)).length;
    return (
      <div {...px(k.pane)}>
        <div {...px(k.paneHead)}><span {...px(k.strong)}>{titles[i]}</span><span {...px(k.muted)}>{sel ? `${sel} / ` : ""}{list.length}</span></div>
        {searchable && <div {...px(k.paneSearch)}><Input size="sm" leading={<IconSearch />} placeholder="Search" value={q[i]} onChange={(e) => setQ((x) => (i === 0 ? [e.target.value, x[1]] : [x[0], e.target.value]))} /></div>}
        <div role="listbox" aria-multiselectable aria-label={titles[i]} {...px(k.paneList)} style={{ height }}>
          {shown.length === 0 && <p {...px(lb.empty)}>{q[i] ? "No matches" : "Empty"}</p>}
          {shown.map((it) => {
            const on = checked.has(it.key);
            return (
              <div key={it.key} role="option" aria-selected={on} aria-disabled={it.disabled || undefined} tabIndex={0}
                onClick={() => !it.disabled && toggle(it.key)} onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !it.disabled) { e.preventDefault(); toggle(it.key); } }}
                {...px(lb.item, lb.itemPlain, it.disabled && lb.off)} style={{ minHeight: it.description ? 40 : 30 }}>
                <span {...px(lb.box, on && lb.boxOn)}>{on && <IconCheck size={12} />}</span>
                <span {...px(lb.text)}><span {...px(lb.label)}>{it.label}</span>{it.description && <span {...px(lb.desc)}>{it.description}</span>}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div {...sx(p, k.tr)}>
      {pane(left, 0)}
      <div {...px(k.mid)}>
        <IconButton label="Move to selected" variant="secondary" size="sm" onClick={() => move(1)} disabled={!left.some((i) => checked.has(i.key))}><IconChevronRight /></IconButton>
        <IconButton label="Move back" variant="secondary" size="sm" onClick={() => move(-1)} disabled={!right.some((i) => checked.has(i.key))}><IconChevronLeft /></IconButton>
      </div>
      {pane(right, 1)}
    </div>
  );
}

/* ============================================================== Cascader */

export type CascaderOption = { value: string; label: string; children?: CascaderOption[]; disabled?: boolean };

/** Pick a leaf in a hierarchy, column by column (Region → Country → City). */
export function Cascader({ options, value, onChange, placeholder = "Select", separator = " / ", size = "md", invalid, disabled, id, ...p }: StyleProps & {
  options: CascaderOption[]; value: string[]; onChange: (path: string[]) => void; placeholder?: string; separator?: string; size?: "sm" | "md" | "lg"; invalid?: boolean; disabled?: boolean; id?: string;
}) {
  const f = useField({ id, invalid, disabled });
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState<string[]>(value);
  useEffect(() => { if (open) setPath(value); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const columns = useMemo(() => { const cols: CascaderOption[][] = [options]; let cur = options; for (const v of path) { const n = cur.find((o) => o.value === v); if (!n?.children) break; cols.push(n.children); cur = n.children; } return cols; }, [options, path]);
  const labels = (() => { const out: string[] = []; let cur: CascaderOption[] | undefined = options; for (const v of value) { const n: CascaderOption | undefined = cur?.find((o) => o.value === v); if (!n) break; out.push(n.label); cur = n.children; } return out; })();
  return (
    <IconSizeContext.Provider value={14}>
      <P.Root open={open} onOpenChange={setOpen}>
        <P.Trigger asChild disabled={f.disabled}>
          <button type="button" id={f.id} aria-invalid={f.invalid || undefined} aria-describedby={f["aria-describedby"]} aria-haspopup="tree"
            {...sx(p, field.shell, size !== "md" && field[size], lb.trigger, open && lb.triggerOpen, f.invalid && field.invalid, f.disabled && field.disabled)}>
            <span {...px(lb.value, !labels.length && lb.placeholder)}>{labels.length ? labels.join(separator) : placeholder}</span>
            <span {...px(lb.chev)}><IconChevronDown /></span>
          </button>
        </P.Trigger>
        <P.Portal>
          <P.Content align="start" sideOffset={6} collisionPadding={8} {...px(lb.pop)}>
            <div {...px(k.cols)}>
              {columns.map((col, ci) => (
                <div key={ci} role="listbox" aria-label={`Level ${ci + 1}`} {...px(k.ccol)}>
                  {col.map((o) => {
                    const on = path[ci] === o.value;
                    return (
                      <div key={o.value} role="option" aria-selected={on} aria-disabled={o.disabled || undefined} tabIndex={0}
                        onClick={() => { if (o.disabled) return; const np = [...path.slice(0, ci), o.value]; setPath(np); if (!o.children) { onChange(np); setOpen(false); } }}
                        onKeyDown={(e) => { if (e.key === "Enter") (e.currentTarget as HTMLElement).click(); }}
                        {...px(lb.item, lb.itemPlain, on && lb.active, o.disabled && lb.off)}>
                        <span {...px(lb.text)}><span {...px(lb.label)}>{o.label}</span></span>
                        {o.children ? <span {...px(lb.icon)}><IconChevronRight /></span> : value[ci] === o.value && <span {...px(lb.icon)}><IconCheck /></span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
    </IconSizeContext.Provider>
  );
}

/* ============================================================== InlineEdit */

/** Text that turns into a field on click. Enter saves, Esc cancels; async save shows a spinner. */
export function InlineEdit({ value, onSave, placeholder = "Empty", validate, label, readOnly, ...p }: StyleProps & {
  value: string; onSave: (v: string) => void | Promise<void>; placeholder?: string; validate?: (v: string) => string | null; label: string; readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const commit = async () => {
    if (draft === value) return setEditing(false);
    const err = validate?.(draft) ?? null; if (err) return setError(err);
    setSaving(true); try { await onSave(draft); setEditing(false); setError(null); } finally { setSaving(false); }
  };
  if (!editing) {
    return (
      <button type="button" aria-label={`${label}: ${value || placeholder}. Edit`} disabled={readOnly} onClick={() => { setDraft(value); setEditing(true); }} {...sx(p, k.ie, stylex.defaultMarker())}>
        <span {...px(!value && k.ieEmpty)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
        {!readOnly && <span {...px(k.iePencil)}><IconEdit size={12} /></span>}
      </button>
    );
  }
  return (
    <div {...sx(p, k.col)} style={{ width: "100%", gap: 4 }}>
      <div {...px(k.ieRow)}>
        <Input autoFocus size="sm" aria-label={label} value={draft} invalid={Boolean(error)} loading={saving}
          onChange={(e) => { setDraft(e.target.value); setError(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEditing(false); setError(null); } }} />
        <IconButton label="Save" size="sm" variant="primary" onClick={commit} disabled={saving}><IconCheck /></IconButton>
        <IconButton label="Cancel" size="sm" onClick={() => { setEditing(false); setError(null); }}><IconX /></IconButton>
      </div>
      {error && <p role="alert" {...px(k.danger)}>{error}</p>}
    </div>
  );
}

/* ============================================================== RichTextEditor */

export type RichTextEditorProps = StyleProps & {
  /** HTML. */
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** Show a character count. */
  showCount?: boolean;
  label?: string;
};

/** Light formatting for notes and descriptions: bold, italic, underline, strike, lists, quote, code, link. Emits HTML. */
export function RichTextEditor({ value, defaultValue = "", onChange, placeholder = "Write something…", minHeight = 120, showCount, label = "Text editor", ...p }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const [count, setCount] = useState(0);
  const [marks, setMarks] = useState<string[]>([]);
  useEffect(() => { if (ref.current && ref.current.innerHTML !== (value ?? defaultValue)) ref.current.innerHTML = value ?? defaultValue; setCount(ref.current?.innerText.trim().length ?? 0); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  const exec = (cmd: string, arg?: string) => { ref.current?.focus(); document.execCommand(cmd, false, arg); sync(); };
  const sync = () => {
    const el = ref.current; if (!el) return;
    setCount(el.innerText.trim().length); onChange?.(el.innerHTML);
    setMarks(["bold", "italic", "underline", "strikeThrough"].filter((c) => document.queryCommandState(c)));
  };
  return (
    <div {...sx(p, k.rte)}>
      <div role="toolbar" aria-label="Formatting" aria-controls={id} {...px(k.rteBar)}>
        <ToggleButtonGroup type="multiple" size="xs" value={marks} onValueChange={() => {}} items={[
          { value: "bold", label: "", icon: <span onMouseDown={(e) => { e.preventDefault(); exec("bold"); }}><IconBold /></span>, ariaLabel: "Bold" },
          { value: "italic", label: "", icon: <span onMouseDown={(e) => { e.preventDefault(); exec("italic"); }}><IconItalic /></span>, ariaLabel: "Italic" },
          { value: "underline", label: "", icon: <span onMouseDown={(e) => { e.preventDefault(); exec("underline"); }}><IconUnderline /></span>, ariaLabel: "Underline" },
          { value: "strikeThrough", label: "", icon: <span onMouseDown={(e) => { e.preventDefault(); exec("strikeThrough"); }}><IconStrikethrough /></span>, ariaLabel: "Strikethrough" },
        ]} />
        <span {...px(k.rteSep)} />
        <IconButton label="Bulleted list" size="xs" onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}><IconList /></IconButton>
        <IconButton label="Numbered list" size="xs" onMouseDown={(e) => { e.preventDefault(); exec("insertOrderedList"); }}><IconListOrdered /></IconButton>
        <IconButton label="Quote" size="xs" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "blockquote"); }}><IconQuote /></IconButton>
        <IconButton label="Code" size="xs" onMouseDown={(e) => { e.preventDefault(); exec("formatBlock", "pre"); }}><IconCode /></IconButton>
        <IconButton label="Link" size="xs" onMouseDown={(e) => { e.preventDefault(); const url = window.prompt("Link URL"); if (url) exec("createLink", url); }}><IconLink /></IconButton>
      </div>
      <div {...px(k.rteWrap)}>
        {count === 0 && <span aria-hidden {...px(k.rtePh)}>{placeholder}</span>}
        <div ref={ref} id={id} role="textbox" aria-multiline aria-label={label} aria-placeholder={placeholder} contentEditable suppressContentEditableWarning
          onInput={sync} onKeyUp={sync} onMouseUp={sync} {...px(k.rteBody)} style={{ minHeight }} />
      </div>
      {showCount && <div {...px(k.rteFoot)}>{count} characters</div>}
    </div>
  );
}
