import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border px-4 text-sm font-semibold outline-none transition-all focus:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon data-slot="select-icon">
        <ChevronDown size={16} className="opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner sideOffset={4} className="z-50">
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "max-h-60 overflow-y-auto rounded-xl border bg-white p-1 shadow-lg outline-none",
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-colors hover:bg-[var(--brand-tertiary)]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="size-4 shrink-0">
        <Check size={14} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

const SelectValue = SelectPrimitive.Value

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
