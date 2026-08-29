import { describe, expect, it } from "vitest";
import { SubscriptionStatus, type Subscription } from "@prisma/client";
import {
  canUseFeature,
  getEffectivePlan,
  getPlanLimit,
  isPremiumSubscription,
} from "@/lib/billing/plans";

function makeSubscription(
  overrides: Partial<
    Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
  > = {}
) {
  return {
    plan: "FREE",
    status: SubscriptionStatus.INACTIVE,
    canceledAt: null,
    currentPeriodEnd: null,
    ...overrides,
  } satisfies Pick<
    Subscription,
    "plan" | "status" | "canceledAt" | "currentPeriodEnd"
  >;
}

describe("billing plan helpers", () => {
  it("mantem usuario FREE quando a assinatura nao esta ativa", () => {
    const subscription = makeSubscription({
      plan: "PREMIUM",
      status: SubscriptionStatus.PENDING,
    });

    expect(getEffectivePlan(subscription)).toBe("FREE");
    expect(isPremiumSubscription(subscription)).toBe(false);
  });

  it("libera Premium somente para assinatura ativa", () => {
    const subscription = makeSubscription({
      plan: "PREMIUM",
      status: SubscriptionStatus.ACTIVE,
    });

    expect(getEffectivePlan(subscription)).toBe("PREMIUM");
    expect(isPremiumSubscription(subscription)).toBe(true);
  });

  it("faz downgrade para FREE quando o periodo cancelado ja expirou", () => {
    const subscription = makeSubscription({
      plan: "PREMIUM",
      status: SubscriptionStatus.ACTIVE,
      canceledAt: new Date("2026-08-01T10:00:00Z"),
      currentPeriodEnd: new Date("2026-08-10T10:00:00Z"),
    });

    expect(getEffectivePlan(subscription)).toBe("FREE");
  });

  it("mantem acesso Premium ate o fim do periodo pago apos cancelamento", () => {
    const subscription = makeSubscription({
      plan: "PREMIUM",
      status: SubscriptionStatus.ACTIVE,
      canceledAt: new Date("2026-08-20T10:00:00Z"),
      currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    expect(getEffectivePlan(subscription)).toBe("PREMIUM");
  });

  it("retorna limites corretos para FREE e PREMIUM", () => {
    const freeSubscription = makeSubscription();
    const premiumSubscription = makeSubscription({
      plan: "PREMIUM",
      status: SubscriptionStatus.ACTIVE,
    });

    expect(getPlanLimit("products", freeSubscription)).toBe(15);
    expect(getPlanLimit("banners", freeSubscription)).toBe(2);
    expect(getPlanLimit("productImages", freeSubscription)).toBe(1);

    expect(getPlanLimit("products", premiumSubscription)).toBeNull();
    expect(getPlanLimit("banners", premiumSubscription)).toBeNull();
    expect(getPlanLimit("productImages", premiumSubscription)).toBeNull();
  });

  it("controla features premium por feature flag centralizada", () => {
    const freeSubscription = makeSubscription();
    const premiumSubscription = makeSubscription({
      plan: "PREMIUM",
      status: SubscriptionStatus.ACTIVE,
    });

    expect(canUseFeature("advanced_seo", freeSubscription)).toBe(false);
    expect(canUseFeature("custom_domain", freeSubscription)).toBe(false);
    expect(canUseFeature("remove_branding", freeSubscription)).toBe(false);

    expect(canUseFeature("advanced_seo", premiumSubscription)).toBe(true);
    expect(canUseFeature("custom_domain", premiumSubscription)).toBe(true);
    expect(canUseFeature("remove_branding", premiumSubscription)).toBe(true);
    expect(canUseFeature("advanced_analytics", premiumSubscription)).toBe(true);
    expect(canUseFeature("advanced_sharing", premiumSubscription)).toBe(true);
    expect(canUseFeature("think_together", premiumSubscription)).toBe(true);
  });
});
