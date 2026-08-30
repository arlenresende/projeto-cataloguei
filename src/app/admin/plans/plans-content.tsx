"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PlansContentProps = {
  billing: {
    effectivePlan: "FREE" | "PREMIUM";
    isPremium: boolean;
    subscription: {
      plan: "FREE" | "PREMIUM";
      status: string;
      currentPeriodEnd?: string | Date | null;
      canceledAt?: string | Date | null;
      cancelAtPeriodEnd?: boolean;
    };
    limits: {
      products: number | null;
      banners: number | null;
      productImages: number | null;
    };
    features: {
      removeBranding: boolean;
      advancedAnalytics: boolean;
      advancedCustomization: boolean;
      advancedSeo: boolean;
      customDomain: boolean;
      advancedSharing: boolean;
      premiumSupport: boolean;
      thinkTogether: boolean;
    };
  };
  usage: {
    products: number;
    activeBanners: number;
    images: number;
  };
  paymentSuccess: boolean;
};

const COMPARISON_ROWS = [
  ["Loja", "1", "1"],
  ["Produtos", "15", "Ilimitados"],
  ["URL própria", "Sim", "Sim"],
  ["Remover marca Cataloguei", "Nao", "Sim"],
  ["Analytics", "Basico", "Completo"],
  ["Banners", "2", "Ilimitados"],
  ["Personalizacao", "Basica", "Completa"],
  ["SEO avancado", "Nao", "Sim"],
  ["Dominio proprio", "Nao", "Sim"],
  ["Compartilhamento avancado", "Nao", "Sim"],
  ["Suporte", "Normal", "Prioritario"],
  ['Pensamos junto com voce?', "Nao", "Sim"],
] as const;

export function PlansContent({
  billing,
  usage,
  paymentSuccess,
}: PlansContentProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"subscribe" | "manage" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentSuccess || billing.isPremium) {
      return;
    }

    let refreshCount = 0;
    const interval = window.setInterval(() => {
      refreshCount += 1;
      router.refresh();

      if (refreshCount >= 10) {
        window.clearInterval(interval);
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [billing.isPremium, paymentSuccess, router]);

  async function handleSubscribe() {
    setError(null);
    setLoadingAction("subscribe");

    try {
      const response = await fetch("/api/billing/subscribe", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Nao foi possivel iniciar sua assinatura.");
        return;
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      router.refresh();
    } catch {
      setError("Erro de conexao ao iniciar a assinatura.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleManageSubscription() {
    setError(null);
    setLoadingAction("manage");

    try {
      const response = await fetch("/api/billing/subscription", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Nao foi possivel abrir o portal de assinatura.");
        return;
      }

      if (result.portalUrl) {
        window.location.href = result.portalUrl;
      }
    } catch {
      setError("Erro de conexao ao abrir o portal de assinatura.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos"
        subtitle="Gerencie seu plano atual e o upgrade para o Premium"
      />

      {paymentSuccess && billing.isPremium ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Assinatura Premium ativa.
        </div>
      ) : null}

      {paymentSuccess && !billing.isPremium ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Pagamento concluido. O acesso Premium sera confirmado assim que o Stripe sincronizar o status.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Plano atual</p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--brand-black)]">
                {billing.effectivePlan}
              </h2>
            </div>
            <Badge variant={billing.isPremium ? "default" : "neutral"}>
              {billing.subscription.status}
            </Badge>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[var(--brand-tertiary)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Produtos
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--brand-black)]">
                {usage.products}
                {billing.limits.products !== null ? ` / ${billing.limits.products}` : ""}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--brand-tertiary)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Banners ativos
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--brand-black)]">
                {usage.activeBanners}
                {billing.limits.banners !== null ? ` / ${billing.limits.banners}` : ""}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--brand-tertiary)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Imagens enviadas
              </p>
              <p className="mt-2 text-lg font-bold text-[var(--brand-black)]">
                {usage.images}
              </p>
            </div>
          </div>

          {billing.subscription.currentPeriodEnd ? (
            <p className="mt-5 text-sm text-muted-foreground">
              Proxima referencia:{" "}
              <strong className="text-[var(--brand-black)]">
                {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString("pt-BR")}
              </strong>
            </p>
          ) : null}

          {billing.subscription.cancelAtPeriodEnd ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Renovacao cancelada. Seu acesso Premium permanece ativo ate{" "}
              <strong className="text-[var(--brand-black)]">
                {billing.subscription.currentPeriodEnd
                  ? new Date(billing.subscription.currentPeriodEnd).toLocaleDateString("pt-BR")
                  : "o fim do periodo atual"}
              </strong>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {!billing.isPremium ? (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={loadingAction !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-black)] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loadingAction === "subscribe" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Crown className="size-4" />
                )}
                Assinar Premium
              </button>
            ) : (
              <button
                type="button"
                onClick={handleManageSubscription}
                disabled={loadingAction !== null}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--brand-border)] px-5 py-3 text-sm font-bold text-[var(--brand-black)] transition-colors hover:bg-[var(--brand-tertiary)] disabled:opacity-60"
              >
                {loadingAction === "manage" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Gerenciar assinatura
              </button>
            )}
          </div>
        </Card>

        <Card className="border-2 border-[var(--brand-black)] shadow-md">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-[var(--brand-yellow)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--brand-black)]">
              Premium
            </span>
            <Sparkles className="size-4 text-[var(--brand-black)]" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[var(--brand-black)]">
            R$ 24,90
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">por mes, recorrente</p>

          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {[
              "Produtos ilimitados",
              "Galeria com multiplas imagens por produto",
              "Banners ilimitados",
              "Remocao da marca Cataloguei",
              "SEO avancado e personalizacao completa",
              "Dominio proprio e recursos avancados",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-[var(--brand-black)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-[var(--brand-black)]">
          Comparativo de planos
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--brand-border)] text-left">
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Recurso</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Free</th>
                <th className="pb-3 font-semibold text-[var(--brand-black)]">Premium</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map(([feature, free, premium]) => (
                <tr
                  key={feature}
                  className="border-b border-[var(--brand-border)] last:border-b-0"
                >
                  <td className="py-3 font-medium text-[var(--brand-black)]">
                    {feature}
                  </td>
                  <td className="py-3 text-muted-foreground">{free}</td>
                  <td className="py-3 font-semibold text-[var(--brand-black)]">
                    {premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
