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
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} title={stat.title} dark={stat.dark}>
          <p className="mt-4 text-2xl font-bold">{stat.value}</p>
          <p
            className={`mt-1 text-xs ${
              stat.dark ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            {stat.subtitle}
          </p>
        </StatCard>
      ))}
    </section>
  );
}
