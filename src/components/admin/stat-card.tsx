import { MoreHorizontal } from "lucide-react";

interface StatCardProps {
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}

export function StatCard({ title, children, dark = false }: StatCardProps) {
  return (
    <article
      className={`rounded-xl border border-border p-4 ${
        dark ? "bg-foreground text-background" : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className={dark ? "text-background/70" : ""}>{title}</span>
        <MoreHorizontal size={16} />
      </div>
      {children}
    </article>
  );
}
