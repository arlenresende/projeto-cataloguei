"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  PackageCheck,
  PackageX,
  SlidersHorizontal,
  Star,
  Tags,
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
  isAdmin?: boolean;
  stats: StatItem[];
  billing: {
    effectivePlan: "FREE" | "PREMIUM";
    subscription: {
      status: string;
      currentPeriodEnd?: string | Date | null;
    };
  } | null;
  catalog: {
    store: {
      name: string;
      slug: string;
      isActive: boolean;
      updatedAt: string;
    };
    totals: {
      totalProducts: number;
      activeProducts: number;
      inactiveProducts: number;
      featuredProducts: number;
      productsCreatedThisWeek: number;
      outOfStockProducts: number;
      lowStockProducts: number;
      productsWithoutImage: number;
      categories: number;
      activeBanners: number;
      totalBanners: number;
      totalImages: number;
      contactChannels: number;
      catalogHealth: number;
    };
    analytics: {
      periodLabel: string;
      totalViews: number;
      storeViews: number;
      productViews: number;
      categoryViews: number;
      linktreeViews: number;
      whatsappClicks: number;
      shareClicks: number;
      linktreeClicks: number;
      conversionRate: number;
      topProducts: Array<{ id: string; name: string; views: number }>;
      topCategories: Array<{ id: string; name: string; views: number }>;
    };
  } | null;
  adminOverview?: {
    stores: Array<{
      id: string;
      name: string;
      slug: string;
      isActive: boolean;
      ownerName: string;
      ownerEmail: string;
      plan: "FREE" | "PREMIUM";
      subscriptionStatus: string;
      products: number;
      categories: number;
      banners: number;
      createdAt: string;
    }>;
  } | null;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function DashboardContent({
  stats,
  billing,
  catalog,
  isAdmin = false,
  adminOverview = null,
}: DashboardContentProps) {
  const [filter, setFilter] = useState(false);
  const totals = catalog?.totals;
  const analytics = catalog?.analytics;
  const activePercent = totals
    ? getPercent(totals.activeProducts, totals.totalProducts)
    : 0;
  const inactivePercent = totals
    ? getPercent(totals.inactiveProducts, totals.totalProducts)
    : 0;
  const stockAttention = totals
    ? totals.outOfStockProducts + totals.lowStockProducts
    : 0;
  const stockAttentionPercent = totals
    ? getPercent(stockAttention, totals.totalProducts)
    : 0;
  const okStockPercent = Math.max(0, 100 - stockAttentionPercent);

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
            <strong className="text-3xl font-bold text-[var(--brand-black)]">
              {catalog ? formatNumber(catalog.totals.totalProducts) : stats[0]?.value ?? "0"}
            </strong>
            <Badge variant="default">
              {catalog
                ? `+ ${formatNumber(catalog.totals.productsCreatedThisWeek)}`
                : stats[0]?.subtitle ?? "Visão geral"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isAdmin ? "lojas cadastradas" : "produtos esta semana"}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {catalog
              ? `Loja ${catalog.store.isActive ? "ativa" : "inativa"} · ${catalog.store.name}`
              : isAdmin
                ? "Visão administrativa da plataforma"
              : "Nenhuma loja cadastrada"}{" "}
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
        <span
          className="bg-[var(--brand-yellow)]"
          style={{ width: `${activePercent}%` }}
        />
        <span
          className="bg-[var(--brand-black)]"
          style={{ width: `${stockAttentionPercent}%` }}
        />
        <span
          className="bg-muted-foreground"
          style={{ width: `${inactivePercent}%` }}
        />
      </div>

      <StatsGrid stats={stats} />

      {isAdmin && adminOverview ? (
        <Card className="mt-6">
          <CardHeader>Últimas lojas</CardHeader>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--brand-border)] text-left">
                  <th className="pb-3 font-semibold text-[var(--brand-black)]">Loja</th>
                  <th className="pb-3 font-semibold text-[var(--brand-black)]">Dono</th>
                  <th className="pb-3 font-semibold text-[var(--brand-black)]">Plano</th>
                  <th className="pb-3 font-semibold text-[var(--brand-black)]">Catálogo</th>
                  <th className="pb-3 font-semibold text-[var(--brand-black)]">Status</th>
                  <th className="pb-3 font-semibold text-[var(--brand-black)]">Criada em</th>
                </tr>
              </thead>
              <tbody>
                {adminOverview.stores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-b border-[var(--brand-border)] last:border-b-0"
                  >
                    <td className="py-3">
                      <Link
                        href={`/${store.slug}`}
                        target="_blank"
                        className="font-semibold text-[var(--brand-black)] hover:underline"
                      >
                        {store.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">/{store.slug}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      <span className="block text-[var(--brand-black)]">
                        {store.ownerName}
                      </span>
                      {store.ownerEmail}
                    </td>
                    <td className="py-3">
                      <Badge variant={store.plan === "PREMIUM" ? "default" : "neutral"}>
                        {store.plan}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {store.subscriptionStatus}
                      </p>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {store.products} produtos · {store.categories} categorias · {store.banners} banners
                    </td>
                    <td className="py-3">
                      <Badge variant={store.isActive ? "success" : "neutral"}>
                        {store.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(store.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {billing && !isAdmin ? (
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
            action={<Badge variant="neutral">{analytics?.periodLabel || "Sem dados"}</Badge>}
          >
            Alcance
          </CardHeader>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: "Views totais", value: analytics?.totalViews ?? 0 },
              { label: "Loja", value: analytics?.storeViews ?? 0 },
              { label: "Produtos", value: analytics?.productViews ?? 0 },
              { label: "Linktree", value: analytics?.linktreeViews ?? 0 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-[var(--brand-tertiary)] px-3 py-3"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <strong className="mt-1 block text-lg text-[var(--brand-black)]">
                  {formatNumber(item.value)}
                </strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            action={
              <Badge variant="default" className="font-bold">
                {analytics?.conversionRate ?? 0}%
              </Badge>
            }
          >
            Intenção de compra
          </CardHeader>
          <div className="mt-5 flex flex-col gap-4">
            {[
              {
                name: "Cliques WhatsApp",
                value: analytics?.whatsappClicks ?? 0,
                color: "bg-[var(--brand-yellow)]",
              },
              {
                name: "Compartilhamentos",
                value: analytics?.shareClicks ?? 0,
                color: "bg-[var(--brand-black)]",
              },
              {
                name: "Cliques no Linktree",
                value: analytics?.linktreeClicks ?? 0,
                color: "bg-muted-foreground",
              },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3 text-sm">
                <span className={`size-6 rounded-full ${item.color}`} />
                <span className="flex-1 text-[var(--brand-black)]">{item.name}</span>
                <strong className="text-[var(--brand-black)]">
                  {formatNumber(item.value)}
                </strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>Mais vistos</CardHeader>
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Produtos
            </p>
            {(analytics?.topProducts.length ? analytics.topProducts : []).map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg bg-[var(--brand-tertiary)] px-3 py-2.5 text-sm"
                >
                  <span className="flex-1 truncate text-[var(--brand-black)]">
                    {item.name}
                  </span>
                  <strong className="text-[var(--brand-black)]">
                    {formatNumber(item.views)}
                  </strong>
                </div>
              )
            )}
            {!analytics?.topProducts.length ? (
              <p className="rounded-lg bg-[var(--brand-tertiary)] px-3 py-3 text-sm text-muted-foreground">
                As visualizações de produtos aparecerão aqui.
              </p>
            ) : null}

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Categorias
            </p>
            {(analytics?.topCategories.length ? analytics.topCategories : []).map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg bg-[var(--brand-tertiary)] px-3 py-2.5 text-sm"
                >
                  <span className="flex-1 truncate text-[var(--brand-black)]">
                    {item.name}
                  </span>
                  <strong className="text-[var(--brand-black)]">
                    {formatNumber(item.views)}
                  </strong>
                </div>
              )
            )}
            {!analytics?.topCategories.length ? (
              <p className="rounded-lg bg-[var(--brand-tertiary)] px-3 py-3 text-sm text-muted-foreground">
                As visualizações de categorias aparecerão aqui.
              </p>
            ) : null}
          </div>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_1.05fr_0.9fr]">
        <Card>
          <CardHeader>Catálogo</CardHeader>
          <div className="mt-4 flex flex-col gap-2">
            {[
              {
                name: "Produtos ativos",
                value: totals ? formatNumber(totals.activeProducts) : "0",
                share: `${activePercent}%`,
                color: "bg-[var(--brand-yellow)]",
                icon: PackageCheck,
              },
              {
                name: "Produtos inativos",
                value: totals ? formatNumber(totals.inactiveProducts) : "0",
                share: `${inactivePercent}%`,
                color: "bg-muted-foreground",
                icon: PackageX,
              },
              {
                name: "Produtos em destaque",
                value: totals ? formatNumber(totals.featuredProducts) : "0",
                share: totals
                  ? `${getPercent(totals.featuredProducts, totals.totalProducts)}%`
                  : "0%",
                color: "bg-[var(--brand-black)]",
                icon: Star,
              },
              {
                name: "Categorias",
                value: totals ? formatNumber(totals.categories) : "0",
                share: "",
                color: "bg-[var(--brand-yellow)]",
                icon: Tags,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-lg bg-[var(--brand-tertiary)] px-3 py-2.5 text-sm"
              >
                <item.icon className="size-4 text-[var(--brand-black)]" />
                <span
                  className={`size-2 rounded-full ${item.color}`}
                  aria-hidden="true"
                />
                <span className="flex-1 text-[var(--brand-black)]">
                  {item.name}
                </span>
                <strong className="text-[var(--brand-black)]">
                  {item.value}
                </strong>
                <span
                  className="w-10 text-right text-xs text-muted-foreground"
                >
                  {item.share}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            action={<Badge variant="neutral">{okStockPercent}% ok</Badge>}
          >
            Estoque
          </CardHeader>
          <div className="mt-5 flex h-36 items-end justify-center gap-3">
            {[
              {
                label: "Saudável",
                value: okStockPercent,
                color: "bg-[var(--brand-yellow)]",
              },
              {
                label: "Baixo",
                value: totals
                  ? getPercent(totals.lowStockProducts, totals.totalProducts)
                  : 0,
                color: "bg-muted-foreground",
              },
              {
                label: "Zerado",
                value: totals
                  ? getPercent(totals.outOfStockProducts, totals.totalProducts)
                  : 0,
                color: "bg-[var(--brand-black)]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex h-full w-20 flex-col items-center justify-end gap-2"
              >
                <div
                  className={`w-10 rounded-t-md ${item.color}`}
                  style={{ height: `${Math.max(item.value, 4)}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            action={
              <Badge variant="default" className="font-bold">
                {totals ? `${totals.catalogHealth}%` : "0%"}
              </Badge>
            }
          >
            Saúde da loja
          </CardHeader>
          <div className="mt-5 flex flex-col gap-4">
            {[
              {
                name: "Banners ativos",
                value: totals
                  ? `${formatNumber(totals.activeBanners)} / ${formatNumber(totals.totalBanners)}`
                  : "0 / 0",
              },
              {
                name: "Produtos sem imagem",
                value: totals ? formatNumber(totals.productsWithoutImage) : "0",
              },
              {
                name: "Canais de contato",
                value: totals ? formatNumber(totals.contactChannels) : "0",
              },
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
