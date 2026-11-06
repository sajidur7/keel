import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

/*
  Why the shadows: Keel buttons are flat rectangles with a single 1px top highlight
  (shadow-raised). That tiny highlight is what makes a button read as "pressable"
  without gradients or a colored fill. Primary is the only filled-bright button.
*/
export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5",
    "whitespace-nowrap rounded-md font-medium leading-none outline-none",
    "transition-[background-color,color,box-shadow,transform] duration-fast ease-out",
    "focus-visible:shadow-focus active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-raised-primary hover:bg-primary-hover [&_svg]:text-primary-foreground",
        secondary: "bg-card text-foreground shadow-raised hover:bg-muted [&_svg]:text-icon",
        muted: "bg-muted text-foreground hover:bg-line-strong [&_svg]:text-icon",
        subtle: "bg-hover text-foreground hover:bg-selected [&_svg]:text-icon",
        ghost: "text-soft hover:bg-hover hover:text-foreground [&_svg]:text-icon data-[state=open]:bg-hover",
        link: "h-auto! rounded-xs px-0! text-foreground underline decoration-line-strong underline-offset-[3px] hover:decoration-foreground active:translate-y-0",
        danger: "bg-danger-solid text-danger-foreground shadow-raised-primary hover:bg-danger-solid-hover",
        "danger-ghost": "text-danger hover:bg-danger-bg",
      },
      size: {
        xs: "h-[22px] px-2 text-caption [&_svg]:size-3",
        sm: "h-[26px] px-2.5 text-caption [&_svg]:size-3.5",
        md: "h-[30px] px-3 text-small [&_svg]:size-3.5",
        lg: "h-9 px-4 text-body [&_svg]:size-4",
        "icon-xs": "size-[22px] p-0 [&_svg]:size-3",
        "icon-sm": "size-[26px] p-0 [&_svg]:size-3.5",
        icon: "size-[30px] p-0 [&_svg]:size-4",
        "icon-lg": "size-9 p-0 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child element (e.g. a router Link) with button styles. */
    asChild?: boolean;
    /** Shows a spinner, keeps the button's width, sets aria-busy and blocks clicks. */
    loading?: boolean;
    /** Icon before the label. */
    leading?: ReactNode;
    /** Icon or kbd after the label. */
    trailing?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild, loading, leading, trailing, children, disabled, type = "button", onClick, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size }), loading && "cursor-progress", className);

  if (asChild) {
    return (
      <Slot.Root ref={ref} className={classes} onClick={onClick} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...props}
      onClick={loading ? undefined : onClick}
    >
      {/* Content stays in the layout while loading so the width never jumps. */}
      <span className={cn("inline-flex items-center gap-1.5", loading && "invisible")}>
        {leading}
        {children}
        {trailing}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size={size === "lg" || size === "icon-lg" ? 16 : 14} label="" />
        </span>
      )}
    </button>
  );
});

/** A row of buttons. `attached` joins them into a single segmented control. */
export function ButtonGroup({
  attached,
  className,
  ...props
}: ComponentProps<"div"> & { attached?: boolean }) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center",
        attached
          ? "rounded-md shadow-raised [&>*]:rounded-none [&>*]:shadow-none [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*+*]:border-l [&>*+*]:border-border"
          : "gap-2",
        className,
      )}
      {...props}
    />
  );
}

/** Square, icon-only button. `label` is required so screen readers can name it. */
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "leading" | "trailing" | "size"> & {
    label: string;
    size?: "xs" | "sm" | "md" | "lg";
  }
>(function IconButton({ label, size = "md", variant = "ghost", children, ...props }, ref) {
  const map = { xs: "icon-xs", sm: "icon-sm", md: "icon", lg: "icon-lg" } as const;
  return (
    <Button ref={ref} aria-label={label} title={label} variant={variant} size={map[size]} {...props}>
      {children}
    </Button>
  );
});
