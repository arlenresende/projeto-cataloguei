import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-yellow-light)] text-[var(--brand-black)]",
        success:
          "bg-[var(--brand-success-light)] text-[var(--brand-success)]",
        error:
          "bg-[var(--brand-error-light)] text-[var(--brand-error)]",
        warning:
          "bg-[var(--brand-warning-light)] text-[var(--brand-warning)]",
        neutral:
          "bg-[var(--brand-tertiary)] text-[var(--brand-black)]",
        dark:
          "bg-[var(--brand-black)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { badgeVariants }
