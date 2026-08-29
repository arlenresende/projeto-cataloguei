import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const {
  requireVerifiedSessionMock,
  getUserBillingStateMock,
  serializeBillingStateMock,
  ensureStripeCustomerForUserMock,
  stripeMock,
  prismaMock,
} = vi.hoisted(() => ({
  requireVerifiedSessionMock: vi.fn(),
  getUserBillingStateMock: vi.fn(),
  serializeBillingStateMock: vi.fn((value) => value),
  ensureStripeCustomerForUserMock: vi.fn(),
  stripeMock: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/api-session", () => ({
  requireVerifiedSession: requireVerifiedSessionMock,
}));

vi.mock("@/lib/billing/subscription", () => ({
  getUserBillingState: getUserBillingStateMock,
  serializeBillingState: serializeBillingStateMock,
}));

vi.mock("@/lib/billing/stripe", () => ({
  ensureStripeCustomerForUser: ensureStripeCustomerForUserMock,
  STRIPE_PREMIUM_SUBSCRIPTION_METADATA: {
    plan: "PREMIUM",
    billingCycle: "MONTHLY",
    price: "24.9",
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/site-config", () => ({
  absoluteUrl: vi.fn((path: string) => `http://localhost:3000${path}`),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => stripeMock),
  getStripePremiumPriceId: vi.fn(() => "price_premium"),
}));

import { POST } from "@/app/api/billing/subscribe/route";

function makeBillingState(overrides: Record<string, unknown> = {}) {
  return {
    effectivePlan: "FREE",
    isPremium: overrides.isPremium ?? false,
    subscription: {
      plan: "FREE",
      status: "INACTIVE",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      ...overrides,
    },
  };
}

describe("POST /api/billing/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: {
        id: "user_1",
        name: "Arlen",
        email: "arlen@example.com",
      },
    });
    prismaMock.user.findUnique.mockResolvedValue({
      stripeCustomerId: null,
    });
    ensureStripeCustomerForUserMock.mockResolvedValue("cus_123");
    stripeMock.checkout.sessions.create.mockResolvedValue({
      url: "https://checkout.stripe.com/c/session_123",
    });
  });

  it("cria uma Checkout Session de assinatura Premium", async () => {
    getUserBillingStateMock
      .mockResolvedValueOnce(makeBillingState())
      .mockResolvedValueOnce(makeBillingState({ stripeCustomerId: "cus_123" }));

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(ensureStripeCustomerForUserMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user_1",
        email: "arlen@example.com",
      })
    );
    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer: "cus_123",
        line_items: [{ price: "price_premium", quantity: 1 }],
        success_url: "http://localhost:3000/admin/plans?payment=success",
        cancel_url: "http://localhost:3000/admin/plans?payment=canceled",
      })
    );
    expect(body.checkoutUrl).toBe("https://checkout.stripe.com/c/session_123");
  });

  it("retorna 409 quando o Premium ja esta ativo", async () => {
    getUserBillingStateMock.mockResolvedValueOnce(
      makeBillingState({ isPremium: true, plan: "PREMIUM", status: "ACTIVE" })
    );

    const response = await POST();

    expect(response.status).toBe(409);
    expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("retorna a resposta de sessao quando o usuario nao esta autorizado", async () => {
    requireVerifiedSessionMock.mockResolvedValueOnce(
      NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    );

    const response = await POST();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Nao autenticado" });
  });
});
