import { ContextMenu as CM, DropdownMenu as DM } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { IconCheck, IconChevronRight } from "./icons";
import { cn } from "../lib/cn";
import { Kbd } from "./kbd";

/*
  Dropdown menu and context menu share every item style. Items are 28px tall, 13px text,
  with an optional 14px icon and a right-aligned shortcut. Destructive items use the
  danger text color only — never a red fill — and should sit last, after a separator.
*/
const content =
  "z-(--z-dropdown) min-w-44 overflow-hidden rounded-lg bg-popover p-1 text-small text-foreground shadow-overlay " +
  "origin-(--radix-dropdown-menu-content-transform-origin) " +
  "data-[state=open]:animate-[keel-pop-in_var(--duration-fast)_var(--ease-out)] data-[state=closed]:animate-[keel-pop-out_var(--duration-instant)_var(--ease-in)]";

const item =
  "relative flex h-7 cursor-default select-none items-center gap-2 rounded-sm px-2 outline-none " +
  "data-highlighted:bg-hover data-disabled:pointer-events-none data-disabled:opacity-45 " +
  "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-icon";

const destructive = "text-danger data-highlighted:bg-danger-bg [&_svg]:text-danger";

type ItemExtras = { icon?: ReactNode; shortcut?: string; destructive?: boolean; inset?: boolean };

function ItemInner({ icon, shortcut, children }: ItemExtras & { children?: ReactNode }) {
  return (
    <>
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut && <Kbd className="ml-4 h-4 shadow-none bg-transparent text-faint px-0">{shortcut}</Kbd>}
    </>
  );
}

/* ---------- Dropdown menu ---------- */
export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export const DropdownMenuGroup = DM.Group;
export const DropdownMenuSub = DM.Sub;
export const DropdownMenuRadioGroup = DM.RadioGroup;

export function DropdownMenuContent({ className, sideOffset = 6, align = "start", ...props }: ComponentProps<typeof DM.Content>) {
  return (
    <DM.Portal>
      <DM.Content sideOffset={sideOffset} align={align} collisionPadding={8} className={cn(content, className)} {...props} />
    </DM.Portal>
  );
}

export function DropdownMenuItem({ className, icon, shortcut, destructive: d, inset, children, ...props }: ComponentProps<typeof DM.Item> & ItemExtras) {
  return (
    <DM.Item className={cn(item, d && destructive, inset && "pl-7.5", className)} {...props}>
      <ItemInner icon={icon} shortcut={shortcut}>{children}</ItemInner>
    </DM.Item>
  );
}

export function DropdownMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof DM.CheckboxItem>) {
  return (
    <DM.CheckboxItem className={cn(item, "pl-7.5", className)} onSelect={(e) => e.preventDefault()} {...props}>
      <span className="absolute left-2 inline-flex size-3.5 items-center justify-center">
        <DM.ItemIndicator><IconCheck /></DM.ItemIndicator>
      </span>
      {children}
    </DM.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof DM.RadioItem>) {
  return (
    <DM.RadioItem className={cn(item, "pl-7.5", className)} {...props}>
      <span className="absolute left-2 inline-flex size-3.5 items-center justify-center">
        <DM.ItemIndicator><IconCheck /></DM.ItemIndicator>
      </span>
      {children}
    </DM.RadioItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof DM.Label>) {
  return <DM.Label className={cn("eyebrow px-2 pt-2 pb-1.5", className)} {...props} />;
}
export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof DM.Separator>) {
  return <DM.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}
export function DropdownMenuSubTrigger({ className, icon, children, ...props }: ComponentProps<typeof DM.SubTrigger> & { icon?: ReactNode }) {
  return (
    <DM.SubTrigger className={cn(item, "data-[state=open]:bg-hover", className)} {...props}>
      {icon}
      <span className="flex-1">{children}</span>
      <IconChevronRight className="text-faint!" />
    </DM.SubTrigger>
  );
}
export function DropdownMenuSubContent({ className, ...props }: ComponentProps<typeof DM.SubContent>) {
  return (
    <DM.Portal>
      <DM.SubContent sideOffset={4} collisionPadding={8} className={cn(content, className)} {...props} />
    </DM.Portal>
  );
}

/* ---------- Context menu ---------- */
export const ContextMenu = CM.Root;
export const ContextMenuTrigger = CM.Trigger;
export function ContextMenuContent({ className, ...props }: ComponentProps<typeof CM.Content>) {
  return (
    <CM.Portal>
      <CM.Content collisionPadding={8} className={cn(content, "origin-(--radix-context-menu-content-transform-origin)", className)} {...props} />
    </CM.Portal>
  );
}
export function ContextMenuItem({ className, icon, shortcut, destructive: d, children, ...props }: ComponentProps<typeof CM.Item> & ItemExtras) {
  return (
    <CM.Item className={cn(item, d && destructive, className)} {...props}>
      <ItemInner icon={icon} shortcut={shortcut}>{children}</ItemInner>
    </CM.Item>
  );
}
export function ContextMenuSeparator({ className, ...props }: ComponentProps<typeof CM.Separator>) {
  return <CM.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}
export function ContextMenuLabel({ className, ...props }: ComponentProps<typeof CM.Label>) {
  return <CM.Label className={cn("eyebrow px-2 pt-2 pb-1.5", className)} {...props} />;
}
