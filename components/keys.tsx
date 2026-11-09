/** Keyboard keys as icons: "⌘K", "⇧↵", "mod+shift+p", "Esc" → icon and letter parts. Used by Kbd, menus, tooltips. */
import type { ReactNode } from "react";
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconBackspace, IconChevronUp, IconCommand, IconCorner, IconOption, IconShift, IconTabKey } from "./icons";

/* Modifier and arrow keys are drawn as icons, never as text glyphs. */
const KEY_ICONS: Record<string, ReactNode> = {
  "⌘": <IconCommand />, cmd: <IconCommand />, mod: <IconCommand />, "⇧": <IconShift />, shift: <IconShift />,
  "⌥": <IconOption />, alt: <IconOption />, option: <IconOption />, "⌃": <IconChevronUp />, ctrl: <IconChevronUp />,
  "↵": <IconCorner />, "⏎": <IconCorner />, enter: <IconCorner />, return: <IconCorner />,
  "↑": <IconArrowUp />, up: <IconArrowUp />, "↓": <IconArrowDown />, down: <IconArrowDown />, "←": <IconArrowLeft />, left: <IconArrowLeft />,
  "→": <IconArrowRight />, right: <IconArrowRight />, "⌫": <IconBackspace />, backspace: <IconBackspace />, "⇥": <IconTabKey />, tab: <IconTabKey />,
};
const KEY_TEXT: Record<string, string> = { "⎋": "esc", escape: "esc", esc: "esc", space: "space", "␣": "space" };
/** Turns "⌘K", "⇧↵", "mod+shift+p" or "Esc" into icon and letter parts. */
export function keyParts(keys: string): ReactNode[] {
  const out: ReactNode[] = [];
  const tokens = keys.includes("+") && keys.length > 1 ? keys.split("+") : Array.from(keys.match(/[A-Za-z]{2,}|./gu) ?? []);
  tokens.forEach((t, i) => {
    const low = t.toLowerCase();
    if (KEY_ICONS[t] ?? KEY_ICONS[low]) out.push(<span key={i} style={{ display: "inline-flex" }}>{KEY_ICONS[t] ?? KEY_ICONS[low]}</span>);
    else if (KEY_TEXT[t] ?? KEY_TEXT[low]) out.push(<span key={i}>{KEY_TEXT[t] ?? KEY_TEXT[low]}</span>);
    else if (t.trim()) out.push(<span key={i}>{t.length === 1 ? t.toUpperCase() : t}</span>);
  });
  return out;
}


/** Inline key hint for menus and tooltips: icons and letters, no caps. */
export function KeyHint({ keys }: { keys: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{keyParts(keys)}</span>;
}
