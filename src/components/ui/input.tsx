import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export function Input({
  className,
  label,
  error,
  helperText,
  icon,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 text-sm text-[var(--brand-black)] transition-colors placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10 disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            error && "border-[var(--brand-error)] focus:border-[var(--brand-error)] focus:ring-[var(--brand-error)]/10",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[var(--brand-error)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({
  className,
  label,
  error,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-[var(--brand-black)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[var(--brand-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--brand-black)] transition-colors placeholder:text-muted-foreground focus:border-[var(--brand-black)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-black)]/10 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          error && "border-[var(--brand-error)]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-[var(--brand-error)]">{error}</p>
      )}
    </div>
  )
}
