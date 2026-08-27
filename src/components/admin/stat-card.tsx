import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}

export function StatCard({ title, children, dark = false }: StatCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border p-5",
        dark
          ? "border-[var(--brand-black)] bg-[var(--brand-black)] text-white"
          : "border-[var(--brand-border)] bg-white"
      )}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className={dark ? "text-white/60" : ""}>{title}</span>
        <button
          className={cn(
            "rounded-md p-1 transition-colors",
            dark
              ? "hover:bg-white/10"
              : "hover:bg-[var(--brand-tertiary)]"
          )}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      {children}
    </article>
  );
}
