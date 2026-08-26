"use client";

import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import { StatsGrid } from "@/components/admin/stats-grid";

interface StatItem {
  title: string;
  value: string;
  subtitle: string;
  dark?: boolean;
}

interface DashboardContentProps {
  stats: StatItem[];
}

const platforms = [
  { name: "Produtos", value: "12", share: "40%", color: "bg-accent", icon: "P" },
  { name: "Visualizações", value: "1.234", share: "30%", color: "bg-foreground", icon: "V" },
  { name: "WhatsApp", value: "89", share: "22%", color: "bg-muted-foreground", icon: "W" },
  { name: "Conversão", value: "7.2%", share: "8%", color: "bg-accent", icon: "C" },
];

export function DashboardContent({ stats }: DashboardContentProps) {
  const [filter, setFilter] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button className="ml-auto flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full bg-accent" />
          Este mês
          <ChevronDown size={13} />
        </button>
      </div>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Visão geral</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="mt-2 flex items-baseline gap-2">
            <strong className="text-3xl">12</strong>
            <span className="rounded bg-accent px-2 py-1 text-[10px] font-bold">
              + 2
            </span>
            <span className="text-xs text-muted-foreground">
              produtos esta semana
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Atualizado agora{" "}
            <ChevronDown className="inline" size={12} />
          </p>
        </div>
        <button
          onClick={() => setFilter(!filter)}
          className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs sm:flex ${
            filter
              ? "bg-accent shadow-[2px_2px_0_var(--foreground)]"
              : "bg-card"
          }`}
        >
          <SlidersHorizontal size={14} /> Filtros
        </button>
      </div>

      <div className="mt-7 flex h-2 overflow-hidden rounded-full bg-muted">
        <span className="w-[40%] bg-accent" />
        <span className="w-[30%] bg-foreground" />
        <span className="w-[22%] bg-muted-foreground" />
        <span className="w-[8%] bg-border" />
      </div>

      <StatsGrid stats={stats} />

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.05fr_1.05fr_0.9fr]">
        <article className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Métricas</h2>
            <button className="rounded border border-border p-1.5">
              <MoreHorizontal size={15} />
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2.5 text-xs"
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full ${p.color} font-bold ${
                    p.color === "bg-foreground"
                      ? "text-background"
                      : "text-foreground"
                  }`}
                >
                  {p.icon}
                </span>
                <span className="flex-1">{p.name}</span>
                <strong>{p.value}</strong>
                <span className="w-8 text-right text-[10px] text-muted-foreground">
                  {p.share}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Visualizações{" "}
              <span className="font-normal text-muted-foreground">
                por período
              </span>
            </h2>
            <BarChart3 size={16} />
          </div>
          <div className="mt-6 flex h-36 items-end justify-center gap-2">
            {[55, 78, 92, 65, 44, 70, 100, 82].map((height, i) => (
              <div
                key={i}
                className={`w-8 rounded-t-md ${
                  i === 6
                    ? "bg-accent shadow-[2px_0_0_var(--foreground)]"
                    : "bg-muted-foreground/25"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Conversão</h2>
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold shadow-[2px_2px_0_var(--foreground)]">
              7.2%
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {[
              { name: "Cliques WhatsApp", value: "89" },
              { name: "Visualizações", value: "1.234" },
              { name: "Produtos", value: "12" },
            ].map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className={`size-6 rounded-full ${
                    ["bg-accent", "bg-foreground", "bg-muted-foreground"][i]
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
