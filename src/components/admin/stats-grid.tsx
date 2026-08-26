import { StatCard } from "./stat-card";

interface StatItem {
  title: string;
  value: string;
  subtitle: string;
  dark?: boolean;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="mt-5 grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} title={stat.title} dark={stat.dark}>
          <p className="mt-5 text-xl font-bold">{stat.value}</p>
          <p
            className={`mt-1 text-[11px] ${
              stat.dark ? "text-background/70" : "text-muted-foreground"
            }`}
          >
            {stat.subtitle}
          </p>
        </StatCard>
      ))}
    </section>
  );
}
