import type { Plan, Subscription, SubscriptionStatus } from "@prisma/client";

export const PAYMENT_FAILURE_GRACE_PERIOD_DAYS = 3;

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

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function getPremiumAccessEndsAt(
  subscription:
    | Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
    | null
    | undefined
) {
  if (!subscription?.currentPeriodEnd) {
    return null;
  }

  if (subscription.status === "OVERDUE") {
    return addDays(
      subscription.currentPeriodEnd,
      PAYMENT_FAILURE_GRACE_PERIOD_DAYS
    );
  }

  return subscription.currentPeriodEnd;
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

  if (subscription.plan !== "PREMIUM") {
    return "FREE";
  }

  if (
    subscription.status !== "ACTIVE" &&
    subscription.status !== "OVERDUE"
  ) {
    return "FREE";
  }

  const accessEndsAt = getPremiumAccessEndsAt(subscription);
  if (subscription.status === "OVERDUE" && accessEndsAt === null) {
    return "FREE";
  }

  const accessExpired =
    accessEndsAt !== null && accessEndsAt.getTime() <= Date.now();

  return accessExpired ? "FREE" : "PREMIUM";
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
