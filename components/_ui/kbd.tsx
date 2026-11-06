import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/** Keyboard key chip. Pass each key separately to show a combo: <Kbd>⌘</Kbd><Kbd>K</Kbd>, or one string "⌘K". */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center gap-0.5 rounded-xs bg-card px-1",
        "font-mono text-[11px] leading-none font-normal text-soft shadow-raised",
        className,
      )}
      {...props}
    />
  );
}

export function KbdGroup({ keys, className }: { keys: string[]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((k) => (
        <Kbd key={k}>{k}</Kbd>
      ))}
    </span>
  );
}
