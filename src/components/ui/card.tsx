import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

export function Card({ className, noPadding, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--brand-border)] bg-white",
        !noPadding && "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode
}

export function CardHeader({
  className,
  action,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        className
      )}
      {...props}
    >
      <h3 className="text-sm font-semibold text-[var(--brand-black)]">
        {children}
      </h3>
      {action}
    </div>
  )
}
