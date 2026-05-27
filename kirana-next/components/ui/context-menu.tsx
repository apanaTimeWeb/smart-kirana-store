import * as React from "react";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ItemProps = DivProps & { inset?: boolean; disabled?: boolean };
type CheckedItemProps = ItemProps & { checked?: boolean };

function ContextMenu({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
ContextMenuTrigger.displayName = "ContextMenuTrigger";

function ContextMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, ItemProps>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", inset && "pl-8", className)}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </div>
));
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg", className)} {...props} />
));
ContextMenuSubContent.displayName = "ContextMenuSubContent";

const ContextMenuContent = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />
));
ContextMenuContent.displayName = "ContextMenuContent";

const ContextMenuItem = React.forwardRef<HTMLDivElement, ItemProps>(({ className, inset, disabled, ...props }, ref) => (
  <div
    ref={ref}
    aria-disabled={disabled}
    className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground", disabled && "pointer-events-none opacity-50", inset && "pl-8", className)}
    {...props}
  />
));
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, CheckedItemProps>(({ className, children, checked, disabled, ...props }, ref) => (
  <div
    ref={ref}
    aria-checked={checked}
    aria-disabled={disabled}
    className={cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground", disabled && "pointer-events-none opacity-50", className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Check className="h-4 w-4" />}
    </span>
    {children}
  </div>
));
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, CheckedItemProps>(({ className, children, checked, disabled, ...props }, ref) => (
  <div
    ref={ref}
    aria-checked={checked}
    aria-disabled={disabled}
    className={cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground", disabled && "pointer-events-none opacity-50", className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {checked && <Circle className="h-4 w-4 fill-current" />}
    </span>
    {children}
  </div>
));
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

const ContextMenuLabel = React.forwardRef<HTMLDivElement, ItemProps>(({ className, inset, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)} {...props} />
));
ContextMenuLabel.displayName = "ContextMenuLabel";

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
ContextMenuSeparator.displayName = "ContextMenuSeparator";

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
);
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
