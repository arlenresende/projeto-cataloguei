import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = DrawerPrimitive.Root

const SheetTrigger = DrawerPrimitive.Trigger

const SheetClose = DrawerPrimitive.Close

function SheetPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
        "data-[open]:animate-in data-[open]:fade-in-0 data-[open]:duration-300",
        "data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:duration-200",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DrawerPrimitive.Popup
        className={cn(
          "fixed bottom-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-white shadow-xl outline-none",
          "data-[open]:animate-in data-[open]:slide-in-from-right data-[open]:duration-300 data-[open]:ease-out",
          "data-[closed]:animate-out data-[closed]:slide-out-to-right data-[closed]:duration-200 data-[closed]:ease-in",
          className
        )}
        {...props}
      >
        {children}
        <DrawerPrimitive.Close
          className="absolute right-4 top-4 rounded-lg p-1.5 opacity-50 transition-all hover:bg-black/5 hover:opacity-100"
        >
          <X size={18} />
          <span className="sr-only">Fechar</span>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 p-6 pb-4", className)} {...props} />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-lg font-extrabold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-sm font-medium opacity-60", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
