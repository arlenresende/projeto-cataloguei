import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4", className)}>
      <div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--brand-black)]">
          {title}
        </h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
