import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center rounded-full bg-muted font-medium text-soft shadow-[0_0_0_1px_var(--border)]",
  {
    variants: {
      size: {
        xs: "size-4 text-[8px]",
        sm: "size-5 text-[9px]",
        md: "size-6 text-[10px]",
        lg: "size-8 text-caption",
        xl: "size-10 text-small",
        "2xl": "size-14 text-title",
      },
      shape: { circle: "rounded-full", square: "rounded-md" },
    },
    defaultVariants: { size: "md", shape: "circle" },
  },
);

/** Stable, quiet tone per name so the same person always gets the same initials color. */
const TONES = ["blue", "cyan", "teal", "green", "yellow", "orange", "red", "pink", "violet", "neutral"] as const;
function toneFor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}
export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export type AvatarStatus = "online" | "away" | "busy" | "offline";
const STATUS_CLASS: Record<AvatarStatus, string> = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-danger",
  offline: "bg-faint",
};

export type AvatarProps = Omit<ComponentProps<typeof AvatarPrimitive.Root>, "children"> &
  VariantProps<typeof avatarVariants> & {
    name?: string;
    src?: string;
    status?: AvatarStatus;
    /** Color the initials by name (default) or keep them neutral. */
    colored?: boolean;
  };

export function Avatar({ name, src, status, size, shape, colored = true, className, ...props }: AvatarProps) {
  const tone = toneFor(name);
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, shape }), className)}
      aria-label={name}
      role={name ? "img" : undefined}
      {...props}
    >
      {src && <AvatarPrimitive.Image src={src} alt="" className="size-full rounded-[inherit] object-cover" />}
      <AvatarPrimitive.Fallback
        delayMs={src ? 300 : 0}
        className="flex size-full items-center justify-center rounded-[inherit] leading-none"
        style={colored && name ? { background: `var(--tag-${tone}-bg)`, color: `var(--tag-${tone}-text)` } : undefined}
        aria-hidden
      >
        {initials(name)}
      </AvatarPrimitive.Fallback>
      {status && (
        <span
          aria-label={status}
          className={cn(
            "absolute right-[-1px] bottom-[-1px] size-[30%] min-h-1.5 min-w-1.5 rounded-full ring-2 ring-background",
            STATUS_CLASS[status],
          )}
        />
      )}
    </AvatarPrimitive.Root>
  );
}

/** Overlapping avatars with a "+N" overflow chip. */
export function AvatarGroup({
  people,
  max = 4,
  size = "md",
  className,
}: {
  people: { name: string; src?: string }[];
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className={cn("flex items-center -space-x-1.5", className)} aria-label={people.map((p) => p.name).join(", ")}>
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} size={size} className="ring-2 ring-background" />
      ))}
      {rest > 0 && (
        <span className={cn(avatarVariants({ size }), "ring-2 ring-background tabular")} aria-hidden>
          +{rest}
        </span>
      )}
    </div>
  );
}
