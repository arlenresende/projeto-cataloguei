import type { Plan, Subscription, SubscriptionStatus } from "@prisma/client";

export type BillingFeature =
  | "remove_branding"
  | "advanced_analytics"
  | "advanced_customization"
  | "advanced_seo"
  | "custom_domain"
  | "advanced_sharing"
  | "premium_support"
  | "think_together";

export type BillingLimit = "products" | "banners" | "productImages";

type PlanConfig = {
  price: number;
  features: Record<BillingFeature, boolean>;
  limits: Record<BillingLimit, number | null>;
};

export const PREMIUM_MONTHLY_PRICE = 24.9;
export const PREMIUM_CURRENCY_LABEL = "R$ 24,90/mês";

const PLAN_CONFIG: Record<Plan, PlanConfig> = {
  FREE: {
    price: 0,
    features: {
      remove_branding: false,
      advanced_analytics: false,
      advanced_customization: false,
      advanced_seo: false,
      custom_domain: false,
      advanced_sharing: false,
      premium_support: false,
      think_together: false,
    },
    limits: {
      products: 15,
      banners: 2,
      productImages: 1,
    },
  },
  PREMIUM: {
    price: PREMIUM_MONTHLY_PRICE,
    features: {
      remove_branding: true,
      advanced_analytics: true,
      advanced_customization: true,
      advanced_seo: true,
      custom_domain: true,
      advanced_sharing: true,
      premium_support: true,
      think_together: true,
    },
    limits: {
      products: null,
      banners: null,
      productImages: null,
    },
  },
};

export function isSubscriptionActiveStatus(status: SubscriptionStatus) {
  return status === "ACTIVE";
}

export function getEffectivePlan(
  subscription:
    | Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
    | null
    | undefined
): Plan {
  if (!subscription) {
    return "FREE";
  }

  const currentPeriodEnd = subscription.currentPeriodEnd;

  const canceledPeriodExpired =
    Boolean(subscription.canceledAt) &&
    currentPeriodEnd !== null &&
    currentPeriodEnd.getTime() <= Date.now();

  if (canceledPeriodExpired) {
    return "FREE";
  }

  return subscription.plan === "PREMIUM" && isSubscriptionActiveStatus(subscription.status)
    ? "PREMIUM"
    : "FREE";
}

export function isPremiumSubscription(
  subscription:
    | Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
    | null
    | undefined
) {
  return getEffectivePlan(subscription) === "PREMIUM";
}

export function canUseFeature(
  feature: BillingFeature,
  subscription:
    | Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
    | null
    | undefined
) {
  const effectivePlan = getEffectivePlan(subscription);
  return PLAN_CONFIG[effectivePlan].features[feature];
}

export function getPlanLimit(
  limit: BillingLimit,
  subscription:
    | Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
    | null
    | undefined
) {
  const effectivePlan = getEffectivePlan(subscription);
  return PLAN_CONFIG[effectivePlan].limits[limit];
}

export function getPlanPrice(plan: Plan) {
  return PLAN_CONFIG[plan].price;
}
