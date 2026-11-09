/**
 * Utility.
 * VisuallyHidden · ThemeProvider · useTheme · KeelProvider
 */
import * as stylex from "@stylexjs/stylex";
import { createContext, useCallback, useContext, useEffect, useState, type ElementType, type ReactNode } from "react";
import { color } from "../tokens/tokens.stylex";
import { Toaster } from "./feedback";
import { px } from "./lib/sx";
import { TooltipProvider } from "./overlay";

const u = stylex.create({
  hidden: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 },
  root: { minHeight: "100dvh", backgroundColor: color.canvas, color: color.fg },
});

/** Content for screen readers only (an icon button's extra context, a table caption). */
export function VisuallyHidden({ as: As = "span", children }: { as?: ElementType; children: ReactNode }) {
  return <As {...px(u.hidden)}>{children}</As>;
}

export type ThemeMode = "light" | "dark" | "system";
type ThemeCtx = { mode: ThemeMode; resolved: "light" | "dark"; setMode: (m: ThemeMode) => void; toggle: () => void };
const Ctx = createContext<ThemeCtx | null>(null);

const systemDark = () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * Theme state. Sets `data-theme` on <html> (tokens switch via `light-dark()`), remembers the choice,
 * follows the OS when mode is "system".
 */
export function ThemeProvider({ children, defaultMode = "system", storageKey = "keel-theme" }: { children: ReactNode; defaultMode?: ThemeMode; storageKey?: string }) {
  const [mode, setModeState] = useState<ThemeMode>(() => { try { return (localStorage.getItem(storageKey) as ThemeMode) || defaultMode; } catch { return defaultMode; } });
  const [sys, setSys] = useState(systemDark());
  useEffect(() => { const mq = window.matchMedia("(prefers-color-scheme: dark)"); const on = () => setSys(mq.matches); mq.addEventListener("change", on); return () => mq.removeEventListener("change", on); }, []);
  const resolved: "light" | "dark" = mode === "system" ? (sys ? "dark" : "light") : mode;
  useEffect(() => { const el = document.documentElement; if (mode === "system") delete el.dataset.theme; else el.dataset.theme = mode; }, [mode]);
  const setMode = useCallback((m: ThemeMode) => { setModeState(m); try { localStorage.setItem(storageKey, m); } catch { /* blocked */ } }, [storageKey]);
  const toggle = useCallback(() => setMode(resolved === "dark" ? "light" : "dark"), [resolved, setMode]);
  return <Ctx.Provider value={{ mode, resolved, setMode, toggle }}>{children}</Ctx.Provider>;
}

/** `const { resolved, toggle, setMode } = useTheme()` */
export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be used inside <ThemeProvider> (or <KeelProvider>)");
  return c;
}

/** Everything an app needs once at the root: theme, tooltips, toasts. */
export function KeelProvider({ children, defaultMode = "system" }: { children: ReactNode; defaultMode?: ThemeMode }) {
  return <ThemeProvider defaultMode={defaultMode}><TooltipProvider><Toaster>{children}</Toaster></TooltipProvider></ThemeProvider>;
}
