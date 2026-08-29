import "server-only";

import {
  BillingCycle,
  Plan,
  SubscriptionStatus,
  type Prisma,
  type Subscription,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  canUseFeature,
  getEffectivePlan,
  getPlanLimit,
  isPremiumSubscription,
  PREMIUM_MONTHLY_PRICE,
  type BillingFeature,
  type BillingLimit,
} from "@/lib/billing/plans";

export class BillingAccessError extends Error {
  status: number;
  code: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = "BillingAccessError";
    this.status = options?.status ?? 403;
    this.code = options?.code ?? "billing_access_denied";
  }
}

export type BillingState = {
  subscription: Subscription;
  effectivePlan: Plan;
  isPremium: boolean;
  canUseFeature: (feature: BillingFeature) => boolean;
  getLimit: (limit: BillingLimit) => number | null;
};

export type SerializedBillingState = {
  subscription: {
    id: string;
    userId: string;
    plan: Plan;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    price: number;
    asaasCustomerId: string | null;
    asaasSubscriptionId: string | null;
    asaasPaymentId: string | null;
    latestInvoiceUrl: string | null;
    latestPaymentStatus: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    canceledAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  effectivePlan: Plan;
  isPremium: boolean;
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

export async function ensureUserSubscription(userId: string) {
  return prisma.subscription.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      plan: Plan.FREE,
      status: SubscriptionStatus.INACTIVE,
      billingCycle: BillingCycle.MONTHLY,
      price: 0,
    },
  });
}

export async function getUserBillingState(userId: string): Promise<BillingState> {
  let subscription = await ensureUserSubscription(userId);

  if (
    subscription.status === SubscriptionStatus.ACTIVE &&
    subscription.canceledAt &&
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd.getTime() <= Date.now()
  ) {
    subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.CANCELED,
      },
    });
  }

  const effectivePlan = getEffectivePlan(subscription);

  return {
    subscription,
    effectivePlan,
    isPremium: isPremiumSubscription(subscription),
    canUseFeature: (feature) => canUseFeature(feature, subscription),
    getLimit: (limit) => getPlanLimit(limit, subscription),
  };
}

export function isPremium(
  subscription:
    | Pick<Subscription, "plan" | "status" | "canceledAt" | "currentPeriodEnd">
    | null
    | undefined
) {
  return isPremiumSubscription(subscription);
}

function serializeDate(value: Date | null) {
  return value ? value.toISOString() : null;
}

export function serializeBillingState(state: BillingState): SerializedBillingState {
  return {
    subscription: {
      id: state.subscription.id,
      userId: state.subscription.userId,
      plan: state.subscription.plan,
      status: state.subscription.status,
      billingCycle: state.subscription.billingCycle,
      price: Number(state.subscription.price),
      asaasCustomerId: state.subscription.asaasCustomerId,
      asaasSubscriptionId: state.subscription.asaasSubscriptionId,
      asaasPaymentId: state.subscription.asaasPaymentId,
      latestInvoiceUrl: state.subscription.latestInvoiceUrl,
      latestPaymentStatus: state.subscription.latestPaymentStatus,
      currentPeriodStart: serializeDate(state.subscription.currentPeriodStart),
      currentPeriodEnd: serializeDate(state.subscription.currentPeriodEnd),
      canceledAt: serializeDate(state.subscription.canceledAt),
      createdAt: state.subscription.createdAt.toISOString(),
      updatedAt: state.subscription.updatedAt.toISOString(),
    },
    effectivePlan: state.effectivePlan,
    isPremium: state.isPremium,
    limits: {
      products: state.getLimit("products"),
      banners: state.getLimit("banners"),
      productImages: state.getLimit("productImages"),
    },
    features: {
      removeBranding: state.canUseFeature("remove_branding"),
      advancedAnalytics: state.canUseFeature("advanced_analytics"),
      advancedCustomization: state.canUseFeature("advanced_customization"),
      advancedSeo: state.canUseFeature("advanced_seo"),
      customDomain: state.canUseFeature("custom_domain"),
      advancedSharing: state.canUseFeature("advanced_sharing"),
      premiumSupport: state.canUseFeature("premium_support"),
      thinkTogether: state.canUseFeature("think_together"),
    },
  };
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export async function assertCanCreateProduct(userId: string, storeId: string) {
  const billing = await getUserBillingState(userId);
  const limit = billing.getLimit("products");

  if (limit !== null) {
    const total = await prisma.product.count({ where: { storeId } });

    if (total >= limit) {
      throw new BillingAccessError(
        "Seu plano gratuito permite até 15 produtos. Faça upgrade para o Premium para cadastrar produtos ilimitados.",
        { code: "product_limit_reached" }
      );
    }
  }

  return billing;
}

export async function assertCanAddProductImage(
  userId: string,
  productId: string
) {
  const billing = await getUserBillingState(userId);
  const limit = billing.getLimit("productImages");

  if (limit !== null) {
    const total = await prisma.productImage.count({ where: { productId } });

    if (total >= limit) {
      throw new BillingAccessError(
        "Seu plano gratuito permite apenas 1 imagem por produto. Faça upgrade para o Premium para liberar galerias com múltiplas imagens.",
        { code: "product_image_limit_reached" }
      );
    }
  }

  return billing;
}

export async function assertCanCreateOrActivateBanner(
  userId: string,
  storeId: string
) {
  const billing = await getUserBillingState(userId);
  const limit = billing.getLimit("banners");

  if (limit !== null) {
    const total = await prisma.storeHero.count({
      where: { storeId, isActive: true },
    });

    if (total >= limit) {
      throw new BillingAccessError(
        "Seu plano gratuito permite até 2 banners ativos. Faça upgrade para o Premium para usar banners ilimitados.",
        { code: "banner_limit_reached" }
      );
    }
  }

  return billing;
}

export async function assertAdvancedSeoAccess(
  userId: string,
  input: { seoTitle?: string | null; seoDescription?: string | null }
) {
  if (!hasText(input.seoTitle) && !hasText(input.seoDescription)) {
    return getUserBillingState(userId);
  }

  const billing = await getUserBillingState(userId);

  if (!billing.canUseFeature("advanced_seo")) {
    throw new BillingAccessError(
      "SEO avançado é um recurso do Premium. No plano gratuito, a loja continua com SEO básico automático.",
      { code: "advanced_seo_required" }
    );
  }

  return billing;
}

export async function assertStoreCustomizationAccess(
  userId: string,
  input: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    hideCatalogueiBranding?: boolean;
  }
) {
  const needsAdvancedCustomization =
    hasText(input.primaryColor) || hasText(input.secondaryColor);

  const billing = await getUserBillingState(userId);

  if (
    needsAdvancedCustomization &&
    !billing.canUseFeature("advanced_customization")
  ) {
    throw new BillingAccessError(
      "Personalização avançada é exclusiva do Premium. No plano gratuito, use os temas básicos da loja.",
      { code: "advanced_customization_required" }
    );
  }

  if (
    input.hideCatalogueiBranding === true &&
    !billing.canUseFeature("remove_branding")
  ) {
    throw new BillingAccessError(
      "Remover a marca Cataloguei é um recurso exclusivo do Premium.",
      { code: "remove_branding_required" }
    );
  }

  return billing;
}

export async function syncAsaasCustomerId(userId: string, asaasCustomerId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { asaasCustomerId },
  });

  return prisma.subscription.update({
    where: { userId },
    data: { asaasCustomerId },
  });
}

export async function upsertPremiumSubscription(
  userId: string,
  input: {
    asaasCustomerId: string;
    asaasSubscriptionId: string;
    asaasPaymentId?: string | null;
    latestInvoiceUrl?: string | null;
    latestPaymentStatus?: string | null;
    currentPeriodEnd?: Date | null;
  }
) {
  await syncAsaasCustomerId(userId, input.asaasCustomerId);

  return prisma.subscription.update({
    where: { userId },
    data: {
      plan: Plan.PREMIUM,
      status: SubscriptionStatus.PENDING,
      billingCycle: BillingCycle.MONTHLY,
      price: PREMIUM_MONTHLY_PRICE,
      asaasCustomerId: input.asaasCustomerId,
      asaasSubscriptionId: input.asaasSubscriptionId,
      asaasPaymentId: input.asaasPaymentId ?? null,
      latestInvoiceUrl: input.latestInvoiceUrl ?? null,
      latestPaymentStatus: input.latestPaymentStatus ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      canceledAt: null,
    },
  });
}

export async function updateSubscriptionSnapshot(
  where: Prisma.SubscriptionWhereUniqueInput,
  data: Prisma.SubscriptionUncheckedUpdateInput
) {
  return prisma.subscription.update({
    where,
    data,
  });
}
