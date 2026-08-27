import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-yellow)] text-[var(--brand-black)] hover:bg-[var(--brand-yellow-hover)] active:bg-[var(--brand-yellow-active)]",
        secondary:
          "bg-[var(--brand-black)] text-white hover:bg-[var(--brand-black-hover)]",
        outline:
          "border-[var(--brand-border)] bg-white text-[var(--brand-black)] hover:bg-[var(--brand-tertiary)]",
        ghost:
          "text-[var(--brand-black)] hover:bg-[var(--brand-tertiary)]",
        destructive:
          "bg-[var(--brand-error-light)] text-[var(--brand-error)] hover:bg-red-100",
        link: "text-[var(--brand-black)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4",
        sm: "h-8 gap-1.5 px-3 text-xs",
        lg: "h-10 gap-2 px-5",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={render ? false : undefined}
      render={render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
