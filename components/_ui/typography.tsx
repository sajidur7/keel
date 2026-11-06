import { cva, type VariantProps } from "class-variance-authority";
import { Separator } from "radix-ui";
import { createElement, type ComponentProps, type ElementType } from "react";
import { cn } from "../lib/cn";

/*
  Keel's type scale is deliberately short. Hierarchy comes from size + weight + one of four
  text greys (foreground → soft → subtle → faint), never from color or boxes.
*/
export const textVariants = cva("", {
  variants: {
    variant: {
      stat: "text-stat font-medium tabular",
      display: "text-display font-semibold",
      page: "text-page font-semibold",
      title: "text-title font-medium",
      body: "text-body",
      "body-medium": "text-body font-medium",
      small: "text-small",
      caption: "text-caption",
      eyebrow: "eyebrow",
      mono: "font-mono text-caption",
    },
    tone: {
      default: "text-foreground",
      soft: "text-soft",
      subtle: "text-subtle",
      faint: "text-faint",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      info: "text-info",
    },
    truncate: { true: "truncate" },
  },
  defaultVariants: { variant: "body" },
});

const defaultTag: Record<string, ElementType> = {
  stat: "span", display: "h1", page: "h1", title: "h2", eyebrow: "span", caption: "span", mono: "code",
};

export type TextProps = ComponentProps<"p"> & VariantProps<typeof textVariants> & { as?: ElementType };

export function Text({ as, variant, tone, truncate, className, ...props }: TextProps) {
  const tag = as ?? defaultTag[variant ?? "body"] ?? "p";
  // eyebrow brings its own color; only override when a tone is passed.
  return createElement(tag, { className: cn(textVariants({ variant, tone: tone ?? (variant === "eyebrow" ? undefined : "default"), truncate }), className), ...props });
}

export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: ComponentProps<typeof Separator.Root> & { label?: string }) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cn("flex items-center gap-3", className)} role="separator" aria-label={label}>
        <span className="h-px flex-1 bg-border" />
        <span className="eyebrow">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return (
    <Separator.Root
      orientation={orientation}
      className={cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px self-stretch", className)}
      {...props}
    />
  );
}
