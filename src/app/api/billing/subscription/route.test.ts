import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const {
  requireVerifiedSessionMock,
  createAuditLogMock,
  getUserBillingStateMock,
  serializeBillingStateMock,
  cancelUserStripeSubscriptionMock,
  BillingAccessErrorMock,
  stripeMock,
  prismaMock,
} = vi.hoisted(() => ({
  requireVerifiedSessionMock: vi.fn(),
  createAuditLogMock: vi.fn(),
  getUserBillingStateMock: vi.fn(),
  serializeBillingStateMock: vi.fn((value) => value),
  cancelUserStripeSubscriptionMock: vi.fn(),
  BillingAccessErrorMock: class BillingAccessError extends Error {
    status: number;
    code: string;

    constructor(message: string, options?: { status?: number; code?: string }) {
      super(message);
      this.status = options?.status ?? 403;
      this.code = options?.code ?? "billing_access_denied";
    }
  },
  stripeMock: {
    billingPortal: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
  prismaMock: {
    store: {
      findUnique: vi.fn(),
    },
    product: {
      count: vi.fn(),
    },
    storeHero: {
      count: vi.fn(),
    },
  },
}));

vi.mock("@/lib/audit-log", () => ({
  createAuditLog: createAuditLogMock,
}));

vi.mock("@/lib/api-session", () => ({
  requireVerifiedSession: requireVerifiedSessionMock,
}));

vi.mock("@/lib/billing/subscription", () => ({
  BillingAccessError: BillingAccessErrorMock,
  cancelUserStripeSubscription: cancelUserStripeSubscriptionMock,
  getUserBillingState: getUserBillingStateMock,
  serializeBillingState: serializeBillingStateMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/lib/site-config", () => ({
  absoluteUrl: vi.fn((path: string) => `http://localhost:3000${path}`),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(() => stripeMock),
}));

import { DELETE, POST } from "@/app/api/billing/subscription/route";

function makeBillingState(options?: {
  effectivePlan?: "FREE" | "PREMIUM";
  isPremium?: boolean;
  subscription?: Record<string, unknown>;
}) {
  return {
    effectivePlan: options?.effectivePlan ?? "PREMIUM",
    isPremium: options?.isPremium ?? true,
    subscription: {
      plan: "PREMIUM",
      status: "ACTIVE",
      stripeCustomerId: "cus_123",
      currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ...options?.subscription,
    },
  };
}

describe("POST /api/billing/subscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: { id: "user_1" },
    });
    stripeMock.billingPortal.sessions.create.mockResolvedValue({
      url: "https://billing.stripe.com/p/session_123",
    });
  });

  it("cria uma sessao do Customer Portal para o customer do usuario", async () => {
    getUserBillingStateMock.mockResolvedValueOnce(makeBillingState());

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(stripeMock.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: "cus_123",
      return_url: "http://localhost:3000/admin/plans",
    });
    expect(body.portalUrl).toBe("https://billing.stripe.com/p/session_123");
  });

  it("retorna 404 quando nao existe assinatura premium para gerenciar", async () => {
    getUserBillingStateMock.mockResolvedValueOnce(
      makeBillingState({
        effectivePlan: "FREE",
        isPremium: false,
        subscription: {
          plan: "FREE",
          status: "INACTIVE",
          stripeCustomerId: null,
          currentPeriodEnd: null,
        },
      })
    );

    const response = await POST();

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Nenhuma assinatura Premium foi encontrada para gerenciamento.",
    });
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

describe("DELETE /api/billing/subscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireVerifiedSessionMock.mockResolvedValue({
      user: { id: "user_1" },
    });
    getUserBillingStateMock.mockResolvedValue(makeBillingState({
      subscription: {
        cancelAtPeriodEnd: true,
      },
    }));
  });

  it("cancela a renovacao e retorna o estado atualizado da assinatura", async () => {
    cancelUserStripeSubscriptionMock.mockResolvedValueOnce({});

    const response = await DELETE(new Request("http://localhost:3000/api/billing/subscription"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(cancelUserStripeSubscriptionMock).toHaveBeenCalledWith("user_1");
    expect(body.success).toBe(true);
    expect(body.billing.subscription.cancelAtPeriodEnd).toBe(true);
  });

  it("retorna erro de dominio quando nao existe assinatura para cancelar", async () => {
    cancelUserStripeSubscriptionMock.mockRejectedValueOnce(
      new BillingAccessErrorMock("Nenhuma assinatura encontrada.", {
        status: 404,
        code: "subscription_not_found",
      })
    );

    const response = await DELETE(new Request("http://localhost:3000/api/billing/subscription"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Nenhuma assinatura encontrada.",
      code: "subscription_not_found",
    });
  });
});
