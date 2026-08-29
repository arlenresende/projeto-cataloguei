import { beforeEach, describe, expect, it, vi } from "vitest";
import { BillingCycle, SubscriptionStatus, type Subscription } from "@prisma/client";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    subscription: {
      upsert: vi.fn(),
      update: vi.fn(),
    },
    product: {
      count: vi.fn(),
    },
    productImage: {
      count: vi.fn(),
    },
    storeHero: {
      count: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  assertAdvancedSeoAccess,
  assertCanAddProductImage,
  assertCanCreateOrActivateBanner,
  assertCanCreateProduct,
  assertStoreCustomizationAccess,
} from "@/lib/billing/subscription";

function makeSubscription(
  overrides: Partial<Subscription> = {}
): Subscription {
  return {
    id: "sub_1",
    userId: "user_1",
    plan: "FREE",
    status: SubscriptionStatus.INACTIVE,
    billingCycle: BillingCycle.MONTHLY,
    price: 0 as unknown as Subscription["price"],
    asaasCustomerId: null,
    asaasSubscriptionId: null,
    asaasPaymentId: null,
    latestInvoiceUrl: null,
    latestPaymentStatus: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    canceledAt: null,
    createdAt: new Date("2026-08-28T10:00:00Z"),
    updatedAt: new Date("2026-08-28T10:00:00Z"),
    ...overrides,
  };
}

describe("billing subscription guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("permite criar o produto 1 no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());
    prismaMock.product.count.mockResolvedValue(0);

    await expect(assertCanCreateProduct("user_1", "store_1")).resolves.toMatchObject({
      effectivePlan: "FREE",
    });
  });

  it("permite criar o produto 15 no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());
    prismaMock.product.count.mockResolvedValue(14);

    await expect(assertCanCreateProduct("user_1", "store_1")).resolves.toMatchObject({
      effectivePlan: "FREE",
    });
  });

  it("bloqueia criar o produto 16 no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());
    prismaMock.product.count.mockResolvedValue(15);

    await expect(assertCanCreateProduct("user_1", "store_1")).rejects.toMatchObject({
      code: "product_limit_reached",
      status: 403,
    });
  });

  it("permite o produto 16 no PREMIUM", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(
      makeSubscription({
        plan: "PREMIUM",
        status: SubscriptionStatus.ACTIVE,
      })
    );
    prismaMock.product.count.mockResolvedValue(15);

    await expect(assertCanCreateProduct("user_1", "store_1")).resolves.toMatchObject({
      effectivePlan: "PREMIUM",
      isPremium: true,
    });
  });

  it("bloqueia segunda imagem do produto no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());
    prismaMock.productImage.count.mockResolvedValue(1);

    await expect(assertCanAddProductImage("user_1", "product_1")).rejects.toMatchObject({
      code: "product_image_limit_reached",
    });
  });

  it("permite multiplas imagens no PREMIUM", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(
      makeSubscription({
        plan: "PREMIUM",
        status: SubscriptionStatus.ACTIVE,
      })
    );
    prismaMock.productImage.count.mockResolvedValue(5);

    await expect(assertCanAddProductImage("user_1", "product_1")).resolves.toMatchObject({
      effectivePlan: "PREMIUM",
    });
  });

  it("bloqueia o terceiro banner ativo no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());
    prismaMock.storeHero.count.mockResolvedValue(2);

    await expect(assertCanCreateOrActivateBanner("user_1", "store_1")).rejects.toMatchObject({
      code: "banner_limit_reached",
    });
  });

  it("permite banners ilimitados no PREMIUM", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(
      makeSubscription({
        plan: "PREMIUM",
        status: SubscriptionStatus.ACTIVE,
      })
    );
    prismaMock.storeHero.count.mockResolvedValue(8);

    await expect(assertCanCreateOrActivateBanner("user_1", "store_1")).resolves.toMatchObject({
      effectivePlan: "PREMIUM",
    });
  });

  it("bloqueia SEO avancado no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());

    await expect(
      assertAdvancedSeoAccess("user_1", { seoTitle: "Titulo premium" })
    ).rejects.toMatchObject({
      code: "advanced_seo_required",
    });
  });

  it("permite SEO avancado no PREMIUM", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(
      makeSubscription({
        plan: "PREMIUM",
        status: SubscriptionStatus.ACTIVE,
      })
    );

    await expect(
      assertAdvancedSeoAccess("user_1", { seoDescription: "Descricao avançada" })
    ).resolves.toMatchObject({
      effectivePlan: "PREMIUM",
    });
  });

  it("bloqueia remocao de branding e customizacao avancada no FREE", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(makeSubscription());

    await expect(
      assertStoreCustomizationAccess("user_1", {
        primaryColor: "#1e1b4b",
        hideCatalogueiBranding: true,
      })
    ).rejects.toMatchObject({
      code: "advanced_customization_required",
    });
  });

  it("permite branding removido e customizacao avancada no PREMIUM", async () => {
    prismaMock.subscription.upsert.mockResolvedValue(
      makeSubscription({
        plan: "PREMIUM",
        status: SubscriptionStatus.ACTIVE,
      })
    );

    await expect(
      assertStoreCustomizationAccess("user_1", {
        primaryColor: "#1e1b4b",
        secondaryColor: "#facc15",
        hideCatalogueiBranding: true,
      })
    ).resolves.toMatchObject({
      effectivePlan: "PREMIUM",
    });
  });
});
