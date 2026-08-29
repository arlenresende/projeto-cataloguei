"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronDown,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import { StatsGrid } from "@/components/admin/stats-grid";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StatItem {
  title: string;
  value: string;
  subtitle: string;
  dark?: boolean;
}

interface DashboardContentProps {
  stats: StatItem[];
  billing: {
    effectivePlan: "FREE" | "PREMIUM";
    subscription: {
      status: string;
      currentPeriodEnd?: string | Date | null;
    };
  } | null;
}

const platforms = [
  { name: "Produtos", value: "12", share: "40%", color: "bg-[var(--brand-yellow)]", icon: "P" },
  { name: "Visualizações", value: "1.234", share: "30%", color: "bg-[var(--brand-black)]", icon: "V" },
  { name: "WhatsApp", value: "89", share: "22%", color: "bg-muted-foreground", icon: "W" },
  { name: "Conversão", value: "7.2%", share: "8%", color: "bg-[var(--brand-yellow)]", icon: "C" },
];

export function DashboardContent({ stats, billing }: DashboardContentProps) {
  const [filter, setFilter] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button className="ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[var(--brand-tertiary-hover)]">
          <span className="size-2 rounded-full bg-[var(--brand-yellow)]" />
          Este mês
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Visão geral</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--brand-black)]">
            Dashboard
          </h1>
          <div className="mt-3 flex items-baseline gap-2">
            <strong className="text-3xl font-bold text-[var(--brand-black)]">12</strong>
            <Badge variant="default">+ 2</Badge>
            <span className="text-sm text-muted-foreground">
              produtos esta semana
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Atualizado agora{" "}
            <ChevronDown className="inline" size={12} />
          </p>
        </div>
        <Button
          variant={filter ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(!filter)}
          className="hidden sm:flex"
        >
          <SlidersHorizontal size={14} /> Filtros
        </Button>
      </div>

      <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-[var(--brand-tertiary)]">
        <span className="w-[40%] bg-[var(--brand-yellow)]" />
        <span className="w-[30%] bg-[var(--brand-black)]" />
        <span className="w-[22%] bg-muted-foreground" />
        <span className="w-[8%] bg-[var(--brand-border)]" />
      </div>

      <StatsGrid stats={stats} />

      {billing ? (
        <Card className="mt-6">
          <CardHeader
            action={
              <Badge variant={billing.effectivePlan === "PREMIUM" ? "default" : "neutral"}>
                {billing.effectivePlan}
              </Badge>
            }
          >
            Plano atual
          </CardHeader>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p>
                Status da assinatura:{" "}
                <strong className="text-[var(--brand-black)]">
                  {billing.subscription.status}
                </strong>
              </p>
              {billing.subscription.currentPeriodEnd ? (
                <p className="mt-1">
                  Próxima referência:{" "}
                  <strong className="text-[var(--brand-black)]">
                    {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
                  </strong>
                </p>
              ) : null}
            </div>
            <Link
              href="/admin/plans"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-black)] px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90"
            >
              {billing.effectivePlan === "PREMIUM"
                ? "Gerenciar assinatura"
                : "Fazer upgrade"}
            </Link>
          </div>
        </Card>
      ) : null}

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_1.05fr_0.9fr]">
        <Card>
          <CardHeader
            action={
              <button className="rounded-md border border-[var(--brand-border)] p-1.5 transition-colors hover:bg-[var(--brand-tertiary)]">
                <MoreHorizontal size={15} />
              </button>
            }
          >
            Métricas
          </CardHeader>
          <div className="mt-4 flex flex-col gap-2">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 rounded-lg bg-[var(--brand-tertiary)] px-3 py-2.5 text-sm"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full ${p.color} text-xs font-bold ${
                    p.color === "bg-[var(--brand-black)]"
                      ? "text-white"
                      : "text-[var(--brand-black)]"
                  }`}
                >
                  {p.icon}
                </span>
                <span className="flex-1 text-[var(--brand-black)]">{p.name}</span>
                <strong className="text-[var(--brand-black)]">{p.value}</strong>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {p.share}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            action={<BarChart3 size={16} className="text-muted-foreground" />}
          >
            Visualizações{" "}
            <span className="font-normal text-muted-foreground">
              por período
            </span>
          </CardHeader>
          <div className="mt-5 flex h-36 items-end justify-center gap-2">
            {[55, 78, 92, 65, 44, 70, 100, 82].map((height, i) => (
              <div
                key={i}
                className={`w-8 rounded-t-md transition-colors ${
                  i === 6
                    ? "bg-[var(--brand-yellow)]"
                    : "bg-[var(--brand-tertiary-hover)]"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
          </div>
        </Card>

        <Card>
          <CardHeader
            action={
              <Badge variant="default" className="font-bold">
                7.2%
              </Badge>
            }
          >
            Conversão
          </CardHeader>
          <div className="mt-5 flex flex-col gap-4">
            {[
              { name: "Cliques WhatsApp", value: "89" },
              { name: "Visualizações", value: "1.234" },
              { name: "Produtos", value: "12" },
            ].map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className={`size-6 rounded-full ${
                    ["bg-[var(--brand-yellow)]", "bg-[var(--brand-black)]", "bg-muted-foreground"][i]
                  }`}
                />
                <span className="flex-1 text-[var(--brand-black)]">{item.name}</span>
                <strong className="text-[var(--brand-black)]">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
